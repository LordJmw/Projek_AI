<!-- Jangan lupa download npm install primeicons -->


<script setup>
import { RouterLink } from 'vue-router';
import { useTypingText } from '@/composables/useTypingText';
import { ref, onMounted, onUnmounted } from 'vue';
import 'primeicons/primeicons.css';
const desc1 = useTypingText("Monitor your posture during workouts using AI Camera for more precise and effective results.");
const desc2 = useTypingText("Get automatic alerts for incorrect movements, preventing injury risks during your exercise routine.");
const desc3 = useTypingText("AI technology helps improve your workout form automatically by analyzing camera movement data.");
const desc4 = useTypingText("Enhance your workouts with AI support to achieve quicker, more effective results and improvements.");
const desc5 = useTypingText("Maximize your workout efficiency with real-time movement analysis to save time and improve technique.");
const desc6 = useTypingText("Track your workout progress and technique improvements over time, ensuring consistent growth and development.");
const title = useTypingText("Check your Workout Form, Avoid Injury");
const title2 = useTypingText("Open Camera to Check your workout Form");

const showScrollTop = ref(false);
const videoElement = ref(null);
const isCameraOn = ref(false);  // Declare camera state
let mediaStream = null;  // Declare media stream to control camera


const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})


const toggleCamera = async () => {
  if (isCameraOn.value) {
    // Matikan kamera
    const tracks = mediaStream?.getTracks();
    if (tracks) {
      tracks.forEach(track => track.stop());
    }
    videoElement.value.srcObject = null;
    isCameraOn.value = false;
  } else {
    // Nyalakan kamera
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.value.srcObject = mediaStream;
      isCameraOn.value = true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Failed to access camera. Please allow camera access.');
    }
  }
};

</script>

