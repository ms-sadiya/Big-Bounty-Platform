import { Router } from "express";
import {
  createBug,
  getAllBugs,
  getBugById,
} from "../controllers/bug.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
  .get(getAllBugs)              // Public
  .post(verifyJWT, createBug);  // Protected

router.route("/:bugId")
  .get(getBugById);             // Public

export default router;
