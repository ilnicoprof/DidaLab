import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, Sparkles, CheckCircle2, XCircle,
  HelpCircle, ChevronRight, ChevronLeft, Award, RotateCcw,
  BookOpen, Zap, Check, X, Star, Pizza, Music, Scissors
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

/**
 * Componente Frazione per Modalità Inclusione con Linea Orizzontale Chiara
 */
export const Frac: React.FC<{
  num: React.ReactNode;
  den: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}> = ({ num, den, size = "md", className = "" }) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base font-bold",
    lg: "text-xl font-bold",
    xl: "text-2xl font-black",
  }[size];

  const lineWeight = size === "xl" ? "h-[2px]" : size === "lg" ? "h-[2px]" : "h-[1.5px]";

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none ${sizeClasses} ${className}`}>
      <span className="px-1 text-center w-full pb-[2px] leading-none">{num}</span>
      <span className={`w-full ${lineWeight} bg-current rounded-full`}></span>
      <span className="px-1 text-center w-full pt-[2px] leading-none">{den}</span>
    </span>
  );
};

const INCLUSION_MODULES = [
  { id: "mod1", subtopicMap: "fraction-addition", title: "1. Sommare le Fette (Stesso Taglio)", short: "1. Addizione (+)" },
  { id: "mod2", subtopicMap: "fraction-subtraction", title: "2. Mangiare le Fette (Sottrazione)", short: "2. Sottrazione (−)" },
  { id: "mod3", subtopicMap: "fraction-multiplication", title: "3. La Fetta di una Fetta (Moltiplicazione)", short: "3. Moltiplicazione (×)" },
  { id: "mod4", subtopicMap: "fraction-division", title: "4. Capovolgi e Moltiplica (Divisione)", short: "4. Divisione (:)" },
  { id: "mod5", subtopicMap: "fraction-power", title: "5. Potenze di Frazioni", short: "5. Potenze" },
  { id: "mod6", subtopicMap: "fraction-music", title: "6. La Musica e le Frazioni!", short: "6. Musica" },
];

export default function FractionOperationsLessonInclusion({
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

  // Stati Esercizi Inclusione
  const [q1Answer, setQ1Answer] = useState<boolean | null>(null);

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
                Modalità Inclusiva · Operazioni con Frazioni
              </span>
              <span className="text-xs font-bold text-slate-400">
                {subjectName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Operazioni con le Frazioni Facilitate
            </h1>
          </div>
        </div>

        {/* Controlli Audio e Tab */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTts}
            className={`p-3 rounded-2xl border transition flex items-center gap-2 font-bold text-sm cursor-pointer shadow-xs ${
              ttsEnabled
                ? "bg-amber-100 border-amber-300 text-amber-900"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
            title="Lettura Vocale Automatica"
          >
            {ttsEnabled ? <Volume2 size={20} className="text-amber-700 animate-pulse" /> : <VolumeX size={20} />}
            <span>Voce Guida {ttsEnabled ? "Attiva" : "Disattiva"}</span>
          </button>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab("impara")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition cursor-pointer ${
                activeTab === "impara"
                  ? "bg-white text-dida-orange shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen size={16} />
              Impara
            </button>
            <button
              onClick={() => setActiveTab("allena")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition cursor-pointer ${
                activeTab === "allena"
                  ? "bg-white text-dida-orange shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap size={16} />
              Allena
            </button>
          </div>
        </div>
      </div>

      {activeTab === "impara" ? (
        <div className="space-y-6">
          {/* Navigatore Moduli */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {INCLUSION_MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModuleId(mod.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition cursor-pointer border ${
                  activeModuleId === mod.id
                    ? "bg-dida-orange text-white border-dida-orange shadow-md scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {mod.short}
              </button>
            ))}
          </div>

          {/* Scheda Didattica Modulo */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Guida Chiara & Visiva
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">
                  {INCLUSION_MODULES[currentModIndex].title}
                </h2>
              </div>
              <button
                onClick={() => {
                  const textToRead = currentModIndex === 0
                    ? "Per sommare due frazioni con lo stesso denominatore, sommiamo solo i numeri sopra. Il numero sotto non cambia mai! Proprio come contare le mele: due mele più tre mele fanno cinque mele."
                    : currentModIndex === 2
                    ? "Per moltiplicare due frazioni, moltiplichiamo il sopra per il sopra, e il sotto per il sotto! Possiamo anche semplificare a croce per fare calcoli più facili."
                    : "Per dividere per una frazione, basta capovolgere la seconda frazione e trasformare la divisione in una moltiplicazione!";
                  speak(textToRead);
                }}
                className="p-3 rounded-2xl bg-orange-50 text-dida-orange hover:bg-orange-100 border border-orange-200 transition cursor-pointer"
                title="Ascolta spiegazione"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Modulo 1: Addizione */}
            {activeModuleId === "mod1" && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-3 text-center">
                  <span className="text-xs font-black uppercase text-amber-800">REGOLA FACILE</span>
                  <div className="text-2xl font-black text-amber-900 flex items-center justify-center gap-2">
                    <Frac num={5} den={9} size="lg" />
                    <span>+</span>
                    <Frac num={2} den={9} size="lg" />
                    <span>=</span>
                    <Frac num={7} den={9} size="xl" className="text-amber-700" />
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Come contare le fette: 5 fette di pizza + 2 fette = <strong>7 fette</strong> dello stesso tipo! Il numero sotto (9) non cambia mai.
                  </p>
                </div>
              </div>
            )}

            {/* Modulo 2: Sottrazione */}
            {activeModuleId === "mod2" && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 space-y-3 text-center">
                  <span className="text-xs font-black uppercase text-blue-800">SOTTRARRE LE FETTE</span>
                  <div className="text-2xl font-black text-blue-900 flex items-center justify-center gap-2">
                    <Frac num={5} den={8} size="lg" />
                    <span>−</span>
                    <Frac num={2} den={8} size="lg" />
                    <span>=</span>
                    <Frac num={3} den={8} size="xl" className="text-blue-700" />
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Avevi 5 fette su 8, ne togli 2: ti restano <strong>3 fette su 8</strong>!
                  </p>
                </div>
              </div>
            )}

            {/* Modulo 3: Moltiplicazione */}
            {activeModuleId === "mod3" && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-3 text-center">
                  <span className="text-xs font-black uppercase text-emerald-800">MOLTIPLICARE È FACILISSIMO</span>
                  <div className="text-sm font-bold text-emerald-900">
                    (Sopra × Sopra) fratto (Sotto × Sotto)
                  </div>
                  <div className="text-2xl font-black text-emerald-700 flex items-center justify-center gap-2">
                    <Frac num={2} den={3} size="lg" />
                    <span>×</span>
                    <Frac num={1} den={5} size="lg" />
                    <span>=</span>
                    <Frac num="2 × 1" den="3 × 5" size="lg" />
                    <span>=</span>
                    <Frac num={2} den={15} size="xl" />
                  </div>
                </div>
              </div>
            )}

            {/* Modulo 4: Divisione */}
            {activeModuleId === "mod4" && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-purple-50 border-2 border-purple-200 space-y-3 text-center">
                  <span className="text-xs font-black uppercase text-purple-800">CAPOVOLGI LA SECONDA FRAZIONE!</span>
                  <p className="text-sm text-slate-700">
                    La prima frazione resta uguale. Il simbolo <strong>(:)</strong> diventa <strong>(×)</strong>. La seconda frazione si capovolge a testa in giù!
                  </p>
                  <div className="text-xl font-black text-purple-900 flex items-center justify-center gap-2">
                    <span>6 :</span>
                    <Frac num={3} den={4} size="md" />
                    <span>= 6 ×</span>
                    <Frac num={4} den={3} size="md" />
                    <span>= <Frac num={24} den={3} size="md" /> = 8</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modulo 5: Potenze */}
            {activeModuleId === "mod5" && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">Eleva Entrambi i Numeri</span>
                  <div className="text-xl font-black text-slate-800 flex items-center justify-center gap-2">
                    <span>(<Frac num={3} den={4} size="md" />)² =</span>
                    <Frac num="3²" den="4²" size="md" />
                    <span>=</span>
                    <Frac num={9} den={16} size="xl" className="text-emerald-700" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Fai il quadrato del numero sopra (3 × 3 = 9) e del numero sotto (4 × 4 = 16)!
                  </p>
                </div>
              </div>
            )}

            {/* Modulo 6: Musica */}
            {activeModuleId === "mod6" && (
              <div className="space-y-4 text-center">
                <p className="text-base text-slate-700">
                  Ogni nota musicale ha un valore in frazione:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center font-mono">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-xs font-sans text-amber-800 block">Semibreve</span>
                    <strong className="text-xl text-amber-900">1</strong>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="text-xs font-sans text-blue-800 block">Minima</span>
                    <Frac num={1} den={2} size="lg" className="text-blue-900" />
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-xs font-sans text-emerald-800 block">Semiminima</span>
                    <Frac num={1} den={4} size="lg" className="text-emerald-900" />
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <span className="text-xs font-sans text-purple-800 block">Croma</span>
                    <Frac num={1} den={8} size="lg" className="text-purple-900" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigazione */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={goToPrevModule}
                disabled={currentModIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={16} /> Precedente
              </button>
              <span className="text-xs text-slate-400 font-semibold">
                Modulo {currentModIndex + 1} di {INCLUSION_MODULES.length}
              </span>
              <button
                onClick={goToNextModule}
                disabled={currentModIndex === INCLUSION_MODULES.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-dida-orange hover:bg-orange-600 disabled:opacity-40 cursor-pointer"
              >
                Successivo <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Tab Allena Inclusione */
        <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
              Palestra Facilitata
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">
              Esercizi Facili sulle Operazioni
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                <span>1. È vero che</span>
                <Frac num={1} den={5} size="xs" />
                <span>+</span>
                <Frac num={2} den={5} size="xs" />
                <span>fa</span>
                <Frac num={3} den={5} size="xs" />?
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setQ1Answer(true)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs border cursor-pointer ${
                    q1Answer === true ? "bg-emerald-500 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-300"
                  }`}
                >
                  Sì, è verissimo!
                </button>
                <button
                  onClick={() => setQ1Answer(false)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs border cursor-pointer ${
                    q1Answer === false ? "bg-rose-500 text-white border-rose-600" : "bg-white text-slate-700 border-slate-300"
                  }`}
                >
                  No, fa 3/10
                </button>
              </div>
              {q1Answer !== null && (
                <p className="text-xs font-bold text-slate-600">
                  {q1Answer ? "✅ Bravissimo! 1 + 2 = 3 e il denominatore 5 resta uguale!" : "❌ Attento: il numero sotto non si somma mai!"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
