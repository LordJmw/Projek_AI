<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import Profile from '@/components/DietPageComponents/profile.vue'
import TextTyping from '@/components/DietPageComponents/text_typing.vue'
import notificationF from '@/components/DietPageComponents/notification_false.vue'
import search from '@/components/DietPageComponents/search.vue'
import calender from '@/components/DietPageComponents/calender.vue'
import ChatAi from '@/components/DietPageComponents/chat_ai.vue'
import axios from 'axios'
import api from '@/services/api'

const showDropdown = ref(false)
let tee = ref(0)
let userData = ref(null)
const isLoading = ref(false) // Status loading

const totalKaloriTerpakai = computed(() => {
    return waktuMakan.value.reduce((total, waktu) => {
        return total + waktu.meals.reduce((sum, meal) => sum + meal.calories, 0)
    }, 0)
})

const sisaKalori = computed(() => {
    let sisa = tee.value - totalKaloriTerpakai.value
    if(sisa < 0) {
        return `surplus ${(sisa*-1)} kcal from target ${calculateTDEE(userData.value)}`
    }
    return sisa
})

const hideInputAfterSave = (waktu) => {
    waktu.showInput = false
    waktu.inputValue = '' // Reset input value
    waktu.warning = ''
}


const waktuMakan = ref([
    { id: 'breakfast', label: 'Breakfast', icon: '🌅', showInput: false, inputValue: '', meals: [], warning : "" },
    { id: 'lunch', label: 'Lunch', icon: '☀️', showInput: false, inputValue: '', meals: [], warning : "" },
    { id: 'dinner', label: 'Dinner', icon: '🌙', showInput: false, inputValue: '', meals: [], warning : "" },
    { id: 'snack', label: 'Snack/Others', icon: '🍪', showInput: false, inputValue: '', meals: [], warning : "" },
])

const toggleInput = (id) => {
    const waktu = waktuMakan.value.find((item) => item.id === id)
    if (!waktu) return
    
    waktu.warning = ''
    
    if (totalKaloriTerpakai.value > calculateTDEE(userData.value)) {
        waktu.warning = "⚠️ You've exceeded your daily target!"
        waktu.inputValue = "⚠️ You've exceeded your daily target!"
    }
    
    waktu.showInput = !waktu.showInput
}

const getActivityMultiplier = (activityLevel) => {
    switch (activityLevel) {
        case 'Little/No Activity': return 1.2
        case 'Moderately Active': return 1.55
        case 'Very Active': return 1.725
        default: return 1.2
    }
}

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

const showFoodSuggestion = ref(false);
const currentMealData = ref(null);
const currentMealType = ref('');
const currentWaktu = ref(null);

const saveFoodEaten = async (type, meal, waktu) => {
    isLoading.value = true;
    try {
        const responseA = await api.post("/ai/analyze-food", { food: meal });

        if (userData.value !== null) {
            if (responseA.data.suggestion && responseA.data.suggestion.title) {
                currentMealData.value = {
                    ...responseA.data,
                    original: meal 
                };
                currentMealType.value = type;
                currentWaktu.value = waktu;
                showFoodSuggestion.value = true;
            } else {
                await saveToDatabase(type, meal, responseA.data.nutrition, waktu);
            }
        }
    } catch (error) {
        console.error("Gagal menganalisis makanan:", error);
    } finally {
        isLoading.value = false;
    }
};

const saveToDatabase = async (type, name, nutrition, waktu) => {
    try {
        const userId = userData.value.id;
        const payload = {
            name: name,
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            fat: nutrition.fat,
            meal_type: type
        };
        
        await api.post(`/users/user-meal/${userId}`, payload);
        await getSavedMeals();
        hideInputAfterSave(waktu);
    } catch (error) {
        console.error("Gagal menyimpan makanan:", error);
    }
};

const handleSuggestionChoice = async (useSuggestion) => {
    if (useSuggestion && currentMealData.value.suggestion) {
        await saveToDatabase(
            currentMealType.value,
            currentMealData.value.suggestion.title,
            currentMealData.value.nutrition,
            currentWaktu.value
        );
    } else {
        await saveToDatabase(
            currentMealType.value,
            currentMealData.value.original,
            currentMealData.value.nutrition,
            currentWaktu.value
        );
    }
    
    showFoodSuggestion.value = false;
};

const getSavedMeals = async () => {
    try {
        const response = await api.get(`/users/user-meal/${userData.value.id}`)

        // Clear previous meals
        waktuMakan.value.forEach(waktu => waktu.meals = [])

        response.data.forEach(meal => {
            const waktu = waktuMakan.value.find(item => item.id === meal.meal_type)
            if (waktu) {
                console.log("Menambahkan meal ke:", waktu.id)
                waktu.meals.push({
                    id: meal.id,
                    name: meal.name,
                    calories: meal.calories,
                    protein: meal.protein,
                    carbs: meal.carbs,
                    fat: meal.fat,
                })
            }
        })
    } catch (error) {
        console.error("Error fetching saved meals:", error)
    }
}

const kurangiKalori = async (id, meal_type) => {
    const waktu = waktuMakan.value.find((item) => item.id === id)
    if (waktu && waktu.inputValue.trim()) {
        await saveFoodEaten(id, waktu.inputValue, waktu, meal_type.toLowerCase())
        waktu.showInput = false  
        waktu.inputValue = ''    
    }
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
    await getSavedMeals()

    console.log("User berhasil dimuat:", userData.value)
})

