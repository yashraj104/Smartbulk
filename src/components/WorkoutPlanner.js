import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Card, Button, Form, Table, 
  Modal, Badge, Alert, ProgressBar, Dropdown 
} from "react-bootstrap";
import { motion } from "framer-motion";
import { 
  FaPlus, FaTrash, FaEdit, FaPlay, FaPause, 
  FaDumbbell, FaClock, FaFire, FaCheck 
} from "react-icons/fa";

function WorkoutPlanner() {
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const exerciseDatabase = {
    chest: [
      { name: "Bench Press", category: "Compound", difficulty: "Intermediate", equipment: "Barbell" },
      { name: "Push-ups", category: "Compound", difficulty: "Beginner", equipment: "Bodyweight" },
      { name: "Dumbbell Flyes", category: "Isolation", difficulty: "Beginner", equipment: "Dumbbells" },
      { name: "Incline Bench Press", category: "Compound", difficulty: "Intermediate", equipment: "Barbell" },
      { name: "Decline Push-ups", category: "Compound", difficulty: "Intermediate", equipment: "Bodyweight" }
    ],
    back: [
      { name: "Pull-ups", category: "Compound", difficulty: "Intermediate", equipment: "Bodyweight" },
      { name: "Deadlift", category: "Compound", difficulty: "Advanced", equipment: "Barbell" },
      { name: "Bent-over Rows", category: "Compound", difficulty: "Intermediate", equipment: "Barbell" },
      { name: "Lat Pulldowns", category: "Compound", difficulty: "Beginner", equipment: "Machine" },
      { name: "Face Pulls", category: "Isolation", difficulty: "Beginner", equipment: "Cable" }
    ],
    legs: [
      { name: "Squats", category: "Compound", difficulty: "Intermediate", equipment: "Barbell" },
      { name: "Lunges", category: "Compound", difficulty: "Beginner", equipment: "Bodyweight" },
      { name: "Leg Press", category: "Compound", difficulty: "Beginner", equipment: "Machine" },
      { name: "Romanian Deadlift", category: "Compound", difficulty: "Intermediate", equipment: "Barbell" },
      { name: "Calf Raises", category: "Isolation", difficulty: "Beginner", equipment: "Bodyweight" }
    ],
    shoulders: [
      { name: "Overhead Press", category: "Compound", difficulty: "Intermediate", equipment: "Barbell" },
      { name: "Lateral Raises", category: "Isolation", difficulty: "Beginner", equipment: "Dumbbells" },
      { name: "Front Raises", category: "Isolation", difficulty: "Beginner", equipment: "Dumbbells" },
      { name: "Rear Delt Flyes", category: "Isolation", difficulty: "Beginner", equipment: "Dumbbells" },
      { name: "Upright Rows", category: "Compound", difficulty: "Intermediate", equipment: "Barbell" }
    ],
    arms: [
      { name: "Bicep Curls", category: "Isolation", difficulty: "Beginner", equipment: "Dumbbells" },
      { name: "Tricep Dips", category: "Compound", difficulty: "Intermediate", equipment: "Bodyweight" },
      { name: "Hammer Curls", category: "Isolation", difficulty: "Beginner", equipment: "Dumbbells" },
      { name: "Skull Crushers", category: "Isolation", difficulty: "Intermediate", equipment: "Barbell" },
      { name: "Preacher Curls", category: "Isolation", difficulty: "Intermediate", equipment: "Barbell" }
    ]
  };

  const workoutTemplates = {
    "Push Day": [
      { muscleGroup: "chest", exercises: ["Bench Press", "Incline Bench Press", "Push-ups"], sets: 3, reps: "8-12" },
      { muscleGroup: "shoulders", exercises: ["Overhead Press", "Lateral Raises"], sets: 3, reps: "10-15" },
      { muscleGroup: "arms", exercises: ["Tricep Dips", "Skull Crushers"], sets: 3, reps: "10-15" }
    ],
    "Pull Day": [
      { muscleGroup: "back", exercises: ["Pull-ups", "Bent-over Rows", "Face Pulls"], sets: 3, reps: "8-12" },
      { muscleGroup: "arms", exercises: ["Bicep Curls", "Hammer Curls"], sets: 3, reps: "10-15" }
    ],
    "Leg Day": [
      { muscleGroup: "legs", exercises: ["Squats", "Lunges", "Romanian Deadlift", "Calf Raises"], sets: 3, reps: "8-15" }
    ],
    "Full Body": [
      { muscleGroup: "chest", exercises: ["Push-ups"], sets: 3, reps: "10-15" },
      { muscleGroup: "back", exercises: ["Pull-ups"], sets: 3, reps: "5-10" },
      { muscleGroup: "legs", exercises: ["Squats", "Lunges"], sets: 3, reps: "10-15" },
      { muscleGroup: "shoulders", exercises: ["Lateral Raises"], sets: 3, reps: "10-15" }
    ]
  };

  useEffect(() => {
    // Load saved workouts from localStorage
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
  }, []);

  useEffect(() => {
    // Save workouts to localStorage whenever they change
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = (workout) => {
    setWorkouts([...workouts, { ...workout, id: Date.now(), date: new Date().toISOString() }]);
    setShowModal(false);
    setEditingWorkout(null);
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const startWorkout = (workout) => {
    setIsWorkoutActive(true);
    setCurrentExercise(workout);
    setWorkoutTimer(0);
    
    const interval = setInterval(() => {
      setWorkoutTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopWorkout = () => {
    setIsWorkoutActive(false);
    setCurrentExercise(null);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setWorkoutTimer(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const loadTemplate = (templateName) => {
    const template = workoutTemplates[templateName];
    if (template) {
      const newWorkout = {
        name: templateName,
        exercises: template.map(group => ({
          muscleGroup: group.muscleGroup,
          exercises: group.exercises,
          sets: group.sets,
          reps: group.reps
        })),
        notes: `Generated from ${templateName} template`
      };
      addWorkout(newWorkout);
    }
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold mb-3">
              <FaDumbbell className="me-2 text-warning" />
              Workout Planner
            </h2>
            <p className="text-muted">Plan, track, and optimize your workouts</p>
          </Col>
          <Col xs="auto">
            <Button 
              variant="warning" 
              onClick={() => setShowModal(true)}
              className="fw-semibold"
            >
              <FaPlus className="me-2" />
              Create Workout
            </Button>
          </Col>
        </Row>

        {/* Quick Templates */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <h6 className="fw-semibold mb-3">Quick Templates</h6>
            <div className="d-flex flex-wrap gap-2">
              {Object.keys(workoutTemplates).map(template => (
                <Button
                  key={template}
                  variant="outline-primary"
                  size="sm"
                  onClick={() => loadTemplate(template)}
                >
                  {template}
                </Button>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Active Workout */}
        {isWorkoutActive && currentExercise && (
          <Card className="mb-4 border-warning bg-warning bg-opacity-10">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <h6 className="fw-bold text-warning mb-2">
                    <FaPlay className="me-2" />
                    Active Workout: {currentExercise.name}
                  </h6>
                  <div className="d-flex align-items-center gap-3">
                    <span><FaClock className="me-1" />{formatTime(workoutTimer)}</span>
                    <span><FaFire className="me-1 text-danger" />In Progress</span>
                  </div>
                </Col>
                <Col xs="auto">
                  <Button variant="danger" onClick={stopWorkout}>
                    <FaPause className="me-2" />
                    End Workout
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Workouts List */}
        {workouts.length === 0 ? (
          <Card className="text-center py-5 border-0 shadow-sm">
            <Card.Body>
              <FaDumbbell className="text-muted mb-3" style={{ fontSize: '3rem' }} />
              <h5 className="text-muted">No workouts yet</h5>
              <p className="text-muted mb-3">Create your first workout plan to get started</p>
              <Button variant="warning" onClick={() => setShowModal(true)}>
                Create Workout
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {workouts.map((workout) => (
              <Col lg={6} key={workout.id}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 className="fw-bold mb-1">{workout.name}</h6>
                        <small className="text-muted">
                          {new Date(workout.date).toLocaleDateString()}
                        </small>
                      </div>
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm">
                          <FaEdit />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => startWorkout(workout)}>
                            <FaPlay className="me-2" />Start Workout
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => deleteWorkout(workout.id)}>
                            <FaTrash className="me-2" />Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    
                    <div className="mb-3">
                      {workout.exercises.map((group, idx) => (
                        <div key={idx} className="mb-2">
                          <Badge bg="primary" className="me-2">{group.muscleGroup}</Badge>
                          <small className="text-muted">
                            {group.exercises.join(', ')} - {group.sets} sets × {group.reps}
                          </small>
                        </div>
                      ))}
                    </div>
                    
                    {workout.notes && (
                      <small className="text-muted d-block mb-3">{workout.notes}</small>
                    )}
                    
                    <Button 
                      variant="outline-warning" 
                      size="sm" 
                      onClick={() => startWorkout(workout)}
                      className="w-100"
                    >
                      <FaPlay className="me-2" />
                      Start Workout
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </motion.div>

      {/* Create/Edit Workout Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingWorkout ? 'Edit Workout' : 'Create New Workout'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateWorkoutForm 
            onSubmit={addWorkout}
            exerciseDatabase={exerciseDatabase}
            editingWorkout={editingWorkout}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

// Create Workout Form Component
function CreateWorkoutForm({ onSubmit, exerciseDatabase, editingWorkout }) {
  const [formData, setFormData] = useState({
    name: editingWorkout?.name || '',
    exercises: editingWorkout?.exercises || [],
    notes: editingWorkout?.notes || ''
  });

  const [currentExercise, setCurrentExercise] = useState({
    muscleGroup: '',
    exercises: [],
    sets: 3,
    reps: '8-12'
  });

  const addExerciseGroup = () => {
    if (currentExercise.muscleGroup && currentExercise.exercises.length > 0) {
      setFormData({
        ...formData,
        exercises: [...formData.exercises, { ...currentExercise }]
      });
      setCurrentExercise({ muscleGroup: '', exercises: [], sets: 3, reps: '8-12' });
    }
  };

  const removeExerciseGroup = (index) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.exercises.length > 0) {
      onSubmit(formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Workout Name</Form.Label>
        <Form.Control
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Push Day, Leg Day"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Add Exercise Group</Form.Label>
        <Row className="g-2 mb-2">
          <Col md={4}>
            <Form.Select
              value={currentExercise.muscleGroup}
              onChange={(e) => setCurrentExercise({ ...currentExercise, muscleGroup: e.target.value })}
            >
              <option value="">Select Muscle Group</option>
              {Object.keys(exerciseDatabase).map(group => (
                <option key={group} value={group}>{group.charAt(0).toUpperCase() + group.slice(1)}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Control
              type="number"
              placeholder="Sets"
              value={currentExercise.sets}
              onChange={(e) => setCurrentExercise({ ...currentExercise, sets: parseInt(e.target.value) })}
              min="1"
              max="10"
            />
          </Col>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Reps (e.g., 8-12)"
              value={currentExercise.reps}
              onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
            />
          </Col>
        </Row>
        
        {currentExercise.muscleGroup && (
          <div className="mb-2">
            <small className="text-muted">Select exercises:</small>
            <div className="d-flex flex-wrap gap-1 mt-1">
              {exerciseDatabase[currentExercise.muscleGroup]?.map(exercise => (
                <Form.Check
                  key={exercise.name}
                  type="checkbox"
                  id={exercise.name}
                  label={exercise.name}
                  checked={currentExercise.exercises.includes(exercise.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCurrentExercise({
                        ...currentExercise,
                        exercises: [...currentExercise.exercises, exercise.name]
                      });
                    } else {
                      setCurrentExercise({
                        ...currentExercise,
                        exercises: currentExercise.exercises.filter(ex => ex !== exercise.name)
                      });
                    }
                  }}
                  inline
                />
              ))}
            </div>
          </div>
        )}
        
        <Button 
          type="button" 
          variant="outline-primary" 
          size="sm"
          onClick={addExerciseGroup}
          disabled={!currentExercise.muscleGroup || currentExercise.exercises.length === 0}
        >
          Add Exercise Group
        </Button>
      </Form.Group>

      {/* Added Exercise Groups */}
      {formData.exercises.length > 0 && (
        <div className="mb-3">
          <h6>Exercise Groups:</h6>
          {formData.exercises.map((group, index) => (
            <Card key={index} className="mb-2">
              <Card.Body className="py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Badge bg="primary" className="me-2">{group.muscleGroup}</Badge>
                    <span className="fw-semibold">{group.exercises.join(', ')}</span>
                    <small className="text-muted ms-2">{group.sets} sets × {group.reps}</small>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeExerciseGroup(index)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Notes (Optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any notes or instructions for this workout..."
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button type="submit" variant="warning" className="fw-semibold">
          {editingWorkout ? 'Update Workout' : 'Create Workout'}
        </Button>
        <Button type="button" variant="outline-secondary">
          Cancel
        </Button>
      </div>
    </Form>
  );
}

export default WorkoutPlanner;
