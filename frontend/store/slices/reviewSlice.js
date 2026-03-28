import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService } from '../services/reviewService';

export const fetchReviews = createAsyncThunk(
  'reviews/fetch',
  async (auctionId, { rejectWithValue }) => {
    try {
      const reviews = await reviewService.getReviews(auctionId);
      return { auctionId, reviews };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/add',
  async ({ auctionId, reviewerId, review }, { rejectWithValue }) => {
    try {
      await reviewService.addReview(auctionId, reviewerId, review);
      return { auctionId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/update',
  async ({ auctionId, reviewerId, oldReview, newReview }, { rejectWithValue }) => {
    try {
      await reviewService.updateReview(auctionId, reviewerId, oldReview, newReview);
      return { auctionId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async ({ auctionId, reviewerId, review }, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(auctionId, reviewerId, review);
      return { auctionId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearReviews: (state) => {
      state.reviews = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews[action.payload.auctionId] = action.payload.reviews;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;