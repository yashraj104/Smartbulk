import React, { useState, useEffect, useRef } from "react";
import {
  Container, Row, Col, Card, Button, Form,
  Badge, Alert, InputGroup, Dropdown,
  Modal, ListGroup, Spinner
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot, FaUser, FaPaperPlane, FaMicrophone, FaStop,
  FaLightbulb, FaDumbbell, FaAppleAlt, FaHeart,
  FaChartLine, FaTrophy, FaQuestionCircle, FaCog,
  FaBrain, FaComments, FaStar
} from "react-icons/fa";

function AIChatCoach() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [coachPersonality, setCoachPersonality] = useState("motivational");
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef(null);

  // AI responses for different categories
  const aiResponses = {
    workout: [
      "For your fitness level, I'd recommend starting with compound movements like squats, deadlifts, and bench press. Start with 3 sets of 8-12 reps.",
      "Based on your goals, let's focus on progressive overload. Try increasing weight by 5-10% each week while maintaining proper form.",
      "For muscle building, aim for 3-4 workouts per week with adequate rest between muscle groups."
    ],
    nutrition: [
      "Your daily protein intake should be around 1.6-2.2g per kg of body weight for muscle building.",
      "Have a protein-rich meal within 30 minutes after your workout to maximize muscle protein synthesis.",
      "Don't forget about carbs! They're your body's preferred energy source during workouts."
    ],
    motivation: [
      "Remember why you started! Every expert was once a beginner. Consistency beats perfection every time.",
      "Progress isn't always linear, but every workout makes you stronger than yesterday. Keep pushing!",
      "You're building more than just muscle - you're building discipline, confidence, and mental strength!"
    ]
  };

  // Quick action suggestions
  const quickActions = [
    { text: "Create a workout plan", icon: FaDumbbell, category: "workout" },
    { text: "Nutrition advice", icon: FaAppleAlt, category: "nutrition" },
    { text: "Motivation boost", icon: FaHeart, category: "motivation" },
    { text: "Form check tips", icon: FaTrophy, category: "workout" }
  ];

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage = {
      id: 1,
      type: "ai",
      content: `Hi there! I'm your AI fitness coach! 🏋️‍♂️

I'm here to help you with:
• Workout planning and form guidance
• Nutrition advice and meal planning
• Motivation and goal setting
• Recovery and injury prevention

What would you like to work on today?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    let category = "motivation";
    if (input.includes("workout") || input.includes("exercise") || input.includes("training")) {
      category = "workout";
    } else if (input.includes("nutrition") || input.includes("diet") || input.includes("food")) {
      category = "nutrition";
    }

    const responses = aiResponses[category];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    if (coachPersonality === "motivational") {
      return randomResponse + " 💪 You've got this!";
    }
    return randomResponse;
  };

  const handleQuickAction = (action) => {
    sendMessage(action.text);
  };

  return (
    <Container fluid className="h-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-100 d-flex flex-column"
      >
        {/* Header */}
        <Row className="mb-3">
          <Col>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <FaRobot className="text-primary me-3" size={32} />
                <div>
                  <h2 className="mb-0">AI Fitness Coach</h2>
                  <small className="text-muted">Your personal fitness companion</small>
                </div>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <FaCog />
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="flex-grow-1">
          <Col lg={8} className="d-flex flex-column">
            {/* Chat Messages */}
            <Card className="flex-grow-1 mb-3">
              <Card.Body className="d-flex flex-column" style={{ height: "60vh" }}>
                <div className="flex-grow-1 overflow-auto mb-3">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: message.type === "user" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`d-flex mb-3 ${message.type === "user" ? "justify-content-end" : "justify-content-start"}`}
                      >
                        <div
                          className={`d-flex align-items-start ${
                            message.type === "user" ? "flex-row-reverse" : "flex-row"
                          }`}
                          style={{ maxWidth: "80%" }}
                        >
                          <div className={`rounded-circle d-flex align-items-center justify-content-center me-2 ${
                            message.type === "user" ? "ms-2" : ""
                          }`} style={{ width: "40px", height: "40px", backgroundColor: message.type === "user" ? "#007bff" : "#6c757d" }}>
                            {message.type === "user" ? <FaUser className="text-white" /> : <FaRobot className="text-white" />}
                          </div>
                          <div
                            className={`p-3 rounded ${
                              message.type === "user"
                                ? "bg-primary text-white"
                                : "bg-light"
                            }`}
                          >
                            <div className="mb-1">
                              <small className="text-muted">
                                {message.timestamp.toLocaleTimeString()}
                              </small>
                            </div>
                            <div style={{ whiteSpace: "pre-line" }}>{message.content}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="d-flex justify-content-start"
                      >
                        <div className="d-flex align-items-start">
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", backgroundColor: "#6c757d" }}>
                            <FaRobot className="text-white" />
                          </div>
                          <div className="p-3 rounded bg-light">
                            <div className="d-flex align-items-center">
                              <Spinner animation="border" size="sm" className="me-2" />
                              <span className="text-muted">AI is typing...</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3"
                  >
                    <small className="text-muted mb-2 d-block">Quick actions:</small>
                    <div className="d-flex flex-wrap gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleQuickAction(action)}
                        >
                          <action.icon className="me-1" />
                          {action.text}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Input Area */}
                <div className="mt-auto">
                  <InputGroup>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Ask your AI coach anything about fitness, nutrition, or motivation..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button
                      variant="primary"
                      onClick={() => sendMessage()}
                      disabled={!inputMessage.trim()}
                    >
                      <FaPaperPlane />
                    </Button>
                  </InputGroup>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-3">
              {/* Coach Profile */}
              <Card>
                <Card.Body className="text-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                       style={{ width: "80px", height: "80px", backgroundColor: "var(--bs-primary)" }}>
                    <FaRobot size={40} className="text-white" />
                  </div>
                  <h5>AI Fitness Coach</h5>
                  <p className="text-muted small">Your personal fitness companion</p>
                  <Badge bg="primary" className="mb-2">
                    AI Coach
                  </Badge>
                </Card.Body>
              </Card>

              {/* Chat Stats */}
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Chat Statistics</h6>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Messages:</span>
                    <Badge bg="primary">{messages.length}</Badge>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Coach Rating:</span>
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="text-warning" />
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </motion.div>

      {/* Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)}>
        <Modal.Header closeButton>
          <Modal.Title>AI Coach Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Coach Personality</Form.Label>
            <Form.Select
              value={coachPersonality}
              onChange={(e) => setCoachPersonality(e.target.value)}
            >
              <option value="motivational">Motivational</option>
              <option value="technical">Technical</option>
              <option value="friendly">Friendly</option>
              <option value="strict">Strict</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AIChatCoach;
