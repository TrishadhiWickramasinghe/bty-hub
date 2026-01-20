// Review Service for BTY-HUB
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

const reviewService = {
  /**
   * Create a new review
   */
  createReview: async (reviewData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create review');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to create review');
    }
  },

  /**
   * Get reviews for a product
   */
  getProductReviews: async (product_id, skip = 0, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/product/${product_id}?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch reviews');
    }
  },

  /**
   * Update a review
   */
  updateReview: async (review_id, reviewData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${review_id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update review');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to update review');
    }
  },

  /**
   * Delete a review
   */
  deleteReview: async (review_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${review_id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      return true;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete review');
    }
  }
};

export default reviewService;
