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

app.post('/pose-data', (req, res) => {
  const { landmarks } = req.body;

  // Here, you would process the landmarks to determine exercises (e.g., squat, push-up)
  const status = analyzePose(landmarks);

  // Respond with the exercise status
  res.json({ status });
});

// Function to analyze pose (simplified example)
function analyzePose(landmarks) {
  // You would need to write specific logic to detect squats, push-ups, etc.
  // For example, check the angle between the knees to detect squats
  const squatDetected = checkSquat(landmarks);
  const pushUpDetected = checkPushUp(landmarks);

  if (squatDetected) {
    return 'Squat detected';
  } else if (pushUpDetected) {
    return 'Push-up detected';
  }

  return 'No exercise detected';
}

// Dummy functions for squat and push-up detection
function checkSquat(landmarks) {
  // Logic to detect squat based on joint positions
  return false;
}

function checkPushUp(landmarks) {
  // Logic to detect push-up based on joint positions
  return false;
}


module.exports = router;