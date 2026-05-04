import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient, { setAccessToken, getAccessToken } from './apiClient';
import { secureStorage, rateLimit } from './securityService';

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
      // Store user data securely
      secureStorage.storeUserData(response.data.user);
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
      
      // Check rate limiting
      if (!rateLimit.check()) {
        const remaining = rateLimit.getRemaining();
        const message = remaining === 0 
          ? 'Too many registration attempts. Please try again in 1 hour.'
          : `Too many attempts. Try again later. (${remaining} attempts remaining)`;
        throw new Error(message);
      }

      const response = await apiClient.post('/auth/register', { name, email, password });
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      // Store user data securely
      secureStorage.storeUserData(response.data.user);
      rateLimit.reset(); // Reset rate limit on success
      
      return response.data;
    } catch (error) {
      rateLimit.increment(); // Track failed attempts
      const message = error.response?.data?.error || error.message || 'Registration failed';
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setAuthError(null);
      
      // Check rate limiting for login
      if (!rateLimit.check()) {
        throw new Error('Too many login attempts. Please try again in 1 hour.');
      }

      const response = await apiClient.post('/auth/login', { email, password });
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      // Store user data securely
      secureStorage.storeUserData(response.data.user);
      rateLimit.reset();
      
      return response.data;
    } catch (error) {
      rateLimit.increment();
      const message = error.response?.data?.error || error.message || 'Login failed';
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
      secureStorage.clearUserData();
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
    getAccessToken,
    getStoredUserData: secureStorage.getUserData
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
