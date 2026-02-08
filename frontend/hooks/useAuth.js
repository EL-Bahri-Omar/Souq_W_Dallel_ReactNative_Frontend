import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { loginUser, registerUser, logoutUser, logout as syncLogout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user, loading, error, logoutLoading } = useAppSelector((state) => state.auth);

  const logout = async () => {
    dispatch(syncLogout());
    
    try {
      await dispatch(logoutUser()).unwrap();
      return true;
    } catch (error) {
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