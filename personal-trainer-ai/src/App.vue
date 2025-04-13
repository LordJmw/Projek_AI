<script setup>
import { useRoute, RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';

const route = useRoute().path
console.log(route)
</script>

<template>
  <div class="min-h-screen">
    <Navbar v-if="route!== '/register'" ></Navbar>
    <RouterView />
  </div>
</template>


