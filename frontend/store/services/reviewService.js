import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const reviewService = {
  getReviews: async (auctionId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.GET_REVIEWS(auctionId)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return {};
    }
  },

  addReview: async (auctionId, reviewerId, review) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const encodedReview = encodeURIComponent(review);
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.ADD_REVIEW(auctionId, reviewerId, encodedReview)}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  updateReview: async (auctionId, reviewerId, oldReview, newReview) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const encodedOldReview = encodeURIComponent(oldReview);
      const encodedNewReview = encodeURIComponent(newReview);
      const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.UPDATE_REVIEW(auctionId, reviewerId, encodedOldReview, encodedNewReview)}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  deleteReview: async (auctionId, reviewerId, review) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const encodedReview = encodeURIComponent(review);
      const response = await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.DELETE_REVIEW(auctionId, reviewerId, encodedReview)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting review:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  },
};