<template>
  <div class="bg-gray-200">
    <div class="hero-section min-h-screen flex items-center justify-center text-white text-center">
      <div class="bg-black bg-opacity-60 p-6 rounded-xl max-w-xl">
        <h1 class="text-3xl font-bold mb-4">{{ title }}</h1>
        <p class="text-md mb-5">{{ title2 }}</p>
        <div class="bg-green-600 p-2 rounded-md hover:bg-green-400 inline-block">
          <button @click="toggleCamera" class="text-white font-semibold">
            {{ isCameraOn ? '>> Stop Ai Camera <<' : '>> Open Ai Camera <<' }}
          </button>
          <video ref="videoElement" autoplay playsinline
            class="mx-auto my-6 w-full max-w-lg rounded-lg shadow-lg"></video>
        </div>
      </div>
    </div>

    <!-- Experience of AI Camera Section -->
    <section class="py-16 px-6 text-center">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-semibold mb-6">Experience of AI Camera</h2>
        <p class="text-lg text-gray-700">Our AI Camera allows you to check your form in real-time, ensuring you perform
          exercises with the correct technique. It automatically analyzes your movements, providing instant feedback to
          help you stay on track and avoid injury. Experience a smarter workout with AI assistance guiding you every
          step of the way.</p>
      </div>
    </section>

    <!-- AI Camera Feature Section -->
    <section class="bg-gray-200 py-16 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 text-gray-800">
        <!-- Sisi kiri (sudah ada) -->
        <div class="flex-1 space-y-10">
          <div class="flex items-center gap-4">
            <div class="bg-blue-400 text-white rounded-full p-4 text-2xl">
              <i class="pi pi-video"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold">Real-Time Form Tracking</h3>
              <p class="text-sm text-gray-600">{{ desc1 }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="bg-pink-400 text-white rounded-full p-4 text-2xl">
              <i class="pi pi-check-circle"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold">Prevent Workout Injuries</h3>
              <p class="text-sm text-gray-600">{{ desc2 }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="bg-orange-400 text-white rounded-full p-4 text-2xl">
              <i class="pi pi-cog"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold">AI-Powered Corrections</h3>
              <p class="text-sm text-gray-600">{{ desc3 }}</p>
            </div>
          </div>
        </div>

        <div
          class="flex-1 bg-cover bg-center rounded-xl p-6 bg-[url('./../assets/cam.jpg')] min-h-[300px] justify-betweeen relative">
        </div>


        <!-- Sisi kanan (lanjutan) -->
        <div class="flex-1 space-y-10">
          <div class="flex items-center gap-4">
            <div class="bg-green-400 text-white rounded-full p-4 text-2xl">
              <i class="pi pi-heart"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold">Improved Performance</h3>
              <p class="text-sm text-gray-600">{{ desc4 }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="bg-yellow-400 text-white rounded-full p-4 text-2xl">
              <i class="pi pi-clock"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold">Time Efficiency</h3>
              <p class="text-sm text-gray-600">{{ desc5 }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="bg-purple-400 text-white rounded-full p-4 text-2xl">
              <i class="pi pi-chart-line"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold">Track Your Progress</h3>
              <p class="text-sm text-gray-600">{{ desc6 }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Feature Section: Training & Nutrition -->
    <section class="min-h-screen flex flex-col md:flex-row gap-6 p-10 bg-gray-200 text-white ">
      <!-- Training Plan -->
      <div class="flex-1 bg-cover bg-center rounded-xl p-6 bg-[url('./../assets/back1.jpg')]">
        <div class="bg-opacity-60 p-6 rounded-xl h-full flex flex-col justify-between relative">
          <div>
            <h2 class="italic text-4xl font-bold mb-6 text-center">BMI ANALYSIS</h2>
            <ul class="space-y-8 mt-15">
              <li class="flex items-center gap-3 font-bold">
                <i class="pi pi-chart-bar text-2xl bg-gray-800 p-2 rounded-md"></i>
                <span class="text-xl">UNDERSTAND YOUR BODY MASS INDEX</span>
              </li>
              <li class="flex items-center gap-3 font-bold">
                <i class="pi pi-user-plus text-2xl bg-gray-800 p-2 rounded-md"></i>
                <span class="text-xl">AI-DRIVEN HEALTH EVALUATION</span>
              </li>
              <li class="flex items-center gap-3 font-bold">
                <i class="pi pi-heart-fill text-2xl bg-gray-800 p-2 rounded-md"></i>
                <span class="text-xl">PERSONALIZED FITNESS & NUTRITION SUGGESTIONS</span>
              </li>
            </ul>
          </div>

          <!-- Tombol Learn More -->
          <RouterLink to="/"
            class="absolute bottom-10 right-10 bg-opacity-10 px-5 py-2 rounded-lg text-2xl text-white italic font-bold hover:underline hover:bg-opacity-20 transition duration-300 text-center">
            BMI Page >
            <i class="pi pi-arrow-right text-white"></i>
          </RouterLink>
        </div>
      </div>

      <!-- Nutrition Plan -->
      <div class="flex-1 bg-cover bg-center rounded-xl p-6 bg-[url('./../assets/back2.jpg')]">
        <div class="bg-opacity-60 p-6 rounded-xl h-full flex flex-col justify-between relative">
          <div>
            <h2 class="italic text-4xl font-bold mb-6 text-center">DIET PROGRAM</h2>
            <!-- Teks lebih besar dan margin bawah lebih besar -->
            <ul class="space-y-8 mt-15"> <!-- Menambahkan margin atas untuk memberi jarak dengan judul -->
              <li class="flex items-center gap-3 font-bold">
                <i class="pi pi-star text-2xl bg-gray-800 p-2 rounded-md"></i>
                <span class="text-xl">PERSONALIZED DIET PLANS BASED ON YOUR GOALS</span>
              </li>
              <li class="flex items-center gap-3 font-bold">
                <i class="pi pi-chart-line text-2xl bg-gray-800 p-2 rounded-md"></i>
                <span class="text-xl">TRACK CALORIES, MACROS, AND DAILY INTAKE</span>
              </li>
              <li class="flex items-center gap-3 font-bold">
                <i class="pi pi-sliders-h text-2xl bg-gray-800 p-2 rounded-md"></i>
                <span class="text-xl">ADAPTS TO WEIGHT LOSS OR MUSCLE GAIN TARGETS</span>
              </li>
            </ul>
          </div>


          <!-- Tombol Learn More (Nutrition) -->
          <RouterLink to="/"
            class="absolute bottom-10 right-10 bg-opacity-10 px-5 py-2 rounded-lg text-2xl text-white italic font-bold hover:underline hover:bg-opacity-20 transition duration-300 text-center">
            Diet Page >
          </RouterLink>
        </div>
      </div>
    </section>
    <!-- Scroll to Top Button -->
    <button @click="scrollToTop" v-show="showScrollTop"
      class="fixed bottom-6 right-6 bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-green-500 transition duration-300 z-50">
      <i class="pi pi-arrow-up text-xxl"></i>
    </button>

  </div>
</template>

<style>
/* Slideshow background */
.hero-section {
  background-size: cover;
  background-position: center;
  animation: slideshow 10s infinite ease-in-out;
}

.hero-section img {
  object-fit: cover;
  opacity: 0.4;
  /* Adjust the transparency */
}

@keyframes slideshow {
  15% {
    background-image: url('./../assets/form1.jpg');
  }

  33% {
    background-image: url('./../assets/form2.jpg');
  }

  66% {
    background-image: url('./../assets/form3.jpg');
  }

  100% {
    background-image: url('./../assets/form4.jpg');
  }
}
</style>
