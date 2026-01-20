// Admin Service for BTY-HUB
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

const adminService = {
  // ==================== DASHBOARD ====================
  
  /**
   * Get dashboard statistics
   */
  getDashboard: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch dashboard data');
    }
  },

  // ==================== ORDERS ====================
  
  /**
   * Get all orders (Admin)
   */
  getAllOrders: async (skip = 0, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/orders?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  },

  // ==================== USERS ====================
  
  /**
   * Get all users (Admin)
   */
  getAllUsers: async (skip = 0, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch users');
    }
  },

  /**
   * Toggle user status (Admin)
   */
  toggleUserStatus: async (user_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${user_id}/toggle-status`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to toggle user status');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to toggle user status');
    }
  },

  // ==================== ANALYTICS ====================
  
  /**
   * Get sales analytics (Admin)
   */
  getSalesAnalytics: async (startDate = null, endDate = null) => {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const response = await fetch(`${API_BASE_URL}/admin/sales/analytics?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sales analytics');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch sales analytics');
    }
  },

  // ==================== REPORTS ====================
  
  /**
   * Get inventory report (Admin)
   */
  getInventoryReport: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reports/inventory`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inventory report');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch inventory report');
    }
  }
};

export default adminService;
