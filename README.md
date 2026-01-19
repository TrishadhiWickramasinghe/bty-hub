# 🛍️ BTY-HUB - Modern E-Commerce Platform

A premium, fully-featured e-commerce platform built with React, featuring a sophisticated dark-themed interface with a warm brown color palette. BTY-HUB offers seamless shopping experiences for customers and comprehensive management tools for administrators.

## ✨ Features

### Customer Features
- 🏪 **Product Browsing** - Browse products with advanced filtering and search
- 🛒 **Shopping Cart** - Add/remove items with real-time quantity updates
- 💳 **Secure Checkout** - Safe payment processing and order confirmation
- 👤 **User Authentication** - Register, login, and manage account
- 📦 **Order Management** - Track orders and view order history
- ⭐ **Product Reviews** - Leave ratings and reviews for products
- 🎁 **Wishlist** - Save favorite products for later
- 🔔 **Notifications** - Real-time order and promotional updates

### Admin Features
- 📊 **Dashboard** - Overview of sales, orders, and metrics
- 📦 **Product Management** - Add, edit, delete products with images
- 📋 **Order Management** - View, process, and fulfill orders
- 👥 **Customer Management** - Manage customer accounts and data
- 💰 **Sales Analytics** - Detailed sales reports and insights
- 🏷️ **Category Management** - Organize products by categories
- 📈 **Inventory Tracking** - Monitor stock levels and availability
- 🎨 **Promotional Tools** - Manage discounts, offers, and campaigns

## 🎨 Design System

### Premium Brown Color Palette
- **Dark Chocolate Brown** (#4E342E) - Primary branding
- **Coffee Brown** (#6D4C41) - Secondary elements
- **Warm Brown** (#8D6E63) - Cards and borders
- **Golden Tan** (#C8A165) - CTA buttons and accents
- **Cream Beige** (#F5F0EB) - Clean backgrounds
- **Burnt Orange** (#D17A22) - Alerts and discounts

### Key Design Elements
- ✅ Rounded corners (12px - 24px radius)
- ✅ Smooth transitions and animations
- ✅ Premium shadows and depth
- ✅ Modern typography hierarchy
- ✅ Responsive grid layouts
- ✅ Dark hero sections with floating animations
- ✅ Glass-morphism effects
- ✅ Accessible color contrast

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for detailed design documentation.

## 🛠️ Tech Stack

### Frontend
- **React** 18.x - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **CSS3** - Custom modern styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Server framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File uploads

## 📁 Project Structure

```
bty-hub/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminHeader.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Loader.jsx
│   │   └── customer/
│   │       ├── ProductCard.jsx
│   │       └── CartItem.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Users.jsx
│   │   │   └── Reports.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── customer/
│   │       ├── Home.jsx
│   │       ├── ProductList.jsx
│   │       ├── ProductDetails.jsx
│   │       ├── Cart.jsx
│   │       ├── Checkout.jsx
│   │       ├── Orders.jsx
│   │       └── Profile.jsx
│   ├── routes/
│   │   ├── AdminRoutes.jsx
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoutes.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── orderService.js
│   │   └── productService.js
│   ├── styles/
│   │   ├── theme.css
│   │   ├── hero.css
│   │   ├── navbar.css
│   │   ├── admin-header.css
│   │   ├── sidebar.css
│   │   ├── product-card.css
│   │   ├── footer.css
│   │   ├── buttons.css
│   │   ├── forms.css
│   │   ├── cards.css
│   │   └── utilities.css
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── DESIGN_SYSTEM.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bty-hub.git
   cd bty-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   The app will open at [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### `npm start`
Runs the app in development mode with hot reload.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production with optimization and minification.

### `npm run eject`
⚠️ **Note**: This is irreversible. Ejects from Create React App configuration.

## 🎯 Usage

### For Customers
1. Browse products on the landing page
2. Use search and filters to find items
3. Add products to cart
4. Proceed to checkout
5. Create account or login
6. Complete purchase
7. Track orders in profile

### For Administrators
1. Login with admin credentials
2. Access dashboard from top navigation
3. Manage products, orders, and customers
4. View analytics and reports
5. Manage promotions and discounts

## 🎨 Customizing Styles

All colors and styles are defined as CSS variables in `src/styles/theme.css`:

```css
:root {
  --primary-dark: #4E342E;
  --accent-gold: #C8A165;
  --bg-cream: #F5F0EB;
  /* ... more variables */
}
```

Modify these variables to change the entire theme.

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: < 576px
- Tablet: 576px - 768px
- Desktop: 768px - 992px
- Large Desktop: ≥ 992px

## 🔒 Security

- JWT token-based authentication
- Secure password hashing
- HTTPS ready
- XSS protection
- CSRF protection
- Input validation
- Secure payment gateway integration

## 🚀 Performance

- Code splitting
- Lazy loading
- Image optimization
- CSS minification
- Bundle size optimization
- Caching strategies

## 📚 Documentation

- [Design System Guide](DESIGN_SYSTEM.md) - Complete design system documentation
- [API Documentation](docs/API.md) - Backend API endpoints
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Code style
- Commit conventions
- Pull request process
- Development workflow

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer** - Your Name
- **Designer** - Design Team
- **QA** - Testing Team

## 📞 Support

For support, email support@btyhub.com or create an issue in the repository.

## 🙏 Acknowledgments

- React community for amazing libraries
- Design inspiration from premium e-commerce platforms
- Icons from React Icons library
- Color palette from modern design systems

---

**Happy Shopping! 🎉**

Made with ❤️ by the BTY-HUB Team
