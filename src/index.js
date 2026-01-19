import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

// Polyfills for older browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Error boundary for production
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to error reporting service
    console.error('BTY-HUB Error:', error, errorInfo);
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToErrorTrackingService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <h1>Something went wrong</h1>
            <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring configuration
const performanceConfig = {
  // Enable performance monitoring in production
  enabled: process.env.NODE_ENV === 'production',
  
  // Log performance metrics
  logMetrics: (metric) => {
    if (performanceConfig.enabled) {
      console.log(`Performance Metric: ${metric.name} - ${metric.value}ms`);
      
      // Send to analytics service
      // sendToAnalytics(metric);
    }
  }
};

// Initialize the application
const initApp = () => {
  try {
    // Check for required browser features
    if (!('fetch' in window)) {
      throw new Error('Your browser is outdated. Please update to a modern browser.');
    }

    // Create root element
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    // Create React root
    const root = ReactDOM.createRoot(rootElement);

    // Render the application
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );

    // Service worker registration for PWA
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful: ', registration.scope);
          },
          (error) => {
            console.log('ServiceWorker registration failed: ', error);
          }
        );
      });
    }

    // Report web vitals
    if (performanceConfig.enabled) {
      reportWebVitals(performanceConfig.logMetrics);
    }

    // Clean up on unmount
    return () => {
      // Cleanup if needed
    };

  } catch (error) {
    console.error('Failed to initialize application:', error);
    
    // Display user-friendly error
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h1>Application Error</h1>
          <p>${error.message}</p>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
};

// Start the application
document.addEventListener('DOMContentLoaded', initApp);

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Prevent default error handling for known errors
  if (event.error.message?.includes('ResizeObserver')) {
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Development-only features
if (process.env.NODE_ENV === 'development') {
  // Enable React DevTools
  window.React = React;
  
  // Log build info
  console.log(`
    ██████╗ ████████╗██╗   ██╗██╗  ██╗██╗   ██╗██████╗ 
    ██╔══██╗╚══██╔══╝╚██╗ ██╔╝██║  ██║██║   ██║██╔══██╗
    ██████╔╝   ██║    ╚████╔╝ ███████║██║   ██║██████╔╝
    ██╔══██╗   ██║     ╚██╔╝  ██╔══██║██║   ██║██╔══██╗
    ██████╔╝   ██║      ██║   ██║  ██║╚██████╔╝██████╔╝
    ╚═════╝    ╚═╝      ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ 
    
    BTY-HUB E-commerce Platform
    Environment: Development
    Version: 1.0.0
    Build Date: ${new Date().toLocaleDateString()}
  `);
}

// Export for testing
export { initApp };