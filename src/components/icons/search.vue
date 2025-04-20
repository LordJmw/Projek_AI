<template>
  <div class="w-full max-w-sm mx-auto">
    <!-- Form Pencarian -->
    <form @submit.prevent="handleSearch">
      <div class="relative">
        <!-- Icon -->
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-4 h-4 text-black" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>

        <!-- Input -->
        <input
          v-model="searchQuery"
          type="search"
          class="block w-full h-10 pl-9 pr-20 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-black focus:border-black"
          placeholder="Cari Makanan..."
          required
        />

        <!-- Tombol -->
        <button
          type="submit"
          :disabled="isLoading"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-green-400 hover:bg-green-500 focus:ring-2 focus:ring-black font-medium rounded-md text-xs px-3 py-1.5 disabled:opacity-60"
        >
          {{ isLoading ? 'Loading...' : 'Search' }}
        </button>
      </div>
    </form>

    <!-- Status Loading -->
    <div v-if="isLoading" class="mt-4 text-gray-500 text-sm animate-pulse">
      🔍 Mengambil data nutrisi...
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-4 text-red-600 text-sm">
      ⚠️ {{ errorMessage }}
    </div>

    <!-- Hasil Nutrisi -->
    <div v-if="nutritionInfo" class="mt-4 p-4 border rounded-lg bg-white shadow text-sm space-y-2">
      <h3 class="font-bold text-base mb-2 text-gray-800">Hasil Nutrisi:</h3>
      <div><strong>🍚 Kalori:</strong> {{ nutritionInfo.calories?.value }} {{ nutritionInfo.calories?.unit }}</div>
      <div><strong>💪 Protein:</strong> {{ nutritionInfo.protein?.value }} {{ nutritionInfo.protein?.unit }}</div>
      <div><strong>🥩 Lemak:</strong> {{ nutritionInfo.fat?.value }} {{ nutritionInfo.fat?.unit }}</div>
      <div><strong>🍞 Karbo:</strong> {{ nutritionInfo.carbs?.value }} {{ nutritionInfo.carbs?.unit }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const nutritionInfo = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const handleSearch = async () => {
  const query = searchQuery.value.trim()
  if (!query) return

  isLoading.value = true
  errorMessage.value = ''
  nutritionInfo.value = null

  try {
    const res = await fetch('http://localhost:3000/ai/analyze-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food: query }),
    })

    const data = await res.json()

    if (res.ok) {
      nutritionInfo.value = data.nutrition_info
    } else {
      errorMessage.value = data.message || 'Terjadi kesalahan saat mengambil data.'
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Gagal terhubung ke server.'
  } finally {
    isLoading.value = false
  }
}
</script>
