import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Bug } from "../models/bug.models.js";
import { Submission } from "../models/submission.models.js";

//  Create Bug
const createBug = asyncHandler(async (req, res) => {
  const { title, description, bountyAmount } = req.body;

  if (
    [title, description, bountyAmount].some((field) => !field || field === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (bountyAmount <= 0) {
    throw new ApiError(400, "Bounty must be greater than 0");
  }

  const bug = await Bug.create({
    title,
    description,
    bountyAmount,
    creator: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, bug, "Bug created successfully"));
});

//  Get All Bugs (Public)
const getAllBugs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;

  const query = {};

  if (status) {
    query.status = status.toUpperCase();
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const bugs = await Bug.find(query)
    .populate("creator", "username email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Bug.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      bugs,
    }, "Bugs fetched successfully")
  );
});


//  Get Bug By ID
const getBugById = asyncHandler(async (req, res) => {
  const { bugId } = req.params;

  const bug = await Bug.findById(bugId)
    .populate("creator", "username email")
    .populate("winner", "username email");

  if (!bug) {
    throw new ApiError(404, "Bug not found");
  }

  const submissions = await Submission.find({ bug: bugId })
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bug,
        submissions,
      },
      "Bug details fetched successfully",
    ),
  );
});

const getMyBugs = asyncHandler(async (req, res) => {
  const bugs = await Bug.find({ creator: req.user._id })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, bugs, "My bugs fetched"));
});


export { createBug, getAllBugs, getBugById };
