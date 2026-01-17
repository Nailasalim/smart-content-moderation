import api from "./axios";

// Fetch flagged content
export const getFlaggedContent = () => {
  return api.get("/content/flagged");
};

// Take moderation action
export const takeModerationAction = (contentId, action) => {
  return api.post("/moderation/action", {
    contentId,
    action,
  });
};
