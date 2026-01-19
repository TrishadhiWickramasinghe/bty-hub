# BTY-HUB Modern Design System - Brown Theme

## 🎨 Color Palette

### Primary Colors (Brand Identity)
- **Dark Chocolate Brown** `#4E342E` - Header, footer, main buttons
- **Coffee Brown** `#6D4C41` - Secondary buttons, highlights
- **Warm Brown** `#8D6E63` - Cards, product borders

### Secondary / Supporting Colors
- **Caramel Brown** `#A1887F` - Hover states, icons
- **Light Caramel** `#D7CCBA` - Subtle backgrounds

### Background Colors
- **Cream Beige** `#F5F0EB` - Main background
- **Soft Sand** `#EFE6DC` - Sections, product grids
- **Very Light** `#FAFAF8` - Subtle elevation

### Text Colors
- **Dark Espresso** `#3E2723` - Main text
- **Muted Brown Gray** `#7A6C66` - Descriptions, labels
- **Light Brown** `#9D8B85` - Secondary text

### Accent / CTA Colors
- **Golden Tan** `#C8A165` - "Buy Now", "Add to Cart" buttons
- **Burnt Orange** `#D17A22` - Offers, discounts, badges

### Status Colors
- **Success** `#27AE60` - Positive actions
- **Warning** `#F39C12` - Alerts, caution
- **Danger** `#E74C3C` - Errors, destructive actions
- **Info** `#3498DB` - Information

## 📏 Spacing System

All spacing follows a consistent 4px base unit:
- `xs` (var(--spacing-xs)) - 0.25rem (4px)
- `sm` (var(--spacing-sm)) - 0.5rem (8px)
- `md` (var(--spacing-md)) - 1rem (16px)
- `lg` (var(--spacing-lg)) - 1.5rem (24px)
- `xl` (var(--spacing-xl)) - 2rem (32px)
- `2xl` (var(--spacing-2xl)) - 2.5rem (40px)
- `3xl` (var(--spacing-3xl)) - 3rem (48px)

## 🎯 Border Radius

- `xs` (var(--radius-xs)) - 4px
- `sm` (var(--radius-sm)) - 8px
- `md` (var(--radius-md)) - 12px
- `lg` (var(--radius-lg)) - 16px
- `xl` (var(--radius-xl)) - 24px
- `full` (var(--radius-full)) - 9999px (perfect circles)

## 🌈 Shadow System

Modern elevation with brown theme adjustments:
- `shadow-xs` - Minimal elevation
- `shadow-sm` - Small components
- `shadow-md` - Default elevation
- `shadow-lg` - Medium emphasis
- `shadow-xl` - High emphasis
- `shadow-2xl` - Maximum depth

## ⚡ Transitions

Smooth animations with consistent timing:
- `transition-fast` - 150ms (micro interactions)
- `transition-normal` - 250ms (standard animations)
- `transition-slow` - 350ms (important transitions)

## 🧩 Component Styling Guide

### Buttons

#### Primary Button (.btn-primary)
```html
<button class="btn-primary">Primary Action</button>
```
- Gradient background (Dark Chocolate to Coffee Brown)
- White text
- Hover: Lifts up, stronger shadow

#### CTA Button (.btn-cta)
```html
<button class="btn-cta">Buy Now</button>
```
- Golden Tan background
- Dark Chocolate text
- Maximum visual prominence

#### Secondary Button (.btn-secondary)
```html
<button class="btn-secondary">Secondary</button>
```
- Transparent background
- Brown border and text
- Hover: Fills background with color

### Cards

#### Standard Card (.card)
```html
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">Content</div>
  <div class="card-footer">Actions</div>
</div>
```
- White background with rounded corners
- Subtle border and shadow
- Hover: Stronger shadow, gold border

#### Product Card (.product-card)
```html
<div class="product-card">
  <div class="product-image-wrapper">
    <img src="..." alt="...">
  </div>
  <div class="product-body">
    <h5 class="product-name">Product Name</h5>
    <div class="product-price-section">
      <span class="product-price">$49.99</span>
    </div>
  </div>
</div>
```
- Image container with zoom on hover
- Gradient pricing accent
- Call-to-action buttons in gold

