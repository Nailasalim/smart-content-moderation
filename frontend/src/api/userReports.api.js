import api from "./axios";

/**
 * Get all reports made by a specific user
 * @param {number} userId - The user ID
 * @returns {Promise} - User reports data
 */
export const getUserReports = async (userId) => {
  try {
    const response = await api.get(`/report/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user reports:", error);
    throw error;
  }
};
