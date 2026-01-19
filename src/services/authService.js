// Authentication Service for BTY-HUB
// This service handles all authentication-related API calls
// In production, replace mock functions with actual API calls

// Base URL for API (change to your backend URL in production)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.btyhub.com';

// Mock users database for development
const mockUsers = [
  {
    id: 1,
    email: 'admin@btyhub.com',
    password: 'admin123', // In production, this would be hashed
    name: 'Admin User',
    phone: '+1 (555) 123-4567',
    address: '123 Admin Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    role: 'admin',
    emailVerified: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    avatar: 'https://i.pravatar.cc/150?img=1',
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      newsletter: true
    }
  },
  {
    id: 2,
    email: 'customer@example.com',
    password: 'customer123',
    name: 'John Doe',
    phone: '+1 (555) 987-6543',
    address: '456 Customer Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'United States',
    role: 'customer',
    emailVerified: true,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
    avatar: 'https://i.pravatar.cc/150?img=2',
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      newsletter: true
    }
  }
];

// Mock tokens storage
const mockTokens = {
  'admin@btyhub.com': 'mock-admin-token-123456',
  'customer@example.com': 'mock-customer-token-789012'
};

// Helper function to simulate API delay
const simulateApiDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to generate JWT token (mock)
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  
  // In production, use a proper JWT library like jsonwebtoken
  return btoa(JSON.stringify(payload)) + '.mock.signature';
};

// Helper function to decode token (mock)
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[0];
    return JSON.parse(atob(payload));
  } catch (error) {
    return null;
  }
};

