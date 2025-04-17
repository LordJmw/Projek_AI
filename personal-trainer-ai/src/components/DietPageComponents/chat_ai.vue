<template>
    <div class="mt-10">
      <div class="flex justify-between items-center">
        <span class="font-bold text-lg">
          Perlu Coach?? saya dapat membantu anda jika anda punya pertanyaan
        </span>
        <span @click="toggleChat" class="cursor-pointer text-gray-800">
          Klik Saya Jika Anda Mempunyai pertanyaan
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
                {{ msg.text }}
              </div>
            </div>
          </div>
  
          <div class="flex">
            <input
              type="text"
              v-model="userInput"
              @keyup.enter="sendMessage"
              placeholder="Tanyakan sesuatu..."
              class="flex-grow border rounded-l-xl px-4 py-2 focus:outline-none"
            />
            <button
              @click="sendMessage"
              class="bg-blue-500 text-white px-4 py-2 rounded-r-xl hover:bg-blue-600"
            >
              Kirim
            </button>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue'
  
  const showChat = ref(false)
  const userInput = ref('')
  const messages = ref([])
  const chatMessages = ref(null)
  
  const toggleChat = () => {
    showChat.value = !showChat.value
    if (showChat.value && messages.value.length === 0) {
      messages.value.push({ sender: 'ai', text: 'Halo! Ada yang bisa saya bantu??' })
    }
    nextTick(() => {
      scrollToBottom()
    })
  }
  
  const sendMessage = () => {
    const text = userInput.value.trim()
    if (!text) return
  
    messages.value.push({ sender: 'user', text })
    userInput.value = ''
  
    setTimeout(() => {
      messages.value.push({ sender: 'ai', text: `ini jawaban dari pertanyaan yang mau user minta: ${text}` })
      scrollToBottom()
    }, 500)
  }
  
  const scrollToBottom = () => {
    nextTick(() => {
      const el = chatMessages.value
      if (el) el.scrollTop = el.scrollHeight
    })
  }
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  