const deleteMeal = async (mealId, mealType) => {
    try {
        isLoading.value = true;
        await axios.delete(`http://localhost:3000/users/user-meal/${userData.value.id}/${mealId}`);
        await getSavedMeals();
        console.log("Makanan berhasil dihapus");
    } catch (error) {
        console.error("Gagal menghapus makanan:", error.response?.data || error.message);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div>
        <div class="flex flex-col min-h-screen">
        <header>
            <nav class="flex justify-between bg-green-400 items-center p-1 white relative">
                <div class="flex items-center gap-4 white p-4 rounded relative">
                    <div @click="toggleDropdown" class="cursor-pointer relative">
                        <Profile />
                    </div>

                    <div v-if="showDropdown" class="absolute top-16 left-0 mt-2 w-48 bg-white rounded shadow-md z-50">
                        <ul class="py-2 text-sm text-gray-700">
                            <li>
                                <a href="#" class="block px-4 py-2 hover:bg-gray-100">Account Settings</a>
                            </li>
                            <li></li>
                            <li>
                                <a href="#" class="block px-4 py-2 hover:bg-gray-100">Logout</a>
                            </li>
                        </ul>
                    </div>

                    <TextTyping />
                </div>

                <div class='flex gap-3 items-center'>
                    <search />
                    <notificationF />
                </div>
            </nav>
            <div>
                <calender />
            </div>
        </header>
        <main class='bg-gray-100 p-5 font-sans'>
            <div class="flex items-center justify-between bg-green-700 p-4 rounded-xl mb-5 relative text-white">
                <div v-if="userData">
                    <div class="text-sm font-bold">Calories Left ({{ userData.goal }})</div>
                    <div class="text-xs">Calories Consumed</div>
                </div>
                <div class="flex flex-col items-end">
                    <div class="text-lg font-bold mb-1">{{ sisaKalori }}</div>
                    <div class="absolute bottom-2 right-5 text-sm">Total: {{ totalKaloriTerpakai }} kcal</div>
                </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-sm" v-for="waktu in waktuMakan" :key="waktu.id">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-3">{{ waktu.icon }}</span>
                        <span class="text-base font-bold text-gray-800">{{ waktu.label }}</span>
                    </div>
                    <button @click="toggleInput(waktu.id)" class="text-green-600 text-2xl font-bold focus:outline-none cursor-pointer">+</button>
                </div>

                <div v-for="(meal, index) in waktu.meals" :key="index" class="border-b border-gray-200 pb-2 relative">
                    <p class="font-semibold mb-2">Food: {{ meal.name }}</p>
                    <p v-if="meal.calories !== null">Kalori: {{ meal.calories }} kcal</p>
                    <p v-if="meal.protein !== null">Protein: {{ meal.protein }} g</p>
                    <p v-if="meal.carbs !== null">Karbohidrat: {{ meal.carbs }} g</p>
                    <p v-if="meal.fat !== null">Lemak: {{ meal.fat }} g</p>
                    
                    <button 
                        @click="deleteMeal(meal.id, waktu.id)"
                        class="absolute top-0 right-0 text-red-500 hover:text-red-700"
                        :disabled="!meal.id || isLoading"
                    >
                        ✕
                    </button>
                </div>

                <div v-if="waktu.showInput" class="mt-3">
                    <label class="block text-sm text-gray-700 mb-1">Input Your {{ waktu.label }} (english)</label>
                    <input
                        type="text"
                        :placeholder="waktu.warning || `Masukkan makan ${waktu.id}...`"
                        :value="waktu.inputValue"
                        class="w-full p-2 border border-gray-300 rounded-md mb-2"
                        :class="{ 'border-red-500': waktu.warning }"
                        @focus="waktu.inputValue = ''; waktu.warning = ''"
                        v-model="waktu.inputValue"
                    />
                    <p v-if="waktu.warning" class="text-red-500 text-sm mb-2">{{ waktu.warning }}</p>
                    <button
                        class="w-full py-2 rounded-md text-white bg-green-500 transition-all mt-2"
                        :class="{
                            'opacity-50 cursor-not-allowed': !waktu.inputValue.trim() || isLoading,
                        }"
                        :disabled="!waktu.inputValue.trim() || isLoading"
                        @click="kurangiKalori(waktu.id, waktu.label)"
                    >
                        <span v-if="isLoading">Loading...</span>
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>

            <ChatAi />
        </main>   
    </div>
    
    <template v-if="showFoodSuggestion && currentMealData?.suggestion">
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-bold mb-4">Healthy Food Suggestion</h3>
                
                <p class="mb-2">This Food is not Ideal for Your Program:</p>
                <p class="font-semibold">{{ currentMealData.original }}</p>
                
                <div class="my-4 p-3 bg-green-50 rounded border border-green-200">
                    <p class="font-bold text-green-700">Our Suggestion:</p>
                    <p>{{ currentMealData.suggestion.title }}</p>
                    <a :href="currentMealData.suggestion.link" 
                        target="_blank" 
                        class="text-blue-500 text-sm hover:underline">
                        See Recipe
                    </a>
                </div>
                
                <div class="flex justify-between mt-4">
                    <button 
                        @click="handleSuggestionChoice(false)"
                        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Save Previous Meal {{ currentMealData.original }}
                    </button>
                    <button 
                        @click="handleSuggestionChoice(true)"
                        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Use Suggestion
                    </button>
                </div>
            </div>
        </div>
    </template>
    </div>
</template>