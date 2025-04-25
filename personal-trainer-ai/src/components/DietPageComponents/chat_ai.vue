<template>
    <div class="mt-10">
      <div class="flex justify-between items-center">
        <span class="font-bold text-lg">
          Need coaching on meals? you can chat me! I'm a meal chatbot!
        </span>
        <span @click="toggleChat" class="cursor-pointer text-gray-800 underline">
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
              placeholder="eg : Tell me food that is around 500 kcal/ Recommend me food for the whole day based on my tee (use calories/kcal)"
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
import { ref, nextTick, onMounted } from 'vue'
import api from '@/services/api'

const showChat = ref(false)
const userInput = ref('')
const messages = ref([])
const chatMessages = ref(null)
const userData = ref(null)
const tdee = ref(null) // Changed to null to distinguish from 0

// Activity level multipliers
const activityMultipliers = {
  'sedentary': 1.2,
  'light': 1.375,
  'moderate': 1.55,
  'active': 1.725,
  'very_active': 1.9
}

const calculateTDEE = (user) => {
  if (!user || !user.birthdate || !user.weight || !user.height || !user.gender) {
    console.error('Missing required user data for TDEE calculation')
    return null
  }

  try {
    const today = new Date()
    const birthDate = new Date(user.birthdate)
    let age = today.getFullYear() - birthDate.getFullYear()
    // Adjust age if birthday hasn't occurred yet this year
    if (today.getMonth() < birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--
    }

    const weight = parseFloat(user.weight)
    const height = parseFloat(user.height)
    const gender = user.gender
    const activityLevel = user.daily_activity_category?.toLowerCase() || 'sedentary'
    const multiplier = activityMultipliers[activityLevel] || 1.2
    const goal = user.goal?.toLowerCase()

    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age)
    bmr += gender === 'm' ? 5 : -161

    let calculatedTdee = Math.round(bmr * multiplier)

    // Adjust for goals
    if (goal === "cut") {
      calculatedTdee -= 500
    } else if (goal === "bulk") {
      calculatedTdee += 500
    }

    console.log('Calculated TDEE:', calculatedTdee)
    return calculatedTdee
  } catch (error) {
    console.error('Error calculating TDEE:', error)
    return null
  }
}

