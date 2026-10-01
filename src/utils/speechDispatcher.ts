// SmartTransit AI Voice Dispatcher via Web Speech API
export const speakTransitBriefing = (text: string, onEnd?: () => void) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported on this browser.");
    return false;
  }

  // Cancel any prior speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  // Try to pick an English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("David"))
  ) || voices.find((v) => v.lang.startsWith("en"));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopTransitBriefing = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
