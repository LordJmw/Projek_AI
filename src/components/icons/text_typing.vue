<template>
    <div class="min-w-0">
      <h1 class="text-white text-xl font-semibold whitespace-nowrap">
        <span ref="dynamicText"></span>
      </h1>
    </div>
</template>
  
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const dynamicText = ref(null);
  const words = ["Nggak ada magic, yang ada disiplin.", "Yang penting mulai, bukan nunggu niat.", "Disiplin ngalahin motivasi.", "Nggak ada shortcut buat badan ideal."];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  const typeEffect = () => {
    const currentWord = words[wordIndex];
    const currentChar = currentWord.substring(0, charIndex);
  
    if (dynamicText.value) {
      dynamicText.value.textContent = currentChar;
      dynamicText.value.classList.add("stop-blinking");
    }
  
    if (!isDeleting && charIndex < currentWord.length) {
      charIndex++;
      setTimeout(typeEffect, 200);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      setTimeout(typeEffect, 100);
    } else {
      isDeleting = !isDeleting;
      if (dynamicText.value) {
        dynamicText.value.classList.remove("stop-blinking");
      }
      if (!isDeleting) {
        wordIndex = (wordIndex + 1) % words.length;
      }
      setTimeout(typeEffect, 1200);
    }
  };
  
  onMounted(() => {
    typeEffect();
  });
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  h1 {
    font-size: 1rem;
    font-weight: 500;
    color: #fff;
  }
  
  h1 span {
    color: black;
    position: relative;
  }
  
  h1 span::before {
    content: "";
    height: 15px;
    width: 1px;
    position: absolute;
    top: 50%;
    right: -2px;
    background: black;
    transform: translateY(-45%);
    animation: blink 1s infinite;
  }
  
  h1 span.stop-blinking::before {
    animation: none;
  }
  
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
  </style>
  