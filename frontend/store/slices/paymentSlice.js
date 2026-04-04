import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentService } from "../services/paymentService";

export const createPaymentIntent = createAsyncThunk(
  "payment/createIntent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentService.createPaymentIntent();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    clientSecret: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    resetPayment: (state) => {
      state.clientSecret = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentError, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
