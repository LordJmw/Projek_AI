<template>
    <div class="mt-10">
      <div class="flex justify-between items-center">
        <span class="font-bold text-lg">
          Need coaching on meals? you can chat me!
        </span>
        <span @click="toggleChat" class="cursor-pointer text-gray-800">
          Click me If you need my help!
        </span>
      </div>
  
      <transition name="fade">
        <div v-if="showChat" class="mt-4 w-full border rounded-2xl shadow-lg p-4 bg-white">
          <div class="h-64 overflow-y-auto mb-2 space-y-2" ref="chatMessages">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'"
            >
              <div
                :class="msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
                class="inline-block max-w-[80%] px-4 py-2 rounded-xl break-words"
              >
              <div v-html="msg.text.replace(/\n/g, '<br>')" />
              </div>
            </div>
          </div>
  
          <div class="flex">
            <input
              type="text"
              v-model="userInput"
              @keyup.enter="sendMessage"
              placeholder="eg : Tell me food that is around 500 kcal/ Recommend me food for the whole day based on my tee"
              class="flex-grow border rounded-l-xl px-4 py-2 focus:outline-none"
            />
            <button
              @click="sendMessage"
              class="bg-blue-500 text-white px-4 py-2 rounded-r-xl hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </transition>
    </div>
  </template>

<script setup>
import { ref, nextTick,onMounted } from 'vue'
import api from '@/services/api'
const showChat = ref(false)
const userInput = ref('')
const messages = ref([])
const chatMessages = ref(null)

const parseUserInput = (text) => {
const lower = text.toLowerCase()
const isDaily = /daily|whole day|recommend/.test(lower)
const isCalories = /(\d+)\s*(kcal|calories)/.test(lower)
const user = ref(null)
const tee = ref(0)

const dietPatterns = ['vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo']
const excludePatterns = ['lactose', 'dairy', 'nuts', 'gluten']


const calculateTDEE = (user) => {
    const today = new Date()
    const birthDate = new Date(user.birthdate)
    const age = today.getFullYear() - birthDate.getFullYear()

    const weight = user.weight
    const height = user.height
    const gender = user.gender
    const activity = getActivityMultiplier(user.daily_activity_category)
    const goal = user.goal

    let bmr = 0
    if (gender === 'm') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    if (goal === "cut") {
        return Math.round(bmr * activity - 500)
    } else if (goal === "bulk") {
        return Math.round(bmr * activity + 500)
    }
    return Math.round(bmr * activity)
}

let diet = ''
let exclude = []

for (const pattern of dietPatterns) {
  if (lower.includes(pattern)) {
    diet = pattern
    break
  }
}

for (const pattern of excludePatterns) {
  if (lower.includes(pattern)) {
    if (pattern === 'lactose' || pattern === 'dairy') {
      exclude.push('milk', 'cheese', 'yogurt', 'cream', 'butter')
    } else {
      exclude.push(pattern)
    }
  }
}

const calorieMatch = lower.match(/(\d+)\s*(?:kcal|calories)/)
const targetCalories = calorieMatch ? parseInt(calorieMatch[1]) : null

return {
  intent: isDaily ? 'daily' : isCalories ? 'calories' : 'unknown',
  diet,
  exclude,
  targetCalories,
  }
}

const toggleChat = () => {
showChat.value = !showChat.value
if (showChat.value && messages.value.length === 0) {
  messages.value.push({ sender: 'ai', text: 'Hello! Anything I Can Help With?' })
}
nextTick(() => {
  scrollToBottom()
})
}

