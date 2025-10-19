import express from "express";
import {
  upsertResume,
  getResume,
  getAllResumes,
  deleteResume,
} from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/", upsertResume); // Create/Update
router.get("/:userId", getResume); // Get single
router.get("/", getAllResumes); // Get all
router.delete("/:userId", deleteResume); // Delete

export default router;
