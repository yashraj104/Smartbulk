import React from "react";
import { Card, Row, Col, Button, Container, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const features = [
  {
    icon: "fas fa-dumbbell",
    color: "primary",
    title: "Smart Workout Planner",
    text: "AI-powered workout plans tailored to your goals, fitness level, and available equipment. Adaptive programming that evolves with your progress.",
    link: "/workout",
    buttonText: "Create Plan →"
  },
  {
    icon: "fas fa-apple-alt",
    color: "success",
    title: "Nutrition Optimization",
    text: "Personalized meal plans, macro calculations, and food tracking. Never guess about your nutrition again.",
    link: "/diet",
    buttonText: "Plan Nutrition →"
  },
  {
    icon: "fas fa-chart-line",
    color: "info",
    title: "Progress Analytics",
    text: "Detailed insights into your fitness journey with advanced analytics, body composition tracking, and performance metrics.",
    link: "/progress",
    buttonText: "View Analytics →"
  },
  {
    icon: "fas fa-robot",
    color: "warning",
    title: "AI Fitness Coach",
    text: "24/7 personal trainer powered by advanced AI. Get instant answers, form corrections, and motivation whenever you need it.",
    link: "/ai",
    buttonText: "Chat with AI →"
  },
  {
    icon: "fas fa-users",
    color: "danger",
    title: "Fitness Community",
    text: "Connect with like-minded individuals, share your progress, and participate in challenges to stay motivated.",
    link: "/community",
    buttonText: "Join Community →"
  },
  {
    icon: "fas fa-trophy",
    color: "secondary",
    title: "Expert Trainers",
    text: "Access certified personal trainers and nutrition experts for personalized guidance and professional support.",
    link: "/trainers",
    buttonText: "Find Trainers →"
  }
];

function FeatureCard({ icon, color, title, text, link, buttonText }) {
  return (
    <Col lg={4} md={6}>
      <MotionDiv whileHover={{ y: -5, transition: { duration: 0.2 } }} className="h-100">
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="p-4 text-center">
            <div className="feature-icon mb-3">
              <div
                className={`rounded-circle bg-${color} bg-opacity-10 d-inline-flex align-items-center justify-content-center`}
                style={{ width: "80px", height: "80px" }}
              >
                <i className={`${icon} text-${color}`} style={{ fontSize: "2rem" }}></i>
              </div>
            </div>
            <Card.Title className="fw-bold h4">{title}</Card.Title>
            <Card.Text className="text-muted mb-4">{text}</Card.Text>
            <Button as={Link} to={link} variant={`outline-${color}`} className="fw-semibold">
              {buttonText}
            </Button>
          </Card.Body>
        </Card>
      </MotionDiv>
    </Col>
  );
}

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <MotionSection
        className="hero-section py-5 mb-5 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "15px",
          color: "white",
          overflow: "hidden"
        }}
      >
        <Container>
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
            {["🏋️ Smart Workouts", "🥗 Nutrition Plans", "📊 Progress Tracking", "🤖 AI Coach", "👥 Community"].map(
              (badge, i) => (
                <Badge key={i} bg="light" text="dark" className="px-3 py-2">
                  {badge}
                </Badge>
              )
            )}
          </div>
        </Container>
      </MotionSection>

      {/* Features Section */}
      <section className="features-section mb-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3">Everything You Need to Succeed</h2>
          <p className="lead text-muted">
            Comprehensive tools designed by fitness experts and powered by AI
          </p>
        </div>
        <Row className="g-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </Row>
      </section>

      {/* CTA Section */}
      <MotionSection
        className="cta-section py-5 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          borderRadius: "15px",
          color: "white"
        }}
      >
        <Container>
          <h2 className="fw-bold mb-3">Ready to Transform Your Body?</h2>
          <p className="lead mb-4">
            Join thousands of users who have already started their fitness transformation
          </p>
          <Button as={Link} to="/workout" size="lg" variant="light" className="fw-semibold px-5">
            Get Started Today
          </Button>
        </Container>
      </MotionSection>
    </div>
  );
}

export default Home;