const parseUserInput = (text) => {
  const lower = text.toLowerCase()
  const isDaily = /daily|whole day|recommend/.test(lower)
  const isCalories = /(\d+)\s*(kcal|calories)/.test(lower)
  const isTEE = /tee|tdee|energy expenditure|maintenance calories|my calories/i.test(lower)

  const dietPatterns = ['vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo','high-protein']
  const excludePatterns = ['lactose', 'dairy', 'nuts', 'nut', 'seafood', 'fish', 'shrimp' , 'gluten']

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
      } 
      else if (pattern === 'seafood') {
        exclude.push('fish', 'shrimp', 'crab', 'lobster', 'clams', 'oyster', 'scallop', 'anchovy', 'sardine', 'mackerel', 'tuna', 'salmon')
      }
      else {
        exclude.push(pattern)
      }
    }
  }

  const calorieMatch = lower.match(/(\d+)\s*(?:kcal|calories)/)
  let targetCalories = calorieMatch ? parseInt(calorieMatch[1]) : null

  // If user asks for TEE-based recommendations and we have calculated TDEE
  if (isTEE && tdee.value !== null) {
    targetCalories = tdee.value
  }

  return {
    intent: isDaily ? 'daily' : isCalories ? 'calories' : 'unknown',
    diet,
    exclude,
    targetCalories,
    isTEEBased: isTEE
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
  const text = userInput.value.trim()
  if (!text) return

  messages.value.push({ sender: 'user', text })
  userInput.value = ''

  // Show typing indicator
  messages.value.push({ sender: 'ai', text: 'Typing...', isLoading: true })
  
  try {
    const { intent, diet, exclude, targetCalories, isTEEBased } = parseUserInput(text)
    let aiText = "I couldn't understand your request. Try asking for meal recommendations or specific calorie-based meals."

    // Handle case where user asks for TDEE but it's not available
    if (isTEEBased && tdee.value === null) {
      aiText = "I couldn't calculate your daily energy needs (TDEE). Please make sure your profile information (weight, height, age, etc.) is complete."
    }

    // Handle calorie-based requests (either specific number or TDEE)
    else if ((intent === 'calories' && targetCalories) || isTEEBased) {
      const caloriesToUse = isTEEBased ? tdee.value : targetCalories
      const targetURL = isTEEBased ? '/ai/recommend-by-calories' : '/ai/meals-by-calories'
      const { data } = await api.post(targetURL, {
        targetCalories: caloriesToUse,
        diet,
        exclude: exclude.join(','),
      })

      if (data.meals?.length) {
        aiText = isTEEBased ? `Here's a ${caloriesToUse} kcal meal plan based on your TDEE \n\n` : `Here are some meals around ${caloriesToUse} kcal\n\n`

        data.meals.forEach(meal => {
          aiText += `🍽️ ${meal.title}\n`
          aiText += `⏱️ Ready in: ${meal.readyInMinutes || 'N/A'} mins\n`
          
          if (meal.nutrition) {
            aiText += `📊 Nutrition per serving:\n`
            aiText += `• Calories: ${meal.nutrition.calories || 'N/A'} kcal\n`
            aiText += `• Protein: ${meal.nutrition.protein || 'N/A'}\n`
            aiText += `• Carbs: ${meal.nutrition.carbohydrates || 'N/A'}\n`
            aiText += `• Fat: ${meal.nutrition.fat || 'N/A'}\n`
          }
          
          aiText += `🔗 Recipe: ${meal.link}\n\n`
        })
        
        if (data.nutrients && (isTEEBased || intent === 'daily')) {
          aiText += `📈 Daily totals:\n`
          aiText += `• Calories: ${data.nutrients.calories || 'N/A'} kcal\n`
          aiText += `• Protein: ${data.nutrients.protein || 'N/A'}g\n`
          aiText += `• Carbs: ${data.nutrients.carbohydrates || 'N/A'}g\n`
          aiText += `• Fat: ${data.nutrients.fat || 'N/A'}g\n\n`
        }
      } else {
        aiText = `I couldn't find meals around ${caloriesToUse} calories. Try a different calorie amount.`
      }
    }
    // Handle daily requests without specific calories
    else if (intent === 'daily') {
      const { data } = await api.get(
        `/ai/recommend-daily-meals?diet=${diet}&exclude=${exclude.join(',')}`
      )

      if (data.meals?.length) {
        aiText = `Here's your personalized ${diet || ''}${diet && exclude.length ? ', ' : ''}${exclude.length ? 'allergy-friendly' : ''} meal plan:\n\n`
        
        data.meals.forEach(meal => {
          aiText += `🍽️ ${meal.mealType.toUpperCase()}: ${meal.title}\n`
          aiText += `⏱️ Ready in: ${meal.readyInMinutes || 'N/A'} mins\n`
          
          if (meal.nutrition) {
            aiText += `📊 Nutrition per serving:\n`
            aiText += `• Calories: ${meal.nutrition.calories || 'N/A'} kcal\n`
            aiText += `• Protein: ${meal.nutrition.protein || 'N/A'}\n`
            aiText += `• Carbs: ${meal.nutrition.carbohydrates || 'N/A'}\n`
            aiText += `• Fat: ${meal.nutrition.fat || 'N/A'}\n`
          } else {
            aiText += `📊 Nutrition information not available\n`
          }
          
          aiText += `🔗 Recipe: ${meal.link}\n\n`
        })
      } else {
        aiText = "I couldn't find meals matching your requirements. Try being less specific or check back later."
      }
    }

    // Remove typing indicator and add response
    messages.value = messages.value.filter(msg => !msg.isLoading)
    messages.value.push({ sender: 'ai', text: aiText })
    
  } catch (error) {
    console.error('API Error:', error)
    messages.value = messages.value.filter(msg => !msg.isLoading)
    
    let errorMessage = 'Sorry, I encountered an error. Please try again later.'
    if (error.response) {
      if (error.response.status === 429) {
        errorMessage = "I'm getting too many requests. Please wait a minute and try again."
      } else if (error.response.status === 404) {
        errorMessage = "I couldn't find matching recipes. Try different requirements."
      }
    }
    
    messages.value.push({ sender: 'ai', text: errorMessage })
  } finally {
    scrollToBottom()
  }
}

onMounted(async () => {
  try {
    const token = localStorage.getItem("token")
    if (token) {
      const response = await api.get("/users/user-data", {
        headers: { Authorization: `Bearer ${token}` }
      })
      userData.value = response.data.user
      tdee.value = calculateTDEE(userData.value)
      console.log('User data loaded:', userData.value)
      console.log('Calculated TDEE:', tdee.value)
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error)
  }
})
</script>

