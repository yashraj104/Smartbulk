import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Button, Form, Alert,
  InputGroup, Badge, ProgressBar, Modal
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaUser, FaEnvelope, FaBirthdayCake, FaRuler, FaWeight,
  FaTarget, FaDumbbell, FaHeart, FaEdit, FaSave, FaTimes,
  FaCamera, FaTrash, FaCheck
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { currentUser, userProfile, updateUserProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (userProfile) {
      setFormData({
        firstName: userProfile.displayName?.split(' ')[0] || '',
        lastName: userProfile.displayName?.split(' ')[1] || '',
        email: currentUser.email,
        age: userProfile.age || '',
        height: userProfile.height || '',
        weight: userProfile.weight || '',
        primaryGoal: userProfile.fitnessGoal || '',
        fitnessLevel: userProfile.experienceLevel || '',
        preferredWorkoutTime: userProfile.preferences?.preferredWorkoutTime || '',
        dietaryRestrictions: userProfile.preferences?.dietaryRestrictions || [],
        activityLevel: userProfile.activityLevel || '',
        gender: userProfile.gender || ''
      });
    }
  }, [currentUser, userProfile, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.height) newErrors.height = "Height is required";
    if (!formData.weight) newErrors.weight = "Weight is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Prepare updated data for Firebase
      const updatedData = {
        displayName: `${formData.firstName} ${formData.lastName}`,
        age: formData.age ? parseInt(formData.age) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        fitnessGoal: formData.primaryGoal,
        experienceLevel: formData.fitnessLevel,
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        preferences: {
          preferredWorkoutTime: formData.preferredWorkoutTime,
          dietaryRestrictions: formData.dietaryRestrictions
        }
      };
      
      await updateUserProfile(updatedData);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({ general: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.displayName?.split(' ')[0] || '',
        lastName: userProfile.displayName?.split(' ')[1] || '',
        email: currentUser.email,
        age: userProfile.age || '',
        height: userProfile.height || '',
        weight: userProfile.weight || '',
        primaryGoal: userProfile.fitnessGoal || '',
        fitnessLevel: userProfile.experienceLevel || '',
        preferredWorkoutTime: userProfile.preferences?.preferredWorkoutTime || '',
        dietaryRestrictions: userProfile.preferences?.dietaryRestrictions || [],
        activityLevel: userProfile.activityLevel || '',
        gender: userProfile.gender || ''
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Note: Firebase Auth account deletion requires recent authentication
      // For now, we'll just log out the user
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Account deletion error:', error);
      setErrors({ general: "Failed to delete account. Please try again." });
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const getGoalIcon = (goal) => {
    const goalIcons = {
      weight_loss: "🔥",
      muscle_gain: "💪",
      endurance: "🏃‍♂️",
      strength: "🏋️‍♂️",
      general_fitness: "🌟"
    };
    return goalIcons[goal] || "🎯";
  };

  const getFitnessLevelColor = (level) => {
    const colors = {
      beginner: "info",
      intermediate: "warning",
      advanced: "success"
    };
    return colors[level] || "secondary";
  };

  if (!currentUser || !userProfile) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">Loading profile...</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
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
                <h1 className="h2 mb-1">Profile</h1>
                <p className="text-muted mb-0">Manage your account and preferences</p>
              </div>
              <div className="d-flex gap-2">
                {!isEditing ? (
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    <FaEdit className="me-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="success" onClick={handleSave} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline-secondary" onClick={handleCancel}>
                      <FaTimes className="me-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {successMessage && (
          <Alert variant="success" className="mb-4">
            <FaCheck className="me-2" />
            {successMessage}
          </Alert>
        )}

        {errors.general && (
          <Alert variant="danger" className="mb-4">
            {errors.general}
          </Alert>
        )}

        <Row>
          {/* Profile Picture and Basic Info */}
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="position-relative mb-3">
                  <div 
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <FaUser size={48} className="text-white" />
                  </div>
                  {isEditing && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="position-absolute bottom-0 end-0 rounded-circle"
                      style={{ width: '36px', height: '36px' }}
                    >
                      <FaCamera size={14} />
                    </Button>
                  )}
                </div>
                
                <h4 className="mb-1">{userProfile.displayName || currentUser.email}</h4>
                <p className="text-muted mb-2">{currentUser.email}</p>
                
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <Badge bg={getFitnessLevelColor(userProfile.experienceLevel)}>
                    {userProfile.experienceLevel?.charAt(0).toUpperCase() + userProfile.experienceLevel?.slice(1)}
                  </Badge>
                  <Badge bg="primary">
                    {getGoalIcon(userProfile.fitnessGoal)} {userProfile.fitnessGoal?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>

                <div className="text-start">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Member since:</span>
                    <span className="fw-semibold">
                      {new Date(userProfile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Activity Level:</span>
                    <span className="fw-semibold">
                      {userProfile.activityLevel?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Profile Details */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent">
                <h5 className="mb-0">Personal Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">First Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaUser className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          isInvalid={!!errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Last Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaUser className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          isInvalid={!!errors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaEnvelope className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Age</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaBirthdayCake className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="age"
                          value={formData.age || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          isInvalid={!!errors.age}
                          min="13"
                          max="100"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.age}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Height (cm)</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaRuler className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="height"
                          value={formData.height || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          isInvalid={!!errors.height}
                          min="100"
                          max="250"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.height}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Weight (kg)</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaWeight className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="weight"
                          value={formData.weight || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          isInvalid={!!errors.weight}
                          min="30"
                          max="300"
                          step="0.1"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.weight}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Fitness Goals & Preferences */}
            <Card className="border-0 shadow-sm mt-4">
              <Card.Header className="bg-transparent">
                <h5 className="mb-0">Fitness Goals & Preferences</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Primary Goal</Form.Label>
                      <Form.Select
                        name="primaryGoal"
                        value={formData.primaryGoal || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      >
                        <option value="weight_loss">🔥 Weight Loss</option>
                        <option value="muscle_gain">💪 Muscle Gain</option>
                        <option value="endurance">🏃‍♂️ Endurance</option>
                        <option value="strength">🏋️‍♂️ Strength</option>
                        <option value="general_fitness">🌟 General Fitness</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Fitness Level</Form.Label>
                      <Form.Select
                        name="fitnessLevel"
                        value={formData.fitnessLevel || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Preferred Workout Time</Form.Label>
                  <Form.Select
                    name="preferredWorkoutTime"
                    value={formData.preferredWorkoutTime || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (6 AM - 9 AM)</option>
                    <option value="mid_morning">Mid-Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="night">Night (8 PM - 11 PM)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Dietary Restrictions</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo"].map(restriction => (
                      <Form.Check
                        key={restriction}
                        type="checkbox"
                        id={restriction}
                        label={restriction}
                        checked={formData.dietaryRestrictions?.includes(restriction.toLowerCase().replace('-', '_')) || false}
                        onChange={() => {
                          if (isEditing) {
                            const restrictionKey = restriction.toLowerCase().replace('-', '_');
                            setFormData(prev => ({
                              ...prev,
                              dietaryRestrictions: prev.dietaryRestrictions?.includes(restrictionKey)
                                ? prev.dietaryRestrictions.filter(item => item !== restrictionKey)
                                : [...(prev.dietaryRestrictions || []), restrictionKey]
                            }));
                          }
                        }}
                        disabled={!isEditing}
                        className="me-3"
                      />
                    ))}
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Account Actions */}
            <Card className="border-0 shadow-sm mt-4">
              <Card.Header className="bg-transparent">
                <h5 className="mb-0 text-danger">Danger Zone</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-3">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button 
                  variant="outline-danger" 
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isLoading}
                >
                  <FaTrash className="me-2" />
                  Delete Account
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <p className="text-muted">
            All your data, including workout history, progress tracking, and preferences will be permanently removed.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Profile;
