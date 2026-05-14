import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, ChevronLeft, ChevronRight,
  Lightbulb, BookOpen, Volume2, VolumeX, Hand
} from "lucide-react";

interface Props {
  onBack: () => void;
  subjectName: string;
  topicName: string;
}

/**
 * Simplified carousel slides for the inclusion lesson.
 * Each slide has a title, a simple explanation, and an optional TTS text override.
 */
const slides = [
  {
    title: "Cosa sono i numeri?",
    body: "I numeri servono per contare le cose.\nQuanti pennarelli hai? Quanti amici ci sono?\nI numeri ci aiutano a rispondere!",
    emoji: "🔢",
  },
  {
    title: "Cominciamo dallo zero",
    body: "Il primo numero è lo 0.\nZero vuol dire \"nessuno\".\nSe hai zero caramelle, non ne hai nessuna!",
    emoji: "0️⃣",
  },
  {
    title: "Contiamo insieme!",
    body: "Dopo lo 0 viene l'1, poi il 2, poi il 3...\n0 → 1 → 2 → 3 → 4 → 5\nOgni numero ha sempre un numero dopo!",
    emoji: "👆",
  },
  {
    title: "La retta dei numeri",
    body: "I numeri stanno su una riga, uno dopo l'altro.\nQuelli a sinistra sono più piccoli.\nQuelli a destra sono più grandi.",
    emoji: "📏",
  },
  {
    title: "Pari e dispari",
    body: "Alcuni numeri si possono dividere in due gruppi uguali.\nQuesti si chiamano PARI: 0, 2, 4, 6, 8...\nGli altri sono DISPARI: 1, 3, 5, 7, 9...",
    emoji: "✌️",
  },
  {
    title: "Bravo! Hai imparato!",
    body: "I numeri naturali sono: 0, 1, 2, 3, 4, 5...\nNon finiscono mai!\nOra prova a toccare i numeri sulla retta qui sotto!",
    emoji: "⭐",
  },
];

