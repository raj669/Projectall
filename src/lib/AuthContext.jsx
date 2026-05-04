import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient, { setAccessToken, getAccessToken } from './apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth on app load
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      setIsLoadingAuth(true);
      const response = await apiClient.post('/auth/refresh');
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      // No valid session
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const register = useCallback(async (name, email, password) => {
    try {
      setAuthError(null);
      const response = await apiClient.post('/auth/register', { name, email, password });
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setAuthError(null);
      const response = await apiClient.post('/auth/login', { email, password });
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoadingAuth,
    authError,
    register,
    login,
    logout,
    restoreSession,
    getAccessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
