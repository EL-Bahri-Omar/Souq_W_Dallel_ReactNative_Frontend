import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { loginUser, registerUser, logoutUser, logout as syncLogout } from '../store/slices/authSlice';
import { persistor } from '../store';
import { Platform } from 'react-native';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user, loading, error, logoutLoading } = useAppSelector((state) => state.auth);

  const logout = async () => {
    // Immediately clear redux state
    dispatch(syncLogout());
    
    try {
      // Clear manual AsyncStorage keys
      await dispatch(logoutUser()).unwrap();
      // Purge all redux-persist stored data
      await persistor.purge();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  return {
    token,
    user,
    loading: loading || logoutLoading,
    error,
    
    login: (email, password) => dispatch(loginUser({ email, password })),
    register: (userData) => dispatch(registerUser(userData)),
    logout,
  };
};