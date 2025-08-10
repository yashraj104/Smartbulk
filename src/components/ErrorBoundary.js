import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Optionally log to an error reporting service
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <h1 className="display-5 fw-bold text-warning mb-3">Something went wrong</h1>
          <p className="lead text-muted mb-4">An unexpected error occurred. Please try refreshing the page.</p>
          <button className="btn btn-warning fw-semibold px-4" onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
