import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Submission } from "../models/submission.models.js";
import { Bug } from "../models/bug.models.js";
import { User } from "../models/user.models.js";

// Submit a solution for a bug
const submitSolution = asyncHandler(async (req, res) => {
  const { bugId } = req.params;
  const { description, proofLink } = req.body;

  // 1. Basic ID Validation
  if (!mongoose.Types.ObjectId.isValid(bugId)) {
    throw new ApiError(400, "Invalid bug ID");
  }

  // 2. Resource Existence & State Check
  const bug = await Bug.findById(bugId);
  if (!bug) {
    throw new ApiError(404, "Bug not found");
  }

  // 3. Status Check: Cannot submit to CLOSED bugs
  if (bug.status === "CLOSED") {
    throw new ApiError(400, "Cannot submit solution to a closed bug");
  }

  // 4. Permission Check: Creator cannot submit to their own bug
  if (bug.creator.toString() === req.user._id.toString()) {
    throw new ApiError(
      403,
      "Bug creators cannot submit solutions to their own bugs",
    );
  }

  // 5. Input Validation
  if (!description?.trim() || !proofLink?.trim()) {
    throw new ApiError(400, "Description and a valid proof link are required");
  }

  // Simple URL Validation for proofLink
  const urlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  if (!urlPattern.test(proofLink)) {
    throw new ApiError(400, "Please provide a valid URL for the proof link");
  }

  try {
    // 6. Create Submission
    const submission = await Submission.create({
      bug: bugId,
      user: req.user._id,
      description: description.trim(),
      proofLink: proofLink.trim(),
    });

    // 7. Dynamic Status Update: Move from OPEN to IN_REVIEW on first submission
    if (bug.status === "OPEN") {
      bug.status = "IN_REVIEW";
      await bug.save();
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { submission, bugStatus: bug.status },
          "Solution submitted successfully. Bug is now In Review.",
        ),
      );
  } catch (err) {
    // 8. Handle Duplicate Submissions using the unique index
    if (err.code === 11000) {
      throw new ApiError(
        409,
        "You have already submitted a solution for this bug",
      );
    }
    throw err;
  }
});

// Approve a submission (only bug creator)
const approveSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(submissionId)) {
    throw new ApiError(400, "Invalid submission ID");
  }

  const submission = await Submission.findById(submissionId);

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  const bug = await Bug.findById(submission.bug);

  if (!bug) {
    throw new ApiError(404, "Bug not found");
  }

  if (bug.creator.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only bug creator can approve submission");
  }

  if (bug.status === "CLOSED") {
    throw new ApiError(400, "Bug is already closed");
  }

  if (submission.status === "APPROVED") {
    throw new ApiError(400, "Submission already approved");
  }

  submission.status = "APPROVED";
  await submission.save();

  await Submission.updateMany(
    { bug: bug._id, _id: { $ne: submissionId } },
    { $set: { status: "REJECTED" } },
  );

  bug.status = "CLOSED";
  bug.winner = submission.user;
  await bug.save();

  await User.findByIdAndUpdate(submission.user, {
    $inc: { totalRewards: bug.bountyAmount },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Submission approved and bounty awarded successfully",
      ),
    );
});

// Get submissions made by the current user
const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ user: req.user._id })
    .populate("bug", "title bountyAmount status")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        submissions,
        "User submissions fetched successfully",
      ),
    );
});

export { submitSolution, approveSubmission, getMySubmissions };
