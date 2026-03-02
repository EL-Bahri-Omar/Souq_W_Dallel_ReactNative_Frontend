import axiosInstance from '../../lib/axios';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAYMENT_STORAGE_KEY = 'auctionPayments';

export const paymentService = {
  /**
   * Create Stripe payment intent for 1 DT
   * @returns {Promise<Object>} Payment intent with clientSecret
   */
  createPaymentIntent: async () => {
    try {
      console.log('Calling payment endpoint:', API_ENDPOINTS.CREATE_PAYMENT_INTENT);
      const response = await axiosInstance.post(API_ENDPOINTS.CREATE_PAYMENT_INTENT);
      console.log('Payment response:', response.data);
      
      if (!response.data || !response.data.clientSecret) {
        throw new Error('Invalid payment response from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Payment intent error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur de paiement');
    }
  },

  /**
   * Check if user has already paid for a specific auction
   * @param {string} userId - User ID
   * @param {string} auctionId - Auction ID
   * @returns {Promise<boolean>}
   */
  hasPaidForAuction: async (userId, auctionId) => {
    try {
      const paymentsData = await AsyncStorage.getItem(PAYMENT_STORAGE_KEY);
      const payments = paymentsData ? JSON.parse(paymentsData) : {};
      
      // Get user's payments
      const userPayments = payments[userId] || [];
      return userPayments.includes(auctionId);
    } catch (error) {
      console.error('Error checking payment status:', error);
      return false;
    }
  },

  /**
   * Mark user as having paid for a specific auction
   * @param {string} userId - User ID
   * @param {string} auctionId - Auction ID
   * @returns {Promise<boolean>}
   */
  markAsPaidForAuction: async (userId, auctionId) => {
    try {
      const paymentsData = await AsyncStorage.getItem(PAYMENT_STORAGE_KEY);
      const payments = paymentsData ? JSON.parse(paymentsData) : {};
      
      // Get user's payments or initialize empty array
      const userPayments = payments[userId] || [];
      
      // Add auctionId if not already present
      if (!userPayments.includes(auctionId)) {
        userPayments.push(auctionId);
        payments[userId] = userPayments;
        await AsyncStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(payments));
      }
      
      return true;
    } catch (error) {
      console.error('Error marking payment:', error);
      return false;
    }
  },

  /**
   * Clear all payment records (for testing)
   */
  clearAllPayments: async () => {
    try {
      await AsyncStorage.removeItem(PAYMENT_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing payments:', error);
      return false;
    }
  }
};