// FoodDatabaseService.js - Comprehensive food database with nutrient information
class FoodDatabaseService {
  constructor() {
    // Initialize with common foods and their nutritional values
    this.foods = new Map();
    this.userFoods = new Map(); // User-added custom foods
    this.recentFoods = []; // Recently logged foods
    
    this.initializeFoodDatabase();
  }

  // Initialize with common foods
  initializeFoodDatabase() {
    const commonFoods = [
      // Proteins
      {
        id: 'chicken_breast',
        name: 'Chicken Breast (100g)',
        category: 'protein',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0,
        sugar: 0,
        sodium: 74,
        servingSize: '100g',
        unit: 'g'
      },
      {
        id: 'salmon',
        name: 'Salmon (100g)',
        category: 'protein',
        calories: 208,
        protein: 25,
        carbs: 0,
        fat: 12,
        fiber: 0,
        sugar: 0,
        sodium: 59,
        servingSize: '100g',
        unit: 'g'
      },
      {
        id: 'eggs',
        name: 'Eggs (1 large)',
        category: 'protein',
        calories: 70,
        protein: 6,
        carbs: 0.6,
        fat: 5,
        fiber: 0,
        sugar: 0.4,
        sodium: 70,
        servingSize: '1 large',
        unit: 'piece'
      },
      {
        id: 'tofu',
        name: 'Tofu (100g)',
        category: 'protein',
        calories: 76,
        protein: 8,
        carbs: 1.9,
        fat: 4.8,
        fiber: 0.3,
        sugar: 0.6,
        sodium: 7,
        servingSize: '100g',
        unit: 'g'
      },

      // Carbs
      {
        id: 'rice_white',
        name: 'White Rice (100g cooked)',
        category: 'carbs',
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        fiber: 0.4,
        sugar: 0.1,
        sodium: 1,
        servingSize: '100g',
        unit: 'g'
      },
      {
        id: 'oats',
        name: 'Oats (100g)',
        category: 'carbs',
        calories: 389,
        protein: 16.9,
        carbs: 66.3,
        fat: 6.9,
        fiber: 10.6,
        sugar: 0,
        sodium: 2,
        servingSize: '100g',
        unit: 'g'
      },
      {
        id: 'banana',
        name: 'Banana (1 medium)',
        category: 'fruit',
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
        fiber: 3.1,
        sugar: 14.4,
        sodium: 1,
        servingSize: '1 medium',
        unit: 'piece'
      },
      {
        id: 'apple',
        name: 'Apple (1 medium)',
        category: 'fruit',
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        fiber: 4.4,
        sugar: 19,
        sodium: 2,
        servingSize: '1 medium',
        unit: 'piece'
      },

      // Fats
      {
        id: 'almonds',
        name: 'Almonds (100g)',
        category: 'nuts',
        calories: 579,
        protein: 21.2,
        carbs: 21.7,
        fat: 49.9,
        fiber: 12.5,
        sugar: 4.8,
        sodium: 1,
        servingSize: '100g',
        unit: 'g'
      },
      {
        id: 'avocado',
        name: 'Avocado (100g)',
        category: 'fats',
        calories: 160,
        protein: 2,
        carbs: 8.5,
        fat: 14.7,
        fiber: 6.7,
        sugar: 0.7,
        sodium: 7,
        servingSize: '100g',
        unit: 'g'
      },
      {
        id: 'olive_oil',
        name: 'Olive Oil (1 tbsp)',
        category: 'fats',
        calories: 120,
        protein: 0,
        carbs: 0,
        fat: 14,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        servingSize: '1 tbsp',
        unit: 'tbsp'
      },

      // Vegetables
      {
        id: 'broccoli',
        name: 'Broccoli (100g)',
        category: 'vegetables',
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fat: 0.4,
        fiber: 2.6,
        sugar: 1.5,
        sodium: 33,
        servingSize: '100g',
        unit: 'g'
      },
      {
        id: 'spinach',
        name: 'Spinach (100g)',
        category: 'vegetables',
        calories: 23,
        protein: 2.9,
        carbs: 3.6,
        fat: 0.4,
        fiber: 2.2,
        sugar: 0.4,
        sodium: 79,
        servingSize: '100g',
        unit: 'g'
      }
    ];

    commonFoods.forEach(food => {
      this.foods.set(food.id, food);
    });
  }

