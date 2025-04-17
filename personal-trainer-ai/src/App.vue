<script setup>
import { useRoute, RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';

const route = useRoute()
</script>

<template>
  <div class="min-h-screen">
    <Navbar v-if="route.path!== '/' && route !== '/login'" ></Navbar>
    <RouterView />
  </div>
</template>


