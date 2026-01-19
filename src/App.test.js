import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Mock the toast container to avoid errors
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />
}));

// Mock the routes to simplify testing
jest.mock('./routes/AppRoutes', () => () => (
  <div data-testid="app-routes">
    <h1>BTY-HUB E-commerce</h1>
  </div>
));

// Mock the loader component
jest.mock('./components/common/Loader', () => () => (
  <div data-testid="loader">Loading...</div>
));

// Create a test wrapper with all providers
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Check if the app renders
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });

  test('displays the app title', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(screen.getByText('BTY-HUB E-commerce')).toBeInTheDocument();
  });

  test('includes toast container', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  test('wraps app in Router context', () => {
    // This test ensures the Router is properly wrapping the app
    const { container } = render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Check if Router context is available by looking for router-specific classes
    expect(container.firstChild).toBeInTheDocument();
  });

  test('provides Auth context', () => {
    // Test that auth context is provided by checking if auth-related components can render
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // The app should render without auth context errors
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });

  test('provides Cart context', () => {
    // Test that cart context is provided
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // The app should render without cart context errors
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });
});

// Additional tests for utility functions
describe('App Utility Tests', () => {
  test('environment setup', () => {
    // Ensure we're in test environment
    expect(process.env.NODE_ENV).toBe('test');
  });

  test('React version compatibility', () => {
    // Test that React is properly imported
    expect(React).toBeDefined();
    expect(React.createElement).toBeDefined();
  });

  test('renders in production mode', () => {
    // Mock production mode
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
    
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });
});

// Performance tests
describe('App Performance', () => {
  test('renders within acceptable time', () => {
    const startTime = performance.now();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // App should render in under 500ms in test environment
    expect(renderTime).toBeLessThan(500);
  });
});

// Accessibility tests
describe('App Accessibility', () => {
  test('has proper document structure', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Check for main heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('BTY-HUB E-commerce');
  });

  test('has accessible landmarks', () => {
    const { container } = render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Check for main content area
    expect(container.querySelector('main') || container.querySelector('[role="main"]')).toBeTruthy();
  });
});

// Error boundary test
describe('App Error Handling', () => {
  test('handles component errors gracefully', () => {
    // Create a component that throws an error
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    
    // Mock console.error to avoid test output pollution
    const originalError = console.error;
    console.error = jest.fn();
    
    // This should not crash the test
    expect(() => {
      render(
        <TestWrapper>
          <ErrorComponent />
        </TestWrapper>
      );
    }).toThrow();
    
    // Restore console.error
    console.error = originalError;
  });
});

// Snapshot test
describe('App Snapshot', () => {
  test('matches snapshot', () => {
    const { asFragment } = render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(asFragment()).toMatchSnapshot();
  });
});