  // Search foods by name
  searchFoods(query) {
    const results = [];
    const searchTerm = query.toLowerCase();
    
    // Search in common foods
    for (const [id, food] of this.foods) {
      if (food.name.toLowerCase().includes(searchTerm)) {
        results.push({ ...food, source: 'database' });
      }
    }
    
    // Search in user foods
    for (const [id, food] of this.userFoods) {
      if (food.name.toLowerCase().includes(searchTerm)) {
        results.push({ ...food, source: 'user' });
      }
    }
    
    return results.slice(0, 10); // Return top 10 results
  }

  // Add custom food
  addCustomFood(foodData) {
    const id = `custom_${Date.now()}`;
    const customFood = {
      id,
      ...foodData,
      source: 'user',
      createdAt: new Date().toISOString()
    };
    
    this.userFoods.set(id, customFood);
    return customFood;
  }

  // Get food by ID
  getFoodById(id) {
    return this.foods.get(id) || this.userFoods.get(id);
  }

  // Calculate nutrients for a food item with custom serving size
  calculateNutrients(foodId, servingSize, unit = 'g') {
    const food = this.getFoodById(foodId);
    if (!food) return null;
    
    let multiplier = 1;
    
    // Convert serving sizes to grams for calculation
    if (unit === 'g' && food.unit === 'g') {
      multiplier = servingSize / parseFloat(food.servingSize);
    } else if (unit === 'piece' && food.unit === 'piece') {
      multiplier = servingSize / parseFloat(food.servingSize);
    } else if (unit === 'tbsp' && food.unit === 'tbsp') {
      multiplier = servingSize / parseFloat(food.servingSize);
    } else {
      // Default to grams
      multiplier = servingSize / 100;
    }
    
    return {
      id: food.id,
      name: food.name,
      category: food.category,
      servingSize: `${servingSize}${unit}`,
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10,
      fiber: Math.round(food.fiber * multiplier * 10) / 10,
      sugar: Math.round(food.sugar * multiplier * 10) / 10,
      sodium: Math.round(food.sodium * multiplier)
    };
  }

  // Get food categories
  getCategories() {
    const categories = new Set();
    for (const food of this.foods.values()) {
      categories.add(food.category);
    }
    for (const food of this.userFoods.values()) {
      categories.add(food.category);
    }
    return Array.from(categories);
  }

  // Get foods by category
  getFoodsByCategory(category) {
    const results = [];
    
    for (const food of this.foods.values()) {
      if (food.category === category) {
        results.push({ ...food, source: 'database' });
      }
    }
    
    for (const food of this.userFoods.values()) {
      if (food.category === category) {
        results.push({ ...food, source: 'user' });
      }
    }
    
    return results;
  }

  // Add to recent foods
  addToRecent(foodId) {
    const food = this.getFoodById(foodId);
    if (!food) return;
    
    // Remove if already exists
    this.recentFoods = this.recentFoods.filter(f => f.id !== foodId);
    
    // Add to beginning
    this.recentFoods.unshift(food);
    
    // Keep only last 10
    if (this.recentFoods.length > 10) {
      this.recentFoods = this.recentFoods.slice(0, 10);
    }
  }

  // Get recent foods
  getRecentFoods() {
    return this.recentFoods;
  }

  // Get popular foods (most used)
  getPopularFoods() {
    const popular = [
      'chicken_breast',
      'rice_white',
      'eggs',
      'banana',
      'oats',
      'almonds',
      'broccoli'
    ];
    
    return popular.map(id => this.getFoodById(id)).filter(Boolean);
  }
}

// Create singleton instance
const foodDatabaseService = new FoodDatabaseService();

export default foodDatabaseService;
