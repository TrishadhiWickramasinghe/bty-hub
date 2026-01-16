import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('btyhub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // In production, replace with actual API call
      if (email === 'admin@btyhub.com' && password === 'admin123') {
        const adminUser = {
          id: 1,
          email: 'admin@btyhub.com',
          name: 'Admin',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('btyhub_user', JSON.stringify(adminUser));
        toast.success('Admin login successful!');
        return adminUser;
      } else {
        const customerUser = {
          id: 2,
          email: email,
          name: email.split('@')[0],
          role: 'customer'
        };
        setUser(customerUser);
        localStorage.setItem('btyhub_user', JSON.stringify(customerUser));
        toast.success('Login successful!');
        return customerUser;
      }
    } catch (error) {
      toast.error('Login failed!');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'customer'
      };
      setUser(newUser);
      localStorage.setItem('btyhub_user', JSON.stringify(newUser));
      toast.success('Registration successful!');
      return newUser;
    } catch (error) {
      toast.error('Registration failed!');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('btyhub_user');
    toast.success('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};