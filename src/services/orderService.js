// Mock data for orders
let orders = [
  {
    id: 'ORD-001',
    userId: 1,
    customer: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    items: [
      { id: 1, name: 'Premium Laptop', quantity: 1, price: 1299.99 },
      { id: 2, name: 'Wireless Mouse', quantity: 2, price: 29.99 }
    ],
    subtotal: 1359.97,
    shipping: 0,
    tax: 108.80,
    total: 1468.77,
    status: 'processing',
    paymentMethod: 'credit_card',
    shippingAddress: '123 Main St, New York, NY 10001',
    billingAddress: '123 Main St, New York, NY 10001',
    notes: 'Please deliver before 5 PM',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
];

const orderService = {
  // Get all orders
  getAllOrders: async (filters = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredOrders = [...orders];
    
    // Apply filters
    if (filters.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }
    
    if (filters.customerId) {
      filteredOrders = filteredOrders.filter(order => order.userId === filters.customerId);
    }
    
    if (filters.startDate && filters.endDate) {
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= new Date(filters.startDate) && orderDate <= new Date(filters.endDate);
      });
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.id.toLowerCase().includes(searchTerm) ||
        order.customer.toLowerCase().includes(searchTerm) ||
        order.email.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply sorting
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return filteredOrders;
  },

  // Get order by ID
  getOrderById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return order;
  },

  // Create new order
  createOrder: async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    return newOrder;
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  },

  // Cancel order
  cancelOrder: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    
    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    return order;
  },

  // Get user orders
  getUserOrders: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userOrders = orders.filter(order => order.userId === userId);
    return userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Delete order (admin only)
  deleteOrder: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    
    orders.splice(index, 1);
    return true;
  },

  // Get order statistics
  getOrderStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentOrders = orders.filter(order => 
      new Date(order.createdAt) >= lastWeek
    );
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      recentCount: recentOrders.length,
      recentRevenue: recentOrders.reduce((sum, order) => sum + order.total, 0)
    };
  }
};

export default orderService;