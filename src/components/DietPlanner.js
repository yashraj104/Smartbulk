import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Card, Button, Form, 
  Modal, Badge, ProgressBar, Dropdown 
} from "react-bootstrap";
import { motion } from "framer-motion";
import { 
  FaPlus, FaTrash, FaEdit, FaAppleAlt, FaCalculator 
} from "react-icons/fa";

function DietPlanner() {
  const [meals, setMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  });
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const foodDatabase = {
    proteins: [
      { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      { name: "Salmon", calories: 208, protein: 25, carbs: 0, fat: 12 },
      { name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fat: 11 },
      { name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4 }
    ],
    carbs: [
      { name: "Brown Rice", calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
      { name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
      { name: "Oatmeal", calories: 68, protein: 2.4, carbs: 12, fat: 1.4 },
      { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 }
    ],
    fats: [
      { name: "Avocado", calories: 160, protein: 2, carbs: 9, fat: 15 },
      { name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50 },
      { name: "Olive Oil", calories: 884, protein: 0, carbs: 0, fat: 100 }
    ]
  };

  const mealTemplates = {
    "High Protein": {
      breakfast: ["Eggs", "Oatmeal"],
      lunch: ["Chicken Breast", "Brown Rice", "Broccoli"],
      dinner: ["Salmon", "Sweet Potato"]
    },
    "Balanced": {
      breakfast: ["Oatmeal", "Banana", "Almonds"],
      lunch: ["Chicken Breast", "Brown Rice"],
      dinner: ["Salmon", "Sweet Potato", "Spinach"]
    }
  };

  useEffect(() => {
    const savedMeals = localStorage.getItem('meals');
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals));
  }, [meals]);

  const addMeal = (meal) => {
    setMeals([...meals, { ...meal, id: Date.now(), date: currentDate }]);
    setShowModal(false);
  };

  const deleteMeal = (id) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const loadTemplate = (templateName) => {
    const template = mealTemplates[templateName];
    if (template) {
      const newMeals = [];
      
      Object.entries(template).forEach(([mealType, foods]) => {
        const meal = {
          name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
          foods: foods.map(foodName => {
            for (const category of Object.values(foodDatabase)) {
              const food = category.find(f => f.name === foodName);
              if (food) return { ...food, quantity: 1 };
            }
            return { name: foodName, calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1 };
          }),
          time: mealType === 'breakfast' ? '08:00' : mealType === 'lunch' ? '12:00' : '18:00'
        };
        newMeals.push(meal);
      });
      
      setMeals([...meals, ...newMeals.map(meal => ({ ...meal, id: Date.now() + Math.random(), date: currentDate }))]);
    }
  };

  const getDailyTotals = () => {
    const dailyMeals = meals.filter(m => m.date === currentDate);
    return dailyMeals.reduce((totals, meal) => {
      meal.foods.forEach(food => {
        totals.calories += (food.calories * food.quantity);
        totals.protein += (food.protein * food.quantity);
        totals.carbs += (food.carbs * food.quantity);
        totals.fat += (food.fat * food.quantity);
      });
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const dailyTotals = getDailyTotals();

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
              <FaAppleAlt className="me-2 text-success" />
              Diet Planner
            </h2>
            <p className="text-muted">Plan your nutrition and track your macros</p>
          </Col>
          <Col xs="auto">
            <Button 
              variant="success" 
              onClick={() => setShowModal(true)}
              className="fw-semibold"
            >
              <FaPlus className="me-2" />
              Add Meal
            </Button>
          </Col>
        </Row>

        {/* Date Selector */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Select Date</Form.Label>
              <Form.Control
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Quick Templates */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <h6 className="fw-semibold mb-3">Quick Meal Templates</h6>
            <div className="d-flex flex-wrap gap-2">
              {Object.keys(mealTemplates).map(template => (
                <Button
                  key={template}
                  variant="outline-success"
                  size="sm"
                  onClick={() => loadTemplate(template)}
                >
                  {template}
                </Button>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Daily Progress */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-semibold mb-3">Daily Progress</h6>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Calories</small>
                        <small>{dailyTotals.calories} / {dailyGoals.calories}</small>
                      </div>
                      <ProgressBar 
                        variant={dailyTotals.calories > dailyGoals.calories ? "danger" : "success"}
                        now={(dailyTotals.calories / dailyGoals.calories) * 100} 
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Protein (g)</small>
                        <small>{dailyTotals.protein.toFixed(1)} / {dailyGoals.protein}</small>
                      </div>
                      <ProgressBar 
                        variant="primary"
                        now={(dailyTotals.protein / dailyGoals.protein) * 100} 
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Carbs (g)</small>
                        <small>{dailyTotals.carbs.toFixed(1)} / {dailyGoals.carbs}</small>
                      </div>
                      <ProgressBar 
                        variant="warning"
                        now={(dailyTotals.carbs / dailyGoals.carbs) * 100} 
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Fat (g)</small>
                        <small>{dailyTotals.fat.toFixed(1)} / {dailyGoals.fat}</small>
                      </div>
                      <ProgressBar 
                        variant="info"
                        now={(dailyTotals.fat / dailyGoals.fat) * 100} 
                      />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-semibold mb-3">Daily Goals</h6>
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label size="sm">Calories</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      value={dailyGoals.calories}
                      onChange={(e) => setDailyGoals({ ...dailyGoals, calories: parseInt(e.target.value) })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label size="sm">Protein (g)</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      value={dailyGoals.protein}
                      onChange={(e) => setDailyGoals({ ...dailyGoals, protein: parseInt(e.target.value) })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label size="sm">Carbs (g)</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      value={dailyGoals.carbs}
                      onChange={(e) => setDailyGoals({ ...dailyGoals, carbs: parseInt(e.target.value) })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label size="sm">Fat (g)</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      value={dailyGoals.fat}
                      onChange={(e) => setDailyGoals({ ...dailyGoals, fat: parseInt(e.target.value) })}
                    />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Meals List */}
        {meals.filter(m => m.date === currentDate).length === 0 ? (
          <Card className="text-center py-5 border-0 shadow-sm">
            <Card.Body>
              <FaAppleAlt className="text-muted mb-3" style={{ fontSize: '3rem' }} />
              <h5 className="text-muted">No meals planned for today</h5>
              <p className="text-muted mb-3">Add your first meal to start tracking your nutrition</p>
              <Button variant="success" onClick={() => setShowModal(true)}>
                Add Meal
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <div>
            <h5 className="fw-bold mb-3">Today's Meals</h5>
            {meals
              .filter(m => m.date === currentDate)
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((meal) => (
                <Card key={meal.id} className="mb-3 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 className="fw-bold mb-1">{meal.name}</h6>
                        <small className="text-muted">{meal.time}</small>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteMeal(meal.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                    
                    <Row className="g-2">
                      {meal.foods.map((food, idx) => (
                        <Col md={6} lg={4} key={idx}>
                          <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                            <div>
                              <small className="fw-semibold">{food.name}</small>
                              <br />
                              <small className="text-muted">
                                {food.calories * food.quantity} cal, {food.protein * food.quantity}g protein
                              </small>
                            </div>
                            <Badge bg="secondary">{food.quantity}x</Badge>
                          </div>
                        </Col>
                      ))}
                    </Row>
                    
                    <div className="mt-3 pt-2 border-top">
                      <small className="text-muted">
                        Total: {meal.foods.reduce((sum, food) => sum + (food.calories * food.quantity), 0)} calories
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              ))}
          </div>
        )}
      </motion.div>

      {/* Add Meal Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Meal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateMealForm 
            onSubmit={addMeal}
            foodDatabase={foodDatabase}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

// Create Meal Form Component
function CreateMealForm({ onSubmit, foodDatabase }) {
  const [formData, setFormData] = useState({
    name: '',
    time: '12:00',
    foods: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodQuantity, setFoodQuantity] = useState(1);

  const addFood = () => {
    if (selectedFood && foodQuantity > 0) {
      setFormData({
        ...formData,
        foods: [...formData.foods, { ...selectedFood, quantity: foodQuantity }]
      });
      setSelectedFood(null);
      setFoodQuantity(1);
    }
  };

  const removeFood = (index) => {
    setFormData({
      ...formData,
      foods: formData.foods.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.foods.length > 0) {
      onSubmit(formData);
    }
  };

  const filteredFoods = Object.entries(foodDatabase).flatMap(([category, foods]) =>
    foods.filter(food => 
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Meal Name</Form.Label>
        <Form.Control
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Breakfast, Lunch, Dinner, Snack"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Meal Time</Form.Label>
        <Form.Control
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Add Food</Form.Label>
        <Row className="g-2 mb-2">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search for food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              placeholder="Qty"
              value={foodQuantity}
              onChange={(e) => setFoodQuantity(parseFloat(e.target.value))}
              min="0.1"
              step="0.1"
            />
          </Col>
          <Col md={3}>
            <Button 
              type="button" 
              variant="outline-success" 
              onClick={addFood}
              disabled={!selectedFood || foodQuantity <= 0}
              className="w-100"
            >
              Add
            </Button>
          </Col>
        </Row>
        
        {searchTerm && (
          <div className="border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredFoods.slice(0, 10).map((food, idx) => (
              <div 
                key={idx}
                className={`p-2 border-bottom cursor-pointer ${selectedFood?.name === food.name ? 'bg-primary text-white' : ''}`}
                onClick={() => setSelectedFood(food)}
                style={{ cursor: 'pointer' }}
              >
                <div className="fw-semibold">{food.name}</div>
                <small className="text-muted">
                  {food.calories} cal, {food.protein}g protein, {food.carbs}g carbs, {food.fat}g fat
                </small>
              </div>
            ))}
          </div>
        )}
      </Form.Group>

      {/* Added Foods */}
      {formData.foods.length > 0 && (
        <div className="mb-3">
          <h6>Selected Foods:</h6>
          {formData.foods.map((food, index) => (
            <Card key={index} className="mb-2">
              <Card.Body className="py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-semibold">{food.name}</span>
                    <small className="text-muted ms-2">
                      {food.calories * food.quantity} cal, {food.protein * food.quantity}g protein
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="secondary">{food.quantity}x</Badge>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFood(index)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <div className="d-flex gap-2">
        <Button type="submit" variant="success" className="fw-semibold">
          Add Meal
        </Button>
        <Button type="button" variant="outline-secondary">
          Cancel
        </Button>
      </div>
    </Form>
  );
}

export default DietPlanner;
