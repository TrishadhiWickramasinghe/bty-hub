// Cart Service for BTY-HUB
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

const cartService = {
  /**
   * Get user's cart
   */
  getCart: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch cart');
    }
  },

  /**
   * Add item to cart
   */
  addToCart: async (product_id, quantity = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ product_id, quantity })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add item to cart');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to add item to cart');
    }
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (product_id, quantity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/item/${product_id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update cart item');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to update cart item');
    }
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (product_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/item/${product_id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to remove item from cart');
    }
  },

  /**
   * Clear cart
   */
  clearCart: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      return true;
    } catch (error) {
      throw new Error(error.message || 'Failed to clear cart');
    }
  }
};

export default cartService;
