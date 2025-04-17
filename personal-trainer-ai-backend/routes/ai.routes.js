const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const router = express.Router();

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

router.post("/analyze-pushup", async (req, res) => {
  const { keypoints } = req.body; // keypoints dari frontend / mediapipe

  if (!keypoints) {
    return res.status(400).json({ message: "Missing keypoints data" });
  }

  // Di sini nanti kamu bisa analisis postur berdasarkan keypoints dari MediaPipe
  // Dummy response
  res.status(200).json({
    message: "Push-up form analyzed successfully",
    isProperForm: true,
    tips: "Keep your back straight!",
  });
});

// === Dummy Analyze Squat Form ===
router.post("/analyze-squat", async (req, res) => {
  const { keypoints } = req.body;

  if (!keypoints) {
    return res.status(400).json({ message: "Missing keypoints data" });
  }

  res.status(200).json({
    message: "Squat form analyzed successfully",
    isProperForm: false,
    tips: "Lower your hips more!",
  });
});


module.exports = router;