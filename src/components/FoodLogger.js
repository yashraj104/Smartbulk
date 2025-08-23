import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Table,
  Modal, InputGroup, FormControl, Badge, ProgressBar,
  Alert, Tabs, Tab, ListGroup, ListGroupItem
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaSearch, FaPlus, FaEdit, FaTrash, FaCalculator,
  FaUtensils, FaChartBar, FaShoppingCart, FaLightbulb
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import foodDatabaseService from '../services/FoodDatabaseService';
import dietPlannerService from '../services/DietPlannerService';

function FoodLogger() {
  const { userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingSize, setServingSize] = useState(100);
  const [servingUnit, setServingUnit] = useState('g');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);
  const [loggedFoods, setLoggedFoods] = useState([]);
  const [activeTab, setActiveTab] = useState('log');
  const [customFood, setCustomFood] = useState({
    name: '',
    category: 'protein',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    servingSize: '100',
    unit: 'g'
  });

  // Get daily targets
  const dailyTargets = userProfile ? dietPlannerService.calculateMacroTargets(
    dietPlannerService.calculateDailyCalories(userProfile),
    userProfile.fitnessGoal || 'maintenance',
    userProfile.weight || 70
  ) : { calories: 2000, protein: 140, carbs: 200, fat: 67 };

  // Search foods
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = foodDatabaseService.searchFoods(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Add food to log
  const handleAddFood = () => {
    if (!selectedFood) return;

    const nutrients = foodDatabaseService.calculateNutrients(
      selectedFood.id,
      servingSize,
      servingUnit
    );

    if (nutrients) {
      const loggedFood = {
        ...nutrients,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        mealType: 'snack' // Default meal type
      };

      setLoggedFoods(prev => [...prev, loggedFood]);
      foodDatabaseService.addToRecent(selectedFood.id);
      
      // Reset form
      setSelectedFood(null);
      setServingSize(100);
      setServingUnit('g');
      setShowAddModal(false);
    }
  };

  // Remove food from log
  const handleRemoveFood = (foodId) => {
    setLoggedFoods(prev => prev.filter(food => food.id !== foodId));
  };

  // Add custom food
  const handleAddCustomFood = () => {
    const newFood = foodDatabaseService.addCustomFood(customFood);
    setLoggedFoods(prev => [...prev, {
      ...newFood,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      mealType: 'snack'
    }]);
    
    // Reset form
    setCustomFood({
      name: '',
      category: 'protein',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      servingSize: '100',
      unit: 'g'
    });
    setShowCustomFoodModal(false);
  };

  // Calculate nutrition summary
  const nutritionSummary = dietPlannerService.calculateNutritionSummary(loggedFoods);

  // Calculate progress percentages
  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  // Get recent foods
  const recentFoods = foodDatabaseService.getRecentFoods();
  const popularFoods = foodDatabaseService.getPopularFoods();
  const categories = foodDatabaseService.getCategories();

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4">
              <FaUtensils className="me-2 text-primary" />
              Food Logger
            </h2>

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
              <Tab eventKey="log" title="Log Food">
                <Row>
                  <Col lg={8}>
                    {/* Food Search */}
                    <Card className="mb-4">
                      <Card.Body>
                        <h5 className="mb-3">Search & Add Food</h5>
                        
                        <InputGroup className="mb-3">
                          <InputGroup.Text>
                            <FaSearch />
                          </InputGroup.Text>
                          <FormControl
                            placeholder="Search for foods..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                          />
                        </InputGroup>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                          <ListGroup className="mb-3">
                            {searchResults.map((food) => (
                              <ListGroupItem
                                key={food.id}
                                action
                                onClick={() => {
                                  setSelectedFood(food);
                                  setShowAddModal(true);
                                }}
                                className="d-flex justify-content-between align-items-center"
                              >
                                <div>
                                  <strong>{food.name}</strong>
                                  <br />
                                  <small className="text-muted">
                                    {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
                                  </small>
                                </div>
                                <Badge bg={food.source === 'database' ? 'primary' : 'success'}>
                                  {food.source === 'database' ? 'Database' : 'Custom'}
                                </Badge>
                              </ListGroupItem>
                            ))}
                          </ListGroup>
                        )}

                        {/* Quick Add Buttons */}
                        <div className="d-flex gap-2 flex-wrap">
                          <Button
                            variant="outline-primary"
                            onClick={() => setShowCustomFoodModal(true)}
                          >
                            <FaPlus className="me-2" />
                            Add Custom Food
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Recent & Popular Foods */}
                    <Row>
                      <Col md={6}>
                        <Card className="mb-4">
                          <Card.Body>
                            <h6 className="mb-3">Recent Foods</h6>
                            {recentFoods.length > 0 ? (
                              <ListGroup>
                                {recentFoods.slice(0, 5).map((food) => (
                                  <ListGroupItem
                                    key={food.id}
                                    action
                                    onClick={() => {
                                      setSelectedFood(food);
                                      setShowAddModal(true);
                                    }}
                                    className="py-2"
                                  >
                                    <small>{food.name}</small>
                                  </ListGroupItem>
                                ))}
                              </ListGroup>
                            ) : (
                              <p className="text-muted small">No recent foods</p>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="mb-4">
                          <Card.Body>
                            <h6 className="mb-3">Popular Foods</h6>
                            <ListGroup>
                              {popularFoods.slice(0, 5).map((food) => (
                                <ListGroupItem
                                  key={food.id}
                                  action
                                  onClick={() => {
                                    setSelectedFood(food);
                                    setShowAddModal(true);
                                  }}
                                  className="py-2"
                                >
                                  <small>{food.name}</small>
                                </ListGroupItem>
                              ))}
                            </ListGroup>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={4}>
                    {/* Nutrition Summary */}
                    <Card className="mb-4">
                      <Card.Body>
                        <h5 className="mb-3">
                          <FaChartBar className="me-2 text-primary" />
                          Today's Summary
                        </h5>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Calories</span>
                            <span>{nutritionSummary.calories} / {dailyTargets.calories}</span>
                          </div>
                          <ProgressBar
                            variant={getProgressPercentage(nutritionSummary.calories, dailyTargets.calories) > 100 ? 'danger' : 'primary'}
                            now={getProgressPercentage(nutritionSummary.calories, dailyTargets.calories)}
                          />
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Protein</span>
                            <span>{nutritionSummary.protein}g / {dailyTargets.protein}g</span>
                          </div>
                          <ProgressBar
                            variant="success"
                            now={getProgressPercentage(nutritionSummary.protein, dailyTargets.protein)}
                          />
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Carbs</span>
                            <span>{nutritionSummary.carbs}g / {dailyTargets.carbs}g</span>
                          </div>
                          <ProgressBar
                            variant="warning"
                            now={getProgressPercentage(nutritionSummary.carbs, dailyTargets.carbs)}
                          />
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Fat</span>
                            <span>{nutritionSummary.fat}g / {dailyTargets.fat}g</span>
                          </div>
                          <ProgressBar
                            variant="info"
                            now={getProgressPercentage(nutritionSummary.fat, dailyTargets.fat)}
                          />
                        </div>

                        <hr />
                        
                        <div className="small text-muted">
                          <div>Fiber: {nutritionSummary.fiber}g</div>
                          <div>Sugar: {nutritionSummary.sugar}g</div>
                          <div>Sodium: {nutritionSummary.sodium}mg</div>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Nutrition Tips */}
                    <Card>
                      <Card.Body>
                        <h6 className="mb-3">
                          <FaLightbulb className="me-2 text-warning" />
                          Tips
                        </h6>
                        {userProfile?.fitnessGoal && (
                          <ul className="small">
                            {dietPlannerService.getNutritionTips(userProfile.fitnessGoal).slice(0, 3).map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="history" title="Food History">
                <Card>
                  <Card.Body>
                    <h5 className="mb-3">Logged Foods</h5>
                    {loggedFoods.length > 0 ? (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Food</th>
                            <th>Serving</th>
                            <th>Calories</th>
                            <th>Protein</th>
                            <th>Carbs</th>
                            <th>Fat</th>
                            <th>Time</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loggedFoods.map((food) => (
                            <tr key={food.id}>
                              <td>{food.name}</td>
                              <td>{food.servingSize}</td>
                              <td>{food.calories}</td>
                              <td>{food.protein}g</td>
                              <td>{food.carbs}g</td>
                              <td>{food.fat}g</td>
                              <td>{new Date(food.timestamp).toLocaleTimeString()}</td>
                              <td>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleRemoveFood(food.id)}
                                >
                                  <FaTrash />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <Alert variant="info">No foods logged today. Start by adding some foods!</Alert>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </motion.div>
        </Col>
      </Row>

      {/* Add Food Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Food</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFood && (
            <div>
              <h6>{selectedFood.name}</h6>
              <p className="text-muted">
                {selectedFood.calories} cal • {selectedFood.protein}g protein • {selectedFood.carbs}g carbs • {selectedFood.fat}g fat
              </p>
              
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Serving Size</Form.Label>
                    <InputGroup>
                      <FormControl
                        type="number"
                        value={servingSize}
                        onChange={(e) => setServingSize(parseFloat(e.target.value))}
                        min="1"
                      />
                      <Form.Select
                        value={servingUnit}
                        onChange={(e) => setServingUnit(e.target.value)}
                      >
                        <option value="g">grams</option>
                        <option value="piece">piece</option>
                        <option value="tbsp">tbsp</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Meal</Form.Label>
                    <Form.Select>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {servingSize > 0 && (
                <div className="bg-light p-3 rounded">
                  <h6>Nutrition for {servingSize}{servingUnit}:</h6>
                  <div className="row text-center">
                    <div className="col">
                      <strong>{Math.round(selectedFood.calories * servingSize / 100)}</strong>
                      <br />
                      <small>Calories</small>
                    </div>
                    <div className="col">
                      <strong>{Math.round(selectedFood.protein * servingSize / 100 * 10) / 10}g</strong>
                      <br />
                      <small>Protein</small>
                    </div>
                    <div className="col">
                      <strong>{Math.round(selectedFood.carbs * servingSize / 100 * 10) / 10}g</strong>
                      <br />
                      <small>Carbs</small>
                    </div>
                    <div className="col">
                      <strong>{Math.round(selectedFood.fat * servingSize / 100 * 10) / 10}g</strong>
                      <br />
                      <small>Fat</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddFood}>
            Add Food
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Food Modal */}
      <Modal show={showCustomFoodModal} onHide={() => setShowCustomFoodModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Custom Food</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Food Name</Form.Label>
                <FormControl
                  value={customFood.name}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter food name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={customFood.category}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Calories</Form.Label>
                <FormControl
                  type="number"
                  value={customFood.calories}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, calories: parseFloat(e.target.value) || 0 }))}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Protein (g)</Form.Label>
                <FormControl
                  type="number"
                  step="0.1"
                  value={customFood.protein}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, protein: parseFloat(e.target.value) || 0 }))}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Carbs (g)</Form.Label>
                <FormControl
                  type="number"
                  step="0.1"
                  value={customFood.carbs}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, carbs: parseFloat(e.target.value) || 0 }))}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fat (g)</Form.Label>
                <FormControl
                  type="number"
                  step="0.1"
                  value={customFood.fat}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, fat: parseFloat(e.target.value) || 0 }))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Fiber (g)</Form.Label>
                <FormControl
                  type="number"
                  step="0.1"
                  value={customFood.fiber}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, fiber: parseFloat(e.target.value) || 0 }))}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Sugar (g)</Form.Label>
                <FormControl
                  type="number"
                  step="0.1"
                  value={customFood.sugar}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, sugar: parseFloat(e.target.value) || 0 }))}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Sodium (mg)</Form.Label>
                <FormControl
                  type="number"
                  value={customFood.sodium}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, sodium: parseFloat(e.target.value) || 0 }))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Serving Size</Form.Label>
                <FormControl
                  type="number"
                  value={customFood.servingSize}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, servingSize: e.target.value }))}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Unit</Form.Label>
                <Form.Select
                  value={customFood.unit}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, unit: e.target.value }))}
                >
                  <option value="g">grams (g)</option>
                  <option value="piece">piece</option>
                  <option value="tbsp">tablespoon (tbsp)</option>
                  <option value="cup">cup</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCustomFoodModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCustomFood}>
            Add Custom Food
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default FoodLogger;
