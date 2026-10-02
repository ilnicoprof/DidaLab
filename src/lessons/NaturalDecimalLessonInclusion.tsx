import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, Sparkles, CheckCircle2, XCircle,
  HelpCircle, ChevronRight, ChevronLeft, Award, RotateCcw,
  BookOpen, Zap, Check, X, Hand, Star
} from "lucide-react";
import { useSpeech } from "../hooks/useSpeech";

interface Props {
  key?: string;
  onBack: () => void;
  subjectName: string;
  topicName: string;
  initialSubtopicId?: string;
  initialTab?: "impara" | "allena";
}

const INCLUSION_MODULES = [
  { id: "mod1", subtopicMap: "natural-numbers", title: "1. I Numeri per Contare (ℕ)", short: "1. Contare e lo 0" },
  { id: "mod2", subtopicMap: "natural-comparison", title: "2. Chi è Più Grande? (< e >)", short: "2. Chi è più grande?" },
  { id: "mod3", subtopicMap: "decimal-numbers", title: "3. La Virgola e le Fette (0,1)", short: "3. I Decimali" },
  { id: "mod4", subtopicMap: "decimal-comparison", title: "4. Il Trucco dello Zero", short: "4. Trucco dello zero" },
  { id: "mod5", subtopicMap: "polynomial-form", title: "5. Le Tessere dei Numeri", short: "5. Scomposizione" },
  { id: "mod6", subtopicMap: "rounding-estimation", title: "6. Arrotondare: Più Vicino a Chi?", short: "6. Arrotondare (≈)" },
];

