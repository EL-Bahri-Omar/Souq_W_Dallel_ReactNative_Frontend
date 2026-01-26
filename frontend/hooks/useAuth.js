import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { loginUser, registerUser, logoutUser, logout as syncLogout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user, loading, error, logoutLoading } = useAppSelector((state) => state.auth);

  const logout = async () => {
    // First dispatch sync logout to clear Redux state immediately
    dispatch(syncLogout());
    
    // Then dispatch async logout to clear AsyncStorage
    try {
      await dispatch(logoutUser()).unwrap();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if async logout fails, Redux state is already cleared
      return false;
    }
  };

  return {
    // Auth state
    token,
    user,
    loading: loading || logoutLoading,
    error,
    
    // Auth actions
    login: (email, password) => dispatch(loginUser({ email, password })),
    register: (userData) => dispatch(registerUser(userData)),
    logout,
  };
};