import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  createContent,
  getFlaggedContent,
  getApprovedContent,
  submitContent
} from "../controllers/content.controller.js";

const router = express.Router();

/**
 * USER: Submit content
 */
router.post(
  "/",
  authenticateToken,
  submitContent
);

/**
 * USER: Get all approved content
 */
router.get(
  "/",
  authenticateToken,
  getApprovedContent
);

/**
 * MODERATOR: View moderation queue
 */
router.get(
  "/flagged",
  authenticateToken,
  requireRole("MODERATOR"),
  getFlaggedContent
);



export default router;
