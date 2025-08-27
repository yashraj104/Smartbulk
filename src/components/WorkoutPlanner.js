import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Button, Form, Alert,
  InputGroup, Badge, ProgressBar, Modal, Table,
  Tabs, Tab, Dropdown, ListGroup
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaPlus, FaEdit, FaTrash, FaPlay, FaPause, FaStop,
  FaDumbbell, FaClock, FaFire, FaCheck, FaTimes,
  FaSave, FaCalendar, FaBullseye, FaHeart
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

function WorkoutPlanner() {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('plans');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'beginner',
    estimatedDuration: 45,
    exercises: []
  });
  const [errors, setErrors] = useState({});

  const exerciseLibrary = [
    { id: 1, name: 'Push-ups', category: 'bodyweight', muscle: 'chest', difficulty: 'beginner' },
    { id: 2, name: 'Pull-ups', category: 'bodyweight', muscle: 'back', difficulty: 'intermediate' },
    { id: 3, name: 'Squats', category: 'bodyweight', muscle: 'legs', difficulty: 'beginner' },
    { id: 4, name: 'Bench Press', category: 'strength', muscle: 'chest', difficulty: 'intermediate' },
    { id: 5, name: 'Deadlift', category: 'strength', muscle: 'back', difficulty: 'advanced' },
    { id: 6, name: 'Overhead Press', category: 'strength', muscle: 'shoulders', difficulty: 'intermediate' },
    { id: 7, name: 'Lunges', category: 'bodyweight', muscle: 'legs', difficulty: 'beginner' },
    { id: 8, name: 'Plank', category: 'bodyweight', muscle: 'core', difficulty: 'beginner' },
    { id: 9, name: 'Burpees', category: 'cardio', muscle: 'full_body', difficulty: 'intermediate' },
    { id: 10, name: 'Mountain Climbers', category: 'cardio', muscle: 'core', difficulty: 'beginner' }
  ];

  useEffect(() => {
    if (currentUser) {
      loadSampleWorkouts();
    }
  }, [currentUser]);

  useEffect(() => {
    let interval;
    if (isWorkoutActive && currentWorkout) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, currentWorkout]);

  if (!currentUser) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          <h4>Please log in to access the workout planner</h4>
          <p>You need to be logged in to create and manage your workout plans.</p>
        </Alert>
      </Container>
    );
  }

  const loadSampleWorkouts = () => {
    const sampleWorkouts = [
      {
        id: 1,
        name: 'Upper Body Strength',
        description: 'Focus on chest, back, and shoulders',
        difficulty: 'intermediate',
        estimatedDuration: 45,
        exercises: [
          { id: 1, name: 'Push-ups', sets: 3, reps: 12, rest: 60 },
          { id: 2, name: 'Pull-ups', sets: 3, reps: 8, rest: 90 },
          { id: 4, name: 'Bench Press', sets: 4, reps: 8, rest: 120 },
          { id: 6, name: 'Overhead Press', sets: 3, reps: 10, rest: 90 }
        ],
        createdDate: '2024-01-01',
        lastUsed: '2024-01-15'
      },
      {
        id: 2,
        name: 'Lower Body Power',
        description: 'Build strength in legs and glutes',
        difficulty: 'intermediate',
        estimatedDuration: 50,
        exercises: [
          { id: 3, name: 'Squats', sets: 4, reps: 12, rest: 90 },
          { id: 7, name: 'Lunges', sets: 3, reps: 15, rest: 60 },
          { id: 5, name: 'Deadlift', sets: 4, reps: 8, rest: 120 }
        ],
        createdDate: '2024-01-01',
        lastUsed: '2024-01-13'
      },
      {
        id: 3,
        name: 'Full Body Circuit',
        description: 'High-intensity full body workout',
        difficulty: 'advanced',
        estimatedDuration: 30,
        exercises: [
          { id: 9, name: 'Burpees', sets: 3, reps: 20, rest: 45 },
          { id: 10, name: 'Mountain Climbers', sets: 3, reps: 30, rest: 30 },
          { id: 8, name: 'Plank', sets: 3, reps: '60s', rest: 45 }
        ],
        createdDate: '2024-01-01',
        lastUsed: '2024-01-12'
      }
    ];
    setWorkoutPlans(sampleWorkouts);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Workout name is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (formData.exercises.length === 0) newErrors.exercises = "At least one exercise is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateWorkout = async () => {
    if (!validateForm()) return;

    try {
      const newWorkout = {
        id: Date.now(),
        ...formData,
        createdDate: new Date().toISOString().split('T')[0],
        lastUsed: null
      };

      setWorkoutPlans(prev => [...prev, newWorkout]);
      setFormData({
        name: '',
        description: '',
        difficulty: 'beginner',
        estimatedDuration: 45,
        exercises: []
      });
      setShowCreateModal(false);
    } catch (error) {
      setErrors({ general: "Failed to create workout. Please try again." });
    }
  };

  const handleStartWorkout = (workout) => {
    setCurrentWorkout(workout);
    setIsWorkoutActive(true);
    setWorkoutTimer(0);
  };

  const handlePauseWorkout = () => {
    setIsWorkoutActive(false);
  };

  const handleResumeWorkout = () => {
    setIsWorkoutActive(true);
  };

  const handleStopWorkout = () => {
    setIsWorkoutActive(false);
    setCurrentWorkout(null);
    setWorkoutTimer(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'danger'
    };
    return colors[difficulty] || 'secondary';
  };

  const renderWorkoutPlans = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Workout Plans</h3>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <FaPlus className="me-2" />
          Create New Workout
        </Button>
      </div>

      <Row>
        {workoutPlans.map(workout => (
          <Col key={workout.id} lg={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="mb-0">{workout.name}</h5>
                  <Badge bg={getDifficultyColor(workout.difficulty)}>
                    {workout.difficulty}
                  </Badge>
                </div>
                <p className="text-muted mb-3">{workout.description}</p>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Duration:</span>
                    <span className="fw-semibold">{workout.estimatedDuration} min</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Exercises:</span>
                    <span className="fw-semibold">{workout.exercises.length}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Last used:</span>
                    <span className="fw-semibold">
                      {workout.lastUsed ? new Date(workout.lastUsed).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <Button 
                    variant="success" 
                    size="sm" 
                    onClick={() => handleStartWorkout(workout)}
                    className="flex-fill"
                  >
                    <FaPlay className="me-2" />
                    Start
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <FaEdit />
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    <FaTrash />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  const renderActiveWorkout = () => {
    if (!currentWorkout) return null;

    return (
      <Card className="border-0 shadow-lg">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Active Workout: {currentWorkout.name}</h4>
            <div className="d-flex align-items-center gap-3">
              <div className="text-center">
                <div className="h3 mb-0">{formatTime(workoutTimer)}</div>
                <small>Duration</small>
              </div>
              <div className="d-flex gap-2">
                {isWorkoutActive ? (
                  <Button variant="warning" onClick={handlePauseWorkout}>
                    <FaPause className="me-2" />
                    Pause
                  </Button>
                ) : (
                  <Button variant="success" onClick={handleResumeWorkout}>
                    <FaPlay className="me-2" />
                    Resume
                  </Button>
                )}
                <Button variant="danger" onClick={handleStopWorkout}>
                  <FaStop className="me-2" />
                  Stop
                </Button>
              </div>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {currentWorkout.exercises.map((exercise, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{exercise.name}</h6>
                  <small className="text-muted">
                    {exercise.sets} sets × {exercise.reps} reps • {exercise.rest}s rest
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-success" size="sm">
                    <FaCheck />
                  </Button>
                  <Button variant="outline-warning" size="sm">
                    <FaPause />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  };

  const renderExerciseLibrary = () => (
    <div>
      <h3>Exercise Library</h3>
      <Row>
        {exerciseLibrary.map(exercise => (
          <Col key={exercise.id} md={6} lg={4} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">{exercise.name}</h6>
                  <Badge bg={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>
                <p className="text-muted mb-2">
                  <small>
                    <FaDumbbell className="me-1" />
                    {exercise.category} • {exercise.muscle}
                  </small>
                </p>
                <Button variant="outline-primary" size="sm" className="w-100">
                  <FaPlus className="me-2" />
                  Add to Workout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  if (!currentUser) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">Please log in to access the workout planner.</Alert>
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
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 mb-1">Workout Planner</h1>
                <p className="text-muted mb-0">
                  Create, customize, and track your workout routines
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Active Workout Display */}
        {currentWorkout && renderActiveWorkout()}

        {/* Navigation Tabs */}
        <Row className="mb-4">
          <Col>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="border-bottom"
            >
              <Tab eventKey="plans" title="Workout Plans">
                {renderWorkoutPlans()}
              </Tab>
              <Tab eventKey="exercises" title="Exercise Library">
                {renderExerciseLibrary()}
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </motion.div>

      {/* Create Workout Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Workout Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter workout name"
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe your workout plan..."
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estimated Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    name="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={handleInputChange}
                    min="15"
                    max="180"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Exercises</Form.Label>
              {formData.exercises.length > 0 ? (
                <ListGroup>
                  {formData.exercises.map((exercise, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{exercise.name}</strong>
                        <br />
                        <small className="text-muted">
                          {exercise.sets} sets × {exercise.reps} reps • {exercise.rest}s rest
                        </small>
                      </div>
                      <Button variant="outline-danger" size="sm">
                        <FaTrash />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4 text-muted">
                  <FaDumbbell size={48} className="mb-3" />
                  <p>No exercises added yet. Add exercises from the library.</p>
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateWorkout}>
            <FaSave className="me-2" />
            Create Workout
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default WorkoutPlanner;
