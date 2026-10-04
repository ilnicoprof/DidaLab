import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, ChevronRight, ChevronLeft, BookOpen, Zap
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
  { id: "mod1", subtopicMap: "fraction", title: "1. La Pizza e l'Intero", short: "1. Cos'è la Frazione" },
  { id: "mod2", subtopicMap: "proper-improper-apparent-fractions", title: "2. Meno di 1, Più di 1 o Intero?", short: "2. I 3 Tipi di Frazione" },
  { id: "mod3", subtopicMap: "equivalent-fractions", title: "3. Fette Diverse, Stessa Fame!", short: "3. Frazioni Equivalenti" },
  { id: "mod4", subtopicMap: "reduction-minimum-terms", title: "4. Semplificare: Tagli Grandi", short: "4. Semplificare" },
  { id: "mod5", subtopicMap: "fraction-comparison", title: "5. Chi mangia di più?", short: "5. Confrontare Frazioni" },
  { id: "mod6", subtopicMap: "fraction-problems", title: "6. Dalla Parte al Totale", short: "6. Risolvere Problemi" },
];

export default function FractionsLessonInclusion({
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
  const [q1Answer, setQ1Answer] = useState<boolean | null>(null);
  const [q2Answer, setQ2Answer] = useState<number | null>(null);

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
                Modalità Inclusiva · Frazioni
              </span>
              <span className="text-xs font-bold text-slate-400">
                {subjectName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Le Frazioni Facilitate
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
          {/* Navigatore Moduli Inclusione */}
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
            {/* Header Modulo con Lettura Audio */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Guida Chiara & Visuale
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">
                  {INCLUSION_MODULES[currentModIndex].title}
                </h2>
              </div>
              <button
                onClick={() => {
                  const textToRead = currentModIndex === 0
                    ? "Una frazione divide una pizza intera in parti uguali. Il numero sotto, il denominatore, dice in quanti pezzi uguali tagliamo la pizza. Il numero sopra, il numeratore, dice quante fette mangiamo!"
                    : currentModIndex === 1
                    ? "Ci sono tre tipi di frazione. Propria: meno di una pizza intera. Impropria: più di una pizza intera. Apparente: pizze intere esatte!"
                    : "Due frazioni sono equivalenti quando rappresentano la stessa quantità di pizza, anche se tagliata in più fette!";
                  speak(textToRead);
                }}
                className="p-3 rounded-2xl bg-orange-50 text-dida-orange hover:bg-orange-100 border border-orange-200 transition cursor-pointer"
                title="Ascolta spiegazione"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Contenuto Dinamico Modulo */}
            {activeModuleId === "mod1" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4 text-slate-700 text-base leading-relaxed">
                    <p>
                      Immagina una <strong>pizza margherita</strong> appena sfornata:
                    </p>
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-mono">3</span>
                        NUMERATORE: le fette che mangi
                      </div>
                      <div className="h-0.5 w-full bg-amber-300"></div>
                      <div className="flex items-center gap-2 font-bold text-emerald-900">
                        <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-mono">4</span>
                        DENOMINATORE: in quante fette è divisa la pizza
                      </div>
                    </div>
                    <p className="text-sm flex items-center gap-1">
                      <span>Si legge <strong>«tre quarti»</strong>:</span>
                      <Frac num={3} den={4} size="md" className="text-amber-800" />
                      <span>. Vuol dire che hai mangiato 3 fette su 4!</span>
                    </p>
                  </div>

                  {/* Disegno semplificato */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase">La Pizza <Frac num={3} den={4} size="xs" /></span>
                    <div className="w-36 h-36 rounded-full border-4 border-amber-600 bg-amber-100 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute top-0 right-0 w-18 h-18 bg-white border-l border-b border-amber-600"></div>
                      <Frac num={3} den={4} size="xl" className="text-amber-900 z-10" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <span>Resta 1 fetta: la frazione che manca è</span> <Frac num={1} den={4} size="xs" />!
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeModuleId === "mod2" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 text-center space-y-2 flex flex-col items-center">
                    <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                      PROPRIA
                    </span>
                    <Frac num={2} den={5} size="xl" className="text-blue-800" />
                    <p className="text-xs text-slate-700">
                      Meno di 1 pizza intera (il numero sopra è più piccolo).
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-center space-y-2 flex flex-col items-center">
                    <span className="text-xs font-black uppercase text-amber-700 bg-white px-3 py-1 rounded-full border border-amber-200">
                      IMPROPRIA
                    </span>
                    <Frac num={7} den={4} size="xl" className="text-amber-800" />
                    <p className="text-xs text-slate-700">
                      Più di 1 pizza intera (1 pizza intera + 3 fette).
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-purple-50 border-2 border-purple-200 text-center space-y-2 flex flex-col items-center">
                    <span className="text-xs font-black uppercase text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200">
                      APPARENTE
                    </span>
                    <div className="flex items-center gap-2">
                      <Frac num={8} den={4} size="xl" className="text-purple-800" />
                      <span className="text-2xl font-black text-purple-800">= 2</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      Sono pizze intere esatte (8 fette da un quarto = 2 pizze intere!).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeModuleId === "mod3" && (
              <div className="space-y-4">
                <p className="text-base text-slate-700">
                  Se prendi <strong>1 fetta su 2</strong> o <strong>2 fette su 4</strong>, mangi esattamente la stessa identica quantità di cioccolato!
                </p>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-around gap-4 text-center">
                  <div className="p-4 bg-white rounded-xl border border-slate-300 flex flex-col items-center">
                    <Frac num={1} den={2} size="xl" className="text-blue-600" />
                    <span className="block text-xs text-slate-500 mt-1">metà barretta</span>
                  </div>
                  <span className="text-3xl font-black text-slate-400">=</span>
                  <div className="p-4 bg-white rounded-xl border border-slate-300 flex flex-col items-center">
                    <Frac num={2} den={4} size="xl" className="text-blue-600" />
                    <span className="block text-xs text-slate-500 mt-1">due quarti</span>
                  </div>
                  <span className="text-3xl font-black text-slate-400">=</span>
                  <div className="p-4 bg-white rounded-xl border border-slate-300 flex flex-col items-center">
                    <Frac num={4} den={8} size="xl" className="text-blue-600" />
                    <span className="block text-xs text-slate-500 mt-1">quattro ottavi</span>
                  </div>
                </div>
              </div>
            )}

            {activeModuleId === "mod4" && (
              <div className="space-y-4 text-slate-700">
                <p className="text-base">
                  <strong>Semplificare</strong> significa raggruppare i pezzi piccoli in pezzi più grandi per fare meno calcoli.
                </p>
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-center">
                  <span className="text-xs font-bold text-emerald-800 uppercase block">Esempio Guidato:</span>
                  <div className="text-lg text-emerald-900 font-bold flex items-center justify-center gap-3">
                    <Frac num={12} den={18} size="lg" />
                    <span>➔ divido per 6 ➔</span>
                    <Frac num={2} den={3} size="xl" className="text-emerald-700" />
                  </div>
                  <p className="text-xs text-emerald-700 pt-1">
                    Dire "2 ragazzi ogni 3 ragazze" è molto più facile da capire che "12 su 18"!
                  </p>
                </div>
              </div>
            )}

            {activeModuleId === "mod5" && (
              <div className="space-y-4 text-slate-700">
                <p className="text-base">
                  Chi ne mangia di più?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <strong className="text-blue-900 block mb-1">Stesso Denominatore:</strong>
                    <div className="flex items-center gap-2 text-lg font-bold text-blue-700">
                      <Frac num={4} den={9} size="md" /> <span>&gt;</span> <Frac num={2} den={9} size="md" />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">Vince chi prende più fette (4 è più di 2)!</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <strong className="text-amber-900 block mb-1">Stesso Numeratore:</strong>
                    <div className="flex items-center gap-2 text-lg font-bold text-amber-700">
                      <Frac num={3} den={4} size="md" /> <span>&gt;</span> <Frac num={3} den={5} size="md" />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">Le fette da un quarto sono più grosse dei quinti!</p>
                  </div>
                </div>
              </div>
            )}

            {activeModuleId === "mod6" && (
              <div className="space-y-4 text-slate-700">
                <p className="text-base">
                  Il trucco dei problemi:
                </p>
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <strong className="text-amber-900 text-sm block">1. Trova sempre il valore di 1 sola parte (Unità Frazionaria)!</strong>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Se 56 litri sono divisi in 7 parti uguali: <span className="font-bold">56 : 7 = 8 litri a parte</span>. <br />
                    Se ne consumi i <Frac num={4} den={7} size="xs" />: <span className="font-bold">8 × 4 = 32 litri</span>!
                  </p>
                </div>
              </div>
            )}

            {/* Barra Navigazione Avanti/Indietro */}
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
        /* TAB ALLENA INCLUSIONE */
        <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
              Palestra Facilitata
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">
              Esercizi Rapidi con Aiuto
            </h2>
          </div>

          <div className="space-y-6">
            {/* Domanda 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                <span>1. La frazione</span> <Frac num={3} den={8} size="xs" /> <span>ha denominatore uguale a 8?</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setQ1Answer(true)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs border cursor-pointer ${
                    q1Answer === true ? "bg-emerald-500 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-300"
                  }`}
                >
                  Sì, il numero sotto è 8
                </button>
                <button
                  onClick={() => setQ1Answer(false)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs border cursor-pointer ${
                    q1Answer === false ? "bg-rose-500 text-white border-rose-600" : "bg-white text-slate-700 border-slate-300"
                  }`}
                >
                  No, il denominatore è 3
                </button>
              </div>
              {q1Answer !== null && (
                <p className="text-xs font-bold text-slate-600">
                  {q1Answer ? "✅ Bravissimo! Il denominatore sta sotto." : "❌ Ricorda: il Denominatore sta sotto, il Numeratore sta sopra!"}
                </p>
              )}
            </div>

            {/* Domanda 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                <span>2. Hai 10 caramelle. Ne regali la metà (</span><Frac num={1} den={2} size="xs" /><span>). Quante ne regali?</span>
              </div>
              <div className="flex gap-2">
                {[3, 5, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQ2Answer(n)}
                    className={`w-12 h-12 rounded-xl font-mono font-bold text-sm border cursor-pointer ${
                      q2Answer === n
                        ? n === 5 ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {q2Answer !== null && (
                <p className="text-xs font-bold text-slate-600">
                  {q2Answer === 5 ? "✅ Esatto! 10 : 2 = 5 caramelle." : "❌ Dividi 10 a metà con due amici: 10 : 2 = 5!"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
