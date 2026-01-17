import prisma from "../utils/prismaClient.js";
import { moderateContentWithAI } from "../utils/aiModeration.js";

const MAX_AI_RETRIES = 3;

export const submitContent = async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;

  if (!text) {
    return res.status(400).json({ message: "Content text is required" });
  }

  try {
    // 1️⃣ Create content first
    let content = await prisma.content.create({
      data: {
        text,
        userId,
      },
    });

    let aiResult;
    let attempts = 0;
    let lastError = null;

    // 2️⃣ Retry loop
    while (attempts < MAX_AI_RETRIES) {
      try {
        attempts++;

        aiResult = await moderateContentWithAI(text);

        // 3️⃣ AI succeeded
        await prisma.content.update({
          where: { id: content.id },
          data: {
            aiAttempts: attempts,
            aiCompleted: true,
            aiFlagged: !aiResult.safe,
            status: aiResult.safe ? "APPROVED" : "FLAGGED",
          },
        });

        return res.status(201).json({
          message: "Content submitted successfully",
          content: {
            id: content.id,
            text: content.text,
            status: aiResult.safe ? "APPROVED" : "FLAGGED",
            aiFlagged: !aiResult.safe,
            userId,
            createdAt: content.createdAt,
          },
          moderation: aiResult,
        });

      } catch (err) {
        lastError = err.message;
      }
    }

    // 4️⃣ AI failed after retries → manual review
    await prisma.content.update({
      where: { id: content.id },
      data: {
        aiAttempts: attempts,
        aiCompleted: false,
        aiFlagged: true,
        aiError: lastError,
        status: "FLAGGED",
      },
    });

    return res.status(201).json({
      message: "AI moderation failed after retries. Sent for manual review.",
      contentId: content.id,
      attempts,
    });

  } catch (error) {
    console.error("Content submission error:", error);
    return res.status(500).json({
      message: "Content submission failed",
      error: error.message,
    });
  }
};

export const createContent = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content text is required",
      });
    }

    const content = await prisma.content.create({
      data: {
        text,
        userId: req.user.id,
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit content",
    });
  }
};

export const getApprovedContent = async (req, res) => {
  try {
    const content = await prisma.content.findMany({
      where: {
        status: "APPROVED",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Error fetching approved content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch content",
    });
  }
};

export const getFlaggedContent = async (req, res) => {
  try {
    const content = await prisma.content.findMany({
      where: {
        status: "FLAGGED",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Error fetching flagged content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch flagged content",
    });
  }
};
