import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../services/userService';

export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (userId, { rejectWithValue }) => {
    try {
      const user = await userService.getUserById(userId);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async ({ id, userData, photoFile = null }, { rejectWithValue }) => {
    try {
      const updatedUser = await userService.updateUserWithPhoto(id, userData, photoFile);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserPhoto = createAsyncThunk(
  'user/deletePhoto',
  async (userId, { rejectWithValue }) => {
    try {
      await userService.deleteUserPhoto(userId);
      return { userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
    photoLoading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    removeUserPhoto: (state) => {
      if (state.user) {
        state.user.photoId = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deleteUserPhoto.pending, (state) => {
        state.photoLoading = true;
      })
      .addCase(deleteUserPhoto.fulfilled, (state) => {
        state.photoLoading = false;
        if (state.user) {
          state.user.photoId = null;
        }
      })
      .addCase(deleteUserPhoto.rejected, (state) => {
        state.photoLoading = false;
      });
  },
});

export const { setUser, clearUser, clearError, removeUserPhoto } = userSlice.actions;
export default userSlice.reducer;