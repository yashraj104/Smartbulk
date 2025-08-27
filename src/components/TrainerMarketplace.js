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
import FirestoreService from '../services/FirestoreService';
import toast from 'react-hot-toast';

function TrainerMarketplace() {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHireModal, setShowHireModal] = useState(false);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [trainersPerPage] = useState(6);
  const [registering, setRegistering] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    specialization: '',
    location: '',
    priceRange: '',
    rating: ''
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Trainer registration form state
  const [trainerForm, setTrainerForm] = useState({
    name: '',
    specialization: '',
    location: '',
    hourlyRate: '',
    experience: '',
    certifications: [],
    bio: '',
    image: '',
    specialties: [],
    languages: [],
    education: '',
    availability: []
  });

  // Load trainers from Firebase
  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const result = await FirestoreService.getTrainers({ status: 'approved' });
      
      if (result.success) {
        setTrainers(result.data);
        setFilteredTrainers(result.data);
      } else {
        // Create sample trainers if none exist
        await createSampleTrainers();
        // Retry loading
        const retryResult = await FirestoreService.getTrainers({ status: 'approved' });
        if (retryResult.success) {
          setTrainers(retryResult.data);
          setFilteredTrainers(retryResult.data);
        }
      }
    } catch (error) {
      console.error('Error loading trainers:', error);
      toast.error('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  const createSampleTrainers = async () => {
    const sampleTrainers = [
      {
        name: 'Sarah Johnson',
        specialization: 'Strength Training',
        location: 'New York, NY',
        hourlyRate: 75,
        experience: '8 years',
        certifications: ['NASM', 'ACE', 'CrossFit L2'],
        bio: 'Certified personal trainer specializing in strength training and muscle building.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
        specialties: ['Weight Loss', 'Muscle Building', 'Functional Training'],
        languages: ['English', 'Spanish'],
        education: 'BS in Exercise Science, University of Texas',
        availability: ['Monday', 'Wednesday', 'Friday', 'Saturday']
      },
      {
        name: 'Mike Chen',
        specialization: 'Cardio & HIIT',
        location: 'Los Angeles, CA',
        hourlyRate: 65,
        experience: '6 years',
        certifications: ['ACE', 'TRX', 'Precision Nutrition'],
        bio: 'HIIT specialist helping clients burn fat and improve cardiovascular health.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        specialties: ['Fat Loss', 'Endurance', 'Sports Performance'],
        languages: ['English', 'Mandarin'],
        education: 'MS in Kinesiology, UCLA',
        availability: ['Tuesday', 'Thursday', 'Sunday']
      },
      {
        name: 'Jessica Williams',
        specialization: 'Yoga & Flexibility',
        location: 'Austin, TX',
        hourlyRate: 55,
        experience: '5 years',
        certifications: ['RYT-200', 'NASM-CPT'],
        bio: 'Yoga instructor and flexibility specialist helping clients improve mobility and mindfulness.',
        image: 'https://images.unsplash.com/photo-1594824919298-966c3c24a1a0?w=150&h=150&fit=crop&crop=face',
        specialties: ['Yoga', 'Flexibility', 'Stress Relief', 'Mindfulness'],
        languages: ['English'],
        education: 'Certified Yoga Instructor',
        availability: ['Monday', 'Tuesday', 'Thursday', 'Friday']
      }
    ];

    for (const trainer of sampleTrainers) {
      try {
        const result = await FirestoreService.registerTrainer('sample-user', trainer);
        if (result.success) {
          // Update status to approved for sample trainers
          await FirestoreService.updateTrainer(result.id, { 
            status: 'approved', 
            rating: 4.5 + Math.random() * 0.5,
            totalReviews: Math.floor(Math.random() * 50) + 10,
            totalSessions: Math.floor(Math.random() * 100) + 20,
            isVerified: true
          });
        }
      } catch (error) {
        console.error('Error creating sample trainer:', error);
      }
    }
  };

  const handleHireTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    setShowHireModal(true);
  };

  const handleViewTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    setShowTrainerModal(true);
  };

  const handleRegisterTrainer = async () => {
    if (!currentUser?.uid) {
      toast.error('Please log in to register as a trainer');
      return;
    }

    if (!trainerForm.name || !trainerForm.specialization || !trainerForm.bio) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setRegistering(true);
      const result = await FirestoreService.registerTrainer(currentUser.uid, {
        ...trainerForm,
        hourlyRate: parseFloat(trainerForm.hourlyRate) || 50,
        certifications: trainerForm.certifications.split(',').map(cert => cert.trim()).filter(cert => cert),
        specialties: trainerForm.specialties.split(',').map(spec => spec.trim()).filter(spec => spec),
        languages: trainerForm.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
        availability: trainerForm.availability.split(',').map(day => day.trim()).filter(day => day)
      });

      if (result.success) {
        toast.success('Trainer application submitted! You will be notified once approved.');
        setShowRegisterModal(false);
        setTrainerForm({
          name: '',
          specialization: '',
          location: '',
          hourlyRate: '',
          experience: '',
          certifications: [],
          bio: '',
          image: '',
          specialties: [],
          languages: [],
          education: '',
          availability: []
        });
      } else {
        throw new Error(result.error || 'Failed to register trainer');
      }
    } catch (error) {
      console.error('Error registering trainer:', error);
      toast.error('Failed to submit trainer application');
    } finally {
      setRegistering(false);
    }
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = trainers;

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(trainer => 
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply specialization filter
    if (filters.specialization) {
      filtered = filtered.filter(trainer => trainer.specialization === filters.specialization);
    }

    setFilteredTrainers(filtered);
  }, [trainers, searchQuery, filters]);

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
              <div className="mt-3">
                <Button variant="outline-primary" onClick={() => setShowRegisterModal(true)}>
                  <FaPlus className="me-2" />
                  Become a Trainer
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Row className="mb-4">
          <Col lg={8}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search trainers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col lg={4}>
            <Form.Select
              value={filters.specialization}
              onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
            >
              <option value="">All Specializations</option>
              <option value="Strength Training">Strength Training</option>
              <option value="Cardio & HIIT">Cardio & HIIT</option>
              <option value="Yoga & Flexibility">Yoga & Flexibility</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Sports Performance">Sports Performance</option>
            </Form.Select>
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
              <Row>
                <Col md={4}>
                  <img
                    src={selectedTrainer.image}
                    alt={selectedTrainer.name}
                    className="img-fluid rounded mb-3"
                  />
                  <div className="text-center mb-3">
                    <h4>{selectedTrainer.name}</h4>
                    <p className="text-muted">{selectedTrainer.specialization}</p>
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(selectedTrainer.rating || 0) ? "text-warning" : "text-muted"} 
                        />
                      ))}
                      <span className="ms-2">({selectedTrainer.rating || 0})</span>
                    </div>
                    <Badge bg="success">${selectedTrainer.hourlyRate}/hour</Badge>
                  </div>
                </Col>
                <Col md={8}>
                  <h5>About</h5>
                  <p>{selectedTrainer.bio}</p>
                  
                  <h6>Experience</h6>
                  <p>{selectedTrainer.experience}</p>
                  
                  <h6>Education</h6>
                  <p>{selectedTrainer.education}</p>
                  
                  <h6>Certifications</h6>
                  <div className="mb-3">
                    {selectedTrainer.certifications?.map((cert, index) => (
                      <Badge key={index} bg="primary" className="me-1 mb-1">{cert}</Badge>
                    ))}
                  </div>
                  
                  <h6>Specialties</h6>
                  <div className="mb-3">
                    {selectedTrainer.specialties?.map((specialty, index) => (
                      <Badge key={index} bg="secondary" className="me-1 mb-1">{specialty}</Badge>
                    ))}
                  </div>
                  
                  <h6>Languages</h6>
                  <p>{selectedTrainer.languages?.join(', ')}</p>
                  
                  <h6>Availability</h6>
                  <p>{selectedTrainer.availability?.join(', ')}</p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTrainerModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={() => handleHireTrainer(selectedTrainer)}>
            <FaDollarSign className="me-1" />
            Hire Now
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Trainer Registration Modal */}
      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Become a SmartBulk Trainer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={trainerForm.name}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialization *</Form.Label>
                  <Form.Select
                    value={trainerForm.specialization}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, specialization: e.target.value }))}
                  >
                    <option value="">Select specialization</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Cardio & HIIT">Cardio & HIIT</option>
                    <option value="Yoga & Flexibility">Yoga & Flexibility</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Sports Performance">Sports Performance</option>
                    <option value="Powerlifting">Powerlifting</option>
                    <option value="Bodybuilding">Bodybuilding</option>
                    <option value="CrossFit">CrossFit</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City, State"
                    value={trainerForm.location}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, location: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hourly Rate ($)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="50"
                    value={trainerForm.hourlyRate}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, hourlyRate: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 5 years"
                value={trainerForm.experience}
                onChange={(e) => setTrainerForm(prev => ({ ...prev, experience: e.target.value }))}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Bio *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Tell us about yourself and your training philosophy..."
                value={trainerForm.bio}
                onChange={(e) => setTrainerForm(prev => ({ ...prev, bio: e.target.value }))}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Profile Image URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://example.com/your-photo.jpg"
                value={trainerForm.image}
                onChange={(e) => setTrainerForm(prev => ({ ...prev, image: e.target.value }))}
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Certifications</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="NASM, ACE, ACSM (comma separated)"
                    value={trainerForm.certifications}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, certifications: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Education</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Degree and institution"
                    value={trainerForm.education}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, education: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialties</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Weight Loss, Muscle Building (comma separated)"
                    value={trainerForm.specialties}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, specialties: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Languages</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="English, Spanish (comma separated)"
                    value={trainerForm.languages}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, languages: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Availability</Form.Label>
              <Form.Control
                type="text"
                placeholder="Monday, Wednesday, Friday (comma separated)"
                value={trainerForm.availability}
                onChange={(e) => setTrainerForm(prev => ({ ...prev, availability: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleRegisterTrainer}
            disabled={registering}
          >
            {registering ? (
              <>
                <Spinner size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              <>
                <FaCheck className="me-2" />
                Submit Application
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default TrainerMarketplace;
