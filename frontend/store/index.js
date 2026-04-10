import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import auctionReducer from './slices/auctionSlice';
import notificationReducer from './slices/notificationSlice';
import paymentReducer from './slices/paymentSlice';
import depositReducer from './slices/depositSlice';
import parcelReducer from './slices/parcelSlice';
import reviewReducer from './slices/reviewSlice';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', 'user'],
};

const paymentPersistConfig = {
  key: 'payment',
  storage: AsyncStorage,
  whitelist: ['clientSecret'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedPaymentReducer = persistReducer(paymentPersistConfig, paymentReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
    auction: auctionReducer,
    notifications: notificationReducer,
    payment: persistedPaymentReducer,
    deposit: depositReducer,
    parcel: parcelReducer,
    reviews: reviewReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE', 'persist/FLUSH'],
      },
    }),
});

export const persistor = persistStore(store);