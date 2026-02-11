import { Router } from "express";
import {
  submitSolution,
  approveSubmission,
} from "../controllers/submission.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:bugId", verifyJWT, submitSolution);
router.patch("/:submissionId/approve", verifyJWT, approveSubmission);

export default router;