export default function NumberLineLessonInclusion({ onBack, subjectName, topicName }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showNumberLine, setShowNumberLine] = useState(false);

  // Simple number line: always 0-10
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const SVG_W = 800;
  const PAD = 50;
  const LINE_Y = 70;
  const spacing = (SVG_W - 2 * PAD) / 10;
  const getX = (n: number) => PAD + n * spacing;

  // Load available voices (they may load asynchronously)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  // Pick the best Italian voice available
  const getBestVoice = useCallback((): SpeechSynthesisVoice | null => {
    const italianVoices = voices.filter(v => v.lang.startsWith("it"));
    if (italianVoices.length === 0) return null;

    // Prefer natural/online voices (Google, Microsoft Online Natural, etc.)
    const priority = [
      (v: SpeechSynthesisVoice) => /google/i.test(v.name),
      (v: SpeechSynthesisVoice) => /natural/i.test(v.name),
      (v: SpeechSynthesisVoice) => /online/i.test(v.name),
      (v: SpeechSynthesisVoice) => /microsoft.*elsa/i.test(v.name),
      (v: SpeechSynthesisVoice) => /microsoft.*cosimo/i.test(v.name),
      (v: SpeechSynthesisVoice) => /microsoft/i.test(v.name),
    ];
    for (const test of priority) {
      const match = italianVoices.find(test);
      if (match) return match;
    }
    return italianVoices[0];
  }, [voices]);

  // Text-to-Speech
  const speak = useCallback((text: string) => {
    if (!ttsEnabled) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "it-IT";
    const bestVoice = getBestVoice();
    if (bestVoice) utt.voice = bestVoice;
    utt.rate = 0.9;
    utt.pitch = 1.05;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [ttsEnabled, getBestVoice]);

  // Speak the current slide when TTS is enabled or slide changes
  useEffect(() => {
    if (ttsEnabled && !showNumberLine) {
      const slide = slides[currentSlide];
      speak(`${slide.title}. ${slide.body}`);
    }
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [currentSlide, ttsEnabled, showNumberLine, speak]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowNumberLine(true);
    }
  };
  const prevSlide = () => {
    if (showNumberLine) {
      setShowNumberLine(false);
    } else if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNumberClick = (n: number) => {
    setSelectedNumber(n);
    if (ttsEnabled) {
      const pariDispari = n % 2 === 0 ? "pari" : "dispari";
      speak(`Hai toccato il numero ${n}. È un numero ${pariDispari}.`);
    }
  };

  const getColor = (n: number) => {
    if (selectedNumber === n) return { fill: "#EF7D00", text: "#fff", ring: true };
    if (n % 2 === 0) return { fill: "#DBEAFE", text: "#1E40AF", ring: false };
    return { fill: "#FFEDD5", text: "#C2410C", ring: false };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl space-y-6 mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dida-orange text-white flex items-center justify-center">
            <BookOpen size={22} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-dida-orange uppercase tracking-widest">Impara · Inclusione</p>
            <p className="text-lg font-bold text-slate-700">I numeri naturali</p>
            <p className="text-sm text-slate-500">{subjectName} &gt; {topicName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* TTS toggle */}
          <button
            onClick={() => {
              if (ttsEnabled) window.speechSynthesis.cancel();
              setTtsEnabled(!ttsEnabled);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm cursor-pointer ${
              ttsEnabled
                ? "bg-dida-orange text-white shadow-orange-200"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {ttsEnabled ? "Audio ON" : "Audio OFF"}
          </button>
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Indietro
          </button>
        </div>
      </div>

      {/* Carousel or Number Line */}
      <AnimatePresence mode="wait">
        {!showNumberLine ? (
          <motion.div
            key={`slide-${currentSlide}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
            className="px-4"
          >
            <div className="rounded-[2rem] border-2 border-dida-orange/20 bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8 md:p-12 shadow-xl text-center space-y-6 min-h-[340px] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Slide progress dots */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === currentSlide ? "bg-dida-orange scale-125" : i < currentSlide ? "bg-dida-orange/40" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* Emoji */}
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-7xl md:text-8xl"
              >
                {slides[currentSlide].emoji}
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-black text-slate-800">
                {slides[currentSlide].title}
              </h3>

              {/* Body - larger text for accessibility */}
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed whitespace-pre-line max-w-lg font-medium">
                {slides[currentSlide].body}
              </p>

              {/* Speaking indicator */}
              {isSpeaking && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="flex items-center gap-2 text-dida-orange font-bold text-sm"
                >
                  <Volume2 size={18} />
                  Sto leggendo...
                </motion.div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg transition cursor-pointer ${
                  currentSlide === 0
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                    : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                }`}
              >
                <ChevronLeft size={22} />
                Indietro
              </button>

              <span className="text-sm font-bold text-slate-400">
                {currentSlide + 1} / {slides.length}
              </span>

              <button
                onClick={nextSlide}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg bg-dida-orange text-white hover:bg-orange-600 transition shadow-lg shadow-orange-200 cursor-pointer"
              >
                {currentSlide === slides.length - 1 ? "Prova la retta!" : "Avanti"}
                <ChevronRight size={22} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="number-line-interactive"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="px-4 space-y-6"
          >
            {/* Instruction card */}
            <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-blue-50 border border-dida-orange/20 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <Hand className="text-dida-orange shrink-0 mt-1" size={28} />
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Tocca un numero!</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Tocca un numero sulla retta per scoprire se è <strong className="text-blue-600">pari</strong> o <strong className="text-orange-600">dispari</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Simple Number Line */}
            <div className="rounded-[2rem] border-2 border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">La Retta dei Numeri</h3>

              <div className="w-full overflow-hidden">
                <svg viewBox={`0 0 ${SVG_W} 140`} className="w-full h-auto" style={{ minHeight: 100 }}>
                  {/* Main line */}
                  <line x1={PAD - 15} y1={LINE_Y} x2={SVG_W - PAD + 15} y2={LINE_Y} stroke="#CBD5E1" strokeWidth={4} strokeLinecap="round" />
                  {/* Arrow right */}
                  <polygon points={`${SVG_W - PAD + 25},${LINE_Y} ${SVG_W - PAD + 10},${LINE_Y - 10} ${SVG_W - PAD + 10},${LINE_Y + 10}`} fill="#CBD5E1" />

                  {numbers.map((n) => {
                    const x = getX(n);
                    const col = getColor(n);
                    return (
                      <g key={n} onClick={() => handleNumberClick(n)} className="cursor-pointer">
                        {/* Tick */}
                        <line x1={x} y1={LINE_Y - 14} x2={x} y2={LINE_Y + 14} stroke={col.ring ? col.fill : "#94A3B8"} strokeWidth={col.ring ? 4 : 2} />

                        {/* Circle */}
                        {col.ring && (
                          <circle cx={x} cy={LINE_Y - 36} r={22} fill={col.fill} opacity={0.15}>
                            <animate attributeName="r" values="22;27;22" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <circle cx={x} cy={LINE_Y - 36} r={19} fill={col.fill} />
                        <text x={x} y={LINE_Y - 30} textAnchor="middle" fill={col.text} fontSize={16} fontWeight={800}>
                          {n}
                        </text>

                        {/* Number label below */}
                        <text x={x} y={LINE_Y + 36} textAnchor="middle" fill={col.ring ? col.fill : "#64748B"} fontSize={16} fontWeight={col.ring ? 800 : 600}>
                          {n}
                        </text>

                        {/* Invisible hit area (bigger for accessibility) */}
                        <rect x={x - spacing / 2} y={LINE_Y - 60} width={spacing} height={120} fill="transparent" />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 text-base font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-200 inline-block border-2 border-blue-300" /> Pari
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-200 inline-block border-2 border-orange-300" /> Dispari
                </span>
              </div>
            </div>

            {/* Selected number info - simplified */}
            <AnimatePresence mode="wait">
              {selectedNumber !== null && (
                <motion.div
                  key={`info-incl-${selectedNumber}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border-2 border-dida-orange/20 bg-gradient-to-br from-orange-50 to-white p-6 md:p-8 shadow-xl text-center space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="text-6xl font-black text-dida-orange"
                  >
                    {selectedNumber}
                  </motion.div>

                  <div className="space-y-3 max-w-md mx-auto">
                    {/* Pari / Dispari */}
                    <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold ${
                      selectedNumber % 2 === 0
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                        : "bg-orange-100 text-orange-700 border-2 border-orange-200"
                    }`}>
                      {selectedNumber % 2 === 0 ? "✌️ È un numero PARI" : "☝️ È un numero DISPARI"}
                    </div>

                    {/* Predecessor / Successor */}
                    <div className="flex items-center justify-center gap-4 text-2xl font-black mt-4">
                      <span className="text-slate-300 text-xl">
                        {selectedNumber > 0 ? selectedNumber - 1 : "—"}
                      </span>
                      <span className="text-slate-300">←</span>
                      <span className="text-dida-orange bg-orange-100 px-5 py-2 rounded-2xl border-2 border-orange-200">
                        {selectedNumber}
                      </span>
                      <span className="text-slate-300">→</span>
                      <span className="text-slate-300 text-xl">
                        {selectedNumber + 1}
                      </span>
                    </div>
                    <p className="text-slate-500 text-base font-medium">
                      {selectedNumber > 0
                        ? `Prima c'è il ${selectedNumber - 1}, dopo c'è il ${selectedNumber + 1}`
                        : `Lo 0 è il primo numero! Dopo c'è l'1`}
                    </p>

                    {/* Visual representation with dots */}
                    {selectedNumber > 0 && selectedNumber <= 20 && (
                      <div className="pt-2">
                        <p className="text-sm font-bold text-slate-400 uppercase mb-2">
                          {selectedNumber} pallini
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {Array.from({ length: selectedNumber }, (_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className={`w-6 h-6 rounded-full ${
                                selectedNumber % 2 === 0 ? "bg-blue-300" : "bg-orange-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back to slides button */}
            <div className="flex justify-center pb-8">
              <button
                onClick={prevSlide}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm cursor-pointer"
              >
                <ChevronLeft size={22} />
                Torna alla lezione
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
