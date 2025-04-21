<script setup>
    import { ref } from 'vue';
    import { RouterLink,useRoute } from 'vue-router';
    let isOpen = ref(false);
    function isActiveLink(route){
        const path = useRoute().path
        return path === route
    }
</script>

<template>
    <!-- p-1 = 4px, p-2 = 8px, dst untuk kelas lain juga begini -->
  <nav class="bg-white p-4 h-20">
    <div class="container mx-auto flex justify-between items-center">
        <!-- width dan height classname di tailwind itu w dan h, 24x4 = 96px -->
      
      <div class="flex justify-center items-center">
        <img src="./../assets/icon.png" class="w-12 h-12 mr-8" alt="icon">
        <p class="text-[#3B7D3F] font-semibold text-2xl font-serif italic tracking-wide">Personal Trainer</p>
      </div>
      
      <!-- button ini jika screenya medium(md) atau lebih gede, akan hidden, jika tidak akan muncul menu hamburger -->
      <button @click="isOpen = !isOpen" class="md:hidden text-white text-2xl">
        &#9776;
      </button>
      
      <!-- tampil jika isOpen true, hidden jika tidak untuk ada menu hamburger -->
       <!-- u/ class biasa, posisi absolut, untuk screen medium digunakan flex, widthnya full -->
        <ul :class="{'block': isOpen, 'hidden': !isOpen}" 
          class="absolute md:relative md:flex bg-green-600 md:bg-transparent w-full left-0 md:w-auto top-16 md:top-0 text-white space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0">
            <li :class='[isActiveLink("/home")? "bg-[#3B7D3F]" : "", "hover:bg-[#3B7D3F]/90", "rounded-md"]'>
            <RouterLink to="/home"  class="px-4 py-2 block no-underline text-black font-semibold tracking-wide" style="text-decoration: none;">Home</RouterLink>
          </li>
          <li :class='[isActiveLink("/diet")? "bg-[#3B7D3F]" : "", "hover:bg-[#3B7D3F]/90", "rounded-md"]'>
            <RouterLink to="/diet"  class="px-4 py-2 block no-underline text-black font-semibold tracking-wide" style="text-decoration: none;">My Diet</RouterLink>
          </li>
          <li :class='[isActiveLink("/workout")? "bg-[#3B7D3F]" : "", "hover:bg-[#3B7D3F]/90", "rounded-md"]'>
            <RouterLink to="/workout" class="px-4 py-2 block no-underline text-black font-semibold tracking-wide" style="text-decoration: none;">Workout</RouterLink>
          </li>
        </ul>
    </div>
  </nav>
</template>
