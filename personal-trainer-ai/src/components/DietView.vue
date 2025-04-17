<script setup>
import { ref,onMounted } from 'vue'
import Profile from '@/components/DietPageComponents/profile.vue'
import TextTyping from '@/components/DietPageComponents/text_typing.vue'
import notificationF from '@/components/DietPageComponents/notification_false.vue'
import search from  '@/components/DietPageComponents/search.vue'
import calender from '@/components/DietPageComponents/calender.vue'
import ChatAi from '@/components/DietPageComponents/chat_ai.vue'
import api from '@/services/api'
import axios from 'axios'

const showDropdown = ref(false)
let tee = ref(0)
let userData = ref(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const getActivityMultiplier = (activityLevel) => {
  switch (activityLevel) {
    case 'Little/No Activity': return 1.2
    case 'A Little Active': return 1.375
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

  console.log(birthDate,age,weight,height,gender,activity,goal)

  let bmr = 0
  if (gender === 'm') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  if(goal == "cut"){
    return Math.round(bmr*activity - 500)
  }
  else if(goal == "bulk"){
    return Math.round(bmr*activity + 500)
  }
  return Math.round(bmr * activity)
}

onMounted(async () => {
    const token = localStorage.getItem('token')
    console.log(token)
    try {
        const res = await api.get('/users/user-data', {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        userData.value = res.data.user
        tee.value = calculateTDEE(userData.value)
        console.log(tee.value,userData.value)
    } catch (err) {
        console.error("Error fetching user data:", err)
    }
})

</script>

<template>
    <div class="flex flex-col min-h-screen">
        <header>
            <nav class="flex justify-between bg-green-400 items-center p-1 white relative">
                <div class="flex items-center gap-4 white p-4 rounded relative">
                <!-- Profile button -->
                <div @click="toggleDropdown" class="cursor-pointer relative">
                    <Profile />
                </div>

                <!-- Dropdown -->
                <div v-if="showDropdown" class="absolute top-16 left-0 mt-2 w-48 bg-white rounded shadow-md z-50">
                    <ul class="py-2 text-sm text-gray-700">
                    <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100">Account Settings</a>
                    </li>
                    <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100">Support</a>
                    </li>
                    <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100">Logout</a>
                    </li>
                    </ul>
                </div>

                <!-- Optional: text animasi -->
                <TextTyping />
                </div>

                <div class='flex gap-3 items-center'>
                    <search />
                <notificationF />
                </div>
            </nav>
            <div>
                <calender  />
            </div>
        </header>
        <main class='bg-gray-100 p-5 font-sans'>
            <div class="flex items-center justify-between bg-green-700 p-4 rounded-xl mb-5 relative text-white">
                <div>
                <div class="text-sm font-bold">Sisa Kalori</div>
                <div class="text-xs">Konsumsi Kalori</div>
                </div>
                <div class="flex flex-col items-end">
                <div class="text-lg font-bold">{{ tee }}</div>
                <div class="absolute bottom-2 right-5 text-sm">0</div>
                </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-3 shadow-sm">
                <div class="flex items-center">
                <span class="text-xl mr-3">🌅</span>
                <span class="text-base font-bold text-gray-800">Makan Pagi</span>
                </div>
                <span class="text-green-600 text-2xl font-bold">+</span>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-3 shadow-sm">
                <div class="flex items-center">
                <span class="text-xl mr-3">☀️</span>
                <span class="text-base font-bold text-gray-800">Makan Siang</span>
                </div>
                <span class="text-green-600 text-2xl font-bold">+</span>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-3 shadow-sm">
                <div class="flex items-center">
                <span class="text-xl mr-3">🌙</span>
                <span class="text-base font-bold text-gray-800">Makan Malam</span>
                </div>
                <span class="text-green-600 text-2xl font-bold">+</span>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-3 shadow-sm">
                <div class="flex items-center">
                <span class="text-xl mr-3">🍪</span>
                <span class="text-base font-bold text-gray-800">Camilan/Lainnya</span>
                </div>
                <span class="text-green-600 text-2xl font-bold">+</span>
            </div>

            <div class="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center mb-3">
                <div class="flex items-center">
                <span class="text-xl mr-3">🍽️</span>
                <div>
                    <div class="text-base font-bold text-gray-800">Atur Makanan Anda</div>
                    <div class="text-xs text-gray-500">Lacak tak hanya makanan utama</div>
                </div>
                </div>
                <span class="text-gray-500 text-xl cursor-pointer">×</span>
            </div>

            <div class="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center mb-3">
                <div class="flex items-center">
                <span class="text-xl mr-3">💧</span>
                <div>
                    <div class="text-base font-bold text-gray-800">Pemantau Asupan Air</div>
                    <div class="text-xs text-gray-500">Lacak target hidrasi harian Anda</div>
                </div>
                </div>
                <span class="text-gray-500 text-xl cursor-pointer">×</span>
            </div>

            <div class="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center mb-3">
                <div class="flex items-center">
                <span class="text-xl mr-3">➕</span>
                <span class="text-base font-bold text-gray-800">Tambahkan Latihan/Tidur</span>
                </div>
                <span class="text-gray-500 text-xl cursor-pointer">+</span>
            </div>
            
            <ChatAi />
        </main>
    </div>
</template>
