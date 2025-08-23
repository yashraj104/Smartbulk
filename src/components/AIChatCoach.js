import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Container, Row, Col, Card, Button, Form,
  Badge, Alert, InputGroup, Dropdown,
  Modal, ListGroup, Spinner, Toast
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot, FaUser, FaPaperPlane, FaMicrophone, FaStop,
  FaLightbulb, FaDumbbell, FaAppleAlt, FaHeart,
  FaChartLine, FaTrophy, FaQuestionCircle, FaCog,
  FaBrain, FaComments, FaStar, FaTrash, FaHistory,
  FaWifi, FaTimes, FaExclamationTriangle
} from "react-icons/fa";
import { useAuth } from '../contexts/AuthContext';
import realtimeService from '../services/RealtimeService';
import toast from 'react-hot-toast';

function AIChatCoach() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [coachPersonality, setCoachPersonality] = useState("motivational");
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false });
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  // AI responses for different categories with enhanced responses
  const aiResponses = {
    workout: [
      "For your fitness level, I'd recommend starting with compound movements like squats, deadlifts, and bench press. Start with 3 sets of 8-12 reps with proper form.",
      "Based on your goals, let's focus on progressive overload. Try increasing weight by 5-10% each week while maintaining proper form and technique.",
      "For muscle building, aim for 3-4 workouts per week with adequate rest between muscle groups. Remember, recovery is just as important as training!",
      "Consider implementing a push-pull-legs split for optimal muscle development and recovery time between sessions."
    ],
    nutrition: [
      "Your daily protein intake should be around 1.6-2.2g per kg of body weight for muscle building. Spread this across 4-6 meals for optimal absorption.",
      "Have a protein-rich meal within 30 minutes after your workout to maximize muscle protein synthesis and kickstart recovery.",
      "Don't forget about carbs! They're your body's preferred energy source during workouts. Aim for 3-5g per kg of body weight on training days.",
      "Stay hydrated! Aim for at least 3-4 liters of water daily, more if you're training intensely or in hot conditions."
    ],
    motivation: [
      "Remember why you started! Every expert was once a beginner. Consistency beats perfection every single time. Keep showing up! 💪",
      "Progress isn't always linear, but every workout makes you stronger than yesterday. You're building more than just muscle - you're building discipline and mental strength!",
      "You're doing amazing! The fact that you're here asking questions shows your commitment. Let's turn that commitment into incredible results!",
      "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep pushing forward! 🚀"
    ],
    recovery: [
      "Recovery is crucial for progress. Aim for 7-9 hours of quality sleep, manage stress levels, and consider deload weeks every 4-6 weeks.",
      "Stretching and mobility work should be part of your routine. Spend 10-15 minutes daily on flexibility to prevent injuries and improve performance.",
      "Listen to your body. If you're feeling run down, it's okay to take an extra rest day. Better to rest than to get injured!",
      "Consider incorporating foam rolling and massage to help with muscle recovery and reduce soreness between workouts."
    ]
  };

  // Quick action suggestions with enhanced options
  const quickActions = [
    { text: "Create a workout plan", icon: FaDumbbell, category: "workout", prompt: "Can you help me create a personalized workout plan for my goals?" },
    { text: "Nutrition advice", icon: FaAppleAlt, category: "nutrition", prompt: "I need help with my nutrition plan and meal timing." },
    { text: "Motivation boost", icon: FaHeart, category: "motivation", prompt: "I'm feeling unmotivated today, can you help me get back on track?" },
    { text: "Form check tips", icon: FaTrophy, category: "workout", prompt: "What are the most important form cues for compound lifts?" },
    { text: "Recovery tips", icon: FaHeart, category: "recovery", prompt: "How can I improve my recovery between workouts?" },
    { text: "Goal setting", icon: FaChartLine, category: "motivation", prompt: "Help me set realistic and achievable fitness goals." }
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
      timestamp: new Date(),
      personality: coachPersonality
    };
    setMessages([welcomeMessage]);

    // Connect to real-time service
    if (currentUser?.uid) {
      realtimeService.connect(currentUser.uid);
      setConnectionStatus(realtimeService.getConnectionStatus());
    }

    // Load conversation history from localStorage
    const savedHistory = localStorage.getItem(`chatHistory_${currentUser?.uid || 'anonymous'}`);
    if (savedHistory) {
      try {
        setConversationHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }

    // Subscribe to real-time updates
    const unsubscribe = realtimeService.subscribe('receive_message', (message) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: message.content,
        timestamp: new Date(message.timestamp),
        sender: message.sender
      }]);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Save conversation history
    if (conversationHistory.length > 0) {
      localStorage.setItem(`chatHistory_${currentUser?.uid || 'anonymous'}`, JSON.stringify(conversationHistory));
    }
  }, [conversationHistory, currentUser?.uid]);

  const sendMessage = useCallback(async (message = inputMessage) => {
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
    setError(null);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          personality: coachPersonality,
          userId: currentUser?.uid,
          context: `User is asking about fitness, nutrition, or motivation. Current personality: ${coachPersonality}`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.reply,
        timestamp: new Date(data.timestamp || Date.now()),
        personality: coachPersonality,
        context: data.context
      };

      setMessages(prev => [...prev, aiMessage]);

      // Add to conversation history
      setConversationHistory(prev => [...prev, {
        user: message,
        ai: data.reply,
        timestamp: new Date().toISOString(),
        personality: coachPersonality
      }]);

      // Send real-time update if connected
      if (connectionStatus.isConnected) {
        realtimeService.sendMessage('ai-coach', message, currentUser?.email || 'Anonymous');
      }

    } catch (error) {
      console.error('AI Chat error:', error);
      setError(error.message);
      
      // Fallback to local responses
      const fallbackResponse = generateAIResponse(message);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date(),
        personality: coachPersonality,
        context: 'fallback'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      toast.error('AI service unavailable, using fallback responses');
      
    } finally {
      setIsTyping(false);
    }
  }, [inputMessage, coachPersonality, currentUser, connectionStatus.isConnected]);

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    let category = "motivation";
    if (input.includes("workout") || input.includes("exercise") || input.includes("training") || input.includes("lift")) {
      category = "workout";
    } else if (input.includes("nutrition") || input.includes("diet") || input.includes("food") || input.includes("protein")) {
      category = "nutrition";
    } else if (input.includes("recovery") || input.includes("rest") || input.includes("sleep") || input.includes("sore")) {
      category = "recovery";
    }

    const responses = aiResponses[category];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    if (coachPersonality === "motivational") {
      return randomResponse + " 💪 You've got this!";
    } else if (coachPersonality === "technical") {
      return randomResponse + " Remember to track your progress and adjust as needed.";
    } else if (coachPersonality === "friendly") {
      return randomResponse + " 😊 Keep up the great work!";
    } else if (coachPersonality === "strict") {
      return randomResponse + " Now get back to work!";
    }
    
    return randomResponse;
  };

  const handleQuickAction = (action) => {
    sendMessage(action.prompt || action.text);
  };

  const clearHistory = () => {
    setConversationHistory([]);
    localStorage.removeItem(`chatHistory_${currentUser?.uid || 'anonymous'}`);
    toast.success('Chat history cleared');
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.type === 'user' ? 'You' : 'AI Coach'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Conversation exported');
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
              <div className="d-flex gap-2">
                {/* Connection Status */}
                <Badge bg={connectionStatus.isConnected ? "success" : "danger"} className="d-flex align-items-center">
                  {connectionStatus.isConnected ? <FaWifi /> : <FaTimes />}
                  <span className="ms-1">{connectionStatus.isConnected ? "Live" : "Offline"}</span>
                </Badge>
                
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                >
                  <FaHistory />
                </Button>
                
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                >
                  <FaCog />
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            <FaExclamationTriangle className="me-2" />
            {error}
          </Alert>
        )}

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
                              {message.context && (
                                <Badge bg="secondary" className="ms-2">
                                  {message.context}
                                </Badge>
                              )}
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
                      disabled={isTyping}
                    />
                    <Button
                      variant="primary"
                      onClick={() => sendMessage()}
                      disabled={!inputMessage.trim() || isTyping}
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
                    {coachPersonality.charAt(0).toUpperCase() + coachPersonality.slice(1)} Coach
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
                  <div className="d-flex justify-content-between mb-2">
                    <span>Conversation History:</span>
                    <Badge bg="info">{conversationHistory.length}</Badge>
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

              {/* Actions */}
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Actions</h6>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" size="sm" onClick={exportConversation}>
                      <FaComments className="me-1" />
                      Export Chat
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={clearHistory}>
                      <FaTrash className="me-1" />
                      Clear History
                    </Button>
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
            <Form.Text className="text-muted">
              Choose how your AI coach communicates with you
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* History Modal */}
      <Modal show={showHistory} onHide={() => setShowHistory(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Conversation History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {conversationHistory.length === 0 ? (
            <p className="text-muted text-center">No conversation history yet</p>
          ) : (
            <ListGroup>
              {conversationHistory.slice(-10).reverse().map((conversation, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <small className="text-muted">
                      {new Date(conversation.timestamp).toLocaleString()}
                    </small>
                    <Badge bg="secondary">{conversation.personality}</Badge>
                  </div>
                  <div className="mb-2">
                    <strong>You:</strong> {conversation.user}
                  </div>
                  <div>
                    <strong>AI Coach:</strong> {conversation.ai}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={clearHistory}>
            Clear History
          </Button>
          <Button variant="secondary" onClick={() => setShowHistory(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AIChatCoach;