export default function NaturalDecimalLessonInclusion({
  onBack,
  subjectName,
  topicName,
  initialSubtopicId,
  initialTab = "impara",
}: Props) {
  const getInitialModId = () => {
    if (!initialSubtopicId) return "mod1";
    const found = INCLUSION_MODULES.find(m => m.subtopicMap === initialSubtopicId);
    return found ? found.id : "mod1";
  };

  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [activeModuleId, setActiveModuleId] = useState<string>(getInitialModId);

  // Sintesi Vocale
  const { ttsEnabled, isSpeaking, speak, stop, toggleTts } = useSpeech();

  // Stati Interattivi Inclusione
  const [selectedBallCount, setSelectedBallCount] = useState<number>(4);
  const [pizzaFetteInc, setPizzaFetteInc] = useState<number>(1);
  const [compChoice, setCompChoice] = useState<number | null>(null);

  // Stati Esercizi Inclusione
  const [q1Answer, setQ1Answer] = useState<number | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<boolean | null>(null);
  const [q4Answer, setQ4Answer] = useState<number | null>(null);

  const currentModIndex = INCLUSION_MODULES.findIndex(m => m.id === activeModuleId);

  const goToNextModule = () => {
    if (currentModIndex < INCLUSION_MODULES.length - 1) {
      setActiveModuleId(INCLUSION_MODULES[currentModIndex + 1].id);
    }
  };

  const goToPrevModule = () => {
    if (currentModIndex > 0) {
      setActiveModuleId(INCLUSION_MODULES[currentModIndex - 1].id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-5xl mx-auto space-y-6 pb-20 px-4"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-dida-orange hover:border-dida-orange/30 transition shadow-sm cursor-pointer"
            title="Torna indietro"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Modalità Inclusiva · BES &amp; DSA
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {subjectName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Numeri Naturali e Decimali Facili
            </h1>
          </div>
        </div>

        {/* TTS & Tab Mode Controls */}
        <div className="flex items-center gap-2 flex-wrap self-stretch md:self-auto">
          {/* Pulsante Sintesi Vocale */}
          <button
            onClick={toggleTts}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition cursor-pointer border shadow-sm ${
              ttsEnabled
                ? "bg-amber-500 text-white border-amber-600 shadow-amber-200 animate-pulse"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {ttsEnabled ? "Voce Attiva" : "Attiva Voce"}
          </button>

          {/* Toggle Impara / Allena */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab("impara")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === "impara"
                  ? "bg-white text-dida-orange shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BookOpen size={16} />
              Impara
            </button>
            <button
              onClick={() => setActiveTab("allena")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === "allena"
                  ? "bg-white text-dida-blue shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Zap size={16} />
              Esercizi
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === "impara" ? (
          <motion.div
            key="tab-impara-inc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Navigazione Moduli orizzontale */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {INCLUSION_MODULES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveModuleId(m.id);
                    if (ttsEnabled) {
                      speak(m.title);
                    }
                  }}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition cursor-pointer border ${
                    activeModuleId === m.id
                      ? "bg-dida-orange text-white border-dida-orange shadow-md scale-105"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {m.short}
                </button>
              ))}
            </div>

            {/* MODULO 1: I NUMERI PER CONTARE */}
            {activeModuleId === "mod1" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 1 · Contare le cose
                  </span>
                  <button
                    onClick={() => speak("I numeri naturali servono per contare le cose. Il primo numero è lo zero, che vuol dire nessuna cosa. Poi viene l'uno, il due, il tre. Non finiscono mai!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-3">
                  <div className="text-5xl">🔢</div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                    I Numeri Naturali: 0, 1, 2, 3, 4, 5...
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed font-medium">
                    I numeri naturali sono quelli che usiamo per contare oggetti reali. <br />
                    Il primo numero è lo <strong>0</strong> (nessun oggetto). <br />
                    Ogni numero ha sempre un <strong>successivo</strong> (basta aggiungere 1!).
                  </p>
                </div>

                {/* Tocco interattivo per contare */}
                <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 text-center space-y-4">
                  <span className="text-xs font-black uppercase text-amber-800">
                    Tocca per aggiungere palline e contare:
                  </span>
                  <div className="flex justify-center items-center gap-2 flex-wrap min-h-16">
                    {Array.from({ length: selectedBallCount }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-12 h-12 rounded-full bg-dida-orange text-white flex items-center justify-center font-black text-lg shadow-md"
                      >
                        {i + 1}
                      </motion.div>
                    ))}
                    {selectedBallCount === 0 && (
                      <div className="text-slate-400 font-bold text-sm italic">
                        0 palline (insieme vuoto!)
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        const next = Math.max(0, selectedBallCount - 1);
                        setSelectedBallCount(next);
                        if (ttsEnabled) speak(`Ora ci sono ${next} palline.`);
                      }}
                      className="px-4 py-2 rounded-xl bg-white border border-amber-300 font-bold text-slate-700 hover:bg-amber-100 cursor-pointer"
                    >
                      - Togli una pallina
                    </button>
                    <button
                      onClick={() => {
                        const next = Math.min(10, selectedBallCount + 1);
                        setSelectedBallCount(next);
                        if (ttsEnabled) speak(`Ora ci sono ${next} palline.`);
                      }}
                      className="px-4 py-2 rounded-xl bg-dida-orange text-white font-bold hover:bg-orange-600 cursor-pointer"
                    >
                      + Aggiungi una pallina
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 2: CHI È PIÙ GRANDE */}
            {activeModuleId === "mod2" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 2 · Il Becco Mangione
                  </span>
                  <button
                    onClick={() => speak("Per confrontare i numeri usiamo il becco. La parte aperta e grande mangia il numero più grande. La puntina tocca il numero più piccolo!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🐊</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Il Becco del Coccodrillo Mangia il Più Grande!
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Pensa al simbolo <strong>&gt;</strong> o <strong>&lt;</strong> come alla bocca di un coccodrillo affamato: spalanca la bocca verso il piatto con più cibo!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 text-center space-y-2">
                    <span className="text-4xl font-mono font-black text-dida-blue block">5 &lt; 9</span>
                    <p className="text-xs text-slate-700 font-medium">
                      5 è <strong>minore</strong> di 9. La bocca aperta mangia il 9!
                    </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-orange-50 border-2 border-orange-200 text-center space-y-2">
                    <span className="text-4xl font-mono font-black text-dida-orange block">12 &gt; 4</span>
                    <p className="text-xs text-slate-700 font-medium">
                      12 è <strong>maggiore</strong> di 4. La bocca aperta mangia il 12!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 3: I NUMERI CON LA VIRGOLA */}
            {activeModuleId === "mod3" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 3 · Quando l'intero si divide
                  </span>
                  <button
                    onClick={() => speak("Se dividiamo una pizza in dieci fette uguali, una fetta si chiama un decimo e si scrive zero virgola uno. Dieci decimi formano una pizza intera!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🍕</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    1 Fetta su 10 = 0,1 (Un Decimo)
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    I numeri dopo la virgola sono <strong>pezzetti più piccoli di 1</strong>.<br />
                    1 decimo = 0,1 &nbsp;·&nbsp; 1 centesimo = 0,01.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 text-center space-y-4">
                  <div className="text-lg font-black text-slate-800">
                    Scegli quante fette di pizza vuoi prendere:
                  </div>
                  <div className="flex justify-center gap-1 flex-wrap">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPizzaFetteInc(idx + 1);
                          if (ttsEnabled) speak(`${idx + 1} decimi, cioè zero virgola ${idx + 1}.`);
                        }}
                        className={`w-10 h-10 rounded-xl font-bold text-xs transition cursor-pointer ${
                          idx < pizzaFetteInc
                            ? "bg-amber-500 text-white scale-105"
                            : "bg-white text-slate-400 border border-slate-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-amber-200 inline-block font-mono text-xl font-black text-amber-700 shadow-sm">
                    {pizzaFetteInc} fette = 0,{pizzaFetteInc === 10 ? "1 pizza intera (1,0)" : pizzaFetteInc}
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 4: IL TRUCCO DELLO ZERO */}
            {activeModuleId === "mod4" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 4 · Il Trucco dello Zero
                  </span>
                  <button
                    onClick={() => speak("Nei numeri decimali non vince chi ha più cifre. Per non sbagliare aggiungi gli zeri in fondo. Uno virgola cinque diventa uno virgola cinquecento. Ed è più grande di uno virgola quattrocentotrentadue!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🎩</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Il Trucco Magico dello Zero
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Aggiungere uno zero in fondo dopo la virgola <strong>non cambia il valore</strong>, ma ti aiuta a capire subito chi è più grande!
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-center space-y-3">
                  <div className="text-2xl font-mono font-black text-slate-800">
                    1,5 &nbsp;→&nbsp; <span className="text-dida-orange">1,500</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Ora confrontalo con <strong>1,432</strong>: <br />
                    1,500 è chiaramente <strong>maggiore</strong> di 1,432!
                  </p>
                </div>
              </div>
            )}

            {/* MODULO 5: LE TESSERE DEI NUMERI */}
            {activeModuleId === "mod5" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 5 · Scomposizione
                  </span>
                  <button
                    onClick={() => speak("Ogni numero è formato da pezzi. Il numero trentacinque è formato da tre decine, cioè trenta, e cinque unità.")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🧱</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    I Numeri Sono Fatti di Tessere Colorate
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Le decine valgono 10, le centinaia valgono 100, le unità valgono 1.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300">
                    <span className="text-xs font-bold text-emerald-800">Centinaia (h)</span>
                    <span className="text-2xl font-black text-emerald-950 block my-1">200</span>
                    <span className="text-xs text-emerald-700">2 × 100</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-orange-100 border border-orange-300">
                    <span className="text-xs font-bold text-orange-800">Decine (da)</span>
                    <span className="text-2xl font-black text-orange-950 block my-1">30</span>
                    <span className="text-xs text-orange-700">3 × 10</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-100 border border-blue-300">
                    <span className="text-xs font-bold text-blue-800">Unità (u)</span>
                    <span className="text-2xl font-black text-blue-950 block my-1">4</span>
                    <span className="text-xs text-blue-700">4 × 1</span>
                  </div>
                </div>

                <div className="text-center font-mono font-black text-xl text-slate-800 p-3 bg-slate-50 rounded-2xl">
                  200 + 30 + 4 = 234!
                </div>
              </div>
            )}

            {/* MODULO 6: ARROTONDARE */}
            {activeModuleId === "mod6" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 6 · Regola del 5
                  </span>
                  <button
                    onClick={() => speak("Arrotondare vuol dire trovare il numero tondo più vicino. Se la cifra dopo è piccola, da zero a quattro, resta uguale. Se è da cinque a nove, sale di uno.")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🎯</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Arrotondare: Più Vicino a Chi?
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Il simbolo <strong>≈</strong> significa «circa uguale».
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 text-center space-y-2">
                    <span className="text-xs font-black text-sky-800 uppercase">Da 0 a 4: Torna Indietro</span>
                    <div className="text-xl font-mono font-black text-sky-900">23 ≈ 20</div>
                    <p className="text-xs text-slate-600">23 è più vicino a 20 che a 30!</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <span className="text-xs font-black text-emerald-800 uppercase">Da 5 a 9: Salta Avanti</span>
                    <div className="text-xl font-mono font-black text-emerald-900">28 ≈ 30</div>
                    <p className="text-xs text-slate-600">28 è più vicino a 30!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pulsanti Avanti / Indietro Modulo */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={goToPrevModule}
                disabled={currentModIndex === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm disabled:opacity-40 hover:bg-slate-50 cursor-pointer shadow-sm"
              >
                <ChevronLeft size={18} /> Modulo Precedente
              </button>
              <button
                onClick={goToNextModule}
                disabled={currentModIndex === INCLUSION_MODULES.length - 1}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-dida-orange text-white font-bold text-sm disabled:opacity-40 hover:bg-orange-600 cursor-pointer shadow-md"
              >
                Modulo Successivo <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* ======================================================== */
          /* TAB ALLENA INCLUSIONE */
          /* ======================================================== */
          <motion.div
            key="tab-allena-inc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-[2.5rem] bg-gradient-to-r from-orange-400 to-amber-500 text-white p-6 md:p-8 shadow-md text-center space-y-2">
              <span className="text-xs font-black uppercase text-orange-950 bg-white/20 px-3 py-1 rounded-full">
                Esercizi Facili
              </span>
              <h2 className="text-2xl font-black">Gioca con i Numeri e Vinci le Stelle!</h2>
              <p className="text-orange-100 text-xs max-w-md mx-auto">
                Tocca la risposta che ritieni corretta: riceverai subito la stellina!
              </p>
            </div>

            {/* Esercizio 1: Precedente di 10 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 1</span>
                {q1Answer === 9 && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Bravissimo!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                Quale numero viene subito prima del 10?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[8, 9, 11].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setQ1Answer(val);
                      if (ttsEnabled) {
                        speak(val === 9 ? "Esatto! Subito prima del dieci viene il nove." : "Riprova, conta indietro: dieci, poi nove!");
                      }
                    }}
                    className={`py-4 rounded-2xl text-xl font-black font-mono border-2 transition cursor-pointer ${
                      q1Answer === val
                        ? val === 9
                          ? "bg-emerald-500 text-white border-emerald-600 scale-105"
                          : "bg-rose-500 text-white border-rose-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Esercizio 2: Il Becco */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 2</span>
                {q2Answer === "<" && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Bravissimo!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                Quale becco inserisci tra 4 e 7? &nbsp; <span className="font-mono text-xl">4 [ ? ] 7</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { sym: "<", label: "< (la bocca mangia il 7)", correct: true },
                  { sym: ">", label: "> (la bocca mangia il 4)", correct: false },
                ].map((opt) => (
                  <button
                    key={opt.sym}
                    onClick={() => {
                      setQ2Answer(opt.sym);
                      if (ttsEnabled) {
                        speak(opt.correct ? "Corretto! Il coccodrillo spalanca la bocca verso il sette!" : "Attento: il sette è più grande del quattro!");
                      }
                    }}
                    className={`py-4 px-3 rounded-2xl text-sm font-bold border-2 transition cursor-pointer ${
                      q2Answer === opt.sym
                        ? opt.correct
                          ? "bg-emerald-500 text-white border-emerald-600 scale-105"
                          : "bg-rose-500 text-white border-rose-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Esercizio 3: Zeri uguali */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 3</span>
                {q3Answer === true && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Stellina guadagnata!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                I numeri <strong>3,5</strong> e <strong>3,50</strong> hanno lo stesso valore?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: true, label: "SÌ, sono uguali!", correct: true },
                  { val: false, label: "NO, sono diversi", correct: false },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setQ3Answer(opt.val);
                      if (ttsEnabled) {
                        speak(opt.correct ? "Esatto! Lo zero in fondo alla virgola non cambia il valore." : "Ricorda: gli zeri alla fine della virgola non cambiano la quantità!");
                      }
                    }}
                    className={`py-4 rounded-2xl text-sm font-bold border-2 transition cursor-pointer ${
                      q3Answer === opt.val
                        ? opt.correct
                          ? "bg-emerald-500 text-white border-emerald-600 scale-105"
                          : "bg-rose-500 text-white border-rose-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