const sendMessage = async () => {
  const text = userInput.value.trim();
  if (!text) return;

  // Add user message and clear input
  messages.value.push({ sender: 'user', text });
  userInput.value = '';

  // Show typing indicator
  messages.value.push({ sender: 'ai', text: 'Typing...', isLoading: true });
  
  try {
    const { intent, diet, exclude, targetCalories } = parseUserInput(text);
    let aiText = "I couldn't understand your request. Try asking for meal recommendations or specific calorie-based meals.";

    if (intent === 'daily') {
      const { data } = await api.get(
        `/ai/recommend-daily-meals?diet=${diet}&exclude=${exclude.join(',')}`
      );

      if (data.meals?.length) {
        aiText = `Here's your personalized ${diet || ''}${diet && exclude.length ? ', ' : ''}${exclude.length ? 'allergy-friendly' : ''} meal plan:\n\n`;
        
        data.meals.forEach(meal => {
          aiText += `🍽️ ${meal.mealType.toUpperCase()}: ${meal.title}\n`;
          aiText += `⏱️ Ready in: ${meal.readyInMinutes || 'N/A'} mins\n`;
          
          // Nutrition information
          if (meal.nutrition) {
            aiText += `📊 Nutrition per serving:\n`;
            aiText += `• Calories: ${meal.nutrition.calories || 'N/A'} kcal\n`;
            aiText += `• Protein: ${meal.nutrition.protein || 'N/A'}g\n`;
            aiText += `• Carbs: ${meal.nutrition.carbohydrates || 'N/A'}g\n`;
            aiText += `• Fat: ${meal.nutrition.fat || 'N/A'}g\n`;
          } else {
            aiText += `📊 Nutrition information not available\n`;
          }
          
          aiText += `🔗 Recipe: ${meal.link}\n\n`;
        });
      } else {
        aiText = "I couldn't find meals matching your requirements. Try being less specific or check back later.";
      }
    } else if (intent === 'calories' && targetCalories) {
      const { data } = await api.post('/ai/recommend-by-calories', {
        targetCalories,
        diet,
        exclude: exclude.join(','),
      });

      if (data.meals?.length) {
        aiText = `Here's a ${data.targetCalories} kcal meal plan:\n\n`;
        data.meals.forEach(meal => {
          aiText += `🍽️ ${meal.title}\n`;
          aiText += `⏱️ Ready in: ${meal.readyInMinutes || 'N/A'} mins\n`;
          
          if (meal.nutrition) {
            aiText += `📊 Nutrition per serving:\n`;
            aiText += `• Calories: ${meal.nutrition.calories || 'N/A'} kcal\n`;
            aiText += `• Protein: ${meal.nutrition.protein || 'N/A'}g\n`;
            aiText += `• Carbs: ${meal.nutrition.carbohydrates || 'N/A'}g\n`;
            aiText += `• Fat: ${meal.nutrition.fat || 'N/A'}g\n`;
          }
          
          aiText += `🔗 Recipe: ${meal.link}\n\n`;
        });
        
        if (data.nutrients) {
          aiText += `📈 Daily totals:\n`;
          aiText += `• Calories: ${data.nutrients.calories || 'N/A'} kcal\n`;
          aiText += `• Protein: ${data.nutrients.protein || 'N/A'}g\n`;
          aiText += `• Carbs: ${data.nutrients.carbohydrates || 'N/A'}g\n`;
          aiText += `• Fat: ${data.nutrients.fat || 'N/A'}g\n\n`;
        }
      } else {
        aiText = `I couldn't find meals around ${targetCalories} calories. Try a different calorie amount.`;
      }
    }

    // Remove typing indicator and add actual response
    messages.value = messages.value.filter(msg => !msg.isLoading);
    messages.value.push({ sender: 'ai', text: aiText });
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Remove typing indicator
    messages.value = messages.value.filter(msg => !msg.isLoading);
    
    let errorMessage = 'Sorry, I encountered an error. Please try again later.';
    
    if (error.response) {
      if (error.response.status === 429) {
        errorMessage = "I'm getting too many requests right now. Please wait a minute and try again.";
      } else if (error.response.status === 404) {
        errorMessage = "I couldn't find any matching recipes. Try different requirements.";
      }
    }
    
    messages.value.push({ sender: 'ai', text: errorMessage });
  } finally {
    scrollToBottom();
  }
};

const scrollToBottom = () => {
nextTick(() => {
  const el = chatMessages.value
  if (el) el.scrollTop = el.scrollHeight
})
}


onMounted(async () => {
    const token = localStorage.getItem("token")
    const response = await api.get("/users/user-data",{
        headers : {
            Authorization : `Bearer ${token}`
        }
    })

    userData.value = response.data.user

    tee.value = calculateTDEE(userData.value)
  })
</script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  