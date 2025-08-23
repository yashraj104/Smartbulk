import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Alert, Badge,
  Modal, ListGroup, ListGroupItem, InputGroup, FormControl,
  Tabs, Tab, ButtonGroup, Dropdown, Pagination, Spinner
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaClock, FaDollarSign,
  FaUserTie, FaGraduationCap, FaCertificate, FaPhone, FaEnvelope,
  FaCalendar, FaPlus, FaEdit, FaTrash, FaHeart, FaShare, FaCheck,
  FaTimes, FaDumbbell, FaRunning, FaYoga, FaSwimming, FaBiking
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function TrainerMarketplace() {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHireModal, setShowHireModal] = useState(false);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [trainersPerPage] = useState(6);

  // Filter states
  const [filters, setFilters] = useState({
    specialization: '',
    location: '',
    priceRange: '',
    rating: '',
    availability: ''
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Sample trainers data
  const sampleTrainers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialization: 'Strength Training',
      location: 'New York, NY',
      rating: 4.9,
      hourlyRate: 75,
      experience: '8 years',
      certifications: ['NASM', 'ACE', 'CrossFit L2'],
      availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      bio: 'Certified personal trainer specializing in strength training and muscle building.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
      specialties: ['Weight Loss', 'Muscle Building', 'Functional Training'],
      languages: ['English', 'Spanish'],
      education: 'BS in Exercise Science, University of Texas'
    },
    {
      id: 2,
      name: 'Mike Chen',
      specialization: 'Cardio & HIIT',
      location: 'Los Angeles, CA',
      rating: 4.8,
      hourlyRate: 65,
      experience: '6 years',
      certifications: ['ACE', 'TRX', 'Precision Nutrition'],
      availability: ['Tuesday', 'Thursday', 'Sunday'],
      bio: 'HIIT specialist helping clients burn fat and improve cardiovascular health.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      specialties: ['Fat Loss', 'Endurance', 'Sports Performance'],
      languages: ['English', 'Mandarin'],
      education: 'MS in Kinesiology, UCLA'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setTrainers(sampleTrainers);
      setFilteredTrainers(sampleTrainers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleHireTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    setShowHireModal(true);
  };

  const handleViewTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    setShowTrainerModal(true);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3">Loading trainers...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="display-5 mb-3">Find Your Perfect Trainer</h1>
              <p className="lead text-muted">
                Connect with certified fitness professionals who can help you achieve your goals
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          {trainers.map(trainer => (
            <Col key={trainer.id} lg={4} md={6} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <h5 className="card-title">{trainer.name}</h5>
                  <p className="text-muted">{trainer.specialization}</p>
                  <p className="text-muted">
                    <FaMapMarkerAlt className="me-1" />
                    {trainer.location}
                  </p>
                  <div className="d-flex align-items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < Math.floor(trainer.rating) ? "text-warning" : "text-muted"} 
                      />
                    ))}
                    <span className="ms-2">({trainer.rating})</span>
                  </div>
                  <p className="text-muted">${trainer.hourlyRate}/hour</p>
                  
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="flex-fill"
                      onClick={() => handleViewTrainer(trainer)}
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="flex-fill"
                      onClick={() => handleHireTrainer(trainer)}
                    >
                      Hire Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </motion.div>

      <Modal show={showHireModal} onHide={() => setShowHireModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hire {selectedTrainer?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Hire form will go here</p>
        </Modal.Body>
      </Modal>

      <Modal show={showTrainerModal} onHide={() => setShowTrainerModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Trainer Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTrainer && (
            <div>
              <h3>{selectedTrainer.name}</h3>
              <p>{selectedTrainer.bio}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default TrainerMarketplace;
