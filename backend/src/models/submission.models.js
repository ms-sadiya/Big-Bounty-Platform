import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    bug: {
      type: Schema.Types.ObjectId,
      ref: "Bug",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    proofLink: {
      type: String,
      required: true,
       trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

submissionSchema.index({ bug: 1, user: 1 }, { unique: true });

export const Submission = mongoose.model(
  "Submission",
  submissionSchema
);
