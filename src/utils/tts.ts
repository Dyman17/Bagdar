// SpeechSynthesis TTS engine with multi-lingual voice detection

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function speakText(
  text: string,
  lang: string = 'ru',
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('[TTS] SpeechSynthesis not supported');
    onEnd?.();
    return;
  }

  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  currentUtterance = utterance;

  let targetLang = 'ru-RU';
  if (lang === 'kk') targetLang = 'kk-KZ';
  else if (lang === 'en') targetLang = 'en-US';

  utterance.lang = targetLang;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) => v.lang.startsWith(targetLang) || v.lang.startsWith(lang)
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    if (currentUtterance === utterance) {
      currentUtterance = null;
    }
    onEnd?.();
  };

  utterance.onerror = () => {
    if (currentUtterance === utterance) {
      currentUtterance = null;
    }
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}
