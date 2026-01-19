// Utility Helper Functions for BTY-HUB E-commerce Platform
// Reusable functions for formatting, validation, calculations, etc.

// ==================== FORMATTING FUNCTIONS ====================

/**
 * Format currency with locale
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'medium', 'long', 'relative'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Relative formatting (e.g., "2 days ago")
  if (format === 'relative') {
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes <= 1 ? 'just now' : `${diffMinutes} minutes ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
  
  // Standard formatting
  const options = {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    medium: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    long: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }
  };
  
  return dateObj.toLocaleDateString('en-US', options[format] || options.medium);
};

/**
 * Format phone number
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length > 11) {
    return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }
  
  return phone; // Return original if format doesn't match
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Validation result
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and messages
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    score: 0,
    messages: [],
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  };
  
  if (!password) return result;
  
  // Check length
  if (password.length >= 8) {
    result.score += 1;
    result.requirements.length = true;
  } else {
    result.messages.push('Password must be at least 8 characters long');
  }
  
  // Check uppercase
  if (/[A-Z]/.test(password)) {
    result.score += 1;
    result.requirements.uppercase = true;
  } else {
    result.messages.push('Password must contain at least one uppercase letter');
  }
  
  // Check lowercase
  if (/[a-z]/.test(password)) {
    result.score += 1;
    result.requirements.lowercase = true;
  } else {
    result.messages.push('Password must contain at least one lowercase letter');
  }
  
  // Check number
  if (/[0-9]/.test(password)) {
    result.score += 1;
    result.requirements.number = true;
  } else {
    result.messages.push('Password must contain at least one number');
  }
  
  // Check special character
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    result.score += 1;
    result.requirements.special = true;
  } else {
    result.messages.push('Password must contain at least one special character');
  }
  
  // Calculate strength
  if (result.score >= 4) {
    result.isValid = true;
  }
  
  return result;
};

/**
 * Validate credit card number
 * @param {string} cardNumber - Credit card number
 * @returns {Object} Validation result
 */
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) {
    return { isValid: false, type: 'unknown', message: 'Card number is required' };
  }
  
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/\s|-/g, '');
  
  // Check if it's all digits and proper length
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, type: 'unknown', message: 'Card number must contain only digits' };
  }
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { isValid: false, type: 'unknown', message: 'Card number must be between 13 and 19 digits' };
  }
  
  // Luhn algorithm for validation
  let sum = 0;
  let isSecond = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (isSecond) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isSecond = !isSecond;
  }
  
  const isValidLuhn = sum % 10 === 0;
  
  // Determine card type
  let cardType = 'unknown';
  
  if (/^4/.test(cleaned)) {
    cardType = 'visa';
  } else if (/^5[1-5]/.test(cleaned)) {
    cardType = 'mastercard';
  } else if (/^3[47]/.test(cleaned)) {
    cardType = 'amex';
  } else if (/^6(?:011|5)/.test(cleaned)) {
    cardType = 'discover';
  } else if (/^3(?:0[0-5]|[68])/.test(cleaned)) {
    cardType = 'diners';
  } else if (/^(?:2131|1800|35)/.test(cleaned)) {
    cardType = 'jcb';
  }
  
  return {
    isValid: isValidLuhn,
    type: cardType,
    message: isValidLuhn ? 'Valid card number' : 'Invalid card number',
    formatted: formatCreditCardNumber(cleaned)
  };
};

/**
 * Format credit card number for display
 * @param {string} cardNumber - Raw card number
 * @returns {string} Formatted card number
 */
export const formatCreditCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.replace(/\s|-/g, '');
  const parts = [];
  
  for (let i = 0; i < cleaned.length; i += 4) {
    parts.push(cleaned.substring(i, i + 4));
  }
  
  return parts.join(' ');
};

/**
 * Validate CVV
 * @param {string} cvv - CVV number
 * @param {string} cardType - Type of credit card
 * @returns {boolean} Validation result
 */
export const validateCVV = (cvv, cardType = 'visa') => {
  if (!cvv) return false;
  
  const cleaned = cvv.replace(/\D/g, '');
  
  // American Express uses 4-digit CVV, others use 3-digit
  const expectedLength = cardType === 'amex' ? 4 : 3;
  
  return cleaned.length === expectedLength && /^\d+$/.test(cleaned);
};

/**
 * Validate expiration date
 * @param {string} expiry - Expiration date (MM/YY)
 * @returns {Object} Validation result
 */
