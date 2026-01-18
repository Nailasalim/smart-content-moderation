import prisma from "../utils/prismaClient.js";

/**
 * USER: Report content
 */
export const reportContent = async (req, res) => {
  const { contentId, reason } = req.body;
  const userId = req.user.id;

  if (!contentId || !reason) {
    return res.status(400).json({ message: "contentId and reason are required" });
  }

  try {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    const report = await prisma.report.create({
      data: {
        reason,
        contentId,
        userId,
      },
    });

    return res.status(201).json({
      message: "Content reported successfully",
      report,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to report content" });
  }
};

/**
 * MODERATOR: View all reports (optional status filter)
 */
export const getAllReports = async (req, res) => {
  const { status } = req.query;

  try {
    const reports = await prisma.report.findMany({
      where: status ? { status } : {},
      include: {
        user: { select: { id: true, name: true, email: true } },
        content: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

/**
 * MODERATOR: Mark report as REVIEWED
 */
export const reviewReport = async (req, res) => {
  const reportId = Number(req.params.id);

  try {
    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status: "REVIEWED" },
    });

    res.status(200).json({
      message: "Report marked as reviewed",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to review report" });
  }
};

/**
 * GET /report/by-status/:status
 * Fetch user reports by content status
 */
export const getReportsByContentStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    // Validate status
    const validStatuses = ["APPROVED", "REMOVED", "FLAGGED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const reports = await prisma.report.findMany({
      where: {
        content: {
          status: status,
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
        content: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            moderationActions: {
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
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(reports);
  } catch (error) {
    console.error("Get reports by status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * MODERATOR: Get all reports made by a specific user
 * GET /report/user/:userId
 */
export const getReportsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate userId
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all reports made by this user with content details
    const reports = await prisma.report.findMany({
      where: {
        userId: Number(userId)
      },
      include: {
        content: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            moderationActions: {
              include: {
                moderator: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              },
              orderBy: {
                createdAt: "desc"
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Format the response with status information
    const formattedReports = reports.map(report => {
      const contentStatus = report.content?.status || "UNKNOWN";
      const latestModerationAction = report.content?.moderationActions?.[0];
      
      return {
        id: report.id,
        reason: report.reason,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        content: {
          id: report.content?.id,
          text: report.content?.text,
          status: contentStatus,
          createdAt: report.content?.createdAt,
          updatedAt: report.content?.updatedAt,
          user: report.content?.user
        },
        user: user,
        moderationStatus: latestModerationAction ? {
          action: latestModerationAction.action,
          moderator: latestModerationAction.moderator,
          createdAt: latestModerationAction.createdAt
        } : null
      };
    });

    return res.status(200).json({
      user,
      reports: formattedReports,
      totalReports: formattedReports.length,
      summary: {
        pending: formattedReports.filter(r => r.status === "PENDING").length,
        reviewed: formattedReports.filter(r => r.status === "REVIEWED").length,
        contentApproved: formattedReports.filter(r => r.content?.status === "APPROVED").length,
        contentRemoved: formattedReports.filter(r => r.content?.status === "REMOVED").length,
        contentFlagged: formattedReports.filter(r => r.content?.status === "FLAGGED").length
      }
    });
  } catch (error) {
    console.error("Get reports by user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * USER: Get reports made by the authenticated user
 * GET /report/user-reports
 */
export const getUserReports = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get all reports made by this user with content details
    const reports = await prisma.report.findMany({
      where: {
        userId: userId
      },
      include: {
        content: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Format the response
    const formattedReports = reports.map(report => ({
      id: report.id,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      content: {
        id: report.content?.id,
        text: report.content?.text,
        status: report.content?.status,
        createdAt: report.content?.createdAt,
        updatedAt: report.content?.updatedAt,
        user: report.content?.user
      }
    }));

    return res.status(200).json(formattedReports);
  } catch (error) {
    console.error("Get user reports error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
