import { Router } from "express";
import {
  submitSolution,
  approveSubmission,
  getMySubmissions,
} from "../controllers/submission.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Specific routes first
router.get("/my", verifyJWT, getMySubmissions);

// Parameter routes last
router.post("/:bugId", verifyJWT, submitSolution);
router.patch("/:submissionId/approve", verifyJWT, approveSubmission);

export default router;
