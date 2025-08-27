import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Badge,
  Tabs, Tab, ProgressBar, Image
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEdit, FaSave, FaTimes, FaCamera, FaWeight,
  FaRuler, FaBirthdayCake, FaBullseye, FaFire, FaHeart,
  FaChartLine, FaTrophy, FaHistory
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    activityLevel: '',
    dietaryRestrictions: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        age: userProfile.age || '',
        gender: userProfile.gender || '',
        height: userProfile.height || '',
        weight: userProfile.weight || '',
        fitnessGoal: userProfile.fitnessGoal || '',
        activityLevel: userProfile.activityLevel || '',
        dietaryRestrictions: userProfile.dietaryRestrictions || []
      });
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
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

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateUserProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        age: userProfile.age || '',
        gender: userProfile.gender || '',
        height: userProfile.height || '',
        weight: userProfile.weight || '',
        fitnessGoal: userProfile.fitnessGoal || '',
        activityLevel: userProfile.activityLevel || '',
        dietaryRestrictions: userProfile.dietaryRestrictions || []
      });
    }
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          <h4>Please log in to access your profile</h4>
        </Alert>
      </Container>
    );
  }

  const fitnessGoals = [
    { value: 'weight_loss', label: 'Weight Loss', icon: '🔥' },
    { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
    { value: 'endurance', label: 'Endurance', icon: '🏃‍♂️' },
    { value: 'strength', label: 'Strength', icon: '🏋️‍♂️' },
    { value: 'general_fitness', label: 'General Fitness', icon: '🌟' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
  ];

  const dietaryRestrictions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten_free', label: 'Gluten-Free' },
    { value: 'dairy_free', label: 'Dairy-Free' },
    { value: 'low_sodium', label: 'Low Sodium' }
  ];

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row>
          <Col lg={4} className="mb-4">
            {/* Profile Card */}
            <Card className="border-0 shadow-sm text-center">
              <Card.Body className="p-4">
                <div className="position-relative mb-3">
                  <div className="bg-primary text-white rounded-circle p-4 mx-auto mb-3" style={{width: '120px', height: '120px'}}>
                    <FaUser size={48} />
                  </div>
                  {isEditing && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="position-absolute"
                      style={{ top: '10px', right: '10px' }}
                    >
                      <FaCamera />
                    </Button>
                  )}
                </div>
                
                <h4 className="mb-2">{userProfile?.displayName || currentUser.email}</h4>
                <p className="text-muted mb-3">{currentUser.email}</p>
                
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <Badge bg="primary">{userProfile?.fitnessGoal || 'General'}</Badge>
                  <Badge bg="success">{userProfile?.activityLevel || 'Moderate'}</Badge>
                </div>
                
                {!isEditing ? (
                  <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
                    <FaEdit className="me-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="d-flex gap-2 justify-content-center">
                    <Button variant="success" onClick={handleSave} disabled={loading}>
                      {loading ? 'Saving...' : <><FaSave className="me-2" />Save</>}
                    </Button>
                    <Button variant="outline-secondary" onClick={handleCancel}>
                      <FaTimes className="me-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm mt-3">
              <Card.Header className="bg-light">
                <h6 className="mb-0">
                  <FaChartLine className="me-2 text-primary" />
                  Quick Stats
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Profile Completion</small>
                    <small>85%</small>
                  </div>
                  <ProgressBar now={85} variant="primary" />
                </div>
                
                <div className="row text-center">
                  <div className="col-6">
                    <div className="bg-light rounded p-2">
                      <FaWeight className="text-primary mb-1" />
                      <div className="small">{userProfile?.weight || '--'} kg</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-light rounded p-2">
                      <FaRuler className="text-success mb-1" />
                      <div className="small">{userProfile?.height || '--'} cm</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <FaUser className="me-2 text-primary" />
                  Profile Information
                </h5>
              </Card.Header>
              <Card.Body>
                {message.text && (
                  <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                    {message.text}
                  </Alert>
                )}

                <Tabs defaultActiveKey="personal" className="mb-3">
                  <Tab eventKey="personal" title="Personal Info">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Display Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Age</Form.Label>
                          <Form.Control
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            min="13"
                            max="100"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Height (cm)</Form.Label>
                          <Form.Control
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            min="100"
                            max="250"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Weight (kg)</Form.Label>
                          <Form.Control
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            min="30"
                            max="300"
                            step="0.1"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  <Tab eventKey="fitness" title="Fitness Goals">
                    <Form.Group className="mb-3">
                      <Form.Label>Primary Fitness Goal</Form.Label>
                      <div className="d-flex flex-wrap gap-2">
                        {fitnessGoals.map(goal => (
                          <Form.Check
                            key={goal.value}
                            type="radio"
                            id={goal.value}
                            name="fitnessGoal"
                            value={goal.value}
                            checked={formData.fitnessGoal === goal.value}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            inline
                            label={
                              <span>
                                {goal.icon} {goal.label}
                              </span>
                            }
                          />
                        ))}
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Activity Level</Form.Label>
                      <Form.Select
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select activity level</option>
                        {activityLevels.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </Form.Select>
                      {formData.activityLevel && (
                        <Form.Text className="text-muted">
                          {activityLevels.find(l => l.value === formData.activityLevel)?.description}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Tab>

                  <Tab eventKey="dietary" title="Dietary Preferences">
                    <Form.Group className="mb-3">
                      <Form.Label>Dietary Restrictions</Form.Label>
                      <div className="d-flex flex-wrap gap-2">
                        {dietaryRestrictions.map(restriction => (
                          <Form.Check
                            key={restriction.value}
                            type="checkbox"
                            id={restriction.value}
                            label={restriction.label}
                            checked={formData.dietaryRestrictions.includes(restriction.value)}
                            onChange={() => handleCheckboxChange(restriction.value)}
                            disabled={!isEditing}
                            inline
                          />
                        ))}
                      </div>
                    </Form.Group>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
}

export default Profile;
