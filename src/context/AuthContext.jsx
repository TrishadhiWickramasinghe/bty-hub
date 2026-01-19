import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import authService, { authStorage } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = authStorage.getUser();
    const storedToken = authStorage.getToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      
      // Validate token (in production)
      validateToken(storedToken);
    }
    setLoading(false);
  }, []);

  const validateToken = async (token) => {
    try {
      const isValid = await authService.validateToken(token);
      if (!isValid) {
        logout();
        toast.warning('Session expired. Please login again.');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      setUser(response.user);
      setToken(response.token);
      
      // Save to localStorage
      authStorage.saveAuthData({
        user: response.user,
        token: response.token
      });
      
      toast.success('Login successful!');
      return response.user;
    } catch (error) {
      toast.error(error.message || 'Login failed!');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      setUser(response.user);
      setToken(response.token);
      
      // Save to localStorage
      authStorage.saveAuthData({
        user: response.user,
        token: response.token
      });
      
      toast.success('Registration successful!');
      return response.user;
    } catch (error) {
      toast.error(error.message || 'Registration failed!');
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      authStorage.clearAuthData();
      toast.success('Logged out successfully!');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData, token);
      setUser(updatedUser);
      
      // Update localStorage
      authStorage.saveAuthData({
        user: updatedUser,
        token
      });
      
      return updatedUser;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authService.changePassword(currentPassword, newPassword, token);
      toast.success('Password changed successfully!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email);
      toast.success('Password reset email sent!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await authService.resetPassword(token, newPassword);
      toast.success('Password reset successful!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      forgotPassword,
      resetPassword,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};