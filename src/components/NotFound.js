import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFound() {
  return (
    <Container className="text-center py-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="mb-4">
              <h1 className="display-1 fw-bold text-warning">404</h1>
              <h2 className="fw-bold mb-3">Oops! Page Not Found</h2>
              <p className="lead text-muted mb-4">
                The page you're looking for doesn't exist. It might have been moved, 
                deleted, or you entered the wrong URL.
              </p>
            </div>
            
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-4">
              <Button as={Link} to="/" variant="warning" size="lg" className="fw-semibold px-4">
                ← Back to Home
              </Button>
              <Button as={Link} to="/workout" variant="outline-primary" size="lg" className="fw-semibold px-4">
                Start Workout
              </Button>
            </div>

            <div className="text-muted">
              <p>Or try one of these popular pages:</p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Link to="/ai" className="text-decoration-none badge bg-light text-dark p-2">AI Coach</Link>
                <Link to="/diet" className="text-decoration-none badge bg-light text-dark p-2">Diet Plans</Link>
                <Link to="/progress" className="text-decoration-none badge bg-light text-dark p-2">Progress Tracker</Link>
                <Link to="/community" className="text-decoration-none badge bg-light text-dark p-2">Community</Link>
              </div>
            </div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
}

export default NotFound;