#### Stat Card (.stat-card)
```html
<div class="stat-card primary">
  <div class="stat-icon">📊</div>
  <div class="stat-value">1,234</div>
  <div class="stat-label">Total Orders</div>
</div>
```
- Centered content
- Large numerical display
- Optional change indicator

### Forms

#### Form Group
```html
<div class="form-group">
  <label class="form-label required">Email</label>
  <input type="email" class="form-input">
  <span class="form-help">We'll never share your email</span>
</div>
```
- Consistent spacing
- Clear labels with optional required indicator
- Focus states with gold accent
- Support for error/success states

#### Form Row (Multi-column)
```html
<div class="form-row two-columns">
  <div class="form-group">...</div>
  <div class="form-group">...</div>
</div>
```
- Responsive grid layout
- Auto-stacks on mobile
- Options: `.two-columns`, `.three-columns`

### Navigation

#### Navbar
- Gradient background (Dark Chocolate to Coffee Brown)
- Gold accent border
- Links with underline hover effect
- Cart badge in Burnt Orange

#### Sidebar
- Full-height navigation
- Gradient background matching navbar
- Active indicator with gold accent
- Submenu support with chevron toggle
- Collapse animation for mobile

### Footer

- Gradient background matching navbar
- Gold accent border
- Section titles with gold underline
- Social icon buttons with hover lift effect
- Newsletter subscription form

## 📱 Responsive Design

### Breakpoints
- Mobile: < 576px
- Tablet: 576px - 768px
- Desktop: 768px - 992px
- Wide: ≥ 992px

### Responsive Classes
```html
<!-- Hide on mobile -->
<div class="d-md-none">Desktop only</div>

<!-- Show only on mobile -->
<div class="d-md-flex">Mobile only</div>

<!-- Stack on mobile -->
<div class="flex-md-column">Stack on tablet</div>
```

## 🎯 Usage Examples

### Hero Section
```html
<section class="section loose bg-cream">
  <div class="container">
    <h1 class="section-title">Welcome to BTY-HUB</h1>
    <p class="section-subtitle">Premium products at affordable prices</p>
    <button class="btn-cta">Shop Now</button>
  </div>
</section>
```

### Product Grid
```html
<section class="section">
  <div class="container">
    <div class="product-grid">
      <div class="product-card">...</div>
      <!-- More products -->
    </div>
  </div>
</section>
```

### Admin Dashboard
```html
<div class="d-grid gap-3">
  <div class="stat-card primary">
    <div class="stat-icon">📦</div>
    <div class="stat-value">156</div>
    <div class="stat-label">Products</div>
    <div class="stat-change positive">+12% from last month</div>
  </div>
  <!-- More stats -->
</div>
```

## 🎨 Customization

All colors and spacing are defined as CSS variables in `theme.css`. To customize:

1. **Colors**: Modify variables in `:root` section
2. **Spacing**: Adjust `--spacing-*` variables
3. **Border Radius**: Change `--radius-*` values
4. **Shadows**: Update shadow definitions
5. **Transitions**: Modify animation speeds

Example:
```css
:root {
  --accent-gold: #C8A165; /* Change to your color */
  --spacing-md: 1rem;     /* Change base spacing */
}
```

## 📁 File Structure

```
src/styles/
├── theme.css           # Color palette & variables
├── navbar.css          # Navigation styling
├── admin-header.css    # Admin panel header
├── sidebar.css         # Sidebar navigation
├── product-card.css    # Product card styling
├── footer.css          # Footer styling
├── buttons.css         # Button components
├── forms.css           # Form elements
├── cards.css           # Card components
└── utilities.css       # Helper classes
```

## ✨ Best Practices

1. **Always use CSS variables** - Don't hardcode colors
2. **Follow spacing rhythm** - Use predefined spacing units
3. **Maintain accessibility** - Ensure sufficient color contrast
4. **Test responsively** - Check all breakpoints
5. **Use semantic HTML** - Structure content meaningfully
6. **Optimize animations** - Keep transitions under 300ms
7. **Mobile-first approach** - Design for mobile, enhance for desktop

## 🔧 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Android Chrome 79+

## 📝 Notes

- All colors are WCAG AA compliant for accessibility
- Transitions respect `prefers-reduced-motion` media query
- Dark mode support available via media query
- Font sizes are responsive (base 16px)
- Images use `object-fit: cover` for consistent aspect ratios
