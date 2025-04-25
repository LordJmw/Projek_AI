const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const router = express.Router();

router.get("/recommend-daily-meals", async (req, res) => {
  try {
    const { diet = "", exclude = "" } = req.query;
    const mealTimes = ["breakfast", "lunch", "dinner"];
    const dailyMeals = [];

    for (const meal of mealTimes) {
      // First get recipe ID
      const searchParams = {
        query: meal,
        diet,
        excludeIngredients: exclude,
        number: 1,
        addRecipeInformation: true,
        addRecipeNutrition: true, // This ensures nutrition data comes with the recipe
        fillIngredients: true,
        apiKey: process.env.SPOONACULAR_API_KEY,
        intolerances: exclude.includes('dairy') ? 'dairy' : '', // Better handling for lactose intolerance
      };

      const mealResp = await axios.get(
        "https://api.spoonacular.com/recipes/complexSearch",
        { params: searchParams }
      );

      const recipe = mealResp.data.results[0];
      if (!recipe) continue;

      // Get detailed nutrition using the recipe ID
      const nutritionResp = await axios.get(
        `https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json`,
        {
          params: {
            apiKey: process.env.SPOONACULAR_API_KEY,
          },
        }
      );

      dailyMeals.push({
        mealType: meal,
        title: recipe.title,
        link: `https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id}`,
        readyInMinutes: recipe.readyInMinutes || 'N/A',
        nutrition: {
          calories: nutritionResp.data.calories || recipe.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || "N/A",
          carbs: nutritionResp.data.carbs || recipe.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || "N/A",
          protein: nutritionResp.data.protein || recipe.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || "N/A",
          fat: nutritionResp.data.fat || recipe.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || "N/A",
        },
      });
    }

    res.json({ meals: dailyMeals });
  } catch (error) {
    console.error("Error fetching daily meals:", error);
    res.status(500).json({ 
      error: "Failed to generate daily meal plan",
      details: error.response?.data?.message || error.message 
    });
  }
});

