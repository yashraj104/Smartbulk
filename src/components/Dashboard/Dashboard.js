import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Button, Badge,
  ProgressBar, ListGroup, Alert, Dropdown
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaChartLine, FaDumbbell, FaAppleAlt, FaTrophy,
  FaCalendar, FaClock, FaFire, FaHeart, FaWeight,
  FaRuler, FaTarget, FaEdit, FaPlus, FaEllipsisV,
  FaArrowUp, FaArrowDown, FaMinus
} from "react-icons/fa";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [nutritionData, setNutritionData] = useState({});
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load sample data
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // Sample workout data
    setRecentWorkouts([
      {
        id: 1,
        name: "Upper Body Strength",
        date: "2024-01-15",
        duration: "45 min",
        calories: 320,
        exercises: ["Bench Press", "Pull-ups", "Overhead Press"],
        completed: true
      },
      {
        id: 2,
        name: "Lower Body Power",
        date: "2024-01-13",
        duration: "50 min",
        calories: 380,
        exercises: ["Squats", "Deadlifts", "Lunges"],
        completed: true
      },
      {
        id: 3,
        name: "Cardio HIIT",
        date: "2024-01-12",
        duration: "30 min",
        calories: 250,
        exercises: ["Burpees", "Mountain Climbers", "Jump Squats"],
        completed: true
      }
    ]);

    // Sample nutrition data
    setNutritionData({
      today: {
        calories: 1850,
        target: 2200,
        protein: 145,
        carbs: 180,
        fat: 65,
        water: 2.1
      },
      weekly: {
        calories: [1850, 2100, 1950, 2200, 1900, 2050, 1800],
        protein: [145, 160, 150, 165, 155, 170, 140],
        carbs: [180, 200, 190, 210, 185, 205, 175],
        fat: [65, 70, 68, 72, 66, 71, 63]
      }
    });

    // Sample progress data
    setProgressData({
      weight: {
        current: 75.5,
        start: 78.0,
        target: 72.0,
        history: [78.0, 77.5, 77.0, 76.5, 76.0, 75.5]
      },
      bodyFat: {
        current: 18,
        start: 22,
        target: 15,
        history: [22, 21, 20, 19, 18.5, 18]
      },
      strength: {
        bench: { current: 100, start: 80, target: 120 },
        squat: { current: 140, start: 100, target: 160 },
        deadlift: { current: 180, start: 120, target: 200 }
      }
    });
  };

  const getProgressPercentage = (current, start, target) => {
    if (start === target) return 0;
    const total = Math.abs(target - start);
    const progress = Math.abs(current - start);
    return Math.min((progress / total) * 100, 100);
  };

  const getProgressColor = (current, start, target) => {
    const percentage = getProgressPercentage(current, start, target);
    if (percentage >= 80) return "success";
    if (percentage >= 50) return "warning";
    return "info";
  };

  const renderOverview = () => (
    <>
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <h2 className="mb-2">Welcome back, {user?.firstName || 'Fitness Warrior'}! 💪</h2>
                  <p className="mb-3 opacity-75">You're making great progress. Keep pushing towards your goals!</p>
                  <div className="d-flex gap-2">
                    <Button variant="light" size="sm">
                      <FaPlus className="me-2" />
                      Log Workout
                    </Button>
                    <Button variant="outline-light" size="sm">
                      <FaEdit className="me-2" />
                      Update Progress
                    </Button>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div className="display-4">🎯</div>
                  <h5>Goal Progress</h5>
                  <ProgressBar 
                    now={getProgressPercentage(progressData.weight?.current || 0, progressData.weight?.start || 0, progressData.weight?.target || 0)} 
                    variant="light" 
                    className="mt-2"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <FaFire size={24} />
              </div>
              <h4 className="mb-1">{nutritionData.today?.calories || 0}</h4>
              <p className="text-muted mb-0">Calories Today</p>
              <small className="text-muted">
                Target: {nutritionData.today?.target || 0}
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <FaDumbbell size={24} />
              </div>
              <h4 className="mb-1">{recentWorkouts.filter(w => w.completed).length}</h4>
              <p className="text-muted mb-0">Workouts This Week</p>
              <small className="text-success">On Track!</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-warning mb-2">
                <FaWeight size={24} />
              </div>
              <h4 className="mb-1">{progressData.weight?.current || 0} kg</h4>
              <p className="text-muted mb-0">Current Weight</p>
              <small className="text-success">
                {progressData.weight?.current < progressData.weight?.start ? '↓' : '↑'} 
                {Math.abs((progressData.weight?.current || 0) - (progressData.weight?.start || 0)).toFixed(1)} kg
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <FaHeart size={24} />
              </div>
              <h4 className="mb-1">{progressData.bodyFat?.current || 0}%</h4>
              <p className="text-muted mb-0">Body Fat</p>
              <small className="text-success">
                {progressData.bodyFat?.current < progressData.bodyFat?.start ? '↓' : '↑'} 
                {Math.abs((progressData.bodyFat?.current || 0) - (progressData.bodyFat?.start || 0)).toFixed(1)}%
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress Charts */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">Weight Progress</h5>
            </Card.Header>
            <Card.Body>
              <Line
                data={{
                  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                  datasets: [
                    {
                      label: 'Weight (kg)',
                      data: progressData.weight?.history || [],
                      borderColor: 'rgb(75, 192, 192)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      tension: 0.4
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false
                    }
                  }
                }}
                height={60}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">Nutrition Balance</h5>
            </Card.Header>
            <Card.Body>
              <Doughnut
                data={{
                  labels: ['Protein', 'Carbs', 'Fat'],
                  datasets: [{
                    data: [
                      nutritionData.today?.protein || 0,
                      nutritionData.today?.carbs || 0,
                      nutritionData.today?.fat || 0
                    ],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.8)',
                      'rgba(54, 162, 235, 0.8)',
                      'rgba(255, 205, 86, 0.8)'
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
                height={60}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Workouts</h5>
              <Button variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {recentWorkouts.slice(0, 3).map((workout) => (
                  <ListGroup.Item key={workout.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{workout.name}</h6>
                      <small className="text-muted">
                        {workout.date} • {workout.duration} • {workout.calories} cal
                      </small>
                    </div>
                    <Badge bg="success">Completed</Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Strength Progress</h5>
              <Button variant="outline-primary" size="sm">
                Track More
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Bench Press</span>
                  <span>{progressData.strength?.bench?.current} kg</span>
                </div>
                <ProgressBar 
                  now={getProgressPercentage(
                    progressData.strength?.bench?.current || 0,
                    progressData.strength?.bench?.start || 0,
                    progressData.strength?.bench?.target || 0
                  )} 
                  variant={getProgressColor(
                    progressData.strength?.bench?.current || 0,
                    progressData.strength?.bench?.start || 0,
                    progressData.strength?.bench?.target || 0
                  )}
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Squat</span>
                  <span>{progressData.strength?.squat?.current} kg</span>
                </div>
                <ProgressBar 
                  now={getProgressPercentage(
                    progressData.strength?.squat?.current || 0,
                    progressData.strength?.squat?.start || 0,
                    progressData.strength?.squat?.target || 0
                  )} 
                  variant={getProgressColor(
                    progressData.strength?.squat?.current || 0,
                    progressData.strength?.squat?.start || 0,
                    progressData.strength?.squat?.target || 0
                  )}
                />
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Deadlift</span>
                  <span>{progressData.strength?.deadlift?.current} kg</span>
                </div>
                <ProgressBar 
                  now={getProgressPercentage(
                    progressData.strength?.deadlift?.current || 0,
                    progressData.strength?.deadlift?.start || 0,
                    progressData.strength?.deadlift?.target || 0
                  )} 
                  variant={getProgressColor(
                    progressData.strength?.deadlift?.current || 0,
                    progressData.strength?.deadlift?.start || 0,
                    progressData.strength?.deadlift?.target || 0
                  )}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderWorkouts = () => (
    <div>
      <h3>Workout Plans</h3>
      <p>Workout plans will be displayed here</p>
    </div>
  );

  const renderNutrition = () => (
    <div>
      <h3>Nutrition Plans</h3>
      <p>Nutrition plans will be displayed here</p>
    </div>
  );

  const renderProgress = () => (
    <div>
      <h3>Progress Tracking</h3>
      <p>Detailed progress tracking will be displayed here</p>
    </div>
  );

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">
          Please log in to view your dashboard.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Dashboard Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 mb-1">Dashboard</h1>
                <p className="text-muted mb-0">
                  Track your fitness journey and monitor your progress
                </p>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-primary">
                  <FaPlus className="me-2" />
                  Quick Log
                </Button>
                <Button variant="primary">
                  <FaEdit className="me-2" />
                  Update Progress
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex gap-2 border-bottom">
              <Button
                variant={activeTab === 'overview' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('overview')}
                className="border-0 rounded-0"
              >
                Overview
              </Button>
              <Button
                variant={activeTab === 'workouts' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('workouts')}
                className="border-0 rounded-0"
              >
                Workouts
              </Button>
              <Button
                variant={activeTab === 'nutrition' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('nutrition')}
                className="border-0 rounded-0"
              >
                Nutrition
              </Button>
              <Button
                variant={activeTab === 'progress' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('progress')}
                className="border-0 rounded-0"
              >
                Progress
              </Button>
            </div>
          </Col>
        </Row>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'workouts' && renderWorkouts()}
        {activeTab === 'nutrition' && renderNutrition()}
        {activeTab === 'progress' && renderProgress()}
      </motion.div>
    </Container>
  );
}

export default Dashboard;
