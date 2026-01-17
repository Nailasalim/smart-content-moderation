import api from "./axios";

export const submitContent = async (text) => {
  return api.post("/content", { text });
};

export const getApprovedContent = async () => {
  return api.get("/content");
};
