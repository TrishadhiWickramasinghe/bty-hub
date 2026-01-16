// Mock data - replace with actual API calls
const products = [
  {
    id: 1,
    name: 'Premium Laptop',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    category: 'Electronics',
    stock: 45,
    rating: 4.8,
    image: 'https://via.placeholder.com/300',
    createdAt: '2024-01-01'
  },
  // Add more products as needed
];

const productService = {
  // Get all products
  getAllProducts: async (filters = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredProducts = [...products];
    
    // Apply filters
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredProducts;
  },

  // Get product by ID
  getProductById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const product = products.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Product not found');
    return product;
  },

  // Create product (admin)
  createProduct: async (productData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProduct = {
      id: products.length + 1,
      ...productData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    products.push(newProduct);
    return newProduct;
  },

  // Update product (admin)
  updateProduct: async (id, productData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) throw new Error('Product not found');
    
    products[index] = { ...products[index], ...productData };
    return products[index];
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) throw new Error('Product not found');
    
    products.splice(index, 1);
    return true;
  },

  // Get product categories
  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
  }
};

export default productService;