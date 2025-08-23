import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, ListGroup } from 'react-bootstrap';

function DietPlanner() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    goal: 'maintain',
    dietaryPreference: 'balanced'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/diet-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: Number(formData.weight),
          height: Number(formData.height),
          goal: formData.goal,
          dietaryPreference: formData.dietaryPreference
        })
      });
      if (!response.ok) throw new Error('Failed to fetch plan');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Could not generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h4 className="mb-0">Diet Planner</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Weight (kg)</Form.Label>
                      <Form.Control type="number" name="weight" value={formData.weight} onChange={handleChange} min="30" max="300" step="0.1" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Height (cm)</Form.Label>
                      <Form.Control type="number" name="height" value={formData.height} onChange={handleChange} min="100" max="250" required />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Goal</Form.Label>
                      <Form.Select name="goal" value={formData.goal} onChange={handleChange}>
                        <option value="cut">Cut (Fat Loss)</option>
                        <option value="maintain">Maintain</option>
                        <option value="bulk">Bulk (Muscle Gain)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dietary Preference</Form.Label>
                      <Form.Select name="dietaryPreference" value={formData.dietaryPreference} onChange={handleChange}>
                        <option value="balanced">Balanced</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="high_protein">High Protein</option>
                        <option value="low_carb">Low Carb</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Plan'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          {result ? (
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Your Plan</h5>
                <Badge bg="warning" text="dark">{result.dietaryPreference}</Badge>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>Target Calories:</strong> {Math.round(result.calories)} kcal/day
                </div>
                <h6>Meals</h6>
                <ListGroup variant="flush">
                  {Array.isArray(result.plan) && result.plan.map((item, idx) => (
                    <ListGroup.Item key={idx} className="d-flex justify-content-between">
                      <span><strong>{item.meal}</strong>: {item.food}</span>
                      <Badge bg="light" text="dark">{item.calories} cal</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          ) : (
            <Card className="h-100">
              <Card.Body className="d-flex align-items-center justify-content-center text-muted">
                Fill the form to generate your personalized plan
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default DietPlanner;
