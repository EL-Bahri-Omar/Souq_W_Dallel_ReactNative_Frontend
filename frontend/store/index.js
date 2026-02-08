import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import auctionReducer from './slices/auctionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    auction: auctionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});