export const validateExpiryDate = (expiry) => {
  if (!expiry) {
    return { isValid: false, message: 'Expiration date is required' };
  }
  
  const [month, year] = expiry.split('/').map(str => str.trim());
  
  if (!month || !year || month.length !== 2 || year.length !== 2) {
    return { isValid: false, message: 'Please use MM/YY format' };
  }
  
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  if (monthNum < 1 || monthNum > 12) {
    return { isValid: false, message: 'Month must be between 01 and 12' };
  }
  
  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return { isValid: false, message: 'Card has expired' };
  }
  
  if (yearNum > currentYear + 20) {
    return { isValid: false, message: 'Expiration date too far in future' };
  }
  
  return { isValid: true, message: 'Valid expiration date' };
};

// ==================== CALCULATION FUNCTIONS ====================

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} salePrice - Sale price
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }
  
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Calculate tax amount
 * @param {number} amount - Amount before tax
 * @param {number} taxRate - Tax rate as percentage (default: 8%)
 * @returns {number} Tax amount
 */
export const calculateTax = (amount, taxRate = 8) => {
  if (!amount || amount <= 0) return 0;
  return (amount * taxRate) / 100;
};

/**
 * Calculate shipping cost
 * @param {number} subtotal - Order subtotal
 * @param {number} freeShippingThreshold - Threshold for free shipping (default: 50)
 * @param {number} shippingCost - Standard shipping cost (default: 5.99)
 * @returns {number} Shipping cost
 */
export const calculateShipping = (subtotal, freeShippingThreshold = 50, shippingCost = 5.99) => {
  if (!subtotal || subtotal <= 0) return 0;
  return subtotal >= freeShippingThreshold ? 0 : shippingCost;
};

/**
 * Calculate order total
 * @param {Object} order - Order object with subtotal, tax, shipping
 * @returns {number} Total amount
 */
export const calculateOrderTotal = (order) => {
  const subtotal = order.subtotal || 0;
  const tax = order.tax || calculateTax(subtotal);
  const shipping = order.shipping || calculateShipping(subtotal);
  const discount = order.discount || 0;
  
  return subtotal + tax + shipping - discount;
};

/**
 * Calculate average rating
 * @param {Array} reviews - Array of review objects with rating property
 * @returns {number} Average rating
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return 0;
  }
  
  const sum = reviews.reduce((total, review) => {
    return total + (review.rating || 0);
  }, 0);
  
  return parseFloat((sum / reviews.length).toFixed(1));
};

// ==================== ARRAY & OBJECT FUNCTIONS ====================

/**
 * Remove duplicates from array
 * @param {Array} array - Input array
 * @param {string} key - Key to check for duplicates (optional)
 * @returns {Array} Array without duplicates
 */
export const removeDuplicates = (array, key) => {
  if (!Array.isArray(array)) return [];
  
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
  
  return [...new Set(array)];
};

/**
 * Sort array by property
 * @param {Array} array - Array to sort
 * @param {string} property - Property to sort by
 * @param {string} order - Sort order: 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortByProperty = (array, property, order = 'asc') => {
  if (!Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    let aValue = a[property];
    let bValue = b[property];
    
    // Handle undefined/null values
    if (aValue === undefined || aValue === null) aValue = '';
    if (bValue === undefined || bValue === null) bValue = '';
    
    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by property
 * @param {Array} array - Array to group
 * @param {string} property - Property to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, property) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

/**
 * Paginate array
 * @param {Array} array - Array to paginate
 * @param {number} page - Current page (1-indexed)
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination result
 */
export const paginate = (array, page = 1, itemsPerPage = 10) => {
  if (!Array.isArray(array)) {
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: false
    };
  }
  
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    items: array.slice(startIndex, endIndex),
    totalItems,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Deep clone object or array
 * @param {*} obj - Object or array to clone
 * @returns {*} Deep cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const clonedObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

// ==================== STRING FUNCTIONS ====================

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate order ID
 * @param {string} prefix - Order prefix (default: 'ORD')
 * @returns {string} Order ID
 */
export const generateOrderId = (prefix = 'ORD') => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generate SKU
 * @param {string} category - Product category
 * @param {number} id - Product ID
 * @returns {string} SKU string
 */
