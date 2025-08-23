import { useState, useEffect, useCallback } from 'react';
import FirestoreService from '../services/FirestoreService';

/**
 * Custom hooks for Firebase Firestore operations
 * Provides easy-to-use React hooks for data operations
 */

// Hook for managing measurements data
export const useMeasurements = (userId) => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeasurements = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await FirestoreService.getUserMeasurements(userId);
      if (result.success) {
        setMeasurements(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addMeasurement = useCallback(async (measurementData) => {
    try {
      const result = await FirestoreService.addMeasurement(userId, measurementData);
      if (result.success) {
        await fetchMeasurements(); // Refresh data
        return result;
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [userId, fetchMeasurements]);

  const updateMeasurement = useCallback(async (measurementId, updateData) => {
    try {
      const result = await FirestoreService.updateMeasurement(measurementId, updateData);
      if (result.success) {
        await fetchMeasurements(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchMeasurements]);

  const deleteMeasurement = useCallback(async (measurementId) => {
    try {
      const result = await FirestoreService.deleteMeasurement(measurementId);
      if (result.success) {
        await fetchMeasurements(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchMeasurements]);

  useEffect(() => {
    fetchMeasurements();
  }, [fetchMeasurements]);

  return {
    measurements,
    loading,
    error,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    refresh: fetchMeasurements
  };
};

// Hook for real-time measurements updates
export const useMeasurementsRealtime = (userId) => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const unsubscribe = FirestoreService.listenToMeasurements(
      userId,
      (data) => {
        setMeasurements(data);
        setLoading(false);
      },
      { orderByField: 'date', orderDirection: 'desc' }
    );

    if (!unsubscribe) {
      setError('Failed to set up real-time listener');
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);

  return { measurements, loading, error };
};

// Hook for managing workouts data
export const useWorkouts = (userId) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await FirestoreService.getUserWorkouts(userId);
      if (result.success) {
        setWorkouts(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addWorkout = useCallback(async (workoutData) => {
    try {
      const result = await FirestoreService.addWorkout(userId, workoutData);
      if (result.success) {
        await fetchWorkouts(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [userId, fetchWorkouts]);

  const updateWorkout = useCallback(async (workoutId, updateData) => {
    try {
      const result = await FirestoreService.updateWorkout(workoutId, updateData);
      if (result.success) {
        await fetchWorkouts(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchWorkouts]);

  const deleteWorkout = useCallback(async (workoutId) => {
    try {
      const result = await FirestoreService.deleteWorkout(workoutId);
      if (result.success) {
        await fetchWorkouts(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchWorkouts]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return {
    workouts,
    loading,
    error,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    refresh: fetchWorkouts
  };
};

// Hook for managing goals data
export const useGoals = (userId, status = 'active') => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await FirestoreService.getUserGoals(userId, status);
      if (result.success) {
        setGoals(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, status]);

  const addGoal = useCallback(async (goalData) => {
    try {
      const result = await FirestoreService.addGoal(userId, goalData);
      if (result.success) {
        await fetchGoals(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [userId, fetchGoals]);

  const updateGoal = useCallback(async (goalId, updateData) => {
    try {
      const result = await FirestoreService.updateGoal(goalId, updateData);
      if (result.success) {
        await fetchGoals(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchGoals]);

  const deleteGoal = useCallback(async (goalId) => {
    try {
      const result = await FirestoreService.deleteGoal(goalId);
      if (result.success) {
        await fetchGoals(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchGoals]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    refresh: fetchGoals
  };
};

// Hook for managing progress photos
export const useProgressPhotos = (userId) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPhotos = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await FirestoreService.getUserProgressPhotos(userId);
      if (result.success) {
        setPhotos(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addPhoto = useCallback(async (photoData) => {
    try {
      const result = await FirestoreService.addProgressPhoto(userId, photoData);
      if (result.success) {
        await fetchPhotos(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [userId, fetchPhotos]);

  const deletePhoto = useCallback(async (photoId) => {
    try {
      const result = await FirestoreService.deleteProgressPhoto(photoId);
      if (result.success) {
        await fetchPhotos(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchPhotos]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return {
    photos,
    loading,
    error,
    addPhoto,
    deletePhoto,
    refresh: fetchPhotos
  };
};

// Hook for user statistics
export const useUserStatistics = (userId) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await FirestoreService.getUserStatistics(userId);
      if (result.success) {
        setStatistics(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refresh: fetchStatistics
  };
};

// Hook for user profile
export const useUserProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await FirestoreService.getUserProfile(userId);
      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveProfile = useCallback(async (profileData) => {
    try {
      const result = await FirestoreService.saveUserProfile(userId, profileData);
      if (result.success) {
        await fetchProfile(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [userId, fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    saveProfile,
    refresh: fetchProfile
  };
};

// Hook for nutrition logs
export const useNutritionLogs = (userId) => {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNutritionLogs = useCallback(async (options = {}) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await FirestoreService.getUserNutritionLogs(userId, options);
      if (result.success) {
        setNutritionLogs(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addNutritionLog = useCallback(async (nutritionData) => {
    try {
      const result = await FirestoreService.addNutritionLog(userId, nutritionData);
      if (result.success) {
        await fetchNutritionLogs(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [userId, fetchNutritionLogs]);

  useEffect(() => {
    fetchNutritionLogs();
  }, [fetchNutritionLogs]);

  return {
    nutritionLogs,
    loading,
    error,
    addNutritionLog,
    refresh: fetchNutritionLogs
  };
};

// Hook for recommendations
export const useRecommendations = (userId) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await FirestoreService.getUserRecommendations(userId);
      if (result.success) {
        setRecommendations(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveRecommendations = useCallback(async (recommendationData) => {
    try {
      const result = await FirestoreService.saveRecommendations(userId, recommendationData);
      if (result.success) {
        await fetchRecommendations(); // Refresh data
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [userId, fetchRecommendations]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    saveRecommendations,
    refresh: fetchRecommendations
  };
};

// General data fetching hook with caching
export const useFirestoreData = (collection, query, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // This would need to be implemented based on specific query requirements
        // For now, it's a placeholder for future generic query functionality
        setData(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};
