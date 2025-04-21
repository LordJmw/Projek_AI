<script setup>
import { useRoute, RouterLink, RouterView, useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue';
import { onMounted } from 'vue';
import axios from 'axios';
import api from './services/api';
import vue from '@heroicons/vue';

const route = useRoute()
const router = useRouter()

const checkTokenValidity = async () => {
  const token = localStorage.getItem("token")

  if (!token) {
    alert("No token found. Please log in again.")
    router.push("/login")
    return
  }

  try {
    const response = await api.post("/users/valid-token", { token })

    if (response.data.message === 'unauthorized') {
      alert("Your login session is over, please login again")
      localStorage.removeItem("token")
      router.push("/login")
    }

  } catch (error) {
    console.error("Error checking token:", error)
    alert("Session error. Please login again.")
    localStorage.removeItem("token")
    router.push("/login")
  }
}

onMounted(() => {
  checkTokenValidity()
  setInterval(checkTokenValidity, 300000)
})
</script>

<template>
  <div class="min-h-screen">
    <Navbar v-if="route.path!== '/' && route !== '/login'"></Navbar>
    <RouterView />
  </div>
</template>


