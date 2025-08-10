import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Button, Form,
  Alert, ProgressBar, Badge, Table
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaCalculator, FaUser, FaWeight, FaRuler,
  FaFire, FaAppleAlt, FaDrumstickBite, FaBreadSlice
} from "react-icons/fa";

function MacroCalculator() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    weight: "",
    height: "",
    activityLevel: "moderate",
    goal: "maintain",
    bodyFat: "",
    calculationMethod: "mifflin"
  });

  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const activityLevels = {
    sedentary: { label: "Sedentary", multiplier: 1.2, description: "Little or no exercise" },
    lightly: { label: "Lightly Active", multiplier: 1.375, description: "Light exercise 1-3 days/week" },
    moderate: { label: "Moderately Active", multiplier: 1.55, description: "Moderate exercise 3-5 days/week" },
    very: { label: "Very Active", multiplier: 1.725, description: "Hard exercise 6-7 days/week" },
    extra: { label: "Extra Active", multiplier: 1.9, description: "Very hard exercise, physical job" }
  };

  const goals = {
    lose: { label: "Lose Weight", proteinMultiplier: 2.2, fatMultiplier: 0.8, deficit: 0.85 },
    maintain: { label: "Maintain Weight", proteinMultiplier: 2.0, fatMultiplier: 1.0, deficit: 1.0 },
    gain: { label: "Gain Weight", proteinMultiplier: 2.2, fatMultiplier: 1.2, surplus: 1.15 }
  };

  const calculationMethods = {
    mifflin: { label: "Mifflin-St Jeor", description: "Most accurate for most people" },
    harris: { label: "Harris-Benedict", description: "Traditional method, slightly less accurate" },
    katch: { label: "Katch-McArdle", description: "Best for those who know body fat %" }
  };

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('macroCalculatorData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('macroCalculatorData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateMacros = () => {
    if (!formData.age || !formData.weight || !formData.height) {
      return;
    }

    let bmr = 0;
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    // Calculate BMR based on selected method
    if (formData.calculationMethod === "mifflin") {
      if (formData.gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
    } else if (formData.calculationMethod === "harris") {
      if (formData.gender === "male") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
    } else if (formData.calculationMethod === "katch" && formData.bodyFat) {
      const bodyFat = parseFloat(formData.bodyFat);
      const leanMass = weight * (1 - bodyFat / 100);
      bmr = 370 + (21.6 * leanMass);
    }

    // Apply activity multiplier
    const tdee = bmr * activityLevels[formData.activityLevel].multiplier;

    // Apply goal multiplier
    const goalMultiplier = goals[formData.goal].deficit || goals[formData.goal].surplus || 1;
    const targetCalories = Math.round(tdee * goalMultiplier);

    // Calculate macros
    const proteinMultiplier = goals[formData.goal].proteinMultiplier;
    const fatMultiplier = goals[formData.goal].fatMultiplier;

    const protein = Math.round((weight * proteinMultiplier));
    const fat = Math.round((targetCalories * 0.25 * fatMultiplier) / 9);
    const carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4);

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories,
      protein,
      fat,
      carbs,
      proteinCalories: protein * 4,
      fatCalories: fat * 9,
      carbCalories: carbs * 4
    });

    setShowResults(true);
  };

  const resetForm = () => {
    setFormData({
      age: "",
      gender: "male",
      weight: "",
      height: "",
      activityLevel: "moderate",
      goal: "maintain",
      bodyFat: "",
      calculationMethod: "mifflin"
    });
    setResults(null);
    setShowResults(false);
  };

  const getGoalColor = (goal) => {
    switch (goal) {
      case "lose": return "danger";
      case "maintain": return "success";
      case "gain": return "warning";
      default: return "primary";
    }
  };

  const getActivityColor = (level) => {
    const colors = {
      sedentary: "secondary",
      lightly: "info",
      moderate: "success",
      very: "warning",
      extra: "danger"
    };
    return colors[level] || "primary";
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
              <FaCalculator className="me-3" />
              Macro Calculator
            </h1>
            <p className="lead text-center text-muted">
              Calculate your daily calorie needs and macronutrient targets based on your goals
            </p>
          </Col>
        </Row>

        <Row>
          {/* Calculator Form */}
          <Col lg={6} className="mb-4">
            <Card className="h-100">
              <Card.Header>
                <h4 className="mb-0">
                  <FaUser className="me-2" />
                  Personal Information
                </h4>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="25"
                          min="15"
                          max="100"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaWeight className="me-1" />
                          Weight (kg)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          placeholder="70"
                          step="0.1"
                          min="30"
                          max="300"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaRuler className="me-1" />
                          Height (cm)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          placeholder="175"
                          min="100"
                          max="250"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Calculation Method</Form.Label>
                    <Form.Select
                      name="calculationMethod"
                      value={formData.calculationMethod}
                      onChange={handleInputChange}
                    >
                      {Object.entries(calculationMethods).map(([key, method]) => (
                        <option key={key} value={key}>
                          {method.label} - {method.description}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {formData.calculationMethod === "katch" && (
                    <Form.Group className="mb-3">
                      <Form.Label>Body Fat Percentage (%)</Form.Label>
                      <Form.Control
                        type="number"
                        name="bodyFat"
                        value={formData.bodyFat}
                        onChange={handleInputChange}
                        placeholder="15"
                        step="0.1"
                        min="5"
                        max="50"
                      />
                      <Form.Text className="text-muted">
                        Required for Katch-McArdle calculation method
                      </Form.Text>
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Activity Level</Form.Label>
                    <Form.Select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleInputChange}
                    >
                      {Object.entries(activityLevels).map(([key, level]) => (
                        <option key={key} value={key}>
                          {level.label} - {level.description}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Goal</Form.Label>
                    <Form.Select
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                    >
                      {Object.entries(goals).map(([key, goal]) => (
                        <option key={key} value={key}>
                          {goal.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={calculateMacros}
                      disabled={!formData.age || !formData.weight || !formData.height}
                    >
                      <FaCalculator className="me-2" />
                      Calculate Macros
                    </Button>
                    <Button variant="outline-secondary" onClick={resetForm}>
                      Reset Form
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Results */}
          <Col lg={6} className="mb-4">
            {showResults && results ? (
              <Card className="h-100">
                <Card.Header>
                  <h4 className="mb-0">
                    <FaFire className="me-2" />
                    Your Results
                  </h4>
                </Card.Header>
                <Card.Body>
                  {/* Summary Stats */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <div className="text-center p-3 border rounded">
                        <div className="h3 text-primary mb-1">{results.targetCalories}</div>
                        <small className="text-muted">Daily Calories</small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-center p-3 border rounded">
                        <div className="h3 text-success mb-1">{results.tdee}</div>
                        <small className="text-muted">TDEE</small>
                      </div>
                    </Col>
                  </Row>

                  {/* Macro Breakdown */}
                  <h6 className="mb-3">Macronutrient Breakdown</h6>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>
                        <FaAppleAlt className="me-1 text-success" />
                        Protein: {results.protein}g
                      </span>
                      <span className="text-muted">{results.proteinCalories} cal</span>
                    </div>
                    <ProgressBar
                      variant="success"
                      now={(results.proteinCalories / results.targetCalories) * 100}
                      className="mb-2"
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>
                        <FaBreadSlice className="me-1 text-warning" />
                        Carbs: {results.carbs}g
                      </span>
                      <span className="text-muted">{results.carbCalories} cal</span>
                    </div>
                    <ProgressBar
                      variant="warning"
                      now={(results.carbCalories / results.targetCalories) * 100}
                      className="mb-2"
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>
                        <FaDrumstickBite className="me-1 text-danger" />
                        Fat: {results.fat}g
                      </span>
                      <span className="text-muted">{results.fatCalories} cal</span>
                    </div>
                    <ProgressBar
                      variant="danger"
                      now={(results.fatCalories / results.targetCalories) * 100}
                    />
                  </div>

                  {/* Detailed Table */}
                  <Table className="mt-4">
                    <thead>
                      <tr>
                        <th>Macro</th>
                        <th>Grams</th>
                        <th>Calories</th>
                        <th>% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Protein</td>
                        <td>{results.protein}g</td>
                        <td>{results.proteinCalories} cal</td>
                        <td>{Math.round((results.proteinCalories / results.targetCalories) * 100)}%</td>
                      </tr>
                      <tr>
                        <td>Carbs</td>
                        <td>{results.carbs}g</td>
                        <td>{results.carbCalories} cal</td>
                        <td>{Math.round((results.carbCalories / results.targetCalories) * 100)}%</td>
                      </tr>
                      <tr>
                        <td>Fat</td>
                        <td>{results.fat}g</td>
                        <td>{results.fatCalories} cal</td>
                        <td>{Math.round((results.fatCalories / results.targetCalories) * 100)}%</td>
                      </tr>
                    </tbody>
                  </Table>

                  {/* Goal Badge */}
                  <div className="text-center mt-3">
                    <Badge bg={getGoalColor(formData.goal)} className="fs-6 p-2">
                      {goals[formData.goal].label}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Card className="h-100">
                <Card.Body className="text-center d-flex align-items-center justify-content-center">
                  <div>
                    <FaCalculator size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">Enter your information</h5>
                    <p className="text-muted">Fill out the form to calculate your macros</p>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Information Cards */}
        <Row className="mt-4">
          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Body className="text-center">
                <FaFire size={32} className="text-primary mb-3" />
                <h5>BMR vs TDEE</h5>
                <p className="text-muted small">
                  BMR (Basal Metabolic Rate) is the calories your body needs at rest. 
                  TDEE (Total Daily Energy Expenditure) includes activity and is your total daily calorie need.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Body className="text-center">
                <FaAppleAlt size={32} className="text-success mb-3" />
                <h5>Protein Guidelines</h5>
                <p className="text-muted small">
                  Protein needs vary by goal: 1.6-2.2g per kg body weight for muscle building, 
                  1.2-1.6g for maintenance, and 1.0-1.2g for weight loss.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Body className="text-center">
                <FaDrumstickBite size={32} className="text-danger mb-3" />
                <h5>Fat Requirements</h5>
                <p className="text-muted small">
                  Fat should be 20-35% of total calories. Essential for hormone production, 
                  vitamin absorption, and overall health.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
}

export default MacroCalculator;
