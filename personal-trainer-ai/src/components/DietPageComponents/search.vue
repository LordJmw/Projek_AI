<template> 
    <form class="w-full max-w-sm">
      <div class="relative">
        <!-- Icon -->
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg class="w-4 h-4 text-black dark:text-black" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
  
        <!-- Input -->
        <input
          type="search"
          class="block w-full h-10 ps-9 pe-20 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-black focus:border-black dark:bg-gray-100 dark:border-gray-200 dark:text-black"
          placeholder="Cari Makanan..." required />
  
        <!-- Button -->
        <button
          type="submit"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-white  bg-green-400 hover:bg-green-500 focus:ring-2 focus:ring-black font-medium rounded-md text-xs px-3 py-1.5">
          Search
        </button>
      </div>
    </form>
  </template>
  