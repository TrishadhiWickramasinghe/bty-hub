# BTY-HUB Frontend Integration Guide

This guide shows how to use the integrated services that communicate with the FastAPI backend running on `localhost:8000`.

## Setup

### 1. Environment Variables

Create a `.env` file in the root of your React project:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
REACT_APP_ENVIRONMENT=development
```

### 2. Backend Requirements

Ensure your FastAPI backend is running on `localhost:8000` with the following endpoints available:

- **Auth**: `/api/v1/auth/*`
- **Products**: `/api/v1/products` & `/api/v1/categories`
- **Cart**: `/api/v1/cart/*`
- **Orders**: `/api/v1/orders/*`
- **Wishlist**: `/api/v1/wishlist/*`
- **Reviews**: `/api/v1/reviews/*`
- **Admin**: `/api/v1/admin/*`
- **Upload**: `/api/v1/upload/*`

## Available Services

### 1. Authentication Service (`authService.js`)

```javascript
import authService from './services/authService';

// Login
const result = await authService.login(email, password);
// Returns: { access_token, refresh_token, user, token_type }

// Register
const result = await authService.register({
  email: 'user@example.com',
  username: 'username',
  password: 'password123',
  first_name: 'John',
  last_name: 'Doe'
});

// Get current user
const user = await authService.getCurrentUser();

// Update profile
const updated = await authService.updateProfile({
  username: 'newusername',
  first_name: 'Jane'
});

// Refresh token
const tokens = await authService.refreshToken();

// Logout
await authService.logout();

// Check authentication status
const isAuth = authService.isAuthenticated();

// Get stored user
const user = authService.getStoredUser();

// Get access token
const token = authService.getAccessToken();
```

### 2. Product Service (`productService.js`)

```javascript
import productService from './services/productService';

// Get all products with filters
const products = await productService.getAllProducts({
  category_id: 'category-1',
  skip: 0,
  limit: 10,
  search: 'laptop'
});

// Get single product
const product = await productService.getProductById('product-id');

// Create product (Admin)
const newProduct = await productService.createProduct({
  name: 'Product Name',
  description: 'Product Description',
  price: 99.99,
  category_id: 'category-id',
  stock: 50,
  sku: 'SKU123',
  image_url: 'https://example.com/image.jpg'
});

// Update product (Admin)
const updated = await productService.updateProduct('product-id', {
  price: 89.99,
  stock: 45
});

// Delete product (Admin)
await productService.deleteProduct('product-id');

// Get categories
const categories = await productService.getCategories();

// Create category (Admin)
const newCategory = await productService.createCategory({
  name: 'Electronics',
  description: 'Electronic devices',
  image_url: 'https://example.com/category.jpg'
});
```

### 3. Cart Service (`cartService.js`)

```javascript
import cartService from './services/cartService';

// Get cart
const cart = await cartService.getCart();
// Returns: { id, user_id, items: [...], total_price, created_at, updated_at }

// Add to cart
const updatedCart = await cartService.addToCart('product-id', 2);

// Update item quantity
const updatedCart = await cartService.updateCartItem('product-id', 5);

// Remove from cart
const updatedCart = await cartService.removeFromCart('product-id');

// Clear cart
await cartService.clearCart();
```

### 4. Order Service (`orderService.js`)

```javascript
import orderService from './services/orderService';

// Get all orders (filtered)
const orders = await orderService.getAllOrders({
  status: 'pending',
  skip: 0,
  limit: 10
});

// Get single order
const order = await orderService.getOrderById('order-id');

// Create order
const newOrder = await orderService.createOrder({
  shipping_address: '123 Main St',
  billing_address: '123 Main St',
  notes: 'Please deliver carefully'
});

// Update order status (Admin)
const updated = await orderService.updateOrderStatus('order-id', 'shipped');

// Update payment status (Admin)
const updated = await orderService.updatePaymentStatus('order-id', 'completed');

// Cancel order
const cancelled = await orderService.cancelOrder('order-id');
```

### 5. Wishlist Service (`wishlistService.js`)

```javascript
import wishlistService from './services/wishlistService';

// Get wishlist
const wishlist = await wishlistService.getWishlist();

// Add to wishlist
const updated = await wishlistService.addToWishlist('product-id');

// Remove from wishlist
const updated = await wishlistService.removeFromWishlist('product-id');

// Check if in wishlist
const isInWishlist = await wishlistService.isInWishlist('product-id');
```

### 6. Review Service (`reviewService.js`)

```javascript
import reviewService from './services/reviewService';

// Create review
const review = await reviewService.createReview({
  product_id: 'product-id',
  rating: 5,
  title: 'Great Product!',
  comment: 'This product is amazing'
});

// Get product reviews
const reviews = await reviewService.getProductReviews('product-id', 0, 10);

// Update review
const updated = await reviewService.updateReview('review-id', {
  rating: 4,
  title: 'Still Good',
  comment: 'Updated comment'
});

// Delete review
await reviewService.deleteReview('review-id');
```

### 7. Admin Service (`adminService.js`)

```javascript
import adminService from './services/adminService';

// Get dashboard
const dashboard = await adminService.getDashboard();

// Get all orders (Admin)
const orders = await adminService.getAllOrders(0, 10);

// Get all users (Admin)
const users = await adminService.getAllUsers(0, 10);

// Toggle user status (Admin)
const updated = await adminService.toggleUserStatus('user-id');

// Get sales analytics (Admin)
const analytics = await adminService.getSalesAnalytics('2024-01-01', '2024-12-31');

// Get inventory report (Admin)
const inventory = await adminService.getInventoryReport();
```

### 8. Upload Service (`uploadService.js`)

```javascript
import uploadService from './services/uploadService';

// Upload product image
const result = await uploadService.uploadProductImage(file);
// Returns: { file_path, file_size, file_type }

// Upload category image
const result = await uploadService.uploadCategoryImage(file);
// Returns: { file_path, file_size, file_type }
```

## Using Services in Components

### Example: Login Component

```javascript
import { useState } from 'react';
import authService from '../services/authService';

export default function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(email, password);
      console.log('Login successful:', result.user);
      // Navigate to home or dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Example: Product List Component

```javascript
import { useState, useEffect } from 'react';
import productService from '../services/productService';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts({ limit: 20 });
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="products">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image_url} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="price">${product.price}</p>
          <p className="stock">Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example: Cart Component

```javascript
import { useState, useEffect } from 'react';
import cartService from '../services/cartService';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await cartService.getCart();
        setCart(data);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const updated = await cartService.updateCartItem(productId, quantity);
      setCart(updated);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const updated = await cartService.removeFromCart(productId);
      setCart(updated);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) return <div>Loading cart...</div>;
  if (!cart || cart.items.length === 0) return <div>Cart is empty</div>;

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cart.items.map((item) => (
        <div key={item.product_id} className="cart-item">
          <h3>{item.product_id}</h3>
          <p>Price: ${item.price}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleUpdateQuantity(item.product_id, parseInt(e.target.value))}
            min="1"
          />
          <button onClick={() => handleRemoveItem(item.product_id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${cart.total_price}</h3>
    </div>
  );
}
```

## Error Handling

All services throw errors with descriptive messages. Always wrap service calls in try-catch blocks:

```javascript
try {
  const data = await productService.getAllProducts();
} catch (error) {
  console.error('Error:', error.message);
  // Display error to user
}
```

## Authentication

All services automatically include the JWT token from localStorage if available. The token is included in the `Authorization: Bearer <token>` header.

Token is stored in:
- `localStorage.getItem('access_token')` - JWT access token
- `localStorage.getItem('refresh_token')` - JWT refresh token
- `localStorage.getItem('user')` - User data

## CORS Configuration

Ensure your FastAPI backend has CORS enabled for `http://localhost:3000` (or your frontend URL).

In your backend settings:
```python
CORS_ORIGINS = ["http://localhost:3000"]
```

## Common Issues

### 1. 401 Unauthorized
- Token has expired: Call `authService.refreshToken()`
- No token provided: Ensure user is logged in

### 2. 403 Forbidden
- User doesn't have admin privileges required for the operation
- Check user role is "admin" for admin-only endpoints

### 3. CORS Errors
- Backend CORS settings don't include your frontend URL
- Check `CORS_ORIGINS` in backend `.env` or settings

### 4. Network Errors
- Backend is not running on `localhost:8000`
- Check backend is started: `uvicorn main:app --reload --port 8000`

## Best Practices

1. **Always handle errors**: Wrap service calls in try-catch
2. **Show loading states**: Disable buttons/forms while loading
3. **Cache data when appropriate**: Store products, categories locally
4. **Implement token refresh**: Auto-refresh expired tokens
5. **Validate input**: Check data before sending to backend
6. **Use proper HTTP methods**: GET for reading, POST for creating, PUT for updating, DELETE for deleting
