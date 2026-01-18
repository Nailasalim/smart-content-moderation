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
/**
 * GET /moderation/history/:contentId
 * Fetch action history for specific content
 */
export const getContentHistory = async (req, res) => {
  try {
    const { contentId } = req.params;
    
    const actions = await prisma.moderationAction.findMany({
      where: { contentId: Number(contentId) },
      include: {
        moderator: {
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

    return res.json(actions);
  } catch (error) {
    console.error("Get content history error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

    // Map action to moderatorAction string for reports
    let moderatorActionString = null;
    if (action === "APPROVE") moderatorActionString = "APPROVED";
    else if (action === "REMOVE") moderatorActionString = "REMOVED";
    else if (action === "WARN") moderatorActionString = "WARNED";

    // Update all reports for this content to REVIEWED with moderator action
    await prisma.report.updateMany({
      where: {
        contentId: Number(contentId),
        status: "PENDING"  // Only update pending reports
      },
      data: {
        status: "REVIEWED",
        moderatorAction: moderatorActionString,
        reviewedAt: new Date(),
      },
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

/**
 * MODERATOR: Get actions performed by the current moderator
 * GET /api/moderator/my-actions
 * Optional filter: ?action=APPROVED|REMOVED|WARNED
 */
export const getMyActions = async (req, res) => {
  try {
    const moderatorId = req.user.id;
    const { action } = req.query;

    // Build where clause for filtering
    let whereClause = { moderatorId };
    
    // Add action filter if provided
    if (action && ["APPROVED", "REMOVED", "WARNED"].includes(action)) {
      whereClause.action = action;
    }

    const actions = await prisma.moderationAction.findMany({
      where: whereClause,
      include: {
        moderator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        content: {
          select: {
            id: true,
            text: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format response
    const formattedActions = actions.map((action) => ({
      id: action.id,
      action: action.action,
      createdAt: action.createdAt,
      content: {
        id: action.content.id,
        text: action.content.text,
        status: action.content.status,
        createdAt: action.content.createdAt,
      },
      moderator: action.moderator,
    }));

    return res.status(200).json(formattedActions);
  } catch (error) {
    console.error("Get my actions error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
