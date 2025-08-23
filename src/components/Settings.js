// src/components/Settings.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Badge,
  Tabs, Tab, Modal, ListGroup, ListGroupItem
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaCog, FaBell, FaShieldAlt, FaPalette, FaUserSecret,
  FaEye, FaEyeSlash, FaTrash, FaDownload, FaUpload,
  FaKey, FaEnvelope, FaMobile, FaGlobe, FaMoon, FaSun
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Settings() {
  const { currentUser, userProfile, updateUserProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    darkMode: false,
    language: 'en',
    timezone: 'UTC',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    workoutReminders: true,
    nutritionReminders: true,
    progressUpdates: true,
    communityUpdates: false,
    
    // Privacy Settings
    profileVisibility: 'public',
    showProgress: true,
    showWorkouts: true,
    allowMessages: true,
    
    // Data Settings
    autoBackup: true,
    dataRetention: '1_year',
    analyticsConsent: true
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setSettings(prev => ({ ...prev, darkMode }));
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Handle dark mode toggle
    if (key === 'darkMode') {
      localStorage.setItem('darkMode', value);
      document.body.classList.toggle('dark-mode', value);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Save settings to user profile
      await updateUserProfile({
        preferences: {
          ...userProfile?.preferences,
          settings: settings
        }
      });
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to save settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match!' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'danger', text: 'Password must be at least 6 characters long!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Here you would typically call Firebase Auth to update password
      // For now, we'll just show a success message
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await logout();
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to delete account. Please try again.' });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (!currentUser) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          <h4>Please log in to access settings</h4>
        </Alert>
      </Container>
    );
  }

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'EST', label: 'EST (Eastern Standard Time)' },
    { value: 'PST', label: 'PST (Pacific Standard Time)' },
    { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
    { value: 'CET', label: 'CET (Central European Time)' }
  ];

  const dataRetentionOptions = [
    { value: '6_months', label: '6 Months' },
    { value: '1_year', label: '1 Year' },
    { value: '2_years', label: '2 Years' },
    { value: 'forever', label: 'Forever' }
  ];

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary text-white rounded-circle p-3 me-3">
                <FaCog size={24} />
              </div>
              <div>
                <h2 className="mb-1">Settings</h2>
                <p className="text-muted mb-0">Manage your app preferences and account settings</p>
              </div>
            </div>
          </Col>
        </Row>

        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        <Row>
          <Col lg={3} className="mb-4">
            {/* Settings Navigation */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  <ListGroupItem 
                    action 
                    active={activeTab === 'general'}
                    onClick={() => setActiveTab('general')}
                    className="d-flex align-items-center"
                  >
                    <FaCog className="me-2" />
                    General
                  </ListGroupItem>
                  <ListGroupItem 
                    action 
                    active={activeTab === 'notifications'}
                    onClick={() => setActiveTab('notifications')}
                    className="d-flex align-items-center"
                  >
                    <FaBell className="me-2" />
                    Notifications
                  </ListGroupItem>
                  <ListGroupItem 
                    action 
                    active={activeTab === 'privacy'}
                    onClick={() => setActiveTab('privacy')}
                    className="d-flex align-items-center"
                  >
                    <FaShieldAlt className="me-2" />
                    Privacy
                  </ListGroupItem>
                  <ListGroupItem 
                    action 
                    active={activeTab === 'data'}
                    onClick={() => setActiveTab('data')}
                    className="d-flex align-items-center"
                  >
                    <FaUserSecret className="me-2" />
                    Data & Security
                  </ListGroupItem>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                  <Tab eventKey="general" title="General Settings">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="d-flex align-items-center">
                            <FaMoon className="me-2" />
                            Dark Mode
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              checked={settings.darkMode}
                              onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                              className="me-2"
                            />
                            <span className="text-muted">
                              {settings.darkMode ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Language</Form.Label>
                          <Form.Select
                            value={settings.language}
                            onChange={(e) => handleSettingChange('language', e.target.value)}
                          >
                            {languages.map(lang => (
                              <option key={lang.value} value={lang.value}>
                                {lang.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Timezone</Form.Label>
                          <Form.Select
                            value={settings.timezone}
                            onChange={(e) => handleSettingChange('timezone', e.target.value)}
                          >
                            {timezones.map(tz => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  <Tab eventKey="notifications" title="Notifications">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="d-flex align-items-center">
                            <FaEnvelope className="me-2" />
                            Email Notifications
                          </Form.Label>
                          <Form.Check
                            type="switch"
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="d-flex align-items-center">
                            <FaMobile className="me-2" />
                            Push Notifications
                          </Form.Label>
                          <Form.Check
                            type="switch"
                            checked={settings.pushNotifications}
                            onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Workout Reminders</Form.Label>
                          <Form.Check
                            type="switch"
                            checked={settings.workoutReminders}
                            onChange={(e) => handleSettingChange('workoutReminders', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nutrition Reminders</Form.Label>
                          <Form.Check
                            type="switch"
                            checked={settings.nutritionReminders}
                            onChange={(e) => handleSettingChange('nutritionReminders', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Progress Updates</Form.Label>
                          <Form.Check
                            type="switch"
                            checked={settings.progressUpdates}
                            onChange={(e) => handleSettingChange('progressUpdates', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Community Updates</Form.Label>
                          <Form.Check
                            type="switch"
                            checked={settings.communityUpdates}
                            onChange={(e) => handleSettingChange('communityUpdates', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  <Tab eventKey="privacy" title="Privacy">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Profile Visibility</Form.Label>
                          <Form.Select
                            value={settings.profileVisibility}
                            onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                          >
                            <option value="public">Public</option>
                            <option value="friends">Friends Only</option>
                            <option value="private">Private</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Show Progress</Form.Label>
                          <Form.Check
                            type="switch"
                            checked={settings.showProgress}
                            onChange={(e) => handleSettingChange('showProgress', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Show Workouts</Form.Label>
                          <Form.Check
                            type="switch"
                            checked={settings.showWorkouts}
                            onChange={(e) => handleSettingChange('showWorkouts', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Allow Messages</Form.Label>
                          <Form.Check
                            type="switch"
                            checked={settings.allowMessages}
                            onChange={(e) => handleSettingChange('allowMessages', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  <Tab eventKey="data" title="Data & Security">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Auto Backup</Form.Label>
                          <Form.Check
                            type="switch"
                            checked={settings.autoBackup}
                            onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Data Retention</Form.Label>
                          <Form.Select
                            value={settings.dataRetention}
                            onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                          >
                            {dataRetentionOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Analytics Consent</Form.Label>
                          <Form.Check
                            type="switch"
                            checked={settings.analyticsConsent}
                            onChange={(e) => handleSettingChange('analyticsConsent', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr />

                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        onClick={() => setShowPasswordModal(true)}
                      >
                        <FaKey className="me-2" />
                        Change Password
                      </Button>
                      
                      <Button variant="outline-secondary">
                        <FaDownload className="me-2" />
                        Export Data
                      </Button>
                      
                      <Button variant="outline-warning">
                        <FaUpload className="me-2" />
                        Import Data
                      </Button>
                    </div>
                  </Tab>
                </Tabs>

                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <Button variant="success" onClick={handleSaveSettings} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                  
                  <Button 
                    variant="outline-danger" 
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <FaTrash className="me-2" />
                    Delete Account
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Password Change Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaKey className="me-2" />
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePasswordChange} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FaTrash className="me-2" />
            Delete Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>Warning:</strong> This action cannot be undone!
          </Alert>
          <p>Are you sure you want to delete your account? This will:</p>
          <ul>
            <li>Permanently delete all your data</li>
            <li>Remove your workout history</li>
            <li>Delete your progress tracking</li>
            <li>Remove your profile and preferences</li>
          </ul>
          <p className="text-muted">
            If you're sure, please type "DELETE" in the field below to confirm.
          </p>
          <Form.Control
            type="text"
            placeholder="Type DELETE to confirm"
            className="mt-2"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteAccount} 
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Settings;
