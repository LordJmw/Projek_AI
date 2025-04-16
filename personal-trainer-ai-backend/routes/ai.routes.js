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

module.exports = router;