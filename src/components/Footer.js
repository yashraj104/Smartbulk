import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-5 py-5">
      <Container>
        <Row className="gy-4">
          {/* Brand Section */}
          <Col lg={4} md={6}>
            <h5 className="fw-bold text-warning mb-3">SmartBulk</h5>
            <p className="text-light-emphasis mb-3">
              Your ultimate AI-powered fitness companion. Transform your body and mind with 
              personalized workouts, nutrition plans, and expert guidance.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light-emphasis hover-warning" title="Facebook">
                <i className="fab fa-facebook-f" style={{ fontSize: '1.2rem' }}></i>
              </a>
              <a href="#" className="text-light-emphasis hover-warning" title="Twitter">
                <i className="fab fa-twitter" style={{ fontSize: '1.2rem' }}></i>
              </a>
              <a href="#" className="text-light-emphasis hover-warning" title="Instagram">
                <i className="fab fa-instagram" style={{ fontSize: '1.2rem' }}></i>
              </a>
              <a href="#" className="text-light-emphasis hover-warning" title="YouTube">
                <i className="fab fa-youtube" style={{ fontSize: '1.2rem' }}></i>
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <h6 className="fw-semibold text-warning mb-3">Features</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/workout" className="text-light-emphasis text-decoration-none hover-warning">
                  Workout Planner
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/diet" className="text-light-emphasis text-decoration-none hover-warning">
                  Diet Plans
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/progress" className="text-light-emphasis text-decoration-none hover-warning">
                  Progress Tracking
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/ai" className="text-light-emphasis text-decoration-none hover-warning">
                  AI Coach
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/library" className="text-light-emphasis text-decoration-none hover-warning">
                  Exercise Library
                </Link>
              </li>
            </ul>
          </Col>

          {/* Community Links */}
          <Col lg={2} md={6}>
            <h6 className="fw-semibold text-warning mb-3">Community</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/community" className="text-light-emphasis text-decoration-none hover-warning">
                  Community Feed
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/challenges" className="text-light-emphasis text-decoration-none hover-warning">
                  Challenges
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/trainers" className="text-light-emphasis text-decoration-none hover-warning">
                  Find Trainers
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light-emphasis text-decoration-none hover-warning">
                  Success Stories
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light-emphasis text-decoration-none hover-warning">
                  Blog
                </a>
              </li>
            </ul>
          </Col>

          {/* Support Links */}
          <Col lg={2} md={6}>
            <h6 className="fw-semibold text-warning mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-light-emphasis text-decoration-none hover-warning">
                  About / Help Center
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-light-emphasis text-decoration-none hover-warning">
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light-emphasis text-decoration-none hover-warning">
                  FAQ
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light-emphasis text-decoration-none hover-warning">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light-emphasis text-decoration-none hover-warning">
                  Terms of Service
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={2} md={6}>
            <h6 className="fw-semibold text-warning mb-3">Contact</h6>
            <div className="text-light-emphasis">
              <div className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                <small>hello@smartbulk.com</small>
              </div>
              <div className="mb-2">
                <i className="fas fa-phone me-2"></i>
                <small>+1 (555) 123-4567</small>
              </div>
              <div className="mb-2">
                <i className="fas fa-map-marker-alt me-2"></i>
                <small>San Francisco, CA</small>
              </div>
            </div>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />
        
        <Row className="align-items-center">
          <Col md={8}>
            <p className="mb-0 text-light-emphasis small">
              © {currentYear} SmartBulk. All rights reserved. Made with ❤️ for fitness enthusiasts.
            </p>
          </Col>
          <Col md={4} className="text-md-end mt-2 mt-md-0">
            <small className="text-light-emphasis">
              <a href="#" className="text-decoration-none text-light-emphasis hover-warning me-3">
                Privacy
              </a>
              <a href="#" className="text-decoration-none text-light-emphasis hover-warning me-3">
                Terms
              </a>
              <a href="#" className="text-decoration-none text-light-emphasis hover-warning">
                Cookies
              </a>
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
