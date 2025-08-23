import React from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and any error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <div className="text-center">
            <Card className="border-0 shadow-sm">
              <Card.Body className="py-5">
                <FaExclamationTriangle size={64} className="text-danger mb-4" />
                <h2 className="mb-3">Oops! Something went wrong</h2>
                <p className="text-muted mb-4">
                  We encountered an unexpected error. Don't worry, our team has been notified.
                </p>
                
                <div className="d-flex justify-content-center gap-3 mb-4">
                  <Button variant="primary" onClick={this.handleReload}>
                    <FaRedo className="me-2" />
                    Reload Page
                  </Button>
                  <Button variant="outline-secondary" onClick={this.handleGoHome}>
                    <FaHome className="me-2" />
                    Go Home
                  </Button>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Alert variant="danger" className="text-start">
                    <Alert.Heading>Error Details (Development)</Alert.Heading>
                    <p className="mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <details className="mt-3">
                        <summary>Stack Trace</summary>
                        <pre className="mt-2 small" style={{ whiteSpace: 'pre-wrap' }}>
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
