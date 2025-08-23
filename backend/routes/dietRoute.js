// dietRoute.js
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { weight, height, goal, dietaryPreference } = req.body;
  if (!weight || !height) return res.status(400).json({ error: 'weight and height are required' });

  // Mifflin-St Jeor estimate using average height->BMR approximation (gender-agnostic for demo)
  const w = Number(weight);
  const h = Number(height);
  let bmr = 10 * w + 6.25 * h - 5 * 28 + 5; // assume age ~28 male
  let tdee = bmr * 1.55; // moderate activity as default

  if (goal === 'bulk') tdee *= 1.15;
  else if (goal === 'cut') tdee *= 0.85;

  const calories = Math.round(tdee);

  // Macro split based on goal
  const protein = Math.round(w * (goal === 'cut' ? 2.2 : 2.0));
  const fat = Math.round((calories * (goal === 'bulk' ? 0.30 : 0.25)) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  // Very simple meal template generator
  const templates = {
    balanced: [
      { meal: 'Breakfast', food: 'Oats, yogurt, berries, nuts', calories: Math.round(calories * 0.25) },
      { meal: 'Lunch', food: 'Rice/quinoa, chicken/paneer, veggies', calories: Math.round(calories * 0.35) },
      { meal: 'Dinner', food: 'Chapati/potatoes, fish/tofu, salad', calories: Math.round(calories * 0.30) },
      { meal: 'Snack', food: 'Fruit + whey/soy shake', calories: Math.round(calories * 0.10) }
    ],
    vegetarian: [
      { meal: 'Breakfast', food: 'Poha/upma + yogurt + fruit', calories: Math.round(calories * 0.25) },
      { meal: 'Lunch', food: 'Rice + dal + paneer + veggies', calories: Math.round(calories * 0.35) },
      { meal: 'Dinner', food: 'Chapati + chole/rajma + salad', calories: Math.round(calories * 0.30) },
      { meal: 'Snack', food: 'Milk + nuts + banana', calories: Math.round(calories * 0.10) }
    ],
    vegan: [
      { meal: 'Breakfast', food: 'Oats + soy milk + seeds + fruit', calories: Math.round(calories * 0.25) },
      { meal: 'Lunch', food: 'Rice + lentils + tofu + veggies', calories: Math.round(calories * 0.35) },
      { meal: 'Dinner', food: 'Chapati + chickpeas + salad', calories: Math.round(calories * 0.30) },
      { meal: 'Snack', food: 'Peanut butter sandwich / fruit', calories: Math.round(calories * 0.10) }
    ]
  };

  const plan = templates[dietaryPreference] || templates['balanced'];

  res.json({ calories, dietaryPreference, plan, macros: { protein, fat, carbs } });
});

module.exports = router;
