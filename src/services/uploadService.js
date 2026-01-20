// Upload Service for BTY-HUB
// Integrated with FastAPI backend running on localhost:8000

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

// Helper to get authorization header (without Content-Type for FormData)
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const uploadService = {
  /**
   * Upload product image
   */
  uploadProductImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload/product-image`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload product image');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to upload product image');
    }
  },

  /**
   * Upload category image
   */
  uploadCategoryImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload/category-image`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload category image');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to upload category image');
    }
  }
};

export default uploadService;
