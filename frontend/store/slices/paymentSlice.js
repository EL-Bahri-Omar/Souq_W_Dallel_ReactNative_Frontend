import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentService } from '../services/paymentService';

export const createPaymentIntent = createAsyncThunk(
  'payment/createIntent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentService.createPaymentIntent();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkPaymentStatus = createAsyncThunk(
  'payment/checkStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const hasPaid = await paymentService.hasPaidBidTax(userId);
      return { userId, hasPaid };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAsPaid = createAsyncThunk(
  'payment/markAsPaid',
  async (userId, { rejectWithValue }) => {
    try {
      await paymentService.markAsPaid(userId);
      return { userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    clientSecret: null,
    loading: false,
    error: null,
    paidUsers: [],
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
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        const { userId, hasPaid } = action.payload;
        if (hasPaid && !state.paidUsers.includes(userId)) {
          state.paidUsers.push(userId);
        }
      })
      .addCase(markAsPaid.fulfilled, (state, action) => {
        const { userId } = action.payload;
        if (!state.paidUsers.includes(userId)) {
          state.paidUsers.push(userId);
        }
      });
  },
});

export const { clearPaymentError, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;