<template>
    <div class="p-6 ">
      <div class="mb-2 text-left">
        <p class="text-gray-700 text-lg">
          <span class="font-bold">{{ selectedDayName }}, {{ formattedSelectedDate }}</span>
        </p>
      </div>

      <!-- Strip Kalender -->
      <div class="flex justify-between">
        <div
  v-for="(day, index) in weekDays"
  :key="index"
  @click="selectDay(day)"
  class="flex flex-col items-center gap-1"
>
  <span class="text-sm font-semibold capitalize text-gray-700">
    {{ day.dayName }}
  </span>
  <div
  :class="[
  'w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition border-2',
  isToday(day.date)
    ? (selectedDate.getDate() === day.date.getDate()
        ? 'bg-green-600 text-white border-green-600'
        : 'bg-gray-300 text-gray-900 border-gray-300')
    : (selectedDate.getDate() === day.date.getDate()
        ? 'border-green-600 text-green-600 bg-white'
        : 'bg-gray-200 text-gray-800 border-transparent hover:border-gray-400')
]"


  >
    <span class="text-lg font-bold">{{ day.date.getDate() }}</span>
  </div>
</div>

      </div>
  
      
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const today = new Date()
  const selectedDate = ref(today)
  
  const getWeekDays = (date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay()) // Sunday as start
  
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
  
      return {
        date: day,
        dayName: day.toLocaleDateString('id-ID', { weekday: 'short' }), // ex: Min, Sen
      }
    })
  }
  
  const weekDays = getWeekDays(today)
  
  const selectDay = (day) => {
    selectedDate.value = day.date
  }
  
  const formattedSelectedDate = computed(() =>
    selectedDate.value.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  )
  
  const selectedDayName = computed(() =>
    selectedDate.value.toLocaleDateString('id-ID', { weekday: 'long' })
  )

  const isToday = (date) => {
  const now = new Date()
  return (
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()
  )
}

  </script>
  