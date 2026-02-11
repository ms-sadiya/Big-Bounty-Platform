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

  if (!mongoose.Types.ObjectId.isValid(bugId)) {
    throw new ApiError(400, "Invalid bug ID");
  }

  const bug = await Bug.findById(bugId);

  if (!bug) {
    throw new ApiError(404, "Bug not found");
  }

  if (bug.status === "CLOSED") {
    throw new ApiError(400, "Cannot submit solution to closed bug");
  }

  if (bug.creator.toString() === req.user._id.toString()) {
    throw new ApiError(403, "Bug creator cannot submit a solution");
  }

  if (!description || !proofLink) {
    throw new ApiError(400, "Description and proofLink are required");
  }

  try {
    const submission = await Submission.create({
      bug: bugId,
      user: req.user._id,
      description,
      proofLink,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, submission, "Submission created successfully"));
  } catch (err) {
    // handle unique index error (one submission per user per bug)
    if (err.code === 11000) {
      throw new ApiError(409, "You have already submitted a solution for this bug");
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

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const submission = await Submission.findById(submissionId).session(session);

      if (!submission) {
        throw new ApiError(404, "Submission not found");
      }

      const bug = await Bug.findById(submission.bug).session(session);

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

      // Approve selected submission
      submission.status = "APPROVED";
      await submission.save({ session });

      // Reject others
      await Submission.updateMany(
        { bug: bug._id, _id: { $ne: submissionId } },
        { $set: { status: "REJECTED" } },
        { session }
      );

      // Close bug and assign winner
      bug.status = "CLOSED";
      bug.winner = submission.user;
      await bug.save({ session });

      // Update reward total
      await User.findByIdAndUpdate(
        submission.user,
        { $inc: { totalRewards: bug.bountyAmount } },
        { session }
      );
    });

    session.endSession();

    return res.status(200).json(
      new ApiResponse(200, {}, "Submission approved and bounty awarded successfully")
    );
  } catch (error) {
    session.endSession();
    throw error;
  }
});

export { submitSolution, approveSubmission };