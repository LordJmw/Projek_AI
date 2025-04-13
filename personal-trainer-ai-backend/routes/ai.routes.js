const express =  require("express")
const OpenAI = require("openai")
const dotenv =  require("dotenv")

dotenv.config();

const router = express.Router();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/analyze-food", async (req, res) => {
  const { foodInput } = req.body;

  if (!foodInput) {
    return res.status(400).json({ message: "Food input is required" });
  }

  const prompt = `
    Analyze the following food items for total nutrition:
    "${foodInput}"
    Return estimated total calories, carbs (g), protein (g), fat (g).
    Format like:
    - Calories: 
    - Carbs: 
    - Protein: 
    - Fat:
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // You can also use gpt-4 if needed
      messages: [
        { role: "system", content: "You are a nutritionist." },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 200,
    });

    const result = response.choices[0].message.content.trim();
    res.status(200).json({ result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to analyze food input." });
  }
});

module.exports = router