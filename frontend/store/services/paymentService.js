import axiosInstance from "../../lib/axios";
import { API_ENDPOINTS, API_BASE_URL } from "../../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const paymentService = {
  createPaymentIntent: async () => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_PAYMENT_INTENT,
      );

      if (!response.data || !response.data.clientSecret) {
        throw new Error("Invalid payment response from server");
      }

      return response.data;
    } catch (error) {
      console.error(
        "Payment intent error:",
        error.response?.data || error.message,
      );
      throw new Error(error.response?.data?.message || "Erreur de paiement");
    }
  },

  payCreationFees: async (auctionId, amount) => {
    try {

      const response = await axiosInstance.post(
        API_ENDPOINTS.PAY_CREATION_FEES(auctionId, amount),
      );
      return response.data;
    } catch (error) {
      console.error("Creation payment error:", error);
      throw error;
    }
  },

  payAuction: async (auctionId, amount) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.PAY_AUCTION(auctionId, amount),
      );
      return response.data;
    } catch (error) {
      console.error("Auction payment error:", error);
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        throw new Error(
          error.response.data?.error ||
            error.response.data?.message ||
            "Erreur de paiement",
        );
      }
      throw new Error(error.message || "Erreur de paiement");
    }
  },
};
