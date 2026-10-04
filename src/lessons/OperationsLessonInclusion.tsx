import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, ChevronRight, ChevronLeft, BookOpen, Zap, Star
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
  { id: "mod1", subtopicMap: "addition-properties", title: "1. L'Addizione (+)", short: "1. Addizione (+)" },
  { id: "mod2", subtopicMap: "subtraction-properties", title: "2. La Sottrazione (−)", short: "2. Sottrazione (−)" },
  { id: "mod3", subtopicMap: "multiplication-properties", title: "3. La Moltiplicazione (×)", short: "3. Moltiplicazione (×)" },
  { id: "mod4", subtopicMap: "division-properties", title: "4. La Divisione (:)", short: "4. Divisione (:)" },
  { id: "mod5", subtopicMap: "expressions-order", title: "5. Le Precedenze dei Calcoli", short: "5. Precedenze" },
  { id: "mod6", subtopicMap: "problem-solving-methods", title: "6. I Problemi con i Mattoncini", short: "6. Problemi" },
];

export default function OperationsLessonInclusion({
  onBack,
  subjectName,
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
  const { ttsEnabled, speak, toggleTts } = useSpeech();

  // Stati Esercizi Inclusione
  const [q1Answer, setQ1Answer] = useState<number | null>(null);
  const [q2Answer, setQ2Answer] = useState<boolean | null>(null);
  const [q3Answer, setQ3Answer] = useState<number | null>(null);

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
              Le Quattro Operazioni Facili
            </h1>
          </div>
        </div>

        {/* TTS & Tab Mode Controls */}
        <div className="flex items-center gap-2 flex-wrap self-stretch md:self-auto">
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
            key="tab-impara-ops-inc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Navigazione orizzontale */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {INCLUSION_MODULES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveModuleId(m.id);
                    if (ttsEnabled) speak(m.title);
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

            {/* MODULO 1: ADDIZIONE */}
            {activeModuleId === "mod1" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 1 · Mettere Insieme
                  </span>
                  <button
                    onClick={() => speak("L'addizione serve per mettere insieme le cose. Se cambi l'ordine dei numeri, il totale non cambia mai! E se aggiungi zero, il numero resta uguale.")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">➕</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    L'Addizione: Cambia l'Ordine, il Totale è Uguale!
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Se metti nel carrello prima il pane e poi il latte, o prima il latte e poi il pane, pagherai sempre la stessa cifra!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 text-center space-y-2">
                    <span className="text-3xl font-mono font-black text-dida-blue block">4 + 6 = 6 + 4 = 10</span>
                    <p className="text-xs text-slate-700 font-medium">
                      Proprietà commutativa: cambia l'ordine come vuoi!
                    </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-2">
                    <span className="text-3xl font-mono font-black text-emerald-700 block">15 + 0 = 15</span>
                    <p className="text-xs text-slate-700 font-medium">
                      Lo zero è neutro: non aggiunge nulla!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 2: SOTTRAZIONE */}
            {activeModuleId === "mod2" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 2 · Togliere e Distacco
                  </span>
                  <button
                    onClick={() => speak("La sottrazione serve per togliere o per calcolare la differenza. La differenza di età tra due fratelli non cambia mai, neanche dopo dieci anni!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">➖</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    La Differenza d'Età Non Cambia Mai!
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Se tuo fratello ha 10 anni e tu ne hai 7, la differenza è di 3 anni. Tra 5 anni ne avrete 15 e 12: la differenza sarà sempre di 3 anni!
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-center space-y-2">
                  <div className="text-2xl font-mono font-black text-amber-950">
                    (10 + 2) − (7 + 2) = 12 − 9 = 3
                  </div>
                  <p className="text-xs text-amber-900">
                    Questa è la <strong>proprietà invariantiva</strong>: aggiungendo lo stesso numero a entrambi, il risultato non cambia!
                  </p>
                </div>
              </div>
            )}

            {/* MODULO 3: MOLTIPLICAZIONE */}
            {activeModuleId === "mod3" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 3 · Scorciatoia per Sommare
                  </span>
                  <button
                    onClick={() => speak("La moltiplicazione serve quando sommi sempre lo stesso numero. Se hai tre pacchetti con cinque caramelle ciascuno, fai tre per cinque e trovi subito quindici!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">✖️</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    La Moltiplicazione: Addizione Veloce
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    5 + 5 + 5 = <strong>3 × 5 = 15</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-2">
                    <span className="text-2xl font-mono font-black text-emerald-800 block">7 × 1 = 7</span>
                    <p className="text-xs text-slate-700">L'1 è neutro: lascia il numero tale e quale.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-200 text-center space-y-2">
                    <span className="text-2xl font-mono font-black text-rose-800 block">7 × 0 = 0</span>
                    <p className="text-xs text-slate-700">Lo 0 è assorbente: azzera tutto!</p>
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 4: DIVISIONE */}
            {activeModuleId === "mod4" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 4 · Dividere in Parti Uguali
                  </span>
                  <button
                    onClick={() => speak("La divisione distribuisce in parti uguali. Attenzione: non si può mai dividere per zero, è impossibile!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">➗</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Dividere: Parti Uguali e Resto
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    20 caramelle a 4 amici = <strong>5 caramelle a testa</strong> (senza resto)!
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-300 text-center space-y-2">
                  <span className="text-xs font-black uppercase text-rose-800 tracking-wider">
                    ⚠️ Divieto Assoluto della Matematica!
                  </span>
                  <div className="text-2xl font-mono font-black text-rose-700">
                    Dividere per 0 è IMPOSSIBILE!
                  </div>
                  <p className="text-xs text-rose-900">
                    Non puoi dividere 5 mele tra zero persone: non ha alcun senso!
                  </p>
                </div>
              </div>
            )}

            {/* MODULO 5: PRECEDENZE */}
            {activeModuleId === "mod5" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 5 · Il Semaforo dei Calcoli
                  </span>
                  <button
                    onClick={() => speak("Nelle espressioni il per e il diviso hanno sempre la precedenza sul più e sul meno. Fai prima loro!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🚦</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Il Semaforo delle Operazioni
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    La moltiplicazione (×) e la divisione (:) passano per prime!
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-center space-y-3">
                  <div className="text-2xl font-mono font-black text-slate-900">
                    5 + <span className="text-dida-orange">9 × 4</span> = 5 + 36 = 41
                  </div>
                  <p className="text-xs text-slate-700">
                    Fai prima <strong className="text-dida-orange">9 × 4 = 36</strong>, poi sommi il 5!
                  </p>
                </div>
              </div>
            )}

            {/* MODULO 6: PROBLEMI A MATTONCINI */}
            {activeModuleId === "mod6" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 6 · Disegna con i Mattoncini
                  </span>
                  <button
                    onClick={() => speak("Nei problemi di matematica disegna sempre i segmenti come mattoncini colorati. Se togli la differenza ottieni due pezzi uguali!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🧱</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    I Problemi Disegnati a Mattoncini
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Disegna una riga più corta per il numero piccolo e una più lunga con il pezzo in più per il numero grande.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 text-center space-y-2">
                  <div className="text-sm font-bold text-slate-800">
                    Somma = 20 &nbsp;·&nbsp; Differenza = 4 in più
                  </div>
                  <div className="text-xs text-slate-600">
                    Togli il 4: restano 16. Dividi per 2: <strong>8</strong> (il minore) e <strong>12</strong> (il maggiore)!
                  </div>
                </div>
              </div>
            )}

            {/* Pulsanti Avanti / Indietro */}
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
            key="tab-allena-ops-inc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-[2.5rem] bg-gradient-to-r from-orange-400 to-amber-500 text-white p-6 md:p-8 shadow-md text-center space-y-2">
              <span className="text-xs font-black uppercase text-orange-950 bg-white/20 px-3 py-1 rounded-full">
                Esercizi Guidati
              </span>
              <h2 className="text-2xl font-black">Mettiti alla Prova e Vinci le Stelline!</h2>
              <p className="text-orange-100 text-xs max-w-md mx-auto">
                Tocca la risposta corretta per sbloccare la stellina dorata!
              </p>
            </div>

            {/* Esercizio 1: Lo zero nell'addizione */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 1</span>
                {q1Answer === 24 && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Bravissimo!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                Quanto fa &nbsp; <span className="font-mono text-xl">24 + 0</span>?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[0, 24, 240].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setQ1Answer(val);
                      if (ttsEnabled) {
                        speak(val === 24 ? "Esatto! Lo zero non cambia la somma, fa ventiquattro." : "Riprova: aggiungere zero non cambia il numero!");
                      }
                    }}
                    className={`py-4 rounded-2xl text-xl font-black font-mono border-2 transition cursor-pointer ${
                      q1Answer === val
                        ? val === 24
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

            {/* Esercizio 2: Si può dividere per zero? */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 2</span>
                {q2Answer === false && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Stellina guadagnata!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                Si può fare la divisione &nbsp; <span className="font-mono text-xl">8 : 0</span>?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: true, label: "SÌ, fa 0", correct: false },
                  { val: false, label: "NO, è IMPOSSIBILE!", correct: true },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setQ2Answer(opt.val);
                      if (ttsEnabled) {
                        speak(opt.correct ? "Bravissimo! Dividere per zero non si può mai fare, è impossibile!" : "Attenzione: non si può mai dividere per zero!");
                      }
                    }}
                    className={`py-4 rounded-2xl text-sm font-bold border-2 transition cursor-pointer ${
                      q2Answer === opt.val
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

            {/* Esercizio 3: Precedenza */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 3</span>
                {q3Answer === 14 && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Bravissimo!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                Quanto fa &nbsp; <span className="font-mono text-xl">2 + 3 × 4</span>?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 20, label: "20 (se fai prima 2+3=5)", correct: false },
                  { val: 14, label: "14 (prima 3×4=12, poi +2)", correct: true },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setQ3Answer(opt.val);
                      if (ttsEnabled) {
                        speak(opt.correct ? "Corretto! La moltiplicazione viene prima dell'addizione!" : "Ricorda il semaforo: prima la moltiplicazione!");
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
