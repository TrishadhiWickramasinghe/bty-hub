// Product Service for BTY-HUB
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

const productService = {
  // ==================== PRODUCTS ====================
  
  /**
   * Get all products with filters
   */
  getAllProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category_id) queryParams.append('category_id', filters.category_id);
      if (filters.skip) queryParams.append('skip', filters.skip);
      if (filters.limit) queryParams.append('limit', filters.limit || 10);
      if (filters.search) queryParams.append('search', filters.search);
      
      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch products');
    }
  },

  /**
   * Get product by ID
   */
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Product not found');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch product');
    }
  },

  /**
   * Create product (Admin only)
   */
  createProduct: async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create product');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to create product');
    }
  },

  /**
   * Update product (Admin only)
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update product');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to update product');
    }
  },

  /**
   * Delete product (Admin only)
   */
  deleteProduct: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      return true;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete product');
    }
  },

  // ==================== CATEGORIES ====================
  
  /**
   * Get all categories
   */
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch categories');
    }
  },

  /**
   * Create category (Admin only)
   */
  createCategory: async (categoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create category');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to create category');
    }
  }
};

export default productService;