<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';

</script>

<template>
  <div class="min-h-screen">
    <Navbar />
    <RouterView />
  </div>
</template>


