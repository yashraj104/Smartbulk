import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Alert, Spinner, Tab, Tabs,
  ProgressBar, Badge, Table, Modal, Form, ListGroup
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaBrain, FaDumbbell, FaAppleAlt, FaRocket, FaChartLine, FaCalendarAlt,
  FaClock, FaFire, FaTarget, FaCheckCircle, FaDownload, FaSave,
  FaRefresh, FaLightbulb, FaHeart, FaTrophy
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import RecommendationEngine from '../services/RecommendationEngine';

function SmartRecommendations() {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [message, setMessage] = useState('');
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Load existing recommendations on component mount
  useEffect(() => {
    if (currentUser && userProfile) {
      loadExistingRecommendations();
    }
  }, [currentUser, userProfile]);

  const loadExistingRecommendations = async () => {
    try {
      const recommendations = await RecommendationEngine.loadRecommendations(currentUser.uid);
      if (recommendations.success) {
        setWorkoutPlan(recommendations.workoutRecommendation);
        setNutritionPlan(recommendations.nutritionRecommendation);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const generateRecommendations = async () => {
    if (!userProfile) {
      setMessage('Please complete your profile first to get personalized recommendations.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Generate both workout and nutrition plans
      const [workoutResult, nutritionResult] = await Promise.all([
        RecommendationEngine.generateWorkoutPlan(userProfile),
        RecommendationEngine.generateNutritionPlan(userProfile)
      ]);

      if (workoutResult.success && nutritionResult.success) {
        setWorkoutPlan(workoutResult.data);
        setNutritionPlan(nutritionResult.data);

        // Save to Firebase
        await Promise.all([
          RecommendationEngine.saveRecommendation(currentUser.uid, 'workout', workoutResult.data),
          RecommendationEngine.saveRecommendation(currentUser.uid, 'nutrition', nutritionResult.data)
        ]);

        setMessage('✨ Personalized recommendations generated successfully!');
      } else {
        setMessage('Error generating recommendations. Please try again.');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setMessage('Error generating recommendations. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const renderOverview = () => (
    <Row>
      <Col lg={8}>
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="text-center p-5">
            <div className="mb-4">
              <FaBrain size={64} className="text-primary mb-3" />
              <h2 className="h3 mb-2">AI-Powered Fitness Intelligence</h2>
              <p className="text-muted lead">
                Get personalized workout and nutrition plans tailored specifically for your goals, 
                experience level, and preferences.
              </p>
            </div>

            {!workoutPlan && !nutritionPlan ? (
              <div>
                <p className="mb-4">
                  Our smart recommendation engine analyzes your profile to create:
                </p>
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="p-3 border rounded">
                      <FaDumbbell className="text-primary mb-2" size={24} />
                      <h6>Custom Workout Plans</h6>
                      <small className="text-muted">Exercises tailored to your fitness level and goals</small>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3 border rounded">
                      <FaAppleAlt className="text-success mb-2" size={24} />
                      <h6>Nutrition Guidance</h6>
                      <small className="text-muted">Meal plans with calculated macros and calories</small>
                    </div>
                  </Col>
                </Row>
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={generateRecommendations}
                  disabled={loading}
                  className="px-5"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <FaRocket className="me-2" />
                      Generate My Personalized Plan
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div>
                <Alert variant="success" className="mb-4">
                  <FaCheckCircle className="me-2" />
                  Your personalized recommendations are ready!
                </Alert>
                <Row className="mb-4">
                  <Col md={6}>
                    <Card className="h-100 border-primary">
                      <Card.Body className="text-center">
                        <FaDumbbell className="text-primary mb-2" size={32} />
                        <h6>Workout Plan</h6>
                        <p className="small text-muted mb-3">
                          {workoutPlan?.totalWorkouts} workouts/week • {workoutPlan?.estimatedWeeklyTime} min/week
                        </p>
                        <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('workout')}>
                          View Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="h-100 border-success">
                      <Card.Body className="text-center">
                        <FaAppleAlt className="text-success mb-2" size={32} />
                        <h6>Nutrition Plan</h6>
                        <p className="small text-muted mb-3">
                          {nutritionPlan?.dailyCalories} cal/day • {nutritionPlan?.hydrationGoal} glasses water
                        </p>
                        <Button variant="outline-success" size="sm" onClick={() => setActiveTab('nutrition')}>
                          View Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Button 
                  variant="outline-primary" 
                  onClick={generateRecommendations}
                  disabled={loading}
                >
                  <FaRefresh className="me-2" />
                  Regenerate Plans
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col lg={4}>
        {/* User Stats Card */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-light">
            <h6 className="mb-0">Your Profile Summary</h6>
          </Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Goal:</span>
              <Badge bg="primary">
                {userProfile?.fitnessGoal?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Level:</span>
              <Badge bg="info">
                {userProfile?.experienceLevel?.charAt(0).toUpperCase() + userProfile?.experienceLevel?.slice(1)}
              </Badge>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Activity:</span>
              <span className="fw-semibold">
                {userProfile?.activityLevel?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            {userProfile?.weight && userProfile?.height && (
              <div className="d-flex justify-content-between">
                <span className="text-muted">BMI:</span>
                <span className="fw-semibold">
                  {((userProfile.weight / Math.pow(userProfile.height / 100, 2)).toFixed(1))}
                </span>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Tips Card */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-light">
            <h6 className="mb-0"><FaLightbulb className="me-2 text-warning" />Smart Tips</h6>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="px-0 py-2 border-0">
                <small>💡 Update your profile regularly for better recommendations</small>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 py-2 border-0">
                <small>📱 Track your workouts to see progress over time</small>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 py-2 border-0">
                <small>🍎 Follow nutrition guidelines for optimal results</small>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 py-2 border-0">
                <small>⏰ Consistency is key to achieving your goals</small>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderWorkoutPlan = () => {
    if (!workoutPlan) {
      return (
        <Alert variant="info">
          <FaDumbbell className="me-2" />
          No workout plan generated yet. Generate your personalized recommendations first.
        </Alert>
      );
    }

    return (
      <div>
        {/* Workout Overview */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-0 bg-primary text-white">
              <Card.Body>
                <h3 className="mb-1">{workoutPlan.totalWorkouts}</h3>
                <small>Workouts/Week</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 bg-success text-white">
              <Card.Body>
                <h3 className="mb-1">{workoutPlan.estimatedWeeklyTime}</h3>
                <small>Minutes/Week</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 bg-info text-white">
              <Card.Body>
                <h3 className="mb-1">{Object.keys(workoutPlan.weeklySchedule).filter(day => workoutPlan.weeklySchedule[day].exercises).length}</h3>
                <small>Active Days</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 bg-warning text-white">
              <Card.Body>
                <h3 className="mb-1">{Math.round(workoutPlan.estimatedWeeklyTime / workoutPlan.totalWorkouts)}</h3>
                <small>Avg Duration</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Weekly Schedule */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header>
            <h5 className="mb-0"><FaCalendarAlt className="me-2" />Weekly Schedule</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {Object.entries(workoutPlan.weeklySchedule).map(([day, workout]) => (
                <Col md={6} lg={4} key={day} className="mb-3">
                  <Card className={`h-100 ${workout.exercises ? 'border-primary' : 'border-light'}`}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{day}</h6>
                        {workout.exercises && (
                          <Badge bg="primary">{workout.exercises.length} exercises</Badge>
                        )}
                      </div>
                      {workout.exercises ? (
                        <>
                          <p className="small text-muted mb-2">
                            <FaClock className="me-1" />{workout.estimatedDuration} min • {workout.focus}
                          </p>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => {
                              setSelectedWorkout({ day, ...workout });
                              setShowWorkoutModal(true);
                            }}
                          >
                            View Exercises
                          </Button>
                        </>
                      ) : (
                        <div className="text-center text-muted py-3">
                          <FaHeart className="mb-2" size={20} />
                          <p className="small mb-0">Rest Day</p>
                          <small>{workout.activities?.join(', ')}</small>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* Progression Plan */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header>
            <h5 className="mb-0"><FaChartLine className="me-2" />Progression Plan</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {Object.entries(workoutPlan.progression).map(([week, description]) => (
                <Col md={6} key={week} className="mb-3">
                  <div className="p-3 border rounded">
                    <h6 className="text-primary mb-1">
                      {week.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h6>
                    <p className="small mb-0">{description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* Workout Notes */}
        <Card className="border-0 shadow-sm">
          <Card.Header>
            <h5 className="mb-0"><FaTarget className="me-2" />Training Notes</h5>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {workoutPlan.notes.map((note, index) => (
                <ListGroup.Item key={index} className="px-0">
                  <FaCheckCircle className="text-success me-2" />
                  {note}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    );
  };

  const renderNutritionPlan = () => {
    if (!nutritionPlan) {
      return (
        <Alert variant="info">
          <FaAppleAlt className="me-2" />
          No nutrition plan generated yet. Generate your personalized recommendations first.
        </Alert>
      );
    }

    return (
      <div>
        {/* Nutrition Overview */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-0 bg-primary text-white">
              <Card.Body>
                <h3 className="mb-1">{nutritionPlan.dailyCalories}</h3>
                <small>Daily Calories</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 bg-success text-white">
              <Card.Body>
                <h3 className="mb-1">{nutritionPlan.macros.protein.grams}g</h3>
                <small>Protein</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 bg-info text-white">
              <Card.Body>
                <h3 className="mb-1">{nutritionPlan.macros.carbs.grams}g</h3>
                <small>Carbohydrates</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 bg-warning text-white">
              <Card.Body>
                <h3 className="mb-1">{nutritionPlan.macros.fat.grams}g</h3>
                <small>Fats</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Macronutrient Breakdown */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header>
            <h5 className="mb-0"><FaChartLine className="me-2" />Macronutrient Distribution</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <div className="text-center p-3">
                  <h6 className="text-success">Protein</h6>
                  <ProgressBar 
                    now={nutritionPlan.macros.protein.percentage} 
                    variant="success" 
                    className="mb-2"
                  />
                  <p className="small mb-0">
                    {nutritionPlan.macros.protein.percentage}% • {nutritionPlan.macros.protein.calories} cal
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3">
                  <h6 className="text-info">Carbohydrates</h6>
                  <ProgressBar 
                    now={nutritionPlan.macros.carbs.percentage} 
                    variant="info" 
                    className="mb-2"
                  />
                  <p className="small mb-0">
                    {nutritionPlan.macros.carbs.percentage}% • {nutritionPlan.macros.carbs.calories} cal
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3">
                  <h6 className="text-warning">Fats</h6>
                  <ProgressBar 
                    now={nutritionPlan.macros.fat.percentage} 
                    variant="warning" 
                    className="mb-2"
                  />
                  <p className="small mb-0">
                    {nutritionPlan.macros.fat.percentage}% • {nutritionPlan.macros.fat.calories} cal
                  </p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Meal Planning */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header>
            <h5 className="mb-0"><FaAppleAlt className="me-2" />Daily Meal Structure</h5>
          </Card.Header>
          <Card.Body>
            {Object.entries(nutritionPlan.mealPlan).map(([mealType, options]) => (
              <div key={mealType} className="mb-4">
                <h6 className="text-primary mb-3">
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </h6>
                <Row>
                  {options.map((option, index) => (
                    <Col md={4} key={index} className="mb-3">
                      <Card className="h-100 border-light">
                        <Card.Body>
                          <h6 className="small">{option.name}</h6>
                          <p className="small text-muted mb-2">
                            ~{option.estimatedCalories} calories • {option.prepTime}
                          </p>
                          <ListGroup variant="flush">
                            {option.foods.slice(0, 3).map((food, foodIndex) => (
                              <ListGroup.Item key={foodIndex} className="px-0 py-1 border-0 small">
                                • {food.name}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* Nutrition Tips */}
        <Card className="border-0 shadow-sm">
          <Card.Header>
            <h5 className="mb-0"><FaLightbulb className="me-2" />Nutrition Tips</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6 className="text-primary mb-3">Hydration Goal</h6>
                <div className="d-flex align-items-center mb-3">
                  <FaFire className="text-info me-2" />
                  <span>{nutritionPlan.hydrationGoal} glasses of water daily</span>
                </div>
              </Col>
              <Col md={6}>
                <h6 className="text-primary mb-3">Key Guidelines</h6>
                <ListGroup variant="flush">
                  {nutritionPlan.tips.map((tip, index) => (
                    <ListGroup.Item key={index} className="px-0 py-1 border-0">
                      <small><FaCheckCircle className="text-success me-2" />{tip}</small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    );
  };

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 mb-1">
                  <FaBrain className="text-primary me-2" />
                  Smart Recommendations
                </h1>
                <p className="text-muted mb-0">
                  AI-powered personalized fitness and nutrition plans
                </p>
              </div>
              {(workoutPlan || nutritionPlan) && (
                <Button variant="outline-primary" onClick={generateRecommendations} disabled={loading}>
                  <FaRefresh className="me-2" />
                  Update Plans
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* Message Alert */}
        {message && (
          <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-4">
            {message}
          </Alert>
        )}

        {/* Navigation Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={setActiveTab}
          className="mb-4"
        >
          <Tab eventKey="overview" title="Overview">
            {renderOverview()}
          </Tab>
          <Tab eventKey="workout" title="Workout Plan" disabled={!workoutPlan}>
            {renderWorkoutPlan()}
          </Tab>
          <Tab eventKey="nutrition" title="Nutrition Plan" disabled={!nutritionPlan}>
            {renderNutritionPlan()}
          </Tab>
        </Tabs>

        {/* Workout Detail Modal */}
        <Modal show={showWorkoutModal} onHide={() => setShowWorkoutModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedWorkout?.day} - {selectedWorkout?.focus}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedWorkout && (
              <div>
                <div className="mb-3">
                  <Badge bg="primary" className="me-2">
                    {selectedWorkout.exercises?.length} exercises
                  </Badge>
                  <Badge bg="success">
                    {selectedWorkout.estimatedDuration} minutes
                  </Badge>
                </div>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Sets</th>
                      <th>Reps</th>
                      <th>Rest</th>
                      <th>Muscle Groups</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedWorkout.exercises?.map((exercise, index) => (
                      <tr key={exercise.id || index}>
                        <td className="fw-semibold">{exercise.name}</td>
                        <td>{exercise.sets}</td>
                        <td>{exercise.reps}</td>
                        <td>{exercise.restTime}s</td>
                        <td>
                          {exercise.muscleGroups?.map((group, i) => (
                            <Badge key={i} bg="light" text="dark" className="me-1">
                              {group}
                            </Badge>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowWorkoutModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Container>
  );
}

export default SmartRecommendations;
