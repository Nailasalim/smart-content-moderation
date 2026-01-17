import api from "./axios";

export const reportContent = async (contentId, reason) => {
  return api.post("/report", { contentId, reason });
};
