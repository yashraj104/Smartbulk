import React, { useState, useEffect, useCallback } from "react";
import {
  Container, Row, Col, Card, Button, Badge, 
  ProgressBar, Modal, Form, Alert, Tabs, Tab,
  ListGroup, Table
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaTrophy, FaMedal, FaFire, FaCrown, FaStar,
  FaCalendar, FaClock, FaUsers, FaPlay, FaPause,
  FaCheck, FaPlus, FaChartLine, FaTarget,
  FaDumbbell, FaAppleAlt, FaRunning, FaWifi, FaTimes
} from "react-icons/fa";
import { useAuth } from '../contexts/AuthContext';
import realtimeService from '../services/RealtimeService';
import toast from 'react-hot-toast';

function Challenges() {
  const [activeTab, setActiveTab] = useState('active');
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [availableChallenges, setAvailableChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser: authUser } = useAuth();
  const [currentUser] = useState({
    id: authUser?.uid || 1,
    username: authUser?.displayName || "FitnessFanatic",
    avatar: "https://via.placeholder.com/50/4CAF50/FFFFFF?text=FF"
  });

  const challengeTypes = {
    'fitness': { icon: FaDumbbell, color: 'primary' },
    'nutrition': { icon: FaAppleAlt, color: 'success' },
    'endurance': { icon: FaRunning, color: 'info' },
    'strength': { icon: FaTrophy, color: 'warning' }
  };

  const difficultyColors = {
    'easy': 'success',
    'medium': 'warning',
    'hard': 'danger'
  };

  useEffect(() => {
    // Connect to real-time service
    if (authUser?.uid) {
      realtimeService.connect(authUser.uid);
      setConnectionStatus(realtimeService.getConnectionStatus());
    }

    // Subscribe to real-time updates
    const unsubscribeNewChallenge = realtimeService.subscribe('new_challenge', (newChallenge) => {
      setAvailableChallenges(prev => [newChallenge, ...prev]);
    });

    const unsubscribeChallengeJoined = realtimeService.subscribe('challenge_joined', (data) => {
      setAvailableChallenges(prev => prev.filter(c => c.id !== data.challengeId));
      // Add to active challenges if it's the current user
      if (data.participant.userId === currentUser.id) {
        setActiveChallenges(prev => [...prev, { ...data.participant, challengeId: data.challengeId }]);
      }
    });

    const unsubscribeChallengeUpdated = realtimeService.subscribe('challenge_updated', (data) => {
      setActiveChallenges(prev => prev.map(challenge => 
        challenge.challengeId === data.challengeId 
          ? { ...challenge, progress: data.progress }
          : challenge
      ));
    });

    return () => {
      unsubscribeNewChallenge();
      unsubscribeChallengeJoined();
      unsubscribeChallengeUpdated();
    };
  }, [authUser?.uid, currentUser.id]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      loadSampleData();
    } catch (error) {
      console.error('Error loading challenges:', error);
      setError('Failed to load challenges data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSampleData = () => {
    const sampleAvailableChallenges = [
      {
        id: 1,
        name: "30-Day Push-Up Challenge",
        description: "Build upper body strength with daily push-ups. Start with 10 and work your way up to 100!",
        type: 'fitness',
        difficulty: 'medium',
        duration: 30,
        target: 30,
        unit: 'days',
        participants: 1247,
        reward: 500,
        startDate: '2024-02-01',
        endDate: '2024-03-01',
        rules: [
          "Complete the daily push-up target",
          "Log your progress every day",
          "No more than 2 rest days allowed"
        ],
        dailyTargets: Array.from({length: 30}, (_, i) => Math.floor(10 + (i * 3)))
      },
      {
        id: 2,
        name: "February Step Challenge",
        description: "Walk 10,000 steps every day for the entire month. Stay active and build healthy habits!",
        type: 'endurance',
        difficulty: 'easy',
        duration: 28,
        target: 280000,
        unit: 'steps',
        participants: 2156,
        reward: 300,
        startDate: '2024-02-01',
        endDate: '2024-02-28',
        rules: [
          "Achieve 10,000 steps daily",
          "Use a fitness tracker or app",
          "Log steps within 24 hours"
        ],
        dailyTargets: Array(28).fill(10000)
      },
      {
        id: 3,
        name: "Protein Power Week",
        description: "Hit your daily protein target for 7 consecutive days. Build muscle and recover better!",
        type: 'nutrition',
        difficulty: 'medium',
        duration: 7,
        target: 7,
        unit: 'days',
        participants: 876,
        reward: 200,
        startDate: '2024-02-15',
        endDate: '2024-02-21',
        rules: [
          "Meet daily protein goal (1.6g per kg body weight)",
          "Track all meals and snacks",
          "No protein supplements allowed"
        ],
        dailyTargets: Array(7).fill(120) // grams of protein
      },
      {
        id: 4,
        name: "Beast Mode Strength",
        description: "Increase your total lift (bench + squat + deadlift) by 50kg in 8 weeks. For serious lifters only!",
        type: 'strength',
        difficulty: 'hard',
        duration: 56,
        target: 50,
        unit: 'kg increase',
        participants: 423,
        reward: 1000,
        startDate: '2024-02-01',
        endDate: '2024-03-28',
        rules: [
          "Track all major lifts weekly",
          "Follow progressive overload principles",
          "Complete at least 4 strength sessions per week"
        ],
        weeklyTargets: Array(8).fill(6.25) // kg per week
      }
    ];

    const sampleActiveChallenges = [
      {
        ...sampleAvailableChallenges[0],
        progress: 15,
        currentStreak: 15,
        bestStreak: 15,
        joinedDate: '2024-01-15',
        lastUpdate: '2024-01-30'
      },
      {
        ...sampleAvailableChallenges[1],
        progress: 125000,
        currentStreak: 12,
        bestStreak: 12,
        joinedDate: '2024-01-18',
        lastUpdate: '2024-01-30'
      }
    ];

    const sampleCompletedChallenges = [
      {
        id: 5,
        name: "New Year Detox",
        description: "7-day sugar-free challenge",
        type: 'nutrition',
        difficulty: 'medium',
        duration: 7,
        completedDate: '2024-01-08',
        finalScore: 100,
        rank: 23,
        totalParticipants: 1834,
        reward: 150
      }
    ];

    const sampleLeaderboard = [
      { id: 2, username: "IronMike92", score: 2847, avatar: "https://via.placeholder.com/40/2196F3/FFFFFF?text=IM" },
      { id: 3, username: "FitSarah", score: 2634, avatar: "https://via.placeholder.com/40/E91E63/FFFFFF?text=FS" },
      { id: 1, username: "FitnessFanatic", score: 2156, avatar: "https://via.placeholder.com/40/4CAF50/FFFFFF?text=FF" },
      { id: 4, username: "GymWarrior", score: 1987, avatar: "https://via.placeholder.com/40/FF9800/FFFFFF?text=GW" },
      { id: 5, username: "CardioQueen", score: 1823, avatar: "https://via.placeholder.com/40/9C27B0/FFFFFF?text=CQ" }
    ];

    setAvailableChallenges(sampleAvailableChallenges);
    setActiveChallenges(sampleActiveChallenges);
    setCompletedChallenges(sampleCompletedChallenges);
    setLeaderboard(sampleLeaderboard);
  };

  const joinChallenge = async (challenge) => {
    try {
      const response = await fetch(`/api/challenges/${challenge.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUser.id, 
          username: currentUser.username 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to join challenge');
      }

      const participant = await response.json();
      
      const newActiveChallenge = {
        ...challenge,
        ...participant,
        progress: 0,
        currentStreak: 0,
        bestStreak: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        lastUpdate: new Date().toISOString().split('T')[0]
      };
      
      setActiveChallenges(prev => [...prev, newActiveChallenge]);
      setAvailableChallenges(prev => prev.filter(c => c.id !== challenge.id));
      
      // Send real-time update
      if (connectionStatus.isConnected) {
        realtimeService.updateChallengeProgress(challenge.id, currentUser.id, 0);
      }
      
      toast.success(`Joined ${challenge.name}!`);
      setShowJoinModal(false);
      
    } catch (error) {
      console.error('Error joining challenge:', error);
      toast.error('Failed to join challenge. Please try again.');
    }
  };

  const getProgressPercentage = (challenge) => {
    if (challenge.type === 'endurance' && challenge.unit === 'steps') {
      return Math.min((challenge.progress / challenge.target) * 100, 100);
    }
    return Math.min((challenge.progress / challenge.target) * 100, 100);
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="text-warning" />;
    if (rank === 2) return <FaMedal className="text-secondary" />;
    if (rank === 3) return <FaMedal className="text-warning" />;
    return <FaStar className="text-muted" />;
  };

  const renderActiveChallenges = () => (
    <>
      {activeChallenges.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <FaTrophy size={48} className="text-muted mb-3" />
            <h5 className="text-muted">No active challenges</h5>
            <p className="text-muted mb-4">Join a challenge to start your fitness journey</p>
            <Button variant="primary" onClick={() => setActiveTab('browse')}>
              Browse Challenges
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {activeChallenges.map((challenge) => (
            <Col key={challenge.id} lg={6} className="mb-4">
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="mb-1">{challenge.name}</h5>
                        <div className="d-flex gap-2 mb-2">
                          <Badge bg={challengeTypes[challenge.type].color}>
                            {React.createElement(challengeTypes[challenge.type].icon, { className: "me-1" })}
                            {challenge.type}
                          </Badge>
                          <Badge bg={difficultyColors[challenge.difficulty]}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Badge bg="info">
                        {getDaysRemaining(challenge.endDate)} days left
                      </Badge>
                    </div>
                    
                    <p className="text-muted small mb-3">{challenge.description}</p>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small">Progress</span>
                        <span className="small">
                          {challenge.progress} / {challenge.target} {challenge.unit}
                        </span>
                      </div>
                      <ProgressBar 
                        now={getProgressPercentage(challenge)} 
                        variant="success"
                      />
                    </div>
                    
                    <Row className="text-center mb-3">
                      <Col>
                        <div className="h5 mb-0 text-primary">{challenge.currentStreak}</div>
                        <small className="text-muted">Current Streak</small>
                      </Col>
                      <Col>
                        <div className="h5 mb-0 text-success">{challenge.bestStreak}</div>
                        <small className="text-muted">Best Streak</small>
                      </Col>
                      <Col>
                        <div className="h5 mb-0 text-warning">{challenge.reward}</div>
                        <small className="text-muted">Points</small>
                      </Col>
                    </Row>
                    
                    <div className="d-grid">
                      <Button variant="outline-primary">
                        <FaChartLine className="me-2" />
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}
    </>
  );

  const renderAvailableChallenges = () => (
    <Row>
      {availableChallenges.map((challenge) => (
        <Col key={challenge.id} lg={4} className="mb-4">
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-1">{challenge.name}</h6>
                    <div className="d-flex gap-2 mb-2">
                      <Badge bg={challengeTypes[challenge.type].color}>
                        {React.createElement(challengeTypes[challenge.type].icon, { className: "me-1" })}
                        {challenge.type}
                      </Badge>
                      <Badge bg={difficultyColors[challenge.difficulty]}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Badge bg="secondary">
                    <FaUsers className="me-1" />
                    {challenge.participants}
                  </Badge>
                </div>
                
                <p className="text-muted small mb-3 flex-grow-1">{challenge.description}</p>
                
                <div className="mb-3">
                  <Row className="text-center small">
                    <Col>
                      <FaCalendar className="text-muted mb-1" />
                      <div>{challenge.duration} days</div>
                    </Col>
                    <Col>
                      <FaTrophy className="text-warning mb-1" />
                      <div>{challenge.reward} pts</div>
                    </Col>
                    <Col>
                      <FaClock className="text-info mb-1" />
                      <div>{getDaysRemaining(challenge.endDate)}d left</div>
                    </Col>
                  </Row>
                </div>
                
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setSelectedChallenge(challenge);
                    setShowJoinModal(true);
                  }}
                >
                  <FaPlay className="me-2" />
                  Join Challenge
                </Button>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  );

  const renderCompletedChallenges = () => (
    <>
      {completedChallenges.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <FaMedal size={48} className="text-muted mb-3" />
            <h5 className="text-muted">No completed challenges yet</h5>
            <p className="text-muted">Complete your first challenge to see your achievements here</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {completedChallenges.map((challenge) => (
            <Col key={challenge.id} lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="mb-1">{challenge.name}</h6>
                      <small className="text-muted">
                        Completed on {new Date(challenge.completedDate).toLocaleDateString()}
                      </small>
                    </div>
                    <Badge bg="success">
                      <FaCheck className="me-1" />
                      Completed
                    </Badge>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-center">
                      <div className="h5 mb-0 text-primary">{challenge.finalScore}%</div>
                      <small className="text-muted">Final Score</small>
                    </div>
                    <div className="text-center">
                      <div className="h5 mb-0 text-warning">#{challenge.rank}</div>
                      <small className="text-muted">Rank</small>
                    </div>
                    <div className="text-center">
                      <div className="h5 mb-0 text-success">{challenge.reward}</div>
                      <small className="text-muted">Points Earned</small>
                    </div>
                  </div>
                  
                  <p className="text-muted small mb-0">
                    Ranked {challenge.rank} out of {challenge.totalParticipants} participants
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );

  const renderLeaderboard = () => (
    <Card className="border-0 shadow-sm">
      <Card.Header>
        <h5 className="mb-0">
          <FaTrophy className="me-2 text-warning" />
          Global Leaderboard
        </h5>
      </Card.Header>
      <Card.Body>
        <Table hover className="mb-0">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Total Points</th>
              <th>Badge</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user.id} className={user.id === currentUser.id ? 'table-primary' : ''}>
                <td>
                  <div className="d-flex align-items-center">
                    {getRankIcon(index + 1)}
                    <span className="ms-2">#{index + 1}</span>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <img 
                      src={user.avatar} 
                      alt={user.username} 
                      className="rounded-circle me-2" 
                      width="32" 
                      height="32" 
                    />
                    <span className="fw-semibold">{user.username}</span>
                    {user.id === currentUser.id && (
                      <Badge bg="primary" className="ms-2">You</Badge>
                    )}
                  </div>
                </td>
                <td>
                  <span className="fw-bold text-warning">{user.score.toLocaleString()}</span>
                </td>
                <td>
                  {index === 0 && <Badge bg="warning">Champion</Badge>}
                  {index === 1 && <Badge bg="secondary">Runner-up</Badge>}
                  {index === 2 && <Badge bg="info">Third Place</Badge>}
                  {index > 2 && <Badge bg="light" text="dark">Competitor</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="display-4 mb-3">
                <FaTrophy className="me-3 text-warning" />
                Fitness Challenges
              </h1>
              <p className="lead text-muted mb-2">
                Push your limits, compete with others, and achieve your fitness goals
              </p>
                             <Badge bg={connectionStatus.isConnected ? "success" : "danger"} className="d-flex align-items-center justify-content-center mx-auto" style={{ width: 'fit-content' }}>
                 {connectionStatus.isConnected ? <FaWifi /> : <FaTimes />}
                 <span className="ms-1">{connectionStatus.isConnected ? "Live Updates" : "Offline Mode"}</span>
               </Badge>
            </div>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Alert variant="warning" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <FaPlay className="text-primary mb-2" size={24} />
                <h4 className="mb-1">{activeChallenges.length}</h4>
                <small className="text-muted">Active</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <FaCheck className="text-success mb-2" size={24} />
                <h4 className="mb-1">{completedChallenges.length}</h4>
                <small className="text-muted">Completed</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <FaFire className="text-warning mb-2" size={24} />
                <h4 className="mb-1">{leaderboard.find(u => u.id === currentUser.id)?.score || 0}</h4>
                <small className="text-muted">Total Points</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <FaCrown className="text-warning mb-2" size={24} />
                <h4 className="mb-1">#{leaderboard.findIndex(u => u.id === currentUser.id) + 1}</h4>
                <small className="text-muted">Global Rank</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={setActiveTab}
          className="mb-4"
        >
          <Tab eventKey="active" title="My Challenges">
            {renderActiveChallenges()}
          </Tab>
          <Tab eventKey="browse" title="Browse Challenges">
            {renderAvailableChallenges()}
          </Tab>
          <Tab eventKey="completed" title="Completed">
            {renderCompletedChallenges()}
          </Tab>
          <Tab eventKey="leaderboard" title="Leaderboard">
            {renderLeaderboard()}
          </Tab>
        </Tabs>
      </motion.div>

      {/* Join Challenge Modal */}
      <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)} size="lg">
        {selectedChallenge && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Join Challenge: {selectedChallenge.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <div className="d-flex gap-2 mb-3">
                  <Badge bg={challengeTypes[selectedChallenge.type].color}>
                    {React.createElement(challengeTypes[selectedChallenge.type].icon, { className: "me-1" })}
                    {selectedChallenge.type}
                  </Badge>
                  <Badge bg={difficultyColors[selectedChallenge.difficulty]}>
                    {selectedChallenge.difficulty}
                  </Badge>
                </div>
                <p className="mb-3">{selectedChallenge.description}</p>
                
                <Row className="mb-3">
                  <Col md={4} className="text-center">
                    <div className="border rounded p-3">
                      <FaCalendar className="text-primary mb-2" size={20} />
                      <div className="fw-bold">{selectedChallenge.duration} days</div>
                      <small className="text-muted">Duration</small>
                    </div>
                  </Col>
                  <Col md={4} className="text-center">
                    <div className="border rounded p-3">
                      <FaTrophy className="text-warning mb-2" size={20} />
                      <div className="fw-bold">{selectedChallenge.reward} points</div>
                      <small className="text-muted">Reward</small>
                    </div>
                  </Col>
                  <Col md={4} className="text-center">
                    <div className="border rounded p-3">
                      <FaUsers className="text-info mb-2" size={20} />
                      <div className="fw-bold">{selectedChallenge.participants}</div>
                      <small className="text-muted">Participants</small>
                    </div>
                  </Col>
                </Row>
                
                <h6>Challenge Rules:</h6>
                <ul className="mb-3">
                  {selectedChallenge.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
                
                <Alert variant="info">
                  <strong>Ready to start?</strong> Once you join, you'll need to log your progress daily to stay on track!
                </Alert>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowJoinModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => joinChallenge(selectedChallenge)}>
                <FaPlay className="me-2" />
                Join Challenge
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
}

export default Challenges;
