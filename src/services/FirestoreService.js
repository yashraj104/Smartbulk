import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Comprehensive Firestore Service for SmartBulk App
 * Handles all data persistence operations for users, measurements, workouts, goals, etc.
 */
class FirestoreService {
  // Collection names
  static COLLECTIONS = {
    USERS: 'users',
    MEASUREMENTS: 'measurements',
    WORKOUTS: 'workouts',
    GOALS: 'goals',
    PROGRESS_PHOTOS: 'progressPhotos',
    EXERCISES: 'exercises',
    NUTRITION_LOGS: 'nutritionLogs',
    RECOMMENDATIONS: 'recommendations',
    FEEDBACK: 'feedback',
    COMMUNITY_POSTS: 'communityPosts',
    TRAINERS: 'trainers',
    USER_DIET_PLANS: 'userDietPlans',
    USER_WORKOUT_PLANS: 'userWorkoutPlans',
    USER_PROGRESS: 'userProgress'
  };

  // ==================== USER PROFILE OPERATIONS ====================

  /**
   * Create or update user profile
   */
  static async saveUserProfile(userId, profileData) {
    try {
      const userRef = doc(db, this.COLLECTIONS.USERS, userId);
      const updateData = {
        ...profileData,
        updatedAt: serverTimestamp(),
        ...(profileData.createdAt ? {} : { createdAt: serverTimestamp() })
      };
      
      await setDoc(userRef, updateData, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error saving user profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId) {
    try {
      const userRef = doc(db, this.COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== MEASUREMENTS OPERATIONS ====================

  /**
   * Add new measurement
   */
  static async addMeasurement(userId, measurementData) {
    try {
      const measurementsRef = collection(db, this.COLLECTIONS.MEASUREMENTS);
      const measurement = {
        userId,
        ...measurementData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(measurementsRef, measurement);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding measurement:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update measurement
   */
  static async updateMeasurement(measurementId, updateData) {
    try {
      const measurementRef = doc(db, this.COLLECTIONS.MEASUREMENTS, measurementId);
      await updateDoc(measurementRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating measurement:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete measurement
   */
  static async deleteMeasurement(measurementId) {
    try {
      await deleteDoc(doc(db, this.COLLECTIONS.MEASUREMENTS, measurementId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting measurement:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user measurements with pagination and filtering
   */
  static async getUserMeasurements(userId, options = {}) {
    try {
      const { 
        limitCount = 50, 
        orderByField = 'date', 
        orderDirection = 'desc',
        startDate = null,
        endDate = null
      } = options;

      let q = query(
        collection(db, this.COLLECTIONS.MEASUREMENTS),
        where('userId', '==', userId),
        orderBy(orderByField, orderDirection),
        limit(limitCount)
      );

      // Add date filtering if provided
      if (startDate) {
        q = query(q, where('date', '>=', startDate));
      }
      if (endDate) {
        q = query(q, where('date', '<=', endDate));
      }

      const querySnapshot = await getDocs(q);
      const measurements = [];
      
      querySnapshot.forEach((doc) => {
        measurements.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: measurements };
    } catch (error) {
      console.error('Error getting measurements:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Listen to measurements changes in real-time
   */
  static listenToMeasurements(userId, callback, options = {}) {
    try {
      const { orderByField = 'date', orderDirection = 'desc' } = options;
      
      const q = query(
        collection(db, this.COLLECTIONS.MEASUREMENTS),
        where('userId', '==', userId),
        orderBy(orderByField, orderDirection)
      );

      return onSnapshot(q, (querySnapshot) => {
        const measurements = [];
        querySnapshot.forEach((doc) => {
          measurements.push({
            id: doc.id,
            ...doc.data()
          });
        });
        callback(measurements);
      });
    } catch (error) {
      console.error('Error listening to measurements:', error);
      return null;
    }
  }

  // ==================== WORKOUT OPERATIONS ====================

  /**
   * Add new workout
   */
  static async addWorkout(userId, workoutData) {
    try {
      const workoutsRef = collection(db, this.COLLECTIONS.WORKOUTS);
      const workout = {
        userId,
        ...workoutData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(workoutsRef, workout);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding workout:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update workout
   */
  static async updateWorkout(workoutId, updateData) {
    try {
      const workoutRef = doc(db, this.COLLECTIONS.WORKOUTS, workoutId);
      await updateDoc(workoutRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating workout:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete workout
   */
  static async deleteWorkout(workoutId) {
    try {
      await deleteDoc(doc(db, this.COLLECTIONS.WORKOUTS, workoutId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting workout:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user workouts
   */
  static async getUserWorkouts(userId, options = {}) {
    try {
      const { 
        limitCount = 50, 
        orderByField = 'date', 
        orderDirection = 'desc'
      } = options;

      const q = query(
        collection(db, this.COLLECTIONS.WORKOUTS),
        where('userId', '==', userId),
        orderBy(orderByField, orderDirection),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const workouts = [];
      
      querySnapshot.forEach((doc) => {
        workouts.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: workouts };
    } catch (error) {
      console.error('Error getting workouts:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== GOALS OPERATIONS ====================

  /**
   * Add new goal
   */
  static async addGoal(userId, goalData) {
    try {
      const goalsRef = collection(db, this.COLLECTIONS.GOALS);
      const goal = {
        userId,
        ...goalData,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(goalsRef, goal);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding goal:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update goal
   */
  static async updateGoal(goalId, updateData) {
    try {
      const goalRef = doc(db, this.COLLECTIONS.GOALS, goalId);
      await updateDoc(goalRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating goal:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete goal
   */
  static async deleteGoal(goalId) {
    try {
      await deleteDoc(doc(db, this.COLLECTIONS.GOALS, goalId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting goal:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user goals
   */
  static async getUserGoals(userId, status = 'active') {
    try {
      let q = query(
        collection(db, this.COLLECTIONS.GOALS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      if (status !== 'all') {
        q = query(q, where('status', '==', status));
      }

      const querySnapshot = await getDocs(q);
      const goals = [];
      
      querySnapshot.forEach((doc) => {
        goals.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: goals };
    } catch (error) {
      console.error('Error getting goals:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== PROGRESS PHOTOS OPERATIONS ====================

  /**
   * Add progress photo
   */
  static async addProgressPhoto(userId, photoData) {
    try {
      const photosRef = collection(db, this.COLLECTIONS.PROGRESS_PHOTOS);
      const photo = {
        userId,
        ...photoData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(photosRef, photo);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding progress photo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user progress photos
   */
  static async getUserProgressPhotos(userId) {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.PROGRESS_PHOTOS),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const photos = [];
      
      querySnapshot.forEach((doc) => {
        photos.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: photos };
    } catch (error) {
      console.error('Error getting progress photos:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete progress photo
   */
  static async deleteProgressPhoto(photoId) {
    try {
      await deleteDoc(doc(db, this.COLLECTIONS.PROGRESS_PHOTOS, photoId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting progress photo:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== NUTRITION LOGS OPERATIONS ====================

  /**
   * Add nutrition log entry
   */
  static async addNutritionLog(userId, nutritionData) {
    try {
      const nutritionRef = collection(db, this.COLLECTIONS.NUTRITION_LOGS);
      const nutrition = {
        userId,
        ...nutritionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(nutritionRef, nutrition);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding nutrition log:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user nutrition logs
   */
  static async getUserNutritionLogs(userId, options = {}) {
    try {
      const { 
        limitCount = 50, 
        startDate = null,
        endDate = null
      } = options;

      let q = query(
        collection(db, this.COLLECTIONS.NUTRITION_LOGS),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );

      if (startDate) {
        q = query(q, where('date', '>=', startDate));
      }
      if (endDate) {
        q = query(q, where('date', '<=', endDate));
      }

      const querySnapshot = await getDocs(q);
      const logs = [];
      
      querySnapshot.forEach((doc) => {
        logs.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: logs };
    } catch (error) {
      console.error('Error getting nutrition logs:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== RECOMMENDATIONS OPERATIONS ====================

  /**
   * Save user recommendations
   */
  static async saveRecommendations(userId, recommendationData) {
    try {
      const recommendationRef = doc(db, this.COLLECTIONS.RECOMMENDATIONS, userId);
      const data = {
        userId,
        ...recommendationData,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };
      
      await setDoc(recommendationRef, data, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error saving recommendations:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user recommendations
   */
  static async getUserRecommendations(userId) {
    try {
      const recommendationRef = doc(db, this.COLLECTIONS.RECOMMENDATIONS, userId);
      const recommendationSnap = await getDoc(recommendationRef);
      
      if (recommendationSnap.exists()) {
        return { success: true, data: recommendationSnap.data() };
      } else {
        return { success: false, error: 'Recommendations not found' };
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== BATCH OPERATIONS ====================

  /**
   * Batch write multiple operations
   */
  static async batchWrite(operations) {
    try {
      const batch = writeBatch(db);
      
      operations.forEach(operation => {
        const { type, collection: collectionName, docId, data } = operation;
        const docRef = doc(db, collectionName, docId);
        
        switch (type) {
          case 'set':
            batch.set(docRef, { ...data, updatedAt: serverTimestamp() });
            break;
          case 'update':
            batch.update(docRef, { ...data, updatedAt: serverTimestamp() });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
          default:
            throw new Error(`Invalid batch operation type: ${type}`);
        }
      });

      await batch.commit();
      return { success: true };
    } catch (error) {
      console.error('Error in batch write:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Get user statistics
   */
  static async getUserStatistics(userId) {
    try {
      const [measurements, workouts, goals] = await Promise.all([
        this.getUserMeasurements(userId, { limitCount: 1000 }),
        this.getUserWorkouts(userId, { limitCount: 1000 }),
        this.getUserGoals(userId, 'all')
      ]);

      const stats = {
        totalMeasurements: measurements.data?.length || 0,
        totalWorkouts: workouts.data?.length || 0,
        totalGoals: goals.data?.length || 0,
        completedGoals: goals.data?.filter(g => g.status === 'completed').length || 0,
        activeGoals: goals.data?.filter(g => g.status === 'active').length || 0
      };

      // Calculate workout statistics
      if (workouts.data && workouts.data.length > 0) {
        const totalDuration = workouts.data.reduce((sum, w) => sum + (w.duration || 0), 0);
        const totalCalories = workouts.data.reduce((sum, w) => sum + (w.calories || 0), 0);
        const totalVolume = workouts.data.reduce((sum, w) => sum + (w.volume || 0), 0);
        
        stats.totalWorkoutDuration = totalDuration;
        stats.totalCaloriesBurned = totalCalories;
        stats.totalVolume = totalVolume;
        stats.averageWorkoutDuration = Math.round(totalDuration / workouts.data.length);
      }

      // Calculate measurement trends
      if (measurements.data && measurements.data.length > 1) {
        const latest = measurements.data[0];
        const previous = measurements.data[1];
        
        stats.weightTrend = latest.weight - previous.weight;
        if (latest.bodyFat && previous.bodyFat) {
          stats.bodyFatTrend = latest.bodyFat - previous.bodyFat;
        }
        if (latest.muscle && previous.muscle) {
          stats.muscleTrend = latest.muscle - previous.muscle;
        }
      }

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting user statistics:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Search across multiple collections
   */
  static async searchUserData(userId, searchTerm, collections = []) {
    try {
      const results = {};
      const searchPromises = [];

      if (collections.includes('workouts') || collections.length === 0) {
        searchPromises.push(
          this.getUserWorkouts(userId).then(result => {
            if (result.success) {
              results.workouts = result.data.filter(workout => 
                workout.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                workout.notes?.toLowerCase().includes(searchTerm.toLowerCase())
              );
            }
          })
        );
      }

      if (collections.includes('goals') || collections.length === 0) {
        searchPromises.push(
          this.getUserGoals(userId, 'all').then(result => {
            if (result.success) {
              results.goals = result.data.filter(goal => 
                goal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                goal.description?.toLowerCase().includes(searchTerm.toLowerCase())
              );
            }
          })
        );
      }

      await Promise.all(searchPromises);
      return { success: true, data: results };
    } catch (error) {
      console.error('Error searching user data:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== FEEDBACK OPERATIONS ====================

  /**
   * Submit user feedback
   */
  static async submitFeedback(userId, feedbackData) {
    try {
      const feedbackRef = collection(db, this.COLLECTIONS.FEEDBACK);
      const feedback = {
        userId,
        ...feedbackData,
        status: 'new',
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(feedbackRef, feedback);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== COMMUNITY POSTS OPERATIONS ====================

  /**
   * Create a new community post
   */
  static async createCommunityPost(userId, postData) {
    try {
      const postsRef = collection(db, this.COLLECTIONS.COMMUNITY_POSTS);
      const post = {
        userId,
        ...postData,
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(postsRef, post);
      return { success: true, id: docRef.id, data: { ...post, id: docRef.id } };
    } catch (error) {
      console.error('Error creating community post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all community posts
   */
  static async getCommunityPosts(options = {}) {
    try {
      const { 
        limitCount = 50, 
        orderByField = 'createdAt', 
        orderDirection = 'desc'
      } = options;

      const q = query(
        collection(db, this.COLLECTIONS.COMMUNITY_POSTS),
        orderBy(orderByField, orderDirection),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: posts };
    } catch (error) {
      console.error('Error getting community posts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update post likes/comments/shares
   */
  static async updatePostInteraction(postId, interactionType, increment = 1) {
    try {
      const postRef = doc(db, this.COLLECTIONS.COMMUNITY_POSTS, postId);
      const updateData = { updatedAt: serverTimestamp() };
      updateData[interactionType] = increment;
      
      await updateDoc(postRef, updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating post interaction:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Listen to community posts in real-time
   */
  static listenToCommunityPosts(callback, options = {}) {
    try {
      const { orderByField = 'createdAt', orderDirection = 'desc' } = options;
      
      const q = query(
        collection(db, this.COLLECTIONS.COMMUNITY_POSTS),
        orderBy(orderByField, orderDirection)
      );

      return onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({
            id: doc.id,
            ...doc.data()
          });
        });
        callback(posts);
      });
    } catch (error) {
      console.error('Error listening to community posts:', error);
      return null;
    }
  }

  // ==================== TRAINERS OPERATIONS ====================

  /**
   * Register a new trainer
   */
  static async registerTrainer(userId, trainerData) {
    try {
      const trainersRef = collection(db, this.COLLECTIONS.TRAINERS);
      const trainer = {
        userId,
        ...trainerData,
        status: 'pending',
        rating: 0,
        totalReviews: 0,
        totalSessions: 0,
        isVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(trainersRef, trainer);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error registering trainer:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all trainers
   */
  static async getTrainers(options = {}) {
    try {
      const { 
        limitCount = 50, 
        status = 'approved',
        specialization = null,
        location = null
      } = options;

      let q = query(
        collection(db, this.COLLECTIONS.TRAINERS),
        where('status', '==', status),
        orderBy('rating', 'desc'),
        limit(limitCount)
      );

      if (specialization) {
        q = query(q, where('specialization', '==', specialization));
      }

      if (location) {
        q = query(q, where('location', '==', location));
      }

      const querySnapshot = await getDocs(q);
      const trainers = [];
      
      querySnapshot.forEach((doc) => {
        trainers.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: trainers };
    } catch (error) {
      console.error('Error getting trainers:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update trainer profile
   */
  static async updateTrainer(trainerId, updateData) {
    try {
      const trainerRef = doc(db, this.COLLECTIONS.TRAINERS, trainerId);
      await updateDoc(trainerRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating trainer:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== USER DIET PLANS OPERATIONS ====================

  /**
   * Save user diet plan
   */
  static async saveUserDietPlan(userId, dietPlanData) {
    try {
      const dietPlansRef = collection(db, this.COLLECTIONS.USER_DIET_PLANS);
      const dietPlan = {
        userId,
        ...dietPlanData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(dietPlansRef, dietPlan);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving user diet plan:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user diet plans
   */
  static async getUserDietPlans(userId) {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.USER_DIET_PLANS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const dietPlans = [];
      
      querySnapshot.forEach((doc) => {
        dietPlans.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: dietPlans };
    } catch (error) {
      console.error('Error getting user diet plans:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== USER WORKOUT PLANS OPERATIONS ====================

  /**
   * Save user workout plan
   */
  static async saveUserWorkoutPlan(userId, workoutPlanData) {
    try {
      const workoutPlansRef = collection(db, this.COLLECTIONS.USER_WORKOUT_PLANS);
      const workoutPlan = {
        userId,
        ...workoutPlanData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(workoutPlansRef, workoutPlan);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving user workout plan:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user workout plans
   */
  static async getUserWorkoutPlans(userId) {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.USER_WORKOUT_PLANS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const workoutPlans = [];
      
      querySnapshot.forEach((doc) => {
        workoutPlans.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: workoutPlans };
    } catch (error) {
      console.error('Error getting user workout plans:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== USER PROGRESS OPERATIONS ====================

  /**
   * Save user progress data
   */
  static async saveUserProgress(userId, progressData) {
    try {
      const progressRef = doc(db, this.COLLECTIONS.USER_PROGRESS, userId);
      const data = {
        userId,
        ...progressData,
        updatedAt: serverTimestamp(),
        ...(progressData.createdAt ? {} : { createdAt: serverTimestamp() })
      };
      
      await setDoc(progressRef, data, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error saving user progress:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user progress data
   */
  static async getUserProgress(userId) {
    try {
      const progressRef = doc(db, this.COLLECTIONS.USER_PROGRESS, userId);
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        return { success: true, data: progressSnap.data() };
      } else {
        return { success: false, error: 'Progress data not found' };
      }
    } catch (error) {
      console.error('Error getting user progress:', error);
      return { success: false, error: error.message };
    }
  }
}

export default FirestoreService;
