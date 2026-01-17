import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  submitContent,
  getApprovedContent,
  getFlaggedContent,
  getContentByStatus,
  getCommunityContent,
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
 * USER: Get community content (approved + warned)
 */
router.get(
  "/community",
  authenticateToken,
  getCommunityContent
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

/**
 * MODERATOR: Get content by status
 */
router.get(
  "/by-status/:status",
  authenticateToken,
  requireRole("MODERATOR"),
  getContentByStatus
);

export default router;
