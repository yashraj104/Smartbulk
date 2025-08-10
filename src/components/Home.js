import React from "react";
import { Card, Row, Col, Button, Container, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <motion.section 
        className="hero-section py-5 mb-5 text-center bg-gradient"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '15px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="display-4 fw-bold mb-3">
              Transform Your Fitness Journey with <span className="text-warning">SmartBulk</span>
            </h1>
            <p className="lead mb-4 px-md-5">
              The ultimate AI-powered fitness platform that combines personalized workout plans, 
              nutrition optimization, and community support to help you achieve your goals faster.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-4">
              <Button as={Link} to="/workout" size="lg" variant="warning" className="fw-semibold px-4">
                Start Your Journey
              </Button>
              <Button as={Link} to="/ai" size="lg" variant="outline-light" className="fw-semibold px-4">
                Try AI Coach Free
              </Button>
            </div>
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
              <Badge bg="light" text="dark" className="px-3 py-2">🏋️ Smart Workouts</Badge>
              <Badge bg="light" text="dark" className="px-3 py-2">🥗 Nutrition Plans</Badge>
              <Badge bg="light" text="dark" className="px-3 py-2">📊 Progress Tracking</Badge>
              <Badge bg="light" text="dark" className="px-3 py-2">🤖 AI Coach</Badge>
              <Badge bg="light" text="dark" className="px-3 py-2">👥 Community</Badge>
            </div>
          </motion.div>
        </Container>
      </motion.section>

      {/* Features Section */}
      <section className="features-section mb-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3">Everything You Need to Succeed</h2>
          <p className="lead text-muted">Comprehensive tools designed by fitness experts and powered by AI</p>
        </div>
        
        <Row className="g-4">
          <Col lg={4} md={6}>
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-100"
            >
              <Card className="border-0 shadow-sm h-100 feature-card">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon mb-3">
                    <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-dumbbell text-primary" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                  <Card.Title className="fw-bold h4">Smart Workout Planner</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    AI-powered workout plans tailored to your goals, fitness level, and available equipment. 
                    Adaptive programming that evolves with your progress.
                  </Card.Text>
                  <Button as={Link} to="/workout" variant="outline-primary" className="fw-semibold">
                    Create Plan →
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          
          <Col lg={4} md={6}>
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-100"
            >
              <Card className="border-0 shadow-sm h-100 feature-card">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon mb-3">
                    <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-apple-alt text-success" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                  <Card.Title className="fw-bold h4">Nutrition Optimization</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    Personalized meal plans, macro calculations, and food tracking. 
                    Never guess about your nutrition again.
                  </Card.Text>
                  <Button as={Link} to="/diet" variant="outline-success" className="fw-semibold">
                    Plan Nutrition →
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          
          <Col lg={4} md={6}>
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-100"
            >
              <Card className="border-0 shadow-sm h-100 feature-card">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon mb-3">
                    <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-chart-line text-info" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                  <Card.Title className="fw-bold h4">Progress Analytics</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    Detailed insights into your fitness journey with advanced analytics, 
                    body composition tracking, and performance metrics.
                  </Card.Text>
                  <Button as={Link} to="/progress" variant="outline-info" className="fw-semibold">
                    View Analytics →
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          
          <Col lg={4} md={6}>
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-100"
            >
              <Card className="border-0 shadow-sm h-100 feature-card">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon mb-3">
                    <div className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-robot text-warning" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                  <Card.Title className="fw-bold h4">AI Fitness Coach</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    24/7 personal trainer powered by advanced AI. Get instant answers, 
                    form corrections, and motivation whenever you need it.
                  </Card.Text>
                  <Button as={Link} to="/ai" variant="outline-warning" className="fw-semibold">
                    Chat with AI →
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          
          <Col lg={4} md={6}>
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-100"
            >
              <Card className="border-0 shadow-sm h-100 feature-card">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon mb-3">
                    <div className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-users text-danger" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                  <Card.Title className="fw-bold h4">Fitness Community</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    Connect with like-minded individuals, share your progress, 
                    and participate in challenges to stay motivated.
                  </Card.Text>
                  <Button as={Link} to="/community" variant="outline-danger" className="fw-semibold">
                    Join Community →
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          
          <Col lg={4} md={6}>
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-100"
            >
              <Card className="border-0 shadow-sm h-100 feature-card">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon mb-3">
                    <div className="rounded-circle bg-secondary bg-opacity-10 d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-trophy text-secondary" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                  <Card.Title className="fw-bold h4">Expert Trainers</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    Access certified personal trainers and nutrition experts for 
                    personalized guidance and professional support.
                  </Card.Text>
                  <Button as={Link} to="/trainers" variant="outline-secondary" className="fw-semibold">
                    Find Trainers →
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section py-5 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: '15px',
          color: 'white'
        }}
      >
        <Container>
          <h2 className="fw-bold mb-3">Ready to Transform Your Body?</h2>
          <p className="lead mb-4">Join thousands of users who have already started their fitness transformation</p>
          <Button as={Link} to="/workout" size="lg" variant="light" className="fw-semibold px-5">
            Get Started Today
          </Button>
        </Container>
      </motion.section>
    </div>
  );
}

export default Home;
