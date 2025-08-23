import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { motion } from "framer-motion";

// Components (lazy-loaded)
const Home = lazy(() => import("./components/Home"));
const Payment = lazy(() => import("./components/Payment"));
const WorkoutPlanner = lazy(() => import("./components/WorkoutPlanner"));
const DietPlanner = lazy(() => import("./components/DietPlanner"));
const ProgressTracker = lazy(() => import("./components/ProgressTracker"));
const ExerciseLibrary = lazy(() => import("./components/ExerciseLibrary"));
const MacroCalculator = lazy(() => import("./components/MacroCalculator"));
const CommunityFeed = lazy(() => import("./components/CommunityFeed"));
const Challenges = lazy(() => import("./components/Challenges"));
const TrainerMarketplace = lazy(() => import("./components/TrainerMarketplace"));
const AIChatCoach = lazy(() => import("./components/AIChatCoach"));
const Settings = lazy(() => import("./components/Settings"));
const NotFound = lazy(() => import("./components/NotFound"));
const Contact = lazy(() => import("./components/Contact"));
const About = lazy(() => import("./components/About"));
const Login = lazy(() => import("./components/Auth/Login"));
const Register = lazy(() => import("./components/Auth/Register"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const Profile = lazy(() => import("./components/Profile"));
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();

  useEffect(() => {
    // Toggle a stable class for dark mode styling without wiping other body classes
    document.body.classList.toggle('dark-mode', darkMode);
    // Save dark mode preference
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Load dark mode preference on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
      <ScrollToTop />
      {/* Professional Navigation */}
      <Navbar 
        bg={darkMode ? "dark" : "light"} 
        variant={darkMode ? "dark" : "light"} 
        expand="lg" 
        sticky="top" 
        className="shadow-sm border-bottom"
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
            <span className="text-warning">Smart</span>Bulk
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} end to="/" className={({isActive}) => `fw-semibold ${isActive ? 'active' : ''}`}>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/workout" className={({isActive}) => `fw-semibold ${isActive ? 'active' : ''}`}>Workouts</Nav.Link>
              <Nav.Link as={NavLink} to="/diet" className={({isActive}) => `fw-semibold ${isActive ? 'active' : ''}`}>Nutrition</Nav.Link>
              <Nav.Link as={NavLink} to="/progress" className={({isActive}) => `fw-semibold ${isActive ? 'active' : ''}`}>Progress</Nav.Link>
              <Nav.Link as={NavLink} to="/ai" className={({isActive}) => `fw-semibold ${isActive ? 'active text-warning' : 'text-warning'}`}>AI Coach</Nav.Link>
              <Nav.Link as={NavLink} to="/community" className={({isActive}) => `fw-semibold ${isActive ? 'active' : ''}`}>Community</Nav.Link>
            </Nav>
            
            <div className="d-flex gap-2 align-items-center">
              <Button 
                variant={darkMode ? "outline-light" : "outline-dark"}
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="me-2"
              >
                {darkMode ? "☀️" : "🌙"}
              </Button>
              
              {currentUser ? (
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" id="user-dropdown" className="d-flex align-items-center gap-2">
                    <span className="fw-semibold">{userProfile?.displayName || currentUser?.email}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/dashboard">
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings">
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Button as={Link} to="/login" variant="outline-primary" className="fw-semibold px-3">
                    Sign In
                  </Button>
                  <Button as={Link} to="/register" variant="primary" className="fw-semibold px-3">
                    Sign Up
                  </Button>
                </>
              )}
              
              <Button as={Link} to="/payment" variant="warning" className="fw-semibold px-3">
                Upgrade Pro
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <ErrorBoundary>
      <Suspense fallback={<div className="container py-5 text-center"><div className="loading-spinner mx-auto mb-3"></div><p className="text-muted">Loading...</p></div>}>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ minHeight: 'calc(100vh - 200px)' }}
      >
        <Container fluid className="px-3 px-md-4 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/workout" element={<WorkoutPlanner />} />
            <Route path="/diet" element={<DietPlanner />} />
            <Route path="/progress" element={<ProgressTracker />} />
            <Route path="/library" element={<ExerciseLibrary />} />
            <Route path="/macro" element={<MacroCalculator />} />
            <Route path="/community" element={<CommunityFeed />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/trainers" element={<TrainerMarketplace />} />
            <Route path="/ai" element={<AIChatCoach />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </motion.main>
      </Suspense>
      </ErrorBoundary>

      {/* Professional Footer */}
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
