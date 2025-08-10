import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Card, Button, Form, 
  Modal, Badge, Alert, ProgressBar, Dropdown, Table 
} from "react-bootstrap";
import { motion } from "framer-motion";
import { 
  FaPlus, FaTrash, FaEdit, FaChartLine, FaWeight, 
  FaRuler, FaDumbbell, FaCalendar, FaTrophy 
} from "react-icons/fa";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function ProgressTracker() {
  const [measurements, setMeasurements] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);

  useEffect(() => {
    // Load saved data from localStorage
    const savedMeasurements = localStorage.getItem('measurements');
    if (savedMeasurements) {
      setMeasurements(JSON.parse(savedMeasurements));
    }
    
    const savedWorkoutLogs = localStorage.getItem('workoutLogs');
    if (savedWorkoutLogs) {
      setWorkoutLogs(JSON.parse(savedWorkoutLogs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('measurements', JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem('workoutLogs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  const addMeasurement = (measurement) => {
    if (editingMeasurement) {
      setMeasurements(measurements.map(m => m.id === editingMeasurement.id ? measurement : m));
      setEditingMeasurement(null);
    } else {
      setMeasurements([...measurements, { ...measurement, id: Date.now() }]);
    }
    setShowMeasurementModal(false);
  };

  const addWorkoutLog = (workout) => {
    if (editingWorkout) {
      setWorkoutLogs(workoutLogs.map(w => w.id === editingWorkout.id ? workout : w));
      setEditingWorkout(null);
    } else {
      setWorkoutLogs([...workoutLogs, { ...workout, id: Date.now() }]);
    }
    setShowWorkoutModal(false);
  };

  const deleteMeasurement = (id) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  const deleteWorkoutLog = (id) => {
    setWorkoutLogs(workoutLogs.filter(w => w.id !== id));
  };

  const editMeasurement = (measurement) => {
    setEditingMeasurement(measurement);
    setShowMeasurementModal(true);
  };

  const editWorkoutLog = (workout) => {
    setEditingWorkout(workout);
    setShowWorkoutModal(true);
  };

  // Chart data preparation
  const getWeightChartData = () => {
    const sortedMeasurements = [...measurements]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-10); // Last 10 measurements

    return {
      labels: sortedMeasurements.map(m => new Date(m.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Weight (lbs)',
          data: sortedMeasurements.map(m => m.weight),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }
      ]
    };
  };

  const getBodyFatChartData = () => {
    const sortedMeasurements = [...measurements]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-10);

    return {
      labels: sortedMeasurements.map(m => new Date(m.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Body Fat %',
          data: sortedMeasurements.map(m => m.bodyFat),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1
        }
      ]
    };
  };

  const getWorkoutFrequencyData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const workoutCounts = last30Days.map(date => 
      workoutLogs.filter(w => w.date === date).length
    );

    return {
      labels: last30Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Workouts per Day',
          data: workoutCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }
      ]
    };
  };

  const getMacroDistributionData = () => {
    const latestMeasurement = measurements[measurements.length - 1];
    if (!latestMeasurement) return null;

    return {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [
        {
          data: [latestMeasurement.protein, latestMeasurement.carbs, latestMeasurement.fat],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          borderWidth: 2
        }
      ]
    };
  };

  const getLatestStats = () => {
    if (measurements.length === 0) return null;
    
    const latest = measurements[measurements.length - 1];
    const previous = measurements[measurements.length - 2];
    
    if (!previous) return { latest, changes: {} };
    
    return {
      latest,
      changes: {
        weight: latest.weight - previous.weight,
        bodyFat: latest.bodyFat - previous.bodyFat,
        muscle: latest.muscle - previous.muscle
      }
    };
  };

  const stats = getLatestStats();

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold mb-3">
              <FaChartLine className="me-2 text-info" />
              Progress Tracker
            </h2>
            <p className="text-muted">Track your fitness journey and visualize your progress</p>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2">
              <Button 
                variant="info" 
                onClick={() => setShowMeasurementModal(true)}
                className="fw-semibold"
              >
                <FaPlus className="me-2" />
                Add Measurement
              </Button>
              <Button 
                variant="success" 
                onClick={() => setShowWorkoutModal(true)}
                className="fw-semibold"
              >
                <FaPlus className="me-2" />
                Log Workout
              </Button>
            </div>
          </Col>
        </Row>

        {/* Quick Stats */}
        {stats && (
          <Row className="mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center">
                <Card.Body>
                  <FaWeight className="text-primary mb-2" style={{ fontSize: '2rem' }} />
                  <h4 className="fw-bold">{stats.latest.weight} lbs</h4>
                  <small className="text-muted">Current Weight</small>
                  {stats.changes.weight && (
                    <div className={`mt-1 ${stats.changes.weight > 0 ? 'text-danger' : 'text-success'}`}>
                      <small>{stats.changes.weight > 0 ? '+' : ''}{stats.changes.weight.toFixed(1)} lbs</small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center">
                <Card.Body>
                  <FaRuler className="text-success mb-2" style={{ fontSize: '2rem' }} />
                  <h4 className="fw-bold">{stats.latest.bodyFat}%</h4>
                  <small className="text-muted">Body Fat</small>
                  {stats.changes.bodyFat && (
                    <div className={`mt-1 ${stats.changes.bodyFat > 0 ? 'text-danger' : 'text-success'}`}>
                      <small>{stats.changes.bodyFat > 0 ? '+' : ''}{stats.changes.bodyFat.toFixed(1)}%</small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center">
                <Card.Body>
                  <FaDumbbell className="text-warning mb-2" style={{ fontSize: '2rem' }} />
                  <h4 className="fw-bold">{stats.latest.muscle} lbs</h4>
                  <small className="text-muted">Muscle Mass</small>
                  {stats.changes.muscle && (
                    <div className={`mt-1 ${stats.changes.muscle > 0 ? 'text-success' : 'text-danger'}`}>
                      <small>{stats.changes.muscle > 0 ? '+' : ''}{stats.changes.muscle.toFixed(1)} lbs</small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center">
                <Card.Body>
                  <FaTrophy className="text-info mb-2" style={{ fontSize: '2rem' }} />
                  <h4 className="fw-bold">{workoutLogs.length}</h4>
                  <small className="text-muted">Total Workouts</small>
                  <div className="mt-1 text-success">
                    <small>This month: {workoutLogs.filter(w => {
                      const workoutDate = new Date(w.date);
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return workoutDate > monthAgo;
                    }).length}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Charts */}
        <Row className="mb-4">
          <Col lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-semibold mb-3">Weight Progress</h6>
                {measurements.length > 0 ? (
                  <Line data={getWeightChartData()} options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: { beginAtZero: false }
                    }
                  }} />
                ) : (
                  <div className="text-center py-4 text-muted">
                    <FaChartLine style={{ fontSize: '3rem' }} />
                    <p>No data to display</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-semibold mb-3">Body Fat Progress</h6>
                {measurements.length > 0 ? (
                  <Line data={getBodyFatChartData()} options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: { beginAtZero: false }
                    }
                  }} />
                ) : (
                  <div className="text-center py-4 text-muted">
                    <FaChartLine style={{ fontSize: '3rem' }} />
                    <p>No data to display</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-semibold mb-3">Workout Frequency (Last 30 Days)</h6>
                {workoutLogs.length > 0 ? (
                  <Bar data={getWorkoutFrequencyData()} options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: { beginAtZero: true, ticks: { stepSize: 1 } }
                    }
                  }} />
                ) : (
                  <div className="text-center py-4 text-muted">
                    <FaDumbbell style={{ fontSize: '3rem' }} />
                    <p>No workout data</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-semibold mb-3">Macro Distribution</h6>
                {getMacroDistributionData() ? (
                  <Doughnut data={getMacroDistributionData()} options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'bottom' }
                    }
                  }} />
                ) : (
                  <div className="text-center py-4 text-muted">
                    <FaWeight style={{ fontSize: '3rem' }} />
                    <p>No macro data</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Measurements */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold mb-0">Recent Measurements</h6>
              <Button 
                variant="outline-info" 
                size="sm"
                onClick={() => setShowMeasurementModal(true)}
              >
                <FaPlus className="me-2" />
                Add New
              </Button>
            </div>
            
            {measurements.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <FaRuler style={{ fontSize: '3rem' }} />
                <p>No measurements recorded yet</p>
                <Button variant="info" onClick={() => setShowMeasurementModal(true)}>
                  Record First Measurement
                </Button>
              </div>
            ) : (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight (lbs)</th>
                    <th>Body Fat %</th>
                    <th>Muscle (lbs)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 10)
                    .map((measurement) => (
                      <tr key={measurement.id}>
                        <td>{new Date(measurement.date).toLocaleDateString()}</td>
                        <td>{measurement.weight}</td>
                        <td>{measurement.bodyFat}%</td>
                        <td>{measurement.muscle}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => editMeasurement(measurement)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteMeasurement(measurement.id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Recent Workouts */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold mb-0">Recent Workouts</h6>
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={() => setShowWorkoutModal(true)}
              >
                <FaPlus className="me-2" />
                Log Workout
              </Button>
            </div>
            
            {workoutLogs.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <FaDumbbell style={{ fontSize: '3rem' }} />
                <p>No workouts logged yet</p>
                <Button variant="success" onClick={() => setShowWorkoutModal(true)}>
                  Log First Workout
                </Button>
              </div>
            ) : (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Workout Type</th>
                    <th>Duration</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutLogs
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 10)
                    .map((workout) => (
                      <tr key={workout.id}>
                        <td>{new Date(workout.date).toLocaleDateString()}</td>
                        <td>{workout.type}</td>
                        <td>{workout.duration} min</td>
                        <td>{workout.notes}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => editWorkoutLog(workout)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteWorkoutLog(workout.id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </motion.div>

      {/* Add/Edit Measurement Modal */}
      <Modal show={showMeasurementModal} onHide={() => setShowMeasurementModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingMeasurement ? 'Edit Measurement' : 'Add New Measurement'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MeasurementForm 
            onSubmit={addMeasurement}
            editingMeasurement={editingMeasurement}
          />
        </Modal.Body>
      </Modal>

      {/* Add/Edit Workout Log Modal */}
      <Modal show={showWorkoutModal} onHide={() => setShowWorkoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingWorkout ? 'Edit Workout Log' : 'Log New Workout'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WorkoutLogForm 
            onSubmit={addWorkoutLog}
            editingWorkout={editingWorkout}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

// Measurement Form Component
function MeasurementForm({ onSubmit, editingMeasurement }) {
  const [formData, setFormData] = useState({
    date: editingMeasurement?.date || new Date().toISOString().split('T')[0],
    weight: editingMeasurement?.weight || '',
    bodyFat: editingMeasurement?.bodyFat || '',
    muscle: editingMeasurement?.muscle || '',
    notes: editingMeasurement?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.weight && formData.bodyFat && formData.muscle) {
      onSubmit({ ...formData, id: editingMeasurement?.id });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </Form.Group>

      <Row className="g-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Weight (lbs)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Body Fat %</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={formData.bodyFat}
              onChange={(e) => setFormData({ ...formData, bodyFat: parseFloat(e.target.value) })}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Muscle Mass (lbs)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={formData.muscle}
              onChange={(e) => setFormData({ ...formData, muscle: parseFloat(e.target.value) })}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3 mt-3">
        <Form.Label>Notes (Optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes about this measurement..."
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button type="submit" variant="info" className="fw-semibold">
          {editingMeasurement ? 'Update' : 'Save Measurement'}
        </Button>
        <Button type="button" variant="outline-secondary">
          Cancel
        </Button>
      </div>
    </Form>
  );
}

// Workout Log Form Component
function WorkoutLogForm({ onSubmit, editingWorkout }) {
  const [formData, setFormData] = useState({
    date: editingWorkout?.date || new Date().toISOString().split('T')[0],
    type: editingWorkout?.type || '',
    duration: editingWorkout?.duration || '',
    notes: editingWorkout?.notes || ''
  });

  const workoutTypes = [
    'Strength Training',
    'Cardio',
    'HIIT',
    'Yoga',
    'Pilates',
    'Swimming',
    'Running',
    'Cycling',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.type && formData.duration) {
      onSubmit({ ...formData, id: editingWorkout?.id });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </Form.Group>

      <Row className="g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Workout Type</Form.Label>
            <Form.Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="">Select workout type</option>
              {workoutTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Duration (minutes)</Form.Label>
            <Form.Control
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3 mt-3">
        <Form.Label>Notes (Optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="How did the workout feel? Any achievements or challenges?"
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button type="submit" variant="success" className="fw-semibold">
          {editingWorkout ? 'Update' : 'Log Workout'}
        </Button>
        <Button type="button" variant="outline-secondary">
          Cancel
        </Button>
      </div>
    </Form>
  );
}

export default ProgressTracker;
