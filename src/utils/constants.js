export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'cash_on_delivery', label: 'Cash on Delivery' }
];

export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Sports',
  'Books',
  'Health & Beauty',
  'Toys & Games',
  'Automotive'
];

export const ADMIN_ROUTES = [
  { path: '/admin/dashboard', name: 'Dashboard', icon: 'dashboard' },
  { path: '/admin/products', name: 'Products', icon: 'box' },
  { path: '/admin/orders', name: 'Orders', icon: 'shopping-cart' },
  { path: '/admin/users', name: 'Users', icon: 'users' },
  { path: '/admin/reports', name: 'Reports', icon: 'chart-bar' }
];