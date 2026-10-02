import { useState, useEffect, useCallback } from "react";

const isSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;

// Preferenza per le voci italiane più naturali disponibili nel browser
const VOICE_PRIORITY = [
  /google/i,
  /natural/i,
  /online/i,
  /microsoft.*elsa/i,
  /microsoft.*cosimo/i,
  /microsoft/i,
];

const pickItalianVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  const italian = voices.filter(v => v.lang.startsWith("it"));
  for (const pattern of VOICE_PRIORITY) {
    const match = italian.find(v => pattern.test(v.name));
    if (match) return match;
  }
  return italian[0] ?? null;
};

/**
 * Sintesi vocale condivisa dalle lezioni di inclusione.
 * Interrompe la lettura quando si spegne l'audio o si esce dalla lezione.
 */
export function useSpeech() {
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!isSupported()) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (isSupported()) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!ttsEnabled || !isSupported()) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "it-IT";
    const voice = pickItalianVoice(voices);
    if (voice) utt.voice = voice;
    utt.rate = 0.9;
    utt.pitch = 1.05;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [ttsEnabled, voices]);

  const toggleTts = useCallback(() => {
    if (ttsEnabled) stop();
    setTtsEnabled(!ttsEnabled);
  }, [ttsEnabled, stop]);

  return { ttsEnabled, isSpeaking, speak, stop, toggleTts };
}
