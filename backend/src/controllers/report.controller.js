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

    // Create the report
    const report = await prisma.report.create({
      data: {
        reason,
        contentId,
        userId,
      },
    });

    // Change content status to PENDING so it's hidden from users and sent for moderator review
    // This ensures user-reported content appears in User Reports section, not AI Reports
    // Change status to PENDING regardless of current status (APPROVED or FLAGGED)
    // This way, once a user reports it, it goes to User Reports for human review
    if (content.status !== "PENDING") {
      await prisma.content.update({
        where: { id: contentId },
        data: {
          status: "PENDING",
        },
      });
    }

    return res.status(201).json({
      message: "Content reported successfully. It has been sent for moderator review.",
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
    // Only get reports for PENDING content (user-reported)
    // This ensures user-reported content only appears in User Reports, not AI Reports
    const reports = await prisma.report.findMany({
      where: {
        ...(status ? { status } : {}),
        content: {
          status: "PENDING"  // Only show reports for user-reported content
        }
      },
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
 * GET /report/user-reports or GET /report/my-reports
 */
export const getUserReports = async (req, res) => {
  try {
    // Verify Prisma client is available
    if (!prisma) {
      console.error("Prisma client is not initialized");
      return res.status(500).json({ message: "Database connection error" });
    }

    const userId = req.user?.id;
    
    if (!userId) {
      console.error("User ID is missing from request. req.user:", req.user);
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Fetching reports for user ID:", userId);
    
    // First, get all reports for this user
    const reports = await prisma.report.findMany({
      where: {
        userId: userId
      },
      include: {
        content: {
          select: {
            id: true,
            text: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    console.log(`Found ${reports.length} reports for user ${userId}`);

    // Format the response - use moderatorAction directly from Report table
    const formattedReports = reports.map(report => {
      return {
        reportId: report.id,
        contentId: report.content?.id || null,
        contentText: report.content?.text || "Content not available",
        reason: report.reason,
        createdAt: report.createdAt,
        status: report.status,  // PENDING or REVIEWED
        moderatorAction: report.moderatorAction || null,  // APPROVED, REMOVED, WARNED, or null
        reviewedAt: report.reviewedAt || null
      };
    });

    console.log(`Formatted ${formattedReports.length} reports successfully`);
    return res.status(200).json(formattedReports);
  } catch (error) {
    console.error("Get user reports error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.stack) {
      console.error("Error stack:", error.stack.substring(0, 500));
    }
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
