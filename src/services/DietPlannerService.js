// DietPlannerService.js - Automatic diet planning based on user goals
import foodDatabaseService from './FoodDatabaseService';

class DietPlannerService {
  constructor() {
    this.mealTemplates = this.initializeMealTemplates();
  }

  // Initialize meal templates for different goals
  initializeMealTemplates() {
    return {
      weight_loss: {
        breakfast: { calories: 0.25, protein: 0.3, carbs: 0.2, fat: 0.25 },
        lunch: { calories: 0.35, protein: 0.35, carbs: 0.3, fat: 0.25 },
        dinner: { calories: 0.25, protein: 0.25, carbs: 0.2, fat: 0.25 },
        snack: { calories: 0.15, protein: 0.1, carbs: 0.3, fat: 0.25 }
      },
      muscle_gain: {
        breakfast: { calories: 0.25, protein: 0.3, carbs: 0.3, fat: 0.2 },
        lunch: { calories: 0.3, protein: 0.35, carbs: 0.35, fat: 0.2 },
        dinner: { calories: 0.25, protein: 0.25, carbs: 0.25, fat: 0.2 },
        snack: { calories: 0.2, protein: 0.1, carbs: 0.1, fat: 0.4 }
      },
      maintenance: {
        breakfast: { calories: 0.25, protein: 0.25, carbs: 0.25, fat: 0.25 },
        lunch: { calories: 0.35, protein: 0.3, carbs: 0.3, fat: 0.25 },
        dinner: { calories: 0.25, protein: 0.25, carbs: 0.25, fat: 0.25 },
        snack: { calories: 0.15, protein: 0.2, carbs: 0.2, fat: 0.25 }
      },
      endurance: {
        breakfast: { calories: 0.25, protein: 0.2, carbs: 0.4, fat: 0.15 },
        lunch: { calories: 0.35, protein: 0.25, carbs: 0.45, fat: 0.15 },
        dinner: { calories: 0.25, protein: 0.25, carbs: 0.4, fat: 0.15 },
        snack: { calories: 0.15, protein: 0.3, carbs: 0.35, fat: 0.2 }
      }
    };
  }

  // Calculate daily calorie needs using Mifflin-St Jeor equation
  calculateDailyCalories(userProfile) {
    const { age, gender, weight, height, activityLevel, fitnessGoal } = userProfile;
    
    // BMR calculation (Mifflin-St Jeor)
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };
    
