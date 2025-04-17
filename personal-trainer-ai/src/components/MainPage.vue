<template>
  <div class="flex-1 bg-[#3B7D3F] min-h-screen w-full flex justify-center items-center p-2">
   <div class="w-[35%] h-[50vh] mr-2 flex flex-col p-4 justify-center font-inter">
     <p class="text-7xl font-extrabold text-emerald-300 mb-4 slide-right tracking-tight drop-shadow-md">
       Track
     </p>
     <p class="text-7xl font-extrabold text-emerald-300 mb-4 slide-right delay-1 tracking-tight drop-shadow-lg">
       Your Diet
     </p>
     <p class="text-4xl font-semibold text-emerald-300 mb-6 slide-right delay-2 tracking-tight drop-shadow-md">
       Check Your Workout Form
     </p>
     <p class="text-2xl text-yellow-400 font-bold slide-right delay-3 drop-shadow-sm">
       Be Healthy For Life!
     </p>
   </div>
 
 
 
     <div class="w-[60%] h-[90vh] mr-5">
       <img src="./../assets/coba.png" class="w-full h-full object-fill">
     </div>
 
     <div class="w-[15%] h-[60vh]">
       <img src="./../assets/caesar_salad-removebg-preview.png" class="w-full h-full object-cover object-left" >
     </div>
   </div>
 </template>
 
 
 <style scoped>
 @keyframes slideRight {
   0% {
     transform: translateX(-100px);
     opacity: 0;
   }
   100% {
     transform: translateX(0);
     opacity: 1;
   }
 }
 
 .slide-right {
   animation: slideRight 1s ease forwards;
 }
 
 .delay-1 {
   animation-delay: 0.2s;
 }
 .delay-2 {
   animation-delay: 0.4s;
 }
 .delay-3 {
   animation-delay: 0.6s;
 }
 </style>