import { Router } from "express";
import {
  createBug,
  getAllBugs,
  getBugById,
  getMyBugs,
  deleteBug,
} from "../controllers/bug.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// General Route
router.route("/").get(getAllBugs).post(verifyJWT, createBug);

router.route("/my-bugs").get(verifyJWT, getMyBugs); 

// Dynamic Routes 
router.route("/:bugId").get(getBugById).delete(verifyJWT, deleteBug);

export default router;
