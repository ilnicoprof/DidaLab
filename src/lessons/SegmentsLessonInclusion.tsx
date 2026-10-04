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
  { id: "mod1", subtopicMap: "segments-def", title: "1. Che cos'è un Segmento?", short: "1. Il Segmento" },
  { id: "mod2", subtopicMap: "segments-def", title: "2. Misurare con il Righello", short: "2. Il Righello e lo 0" },
  { id: "mod3", subtopicMap: "segments-def", title: "3. Consecutivi o Adiacenti?", short: "3. Si toccano?" },
  { id: "mod4", subtopicMap: "segments-comparison", title: "4. Confrontare i Segmenti", short: "4. Più Lungo o Uguale?" },
  { id: "mod5", subtopicMap: "segments-operations", title: "5. Somma e Differenza con le Strisce", short: "5. Somma & Differenza" },
  { id: "mod6", subtopicMap: "segment-midpoint", title: "6. La Piega Magica e il Punto Medio", short: "6. Il Punto Medio" },
];

export default function SegmentsLessonInclusion({
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
  const { ttsEnabled, speak, toggleTts } = useSpeech();

  // Stati Interattivi Moduli Inclusione
  const [placedTrees, setPlacedTrees] = useState<boolean>(true);
  const [rulerAlignment, setRulerAlignment] = useState<"zero" | "border">("zero");
  const [comparisonState, setComparisonState] = useState<"equal" | "a_bigger" | "b_bigger">("equal");
  const [paperStripMode, setPaperStripMode] = useState<"sum" | "diff">("sum");
  const [foldedPaper, setFoldedPaper] = useState<boolean>(false);

  // Stati Esercizi Allena
  const [q1Selected, setQ1Selected] = useState<string | null>(null);
  const [q2Selected, setQ2Selected] = useState<string | null>(null);
  const [q3Selected, setQ3Selected] = useState<string | null>(null);
  const [q4Selected, setQ4Selected] = useState<string | null>(null);

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
                Modalità Inclusiva · Geometria Facile
              </span>
              <span className="text-xs font-bold text-slate-400">
                {subjectName} · {topicName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              I Segmenti Facilitati
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
                  Guida Chiara, Visuale & Pratica
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">
                  {INCLUSION_MODULES[currentModIndex].title}
                </h2>
              </div>
              <button
                onClick={() => {
                  const texts: Record<string, string> = {
                    mod1: "Il segmento è un pezzo di retta con un inizio e una fine. I due punti di inizio e fine si chiamano estremi A e B. È come una corda per stendere i panni tesa tra due alberi!",
                    mod2: "Per misurare un segmento con il righello, allinea sempre il numero zero con il primo estremo A! Non usare mai il bordo di plastica del righello, altrimenti la misura sarà sbagliata!",
                    mod3: "Due segmenti sono consecutivi se hanno un punto in comune a zig zag. Sono adiacenti se hanno un punto in comune e si trovano sulla stessa linea dritta!",
                    mod4: "Due segmenti si dicono congruenti quando hanno la stessa identica lunghezza e si possono sovrapporre perfettamente!",
                    mod5: "Per fare la somma mettiamo i due segmenti in fila uno dopo l'altro. Per fare la differenza li sovrapponiamo: la differenza è il pezzo che sporge oltre il più corto!",
                    mod6: "Il punto medio M si trova a metà esatta e divide il segmento in due parti perfettamente uguali. Puoi trovarlo piegando il foglio in modo che i due estremi combacino!",
                  };
                  speak(texts[activeModuleId] || "");
                }}
                className="p-3 rounded-2xl bg-orange-50 text-dida-orange hover:bg-orange-100 border border-orange-200 transition cursor-pointer"
                title="Ascolta spiegazione"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* CONTENUTO MODULO 1: COS'È IL SEGMENTO */}
            {activeModuleId === "mod1" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-blue-50/80 border-2 border-blue-200 text-slate-700 leading-relaxed text-base space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🌳</span>
                    <p className="font-bold text-blue-900 text-lg">
                      La metafora della corda per i panni tra due alberi
                    </p>
                  </div>
                  <p>
                    Immagina di legare una corda ben tesa tra due alberi nel cortile.
                    La corda tesa è un <strong>segmento</strong>. E i due alberi?
                    Sono i suoi <strong>estremi A e B</strong> (dove inizia e dove finisce)!
                  </p>
                  <p className="text-sm bg-white p-3 rounded-2xl border border-blue-200 text-blue-950 font-medium">
                    📌 <strong>Da ricordare:</strong> Il segmento è la <strong>strada più breve</strong> che unisce il punto A al punto B.
                  </p>
                </div>

                {/* Simulatore Visivo della Corda */}
                <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 text-center space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-500 uppercase">Laboratorio Visuale</span>
                    <button
                      onClick={() => setPlacedTrees(!placedTrees)}
                      className="px-4 py-1.5 rounded-xl bg-dida-blue text-white text-xs font-bold shadow-xs hover:bg-blue-700 cursor-pointer"
                    >
                      {placedTrees ? "Togli la corda" : "Tendi la corda"}
                    </button>
                  </div>

                  <div className="relative h-44 bg-gradient-to-b from-sky-50 to-emerald-50 rounded-2xl border border-slate-200 flex items-center justify-between px-12 md:px-24 overflow-hidden">
                    {/* Albero A */}
                    <div className="flex flex-col items-center z-10">
                      <span className="text-4xl md:text-5xl">🌳</span>
                      <span className="px-3 py-1 mt-1 rounded-full bg-blue-600 text-white font-black text-xs shadow-xs">
                        Estremo A
                      </span>
                    </div>

                    {/* Corda / Segmento */}
                    <div className="flex-1 relative mx-4 flex items-center justify-center">
                      {placedTrees ? (
                        <div className="w-full relative flex items-center">
                          <div className="w-full h-2.5 bg-orange-500 rounded-full shadow-md animate-pulse"></div>
                          <span className="absolute left-1/2 -top-6 -translate-x-1/2 px-3 py-1 bg-white rounded-full border border-orange-300 text-orange-950 font-black text-xs shadow-xs whitespace-nowrap">
                            Segmento AB = Corda tesa
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Corda allentata: nessun segmento dritto!</span>
                      )}
                    </div>

                    {/* Albero B */}
                    <div className="flex flex-col items-center z-10">
                      <span className="text-4xl md:text-5xl">🌳</span>
                      <span className="px-3 py-1 mt-1 rounded-full bg-blue-600 text-white font-black text-xs shadow-xs">
                        Estremo B
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    Si scrive <strong>AB</strong> con due lettere maiuscole per indicare i due estremi.
                  </p>
                </div>
              </div>
            )}

            {/* CONTENUTO MODULO 2: MISURARE CON IL RIGHELLO */}
            {activeModuleId === "mod2" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-amber-50/80 border-2 border-amber-200 text-slate-700 leading-relaxed text-base space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚠️</span>
                    <p className="font-bold text-amber-950 text-lg">
                      La regola d'oro: allinea lo 0, NON il bordo di plastica!
                    </p>
                  </div>
                  <p>
                    Tutti i righelli hanno un piccolo pezzetto vuoto di plastica prima del numero 0.
                    Se appoggi il bordo all'inizio del segmento, la misura sarà <strong>sbagliata</strong>!
                  </p>
                </div>

                {/* Simulatore Interattivo Righello */}
                <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setRulerAlignment("zero")}
                      className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                        rulerAlignment === "zero"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      ✅ Allinea allo ZERO (Corretto)
                    </button>
                    <button
                      onClick={() => setRulerAlignment("border")}
                      className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                        rulerAlignment === "border"
                          ? "bg-rose-600 text-white border-rose-600 shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      ❌ Allinea al BORDO (Errore tipico)
                    </button>
                  </div>

                  {/* Visuale Righello & Segmento */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
                    {/* Segmento da misurare (lungo 6 cm reali nel modello) */}
                    <div className="flex items-center justify-center">
                      <div className="w-[300px] flex items-center justify-between relative">
                        <span className="absolute -left-6 font-bold text-xs text-blue-700">A</span>
                        <div className="w-full h-3 bg-blue-600 rounded-full"></div>
                        <span className="absolute -right-6 font-bold text-xs text-blue-700">B</span>
                      </div>
                    </div>

                    {/* Righello spostato */}
                    <div className="flex justify-center overflow-x-auto py-2">
                      <div
                        className={`transition-all duration-500 rounded-xl border border-amber-300 bg-amber-50 p-2 shadow-sm font-mono text-xs flex ${
                          rulerAlignment === "border" ? "translate-x-6 border-rose-300 bg-rose-50" : "translate-x-0"
                        }`}
                      >
                        <div className="w-6 border-r border-dashed border-amber-400 flex items-center justify-center text-[10px] text-slate-400">
                          bordo
                        </div>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <div key={num} className="w-[50px] border-l border-amber-400 text-left pl-1">
                            <span className="font-bold text-slate-700">{num}</span>
                            <div className="h-2 border-l border-amber-300 ml-4"></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Esito Misura */}
                    {rulerAlignment === "zero" ? (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold text-sm">
                        🎉 Bravissimo! Lo zero è su A: la misura corretta è esattamente <strong>6 cm</strong>!
                      </div>
                    ) : (
                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 font-bold text-sm">
                        ⚠️ Attenzione! Leggi circa 6,6 cm perché hai contato anche il bordo vuoto di plastica!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CONTENUTO MODULO 3: CONSECUTIVI O ADIACENTI */}
            {activeModuleId === "mod3" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Consecutivi */}
                  <div className="p-6 rounded-3xl bg-blue-50/80 border-2 border-blue-200 space-y-4">
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-black text-xs">
                      1. CONSECUTIVI
                    </span>
                    <h4 className="text-xl font-black text-slate-800">Hanno 1 estremo in comune</h4>
                    <p className="text-sm text-slate-600">
                      I due segmenti si toccano in una punta (il punto B). Formano un angolo a zig-zag!
                    </p>
                    <div className="h-32 bg-white rounded-2xl border border-blue-200 flex items-center justify-center p-4">
                      <svg width="220" height="90" viewBox="0 0 220 90">
                        <line x1="20" y1="70" x2="110" y2="20" stroke="#0070B8" strokeWidth="4" strokeLinecap="round" />
                        <line x1="110" y1="20" x2="200" y2="70" stroke="#EF7D00" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="20" cy="70" r="5" fill="#0070B8" />
                        <circle cx="110" cy="20" r="6" fill="#10B981" />
                        <circle cx="200" cy="70" r="5" fill="#EF7D00" />
                        <text x="15" y="85" fontSize="12" fontWeight="bold" fill="#0070B8">A</text>
                        <text x="105" y="15" fontSize="12" fontWeight="bold" fill="#10B981">B (in comune)</text>
                        <text x="200" y="85" fontSize="12" fontWeight="bold" fill="#EF7D00">C</text>
                      </svg>
                    </div>
                  </div>

                  {/* Adiacenti */}
                  <div className="p-6 rounded-3xl bg-orange-50/80 border-2 border-orange-200 space-y-4">
                    <span className="px-3 py-1 rounded-full bg-orange-600 text-white font-black text-xs">
                      2. ADIACENTI
                    </span>
                    <h4 className="text-xl font-black text-slate-800">Sulla stessa linea dritta</h4>
                    <p className="text-sm text-slate-600">
                      Oltre a toccarsi nel punto F, si trovano esattamente sulla stessa retta dritta!
                    </p>
                    <div className="h-32 bg-white rounded-2xl border border-orange-200 flex items-center justify-center p-4">
                      <svg width="220" height="90" viewBox="0 0 220 90">
                        <line x1="20" y1="45" x2="110" y2="45" stroke="#0070B8" strokeWidth="4" strokeLinecap="round" />
                        <line x1="110" y1="45" x2="200" y2="45" stroke="#EF7D00" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="20" cy="45" r="5" fill="#0070B8" />
                        <circle cx="110" cy="45" r="6" fill="#10B981" />
                        <circle cx="200" cy="45" r="5" fill="#EF7D00" />
                        <text x="15" y="65" fontSize="12" fontWeight="bold" fill="#0070B8">D</text>
                        <text x="105" y="65" fontSize="12" fontWeight="bold" fill="#10B981">F</text>
                        <text x="195" y="65" fontSize="12" fontWeight="bold" fill="#EF7D00">G</text>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium">
                  💡 <strong>Trucco facile:</strong> Tutti i segmenti adiacenti sono anche consecutivi! Ma non tutti i consecutivi sono adiacenti (perché possono formare un angolo piegato).
                </div>
              </div>
            )}

            {/* CONTENUTO MODULO 4: CONFRONTARE I SEGMENTI */}
            {activeModuleId === "mod4" && (
              <div className="space-y-6">
                <p className="text-slate-700 leading-relaxed">
                  Per confrontare due segmenti, li sovrapponiamo facendo combaciare il loro punto di partenza:
                </p>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setComparisonState("equal")}
                    className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                      comparisonState === "equal"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    1. Congruenti (AB ≡ CD)
                  </button>
                  <button
                    onClick={() => setComparisonState("a_bigger")}
                    className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                      comparisonState === "a_bigger"
                        ? "bg-dida-blue text-white border-dida-blue shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    2. Maggiore (AB &gt; CD)
                  </button>
                  <button
                    onClick={() => setComparisonState("b_bigger")}
                    className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                      comparisonState === "b_bigger"
                        ? "bg-dida-orange text-white border-dida-orange shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    3. Minore (AB &lt; CD)
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4 text-center">
                  <div className="h-32 bg-white rounded-2xl border border-slate-200 flex flex-col justify-center items-center gap-4 px-6">
                    {/* Segmento AB */}
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-blue-700 w-8">AB:</span>
                      <div
                        className="h-3 bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: comparisonState === "b_bigger" ? "120px" : "220px" }}
                      ></div>
                    </div>

                    {/* Segmento CD */}
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-orange-700 w-8">CD:</span>
                      <div
                        className="h-3 bg-orange-500 rounded-full transition-all duration-500"
                        style={{ width: comparisonState === "a_bigger" ? "130px" : "220px" }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-800">
                    {comparisonState === "equal" && (
                      <span className="text-emerald-700">
                        ✨ <strong>CONGRUENTI (≡):</strong> Hanno esattamente la stessa lunghezza! B cade preciso su D.
                      </span>
                    )}
                    {comparisonState === "a_bigger" && (
                      <span className="text-blue-700">
                        📏 <strong>AB È MAGGIORE (AB &gt; CD):</strong> AB è più lungo e sporge oltre CD!
                      </span>
                    )}
                    {comparisonState === "b_bigger" && (
                      <span className="text-orange-700">
                        📐 <strong>AB È MINORE (AB &lt; CD):</strong> AB finisce prima, quindi è più corto di CD!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CONTENUTO MODULO 5: SOMMA E DIFFERENZA CON STRISCE */}
            {activeModuleId === "mod5" && (
              <div className="space-y-6">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setPaperStripMode("sum")}
                    className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                      paperStripMode === "sum"
                        ? "bg-dida-blue text-white border-dida-blue shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Somma: Mettili in fila ➡️
                  </button>
                  <button
                    onClick={() => setPaperStripMode("diff")}
                    className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                      paperStripMode === "diff"
                        ? "bg-dida-orange text-white border-dida-orange shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Differenza: Guarda quanto avanza ✂️
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4 text-center">
                  {paperStripMode === "sum" ? (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-slate-600">
                        Due strisce di carta: Blu (<strong>20 cm</strong>) e Rossa (<strong>10 cm</strong>). Mettiamole una dopo l'altra!
                      </p>
                      <div className="h-28 bg-white rounded-2xl border border-slate-200 flex items-center justify-center gap-0 px-6">
                        <div className="w-[180px] h-10 bg-blue-500 rounded-l-xl text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          Blu: 20 cm
                        </div>
                        <div className="w-[90px] h-10 bg-orange-500 rounded-r-xl text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          Rossa: 10 cm
                        </div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 font-bold text-sm">
                        SOMMA TOTALE: 20 cm + 10 cm = <strong>30 cm</strong>!
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-slate-600">
                        Sovrapponiamo la striscia Rossa su quella Blu: il pezzo blu scoperto è la differenza!
                      </p>
                      <div className="h-32 bg-white rounded-2xl border border-slate-200 flex flex-col justify-center items-center gap-2 px-6">
                        <div className="w-[240px] flex items-center">
                          <div className="w-[160px] h-8 bg-orange-500 rounded-l-xl text-white font-bold text-xs flex items-center justify-center">
                            Rossa: 10 cm
                          </div>
                          <div className="w-[80px] h-8 bg-emerald-500 rounded-r-xl text-white font-bold text-xs flex items-center justify-center border-l-2 border-dashed border-white">
                            Differenza: 10 cm!
                          </div>
                        </div>
                        <div className="w-[240px] h-6 bg-blue-500 rounded-xl text-white font-bold text-[10px] flex items-center justify-center">
                          Blu Intera: 20 cm
                        </div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 text-orange-950 font-bold text-sm">
                        DIFFERENZA: 20 cm − 10 cm = <strong>10 cm</strong>!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CONTENUTO MODULO 6: LA PIEGA MAGICA E IL PUNTO MEDIO */}
            {activeModuleId === "mod6" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-blue-50/80 border-2 border-blue-200 space-y-3">
                  <h4 className="text-xl font-black text-slate-800">
                    Come trovare la metà senza righello?
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-sm">
                    Prendi una striscia di carta con il segmento disegnato.
                    Piega la striscia facendo combaciare l'estremo A con l'estremo B.
                    Quando riapri la striscia, la linea di piegatura è il <strong>punto medio M</strong>!
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 text-center space-y-4">
                  <button
                    onClick={() => setFoldedPaper(!foldedPaper)}
                    className="px-6 py-2.5 rounded-2xl bg-dida-orange text-white font-bold text-sm shadow-md hover:bg-orange-600 transition cursor-pointer"
                  >
                    {foldedPaper ? "📖 Riapri il foglio" : "📄 Piega il foglio a metà"}
                  </button>

                  <div className="h-36 bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-6">
                    {foldedPaper ? (
                      <div className="flex items-center gap-2">
                        <div className="w-[120px] h-16 bg-amber-100 border-2 border-amber-300 rounded-xl flex items-center justify-center font-bold text-xs text-amber-900 shadow-sm">
                          Metà combaciante (A su B)
                        </div>
                        <span className="text-2xl animate-bounce">👈 Piega</span>
                      </div>
                    ) : (
                      <div className="w-[280px] h-14 bg-amber-50 border-2 border-amber-200 rounded-xl relative flex items-center justify-between px-4">
                        <span className="font-bold text-xs text-blue-700">A</span>
                        {/* Linea di Piega */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 border-l-2 border-dashed border-rose-500 flex flex-col justify-center items-center">
                          <span className="bg-rose-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full -mt-7">
                            Punto Medio M
                          </span>
                        </div>
                        <span className="font-bold text-xs text-blue-700">B</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    Il punto medio <strong>M</strong> divide il segmento in due metà perfettamente identiche: <strong>AM ≡ MB</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Pulsanti Navigazione Avanti/Indietro Moduli */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={goToPrevModule}
                disabled={currentModIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft size={18} /> Precedente
              </button>
              <span className="text-xs font-bold text-slate-400">
                Modulo {currentModIndex + 1} di {INCLUSION_MODULES.length}
              </span>
              <button
                onClick={goToNextModule}
                disabled={currentModIndex === INCLUSION_MODULES.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-dida-orange text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-600 cursor-pointer shadow-sm"
              >
                Successivo <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* SCHEDA ALLENA INCLUSIVA */
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                Palestra Facile & Serena
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">
                4 Piccole Sfide Guidate
              </h2>
            </div>

            {/* Domanda 1 */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                1. Per misurare un segmento con il righello, dove dobbiamo mettere l'inizio del segmento?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setQ1Selected("correct")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q1Selected === "correct"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🟢 Esattamente sul numero ZERO (0)
                </button>
                <button
                  onClick={() => setQ1Selected("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q1Selected === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 Sul bordo esterno di plastica
                </button>
              </div>
              {q1Selected === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Bravissimo! Si parte sempre dal numero 0 per non contare il bordo vuoto!
                </p>
              )}
            </div>

            {/* Domanda 2 */}
            <div className="p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                2. Due segmenti si dicono ADIACENTI quando:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setQ2Selected("correct")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q2Selected === "correct"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🟢 Hanno 1 estremo in comune e stanno sulla stessa retta dritta
                </button>
                <button
                  onClick={() => setQ2Selected("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q2Selected === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 Non si toccano mai e sono lontani
                </button>
              </div>
              {q2Selected === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Esatto! Adiacente significa attaccati e perfettamente allineati sulla stessa riga!
                </p>
              )}
            </div>

            {/* Domanda 3 */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                3. Se un segmento AB misura 8 cm, quanto misura la sua metà con il punto medio M?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setQ3Selected("correct")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q3Selected === "correct"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🟢 4 cm (perché 8 : 2 = 4)
                </button>
                <button
                  onClick={() => setQ3Selected("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q3Selected === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 16 cm (il doppio)
                </button>
              </div>
              {q3Selected === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Super! Il punto medio divide sempre a metà esatta in due parti da 4 cm!
                </p>
              )}
            </div>

            {/* Domanda 4 */}
            <div className="p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                4. Cosa significa il simbolo di congruenza (≡) tra due segmenti?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setQ4Selected("correct")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q4Selected === "correct"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🟢 Hanno la stessa identica lunghezza (sono sovrapponibili)
                </button>
                <button
                  onClick={() => setQ4Selected("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q4Selected === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 Hanno lo stesso colore
                </button>
              </div>
              {q4Selected === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Fantastico! Congruenti in geometria vuol dire che si sovrappongono punto a punto!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
