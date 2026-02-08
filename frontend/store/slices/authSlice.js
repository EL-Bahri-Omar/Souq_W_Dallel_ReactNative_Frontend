import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      
      if (response.data.status === 'Waiting for validation') {
        if (response.data.code) {
          await AsyncStorage.setItem('verificationCode', response.data.code);
          await AsyncStorage.setItem('pendingVerificationEmail', email);
        }
        
        return {
          needsVerification: true,
          email: email,
          code: response.data.code
        };
      }
      
      if (response.data && response.data.token) {
        const userData = {
          id: response.data.id,
          email: response.data.email,
          token: response.data.token,
          role: response.data.role,
          status: response.data.status
        };
        
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        return userData;
      } else {
        return rejectWithValue('Invalid response from server');
      }
    } catch (error) {
      let errorMessage = 'Login failed';
      if (error.response) {
        errorMessage = error.response.data?.error || 
                      error.response.data?.message || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Check if backend is running.';
      } else {
        errorMessage = error.message || 'Network error';
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear storage');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      const responseData = response.data;
      
      if (!responseData) {
        throw new Error('No response data received from server');
      }
      
      return {
        user: responseData.user || responseData,
        code: responseData.code 
      };
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyAccount = createAsyncThunk(
  'auth/verify',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const verifyResponse = await authService.verifyAccount(email);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!password || password.trim() === '') {
        throw new Error('Auto-login failed: No password available');
      }
      
      try {
        const loginResponse = await authService.login(email, password);
        
        if (loginResponse.data && loginResponse.data.token) {
          const userData = {
            id: loginResponse.data.id,
            email: loginResponse.data.email,
            token: loginResponse.data.token,
            role: loginResponse.data.role,
            status: loginResponse.data.status || 'Activated',
            firstname: loginResponse.data.firstname || '',
            lastname: loginResponse.data.lastname || '',
            cin: loginResponse.data.cin || 0
          };
          
          await AsyncStorage.setItem('token', loginResponse.data.token);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          
          await AsyncStorage.multiRemove([
            'verificationCode', 
            'pendingVerificationEmail', 
            'pendingRegistrationPassword'
          ]);
          
          return userData;
        } else {
          throw new Error('Auto-login failed: No authentication token received');
        }
        
      } catch (loginError) {
        if (loginError.response && loginError.response.status === 401) {
          throw new Error('Auto-login failed: Incorrect password. Please login manually.');
        }
        
        throw loginError;
      }
      
    } catch (error) {
      let errorMessage = 'Verification failed';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'User not found. Please check your email.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid request.';
        } else if (error.response.status === 401) {
          errorMessage = 'Account activated but auto-login failed. Please login manually.';
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Check if backend is running.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    loading: false,
    error: null,
    logoutLoading: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      state.loading = false;
      state.logoutLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    loadToken: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.token = null;
        state.user = null;
      })
      
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false;
        state.token = null;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutLoading = false;
        state.error = action.payload;
        state.token = null;
        state.user = null;
      })
      
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload && action.payload.token) {
          state.token = action.payload.token;
          state.user = action.payload;
          state.error = null;
        }
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });  
  },
});

export const { logout, clearError, loadToken, setLoading } = authSlice.actions;
export default authSlice.reducer;