export const generateSKU = (category, id) => {
  const categoryCode = category ? category.substring(0, 3).toUpperCase() : 'PRO';
  const paddedId = id.toString().padStart(6, '0');
  return `${categoryCode}-${paddedId}`;
};

/**
 * Slugify string for URLs
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

// ==================== STORAGE FUNCTIONS ====================

/**
 * Save data to localStorage with expiry
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @param {number} ttl - Time to live in milliseconds
 */
export const setWithExpiry = (key, value, ttl = 24 * 60 * 60 * 1000) => {
  const item = {
    value: value,
    expiry: Date.now() + ttl
  };
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Get data from localStorage with expiry check
 * @param {string} key - Storage key
 * @returns {*} Stored value or null if expired
 */
export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  
  if (!itemStr) return null;
  
  try {
    const item = JSON.parse(itemStr);
    
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    return null;
  }
};

/**
 * Clear expired items from localStorage
 */
export const clearExpiredStorage = () => {
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith('btyhub_')) {
      getWithExpiry(key); // This will auto-remove if expired
    }
  });
};

// ==================== DOM & UI FUNCTIONS ====================

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Download file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} type - MIME type
 */
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ==================== PRODUCT & E-COMMERCE FUNCTIONS ====================

/**
 * Filter products by criteria
 * @param {Array} products - Products array
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered products
 */
export const filterProducts = (products, filters = {}) => {
  if (!Array.isArray(products)) return [];
  
  return products.filter(product => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    // Price range filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }
    
    // Stock filter
    if (filters.inStockOnly && product.stock <= 0) {
      return false;
    }
    
    // Rating filter
    if (filters.minRating !== undefined && (product.rating || 0) < filters.minRating) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchFields = ['name', 'description', 'category', 'sku'];
      const hasMatch = searchFields.some(field => {
        const fieldValue = product[field] || '';
        return fieldValue.toString().toLowerCase().includes(searchLower);
      });
      
      if (!hasMatch) return false;
    }
    
    // Featured filter
    if (filters.featuredOnly && !product.isFeatured) {
      return false;
    }
    
    return true;
  });
};

/**
 * Calculate cart totals
 * @param {Array} cartItems - Cart items array
 * @returns {Object} Cart totals
 */
export const calculateCartTotals = (cartItems) => {
  if (!Array.isArray(cartItems)) {
    return {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      itemsCount: 0
    };
  }
  
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);
  
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const itemsCount = cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    discount: 0,
    total: parseFloat((subtotal + tax + shipping).toFixed(2)),
    itemsCount
  };
};

/**
 * Get product rating stars
 * @param {number} rating - Rating value (0-5)
 * @returns {Array} Array of star objects
 */
export const getRatingStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push({ type: 'full', key: i });
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push({ type: 'half', key: i });
    } else {
      stars.push({ type: 'empty', key: i });
    }
  }
  
  return stars;
};

// ==================== ERROR HANDLING FUNCTIONS ====================

/**
 * Handle API errors gracefully
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Session expired. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Conflict occurred. Please try again.';
      case 422:
        return data.errors ? Object.values(data.errors).join(' ') : 'Validation failed.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return data.message || `Error ${status}: ${data.statusText || 'Unknown error'}`;
    }
  }
  
  if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection and try again.';
  }
  
  // Something else happened
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Safe JSON parse
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed value or default
 */
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return defaultValue;
  }
};

// ==================== EXPORT ALL FUNCTIONS ====================

export default {
  // Formatting
  formatCurrency,
  formatDate,
  formatPhoneNumber,
  truncateText,
  formatFileSize,
  
  // Validation
  isValidEmail,
  validatePassword,
  validateCreditCard,
  formatCreditCardNumber,
  validateCVV,
  validateExpiryDate,
  
  // Calculations
  calculateDiscount,
  calculateTax,
  calculateShipping,
  calculateOrderTotal,
  calculateAverageRating,
  
  // Array & Object
  removeDuplicates,
  sortByProperty,
  groupBy,
  paginate,
  deepClone,
  
  // String
  generateRandomString,
  generateOrderId,
  generateSKU,
  slugify,
  
  // Storage
  setWithExpiry,
  getWithExpiry,
  clearExpiredStorage,
  
  // DOM & UI
  debounce,
  throttle,
  copyToClipboard,
  downloadFile,
  
  // E-commerce specific
  filterProducts,
  calculateCartTotals,
  getRatingStars,
  
  // Error handling
  handleApiError,
  safeJsonParse
};