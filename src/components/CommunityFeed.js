import React, { useState, useEffect, useCallback } from "react";
import {
  Container, Row, Col, Card, Button, Form,
  Badge, Modal, InputGroup, Dropdown,
  Alert
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaHeart, FaComment, FaShare, FaEllipsisH, FaPlus,
  FaTrophy, FaFire, FaDumbbell, FaAppleAlt, FaUsers,
  FaMedal, FaStar, FaBookmark, FaWifi, FaTimes
} from "react-icons/fa";
import { useAuth } from '../contexts/AuthContext';
import realtimeService from '../services/RealtimeService';
import FirestoreService from '../services/FirestoreService';
import toast from 'react-hot-toast';

function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({
    content: "",
    type: "achievement",
    image: "",
    tags: []
  });
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser: authUser } = useAuth();
  const [currentUser] = useState({
    id: authUser?.uid || 1,
    username: authUser?.displayName || "FitnessFanatic",
    avatar: "https://via.placeholder.com/50/4CAF50/FFFFFF?text=FF",
    level: "Gold",
    points: 2847
  });

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Just now';
    }
  };

  // Create initial posts for first-time users
  const createInitialPosts = async () => {
    if (!authUser?.uid) return;
    
    try {
      for (const post of samplePosts) {
        await FirestoreService.createCommunityPost('sample-user', {
          content: post.content,
          type: post.type,
          image: post.image,
          tags: post.tags,
          userDisplayName: post.user.username,
          commentsList: post.commentsList
        });
      }
    } catch (error) {
      console.error('Error creating initial posts:', error);
    }
  };

  // Sample community posts
  const samplePosts = [
    {
      id: 1,
      user: {
        id: 2,
        username: "JohnD",
        avatar: "https://via.placeholder.com/50/2196F3/FFFFFF?text=JD",
        level: "Platinum",
        points: 3421
      },
      content: "Just hit a new PR on deadlifts today! 180kg for 3 reps! 💪 The grind never stops!",
      type: "achievement",
      image: "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Deadlift+PR",
      likes: 47,
      comments: 12,
      shares: 8,
      timestamp: "2 hours ago",
      tags: ["deadlift", "PR", "strength"],
      liked: false,
      bookmarked: false,
      commentsList: [
        { id: 1, user: "FitSarah", content: "Amazing work! What's your secret?", timestamp: "1 hour ago" },
        { id: 2, user: "MikeLifts", content: "Beast mode! Keep it up!", timestamp: "45 min ago" }
      ]
    },
    {
      id: 2,
      user: {
        id: 3,
        username: "FitSarah",
        avatar: "https://via.placeholder.com/50/FF9800/FFFFFF?text=FS",
        level: "Gold",
        points: 2156
      },
      content: "Meal prep done for the week! 21 meals ready to go. Consistency is key to results! 🥗",
      type: "nutrition",
      image: "https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Meal+Prep",
      likes: 89,
      comments: 23,
      shares: 15,
      timestamp: "4 hours ago",
      tags: ["meal prep", "nutrition", "consistency"],
      liked: true,
      bookmarked: false,
      commentsList: [
        { id: 3, user: "JohnD", content: "Looks delicious! What's your favorite recipe?", timestamp: "3 hours ago" },
        { id: 4, user: "GymRat", content: "This is goals! How do you stay motivated?", timestamp: "2 hours ago" }
      ]
    },
    {
      id: 3,
      user: {
        id: 4,
        username: "MikeLifts",
        avatar: "https://via.placeholder.com/50/9C27B0/FFFFFF?text=ML",
        level: "Diamond",
        points: 5678
      },
      content: "Finally joined the 100kg bench club! Been working towards this for 2 years. Never give up! 🏋️‍♂️",
      type: "achievement",
      image: "https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=100kg+Bench",
      likes: 156,
      comments: 34,
      shares: 22,
      timestamp: "6 hours ago",
      tags: ["bench press", "milestone", "persistence"],
      liked: false,
      bookmarked: true,
      commentsList: [
        { id: 5, user: "FitSarah", content: "Incredible achievement! What's next?", timestamp: "5 hours ago" },
        { id: 6, user: "GymRat", content: "Welcome to the club! 💪", timestamp: "4 hours ago" }
      ]
    }
  ];

  const postTypes = {
    achievement: { label: "Achievement", icon: FaTrophy, color: "success" },
    nutrition: { label: "Nutrition", icon: FaAppleAlt, color: "warning" },
    transformation: { label: "Transformation", icon: FaFire, color: "danger" },
    motivation: { label: "Motivation", icon: FaStar, color: "info" },
    workout: { label: "Workout", icon: FaDumbbell, color: "primary" }
  };

  const filters = [
    { key: "all", label: "All Posts", icon: FaUsers },
    { key: "achievement", label: "Achievements", icon: FaTrophy },
    { key: "nutrition", label: "Nutrition", icon: FaAppleAlt },
    { key: "transformation", label: "Transformations", icon: FaFire },
    { key: "motivation", label: "Motivation", icon: FaStar },
    { key: "workout", label: "Workouts", icon: FaDumbbell }
  ];

  useEffect(() => {
    // Connect to real-time service
    if (authUser?.uid) {
      realtimeService.connect(authUser.uid);
      setConnectionStatus(realtimeService.getConnectionStatus());
    }

    // Subscribe to real-time updates
    const unsubscribeNewPost = realtimeService.subscribe('new_post', (newPost) => {
      setPosts(prev => [newPost, ...prev]);
    });

    const unsubscribePostLiked = realtimeService.subscribe('post_liked', (data) => {
      setPosts(prev => prev.map(post => 
        post.id === data.postId 
          ? { ...post, likes: data.likes }
          : post
      ));
    });

    const unsubscribeNewComment = realtimeService.subscribe('new_comment', (data) => {
      setPosts(prev => prev.map(post => 
        post.id === data.postId 
          ? { ...post, comments: post.comments + 1, commentsList: [...post.commentsList, data.comment] }
          : post
      ));
    });

    return () => {
      unsubscribeNewPost();
      unsubscribePostLiked();
      unsubscribeNewComment();
    };
  }, [authUser?.uid]);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await FirestoreService.getCommunityPosts({ limitCount: 50 });
        if (result.success && result.data.length > 0) {
          // Transform Firestore data to match component format
          const transformedPosts = result.data.map(post => ({
            ...post,
            user: post.user || {
              id: post.userId,
              username: post.userDisplayName || 'Anonymous',
              avatar: `https://via.placeholder.com/50/4CAF50/FFFFFF?text=${(post.userDisplayName || 'A')[0]}`,
              level: "Gold",
              points: 2500
            },
            timestamp: formatTimestamp(post.createdAt),
            commentsList: post.commentsList || [],
            liked: false,
            bookmarked: false
          }));
          setPosts(transformedPosts);
        } else {
          // Create some initial sample posts if none exist
          await createInitialPosts();
          setPosts(samplePosts);
        }
      } catch (e) {
        console.error('Error fetching posts from Firebase:', e);
        setError('Failed to load posts from database. Using sample data.');
        setPosts(samplePosts);
      } finally {
        setIsLoading(false);
      }

      // Load saved interactions
      const savedInteractions = localStorage.getItem('communityInteractions');
      if (savedInteractions) {
        try {
          const interactions = JSON.parse(savedInteractions);
          setPosts(prev => prev.map(post => ({
            ...post,
            liked: interactions[post.id]?.liked || false,
            bookmarked: interactions[post.id]?.bookmarked || false
          })));
        } catch (e) {
          console.error('Error loading interactions:', e);
        }
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    // Save user interactions to localStorage
    const interactions = {};
    posts.forEach(post => {
      interactions[post.id] = {
        liked: post.liked,
        bookmarked: post.bookmarked
      };
    });
    localStorage.setItem('communityInteractions', JSON.stringify(interactions));
  }, [posts]);

  const handleLike = async (postId) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
        : post
    ));
    
    try { 
      await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
      
      // Send real-time update
      if (connectionStatus.isConnected) {
        realtimeService.updatePostInteraction(postId, 'like', currentUser.id);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleBookmark = (postId) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, bookmarked: !post.bookmarked }
        : post
    ));
  };

  const handleComment = async (postId, comment) => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now(),
      user: currentUser.username,
      content: comment,
      timestamp: "Just now"
    };

    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comments: post.comments + 1, commentsList: [...post.commentsList, newComment] }
        : post
    ));

    try {
      await fetch(`/api/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser.username, content: comment })
      });
      
      // Send real-time update
      if (connectionStatus.isConnected) {
        realtimeService.updatePostInteraction(postId, 'comment', currentUser.id);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const createPost = async () => {
    if (!newPost.content.trim() || !authUser?.uid) return;
    
    setIsLoading(true);
    try {
      const postData = {
        content: newPost.content,
        type: newPost.type,
        image: newPost.image,
        tags: newPost.tags,
        userDisplayName: currentUser.username,
        commentsList: []
      };
      
      const result = await FirestoreService.createCommunityPost(authUser.uid, postData);
      
      if (result.success) {
        // Create the post object for immediate display
        const newPostObj = {
          id: result.id,
          ...postData,
          user: currentUser,
          userId: authUser.uid,
          likes: 0,
          comments: 0,
          shares: 0,
          timestamp: 'Just now',
          liked: false,
          bookmarked: false
        };
        
        setPosts(prev => [newPostObj, ...prev]);
        toast.success('Post created successfully!');
      } else {
        throw new Error(result.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
      
      // Fallback: add to local state anyway
      const fallbackPost = {
        id: Date.now(),
        content: newPost.content,
        type: newPost.type,
        image: newPost.image,
        tags: newPost.tags,
        user: currentUser,
        userId: authUser.uid,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: 'Just now',
        liked: false,
        bookmarked: false,
        commentsList: []
      };
      setPosts(prev => [fallbackPost, ...prev]);
    } finally {
      setIsLoading(false);
    }
    
    setNewPost({ content: "", type: "achievement", image: "", tags: [] });
    setShowCreateModal(false);
  };

  const filteredPosts = posts.filter(post => {
    if (filter !== "all" && post.type !== filter) return false;
    if (searchTerm && !post.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getLevelColor = (level) => {
    const colors = {
      "Bronze": "warning",
      "Silver": "secondary",
      "Gold": "warning",
      "Platinum": "info",
      "Diamond": "primary"
    };
    return colors[level] || "secondary";
  };

  const getTypeIcon = (type) => {
    const IconComponent = postTypes[type]?.icon || FaStar;
    return <IconComponent className={`text-${postTypes[type]?.color || 'primary'}`} />;
  };

  return (
    <Container>
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
                <FaUsers className="me-3" />
                Community Feed
              </h1>
              <p className="lead text-muted mb-2">
                Connect with fitness enthusiasts, share your achievements, and get inspired
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

        {/* User Stats Card */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <Row className="align-items-center">
                  <Col md={3}>
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.username} 
                      className="rounded-circle mb-2" 
                      width="80" 
                      height="80" 
                    />
                    <h5 className="mb-1">{currentUser.username}</h5>
                    <Badge bg={getLevelColor(currentUser.level)}>{currentUser.level}</Badge>
                  </Col>
                  <Col md={9}>
                    <Row className="text-center">
                      <Col>
                        <div className="h3 text-primary mb-1">{currentUser.points}</div>
                        <small className="text-muted">Total Points</small>
                      </Col>
                      <Col>
                        <div className="h3 text-success mb-1">{posts.filter(p => p.user.id === currentUser.id).length}</div>
                        <small className="text-muted">Posts</small>
                      </Col>
                      <Col>
                        <div className="h3 text-info mb-1">{posts.reduce((sum, p) => sum + p.likes, 0)}</div>
                        <small className="text-muted">Likes Given</small>
                      </Col>
                      <Col>
                        <div className="h3 text-warning mb-1">{posts.filter(p => p.user.id === currentUser.id).reduce((sum, p) => sum + p.likes, 0)}</div>
                        <small className="text-muted">Likes Received</small>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Controls */}
        <Row className="mb-4">
          <Col lg={8} className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FaUsers />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col lg={4} className="mb-3">
            <Button
              variant="primary"
              className="w-100"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus className="me-2" />
              Create Post
            </Button>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex flex-wrap gap-2">
              {filters.map(filterOption => (
                <Button
                  key={filterOption.key}
                  variant={filter === filterOption.key ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => setFilter(filterOption.key)}
                >
                  <filterOption.icon className="me-1" />
                  {filterOption.label}
                </Button>
              ))}
            </div>
          </Col>
        </Row>

        {/* Posts Feed */}
        <Row>
          <Col>
            {filteredPosts.length === 0 ? (
              <Card className="text-center py-5 border-0 shadow-sm">
                <Card.Body>
                  <FaUsers size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No posts found</h5>
                  <p className="text-muted">Try adjusting your search or filters</p>
                </Card.Body>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-transparent border-0 pb-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center">
                          <img
                            src={post.user.avatar}
                            alt={post.user.username}
                            className="rounded-circle me-3"
                            width="50"
                            height="50"
                          />
                          <div>
                            <h6 className="mb-1">
                              {post.user.username}
                              <Badge bg={getLevelColor(post.user.level)} className="ms-2">
                                {post.user.level}
                              </Badge>
                            </h6>
                            <small className="text-muted">{post.timestamp}</small>
                          </div>
                        </div>
                        <Dropdown>
                          <Dropdown.Toggle variant="link" className="text-muted p-0">
                            <FaEllipsisH />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>Report</Dropdown.Item>
                            <Dropdown.Item>Share</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Card.Header>
                    
                    <Card.Body>
                      <div className="mb-3">
                        <Badge bg={postTypes[post.type]?.color} className="mb-2">
                          {getTypeIcon(post.type)} {postTypes[post.type]?.label}
                        </Badge>
                        <p className="mb-3">{post.content}</p>
                        {post.image && (
                          <img
                            src={post.image}
                            alt="Post"
                            className="img-fluid rounded mb-3"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                          />
                        )}
                        {post.tags.length > 0 && (
                          <div className="mb-3">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} bg="light" text="dark" className="me-1">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Interaction Stats */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <small className="text-muted">
                          {post.likes} likes • {post.comments} comments • {post.shares} shares
                        </small>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        <Button
                          variant={post.liked ? "danger" : "outline-danger"}
                          size="sm"
                          onClick={() => handleLike(post.id)}
                        >
                          <FaHeart className="me-1" />
                          {post.liked ? "Liked" : "Like"}
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedPost(post);
                            setShowPostModal(true);
                          }}
                        >
                          <FaComment className="me-1" />
                          Comment
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                        >
                          <FaShare className="me-1" />
                          Share
                        </Button>
                        <Button
                          variant={post.bookmarked ? "warning" : "outline-warning"}
                          size="sm"
                          onClick={() => handleBookmark(post.id)}
                          className="ms-auto"
                        >
                          <FaBookmark className="me-1" />
                          {post.bookmarked ? "Saved" : "Save"}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))
            )}
          </Col>
        </Row>
      </motion.div>

      {/* Create Post Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Post Type</Form.Label>
              <Form.Select
                value={newPost.type}
                onChange={(e) => setNewPost(prev => ({ ...prev, type: e.target.value }))}
              >
                {Object.entries(postTypes).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Share your fitness journey..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL (optional)</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://example.com/image.jpg"
                value={newPost.image}
                onChange={(e) => setNewPost(prev => ({ ...prev, image: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="fitness, motivation, goals"
                value={newPost.tags.join(", ")}
                onChange={(e) => setNewPost(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag)
                }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createPost}>
            Create Post
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Post Detail Modal */}
      <Modal show={showPostModal} onHide={() => setShowPostModal(false)} size="lg">
        {selectedPost && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Post by {selectedPost.user.username}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <Badge bg={postTypes[selectedPost.type]?.color} className="mb-2">
                  {getTypeIcon(selectedPost.type)} {postTypes[selectedPost.type]?.label}
                </Badge>
                <p>{selectedPost.content}</p>
                {selectedPost.image && (
                  <img
                    src={selectedPost.image}
                    alt="Post"
                    className="img-fluid rounded mb-3"
                  />
                )}
              </div>

              <h6>Comments ({selectedPost.comments})</h6>
              <div className="mb-3">
                {selectedPost.commentsList.map(comment => (
                  <div key={comment.id} className="border-bottom pb-2 mb-2">
                    <strong>{comment.user}</strong>
                    <span className="text-muted ms-2">{comment.timestamp}</span>
                    <p className="mb-1">{comment.content}</p>
                  </div>
                ))}
              </div>

              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Add a comment..."
                  onKeyPress={async (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const text = e.target.value;
                      handleComment(selectedPost.id, text);
                      try {
                        await fetch(`/api/community/posts/${selectedPost.id}/comment`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ user: currentUser.username, content: text })
                        });
                      } catch {}
                      e.target.value = '';
                    }
                  }}
                />
              </Form.Group>
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
  );
}

export default CommunityFeed;
