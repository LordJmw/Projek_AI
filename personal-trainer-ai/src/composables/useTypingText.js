import { ref, onMounted } from 'vue';

export function useTypingText(fullText, speed = 30) {
  const displayedText = ref('');
  let i = 0;

  onMounted(() => {
    const typing = () => {
      if (i < fullText.length) {
        displayedText.value += fullText[i];
        i++;
        setTimeout(typing, speed);
      }
    };
    typing();
  });

  return displayedText;
}