    const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);
    
    // Goal adjustment
    let targetCalories = tdee;
    switch (fitnessGoal) {
      case 'weight_loss':
        targetCalories = tdee * 0.85; // 15% deficit
        break;
      case 'muscle_gain':
        targetCalories = tdee * 1.1; // 10% surplus
        break;
      case 'endurance':
        targetCalories = tdee * 1.05; // 5% surplus for energy
        break;
      default:
        targetCalories = tdee; // maintenance
    }
    
    return Math.round(targetCalories);
  }

  // Calculate macro targets
  calculateMacroTargets(calories, fitnessGoal, weight) {
    let protein, carbs, fat;
    
    switch (fitnessGoal) {
      case 'weight_loss':
        protein = weight * 2.2; // 2.2g per kg
        fat = (calories * 0.3) / 9; // 30% of calories
        carbs = (calories - protein * 4 - fat * 9) / 4;
        break;
      case 'muscle_gain':
        protein = weight * 2.0; // 2.0g per kg
        fat = (calories * 0.25) / 9; // 25% of calories
        carbs = (calories - protein * 4 - fat * 9) / 4;
        break;
      case 'endurance':
        protein = weight * 1.6; // 1.6g per kg
        fat = (calories * 0.2) / 9; // 20% of calories
        carbs = (calories - protein * 4 - fat * 9) / 4;
        break;
      default: // maintenance
        protein = weight * 1.8; // 1.8g per kg
        fat = (calories * 0.28) / 9; // 28% of calories
        carbs = (calories - protein * 4 - fat * 9) / 4;
    }
    
    return {
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      calories: calories
    };
  }

  // Generate meal plan
  generateMealPlan(userProfile) {
    const dailyCalories = this.calculateDailyCalories(userProfile);
    const macroTargets = this.calculateMacroTargets(
      dailyCalories, 
      userProfile.fitnessGoal, 
      userProfile.weight
    );
    
    const mealPlan = {
      dailyTargets: macroTargets,
      meals: {},
      totalNutrients: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      }
    };
    
    const goal = userProfile.fitnessGoal || 'maintenance';
    const template = this.mealTemplates[goal] || this.mealTemplates.maintenance;
    
    // Generate meals
    Object.keys(template).forEach(mealType => {
      const mealTargets = template[mealType];
      const mealCalories = Math.round(dailyCalories * mealTargets.calories);
      
      mealPlan.meals[mealType] = this.generateMeal(
        mealType,
        mealCalories,
        mealTargets,
        userProfile.dietaryRestrictions || []
      );
      
      // Add to total nutrients
      Object.keys(mealPlan.totalNutrients).forEach(nutrient => {
        if (mealPlan.meals[mealType].nutrients[nutrient]) {
          mealPlan.totalNutrients[nutrient] += mealPlan.meals[mealType].nutrients[nutrient];
        }
      });
    });
    
    return mealPlan;
  }

  // Generate individual meal
  generateMeal(mealType, targetCalories, macroTargets, dietaryRestrictions) {
    const meal = {
      name: this.getMealName(mealType),
      foods: [],
      nutrients: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }
    };
    
    const targetProtein = targetCalories * macroTargets.protein * 4 / targetCalories;
    const targetCarbs = targetCalories * macroTargets.carbs * 4 / targetCalories;
    const targetFat = targetCalories * macroTargets.fat * 9 / targetCalories;
    
    // Add protein source
    const proteinFoods = this.getFoodsByCategory('protein', dietaryRestrictions);
    if (proteinFoods.length > 0) {
      const proteinFood = proteinFoods[Math.floor(Math.random() * proteinFoods.length)];
      const proteinAmount = Math.min(targetProtein / proteinFood.protein * 100, 200); // Max 200g
      const proteinNutrients = foodDatabaseService.calculateNutrients(proteinFood.id, proteinAmount, 'g');
      
      meal.foods.push({
        ...proteinNutrients,
        mealType: mealType
      });
      
      // Update meal nutrients
      Object.keys(meal.nutrients).forEach(nutrient => {
        if (proteinNutrients[nutrient]) {
          meal.nutrients[nutrient] += proteinNutrients[nutrient];
        }
      });
    }
    
    // Add carb source
    const carbFoods = this.getFoodsByCategory('carbs', dietaryRestrictions);
    if (carbFoods.length > 0) {
      const carbFood = carbFoods[Math.floor(Math.random() * carbFoods.length)];
      const carbAmount = Math.min(targetCarbs / carbFood.carbs * 100, 150); // Max 150g
      const carbNutrients = foodDatabaseService.calculateNutrients(carbFood.id, carbAmount, 'g');
      
      meal.foods.push({
        ...carbNutrients,
        mealType: mealType
      });
      
      // Update meal nutrients
      Object.keys(meal.nutrients).forEach(nutrient => {
        if (carbNutrients[nutrient]) {
          meal.nutrients[nutrient] += carbNutrients[nutrient];
        }
      });
    }
    
    // Add vegetables
    const vegFoods = this.getFoodsByCategory('vegetables', dietaryRestrictions);
    if (vegFoods.length > 0) {
      const vegFood = vegFoods[Math.floor(Math.random() * vegFoods.length)];
      const vegAmount = 100; // Standard 100g serving
      const vegNutrients = foodDatabaseService.calculateNutrients(vegFood.id, vegAmount, 'g');
      
      meal.foods.push({
        ...vegNutrients,
        mealType: mealType
      });
      
      // Update meal nutrients
      Object.keys(meal.nutrients).forEach(nutrient => {
        if (vegNutrients[nutrient]) {
          meal.nutrients[nutrient] += vegNutrients[nutrient];
        }
      });
    }
    
    // Round nutrients
    Object.keys(meal.nutrients).forEach(nutrient => {
      meal.nutrients[nutrient] = Math.round(meal.nutrients[nutrient]);
    });
    
    return meal;
  }

  // Get foods by category with dietary restrictions
  getFoodsByCategory(category, dietaryRestrictions = []) {
    let foods = foodDatabaseService.getFoodsByCategory(category);
    
    // Filter based on dietary restrictions
    if (dietaryRestrictions.includes('vegetarian')) {
      foods = foods.filter(food => !['chicken_breast', 'salmon', 'eggs'].includes(food.id));
    }
    if (dietaryRestrictions.includes('vegan')) {
      foods = foods.filter(food => !['chicken_breast', 'salmon', 'eggs'].includes(food.id));
    }
    if (dietaryRestrictions.includes('gluten_free')) {
      foods = foods.filter(food => !['oats'].includes(food.id));
    }
    
    return foods;
  }

  // Get meal name
  getMealName(mealType) {
    const names = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack'
    };
    return names[mealType] || mealType;
  }

  // Generate shopping list from meal plan
  generateShoppingList(mealPlan) {
    const shoppingList = new Map();
    
    Object.values(mealPlan.meals).forEach(meal => {
      meal.foods.forEach(food => {
        const key = food.name;
        if (shoppingList.has(key)) {
          const existing = shoppingList.get(key);
          existing.amount += parseFloat(food.servingSize);
          existing.calories += food.calories;
        } else {
          shoppingList.set(key, {
            name: food.name,
            category: food.category,
            amount: parseFloat(food.servingSize),
            unit: food.servingSize.replace(/[\d.]/g, ''),
            calories: food.calories
          });
        }
      });
    });
    
    return Array.from(shoppingList.values());
  }

  // Calculate nutrition summary for logged foods
  calculateNutritionSummary(loggedFoods) {
    const summary = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };
    
    loggedFoods.forEach(food => {
      Object.keys(summary).forEach(nutrient => {
        if (food[nutrient]) {
          summary[nutrient] += food[nutrient];
        }
      });
    });
    
    // Round values
    Object.keys(summary).forEach(nutrient => {
      summary[nutrient] = Math.round(summary[nutrient] * 10) / 10;
    });
    
    return summary;
  }

  // Get nutrition tips based on goals
  getNutritionTips(fitnessGoal) {
    const tips = {
      weight_loss: [
        "Focus on high-protein foods to maintain muscle mass",
        "Include plenty of fiber-rich vegetables",
        "Choose complex carbs over simple sugars",
        "Stay hydrated with water throughout the day"
      ],
      muscle_gain: [
        "Consume protein with every meal",
        "Eat complex carbs before and after workouts",
        "Include healthy fats for hormone production",
        "Space protein intake throughout the day"
      ],
      endurance: [
        "Prioritize complex carbohydrates",
        "Include moderate protein for recovery",
        "Stay hydrated during long sessions",
        "Eat easily digestible foods before workouts"
      ],
      maintenance: [
        "Balance all macronutrients",
        "Include variety in your food choices",
        "Listen to your body's hunger cues",
        "Maintain consistent meal timing"
      ]
    };
    
    return tips[fitnessGoal] || tips.maintenance;
  }
}

// Create singleton instance
const dietPlannerService = new DietPlannerService();

export default dietPlannerService;
