<template>
    <div class="flex flex-col min-h-screen">
      <NotificationBar />
      <Navbar />
      <main class="flex-grow">
        <RouterView />
      </main>
    </div>
  </template>