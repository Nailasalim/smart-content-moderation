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
