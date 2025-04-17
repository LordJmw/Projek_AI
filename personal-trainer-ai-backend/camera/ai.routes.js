const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const router = express.Router();

router.post("/analyze-food", async (req, res) => {
  const { food } = req.body;
  console.log("API KEY:", process.env.SPOONACULAR_API_KEY); // Just for sanity

  try {
    const response = await axios.get("https://api.spoonacular.com/recipes/guessNutrition", {
      params: {
        title: food,
        apiKey: process.env.SPOONACULAR_API_KEY,
      },
    });

    const foodNutritionInfo = response.data;

    res.status(200).json({
      nutrition_info: foodNutritionInfo,
    });
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).json({
      message: "internal server error",
    });
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