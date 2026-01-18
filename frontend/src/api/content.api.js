import api from "./axios";

// Submit content
export const submitContent = (text) => {
  return api.post("/content", { text });
};

// Get all approved content
export const getApprovedContent = () => {
  return api.get("/content");
};

// Get all content for community display (approved + warned)
export const getCommunityContent = () => {
  return api.get("/content/community");
};

// Get flagged content (AI reports)
export const getFlaggedContent = () => {
  return api.get("/content/flagged");
};

// Get content by status (for filtering)
export const getContentByStatus = (status) => {
  return api.get(`/content/by-status/${status}`);
};

// Get content by ID
export const getContentById = (contentId) => {
  return api.get(`/content/${contentId}`);
};