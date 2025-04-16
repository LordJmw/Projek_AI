<script setup>
import { ref } from 'vue'
import Profile from '@/components/profile.vue'
import TextTyping from '@/components/text_typing.vue'
import notificationF from '@/components/notification_false.vue'
import search from  '@/components/search.vue'
import calender from '@/components/calender.vue'
import ChatAi from '@/components/chat_ai.vue'

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}
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
                <div class="text-lg font-bold">2700</div>
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
