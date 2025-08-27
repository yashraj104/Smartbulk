import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, ProgressBar, Badge,
  ListGroup, ListGroupItem, Alert, Spinner
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaUser, FaDumbbell, FaUtensils, FaChartLine, FaTrophy,
  FaCalendar, FaBullseye, FaFire, FaHeart, FaRunning,
  FaWeight, FaRuler, FaPlus
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    currentStreak: 0,
    goalsCompleted: 0,
    weightProgress: 0,
    muscleGain: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      // Simulate loading user stats
      setTimeout(() => {
        setStats({
          totalWorkouts: 24,
          totalCalories: 12450,
          currentStreak: 7,
          goalsCompleted: 3,
          weightProgress: -2.5,
          muscleGain: 1.2
        });
        
        setRecentActivities([
          {
            id: 1,
            type: 'workout',
            title: 'Upper Body Strength',
            description: 'Completed chest and back workout',
            time: '2 hours ago',
            icon: FaDumbbell,
            color: 'primary'
          },
          {
            id: 2,
            type: 'nutrition',
            title: 'Logged Breakfast',
            description: 'Oatmeal with berries and protein',
            time: '4 hours ago',
            icon: FaUtensils,
            color: 'success'
          },
          {
            id: 3,
            type: 'goal',
            title: 'Weight Goal Achieved',
            description: 'Reached target weight of 75kg',
            time: '1 day ago',
            icon: FaTrophy,
            color: 'warning'
          }
        ]);
        
        setLoading(false);
      }, 1000);
    }
  }, [userProfile]);

  if (!currentUser) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          <h4>Please log in to access your dashboard</h4>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary text-white rounded-circle p-3 me-3">
                <FaUser size={24} />
              </div>
              <div>
                <h2 className="mb-1">Welcome back, {userProfile?.displayName || currentUser.email}!</h2>
                <p className="text-muted mb-0">Here's your fitness journey overview</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Quick Stats */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="bg-primary text-white rounded-circle p-3 mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                  <FaDumbbell size={24} />
                </div>
                <h4 className="mb-1">{stats.totalWorkouts}</h4>
                <p className="text-muted mb-0">Total Workouts</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="bg-success text-white rounded-circle p-3 mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                  <FaFire size={24} />
                </div>
                <h4 className="mb-1">{stats.totalCalories.toLocaleString()}</h4>
                <p className="text-muted mb-0">Calories Burned</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="bg-warning text-white rounded-circle p-3 mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                  <FaRunning size={24} />
                </div>
                <h4 className="mb-1">{stats.currentStreak}</h4>
                <p className="text-muted mb-0">Day Streak</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="bg-info text-white rounded-circle p-3 mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                  <FaTrophy size={24} />
                </div>
                <h4 className="mb-1">{stats.goalsCompleted}</h4>
                <p className="text-muted mb-0">Goals Completed</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Progress Section */}
        <Row className="mb-4">
          <Col lg={8} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <FaChartLine className="me-2 text-primary" />
                  Progress Overview
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <h6>Weight Progress</h6>
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">{stats.weightProgress > 0 ? '+' : ''}{stats.weightProgress}kg</span>
                      <Badge bg={stats.weightProgress < 0 ? 'success' : 'warning'}>
                        {stats.weightProgress < 0 ? 'Lost' : 'Gained'}
                      </Badge>
                    </div>
                    <ProgressBar 
                      variant={stats.weightProgress < 0 ? 'success' : 'warning'}
                      now={Math.abs(stats.weightProgress) * 10}
                      max={50}
                    />
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <h6>Muscle Gain</h6>
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">+{stats.muscleGain}kg</span>
                      <Badge bg="primary">Gained</Badge>
                    </div>
                    <ProgressBar 
                      variant="primary"
                      now={stats.muscleGain * 20}
                      max={20}
                    />
                  </Col>
                </Row>
                
                <div className="mt-3">
                  <h6>Current Goals</h6>
                  <ListGroup variant="flush">
                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                      <div>
                        <FaBullseye className="me-2 text-primary" />
                        Reach 80kg weight
                      </div>
                      <ProgressBar style={{width: '100px'}} now={75} variant="success" />
                    </ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                      <div>
                        <FaHeart className="me-2 text-danger" />
                        Improve cardiovascular fitness
                      </div>
                      <ProgressBar style={{width: '100px'}} now={60} variant="info" />
                    </ListGroupItem>
                  </ListGroup>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <FaCalendar className="me-2 text-primary" />
                  Quick Actions
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button as={Link} to="/workout" variant="primary" className="mb-2">
                    <FaDumbbell className="me-2" />
                    Start Workout
                  </Button>
                  <Button as={Link} to="/food-logger" variant="success" className="mb-2">
                    <FaUtensils className="me-2" />
                    Log Food
                  </Button>
                  <Button as={Link} to="/diet" variant="info" className="mb-2">
                    <FaBullseye className="me-2" />
                    Plan Diet
                  </Button>
                  <Button as={Link} to="/progress" variant="warning" className="mb-2">
                    <FaChartLine className="me-2" />
                    Track Progress
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activities */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaCalendar className="me-2 text-primary" />
                  Recent Activities
                </h5>
                <Button variant="outline-primary" size="sm">
                  View All
                </Button>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {recentActivities.map((activity) => (
                    <ListGroupItem key={activity.id} className="d-flex align-items-center py-3">
                      <div className={`bg-${activity.color} text-white rounded-circle p-2 me-3`} style={{width: '40px', height: '40px'}}>
                        <activity.icon size={16} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{activity.title}</h6>
                        <p className="text-muted mb-0 small">{activity.description}</p>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Profile Summary */}
        <Row className="mt-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <FaUser className="me-2 text-primary" />
                  Profile Summary
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} className="text-center mb-3">
                    <div className="bg-light rounded-circle p-4 mx-auto mb-2" style={{width: '80px', height: '80px'}}>
                      <FaWeight size={32} className="text-primary" />
                    </div>
                    <h6>Current Weight</h6>
                    <p className="h4 mb-0">{userProfile?.weight || '--'} kg</p>
                  </Col>
                  
                  <Col md={3} className="text-center mb-3">
                    <div className="bg-light rounded-circle p-4 mx-auto mb-2" style={{width: '80px', height: '80px'}}>
                      <FaRuler size={32} className="text-success" />
                    </div>
                    <h6>Height</h6>
                    <p className="h4 mb-0">{userProfile?.height || '--'} cm</p>
                  </Col>
                  
                  <Col md={3} className="text-center mb-3">
                    <div className="bg-light rounded-circle p-4 mx-auto mb-2" style={{width: '80px', height: '80px'}}>
                      <FaBullseye size={32} className="text-warning" />
                    </div>
                    <h6>Fitness Goal</h6>
                    <p className="h4 mb-0">{userProfile?.fitnessGoal || 'General'}</p>
                  </Col>
                  
                  <Col md={3} className="text-center mb-3">
                    <div className="bg-light rounded-circle p-4 mx-auto mb-2" style={{width: '80px', height: '80px'}}>
                      <FaFire size={32} className="text-danger" />
                    </div>
                    <h6>Activity Level</h6>
                    <p className="h4 mb-0">{userProfile?.activityLevel || 'Moderate'}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
}

export default Dashboard;
