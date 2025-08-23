import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Button, Badge, 
  Modal, Form, InputGroup, Dropdown, Alert,
  ListGroup, Table, Tabs, Tab
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaClock,
  FaDumbbell, FaHeart, FaUsers, FaCalendar, FaPhone,
  FaEnvelope, FaGraduationCap, FaCertificate, FaVideo,
  FaComments, FaBookmark, FaShare
} from "react-icons/fa";

function TrainerMarketplace() {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [bookmarkedTrainers, setBookmarkedTrainers] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  const specialties = ["All", "Strength Training", "Weight Loss", "Yoga", "Cardio", "Nutrition", "Powerlifting", "Bodybuilding", "CrossFit", "Pilates"];
  const experienceLevels = ["All", "1-2 years", "3-5 years", "5-10 years", "10+ years"];
  const priceRanges = ["All", "$20-40/hr", "$40-60/hr", "$60-80/hr", "$80+/hr"];

  useEffect(() => {
    loadSampleData();
  }, []);

  useEffect(() => {
    filterTrainers();
  }, [searchTerm, selectedSpecialty, selectedExperience, selectedPriceRange, trainers]);

  const loadSampleData = () => {
    const sampleTrainers = [
      {
        id: 1,
        name: "Alex Strong",
        avatar: "https://via.placeholder.com/150/2196F3/FFFFFF?text=AS",
        specialty: "Strength Training",
        experience: "8 years",
        location: "New York, NY",
        rating: 4.9,
        reviewCount: 127,
        pricePerHour: 65,
        description: "Certified strength and conditioning specialist with 8+ years of experience. Specializing in powerlifting, olympic lifting, and functional strength training.",
        certifications: ["NSCA-CSCS", "NASM-CPT", "USA Weightlifting Level 1"],
        languages: ["English", "Spanish"],
        availability: "Mon-Sat: 6AM-8PM",
        sessionTypes: ["In-Person", "Virtual"],
        achievements: ["Former competitive powerlifter", "500+ clients trained", "Published fitness author"],
        photos: [
          "https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Gym+Setup",
          "https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Training",
          "https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Results"
        ],
        reviews: [
          { id: 1, user: "Sarah M.", rating: 5, comment: "Alex helped me increase my deadlift by 100lbs in 6 months!", date: "2024-01-15" },
          { id: 2, user: "Mike T.", rating: 5, comment: "Best trainer I've worked with. Really knows his stuff.", date: "2024-01-10" }
        ],
        responseTime: "< 2 hours",
        verified: true
      },
      {
        id: 2,
        name: "Mia Wellness",
        avatar: "https://via.placeholder.com/150/E91E63/FFFFFF?text=MW",
        specialty: "Yoga",
        experience: "6 years",
        location: "Los Angeles, CA",
        rating: 4.8,
        reviewCount: 89,
        pricePerHour: 50,
        description: "Registered Yoga Teacher (RYT-500) with expertise in Vinyasa, Hatha, and restorative yoga. Focus on mind-body connection and holistic wellness.",
        certifications: ["RYT-500", "Yin Yoga Certified", "Meditation Teacher"],
        languages: ["English"],
        availability: "Daily: 7AM-7PM",
        sessionTypes: ["In-Person", "Virtual", "Group Classes"],
        achievements: ["500+ hours of training", "Retreat leader", "Corporate wellness instructor"],
        photos: [
          "https://via.placeholder.com/400x300/E91E63/FFFFFF?text=Studio",
          "https://via.placeholder.com/400x300/E91E63/FFFFFF?text=Classes",
          "https://via.placeholder.com/400x300/E91E63/FFFFFF?text=Retreat"
        ],
        reviews: [
          { id: 3, user: "Jennifer L.", rating: 5, comment: "Mia's classes are transformative. Perfect blend of challenge and relaxation.", date: "2024-01-12" },
          { id: 4, user: "David R.", rating: 4, comment: "Great for beginners. Very patient and encouraging.", date: "2024-01-08" }
        ],
        responseTime: "< 4 hours",
        verified: true
      },
      {
        id: 3,
        name: "Jake Cardio",
        avatar: "https://via.placeholder.com/150/FF9800/FFFFFF?text=JC",
        specialty: "Cardio",
        experience: "4 years",
        location: "Miami, FL",
        rating: 4.7,
        reviewCount: 63,
        pricePerHour: 45,
        description: "High-energy cardio specialist and former marathon runner. Specializes in HIIT, running coaching, and endurance training for all fitness levels.",
        certifications: ["ACSM-CPT", "RRCA Running Coach", "TRX Certified"],
        languages: ["English", "Portuguese"],
        availability: "Mon-Fri: 5AM-9AM, 5PM-8PM",
        sessionTypes: ["In-Person", "Outdoor Training"],
        achievements: ["Boston Marathon qualifier", "200+ runners coached", "HIIT specialist"],
        photos: [
          "https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Running",
          "https://via.placeholder.com/400x300/FF9800/FFFFFF?text=HIIT",
          "https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Outdoor"
        ],
        reviews: [
          { id: 5, user: "Lisa K.", rating: 5, comment: "Jake helped me run my first 5K! Amazing motivator.", date: "2024-01-14" },
          { id: 6, user: "Tom W.", rating: 4, comment: "Intense workouts but great results. Lost 15 lbs!", date: "2024-01-09" }
        ],
        responseTime: "< 6 hours",
        verified: true
      },
      {
        id: 4,
        name: "Emma Nutrition",
        avatar: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=EN",
        specialty: "Nutrition",
        experience: "10 years",
        location: "Chicago, IL",
        rating: 4.9,
        reviewCount: 156,
        pricePerHour: 75,
        description: "Registered Dietitian and sports nutritionist. Specializes in weight management, sports nutrition, and meal planning for optimal performance.",
        certifications: ["RD", "CSSD", "Precision Nutrition Level 1"],
        languages: ["English", "French"],
        availability: "Mon-Thu: 9AM-6PM",
        sessionTypes: ["Virtual", "Phone Consultation"],
        achievements: ["1000+ nutrition plans created", "Sports team consultant", "Published researcher"],
        photos: [
          "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Consultation",
          "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Meal+Prep",
          "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Education"
        ],
        reviews: [
          { id: 7, user: "Mark S.", rating: 5, comment: "Emma completely transformed my relationship with food. Down 30 lbs!", date: "2024-01-13" },
          { id: 8, user: "Anna P.", rating: 5, comment: "Professional, knowledgeable, and genuinely cares about results.", date: "2024-01-11" }
        ],
        responseTime: "< 1 hour",
        verified: true
      }
    ];

    const sampleBookings = [
      {
        id: 1,
        trainerId: 1,
        trainerName: "Alex Strong",
        date: "2024-02-15",
        time: "10:00 AM",
        duration: "60 minutes",
        type: "In-Person",
        status: "Confirmed",
        price: 65,
        location: "Trainer's Gym, NYC"
      },
      {
        id: 2,
        trainerId: 2,
        trainerName: "Mia Wellness",
        date: "2024-02-18",
        time: "2:00 PM",
        duration: "90 minutes",
        type: "Virtual",
        status: "Pending",
        price: 75,
        location: "Zoom Session"
      }
    ];

    setTrainers(sampleTrainers);
    setFilteredTrainers(sampleTrainers);
    setMyBookings(sampleBookings);
    
    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('trainerBookmarks');
    if (savedBookmarks) {
      setBookmarkedTrainers(JSON.parse(savedBookmarks));
    }
  };

  const filterTrainers = () => {
    let filtered = trainers;

    if (searchTerm) {
      filtered = filtered.filter(trainer =>
        trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty !== "All") {
      filtered = filtered.filter(trainer => trainer.specialty === selectedSpecialty);
    }

    if (selectedExperience !== "All") {
      // Simple experience filtering logic
      filtered = filtered.filter(trainer => {
        const experience = parseInt(trainer.experience);
        switch (selectedExperience) {
          case "1-2 years": return experience >= 1 && experience <= 2;
          case "3-5 years": return experience >= 3 && experience <= 5;
          case "5-10 years": return experience >= 5 && experience <= 10;
          case "10+ years": return experience >= 10;
          default: return true;
        }
      });
    }

    if (selectedPriceRange !== "All") {
      filtered = filtered.filter(trainer => {
        const price = trainer.pricePerHour;
        switch (selectedPriceRange) {
          case "$20-40/hr": return price >= 20 && price <= 40;
          case "$40-60/hr": return price >= 40 && price <= 60;
          case "$60-80/hr": return price >= 60 && price <= 80;
          case "$80+/hr": return price >= 80;
          default: return true;
        }
      });
    }

    setFilteredTrainers(filtered);
  };

  const toggleBookmark = (trainerId) => {
    const newBookmarks = bookmarkedTrainers.includes(trainerId)
      ? bookmarkedTrainers.filter(id => id !== trainerId)
      : [...bookmarkedTrainers, trainerId];
    
    setBookmarkedTrainers(newBookmarks);
    localStorage.setItem('trainerBookmarks', JSON.stringify(newBookmarks));
  };

  const showTrainerProfile = (trainer) => {
    setSelectedTrainer(trainer);
    setShowTrainerModal(true);
  };

  const bookTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    setShowBookingModal(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-warning" style={{opacity: 0.5}} />);
    }
    return stars;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const renderTrainerGrid = () => (
    <Row>
      {filteredTrainers.map((trainer) => (
        <Col key={trainer.id} lg={6} xl={4} className="mb-4">
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-100 trainer-card border-0 shadow-sm">
              <div className="position-relative">
                <div className="trainer-avatar text-center pt-3">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="rounded-circle"
                    width="80"
                    height="80"
                  />
                  {trainer.verified && (
                    <Badge bg="success" className="position-absolute top-0 end-0 m-2">
                      <FaCertificate className="me-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <Button
                  variant={bookmarkedTrainers.includes(trainer.id) ? "warning" : "outline-warning"}
                  size="sm"
                  className="position-absolute top-0 start-0 m-2"
                  onClick={() => toggleBookmark(trainer.id)}
                >
                  <FaBookmark />
                </Button>
              </div>
              
              <Card.Body className="text-center">
                <Card.Title className="h5 mb-1">{trainer.name}</Card.Title>
                <div className="mb-2">
                  {renderStars(trainer.rating)}
                  <span className="ms-2 text-muted small">({trainer.reviewCount} reviews)</span>
                </div>
                
                <Badge bg="primary" className="mb-2">{trainer.specialty}</Badge>
                
                <div className="small text-muted mb-2">
                  <FaMapMarkerAlt className="me-1" />
                  {trainer.location}
                </div>
                
                <div className="small text-muted mb-3">
                  <FaClock className="me-1" />
                  {trainer.experience} experience
                </div>
                
                <div className="h5 text-success mb-3">
                  ${trainer.pricePerHour}/hour
                </div>
                
                <p className="small text-muted mb-3" style={{ minHeight: '60px' }}>
                  {trainer.description.length > 100 
                    ? `${trainer.description.substring(0, 100)}...` 
                    : trainer.description
                  }
                </p>
                
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="flex-fill"
                    onClick={() => showTrainerProfile(trainer)}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-fill"
                    onClick={() => bookTrainer(trainer)}
                  >
                    Book Now
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  );

  const renderBookmarkedTrainers = () => {
    const bookmarked = trainers.filter(trainer => bookmarkedTrainers.includes(trainer.id));
    
    if (bookmarked.length === 0) {
      return (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <FaBookmark size={48} className="text-muted mb-3" />
            <h5 className="text-muted">No bookmarked trainers</h5>
            <p className="text-muted">Bookmark trainers you're interested in for easy access</p>
          </Card.Body>
        </Card>
      );
    }
    
    return (
      <Row>
        {bookmarked.map((trainer) => (
          <Col key={trainer.id} lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="rounded-circle me-3"
                    width="60"
                    height="60"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{trainer.name}</h6>
                    <div className="small mb-1">
                      {renderStars(trainer.rating)}
                      <span className="ms-2 text-muted">({trainer.reviewCount})</span>
                    </div>
                    <Badge bg="primary" size="sm">{trainer.specialty}</Badge>
                  </div>
                  <div className="text-end">
                    <div className="h6 text-success mb-0">${trainer.pricePerHour}/hr</div>
                    <small className="text-muted">{trainer.location}</small>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => showTrainerProfile(trainer)}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => bookTrainer(trainer)}
                  >
                    Book Session
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => toggleBookmark(trainer.id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const renderMyBookings = () => {
    if (myBookings.length === 0) {
      return (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <FaCalendar size={48} className="text-muted mb-3" />
            <h5 className="text-muted">No bookings yet</h5>
            <p className="text-muted">Book your first session with a trainer to get started</p>
            <Button variant="primary" onClick={() => setActiveTab('browse')}>
              Browse Trainers
            </Button>
          </Card.Body>
        </Card>
      );
    }
    
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Trainer</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Type</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.trainerName}</strong>
                  </td>
                  <td>
                    {new Date(booking.date).toLocaleDateString()}<br />
                    <small className="text-muted">{booking.time}</small>
                  </td>
                  <td>{booking.duration}</td>
                  <td>
                    <Badge bg="info">{booking.type}</Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </td>
                  <td>${booking.price}</td>
                  <td>
                    <Button variant="outline-primary" size="sm">
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

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
                <FaUsers className="me-3 text-primary" />
                Trainer Marketplace
              </h1>
              <p className="lead text-muted">
                Find certified fitness professionals to help you achieve your goals
              </p>
            </div>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={setActiveTab}
          className="mb-4"
        >
          <Tab eventKey="browse" title="Browse Trainers">
            {/* Search and Filters */}
            <Row className="mb-4">
              <Col lg={4} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search trainers, specialties, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col lg={8}>
                <Row>
                  <Col>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" className="w-100">
                        <FaFilter className="me-2" />
                        {selectedSpecialty}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {specialties.map(specialty => (
                          <Dropdown.Item
                            key={specialty}
                            onClick={() => setSelectedSpecialty(specialty)}
                            active={selectedSpecialty === specialty}
                          >
                            {specialty}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" className="w-100">
                        {selectedExperience}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {experienceLevels.map(level => (
                          <Dropdown.Item
                            key={level}
                            onClick={() => setSelectedExperience(level)}
                            active={selectedExperience === level}
                          >
                            {level}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" className="w-100">
                        {selectedPriceRange}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {priceRanges.map(range => (
                          <Dropdown.Item
                            key={range}
                            onClick={() => setSelectedPriceRange(range)}
                            active={selectedPriceRange === range}
                          >
                            {range}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Results Count */}
            <Row className="mb-3">
              <Col>
                <p className="text-muted">
                  Showing {filteredTrainers.length} of {trainers.length} trainers
                </p>
              </Col>
            </Row>

            {/* Trainer Grid */}
            {filteredTrainers.length === 0 ? (
              <Card className="text-center py-5 border-0 shadow-sm">
                <Card.Body>
                  <FaUsers size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No trainers found</h5>
                  <p className="text-muted">Try adjusting your search or filters</p>
                </Card.Body>
              </Card>
            ) : (
              renderTrainerGrid()
            )}
          </Tab>

          <Tab eventKey="bookmarked" title="Bookmarked">
            {renderBookmarkedTrainers()}
          </Tab>

          <Tab eventKey="bookings" title="My Bookings">
            {renderMyBookings()}
          </Tab>
        </Tabs>
      </motion.div>

      {/* Trainer Profile Modal */}
      <Modal
        show={showTrainerModal}
        onHide={() => setShowTrainerModal(false)}
        size="xl"
        centered
      >
        {selectedTrainer && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedTrainer.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={4} className="text-center mb-4">
                  <img
                    src={selectedTrainer.avatar}
                    alt={selectedTrainer.name}
                    className="rounded-circle mb-3"
                    width="120"
                    height="120"
                  />
                  <h5>{selectedTrainer.name}</h5>
                  <div className="mb-2">
                    {renderStars(selectedTrainer.rating)}
                    <div className="text-muted small">({selectedTrainer.reviewCount} reviews)</div>
                  </div>
                  <Badge bg="primary" className="mb-2">{selectedTrainer.specialty}</Badge>
                  <div className="h4 text-success mb-3">${selectedTrainer.pricePerHour}/hour</div>
                  <div className="small text-muted mb-2">
                    <FaMapMarkerAlt className="me-1" />
                    {selectedTrainer.location}
                  </div>
                  <div className="small text-muted mb-3">
                    <FaClock className="me-1" />
                    Responds in {selectedTrainer.responseTime}
                  </div>
                </Col>
                
                <Col md={8}>
                  <Tabs defaultActiveKey="about" className="mb-3">
                    <Tab eventKey="about" title="About">
                      <div className="mb-4">
                        <h6>About {selectedTrainer.name}</h6>
                        <p className="text-muted">{selectedTrainer.description}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h6>Certifications</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedTrainer.certifications.map((cert, index) => (
                            <Badge key={index} bg="success">{cert}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h6>Languages</h6>
                        <p className="text-muted">{selectedTrainer.languages.join(", ")}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h6>Availability</h6>
                        <p className="text-muted">{selectedTrainer.availability}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h6>Session Types</h6>
                        <div className="d-flex gap-2">
                          {selectedTrainer.sessionTypes.map((type, index) => (
                            <Badge key={index} bg="info">{type}</Badge>
                          ))}
                        </div>
                      </div>
                    </Tab>
                    
                    <Tab eventKey="reviews" title="Reviews">
                      {selectedTrainer.reviews.map((review) => (
                        <div key={review.id} className="mb-3 pb-3 border-bottom">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{review.user}</strong>
                            <div>
                              {renderStars(review.rating)}
                              <small className="text-muted ms-2">
                                {new Date(review.date).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                          <p className="text-muted mb-0">{review.comment}</p>
                        </div>
                      ))}
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-warning"
                onClick={() => toggleBookmark(selectedTrainer.id)}
              >
                <FaBookmark className="me-2" />
                {bookmarkedTrainers.includes(selectedTrainer.id) ? "Remove Bookmark" : "Bookmark"}
              </Button>
              <Button variant="secondary" onClick={() => setShowTrainerModal(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowTrainerModal(false);
                  bookTrainer(selectedTrainer);
                }}
              >
                Book Session
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Booking Modal */}
      <Modal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        centered
      >
        {selectedTrainer && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Book Session with {selectedTrainer.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Alert variant="info">
                <strong>Rate:</strong> ${selectedTrainer.pricePerHour}/hour
              </Alert>
              
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Session Type</Form.Label>
                      <Form.Select>
                        {selectedTrainer.sessionTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duration</Form.Label>
                      <Form.Select>
                        <option value="60">60 minutes - ${selectedTrainer.pricePerHour}</option>
                        <option value="90">90 minutes - ${Math.round(selectedTrainer.pricePerHour * 1.5)}</option>
                        <option value="120">120 minutes - ${selectedTrainer.pricePerHour * 2}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Preferred Date</Form.Label>
                      <Form.Control
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Preferred Time</Form.Label>
                      <Form.Select>
                        <option value="9:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Goals & Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Tell the trainer about your fitness goals and any specific requirements..."
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                <FaCalendar className="me-2" />
                Request Booking
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
}

export default TrainerMarketplace;
