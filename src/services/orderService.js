// Order Service for BTY-HUB
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

const orderService = {
  // ==================== ORDERS ====================
  
  /**
   * Get all orders with filters
   */
  getAllOrders: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.skip) queryParams.append('skip', filters.skip);
      if (filters.limit) queryParams.append('limit', filters.limit || 10);
      
      const response = await fetch(`${API_BASE_URL}/orders?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Order not found');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch order');
    }
  },

  /**
   * Create new order
   */
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to create order');
    }
  },

  /**
   * Update order status (Admin only)
   */
  updateOrderStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update order status');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to update order status');
    }
  },

  /**
   * Update payment status (Admin only)
   */
  updatePaymentStatus: async (id, payment_status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/payment`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ payment_status })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update payment status');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to update payment status');
    }
  },

  /**
   * Cancel order
   */
  cancelOrder: async (id) => {
    try {
      return await orderService.updateOrderStatus(id, 'cancelled');
    } catch (error) {
      throw new Error(error.message || 'Failed to cancel order');
    }
  }
};

export default orderService;