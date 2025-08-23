import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Modal,
  Badge, Alert, InputGroup, Table, Tabs, Tab,
  ProgressBar, Dropdown, ButtonGroup
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2';
import {
  FaWeight, FaRuler, FaChartLine, FaPlus, FaEdit,
  FaCalendar, FaBullseye, FaArrowUp, FaArrowDown,
  FaFire, FaHeart, FaDumbbell, FaEye, FaCamera,
  FaSave, FaTrash, FaMinus, FaEquals, FaDownload, FaFilter, FaCalculator,
  FaChartBar, FaChartPie, FaCog, FaInfoCircle
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { format, parseISO, differenceInDays, subMonths, subWeeks, isAfter } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useMeasurements, useWorkouts, useGoals, useProgressPhotos } from '../hooks/useFirestore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  RadialLinearScale,
  Filler
);

function ProgressTracker() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [measurements, setMeasurements] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [bodyPhotos, setBodyPhotos] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    muscle: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
    notes: ''
  });
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    current: '',
    unit: 'kg',
    deadline: '',
    category: 'weight'
  });
  const [timeRange, setTimeRange] = useState('3m'); // 1m, 3m, 6m, 1y, all
  const [chartType, setChartType] = useState('line');
  const [selectedMetrics, setSelectedMetrics] = useState(['weight', 'bodyFat', 'muscle']);

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // Sample measurement data
    const sampleMeasurements = [
      {
        id: 1,
        date: '2024-01-01',
        weight: 78.0,
        bodyFat: 22,
        muscle: 35.5,
        chest: 102,
        waist: 86,
        hips: 95,
        arms: 32,
        thighs: 58,
        notes: 'Starting point'
      },
      {
        id: 2,
        date: '2024-01-08',
        weight: 77.5,
        bodyFat: 21.5,
        muscle: 35.8,
        chest: 102.5,
        waist: 85,
        hips: 94.5,
        arms: 32.2,
        thighs: 58.5,
        notes: 'Good progress first week'
      },
      {
        id: 3,
        date: '2024-01-15',
        weight: 76.8,
        bodyFat: 20.8,
        muscle: 36.2,
        chest: 103,
        waist: 84,
        hips: 94,
        arms: 32.5,
        thighs: 59,
        notes: 'Feeling stronger'
      }
    ];

    const sampleGoals = [
      {
        id: 1,
        title: 'Target Weight',
        target: 72,
        current: 76.8,
        unit: 'kg',
        deadline: '2024-06-01',
        category: 'weight',
        progress: 68
      },
      {
        id: 2,
        title: 'Body Fat',
        target: 15,
        current: 20.8,
        unit: '%',
        deadline: '2024-08-01',
        category: 'composition',
        progress: 45
      },
      {
        id: 3,
        title: 'Bench Press',
        target: 120,
        current: 100,
        unit: 'kg',
        deadline: '2024-05-01',
        category: 'strength',
        progress: 75
      }
    ];

    const sampleWorkouts = [
      {
        id: 1,
        date: '2024-01-15',
        name: 'Upper Body Strength',
        duration: 45,
        calories: 320,
        exercises: 8,
        volume: 4250 // kg
      },
      {
        id: 2,
        date: '2024-01-13',
        name: 'Lower Body Power',
        duration: 50,
        calories: 380,
        exercises: 6,
        volume: 5100
      },
      {
        id: 3,
        date: '2024-01-12',
        name: 'Cardio HIIT',
        duration: 30,
        calories: 250,
        exercises: 5,
        volume: 0
      }
    ];

    setMeasurements(sampleMeasurements);
    setGoals(sampleGoals);
    setWorkoutHistory(sampleWorkouts);
  };

  const handleAddMeasurement = () => {
    if (!newEntry.weight) return;
    
    const entry = {
      id: Date.now(),
      ...newEntry,
      weight: parseFloat(newEntry.weight),
      bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : null,
      muscle: newEntry.muscle ? parseFloat(newEntry.muscle) : null,
      chest: newEntry.chest ? parseFloat(newEntry.chest) : null,
      waist: newEntry.waist ? parseFloat(newEntry.waist) : null,
      hips: newEntry.hips ? parseFloat(newEntry.hips) : null,
      arms: newEntry.arms ? parseFloat(newEntry.arms) : null,
      thighs: newEntry.thighs ? parseFloat(newEntry.thighs) : null
    };
    
    setMeasurements(prev => [entry, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      bodyFat: '',
      muscle: '',
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: '',
      notes: ''
    });
    setShowAddModal(false);
  };

  const getWeightChartData = () => {
    const sortedData = measurements.sort((a, b) => new Date(a.date) - new Date(b.date));
    return {
      labels: sortedData.map(m => new Date(m.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Weight (kg)',
          data: sortedData.map(m => m.weight),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        }
      ]
    };
  };

  const getBodyCompositionData = () => {
    const latest = measurements[0];
    if (!latest || !latest.bodyFat || !latest.muscle) return null;
    
    const other = 100 - (latest.bodyFat + latest.muscle);
    return {
      labels: ['Muscle', 'Body Fat', 'Other'],
      datasets: [{
        data: [latest.muscle, latest.bodyFat, other],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 205, 86, 0.8)'
        ]
      }]
    };
  };

  const getGoalColor = (progress) => {
    if (progress >= 90) return 'success';
    if (progress >= 70) return 'info';
    if (progress >= 50) return 'warning';
    return 'danger';
  };

  const getTrendIcon = (current, previous) => {
    if (!previous) return <FaMinus className="text-muted" />;
    if (current > previous) return <FaArrowUp className="text-success" />;
    if (current < previous) return <FaArrowDown className="text-danger" />;
    return <FaMinus className="text-muted" />;
  };

  // Advanced Analytics Functions
  const getFilteredData = useMemo(() => {
    if (!measurements.length) return [];
    
    const now = new Date();
    let cutoffDate;
    
    switch (timeRange) {
      case '1m':
        cutoffDate = subMonths(now, 1);
        break;
      case '3m':
        cutoffDate = subMonths(now, 3);
        break;
      case '6m':
        cutoffDate = subMonths(now, 6);
        break;
      case '1y':
        cutoffDate = subMonths(now, 12);
        break;
      default:
        return measurements;
    }
    
    return measurements.filter(m => isAfter(parseISO(m.date), cutoffDate));
  }, [measurements, timeRange]);

  const getMultiMetricChartData = () => {
    const sortedData = getFilteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedData.map(m => format(parseISO(m.date), 'MMM dd'));
    
    const datasets = [];
    
    if (selectedMetrics.includes('weight')) {
      datasets.push({
        label: 'Weight (kg)',
        data: sortedData.map(m => m.weight),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        yAxisID: 'y',
        tension: 0.4
      });
    }
    
    if (selectedMetrics.includes('bodyFat')) {
      datasets.push({
        label: 'Body Fat (%)',
        data: sortedData.map(m => m.bodyFat),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        yAxisID: 'y1',
        tension: 0.4
      });
    }
    
    if (selectedMetrics.includes('muscle')) {
      datasets.push({
        label: 'Muscle Mass (%)',
        data: sortedData.map(m => m.muscle),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        yAxisID: 'y1',
        tension: 0.4
      });
    }
    
    return { labels, datasets };
  };

  const getBodyMeasurementsRadarData = () => {
    const latest = measurements[0];
    if (!latest) return null;
    
    return {
      labels: ['Chest', 'Waist', 'Hips', 'Arms', 'Thighs'],
      datasets: [{
        label: 'Current Measurements (cm)',
        data: [
          latest.chest || 0,
          latest.waist || 0,
          latest.hips || 0,
          latest.arms || 0,
          latest.thighs || 0
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }]
    };
  };

  const getWorkoutAnalytics = () => {
    if (!workoutHistory.length) return null;
    
    const totalWorkouts = workoutHistory.length;
    const totalDuration = workoutHistory.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workoutHistory.reduce((sum, w) => sum + w.calories, 0);
    const totalVolume = workoutHistory.reduce((sum, w) => sum + w.volume, 0);
    const avgDuration = Math.round(totalDuration / totalWorkouts);
    
    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      totalVolume,
      avgDuration
    };
  };

  const getWorkoutTrendsData = () => {
    const sortedWorkouts = workoutHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: sortedWorkouts.map(w => format(parseISO(w.date), 'MMM dd')),
      datasets: [
        {
          label: 'Duration (min)',
          data: sortedWorkouts.map(w => w.duration),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Calories',
          data: sortedWorkouts.map(w => w.calories),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    };
  };

  const getProgressInsights = () => {
    if (measurements.length < 2) return null;
    
    const latest = measurements[0];
    const previous = measurements[1];
    const oldest = measurements[measurements.length - 1];
    
    const insights = [];
    
    // Weight change analysis
    const weightChange = latest.weight - previous.weight;
    const totalWeightChange = latest.weight - oldest.weight;
    
    if (Math.abs(weightChange) > 0.5) {
      insights.push({
        type: weightChange > 0 ? 'increase' : 'decrease',
        metric: 'Weight',
        change: Math.abs(weightChange).toFixed(1),
        period: 'since last measurement',
        icon: weightChange > 0 ? FaArrowUp : FaArrowDown,
        color: weightChange > 0 ? 'danger' : 'success'
      });
    }
    
    // Body composition insights
    if (latest.bodyFat && previous.bodyFat) {
      const fatChange = latest.bodyFat - previous.bodyFat;
      if (Math.abs(fatChange) > 0.3) {
        insights.push({
          type: fatChange > 0 ? 'increase' : 'decrease',
          metric: 'Body Fat',
          change: Math.abs(fatChange).toFixed(1),
          period: 'since last measurement',
          icon: fatChange > 0 ? FaArrowUp : FaArrowDown,
          color: fatChange > 0 ? 'warning' : 'success'
        });
      }
    }
    
    // Overall progress insight
    const daysSinceStart = differenceInDays(parseISO(latest.date), parseISO(oldest.date));
    if (daysSinceStart > 7) {
      insights.push({
        type: 'info',
        metric: 'Journey Progress',
        change: daysSinceStart.toString(),
        period: 'days of tracking',
        icon: FaCalendar,
        color: 'info'
      });
    }
    
    return insights;
  };

  const renderOverview = () => {
    const latest = measurements[0];
    const previous = measurements[1];
    const workoutAnalytics = getWorkoutAnalytics();
    const insights = getProgressInsights();
    
    return (
      <>
        {/* Controls */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <FaFilter className="text-muted me-2" />
                      <span className="me-3">Time Range:</span>
                      <ButtonGroup size="sm">
                        {[
                          { key: '1m', label: '1M' },
                          { key: '3m', label: '3M' },
                          { key: '6m', label: '6M' },
                          { key: '1y', label: '1Y' },
                          { key: 'all', label: 'All' }
                        ].map(option => (
                          <Button
                            key={option.key}
                            variant={timeRange === option.key ? 'primary' : 'outline-primary'}
                            onClick={() => setTimeRange(option.key)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </ButtonGroup>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center justify-content-end">
                      <span className="me-3">Metrics:</span>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                          <FaCog className="me-2" />
                          Configure
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {[
                            { key: 'weight', label: 'Weight' },
                            { key: 'bodyFat', label: 'Body Fat' },
                            { key: 'muscle', label: 'Muscle Mass' }
                          ].map(metric => (
                            <Dropdown.Item
                              key={metric.key}
                              onClick={() => {
                                if (selectedMetrics.includes(metric.key)) {
                                  setSelectedMetrics(prev => prev.filter(m => m !== metric.key));
                                } else {
                                  setSelectedMetrics(prev => [...prev, metric.key]);
                                }
                              }}
                            >
                              <Form.Check
                                type="checkbox"
                                checked={selectedMetrics.includes(metric.key)}
                                label={metric.label}
                                readOnly
                              />
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="text-primary mb-2">
                  <FaWeight size={24} />
                </div>
                <h4 className="mb-1">{latest?.weight || 0} kg</h4>
                <p className="text-muted mb-1">Current Weight</p>
                {getTrendIcon(latest?.weight, previous?.weight)}
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="text-warning mb-2">
                  <FaHeart size={24} />
                </div>
                <h4 className="mb-1">{latest?.bodyFat || 0}%</h4>
                <p className="text-muted mb-1">Body Fat</p>
                {getTrendIcon(latest?.bodyFat, previous?.bodyFat)}
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="text-info mb-2">
                  <FaDumbbell size={24} />
                </div>
                <h4 className="mb-1">{latest?.muscle || 0}%</h4>
                <p className="text-muted mb-1">Muscle Mass</p>
                {getTrendIcon(latest?.muscle, previous?.muscle)}
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="text-success mb-2">
                  <FaBullseye size={24} />
                </div>
                <h4 className="mb-1">{goals.filter(g => g.progress >= 90).length}</h4>
                <p className="text-muted mb-1">Goals Achieved</p>
                <small className="text-muted">of {goals.length} total</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Enhanced Charts Row */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Progress Trends</h5>
                <ButtonGroup size="sm">
                  <Button
                    variant={chartType === 'line' ? 'primary' : 'outline-primary'}
                    onClick={() => setChartType('line')}
                  >
                    <FaChartLine />
                  </Button>
                  <Button
                    variant={chartType === 'bar' ? 'primary' : 'outline-primary'}
                    onClick={() => setChartType('bar')}
                  >
                    <FaChartBar />
                  </Button>
                </ButtonGroup>
              </Card.Header>
              <Card.Body>
                {getFilteredData.length > 0 ? (
                  chartType === 'line' ? (
                    <Line
                      data={getMultiMetricChartData()}
                      options={{
                        responsive: true,
                        interaction: {
                          mode: 'index',
                          intersect: false,
                        },
                        scales: {
                          y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                              display: true,
                              text: 'Weight (kg)'
                            }
                          },
                          y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                              display: true,
                              text: 'Percentage (%)'
                            },
                            grid: {
                              drawOnChartArea: false,
                            },
                          },
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            mode: 'index',
                            intersect: false,
                          }
                        }
                      }}
                      height={80}
                    />
                  ) : (
                    <Bar
                      data={getMultiMetricChartData()}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                      height={80}
                    />
                  )
                ) : (
                  <div className="text-center text-muted py-4">
                    <FaChartLine size={32} className="mb-3" />
                    <p>Add measurements to see progress trends</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Row>
              <Col lg={12} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h6 className="mb-0">Body Measurements</h6>
                  </Card.Header>
                  <Card.Body>
                    {getBodyMeasurementsRadarData() ? (
                      <Radar
                        data={getBodyMeasurementsRadarData()}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              display: false
                            }
                          },
                          scales: {
                            r: {
                              beginAtZero: true
                            }
                          }
                        }}
                        height={120}
                      />
                    ) : (
                      <div className="text-center text-muted py-3">
                        <FaRuler size={24} className="mb-2" />
                        <p className="small mb-0">Add body measurements</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h6 className="mb-0">Body Composition</h6>
                  </Card.Header>
                  <Card.Body>
                    {getBodyCompositionData() ? (
                      <Doughnut
                        data={getBodyCompositionData()}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { position: 'bottom' }
                          }
                        }}
                        height={120}
                      />
                    ) : (
                      <div className="text-center text-muted py-3">
                        <FaHeart size={24} className="mb-2" />
                        <p className="small mb-0">Add body composition data</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Insights and Analytics */}
        <Row className="mb-4">
          <Col lg={6}>
            {/* Progress Insights */}
            <Card className="border-0 shadow-sm h-100">
              <Card.Header>
                <h5 className="mb-0"><FaCalculator className="me-2" />Progress Insights</h5>
              </Card.Header>
              <Card.Body>
                {insights && insights.length > 0 ? (
                  insights.map((insight, index) => {
                    const IconComponent = insight.icon;
                    return (
                      <Alert key={index} variant={insight.color} className="mb-2">
                        <div className="d-flex align-items-center">
                          <IconComponent className="me-2" />
                          <div>
                            <strong>{insight.metric} {insight.type}:</strong> {insight.change} {insight.period}
                          </div>
                        </div>
                      </Alert>
                    );
                  })
                ) : (
                  <div className="text-center text-muted py-4">
                    <FaInfoCircle size={32} className="mb-3" />
                    <p>Track more measurements to see insights</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            {/* Workout Analytics */}
            <Card className="border-0 shadow-sm h-100">
              <Card.Header>
                <h5 className="mb-0"><FaFire className="me-2" />Workout Statistics</h5>
              </Card.Header>
              <Card.Body>
                {workoutAnalytics ? (
                  <Row>
                    <Col sm={6} className="mb-3">
                      <div className="text-center p-2 border rounded">
                        <h4 className="text-primary mb-1">{workoutAnalytics.totalWorkouts}</h4>
                        <small className="text-muted">Total Workouts</small>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="text-center p-2 border rounded">
                        <h4 className="text-success mb-1">{workoutAnalytics.avgDuration}</h4>
                        <small className="text-muted">Avg Duration (min)</small>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="text-center p-2 border rounded">
                        <h4 className="text-warning mb-1">{workoutAnalytics.totalCalories}</h4>
                        <small className="text-muted">Total Calories</small>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="text-center p-2 border rounded">
                        <h4 className="text-info mb-1">{workoutAnalytics.totalVolume}</h4>
                        <small className="text-muted">Total Volume (kg)</small>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <div className="text-center text-muted py-4">
                    <FaDumbbell size={32} className="mb-3" />
                    <p>Complete workouts to see analytics</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Goals Progress */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Goals Progress</h5>
                <div>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <FaDownload className="me-2" />
                    Export Report
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <FaPlus className="me-2" />
                    Add Goal
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {goals.map(goal => (
                  <div key={goal.id} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold">{goal.title}</span>
                      <span>{goal.current} / {goal.target} {goal.unit}</span>
                    </div>
                    <ProgressBar
                      now={goal.progress}
                      variant={getGoalColor(goal.progress)}
                      className="mb-1"
                    />
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">{goal.progress}% complete</small>
                      <small className="text-muted">Due: {new Date(goal.deadline).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const renderMeasurements = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Body Measurements</h3>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FaPlus className="me-2" />
          Add Measurement
        </Button>
      </div>
      
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Body Fat</th>
                  <th>Muscle</th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Arms</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((measurement) => (
                  <tr key={measurement.id}>
                    <td>{new Date(measurement.date).toLocaleDateString()}</td>
                    <td>{measurement.weight} kg</td>
                    <td>{measurement.bodyFat ? `${measurement.bodyFat}%` : '-'}</td>
                    <td>{measurement.muscle ? `${measurement.muscle}%` : '-'}</td>
                    <td>{measurement.chest ? `${measurement.chest} cm` : '-'}</td>
                    <td>{measurement.waist ? `${measurement.waist} cm` : '-'}</td>
                    <td>{measurement.arms ? `${measurement.arms} cm` : '-'}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {measurements.length === 0 && (
            <div className="text-center text-muted py-5">
              <FaRuler size={48} className="mb-3" />
              <h5>No measurements recorded</h5>
              <p>Add your first measurement to start tracking progress</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );

  const renderWorkouts = () => (
    <>
      <h3 className="mb-4">Workout History</h3>
      <Row>
        {workoutHistory.map((workout) => (
          <Col key={workout.id} md={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6 className="mb-0">{workout.name}</h6>
                  <Badge bg="primary">{workout.exercises} exercises</Badge>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Date:</span>
                    <span>{new Date(workout.date).toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Duration:</span>
                    <span>{workout.duration} min</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Calories:</span>
                    <span>{workout.calories} cal</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Volume:</span>
                    <span>{workout.volume} kg</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

  const renderPhotos = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Progress Photos</h3>
        <Button variant="primary" onClick={() => setShowPhotoModal(true)}>
          <FaCamera className="me-2" />
          Add Photo
        </Button>
      </div>
      
      {bodyPhotos.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <FaCamera size={48} className="text-muted mb-3" />
            <h5 className="text-muted">No progress photos yet</h5>
            <p className="text-muted mb-4">Visual progress tracking is a powerful motivator</p>
            <Button variant="primary" onClick={() => setShowPhotoModal(true)}>
              <FaCamera className="me-2" />
              Take Your First Photo
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {bodyPhotos.map((photo, index) => (
            <Col key={index} md={3} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Img variant="top" src={photo.url} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <small className="text-muted">{photo.date}</small>
                  <p className="mb-0">{photo.notes}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
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
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 mb-1">Progress Tracker</h1>
                <p className="text-muted mb-0">
                  Monitor your fitness journey with detailed measurements and analytics
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={setActiveTab}
          className="mb-4"
        >
          <Tab eventKey="overview" title="Overview">
            {renderOverview()}
          </Tab>
          <Tab eventKey="measurements" title="Measurements">
            {renderMeasurements()}
          </Tab>
          <Tab eventKey="workouts" title="Workout History">
            {renderWorkouts()}
          </Tab>
          <Tab eventKey="photos" title="Progress Photos">
            {renderPhotos()}
          </Tab>
        </Tabs>
      </motion.div>

      {/* Add Measurement Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Measurement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weight (kg) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="70.5"
                    value={newEntry.weight}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Body Fat (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="18.5"
                    value={newEntry.bodyFat}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, bodyFat: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Muscle Mass (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="35.2"
                    value={newEntry.muscle}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, muscle: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Chest (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="102"
                    value={newEntry.chest}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, chest: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Waist (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="85"
                    value={newEntry.waist}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, waist: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Hips (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="95"
                    value={newEntry.hips}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, hips: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Arms (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="32"
                    value={newEntry.arms}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, arms: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thighs (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="58"
                    value={newEntry.thighs}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, thighs: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Any notes about this measurement..."
                value={newEntry.notes}
                onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddMeasurement}>
            <FaSave className="me-2" />
            Save Measurement
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Photo Modal */}
      <Modal show={showPhotoModal} onHide={() => setShowPhotoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Progress Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>Tip:</strong> Take photos in consistent lighting and poses for best comparison
          </Alert>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Photo Upload</Form.Label>
              <Form.Control type="file" accept="image/*" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="How are you feeling? What changes do you notice?"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPhotoModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            <FaSave className="me-2" />
            Save Photo
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProgressTracker;


