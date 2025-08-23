import React, { useState } from "react";
import {
  Container, Row, Col, Card, Form, Button,
  Alert, InputGroup, FormControl, ProgressBar
} from "react-bootstrap";
import { motion } from "framer-motion";
import { 
  FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, 
  FaWeight, FaRuler, FaBirthdayCake, FaTarget,
  FaGoogle, FaFacebook, FaCheck
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Step 2: Physical Info
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    
    // Step 3: Fitness Goals
    primaryGoal: "",
    fitnessLevel: "",
    preferredWorkoutTime: "",
    dietaryRestrictions: [],
    experience: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  
  const navigate = useNavigate();
  const { signup, signInWithGoogle } = useAuth();

  const goals = [
    { value: "weight_loss", label: "Weight Loss", icon: "🔥" },
    { value: "muscle_gain", label: "Muscle Gain", icon: "💪" },
    { value: "endurance", label: "Endurance", icon: "🏃‍♂️" },
    { value: "strength", label: "Strength", icon: "🏋️‍♂️" },
    { value: "general_fitness", label: "General Fitness", icon: "🌟" }
  ];

  const fitnessLevels = [
    { value: "beginner", label: "Beginner", description: "New to fitness" },
    { value: "intermediate", label: "Intermediate", description: "Some experience" },
    { value: "advanced", label: "Advanced", description: "Experienced athlete" }
  ];

  const activityLevels = [
    { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
    { value: "lightly_active", label: "Lightly Active", description: "Light exercise 1-3 days/week" },
    { value: "moderately_active", label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
    { value: "very_active", label: "Very Active", description: "Hard exercise 6-7 days/week" },
    { value: "extremely_active", label: "Extremely Active", description: "Very hard exercise, physical job" }
  ];

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    if (currentStep === 2) {
      if (!formData.age) newErrors.age = "Age is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.height) newErrors.height = "Height is required";
      if (!formData.weight) newErrors.weight = "Weight is required";
      if (!formData.activityLevel) newErrors.activityLevel = "Activity level is required";
    }
    
    if (currentStep === 3) {
      if (!formData.primaryGoal) newErrors.primaryGoal = "Primary goal is required";
      if (!formData.fitnessLevel) newErrors.fitnessLevel = "Fitness level is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    setRegistrationError('');
    
    try {
      // Prepare user data for Firebase
      const userData = {
        displayName: `${formData.firstName} ${formData.lastName}`,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        fitnessGoal: formData.primaryGoal,
        experienceLevel: formData.fitnessLevel,
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        preferences: {
          preferredWorkoutTime: formData.preferredWorkoutTime,
          dietaryRestrictions: formData.dietaryRestrictions
        }
      };
      
      // Create user with Firebase
      await signup(formData.email, formData.password, userData);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(value)
        ? prev.dietaryRestrictions.filter(item => item !== value)
        : [...prev.dietaryRestrictions, value]
    }));
  };

  const handleSocialLogin = async (provider) => {
    if (provider === 'google') {
      setIsLoading(true);
      setRegistrationError("");
      
      try {
        await signInWithGoogle();
        navigate('/dashboard');
      } catch (error) {
        console.error('Google sign-up error:', error);
        let errorMessage = "Google sign-up failed. Please try again.";
        
        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = "Sign-up popup was closed. Please try again.";
        } else if (error.code === 'auth/popup-blocked') {
          errorMessage = "Pop-up blocked by browser. Please allow pop-ups and try again.";
        } else if (error.code === 'auth/account-exists-with-different-credential') {
          errorMessage = "An account already exists with this email using a different sign-in method.";
        }
        
        setRegistrationError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log(`${provider} sign-up not implemented yet`);
    }
  };

  const renderStep1 = () => (
    <>
      <h4 className="mb-4">Create Your Account</h4>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">First Name</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaUser className="text-muted" />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
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
              <FormControl
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
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
          <FormControl
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaLock className="text-muted" />
              </InputGroup.Text>
              <FormControl
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                isInvalid={!!errors.password}
              />
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Confirm Password</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaLock className="text-muted" />
              </InputGroup.Text>
              <FormControl
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                isInvalid={!!errors.confirmPassword}
              />
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      
      <div className="text-center mb-4">
        <span className="text-muted">Or continue with</span>
      </div>

      <div className="d-flex gap-2 mb-4">
        <Button
          variant="outline-danger"
          className="flex-fill"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
        >
          <FaGoogle className="me-2" />
          Google
        </Button>
        <Button
          variant="outline-primary"
          className="flex-fill"
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading}
        >
          <FaFacebook className="me-2" />
          Facebook
        </Button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h4 className="mb-4">Physical Information</h4>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Age</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaBirthdayCake className="text-muted" />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleInputChange}
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
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Gender</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              isInvalid={!!errors.gender}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.gender}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Height (cm)</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaRuler className="text-muted" />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="height"
                placeholder="Enter height in cm"
                value={formData.height}
                onChange={handleInputChange}
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
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Weight (kg)</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaWeight className="text-muted" />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="weight"
                placeholder="Enter weight in kg"
                value={formData.weight}
                onChange={handleInputChange}
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

      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Activity Level</Form.Label>
        <Form.Select
          name="activityLevel"
          value={formData.activityLevel}
          onChange={handleInputChange}
          isInvalid={!!errors.activityLevel}
        >
          <option value="">Select activity level</option>
          {activityLevels.map(level => (
            <option key={level.value} value={level.value}>
              {level.label} - {level.description}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.activityLevel}
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );

  const renderStep3 = () => (
    <>
      <h4 className="mb-4">Fitness Goals & Preferences</h4>
      
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Primary Fitness Goal</Form.Label>
        <div className="d-flex flex-wrap gap-2">
          {goals.map(goal => (
            <Button
              key={goal.value}
              variant={formData.primaryGoal === goal.value ? "primary" : "outline-primary"}
              className="d-flex align-items-center gap-2"
              onClick={() => setFormData(prev => ({ ...prev, primaryGoal: goal.value }))}
            >
              <span>{goal.icon}</span>
              {goal.label}
            </Button>
          ))}
        </div>
        {errors.primaryGoal && (
          <div className="text-danger mt-2">{errors.primaryGoal}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Fitness Level</Form.Label>
        <div className="d-flex flex-wrap gap-2">
          {fitnessLevels.map(level => (
            <Button
              key={level.value}
              variant={formData.fitnessLevel === level.value ? "primary" : "outline-primary"}
              className="d-flex align-items-center gap-2"
              onClick={() => setFormData(prev => ({ ...prev, fitnessLevel: level.value }))}
            >
              {level.label}
              <small className="text-muted">({level.description})</small>
            </Button>
          ))}
        </div>
        {errors.fitnessLevel && (
          <div className="text-danger mt-2">{errors.fitnessLevel}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Preferred Workout Time</Form.Label>
        <Form.Select
          name="preferredWorkoutTime"
          value={formData.preferredWorkoutTime}
          onChange={handleInputChange}
        >
          <option value="">Select preferred time</option>
          <option value="morning">Morning (6 AM - 9 AM)</option>
          <option value="mid_morning">Mid-Morning (9 AM - 12 PM)</option>
          <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
          <option value="evening">Evening (5 PM - 8 PM)</option>
          <option value="night">Night (8 PM - 11 PM)</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Dietary Restrictions (Optional)</Form.Label>
        <div className="d-flex flex-wrap gap-2">
          {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo"].map(restriction => (
            <Form.Check
              key={restriction}
              type="checkbox"
              id={restriction}
              label={restriction}
              checked={formData.dietaryRestrictions.includes(restriction.toLowerCase().replace('-', '_'))}
              onChange={() => handleCheckboxChange(restriction.toLowerCase().replace('-', '_'))}
              className="me-3"
            />
          ))}
        </div>
      </Form.Group>
    </>
  );

  const getProgressPercentage = () => {
    return (step / 3) * 100;
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">Join SmartBulk</h2>
                  <p className="text-muted">Start your fitness journey today</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Step {step} of 3</span>
                    <span className="text-muted">{Math.round(getProgressPercentage())}%</span>
                  </div>
                  <ProgressBar 
                    now={getProgressPercentage()} 
                    variant="primary" 
                    className="mb-3"
                  />
                  <div className="d-flex justify-content-between">
                    <span className={step >= 1 ? "text-primary fw-semibold" : "text-muted"}>
                      Account
                    </span>
                    <span className={step >= 2 ? "text-primary fw-semibold" : "text-muted"}>
                      Physical Info
                    </span>
                    <span className={step >= 3 ? "text-primary fw-semibold" : "text-muted"}>
                      Goals
                    </span>
                  </div>
                </div>

                {registrationError && (
                  <Alert variant="danger" className="mb-3">
                    {registrationError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}

                  <div className="d-flex justify-content-between mt-4">
                    {step > 1 && (
                      <Button
                        variant="outline-secondary"
                        onClick={handlePrevious}
                        disabled={isLoading}
                      >
                        Previous
                      </Button>
                    )}
                    
                    {step < 3 ? (
                      <Button
                        variant="primary"
                        onClick={handleNext}
                        className="ms-auto"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="success"
                        size="lg"
                        className="ms-auto"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <FaCheck className="me-2" />
                            Complete Registration
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                    Sign in here
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
