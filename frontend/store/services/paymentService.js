import axiosInstance from "../../lib/axios";
import { API_ENDPOINTS, API_BASE_URL } from "../../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const paymentService = {
  createPaymentIntent: async () => {
    try {
      console.log("Creating payment intent");
      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_PAYMENT_INTENT,
      );
      console.log("Payment intent response:", response.data);

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

  payAuction: async (auctionId, amount) => {
    try {
      console.log(`Paying auction ${auctionId} with amount ${amount}`);
      const response = await axiosInstance.post(
        API_ENDPOINTS.PAY_AUCTION(auctionId, amount),
      );
      console.log("Pay auction response:", response.data);
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
