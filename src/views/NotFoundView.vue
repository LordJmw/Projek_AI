<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="container flex flex-col items-center justify-center m-auto p-4 mt-6">
        <i class="pi pi-exclamation-triangle text-yellow-500 text-7xl mb-5"></i>
        <h1 class="text-3xl font-bold mb-3">404 Not Found</h1>
        <p class="text-md mb-3">This Page Does Not Exist</p>
        <div class="bg-green-600 p-2 rounded-md hover:bg-green-400">
            <RouterLink to="/">
                Go Back
            </RouterLink>
        </div>
    </div>
</template>