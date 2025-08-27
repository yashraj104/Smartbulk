/**
 * Test script to verify Firebase operations
 * Run this with: node src/test-firebase.js
 */

import FirestoreService from './services/FirestoreService.js';

// Mock user ID for testing
const TEST_USER_ID = 'test-user-123';

async function testFirestoreOperations() {
  console.log('🚀 Starting Firebase Operations Test...\n');

  try {
    // Test 1: Save user profile
    console.log('1️⃣ Testing user profile operations...');
    const profileResult = await FirestoreService.saveUserProfile(TEST_USER_ID, {
      displayName: 'Test User',
      weight: 75,
      height: 180,
      fitnessGoal: 'weight_loss',
      activityLevel: 'moderate'
    });
    
    if (profileResult.success) {
      console.log('✅ User profile saved successfully');
    } else {
      console.log('❌ Failed to save user profile:', profileResult.error);
    }

    // Test 2: Get user profile
    const getProfileResult = await FirestoreService.getUserProfile(TEST_USER_ID);
    if (getProfileResult.success) {
      console.log('✅ User profile retrieved successfully');
      console.log('   Data:', getProfileResult.data);
    } else {
      console.log('❌ Failed to retrieve user profile:', getProfileResult.error);
    }

    // Test 3: Save diet plan
    console.log('\n2️⃣ Testing diet plan operations...');
    const dietPlanResult = await FirestoreService.saveUserDietPlan(TEST_USER_ID, {
      planName: 'Test Diet Plan',
      totalCalories: 2000,
      meals: [
        {
          type: 'breakfast',
          foods: ['oatmeal', 'banana', 'protein powder'],
          calories: 450
        },
        {
          type: 'lunch',
          foods: ['chicken breast', 'rice', 'vegetables'],
          calories: 550
        }
      ],
      macros: {
        protein: 150,
        carbs: 200,
        fat: 70
      }
    });

    if (dietPlanResult.success) {
      console.log('✅ Diet plan saved successfully');
      console.log('   Plan ID:', dietPlanResult.id);
    } else {
      console.log('❌ Failed to save diet plan:', dietPlanResult.error);
    }

    // Test 4: Get user diet plans
    const getDietPlansResult = await FirestoreService.getUserDietPlans(TEST_USER_ID);
    if (getDietPlansResult.success) {
      console.log('✅ Diet plans retrieved successfully');
      console.log('   Number of plans:', getDietPlansResult.data.length);
    } else {
      console.log('❌ Failed to retrieve diet plans:', getDietPlansResult.error);
    }

    // Test 5: Save workout plan
    console.log('\n3️⃣ Testing workout plan operations...');
    const workoutPlanResult = await FirestoreService.saveUserWorkoutPlan(TEST_USER_ID, {
      planName: 'Upper Body Strength',
      exercises: [
        {
          name: 'Bench Press',
          sets: 3,
          reps: 10,
          weight: 60
        },
        {
          name: 'Pull-ups',
          sets: 3,
          reps: 8,
          weight: 0
        }
      ],
      duration: 45,
      difficulty: 'intermediate'
    });

    if (workoutPlanResult.success) {
      console.log('✅ Workout plan saved successfully');
      console.log('   Plan ID:', workoutPlanResult.id);
    } else {
      console.log('❌ Failed to save workout plan:', workoutPlanResult.error);
    }

    // Test 6: Get user workout plans
    const getWorkoutPlansResult = await FirestoreService.getUserWorkoutPlans(TEST_USER_ID);
    if (getWorkoutPlansResult.success) {
      console.log('✅ Workout plans retrieved successfully');
      console.log('   Number of plans:', getWorkoutPlansResult.data.length);
    } else {
      console.log('❌ Failed to retrieve workout plans:', getWorkoutPlansResult.error);
    }

    // Test 7: Save progress data
    console.log('\n4️⃣ Testing progress tracking operations...');
    const progressResult = await FirestoreService.saveUserProgress(TEST_USER_ID, {
      currentWeight: 74,
      bodyFatPercentage: 15,
      muscleGain: 1.2,
      workoutsCompleted: 24,
      totalCaloriesBurned: 12450,
      streak: 7,
      goals: {
        weightGoal: 70,
        muscleGoal: 5
      }
    });

    if (progressResult.success) {
      console.log('✅ Progress data saved successfully');
    } else {
      console.log('❌ Failed to save progress data:', progressResult.error);
    }

    // Test 8: Get progress data
    const getProgressResult = await FirestoreService.getUserProgress(TEST_USER_ID);
    if (getProgressResult.success) {
      console.log('✅ Progress data retrieved successfully');
      console.log('   Current weight:', getProgressResult.data.currentWeight, 'kg');
    } else {
      console.log('❌ Failed to retrieve progress data:', getProgressResult.error);
    }

    // Test 9: Save recommendations
    console.log('\n5️⃣ Testing recommendations operations...');
    const recommendationsResult = await FirestoreService.saveRecommendations(TEST_USER_ID, {
      dietRecommendations: [
        'Increase protein intake to support muscle growth',
        'Add more vegetables for better nutrient density'
      ],
      workoutRecommendations: [
        'Include more compound movements',
        'Add cardio 2-3 times per week'
      ],
      generalTips: [
        'Drink more water throughout the day',
        'Get 7-8 hours of sleep nightly'
      ]
    });

    if (recommendationsResult.success) {
      console.log('✅ Recommendations saved successfully');
    } else {
      console.log('❌ Failed to save recommendations:', recommendationsResult.error);
    }

    // Test 10: Register a trainer (test trainer operations)
    console.log('\n6️⃣ Testing trainer operations...');
    const trainerResult = await FirestoreService.registerTrainer(TEST_USER_ID, {
      name: 'John Trainer',
      specialization: 'strength_training',
      location: 'New York',
      experience: 5,
      hourlyRate: 50,
      bio: 'Experienced strength trainer with 5 years of experience',
      certifications: ['NASM-CPT', 'CSCS']
    });

    if (trainerResult.success) {
      console.log('✅ Trainer registered successfully');
      console.log('   Trainer ID:', trainerResult.id);
    } else {
      console.log('❌ Failed to register trainer:', trainerResult.error);
    }

    console.log('\n🎉 Firebase Operations Test Completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testFirestoreOperations();
