import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

class RecommendationEngine {
  constructor() {
    this.exerciseDatabase = this.initializeExerciseDatabase();
    this.nutritionDatabase = this.initializeNutritionDatabase();
  }

  // Initialize comprehensive exercise database
  initializeExerciseDatabase() {
    return {
      strength: {
        beginner: [
          { name: 'Bodyweight Squats', sets: 3, reps: '10-15', restTime: 60, muscleGroups: ['legs', 'glutes'] },
          { name: 'Push-ups (knee or standard)', sets: 3, reps: '5-12', restTime: 60, muscleGroups: ['chest', 'triceps'] },
          { name: 'Assisted Pull-ups', sets: 3, reps: '3-8', restTime: 90, muscleGroups: ['back', 'biceps'] },
          { name: 'Plank', sets: 3, reps: '20-45 sec', restTime: 60, muscleGroups: ['core'] },
          { name: 'Lunges', sets: 3, reps: '8-12 each leg', restTime: 60, muscleGroups: ['legs', 'glutes'] },
          { name: 'Dumbbell Rows', sets: 3, reps: '8-12', restTime: 60, muscleGroups: ['back'] }
        ],
        intermediate: [
          { name: 'Barbell Squats', sets: 4, reps: '8-12', restTime: 90, muscleGroups: ['legs', 'glutes'] },
          { name: 'Bench Press', sets: 4, reps: '6-10', restTime: 120, muscleGroups: ['chest', 'triceps'] },
          { name: 'Deadlifts', sets: 4, reps: '5-8', restTime: 120, muscleGroups: ['back', 'legs', 'glutes'] },
          { name: 'Pull-ups', sets: 3, reps: '6-12', restTime: 90, muscleGroups: ['back', 'biceps'] },
          { name: 'Overhead Press', sets: 3, reps: '6-10', restTime: 90, muscleGroups: ['shoulders', 'triceps'] },
          { name: 'Barbell Rows', sets: 4, reps: '8-12', restTime: 90, muscleGroups: ['back'] }
        ],
        advanced: [
          { name: 'Heavy Squats', sets: 5, reps: '3-6', restTime: 180, muscleGroups: ['legs', 'glutes'] },
          { name: 'Heavy Bench Press', sets: 5, reps: '3-6', restTime: 180, muscleGroups: ['chest', 'triceps'] },
          { name: 'Heavy Deadlifts', sets: 5, reps: '1-5', restTime: 180, muscleGroups: ['back', 'legs', 'glutes'] },
          { name: 'Weighted Pull-ups', sets: 4, reps: '4-8', restTime: 120, muscleGroups: ['back', 'biceps'] },
          { name: 'Clean & Press', sets: 4, reps: '3-6', restTime: 150, muscleGroups: ['full body'] },
          { name: 'Bulgarian Split Squats', sets: 4, reps: '6-10 each leg', restTime: 90, muscleGroups: ['legs', 'glutes'] }
        ]
      },
      muscle_gain: {
        beginner: [
          { name: 'Goblet Squats', sets: 3, reps: '10-15', restTime: 60, muscleGroups: ['legs', 'glutes'] },
          { name: 'Dumbbell Bench Press', sets: 3, reps: '8-12', restTime: 90, muscleGroups: ['chest', 'triceps'] },
          { name: 'Lat Pulldowns', sets: 3, reps: '10-15', restTime: 60, muscleGroups: ['back', 'biceps'] },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: '8-12', restTime: 60, muscleGroups: ['shoulders'] },
          { name: 'Bicep Curls', sets: 3, reps: '10-15', restTime: 45, muscleGroups: ['biceps'] },
          { name: 'Tricep Extensions', sets: 3, reps: '10-15', restTime: 45, muscleGroups: ['triceps'] }
        ],
        intermediate: [
          { name: 'Barbell Squats', sets: 4, reps: '8-12', restTime: 90, muscleGroups: ['legs', 'glutes'] },
          { name: 'Incline Barbell Press', sets: 4, reps: '6-10', restTime: 120, muscleGroups: ['chest', 'triceps'] },
          { name: 'T-Bar Rows', sets: 4, reps: '8-12', restTime: 90, muscleGroups: ['back'] },
          { name: 'Romanian Deadlifts', sets: 4, reps: '8-12', restTime: 90, muscleGroups: ['hamstrings', 'glutes'] },
          { name: 'Dumbbell Flyes', sets: 3, reps: '10-15', restTime: 60, muscleGroups: ['chest'] },
          { name: 'Cable Lateral Raises', sets: 3, reps: '12-15', restTime: 45, muscleGroups: ['shoulders'] }
        ],
        advanced: [
          { name: 'Heavy Squats (Hypertrophy)', sets: 5, reps: '6-8', restTime: 120, muscleGroups: ['legs', 'glutes'] },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '6-10', restTime: 120, muscleGroups: ['chest'] },
          { name: 'Weighted Chin-ups', sets: 4, reps: '6-10', restTime: 120, muscleGroups: ['back', 'biceps'] },
          { name: 'Walking Lunges', sets: 4, reps: '10-15 each leg', restTime: 90, muscleGroups: ['legs', 'glutes'] },
          { name: 'Drop Set Bicep Curls', sets: 3, reps: '8-12 + drops', restTime: 60, muscleGroups: ['biceps'] },
          { name: 'Superset Tricep Work', sets: 3, reps: '10-15', restTime: 60, muscleGroups: ['triceps'] }
        ]
      },
      weight_loss: {
        beginner: [
          { name: 'Bodyweight Squats', sets: 3, reps: '15-20', restTime: 45, muscleGroups: ['legs', 'glutes'] },
          { name: 'Modified Push-ups', sets: 3, reps: '8-15', restTime: 45, muscleGroups: ['chest', 'triceps'] },
          { name: 'Mountain Climbers', sets: 3, reps: '20-30', restTime: 45, muscleGroups: ['core', 'cardio'] },
          { name: 'Jumping Jacks', sets: 3, reps: '30-45', restTime: 30, muscleGroups: ['full body', 'cardio'] },
          { name: 'Plank to Push-up', sets: 3, reps: '5-10', restTime: 60, muscleGroups: ['core', 'chest'] },
          { name: 'High Knees', sets: 3, reps: '30 sec', restTime: 30, muscleGroups: ['cardio', 'legs'] }
        ],
        intermediate: [
          { name: 'Burpees', sets: 4, reps: '8-15', restTime: 60, muscleGroups: ['full body', 'cardio'] },
          { name: 'Kettlebell Swings', sets: 4, reps: '15-25', restTime: 60, muscleGroups: ['posterior chain', 'cardio'] },
          { name: 'Circuit Squats', sets: 4, reps: '15-25', restTime: 45, muscleGroups: ['legs', 'glutes'] },
          { name: 'Battle Ropes', sets: 4, reps: '30 sec', restTime: 45, muscleGroups: ['full body', 'cardio'] },
          { name: 'Box Step-ups', sets: 4, reps: '10-15 each leg', restTime: 45, muscleGroups: ['legs', 'cardio'] },
          { name: 'Plank Variations', sets: 3, reps: '45-60 sec', restTime: 45, muscleGroups: ['core'] }
        ],
        advanced: [
          { name: 'HIIT Burpee Complex', sets: 5, reps: '10-20', restTime: 90, muscleGroups: ['full body', 'cardio'] },
          { name: 'Kettlebell Complex', sets: 5, reps: '12-20', restTime: 90, muscleGroups: ['full body'] },
          { name: 'Sprint Intervals', sets: 6, reps: '30 sec on/30 off', restTime: 120, muscleGroups: ['cardio', 'legs'] },
          { name: 'Compound Circuits', sets: 4, reps: '45 sec work/15 rest', restTime: 120, muscleGroups: ['full body'] },
          { name: 'Plyometric Complex', sets: 4, reps: '8-15', restTime: 90, muscleGroups: ['explosive', 'cardio'] },
          { name: 'Metabolic Finishers', sets: 3, reps: '2-3 min', restTime: 90, muscleGroups: ['full body', 'cardio'] }
        ]
      },
      endurance: {
        beginner: [
          { name: 'Walking/Light Jogging', sets: 1, reps: '20-30 min', restTime: 0, muscleGroups: ['cardio', 'legs'] },
          { name: 'Bodyweight Circuit', sets: 3, reps: '45 sec work/15 rest', restTime: 120, muscleGroups: ['full body'] },
          { name: 'Light Cycling', sets: 1, reps: '25-35 min', restTime: 0, muscleGroups: ['cardio', 'legs'] },
          { name: 'Swimming (if available)', sets: 1, reps: '15-25 min', restTime: 0, muscleGroups: ['full body', 'cardio'] },
          { name: 'Step-ups', sets: 3, reps: '60 sec', restTime: 60, muscleGroups: ['legs', 'cardio'] },
          { name: 'Arm Circles & Movements', sets: 3, reps: '30 sec each', restTime: 30, muscleGroups: ['shoulders', 'endurance'] }
        ],
        intermediate: [
          { name: 'Interval Running', sets: 6, reps: '2 min fast/1 min recovery', restTime: 0, muscleGroups: ['cardio', 'legs'] },
          { name: 'Circuit Training', sets: 4, reps: '3 min circuits', restTime: 90, muscleGroups: ['full body'] },
          { name: 'Cycling Intervals', sets: 8, reps: '90 sec hard/60 sec easy', restTime: 0, muscleGroups: ['cardio', 'legs'] },
          { name: 'Rowing Machine', sets: 5, reps: '5 min intervals', restTime: 90, muscleGroups: ['full body', 'cardio'] },
          { name: 'Stair Climbing', sets: 4, reps: '3-5 min', restTime: 120, muscleGroups: ['legs', 'cardio'] },
          { name: 'Cross-training Mix', sets: 1, reps: '45-60 min', restTime: 0, muscleGroups: ['full body'] }
        ],
        advanced: [
          { name: 'Long Distance Running', sets: 1, reps: '60-90 min steady', restTime: 0, muscleGroups: ['cardio', 'legs'] },
          { name: 'High Intensity Intervals', sets: 10, reps: '400m repeats', restTime: 90, muscleGroups: ['cardio', 'legs'] },
          { name: 'Triathlon Training', sets: 1, reps: '90-120 min multi-sport', restTime: 0, muscleGroups: ['full body'] },
          { name: 'Hill Repeats', sets: 8, reps: '2 min up/2 min recovery', restTime: 0, muscleGroups: ['cardio', 'legs'] },
          { name: 'Tempo Runs', sets: 1, reps: '30-60 min tempo pace', restTime: 0, muscleGroups: ['cardio', 'legs'] },
          { name: 'Endurance Circuits', sets: 5, reps: '5 min circuits', restTime: 120, muscleGroups: ['full body'] }
        ]
      }
    };
  }

  // Initialize nutrition database
  initializeNutritionDatabase() {
    return {
      muscle_gain: {
        highProtein: [
          { name: 'Grilled Chicken Breast', protein: 31, carbs: 0, fat: 3.6, calories: 165, serving: '100g' },
          { name: 'Lean Beef', protein: 26, carbs: 0, fat: 15, calories: 250, serving: '100g' },
          { name: 'Salmon', protein: 25, carbs: 0, fat: 12, calories: 206, serving: '100g' },
          { name: 'Eggs', protein: 13, carbs: 1, fat: 11, calories: 155, serving: '2 large' },
          { name: 'Greek Yogurt', protein: 20, carbs: 9, fat: 0, calories: 100, serving: '170g' },
          { name: 'Cottage Cheese', protein: 25, carbs: 5, fat: 2, calories: 120, serving: '200g' }
        ],
        complexCarbs: [
          { name: 'Brown Rice', protein: 5, carbs: 58, fat: 2, calories: 285, serving: '100g cooked' },
          { name: 'Quinoa', protein: 8, carbs: 39, fat: 3, calories: 222, serving: '100g cooked' },
          { name: 'Sweet Potato', protein: 2, carbs: 27, fat: 0, calories: 112, serving: '100g' },
          { name: 'Oatmeal', protein: 5, carbs: 25, fat: 3, calories: 147, serving: '40g dry' },
          { name: 'Whole Grain Pasta', protein: 8, carbs: 43, fat: 1, calories: 220, serving: '100g cooked' }
        ],
        healthyFats: [
          { name: 'Avocado', protein: 2, carbs: 2, fat: 15, calories: 160, serving: '100g' },
          { name: 'Almonds', protein: 6, carbs: 2, fat: 14, calories: 164, serving: '28g' },
          { name: 'Olive Oil', protein: 0, carbs: 0, fat: 14, calories: 119, serving: '1 tbsp' },
          { name: 'Peanut Butter', protein: 8, carbs: 8, fat: 16, calories: 190, serving: '2 tbsp' }
        ]
      },
      weight_loss: {
        leanProteins: [
          { name: 'Chicken Breast (skinless)', protein: 31, carbs: 0, fat: 3.6, calories: 165, serving: '100g' },
          { name: 'White Fish (Cod)', protein: 18, carbs: 0, fat: 0.7, calories: 82, serving: '100g' },
          { name: 'Turkey Breast', protein: 30, carbs: 0, fat: 1, calories: 135, serving: '100g' },
          { name: 'Egg Whites', protein: 11, carbs: 0.7, fat: 0.2, calories: 52, serving: '3 large' },
          { name: 'Low-fat Greek Yogurt', protein: 20, carbs: 9, fat: 0, calories: 100, serving: '170g' },
          { name: 'Tofu', protein: 15, carbs: 4, fat: 9, calories: 144, serving: '100g' }
        ],
        vegetables: [
          { name: 'Broccoli', protein: 3, carbs: 7, fat: 0.4, calories: 34, serving: '100g' },
          { name: 'Spinach', protein: 3, carbs: 4, fat: 0.4, calories: 23, serving: '100g' },
          { name: 'Bell Peppers', protein: 1, carbs: 7, fat: 0.3, calories: 31, serving: '100g' },
          { name: 'Cucumber', protein: 0.7, carbs: 4, fat: 0.1, calories: 16, serving: '100g' },
          { name: 'Zucchini', protein: 1.2, carbs: 3.1, fat: 0.3, calories: 17, serving: '100g' }
        ],
        lowGICarbs: [
          { name: 'Cauliflower Rice', protein: 2, carbs: 3, fat: 0.1, calories: 25, serving: '100g' },
          { name: 'Shirataki Noodles', protein: 0, carbs: 1, fat: 0, calories: 10, serving: '100g' },
          { name: 'Berries (mixed)', protein: 1, carbs: 12, fat: 0.3, calories: 57, serving: '100g' },
          { name: 'Green Beans', protein: 2, carbs: 7, fat: 0.1, calories: 31, serving: '100g' }
        ]
      },
      endurance: {
        energyFoods: [
          { name: 'Bananas', protein: 1.1, carbs: 27, fat: 0.3, calories: 105, serving: '1 medium' },
          { name: 'Dates', protein: 0.4, carbs: 18, fat: 0.1, calories: 66, serving: '1 date' },
          { name: 'Energy Bars (homemade)', protein: 8, carbs: 30, fat: 12, calories: 250, serving: '1 bar' },
          { name: 'Whole Grain Bread', protein: 4, carbs: 17, fat: 1, calories: 80, serving: '1 slice' }
        ],
        hydration: [
          { name: 'Coconut Water', protein: 0.7, carbs: 9, fat: 0.2, calories: 45, serving: '240ml' },
          { name: 'Sports Drink (diluted)', protein: 0, carbs: 14, fat: 0, calories: 50, serving: '240ml' },
          { name: 'Water with Electrolytes', protein: 0, carbs: 0, fat: 0, calories: 0, serving: '240ml' }
        ]
      }
    };
  }

  // Generate personalized workout plan
  async generateWorkoutPlan(userProfile) {
    try {
      const { fitnessGoal, experienceLevel, preferences, activityLevel } = userProfile;
      
      // Determine workout frequency based on activity level
      const weeklyFrequency = this.getWorkoutFrequency(activityLevel, experienceLevel);
      
      // Get exercises for user's goal and level
      const exercises = this.exerciseDatabase[fitnessGoal]?.[experienceLevel] || 
                      this.exerciseDatabase['general_fitness']?.[experienceLevel];

      if (!exercises) {
        throw new Error('No exercises found for user profile');
      }

      // Create weekly workout schedule
      const workoutPlan = this.createWeeklySchedule(exercises, weeklyFrequency, preferences);
      
      // Add progression and notes
      workoutPlan.progression = this.generateProgressionPlan(experienceLevel, fitnessGoal);
      workoutPlan.notes = this.generateWorkoutNotes(fitnessGoal, experienceLevel);
      
      return {
        success: true,
        data: workoutPlan,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating workout plan:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate personalized nutrition plan
  async generateNutritionPlan(userProfile) {
    try {
      const { fitnessGoal, weight, height, age, gender, activityLevel } = userProfile;
      
      // Calculate daily caloric needs
      const calorieNeeds = this.calculateCalorieNeeds(weight, height, age, gender, activityLevel);
      
      // Calculate macronutrient distribution
      const macros = this.calculateMacros(fitnessGoal, calorieNeeds);
      
      // Generate meal suggestions
      const mealPlan = this.generateMealSuggestions(fitnessGoal, macros, userProfile.preferences);
      
      return {
        success: true,
        data: {
          dailyCalories: calorieNeeds,
          macros: macros,
          mealPlan: mealPlan,
          hydrationGoal: this.calculateHydrationNeeds(weight, activityLevel),
          tips: this.generateNutritionTips(fitnessGoal)
        },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating nutrition plan:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper method to determine workout frequency
  getWorkoutFrequency(activityLevel, experienceLevel) {
    const frequencyMap = {
      sedentary: { beginner: 2, intermediate: 3, advanced: 3 },
      lightly_active: { beginner: 3, intermediate: 4, advanced: 4 },
      moderately_active: { beginner: 3, intermediate: 4, advanced: 5 },
      very_active: { beginner: 4, intermediate: 5, advanced: 6 },
      extremely_active: { beginner: 4, intermediate: 5, advanced: 6 }
    };
    
    return frequencyMap[activityLevel]?.[experienceLevel] || 3;
  }

  // Create weekly workout schedule
  createWeeklySchedule(exercises, frequency, preferences) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = {};
    
    // Distribute workouts across the week
    const workoutDays = this.distributeWorkoutDays(frequency, preferences?.preferredWorkoutTime);
    
    workoutDays.forEach((day, index) => {
      const workoutExercises = this.selectExercisesForDay(exercises, index, frequency);
      schedule[day] = {
        exercises: workoutExercises,
        estimatedDuration: this.calculateWorkoutDuration(workoutExercises),
        focus: this.getWorkoutFocus(index, frequency)
      };
    });
    
    // Add rest days
    days.forEach(day => {
      if (!schedule[day]) {
        schedule[day] = { type: 'rest', activities: ['Light walking', 'Stretching', 'Yoga'] };
      }
    });
    
    return {
      weeklySchedule: schedule,
      totalWorkouts: frequency,
      estimatedWeeklyTime: Object.values(schedule)
        .filter(day => day.exercises)
        .reduce((total, day) => total + (day.estimatedDuration || 0), 0)
    };
  }

  // Calculate caloric needs using Mifflin-St Jeor equation
  calculateCalorieNeeds(weight, height, age, gender, activityLevel) {
    let bmr;
    
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };
    
    return Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
  }

  // Calculate macronutrient distribution
  calculateMacros(fitnessGoal, totalCalories) {
    const macroRatios = {
      muscle_gain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
      weight_loss: { protein: 0.35, carbs: 0.35, fat: 0.30 },
      strength: { protein: 0.30, carbs: 0.40, fat: 0.30 },
      endurance: { protein: 0.20, carbs: 0.60, fat: 0.20 },
      general_fitness: { protein: 0.25, carbs: 0.45, fat: 0.30 }
    };
    
    const ratios = macroRatios[fitnessGoal] || macroRatios.general_fitness;
    
    return {
      protein: {
        grams: Math.round((totalCalories * ratios.protein) / 4),
        calories: Math.round(totalCalories * ratios.protein),
        percentage: Math.round(ratios.protein * 100)
      },
      carbs: {
        grams: Math.round((totalCalories * ratios.carbs) / 4),
        calories: Math.round(totalCalories * ratios.carbs),
        percentage: Math.round(ratios.carbs * 100)
      },
      fat: {
        grams: Math.round((totalCalories * ratios.fat) / 9),
        calories: Math.round(totalCalories * ratios.fat),
        percentage: Math.round(ratios.fat * 100)
      }
    };
  }

  // Generate meal suggestions
  generateMealSuggestions(fitnessGoal, macros, preferences) {
    const goalFoods = this.nutritionDatabase[fitnessGoal] || this.nutritionDatabase.muscle_gain;
    const dietaryRestrictions = preferences?.dietaryRestrictions || [];
    
    // Filter foods based on dietary restrictions
    const filteredFoods = this.filterFoodsByRestrictions(goalFoods, dietaryRestrictions);
    
    return {
      breakfast: this.generateMealOptions('breakfast', filteredFoods, macros),
      lunch: this.generateMealOptions('lunch', filteredFoods, macros),
      dinner: this.generateMealOptions('dinner', filteredFoods, macros),
      snacks: this.generateMealOptions('snacks', filteredFoods, macros)
    };
  }

  // Helper methods for meal generation
  generateMealOptions(mealType, foods, macros) {
    const mealCalories = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.30,
      snacks: 0.10
    };
    
    const targetCalories = macros.protein.calories + macros.carbs.calories + macros.fat.calories;
    const mealTargetCalories = Math.round(targetCalories * mealCalories[mealType]);
    
    // Generate 3 different meal options
    return Array(3).fill(null).map((_, index) => ({
      option: index + 1,
      name: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Option ${index + 1}`,
      foods: this.selectFoodsForMeal(foods, mealTargetCalories),
      estimatedCalories: mealTargetCalories,
      prepTime: this.estimatePrepTime(mealType)
    }));
  }

  // Additional helper methods
  distributeWorkoutDays(frequency, preferredTime) {
    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    if (frequency === 3) {
      return ['Monday', 'Wednesday', 'Friday'];
    } else if (frequency === 4) {
      return ['Monday', 'Tuesday', 'Thursday', 'Saturday'];
    } else if (frequency === 5) {
      return ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'];
    } else if (frequency === 6) {
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    } else {
      return allDays.slice(0, frequency);
    }
  }

  selectExercisesForDay(exercises, dayIndex, totalDays) {
    const exercisesPerDay = Math.ceil(exercises.length / totalDays);
    const startIndex = (dayIndex * exercisesPerDay) % exercises.length;
    
    return exercises.slice(startIndex, startIndex + exercisesPerDay)
      .map(exercise => ({
        ...exercise,
        id: `${exercise.name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
  }

  calculateWorkoutDuration(exercises) {
    const avgExerciseTime = 3; // minutes per exercise including rest
    return exercises.length * avgExerciseTime + 10; // +10 for warm-up/cool-down
  }

  getWorkoutFocus(dayIndex, totalDays) {
    const focuses = ['Upper Body', 'Lower Body', 'Full Body', 'Core & Cardio', 'Strength', 'Conditioning'];
    return focuses[dayIndex % focuses.length];
  }

  filterFoodsByRestrictions(foods, restrictions) {
    // This would implement actual filtering logic based on dietary restrictions
    return foods;
  }

  selectFoodsForMeal(foods, targetCalories) {
    // This would implement smart food selection algorithm
    const allFoods = Object.values(foods).flat();
    return allFoods.slice(0, 3); // Simple selection for now
  }

  estimatePrepTime(mealType) {
    const times = {
      breakfast: '10-15 mins',
      lunch: '15-25 mins',
      dinner: '25-35 mins',
      snacks: '5-10 mins'
    };
    return times[mealType] || '15 mins';
  }

  calculateHydrationNeeds(weight, activityLevel) {
    const baseWater = weight * 35; // ml per kg
    const activityMultiplier = {
      sedentary: 1.0,
      lightly_active: 1.1,
      moderately_active: 1.3,
      very_active: 1.5,
      extremely_active: 1.7
    };
    
    return Math.round((baseWater * (activityMultiplier[activityLevel] || 1.3)) / 250); // glasses of water
  }

  generateProgressionPlan(experienceLevel, fitnessGoal) {
    return {
      week1_2: 'Focus on form and consistency',
      week3_4: 'Increase intensity by 5-10%',
      week5_6: 'Add complexity or volume',
      week7_8: 'Assess progress and adjust plan'
    };
  }

  generateWorkoutNotes(fitnessGoal, experienceLevel) {
    const notes = {
      muscle_gain: ['Focus on progressive overload', 'Rest 2-3 minutes between sets', 'Prioritize compound movements'],
      weight_loss: ['Keep rest periods short', 'Include cardio elements', 'Focus on high-intensity work'],
      strength: ['Prioritize heavy compound lifts', 'Rest 3-5 minutes between sets', 'Focus on perfect form'],
      endurance: ['Build up gradually', 'Monitor heart rate', 'Include active recovery']
    };
    
    return notes[fitnessGoal] || notes.muscle_gain;
  }

  generateNutritionTips(fitnessGoal) {
    const tips = {
      muscle_gain: [
        'Eat in a slight caloric surplus',
        'Consume protein every 3-4 hours',
        'Include post-workout nutrition',
        'Stay consistent with meal timing'
      ],
      weight_loss: [
        'Create a moderate caloric deficit',
        'Prioritize protein to maintain muscle',
        'Include fiber-rich foods for satiety',
        'Stay hydrated throughout the day'
      ],
      endurance: [
        'Focus on carb timing around workouts',
        'Maintain consistent energy levels',
        'Include anti-inflammatory foods',
        'Plan nutrition for long training sessions'
      ]
    };
    
    return tips[fitnessGoal] || tips.muscle_gain;
  }

  // Save recommendation to user's Firebase document
  async saveRecommendation(userId, type, recommendation) {
    try {
      const userDocRef = doc(db, 'users', userId);
      const recommendationData = {
        [`${type}Recommendation`]: recommendation,
        [`${type}RecommendationUpdatedAt`]: new Date().toISOString()
      };
      
      await updateDoc(userDocRef, recommendationData);
      return { success: true };
    } catch (error) {
      console.error('Error saving recommendation:', error);
      return { success: false, error: error.message };
    }
  }

  // Load saved recommendations
  async loadRecommendations(userId) {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          success: true,
          workoutRecommendation: data.workoutRecommendation,
          nutritionRecommendation: data.nutritionRecommendation
        };
      }
      
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Error loading recommendations:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export default new RecommendationEngine();