router.post("/recommend-by-calories", async (req, res) => {
  try {
    const { targetCalories, diet, exclude } = req.body;
    
    const response = await axios.get(
      "https://api.spoonacular.com/mealplanner/generate",
      {
        params: {
          targetCalories: Math.floor(targetCalories), // Ensure integer value
          timeFrame: "day",
          diet,
          excludeIngredients: exclude,
          intolerances: exclude.includes('dairy') ? 'dairy' : '',
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    // Enhanced meal data with nutrition for each meal
    const enrichedMeals = await Promise.all(
      response.data.meals.map(async (meal) => {
        try {
          const nutritionResp = await axios.get(
            `https://api.spoonacular.com/recipes/${meal.id}/nutritionWidget.json`,
            {
              params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
              },
            }
          );

          return {
            title: meal.title,
            link: `https://spoonacular.com/recipes/${meal.title.replace(/ /g, "-")}-${meal.id}`,
            readyInMinutes: meal.readyInMinutes,
            servings: meal.servings,
            nutrition: {
              calories: nutritionResp.data.calories || "N/A",
              carbs: nutritionResp.data.carbs || "N/A",
              protein: nutritionResp.data.protein || "N/A",
              fat: nutritionResp.data.fat || "N/A",
            },
          };
        } catch (nutritionError) {
          console.error(`Failed to get nutrition for ${meal.title}:`, nutritionError);
          return {
            title: meal.title,
            link: `https://spoonacular.com/recipes/${meal.title.replace(/ /g, "-")}-${meal.id}`,
            readyInMinutes: meal.readyInMinutes,
            servings: meal.servings,
            nutrition: {
              calories: "N/A",
              carbs: "N/A",
              protein: "N/A",
              fat: "N/A",
            },
          };
        }
      })
    );

    res.json({
      targetCalories,
      nutrients: response.data.nutrients,
      meals: enrichedMeals,
    });
  } catch (error) {
    console.error("Error recommending by calories:", error);
    res.status(500).json({ 
      error: "Could not recommend food based on calories",
      details: error.response?.data?.message || error.message 
    });
  }
});

router.post("/meals-by-calories", async (req, res) => {
  try {
    const { targetCalories, diet = "", exclude = "" } = req.body;
    const minCalories = targetCalories - 100;
    const maxCalories = targetCalories + 100;

    const searchParams = {
      minCalories,
      maxCalories,
      number: 5,
      diet,
      excludeIngredients: exclude,
      addRecipeInformation: true,
      addRecipeNutrition: true,
      apiKey: process.env.SPOONACULAR_API_KEY,
    };

    const response = await axios.get(
      "https://api.spoonacular.com/recipes/complexSearch",
      { params: searchParams }
    );

    const enrichedMeals = await Promise.all(
      response.data.results.map(async (recipe) => {
        const nutritionResp = await axios.get(
          `https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json`,
          { params: { apiKey: process.env.SPOONACULAR_API_KEY } }
        );

        return {
          title: recipe.title,
          link: `https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id}`,
          readyInMinutes: recipe.readyInMinutes,
          nutrition: {
            calories: nutritionResp.data.calories || "N/A",
            carbs: nutritionResp.data.carbs || "N/A",
            protein: nutritionResp.data.protein || "N/A",
            fat: nutritionResp.data.fat || "N/A",
          },
        };
      })
    );

    res.json({ meals: enrichedMeals });
  } catch (error) {
    console.error("Error fetching meals by calories:", error);
    res.status(500).json({
      error: "Could not fetch meals around specified calories",
      details: error.response?.data?.message || error.message,
    });
  }
});

router.post("/analyze-food", async (req, res) => {
  try {
    const { food } = req.body;
    const labels = [
      "high-protein",
      "high-carb",
      "high-fat",
      "low-carb",
      "contains dairy",
      "vegetarian",
      "vegan",
      "gluten-free"
    ];

    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        inputs: food,
        parameters: { candidate_labels: labels }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        }
      }
    );

    const strongLabels = hfResponse.data.labels
      .map((label, index) => ({
        label,
        score: hfResponse.data.scores[index]
      }))
      .filter(item => item.score > 0.6)
      .map(item => item.label);

    let diet = "";
    let excludeIngredients = [];

    if (strongLabels.includes("high-fat")) {
      diet = "low-fat";
      excludeIngredients.push("butter", "cheese", "cream", "oil");
    }
    if (strongLabels.includes("contains dairy")) {
      excludeIngredients.push("milk", "yogurt", "cheese", "cream");
    }

    const spoonResponse = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
      params: {
        query: food,
        diet,
        excludeIngredients: excludeIngredients.join(","),
        number: 1,
        apiKey: process.env.SPOONACULAR_API_KEY
      }
    });

    const result = spoonResponse.data.results[0] || null;

    const foodNutrition = await axios.get("https://api.spoonacular.com/recipes/guessNutrition", {
      params: {
        title: food,
        apiKey: process.env.SPOONACULAR_API_KEY,
      },
    });
      
    const foodNutritionInfo = {
      calories: foodNutrition.data.calories?.value || "N/A",
      carbs : foodNutrition.data.carbs?.value || "NA",
      protein: foodNutrition.data.protein?.value || "N/A",
      fat: foodNutrition.data.fat?.value || "N/A",
    };
      

    return res.json({
      original: food,
      tags: strongLabels,
      suggestion: result
        ? {
            title: result.title,
            link: `https://spoonacular.com/recipes/${result.title.replace(/ /g, "-")}-${result.id}`
          }
        : "No healthier alternative found",
      nutrition : foodNutritionInfo
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

function calculateAngle(a, b, c) {
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const cb = { x: b.x - c.x, y: b.y - c.y };
  
  const dot = (ab.x * cb.x + ab.y * cb.y);
  const cross = (ab.x * cb.y - ab.y * cb.x);
  
  const angle = Math.atan2(cross, dot) * (180 / Math.PI);
  return angle;
}

router.post("/analyze-pushup", async (req, res) => {
  const { keypoints } = req.body;

  if (!keypoints) {
    return res.status(400).json({ message: "Missing keypoints data" });
  }

  try {
    // Find keypoints by name (MediaPipe BlazePose model)
    const landmarks = {};
    keypoints.forEach(kp => {
      landmarks[kp.name] = kp;
    });

    // Basic push-up form analysis
    let isProperForm = true;
    let tips = [];
    
    // Check shoulder-hip-ankle alignment (should be roughly straight)
    if (landmarks.left_shoulder && landmarks.left_hip && landmarks.left_ankle) {
      const angle = calculateAngle(
        landmarks.left_shoulder,
        landmarks.left_hip,
        landmarks.left_ankle
      );
      
      if (Math.abs(angle) > 15) {
        isProperForm = false;
        tips.push("Keep your body straight - don't arch your back");
      }
    }
    
    // Check elbow angle (should be about 90 degrees at bottom)
    if (landmarks.left_shoulder && landmarks.left_elbow && landmarks.left_wrist) {
      const angle = calculateAngle(
        landmarks.left_shoulder,
        landmarks.left_elbow,
        landmarks.left_wrist
      );
      
      if (angle < 70) {
        tips.push("Go deeper in your push-up for full range of motion");
      }
    }

    res.status(200).json({
      message: "Push-up form analyzed successfully",
      isProperForm,
      tips: tips.length > 0 ? tips.join(". ") : "Good form! Keep it up!"
    });
  } catch (error) {
    console.error("Error analyzing push-up:", error);
    res.status(500).json({ message: "Error analyzing push-up form" });
  }
});

router.post("/analyze-squat", async (req, res) => {
  const { keypoints } = req.body;

  if (!keypoints) {
    return res.status(400).json({ message: "Missing keypoints data" });
  }

  try {
    const landmarks = {};
    keypoints.forEach(kp => {
      landmarks[kp.name] = kp;
    });

    let isProperForm = true;
    let tips = [];
    
    // Check knee alignment (shouldn't cave inward)
    if (landmarks.left_hip && landmarks.left_knee && landmarks.left_ankle) {
      const angle = calculateAngle(
        landmarks.left_hip,
        landmarks.left_knee,
        landmarks.left_ankle
      );
      
      if (angle < 160) {
        isProperForm = false;
        tips.push("Keep your knees aligned with your toes - don't let them cave inward");
      }
    }
    
    // Check depth (hip should go below knee level)
    if (landmarks.left_hip && landmarks.left_knee) {
      if (landmarks.left_hip.y < landmarks.left_knee.y) {
        tips.push("Go deeper - hips should descend below knee level");
      }
    }

    res.status(200).json({
      message: "Squat form analyzed successfully",
      isProperForm,
      tips: tips.length > 0 ? tips.join(". ") : "Good squat form! Maintain this technique."
    });
  } catch (error) {
    console.error("Error analyzing squat:", error);
    res.status(500).json({ message: "Error analyzing squat form" });
  }
});


module.exports = router;