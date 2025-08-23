import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, Alert, Badge, 
  ListGroup, ProgressBar, Tabs, Tab, Table, ButtonGroup
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaCalculator, FaUtensils, FaChartBar, FaShoppingCart,
  FaLightbulb, FaDownload, FaShare, FaHeart
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import dietPlannerService from '../services/DietPlannerService';
import foodDatabaseService from '../services/FoodDatabaseService';

function DietPlanner() {
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    goal: 'maintenance',
    activityLevel: 'moderately_active',
    dietaryRestrictions: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mealPlan, setMealPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('plan');
  const [shoppingList, setShoppingList] = useState([]);

  // Initialize form with user profile data if available
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        weight: userProfile.weight || '',
        height: userProfile.height || '',
        age: userProfile.age || '',
        gender: userProfile.gender || 'male',
        goal: userProfile.fitnessGoal || 'maintenance',
        activityLevel: userProfile.activityLevel || 'moderately_active',
        dietaryRestrictions: userProfile.dietaryRestrictions || []
      }));
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (restriction) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setMealPlan(null);

    try {
      // Validate required fields
      if (!formData.weight || !formData.height || !formData.age) {
        throw new Error('Please fill in all required fields');
      }

      // Create user profile for diet planning
      const profile = {
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        age: parseInt(formData.age),
        gender: formData.gender,
        fitnessGoal: formData.goal,
        activityLevel: formData.activityLevel,
        dietaryRestrictions: formData.dietaryRestrictions
      };

      // Generate meal plan
      const plan = dietPlannerService.generateMealPlan(profile);
      setMealPlan(plan);

      // Generate shopping list
      const shopping = dietPlannerService.generateShoppingList(plan);
      setShoppingList(shopping);

    } catch (err) {
      setError(err.message || 'Could not generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate daily targets
  const dailyTargets = formData.weight && formData.height && formData.age ? 
    dietPlannerService.calculateMacroTargets(
      dietPlannerService.calculateDailyCalories({
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        age: parseInt(formData.age),
        gender: formData.gender,
        fitnessGoal: formData.goal,
        activityLevel: formData.activityLevel
      }),
      formData.goal,
      parseFloat(formData.weight)
    ) : null;

  const dietaryRestrictionOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten_free', label: 'Gluten-Free' },
    { value: 'dairy_free', label: 'Dairy-Free' },
    { value: 'low_sodium', label: 'Low Sodium' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
  ];

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4">
          <FaCalculator className="me-2 text-primary" />
          Smart Diet Planner
        </h2>

        <Row>
          <Col lg={4} className="mb-4">
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">
                  <FaUtensils className="me-2" />
                  Plan Your Diet
                </h5>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Weight (kg)</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="weight" 
                          value={formData.weight} 
                          onChange={handleChange} 
                          min="30" 
                          max="300" 
                          step="0.1" 
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Height (cm)</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="height" 
                          value={formData.height} 
                          onChange={handleChange} 
                          min="100" 
                          max="250" 
                          required 
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="age" 
                          value={formData.age} 
                          onChange={handleChange} 
                          min="13" 
                          max="100" 
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Fitness Goal</Form.Label>
                    <Form.Select name="goal" value={formData.goal} onChange={handleChange}>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="endurance">Endurance</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Activity Level</Form.Label>
                    <Form.Select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                      {activityLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      {activityLevels.find(l => l.value === formData.activityLevel)?.description}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Dietary Restrictions</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {dietaryRestrictionOptions.map(option => (
                        <Form.Check
                          key={option.value}
                          type="checkbox"
                          id={option.value}
                          label={option.label}
                          checked={formData.dietaryRestrictions.includes(option.value)}
                          onChange={() => handleCheckboxChange(option.value)}
                          inline
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <div className="d-grid">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Generating...' : 'Generate Plan'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8} className="mb-4">
            {mealPlan ? (
              <Card>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Your Personalized Meal Plan</h5>
                    <ButtonGroup size="sm">
                      <Button variant="outline-primary">
                        <FaDownload className="me-1" />
                        Export
                      </Button>
                      <Button variant="outline-success">
                        <FaShare className="me-1" />
                        Share
                      </Button>
                    </ButtonGroup>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                    <Tab eventKey="plan" title="Meal Plan">
                      <div className="mb-4">
                        <h6>Daily Targets</h6>
                        <Row className="text-center">
                          <Col>
                            <div className="bg-primary text-white p-3 rounded">
                              <h4>{mealPlan.dailyTargets.calories}</h4>
                              <small>Calories</small>
                            </div>
                          </Col>
                          <Col>
                            <div className="bg-success text-white p-3 rounded">
                              <h4>{mealPlan.dailyTargets.protein}g</h4>
                              <small>Protein</small>
                            </div>
                          </Col>
                          <Col>
                            <div className="bg-warning text-dark p-3 rounded">
                              <h4>{mealPlan.dailyTargets.carbs}g</h4>
                              <small>Carbs</small>
                            </div>
                          </Col>
                          <Col>
                            <div className="bg-info text-white p-3 rounded">
                              <h4>{mealPlan.dailyTargets.fat}g</h4>
                              <small>Fat</small>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <h6>Meals</h6>
                      {Object.entries(mealPlan.meals).map(([mealType, meal]) => (
                        <Card key={mealType} className="mb-3">
                          <Card.Header className="bg-light">
                            <h6 className="mb-0">{meal.name}</h6>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col md={8}>
                                <ListGroup variant="flush">
                                  {meal.foods.map((food, idx) => (
                                    <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                                      <span>{food.name}</span>
                                      <Badge bg="light" text="dark">
                                        {food.calories} cal
                                      </Badge>
                                    </ListGroup.Item>
                                  ))}
                                </ListGroup>
                              </Col>
                              <Col md={4}>
                                <div className="text-center">
                                  <h6>Total</h6>
                                  <div className="small">
                                    <div>Calories: {meal.nutrients.calories}</div>
                                    <div>Protein: {meal.nutrients.protein}g</div>
                                    <div>Carbs: {meal.nutrients.carbs}g</div>
                                    <div>Fat: {meal.nutrients.fat}g</div>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                    </Tab>

                    <Tab eventKey="shopping" title="Shopping List">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6>Shopping List</h6>
                        <Button variant="outline-primary" size="sm">
                          <FaShoppingCart className="me-1" />
                          Export List
                        </Button>
                      </div>
                      
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Unit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shoppingList.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.name}</td>
                              <td>
                                <Badge bg="secondary">
                                  {item.category}
                                </Badge>
                              </td>
                              <td>{Math.round(item.amount)}</td>
                              <td>{item.unit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab>

                    <Tab eventKey="tips" title="Nutrition Tips">
                      <div className="mb-3">
                        <h6>
                          <FaLightbulb className="me-2 text-warning" />
                          Tips for {formData.goal.replace('_', ' ')}
                        </h6>
                        <ListGroup>
                          {dietPlannerService.getNutritionTips(formData.goal).map((tip, index) => (
                            <ListGroup.Item key={index}>
                              <FaHeart className="me-2 text-danger" />
                              {tip}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            ) : (
              <Card className="h-100">
                <Card.Body className="d-flex align-items-center justify-content-center text-muted">
                  <div className="text-center">
                    <FaCalculator size={48} className="mb-3 text-muted" />
                    <h5>Ready to Plan Your Diet?</h5>
                    <p>Fill out the form to generate your personalized meal plan</p>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
}

export default DietPlanner;