const authService = {
  // ==================== AUTHENTICATION ====================
  
  /**
   * Login user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data and token
   */
  login: async (email, password) => {
    await simulateApiDelay(800); // Simulate network delay
    
    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check password (in production, compare hashed passwords)
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
      expiresIn: 3600 // Token expires in 1 hour
    };
  },
  
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user data
   */
  register: async (userData) => {
    await simulateApiDelay(800);
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Name, email, and password are required');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // Validate password strength
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      email: userData.email,
      password: userData.password, // In production, hash this password
      name: userData.name,
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || '',
      state: userData.state || '',
      zipCode: userData.zipCode || '',
      country: userData.country || 'United States',
      role: 'customer',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatar: `https://i.pravatar.cc/150?img=${mockUsers.length + 3}`,
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        newsletter: true
      }
    };
    
    // Add to mock database
    mockUsers.push(newUser);
    
    // Generate token
    const token = generateToken(newUser);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      user: userWithoutPassword,
      token,
      expiresIn: 3600
    };
  },
  
  /**
   * Logout user (invalidate token on server side in production)
   * @param {string} token - User's authentication token
   * @returns {Promise<boolean>} Success status
   */
  logout: async (token) => {
    await simulateApiDelay(300);
    
    // In production, make API call to invalidate token
    // For now, just return success
    return true;
  },
  
  // ==================== PASSWORD MANAGEMENT ====================
  
  /**
   * Request password reset
   * @param {string} email - User's email
   * @returns {Promise<boolean>} Success status
   */
  forgotPassword: async (email) => {
    await simulateApiDelay(800);
    
    // Check if user exists
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return true;
    }
    
    // In production, send reset password email
    // Generate reset token and send email
    
    return true;
  },
  
  /**
   * Reset password with token
   * @param {string} token - Reset password token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  resetPassword: async (token, newPassword) => {
    await simulateApiDelay(800);
    
    // Validate token (in production, decode JWT)
    if (!token || token.length < 10) {
      throw new Error('Invalid or expired reset token');
    }
    
    // Validate password strength
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // In production, find user by token and update password
    // For mock, just return success
    
    return true;
  },
  
  /**
   * Change password while logged in
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} token - Authentication token
   * @returns {Promise<boolean>} Success status
   */
  changePassword: async (currentPassword, newPassword, token) => {
    await simulateApiDelay(800);
    
    // Decode token to get user info
    const decoded = decodeToken(token);
    if (!decoded) {
      throw new Error('Invalid authentication token');
    }
    
    // Find user
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify current password
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // Validate new password
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }
    
    // Update password (in production, hash the password)
    user.password = newPassword;
    user.updatedAt = new Date().toISOString();
    
    return true;
  },
  
  // ==================== USER PROFILE ====================
  
  /**
   * Get current user profile
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} User profile
   */
  getProfile: async (token) => {
    await simulateApiDelay(500);
    
    // Decode token to get user info
    const decoded = decodeToken(token);
    if (!decoded) {
      throw new Error('Invalid authentication token');
    }
    
    // Find user
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  },
  
  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Updated user profile
   */
  updateProfile: async (profileData, token) => {
    await simulateApiDelay(800);
    
    // Decode token to get user info
    const decoded = decodeToken(token);
    if (!decoded) {
      throw new Error('Invalid authentication token');
    }
    
    // Find user
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update allowed fields
    const allowedFields = ['name', 'phone', 'address', 'city', 'state', 'zipCode', 'country', 'avatar'];
    
    allowedFields.forEach(field => {
      if (profileData[field] !== undefined) {
        user[field] = profileData[field];
      }
    });
    
    user.updatedAt = new Date().toISOString();
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  },
  
  /**
   * Update user preferences
   * @param {Object} preferences - Updated preferences
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Updated preferences
   */
  updatePreferences: async (preferences, token) => {
    await simulateApiDelay(500);
    
    // Decode token to get user info
    const decoded = decodeToken(token);
    if (!decoded) {
      throw new Error('Invalid authentication token');
    }
    
    // Find user
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update preferences
    if (preferences.emailNotifications !== undefined) {
      user.preferences.emailNotifications = preferences.emailNotifications;
    }
    if (preferences.pushNotifications !== undefined) {
      user.preferences.pushNotifications = preferences.pushNotifications;
    }
    if (preferences.newsletter !== undefined) {
      user.preferences.newsletter = preferences.newsletter;
    }
    
    user.updatedAt = new Date().toISOString();
    
    return user.preferences;
  },
  
  // ==================== VERIFICATION ====================
  
  /**
   * Verify email with token
   * @param {string} verificationToken - Email verification token
   * @returns {Promise<boolean>} Success status
   */
  verifyEmail: async (verificationToken) => {
    await simulateApiDelay(800);
    
    // In production, decode token and find user
    // For mock, just return success
    
    return true;
  },
  
  /**
   * Resend verification email
   * @param {string} email - User's email
   * @returns {Promise<boolean>} Success status
   */
  resendVerificationEmail: async (email) => {
    await simulateApiDelay(500);
    
    // Check if user exists
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }
    
    // In production, send verification email
    
    return true;
  },
  
  // ==================== TOKEN MANAGEMENT ====================
  
  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New tokens
   */
  refreshToken: async (refreshToken) => {
    await simulateApiDelay(500);
    
    // In production, validate refresh token and issue new access token
    // For mock, generate new token
    
    const mockUser = {
      id: 1,
      email: 'user@example.com',
      role: 'customer',
      name: 'Mock User'
    };
    
    const newToken = generateToken(mockUser);
    
    return {
      token: newToken,
      refreshToken: 'new-refresh-token-xyz',
      expiresIn: 3600
    };
  },
  
  /**
   * Validate authentication token
   * @param {string} token - Authentication token
   * @returns {Promise<boolean>} Token validity
   */
  validateToken: async (token) => {
    await simulateApiDelay(300);
    
    try {
      const decoded = decodeToken(token);
      return !!decoded && !!decoded.userId;
    } catch (error) {
      return false;
    }
  },
  
  // ==================== SOCIAL LOGIN ====================
  
  /**
   * Login with Google
   * @param {string} googleToken - Google OAuth token
   * @returns {Promise<Object>} User data and token
   */
  googleLogin: async (googleToken) => {
    await simulateApiDelay(1000);
    
    // In production, verify Google token with Google API
    // For mock, create/return user
    
    const googleUser = {
      id: 100,
      email: 'google.user@example.com',
      name: 'Google User',
      role: 'customer',
      emailVerified: true,
      avatar: 'https://i.pravatar.cc/150?img=10'
    };
    
    const token = generateToken(googleUser);
    
    return {
      user: googleUser,
      token,
      expiresIn: 3600
    };
  },
  
  /**
   * Login with Facebook
   * @param {string} facebookToken - Facebook OAuth token
   * @returns {Promise<Object>} User data and token
   */
  facebookLogin: async (facebookToken) => {
    await simulateApiDelay(1000);
    
    // In production, verify Facebook token with Facebook API
    // For mock, create/return user
    
    const facebookUser = {
      id: 101,
      email: 'facebook.user@example.com',
      name: 'Facebook User',
      role: 'customer',
      emailVerified: true,
      avatar: 'https://i.pravatar.cc/150?img=11'
    };
    
    const token = generateToken(facebookUser);
    
    return {
      user: facebookUser,
      token,
      expiresIn: 3600
    };
  },
  
  // ==================== ADMIN FUNCTIONS ====================
  
  /**
   * Get all users (admin only)
   * @param {string} token - Admin authentication token
   * @returns {Promise<Array>} List of all users
   */
  getAllUsers: async (token) => {
    await simulateApiDelay(800);
    
    // Decode token to check if admin
    const decoded = decodeToken(token);
    if (!decoded || decoded.role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    // Return all users without passwords
    return mockUsers.map(({ password, ...user }) => user);
  },
  
  /**
   * Get user by ID (admin only)
   * @param {number} userId - User ID
   * @param {string} token - Admin authentication token
   * @returns {Promise<Object>} User data
   */
  getUserById: async (userId, token) => {
    await simulateApiDelay(500);
    
    // Decode token to check if admin
    const decoded = decodeToken(token);
    if (!decoded || decoded.role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  },
  
  /**
   * Update user role (admin only)
   * @param {number} userId - User ID
   * @param {string} role - New role (admin/customer)
   * @param {string} token - Admin authentication token
   * @returns {Promise<Object>} Updated user
   */
  updateUserRole: async (userId, role, token) => {
    await simulateApiDelay(500);
    
    // Decode token to check if admin
    const decoded = decodeToken(token);
    if (!decoded || decoded.role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Validate role
    if (!['admin', 'customer'].includes(role)) {
      throw new Error('Invalid role');
    }
    
    user.role = role;
    user.updatedAt = new Date().toISOString();
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  },
  
  /**
   * Delete user (admin only)
   * @param {number} userId - User ID
   * @param {string} token - Admin authentication token
   * @returns {Promise<boolean>} Success status
   */
  deleteUser: async (userId, token) => {
    await simulateApiDelay(500);
    
    // Decode token to check if admin
    const decoded = decodeToken(token);
    if (!decoded || decoded.role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    // Prevent deleting own account
    if (decoded.userId === userId) {
      throw new Error('Cannot delete your own account');
    }
    
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    // Remove user
    mockUsers.splice(index, 1);
    
    return true;
  },
  
  // ==================== UTILITY FUNCTIONS ====================
  
  /**
   * Check if email is available
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} Availability status
   */
  checkEmailAvailability: async (email) => {
    await simulateApiDelay(300);
    
    const existingUser = mockUsers.find(u => u.email === email);
    return !existingUser;
  },
  
  /**
   * Get user statistics (admin only)
   * @param {string} token - Admin authentication token
   * @returns {Promise<Object>} User statistics
   */
  getUserStats: async (token) => {
    await simulateApiDelay(500);
    
    // Decode token to check if admin
    const decoded = decodeToken(token);
    if (!decoded || decoded.role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    const totalUsers = mockUsers.length;
    const activeUsers = mockUsers.filter(u => u.emailVerified).length;
    const adminUsers = mockUsers.filter(u => u.role === 'admin').length;
    const customerUsers = mockUsers.filter(u => u.role === 'customer').length;
    
    // Group by registration date (mock)
    const registrationsByMonth = {
      'Jan': 5,
      'Feb': 8,
      'Mar': 12,
      'Apr': 10
    };
    
    return {
      totalUsers,
      activeUsers,
      adminUsers,
      customerUsers,
      registrationsByMonth
    };
  },
  
  // ==================== SESSION MANAGEMENT ====================
  
  /**
   * Get active sessions for user
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Active sessions
   */
  getActiveSessions: async (token) => {
    await simulateApiDelay(500);
    
    // Decode token to get user info
    const decoded = decodeToken(token);
    if (!decoded) {
      throw new Error('Invalid authentication token');
    }
    
    // Mock active sessions
    return [
      {
        id: 'session-1',
        device: 'Chrome on Windows',
        ip: '192.168.1.1',
        location: 'New York, US',
        lastActive: '2024-01-15T14:30:00Z',
        current: true
      },
      {
        id: 'session-2',
        device: 'Safari on iPhone',
        ip: '192.168.1.2',
        location: 'Los Angeles, US',
        lastActive: '2024-01-14T10:15:00Z',
        current: false
      }
    ];
  },
  
  /**
   * Revoke session
   * @param {string} sessionId - Session ID to revoke
   * @param {string} token - Authentication token
   * @returns {Promise<boolean>} Success status
   */
  revokeSession: async (sessionId, token) => {
    await simulateApiDelay(300);
    
    // In production, invalidate session on server
    return true;
  },
  
  /**
   * Revoke all other sessions
   * @param {string} token - Authentication token
   * @returns {Promise<boolean>} Success status
   */
  revokeAllOtherSessions: async (token) => {
    await simulateApiDelay(300);
    
    // In production, invalidate all other sessions on server
    return true;
  }
};

export default authService;

// ==================== UTILITY FUNCTIONS FOR LOCAL STORAGE ====================

// These functions help manage authentication state in localStorage
export const authStorage = {
  /**
   * Save authentication data to localStorage
   * @param {Object} authData - Authentication data
   */
  saveAuthData: (authData) => {
    try {
      localStorage.setItem('btyhub_auth', JSON.stringify(authData));
      localStorage.setItem('btyhub_token', authData.token);
      localStorage.setItem('btyhub_user', JSON.stringify(authData.user));
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  },
  
  /**
   * Get authentication data from localStorage
   * @returns {Object|null} Authentication data
   */
  getAuthData: () => {
    try {
      const authData = localStorage.getItem('btyhub_auth');
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.error('Error getting auth data:', error);
      return null;
    }
  },
  
  /**
   * Get authentication token from localStorage
   * @returns {string|null} Authentication token
   */
  getToken: () => {
    return localStorage.getItem('btyhub_token');
  },
  
  /**
   * Get user data from localStorage
   * @returns {Object|null} User data
   */
  getUser: () => {
    try {
      const user = localStorage.getItem('btyhub_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },
  
  /**
   * Clear authentication data from localStorage
   */
  clearAuthData: () => {
    localStorage.removeItem('btyhub_auth');
    localStorage.removeItem('btyhub_token');
    localStorage.removeItem('btyhub_user');
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('btyhub_token');
    return !!token;
  },
  
  /**
   * Check if user is admin
   * @returns {boolean} Admin status
   */
  isAdmin: () => {
    const user = authStorage.getUser();
    return user?.role === 'admin';
  }
};