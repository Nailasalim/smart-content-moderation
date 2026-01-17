import prisma from "../utils/prismaClient.js";

/**
 * GET /moderation/queue
 * Fetch contents pending or flagged for moderation
 */
export const getModerationQueue = async (req, res) => {
  try {
    const contents = await prisma.content.findMany({
      where: {
        status: {
          in: ["PENDING", "FLAGGED"],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reports: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(contents);
  } catch (error) {
    console.error("Get moderation queue error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /moderation/action
 * Take action on content (APPROVE, WARN, REMOVE)
 */
export const takeModerationAction = async (req, res) => {
  try {
    const { contentId, action } = req.body;
    const moderatorId = req.user.id; // from authenticateToken

    if (!contentId || !action) {
      return res.status(400).json({ message: "contentId and action are required" });
    }

    // Check content exists
    const content = await prisma.content.findUnique({
      where: { id: Number(contentId) },
    });

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Map action -> content status
    let newStatus;
    if (action === "APPROVE") newStatus = "APPROVED";
    else if (action === "WARN") newStatus = "FLAGGED";
    else if (action === "REMOVE") newStatus = "REMOVED";
    else {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Create moderation action record
    await prisma.moderationAction.create({
      data: {
        action,
        moderatorId,
        contentId: Number(contentId),
      },
    });

    // Update content status
    const updatedContent = await prisma.content.update({
      where: { id: Number(contentId) },
      data: { status: newStatus },
    });

    // ✅ Structured response
    return res.json({
      contentId: updatedContent.id,
      action: action,
      status: updatedContent.status,
    });
  } catch (error) {
    console.error("Moderation action error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
