import api from "./axios";

// Report content
export const reportContent = (contentId, reason) => {
  return api.post("/report", { contentId, reason });
};

// Get all reports
export const getReports = () => {
  return api.get("/report");
};

// Get reports by content status
export const getReportsByContentStatus = (status) => {
  return api.get(`/report/by-status/${status}`);
};
