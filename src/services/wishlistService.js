// Wishlist Service for BTY-HUB
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

const wishlistService = {
  /**
   * Get user's wishlist
   */
  getWishlist: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch wishlist');
    }
  },

  /**
   * Add product to wishlist
   */
  addToWishlist: async (product_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ product_id })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add to wishlist');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to add to wishlist');
    }
  },

  /**
   * Remove product from wishlist
   */
  removeFromWishlist: async (product_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/item/${product_id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to remove from wishlist');
    }
  },

  /**
   * Check if product is in wishlist
   */
  isInWishlist: async (product_id) => {
    try {
      const wishlist = await wishlistService.getWishlist();
      return wishlist.products.includes(product_id);
    } catch (error) {
      return false;
    }
  }
};

export default wishlistService;
