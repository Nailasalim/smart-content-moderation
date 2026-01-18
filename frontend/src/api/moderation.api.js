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

// Fetch content history
export const getContentHistory = (contentId) => {
  return api.get(`/moderator/history/${contentId}`);
};

// Get moderator's own actions
export const getMyActions = (action) => {
  // Map frontend action names to backend action names
  const actionMap = {
    "APPROVED": "APPROVE",
    "REMOVED": "REMOVE",
    "WARNED": "WARN"
  };
  const backendAction = action && actionMap[action] ? actionMap[action] : action;
  const url = backendAction ? `/moderation/my-actions?action=${backendAction}` : "/moderation/my-actions";
  return api.get(url);
};
