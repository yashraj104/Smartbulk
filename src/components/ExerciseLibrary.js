import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Button, Form,
  InputGroup, Badge, Modal, Table, Dropdown
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaSearch, FaFilter, FaDumbbell, FaHeart, FaPlay,
  FaInfoCircle, FaMuscle, FaClock, FaFire, FaStar
} from "react-icons/fa";

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState("All");
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Comprehensive exercise database
  const exerciseDatabase = [
    // Chest Exercises
    {
      id: 1,
      name: "Push-ups",
      muscleGroup: "Chest",
      secondaryMuscles: ["Triceps", "Shoulders"],
      difficulty: "Beginner",
      equipment: "Bodyweight",
      instructions: [
        "Start in a plank position with hands slightly wider than shoulders",
        "Lower your body until chest nearly touches the floor",
        "Push back up to starting position",
        "Keep your core tight and body in a straight line"
      ],
      tips: "Focus on controlled movement and proper form",
      caloriesPerMinute: 8,
      sets: "3-4",
      reps: "10-20",
      restTime: "60-90 seconds",
      image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Push-ups"
    },
    {
      id: 2,
      name: "Bench Press",
      muscleGroup: "Chest",
      secondaryMuscles: ["Triceps", "Shoulders"],
      difficulty: "Intermediate",
      equipment: "Barbell",
      instructions: [
        "Lie on bench with feet flat on floor",
        "Grip barbell slightly wider than shoulder width",
        "Lower bar to chest with control",
        "Press bar back up to starting position"
      ],
      tips: "Keep your back flat and core engaged",
      caloriesPerMinute: 12,
      sets: "3-5",
      reps: "6-12",
      restTime: "2-3 minutes",
      image: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Bench+Press"
    },
    {
      id: 3,
      name: "Dumbbell Flyes",
      muscleGroup: "Chest",
      secondaryMuscles: ["Shoulders"],
      difficulty: "Intermediate",
      equipment: "Dumbbells",
      instructions: [
        "Lie on bench with dumbbells held above chest",
        "Lower dumbbells in arc motion to sides",
        "Return to starting position with control",
        "Keep slight bend in elbows throughout"
      ],
      tips: "Focus on chest contraction at the top",
      caloriesPerMinute: 10,
      sets: "3-4",
      reps: "10-15",
      restTime: "90 seconds",
      image: "https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Dumbbell+Flyes"
    },

    // Back Exercises
    {
      id: 4,
      name: "Pull-ups",
      muscleGroup: "Back",
      secondaryMuscles: ["Biceps", "Shoulders"],
      difficulty: "Advanced",
      equipment: "Pull-up Bar",
      instructions: [
        "Hang from pull-up bar with hands shoulder-width apart",
        "Pull your body up until chin is above the bar",
        "Lower back down with control",
        "Keep your core engaged throughout"
      ],
      tips: "Start with assisted pull-ups if needed",
      caloriesPerMinute: 15,
      sets: "3-5",
      reps: "5-15",
      restTime: "2-3 minutes",
      image: "https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Pull-ups"
    },
    {
      id: 5,
      name: "Bent-Over Rows",
      muscleGroup: "Back",
      secondaryMuscles: ["Biceps", "Shoulders"],
      difficulty: "Intermediate",
      equipment: "Barbell",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Bend forward at hips, keeping back straight",
        "Pull barbell to lower chest",
        "Lower with control to starting position"
      ],
      tips: "Keep your back straight and core tight",
      caloriesPerMinute: 11,
      sets: "3-4",
      reps: "8-12",
      restTime: "90 seconds",
      image: "https://via.placeholder.com/300x200/607D8B/FFFFFF?text=Bent+Over+Rows"
    },

    // Leg Exercises
    {
      id: 6,
      name: "Squats",
      muscleGroup: "Legs",
      secondaryMuscles: ["Glutes", "Core"],
      difficulty: "Beginner",
      equipment: "Bodyweight",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Lower body as if sitting back into a chair",
        "Keep knees behind toes and chest up",
        "Return to standing position"
      ],
      tips: "Focus on pushing through your heels",
      caloriesPerMinute: 10,
      sets: "3-4",
      reps: "15-25",
      restTime: "60-90 seconds",
      image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Squats"
    },
    {
      id: 7,
      name: "Deadlifts",
      muscleGroup: "Legs",
      secondaryMuscles: ["Back", "Core"],
      difficulty: "Advanced",
      equipment: "Barbell",
      instructions: [
        "Stand with feet hip-width apart",
        "Bend at hips and knees to lower hands to bar",
        "Grip bar and stand up, keeping bar close to body",
        "Return to starting position with control"
      ],
      tips: "Keep your back straight and core engaged",
      caloriesPerMinute: 14,
      sets: "3-5",
      reps: "5-10",
      restTime: "2-3 minutes",
      image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Deadlifts"
    },

    // Shoulder Exercises
    {
      id: 8,
      name: "Overhead Press",
      muscleGroup: "Shoulders",
      secondaryMuscles: ["Triceps", "Core"],
      difficulty: "Intermediate",
      equipment: "Barbell",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Hold barbell at shoulder level",
        "Press bar overhead until arms are straight",
        "Lower back to starting position"
      ],
      tips: "Keep your core tight and avoid arching back",
      caloriesPerMinute: 11,
      sets: "3-4",
      reps: "8-12",
      restTime: "90 seconds",
      image: "https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Overhead+Press"
    },

    // Arm Exercises
    {
      id: 9,
      name: "Bicep Curls",
      muscleGroup: "Arms",
      secondaryMuscles: ["Forearms"],
      difficulty: "Beginner",
      equipment: "Dumbbells",
      instructions: [
        "Stand with dumbbells at sides",
        "Curl dumbbells up toward shoulders",
        "Lower back down with control",
        "Keep elbows close to body"
      ],
      tips: "Focus on bicep contraction",
      caloriesPerMinute: 8,
      sets: "3-4",
      reps: "12-15",
      restTime: "60 seconds",
      image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Bicep+Curls"
    },
    {
      id: 10,
      name: "Tricep Dips",
      muscleGroup: "Arms",
      secondaryMuscles: ["Chest", "Shoulders"],
      difficulty: "Intermediate",
      equipment: "Dip Bars",
      instructions: [
        "Support yourself on dip bars",
        "Lower body by bending elbows",
        "Push back up to starting position",
        "Keep your body straight"
      ],
      tips: "Keep elbows close to body",
      caloriesPerMinute: 12,
      sets: "3-4",
      reps: "8-15",
      restTime: "90 seconds",
      image: "https://via.placeholder.com/300x200/673AB7/FFFFFF?text=Tricep+Dips"
    },

    // Core Exercises
    {
      id: 11,
      name: "Plank",
      muscleGroup: "Core",
      secondaryMuscles: ["Shoulders", "Back"],
      difficulty: "Beginner",
      equipment: "Bodyweight",
      instructions: [
        "Start in push-up position",
        "Lower to forearms",
        "Keep body in straight line",
        "Hold position"
      ],
      tips: "Focus on breathing and core engagement",
      caloriesPerMinute: 6,
      sets: "3-4",
      reps: "30-60 seconds",
      restTime: "60 seconds",
      image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Plank"
    },
    {
      id: 12,
      name: "Russian Twists",
      muscleGroup: "Core",
      secondaryMuscles: ["Obliques"],
      difficulty: "Intermediate",
      equipment: "Bodyweight",
      instructions: [
        "Sit with knees bent and feet off ground",
        "Hold weight or hands together",
        "Twist torso from side to side",
        "Keep core engaged throughout"
      ],
      tips: "Control the movement and feel the rotation",
      caloriesPerMinute: 9,
      sets: "3-4",
      reps: "20-30",
      restTime: "60 seconds",
      image: "https://via.placeholder.com/300x200/8BC34A/FFFFFF?text=Russian+Twists"
    }
  ];

  const muscleGroups = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];
  const difficultyLevels = ["All", "Beginner", "Intermediate", "Advanced"];
  const equipmentTypes = ["All", "Bodyweight", "Barbell", "Dumbbells", "Pull-up Bar", "Dip Bars"];

  useEffect(() => {
    setExercises(exerciseDatabase);
    setFilteredExercises(exerciseDatabase);
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('exerciseFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('exerciseFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    filterExercises();
  }, [searchTerm, selectedMuscleGroup, selectedDifficulty, selectedEquipment]);

  const filterExercises = () => {
    let filtered = exerciseDatabase;

    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedMuscleGroup !== "All") {
      filtered = filtered.filter(exercise => exercise.muscleGroup === selectedMuscleGroup);
    }

    if (selectedDifficulty !== "All") {
      filtered = filtered.filter(exercise => exercise.difficulty === selectedDifficulty);
    }

    if (selectedEquipment !== "All") {
      filtered = filtered.filter(exercise => exercise.equipment === selectedEquipment);
    }

    setFilteredExercises(filtered);
  };

  const toggleFavorite = (exerciseId) => {
    setFavorites(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const showExerciseDetails = (exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseModal(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "success";
      case "Intermediate": return "warning";
      case "Advanced": return "danger";
      default: return "secondary";
    }
  };

  const getMuscleGroupColor = (muscleGroup) => {
    const colors = {
      "Chest": "primary",
      "Back": "info",
      "Legs": "success",
      "Shoulders": "warning",
      "Arms": "danger",
      "Core": "secondary"
    };
    return colors[muscleGroup] || "secondary";
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="display-4 text-center mb-3">
              <FaDumbbell className="me-3" />
              Exercise Library
            </h1>
            <p className="lead text-center text-muted">
              Discover hundreds of exercises with detailed instructions, tips, and workout plans
            </p>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Row className="mb-4">
          <Col lg={6} className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col lg={6} className="mb-3">
            <Row>
              <Col>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" className="w-100">
                    <FaFilter className="me-2" />
                    {selectedMuscleGroup}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {muscleGroups.map(group => (
                      <Dropdown.Item
                        key={group}
                        onClick={() => setSelectedMuscleGroup(group)}
                        active={selectedMuscleGroup === group}
                      >
                        {group}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" className="w-100">
                    <FaStar className="me-2" />
                    {selectedDifficulty}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {difficultyLevels.map(level => (
                      <Dropdown.Item
                        key={level}
                        onClick={() => setSelectedDifficulty(level)}
                        active={selectedDifficulty === level}
                      >
                        {level}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" className="w-100">
                    <FaDumbbell className="me-2" />
                    {selectedEquipment}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {equipmentTypes.map(equipment => (
                      <Dropdown.Item
                        key={equipment}
                        onClick={() => setSelectedEquipment(equipment)}
                        active={selectedEquipment === equipment}
                      >
                        {equipment}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Results Count */}
        <Row className="mb-3">
          <Col>
            <p className="text-muted">
              Showing {filteredExercises.length} of {exercises.length} exercises
            </p>
          </Col>
        </Row>

        {/* Exercise Grid */}
        <Row>
          {filteredExercises.map((exercise) => (
            <Col key={exercise.id} lg={4} md={6} className="mb-4">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-100 exercise-card">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={exercise.image}
                      alt={exercise.name}
                      className="exercise-image"
                    />
                    <Button
                      variant={favorites.includes(exercise.id) ? "danger" : "outline-danger"}
                      size="sm"
                      className="position-absolute top-0 end-0 m-2"
                      onClick={() => toggleFavorite(exercise.id)}
                    >
                      <FaHeart />
                    </Button>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h5 mb-2">{exercise.name}</Card.Title>
                    <div className="mb-2">
                      <Badge bg={getMuscleGroupColor(exercise.muscleGroup)} className="me-2">
                        {exercise.muscleGroup}
                      </Badge>
                      <Badge bg={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    <p className="text-muted small mb-2">
                      <FaDumbbell className="me-1" />
                      {exercise.equipment}
                    </p>
                    <div className="mt-auto">
                      <Row className="text-center mb-2">
                        <Col>
                          <small className="text-muted">
                            <FaFire className="me-1" />
                            {exercise.caloriesPerMinute} cal/min
                          </small>
                        </Col>
                        <Col>
                          <small className="text-muted">
                            <FaClock className="me-1" />
                            {exercise.restTime}
                          </small>
                        </Col>
                      </Row>
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => showExerciseDetails(exercise)}
                      >
                        <FaInfoCircle className="me-2" />
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* No Results */}
        {filteredExercises.length === 0 && (
          <Row className="text-center py-5">
            <Col>
              <FaDumbbell size={48} className="text-muted mb-3" />
              <h4 className="text-muted">No exercises found</h4>
              <p className="text-muted">Try adjusting your search or filters</p>
            </Col>
          </Row>
        )}
      </motion.div>

      {/* Exercise Detail Modal */}
      <Modal
        show={showExerciseModal}
        onHide={() => setShowExerciseModal(false)}
        size="lg"
        centered
      >
        {selectedExercise && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedExercise.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <img
                    src={selectedExercise.image}
                    alt={selectedExercise.name}
                    className="img-fluid rounded mb-3"
                  />
                  <div className="mb-3">
                    <Badge bg={getMuscleGroupColor(selectedExercise.muscleGroup)} className="me-2">
                      {selectedExercise.muscleGroup}
                    </Badge>
                    <Badge bg={getDifficultyColor(selectedExercise.difficulty)} className="me-2">
                      {selectedExercise.difficulty}
                    </Badge>
                    <Badge bg="secondary">
                      {selectedExercise.equipment}
                    </Badge>
                  </div>
                  <div className="row text-center mb-3">
                    <div className="col">
                      <div className="border rounded p-2">
                        <div className="h5 mb-0">{selectedExercise.sets}</div>
                        <small className="text-muted">Sets</small>
                      </div>
                    </div>
                    <div className="col">
                      <div className="border rounded p-2">
                        <div className="h5 mb-0">{selectedExercise.reps}</div>
                        <small className="text-muted">Reps</small>
                      </div>
                    </div>
                    <div className="col">
                      <div className="border rounded p-2">
                        <div className="h5 mb-0">{selectedExercise.caloriesPerMinute}</div>
                        <small className="text-muted">Cal/min</small>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <h6>Instructions:</h6>
                  <ol className="mb-3">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="mb-2">{instruction}</li>
                    ))}
                  </ol>
                  
                  <h6>Tips:</h6>
                  <p className="text-muted mb-3">{selectedExercise.tips}</p>
                  
                  <h6>Secondary Muscles:</h6>
                  <p className="text-muted mb-3">{selectedExercise.secondaryMuscles.join(", ")}</p>
                  
                  <h6>Rest Time:</h6>
                  <p className="text-muted">{selectedExercise.restTime}</p>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant={favorites.includes(selectedExercise.id) ? "danger" : "outline-danger"}
                onClick={() => toggleFavorite(selectedExercise.id)}
              >
                <FaHeart className="me-2" />
                {favorites.includes(selectedExercise.id) ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
              <Button variant="secondary" onClick={() => setShowExerciseModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
}

export default ExerciseLibrary;
