// Authentication Service for BTY-HUB
// Integrated with FastAPI backend running on localhost:8000

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

// Helper to get authorization header
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const authService = {
  // ==================== AUTHENTICATION ====================
  
  /**
   * Login user with email and password
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          username: userData.username || userData.name,
          password: userData.password,
          first_name: userData.first_name || userData.name?.split(' ')[0],
          last_name: userData.last_name || userData.name?.split(' ')[1] || ''
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    return true;
  },

  /**
   * Validate access token
   */
  validateToken: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch user');
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Update failed');
      }

      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      return data;
    } catch (error) {
      authService.logout();
      throw new Error(error.message || 'Token refresh failed');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Get stored user
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get access token
   */
  getAccessToken: () => {
    return localStorage.getItem('access_token');
  }
};

// Auth storage helper for localStorage operations
export const authStorage = {
  saveAuthData: (data) => {
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    if (data.token) {
      localStorage.setItem('access_token', data.token);
    }
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  getToken: () => {
    return localStorage.getItem('access_token');
  },
  
  clearAuthData: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

export default authService;