import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logoutUser, restoreSession } from '../store/slices/authSlice';
import * as authService from '../../services/authService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { data: user, token } = response;
      dispatch(setCredentials({ user, token }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid email or password' };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Backend returns data: { id, email } but no token until OTP verified
      const response = await authService.register({ name, email, password });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch(logoutUser());
  };

  const value = {
    user,
    isAuthenticated,
    loading: false, // Could be linked to Redux if async thunks were used
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

