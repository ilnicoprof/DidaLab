import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, BookOpen, Zap, AlertCircle, Award, BatteryCharging, Gamepad2, Timer
} from "lucide-react";

interface Props {
  key?: string;
  onBack: () => void;
  subjectName: string;
  topicName: string;
  initialSubtopicId?: string;
  initialTab?: "impara" | "allena";
}

/**
 * Componente Frazione con Linea di Frazione Orizzontale Reale
 */
export const Frac: React.FC<{
  num: React.ReactNode;
  den: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}> = ({ num, den, size = "md", className = "" }) => {
  const sizeClasses = {
    xs: "text-[11px]",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-bold",
    xl: "text-2xl font-black",
  }[size];

  const lineWeight = size === "xl" ? "h-[2px]" : size === "lg" ? "h-[1.5px]" : "h-[1px]";

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none ${sizeClasses} ${className}`}>
      <span className="px-1 text-center w-full pb-[1.5px] leading-none">{num}</span>
      <span className={`w-full ${lineWeight} bg-current rounded-full`}></span>
      <span className="px-1 text-center w-full pt-[1.5px] leading-none">{den}</span>
    </span>
  );
};

const SUBTOPICS = [
  { id: "fraction", title: "1. Che cos'è una frazione", short: "1. Concetto & Muro" },
  { id: "proper-improper-apparent-fractions", title: "2. Proprie, Improprie, Apparenti", short: "2. I 3 Tipi & Misti" },
  { id: "equivalent-fractions", title: "3. Frazioni equivalenti & Invariantiva", short: "3. Frazioni Equivalenti" },
  { id: "reduction-minimum-terms", title: "4. Riduzione ai minimi termini (M.C.D.)", short: "4. Semplificare (M.C.D.)" },
  { id: "fraction-comparison", title: "5. Confronto di frazioni & Semiretta", short: "5. Confronto & Retta" },
  { id: "fraction-problems", title: "6. Problemi: Diretto e Inverso", short: "6. Problemi con Frazioni" },
];

export default function FractionsLesson({
  onBack,
  subjectName,
  initialSubtopicId,
  initialTab = "impara",
}: Props) {
  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>(() => {
    if (initialSubtopicId && SUBTOPICS.some(s => s.id === initialSubtopicId)) {
      return initialSubtopicId;
    }
    return "fraction";
  });

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // Modulo 1: Costruttore Frazione & Pizza/Barra
  const [labNum, setLabNum] = useState<number>(3);
  const [labDen, setLabDen] = useState<number>(4);
  const [wallHighlightDen, setWallHighlightDen] = useState<number | null>(4);

  // Modulo 2: Tipi e Numero Misto
  const [typeNum, setTypeNum] = useState<number>(7);
  const [typeDen, setTypeDen] = useState<number>(4);

  // Modulo 3: Equivalenze & Invariantiva
  const [equivBaseNum, setEquivBaseNum] = useState<number>(2);
  const [equivBaseDen, setEquivBaseDen] = useState<number>(3);
  const [equivFactor, setEquivFactor] = useState<number>(2);

  // Modulo 4: Riduzione ai minimi termini con M.C.D.
  const [redNum, setRedNum] = useState<number>(12);
  const [redDen, setRedDen] = useState<number>(18);

  // Modulo 5: Confronto frazioni
  const [compNumA, setCompNumA] = useState<number>(3);
  const [compDenA, setCompDenA] = useState<number>(4);
  const [compNumB, setCompNumB] = useState<number>(2);
  const [compDenB, setCompDenB] = useState<number>(5);

  // Modulo 6: Risolutore Problemi (Diretto vs Inverso)
  const [problemMode, setProblemMode] = useState<"diretto" | "inverso">("diretto");
  const [probValue, setProbValue] = useState<number>(56);
  const [probNum, setProbNum] = useState<number>(4);
  const [probDen, setProbDen] = useState<number>(7);

  // ==========================================
  // --- STATI ESERCIZI (ALLENA) ---
  // ==========================================
  const [exQuizAnswers, setExQuizAnswers] = useState<Record<number, string | null>>({});
  const [exTypeAnswers, setExTypeAnswers] = useState<Record<string, "P" | "I" | "A" | null>>({});
  const [invalsiAnswers, setInvalsiAnswers] = useState<Record<string, string>>({});
  const [vfAnswers, setVfAnswers] = useState<Record<number, boolean | null>>({});

  // Calcolo M.C.D. con algoritmo di Euclide
  const calcGcd = (a: number, b: number): number => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  };

  // Calcolo m.c.m.
  const calcLcm = (a: number, b: number): number => {
    if (!a || !b) return 0;
    return Math.abs(a * b) / calcGcd(a, b);
  };

  // Tipo frazione (modulo 2)
  const fractionTypeInfo = useMemo(() => {
    if (typeDen === 0) return { type: "Impossibile", color: "text-rose-600", desc: "Non si può dividere per zero!" };
    if (typeNum % typeDen === 0) {
      const val = typeNum / typeDen;
      return {
        type: "Apparente",
        color: "text-purple-600",
        badge: "bg-purple-100 text-purple-800 border-purple-200",
        desc: `Il numeratore ${typeNum} è multiplo del denominatore ${typeDen}. Vale esattamente ${val} intero/i!`,
        val
      };
    }
    if (typeNum < typeDen) {
      return {
        type: "Propria",
        color: "text-blue-600",
        badge: "bg-blue-100 text-blue-800 border-blue-200",
        desc: `Il numeratore ${typeNum} è minore del denominatore ${typeDen}. Vale meno di 1 intero (${(typeNum / typeDen).toFixed(2)}).`,
      };
    }
    const quoz = Math.floor(typeNum / typeDen);
    const rest = typeNum % typeDen;
    return {
      type: "Impropria",
      color: "text-amber-600",
      badge: "bg-amber-100 text-amber-800 border-amber-200",
      desc: `Il numeratore ${typeNum} è maggiore del denominatore ${typeDen} (e non multiplo). Vale più di 1 intero! Corrisponde al numero misto.`,
      quoz,
      rest
    };
  }, [typeNum, typeDen]);

  // Semplificazione modulo 4
  const redInfo = useMemo(() => {
    const gcd = calcGcd(redNum, redDen);
    const simpNum = redNum / gcd;
    const simpDen = redDen / gcd;
    const isIrreducible = gcd === 1;
    return { gcd, simpNum, simpDen, isIrreducible };
  }, [redNum, redDen]);

  // Confronto modulo 5
  const compInfo = useMemo(() => {
    const valA = compNumA / compDenA;
    const valB = compNumB / compDenB;
    const lcmDen = calcLcm(compDenA, compDenB);
    const newNumA = compNumA * (lcmDen / compDenA);
    const newNumB = compNumB * (lcmDen / compDenB);
    const crossA = compNumA * compDenB;
    const crossB = compDenA * compNumB;

    let symbol = "=";
    if (valA > valB) symbol = ">";
    if (valA < valB) symbol = "<";

    return { valA, valB, lcmDen, newNumA, newNumB, crossA, crossB, symbol };
  }, [compNumA, compDenA, compNumB, compDenB]);

  // Risolutore problemi modulo 6
  const problemResult = useMemo(() => {
    if (probDen === 0 || probNum === 0) return null;
    if (problemMode === "diretto") {
      const unitPart = probValue / probDen;
      const finalPart = unitPart * probNum;
      const remaining = probValue - finalPart;
      return {
        unitPart,
        finalPart,
        remaining,
        step1Num: 1,
        step1Den: probDen
      };
    } else {
      const unitPart = probValue / probNum;
      const fullValue = unitPart * probDen;
      return {
        unitPart,
        fullValue,
        step1Num: 1,
        step1Den: probDen
      };
    }
  }, [problemMode, probValue, probNum, probDen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-7xl mx-auto space-y-8 pb-16"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-dida-blue hover:border-dida-blue/30 transition shadow-sm cursor-pointer"
            title="Torna agli argomenti"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Classe 1ª · Aritmetica
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {subjectName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Le Frazioni
            </h1>
          </div>
        </div>

        {/* Toggle Modalità: Impara / Allena */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab("impara")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
              activeTab === "impara"
                ? "bg-white text-dida-blue shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen size={18} />
            Laboratorio & Teoria
          </button>
          <button
            onClick={() => setActiveTab("allena")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
              activeTab === "allena"
                ? "bg-white text-dida-orange shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Zap size={18} />
            Palestra di Esercizi
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "impara" ? (
          <motion.div
            key="tab-impara-fractions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4"
          >
            {/* Menu Laterale Sottoargomenti */}
            <div className="lg:col-span-3 space-y-2">
              {SUBTOPICS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubtopic(sub.id)}
                  className={`w-full text-left p-4 rounded-2xl transition cursor-pointer border ${
                    selectedSubtopic === sub.id
                      ? "bg-dida-blue text-white border-dida-blue shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="font-bold text-sm leading-tight">{sub.title}</div>
                </button>
              ))}
            </div>

            {/* Area Contenuto */}
            <div className="lg:col-span-9 min-w-0 space-y-8">
            {selectedSubtopic === "fraction" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 1 · Dividere un intero in parti uguali
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Che cos'è una frazione? Dalla Pizza alla Batteria!
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Una frazione opera su un <strong>intero</strong>: lo <span className="text-blue-600 font-bold">divide in parti uguali</span> (denominatore) e ne <span className="text-amber-600 font-bold">prende una o più</span> (numeratore).
                    </p>
                  </div>

                  {/* Visual Cards dei Termini con vera linea di frazione */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-6 rounded-3xl bg-blue-50/60 border border-blue-200 flex flex-col items-center text-center gap-2">
                      <span className="text-3xl font-black text-blue-600 font-mono">3</span>
                      <span className="text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                        NUMERATORE
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        Quante parti <strong>PRENDO</strong> o coloro.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200 flex flex-col items-center text-center gap-2">
                      <div className="w-16 h-1 bg-amber-500 rounded-full my-2"></div>
                      <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                        LINEA DI FRAZIONE
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        Indica l'operazione di <strong>divisione ( : )</strong> tra numeratore e denominatore.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 flex flex-col items-center text-center gap-2">
                      <span className="text-3xl font-black text-emerald-600 font-mono">4</span>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        DENOMINATORE
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        In quante parti <strong>UGUALI DIVIDO</strong> l'intero.
                      </p>
                    </div>
                  </div>

                  {/* Laboratorio 1: Console Studio Pizza & Barra (Layout Console a 2 Colonne) */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Studio Frazionario · Console Dinamica
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Costruisci la Frazione e Osserva l'Intero
                      </h3>
                      <p className="text-xs text-slate-500">
                        Regola numeratore e denominatore dalla console: osserva la pizza e la tavoletta dividersi e colorarsi in tempo reale!
                      </p>
                    </div>

                    {/* Cockpit Asimmetrico a 2 Colonne */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                      {/* Colonna Sinistra (5/12): Console Comandi & Valori */}
                      <div className="lg:col-span-5 bg-blue-50/60 border-2 border-blue-200/80 rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-xs">
                        <div className="flex items-center justify-between border-b border-blue-200/60 pb-3">
                          <span className="text-xs font-black uppercase tracking-wider text-dida-blue">
                            1. Pannello di Controllo
                          </span>
                          <span className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200 shadow-xs">
                            Parametri
                          </span>
                        </div>

                        {/* Frazione Gigante al Centro del Deck */}
                        <div className="bg-white p-5 rounded-2xl border-2 border-blue-100 shadow-xs flex flex-col items-center justify-center text-center">
                          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">Frazione Attuale</span>
                          <div className="font-mono flex flex-col items-center">
                            <span className="text-4xl font-black text-dida-blue leading-none">{labNum}</span>
                            <div className="w-16 h-1.5 bg-slate-700 rounded-full my-1.5"></div>
                            <span className="text-4xl font-black text-dida-orange leading-none">{labDen}</span>
                          </div>
                        </div>

                        {/* Slider Numeratore */}
                        <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-blue-100 shadow-xs">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                            <span className="text-blue-800">Numeratore (fette prese):</span>
                            <span className="text-blue-600 font-mono text-base font-black bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">{labNum}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="12"
                            value={labNum}
                            onChange={(e) => setLabNum(parseInt(e.target.value))}
                            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>1</span>
                            <span>6</span>
                            <span>12</span>
                          </div>
                        </div>

                        {/* Slider Denominatore */}
                        <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-blue-100 shadow-xs">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                            <span className="text-orange-800">Denominatore (parti uguali):</span>
                            <span className="text-dida-orange font-mono text-base font-black bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">{labDen}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="12"
                            value={labDen}
                            onChange={(e) => setLabDen(parseInt(e.target.value))}
                            className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>1</span>
                            <span>6</span>
                            <span>12</span>
                          </div>
                        </div>

                        {/* Telemetria Decimale e Percentuale */}
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-xs">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Decimale</span>
                            <span className="text-base font-black text-dida-blue font-mono">{(labNum / labDen).toFixed(3)}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-xs">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Percentuale</span>
                            <span className="text-base font-black text-dida-orange font-mono">{Math.round((labNum / labDen) * 100)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Colonna Destra (7/12): Palcoscenico Visivo (Pizza Pedestal & Chocolate Rack) */}
                      <div className="lg:col-span-7 bg-orange-50/50 border-2 border-orange-200/80 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-orange-200/60 pb-3">
                          <span className="text-xs font-black uppercase tracking-wider text-dida-orange">
                            2. Arena Grafica & Spazio Geometrico
                          </span>
                          <span className="text-[11px] font-bold text-orange-800 bg-white px-2.5 py-0.5 rounded-full border border-orange-200 shadow-xs">
                            {labNum > labDen ? "Oltre l'Intero!" : labNum === labDen ? "Intero Completo" : "Parte dell'Intero"}
                          </span>
                        </div>

                        {/* Pedestallo Pizza SVG */}
                        <div className="bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-xs flex flex-col md:flex-row items-center justify-around gap-4">
                          <div className="relative w-40 h-40 drop-shadow-sm">
                            <svg viewBox="-1.1 -1.1 2.2 2.2" className="w-full h-full -rotate-90">
                              {Array.from({ length: labDen }).map((_, idx) => {
                                const angleStep = (2 * Math.PI) / labDen;
                                const startAngle = idx * angleStep;
                                const endAngle = (idx + 1) * angleStep;
                                const x1 = Math.cos(startAngle);
                                const y1 = Math.sin(startAngle);
                                const x2 = Math.cos(endAngle);
                                const y2 = Math.sin(endAngle);
                                const largeArc = angleStep > Math.PI ? 1 : 0;
                                const pathData = labDen === 1
                                  ? "M 0 0 m -1, 0 a 1,1 0 1,0 2,0 a 1,1 0 1,0 -2,0"
                                  : `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArc} 1 ${x2} ${y2} Z`;

                                const isFilled = idx < labNum;
                                return (
                                  <path
                                    key={idx}
                                    d={pathData}
                                    className={`transition-all duration-300 ${
                                      isFilled ? "fill-orange-500 stroke-orange-700" : "fill-slate-100 stroke-slate-300"
                                    }`}
                                    strokeWidth="0.04"
                                  />
                                );
                              })}
                            </svg>
                          </div>

                          <div className="text-center md:text-left space-y-1.5">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                              Modello Circolare
                            </span>
                            <div className="text-2xl font-black text-slate-800 font-mono">
                              {labNum} <span className="text-sm font-sans text-slate-500 font-normal">spicchi su</span> {labDen}
                            </div>
                            <div className="text-xs font-bold text-dida-orange bg-orange-100/70 px-3 py-1 rounded-full border border-orange-200 inline-block">
                              {labNum === labDen ? "🎉 Hai preso esattamente 1 pizza intera!" : labNum > labDen ? `🍕 Più di 1 intero! (${(labNum / labDen).toFixed(2)} pizze)` : `Fetta residua: ${labDen - labNum}/${labDen}`}
                            </div>
                          </div>
                        </div>

                        {/* Modello a Striscia (Tavoletta di Cioccolato) */}
                        <div className="bg-white p-5 rounded-2xl border-2 border-orange-100 shadow-xs space-y-3">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <span>Modello a Striscia Continua</span>
                            <span className="text-dida-blue font-mono font-black">{labNum}/{labDen}</span>
                          </div>
                          <div className="w-full h-14 rounded-xl border-2 border-slate-300 flex overflow-hidden bg-slate-100 shadow-inner">
                            {Array.from({ length: labDen }).map((_, i) => (
                              <div
                                key={i}
                                className={`flex-1 border-r last:border-r-0 border-slate-400/50 flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                                  i < labNum ? "bg-dida-blue text-white shadow-inner" : "bg-white text-slate-400"
                                }`}
                              >
                                <Frac num={1} den={labDen} size="xs" />
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-slate-600 text-center flex items-center justify-center gap-1.5 font-sans pt-1">
                            <span>{labNum} mattoncini unitari da</span>
                            <Frac num={1} den={labDen} size="xs" />
                            <span>=</span>
                            <strong className="text-slate-900 font-black"><Frac num={labNum} den={labDen} size="sm" /></strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                      <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                      <div className="text-xs text-amber-900 leading-relaxed">
                        <strong>REGOLA D'ORO:</strong> Più grande è il denominatore (il numero sotto), più <strong>PICCOLA</strong> è l'unità frazionaria: più amici dividono la pizza, meno spicchio a testa! (Es. <Frac num={1} den={3} size="xs" /> &gt; <Frac num={1} den={8} size="xs" />).
                      </div>
                    </div>

                  {/* Laboratorio 2: Il Muro delle Frazioni (Layout a Scaffale / Fraction Wall Rack) */}
                  <div className="p-6 md:p-8 rounded-3xl bg-orange-50/30 border-2 border-orange-200/80 space-y-6">
                    {/* Header Muro perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-orange-200/60 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Attività delle Slide · Il Muro a Scaffale
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        La Mappa Visiva delle Equivalenze
                      </h3>
                      <p className="text-xs text-slate-600">
                        Tutte le strisce hanno la stessa lunghezza totale (24 quadretti): clicca su una barra per scoprirne le equivalenze allineate!
                      </p>
                    </div>

                    {/* Lavagna a Scaffale / Rack Frame */}
                    <div className="bg-white p-6 rounded-3xl border-2 border-slate-300 shadow-sm space-y-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider pb-1 border-b border-slate-100">
                        <span>Taglio della Striscia</span>
                        <span>Allineamento Grafico Orizzontale</span>
                      </div>

                      {[
                        { den: 1, label: "1 Intero", num: 1, color: "bg-blue-600 text-white", count: 1, badge: "bg-blue-100 text-blue-800 border-blue-200" },
                        { den: 2, label: "1/2 Metà", num: 1, color: "bg-orange-500 text-white", count: 2, badge: "bg-orange-100 text-orange-800 border-orange-200" },
                        { den: 3, label: "1/3 Terzi", num: 1, color: "bg-sky-500 text-white", count: 3, badge: "bg-sky-100 text-sky-800 border-sky-200" },
                        { den: 4, label: "1/4 Quarti", num: 1, color: "bg-amber-500 text-white", count: 4, badge: "bg-amber-100 text-amber-800 border-amber-200" },
                        { den: 6, label: "1/6 Sesti", num: 1, color: "bg-blue-400 text-white", count: 6, badge: "bg-blue-100 text-blue-800 border-blue-200" },
                        { den: 8, label: "1/8 Ottavi", num: 1, color: "bg-orange-600 text-white", count: 8, badge: "bg-orange-100 text-orange-800 border-orange-200" },
                      ].map((row) => (
                        <div key={row.den} className="flex items-center gap-3">
                          <button
                            onClick={() => setWallHighlightDen(row.den)}
                            className={`w-24 text-left px-2.5 py-1.5 rounded-xl border text-[11px] font-black font-mono transition cursor-pointer shrink-0 ${row.badge} ${
                              wallHighlightDen === row.den ? "ring-2 ring-dida-orange scale-105" : "hover:opacity-80"
                            }`}
                          >
                            {row.label}
                          </button>
                          <div className="flex-1 h-11 rounded-xl border border-slate-300 flex overflow-hidden bg-slate-100 shadow-xs">
                            {Array.from({ length: row.count }).map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setWallHighlightDen(row.den)}
                                className={`flex-1 border-r last:border-r-0 border-white/50 flex items-center justify-center cursor-pointer transition hover:opacity-95 ${row.color} ${
                                  wallHighlightDen === row.den ? "ring-2 ring-slate-900 z-10" : ""
                                }`}
                              >
                                {row.den === 1 ? (
                                  <span className="font-bold text-xs">1 (Intero Completo)</span>
                                ) : (
                                  <Frac num={1} den={row.den} size="xs" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Banner di Scoperta Equivalenze in Tempo Reale */}
                      <div className="mt-4 p-4 rounded-2xl bg-orange-100/70 border-2 border-orange-300 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-orange-950 font-bold">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🔍</span>
                          <span>Frazione evidenziata: <strong>1/{wallHighlightDen}</strong></span>
                        </div>
                        <span className="text-[11px] bg-white px-3 py-1 rounded-xl border border-orange-300 shadow-xs">
                          {wallHighlightDen === 2 && "1/2 = 2/4 = 3/6 = 4/8 (Tutte allineate sulla stessa linea centrale!)"}
                          {wallHighlightDen === 3 && "1/3 = 2/6 (Due sesti formano esattamente un terzo!)"}
                          {wallHighlightDen === 4 && "1/4 = 2/8 (Due ottavi hanno la stessa estensione di un quarto!)"}
                          {wallHighlightDen === 1 && "1 Intero = 2/2 = 3/3 = 4/4 = 6/6 = 8/8"}
                          {wallHighlightDen === 6 && "1/6 = metà di un terzo!"}
                          {wallHighlightDen === 8 && "1/8 = metà di un quarto!"}
                        </span>
                      </div>
                    </div>

                    {/* Domande guida dal Muro */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                      <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs text-xs space-y-1.5">
                        <div className="text-blue-700 font-black flex items-center gap-1">
                          <span>Quanti</span> <Frac num={1} den={8} size="xs" /> <span>fanno</span> <Frac num={1} den={2} size="xs" />?
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Guarda il muro: esattamente <strong>4 pezzi da <Frac num={1} den={8} size="xs" /></strong> coprono la metà!
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs text-xs space-y-1.5">
                        <div className="text-orange-700 font-black flex items-center gap-1">
                          <span>È più grande</span> <Frac num={1} den={3} size="xs" /> <span>o</span> <Frac num={1} den={4} size="xs" />?
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          La striscia celeste di <strong><Frac num={1} den={3} size="xs" /></strong> è visibilmente più lunga di <strong><Frac num={1} den={4} size="xs" /></strong>!
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs text-xs space-y-1.5">
                        <div className="text-blue-700 font-black flex items-center gap-1">
                          <Frac num={2} den={6} size="xs" /> <span>e</span> <Frac num={1} den={3} size="xs" /> <span>sono uguali?</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Sì! Due blocchi da <Frac num={1} den={6} size="xs" /> si allineano con 1 blocco da <Frac num={1} den={3} size="xs" />.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Frazioni nella vita reale */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                        <BatteryCharging className="text-emerald-600" size={18} />
                        Batteria Telefono
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Carica al 100% dura 24 ore. Adesso è a <Frac num={3} den={4} size="xs" />:
                        <br />
                        <span className="font-mono font-bold text-emerald-700">24 : 4 × 3 = 18 ore</span> rimaste!
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                        <Gamepad2 className="text-blue-600" size={18} />
                        Punti Vita Videogioco
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Hai 60 HP. Un nemico ti toglie i <Frac num={2} den={5} size="xs" />:
                        <br />
                        <span className="font-mono font-bold text-blue-700">60 : 5 × 2 = 24 HP</span> persi!
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                        <Timer className="text-amber-600" size={18} />
                        Tempo di Partita
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Partita di calcio dura 90 min. Fine 1° tempo:
                        <br />
                        <span className="font-mono font-bold text-amber-700">45 min = <Frac num={1} den={2} size="xs" /></span> della partita!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: PROPRIE, IMPROPRIE, APPARENTI & NUMERI MISTI */}
            {/* ======================================================== */}
            {selectedSubtopic === "proper-improper-apparent-fractions" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 2 · Minore, maggiore o uguale all'intero
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Proprie, Improprie ed Apparenti
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Una frazione è prima di tutto una <strong>divisione</strong> (<span className="font-mono font-bold">a : b = <Frac num="a" den="b" size="xs" /></span>). In base al rapporto tra numeratore e denominatore, confrontiamo la quantità con 1 intero!
                    </p>
                  </div>

                  {/* Le 3 Colonne dei Tipi */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 flex flex-col items-start gap-3">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        PROPRIA
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Numeratore &lt; Denominatore</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Rappresenta <strong>meno di 1 intero</strong>. <br />
                        Es: <strong className="text-blue-700 font-mono"><Frac num={2} den={5} size="sm" /> &lt; 1</strong>. Dividendo esce meno di 1 (0,4).
                      </p>
                      <div className="w-full h-8 bg-white rounded-xl border border-blue-200 flex overflow-hidden">
                        <div className="w-2/5 bg-blue-500 h-full flex items-center justify-center text-white font-bold text-xs"><Frac num={2} den={5} size="xs" /></div>
                        <div className="w-3/5 bg-slate-100 h-full"></div>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 flex flex-col items-start gap-3">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-white px-3 py-1 rounded-full border border-amber-200">
                        IMPROPRIA
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Numeratore &gt; Denominatore</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Rappresenta <strong>più di 1 intero</strong> (e il numeratore non è multiplo). <br />
                        Es: <strong className="text-amber-700 font-mono"><Frac num={7} den={4} size="sm" /> &gt; 1</strong>. (1 intero e <Frac num={3} den={4} size="xs" />).
                      </p>
                      <div className="w-full flex gap-1">
                        <div className="flex-1 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">4/4 (1)</div>
                        <div className="flex-1 h-8 bg-white border border-amber-200 rounded-lg flex overflow-hidden">
                          <div className="w-3/4 bg-amber-500 h-full flex items-center justify-center text-white font-bold text-xs"><Frac num={3} den={4} size="xs" /></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-purple-50 border-2 border-purple-200 flex flex-col items-start gap-3">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200">
                        APPARENTE
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Numeratore Multiplo</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        È una frazione "falsa": nasconde un <strong>numero naturale intero esatto</strong>! <br />
                        Es: <strong className="text-purple-700 font-mono"><Frac num={8} den={4} size="sm" /> = 2</strong> interi, oppure <strong className="text-purple-700 font-mono"><Frac num={5} den={5} size="sm" /> = 1</strong>.
                      </p>
                      <div className="w-full flex gap-1">
                        <div className="flex-1 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">1° intero</div>
                        <div className="flex-1 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">2° intero</div>
                      </div>
                    </div>
                  </div>

                  {/* Laboratorio 3: Stazione di Diagnosi Frazionaria (Layout a 3 Sezioni con Preset) */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Tester di Tipologia & Convertitore
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Scanner delle Frazioni: Proprie, Improprie e Apparenti
                      </h3>
                      <p className="text-xs text-slate-500">
                        Inserisci i termini o premi un esempio rapido per scoprire classificazione, significato e conversione in numero misto!
                      </p>
                    </div>

                    {/* Preset Rapidi */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Esempi rapidi:</span>
                      {[
                        { label: "3/5 (Propria)", n: 3, d: 5 },
                        { label: "7/4 (Impropria)", n: 7, d: 4 },
                        { label: "6/3 (Apparente)", n: 6, d: 3 },
                        { label: "1/4 (Complementare)", n: 1, d: 4 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => { setTypeNum(preset.n); setTypeDen(preset.d); }}
                          className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:border-orange-200 cursor-pointer shadow-xs transition"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Banco di Diagnosi Frazionaria */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                      {/* Camera di Caricamento Frazione (5 cols) */}
                      <div className="md:col-span-5 bg-white p-6 rounded-3xl border-2 border-blue-200 shadow-xs flex flex-col items-center justify-center space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Camera Frazione
                        </span>
                        <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={typeNum}
                            onChange={(e) => setTypeNum(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-24 p-2 text-center rounded-xl border-2 border-blue-300 font-mono font-black text-2xl text-blue-700 bg-white focus:outline-none focus:border-dida-blue"
                            title="Numeratore"
                          />
                          <div className="w-28 h-1.5 bg-slate-800 rounded-full my-1"></div>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={typeDen}
                            onChange={(e) => setTypeDen(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-24 p-2 text-center rounded-xl border-2 border-orange-300 font-mono font-black text-2xl text-dida-orange bg-white focus:outline-none focus:border-dida-orange"
                            title="Denominatore"
                          />
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          Rapporto: {(typeNum / typeDen).toFixed(3)}
                        </span>
                      </div>

                      {/* Dossier Analitico (7 cols) */}
                      <div className="md:col-span-7 bg-orange-50/50 border-2 border-orange-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between border-b border-orange-200/60 pb-3">
                          <span className="text-xs font-black uppercase text-dida-orange">Diagnosi Risultante</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${fractionTypeInfo.badge}`}>
                            Frazione {fractionTypeInfo.type}
                          </span>
                        </div>

                        <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-orange-200/60 shadow-xs">
                          {fractionTypeInfo.desc}
                        </p>

                        {fractionTypeInfo.type === "Impropria" && (
                          <div className="p-4 rounded-2xl bg-white border-2 border-orange-200 text-center space-y-1.5 shadow-xs">
                            <span className="text-xs font-bold text-dida-orange uppercase tracking-wider block">Numero Misto corrispondente:</span>
                            <div className="font-mono text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
                              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-xl border border-orange-200">{fractionTypeInfo.quoz}</span>
                              <span className="text-sm font-sans font-bold text-slate-400">+</span>
                              <Frac num={fractionTypeInfo.rest} den={typeDen} size="md" className="text-dida-blue" />
                            </div>
                            <span className="text-[11px] text-slate-500 block pt-1">
                              {fractionTypeInfo.quoz} interi completi e una frazione residua di {fractionTypeInfo.rest}/{typeDen}
                            </span>
                          </div>
                        )}

                        {fractionTypeInfo.type === "Propria" && (
                          <div className="p-4 rounded-2xl bg-white border-2 border-blue-200 text-center space-y-1.5 shadow-xs">
                            <span className="text-xs font-bold text-dida-blue uppercase tracking-wider block">Frazione Complementare:</span>
                            <div className="font-mono text-2xl font-black text-dida-blue flex items-center justify-center">
                              <Frac num={typeDen - typeNum} den={typeDen} size="lg" />
                            </div>
                            <span className="text-[11px] text-slate-500 block pt-1">
                              È la fetta mancante per completare l'intero (<Frac num={typeNum} den={typeDen} size="xs" /> + <Frac num={typeDen - typeNum} den={typeDen} size="xs" /> = 1)
                            </span>
                          </div>
                        )}

                        {fractionTypeInfo.type === "Apparente" && (
                          <div className="p-4 rounded-2xl bg-white border-2 border-emerald-200 text-center space-y-1 shadow-xs">
                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Interi Esatti:</span>
                            <span className="text-3xl font-black font-mono text-emerald-700">{typeNum / typeDen}</span>
                            <span className="text-[11px] text-slate-500 block">Nessuna parte frazionaria residua!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: FRAZIONI EQUIVALENTI & PROPRIETÀ INVARIANTIVA */}
            {/* ======================================================== */}
            {selectedSubtopic === "equivalent-fractions" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 3 · Scritte in modo diverso, stessa quantità
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Frazioni Equivalenti & La Proprietà Invariantiva
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Tagliare la pizza in più spicchi non cambia quanta pizza mangi! Moltiplicando o dividendo numeratore e denominatore per lo stesso numero (diverso da zero) si ottiene una frazione <strong>equivalente</strong>.
                    </p>
                  </div>

                  {/* Schema Moltiplico e Divido */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 flex flex-col items-start gap-3">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        AMPLIARE ( × )
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Infinite frazioni equivalenti</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Moltiplico sopra e sotto per qualsiasi numero: <br />
                        <span className="font-mono font-bold text-blue-700 flex items-center flex-wrap gap-1 mt-1">
                          <Frac num={1} den={2} size="xs" /> = <Frac num={2} den={4} size="xs" /> = <Frac num={3} den={6} size="xs" /> = <Frac num={4} den={8} size="xs" /> = <Frac num={10} den={20} size="xs" /> ...
                        </span>
                        Tutte hanno lo stesso valore decimale (0,5)!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 flex flex-col items-start gap-3">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        VERSO LE PERCENTUALI
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Scrivere su 100</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Se porto il denominatore a 100, ottengo subito una percentuale! <br />
                        <span className="font-mono font-bold text-emerald-700 flex items-center gap-1 mt-1">
                          <Frac num={1} den={4} size="xs" /> = <Frac num={25} den={100} size="xs" /> = 25%
                        </span>
                        <span className="font-mono font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                          <Frac num={9} den={20} size="xs" /> = <Frac num={45} den={100} size="xs" /> = 45%
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Laboratorio Interattivo Moltiplicatore */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Simulatore Dinamico
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Amplia la Frazione e Verifica l'Uguaglianza
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      {/* Frazione di partenza con linea reale */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-3 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase">Frazione Base</span>
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={equivBaseNum}
                            onChange={(e) => setEquivBaseNum(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-1.5 text-center rounded-xl border border-slate-300 font-mono font-bold text-xl"
                          />
                          <div className="w-20 h-1 bg-slate-800 rounded-full my-0.5"></div>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={equivBaseDen}
                            onChange={(e) => setEquivBaseDen(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-1.5 text-center rounded-xl border border-slate-300 font-mono font-bold text-xl"
                          />
                        </div>
                        <span className="text-xs text-slate-500 block">
                          = {(equivBaseNum / equivBaseDen).toFixed(3)}
                        </span>
                      </div>

                      {/* Moltiplicatore */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-3">
                        <span className="text-xs font-bold text-slate-500 uppercase">Moltiplica per (k):</span>
                        <div className="flex justify-center items-center gap-2">
                          {[2, 3, 4, 5, 10].map((k) => (
                            <button
                              key={k}
                              onClick={() => setEquivFactor(k)}
                              className={`w-10 h-10 rounded-xl font-bold font-mono transition cursor-pointer ${
                                equivFactor === k
                                  ? "bg-dida-blue text-white shadow-md scale-105"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              ×{k}
                            </button>
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          Sia sopra che sotto!
                        </span>
                      </div>

                      {/* Frazione Equivalente Risultante */}
                      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs text-center space-y-2 flex flex-col items-center">
                        <span className="text-xs font-bold text-emerald-800 uppercase">Frazione Equivalente</span>
                        <Frac
                          num={equivBaseNum * equivFactor}
                          den={equivBaseDen * equivFactor}
                          size="xl"
                          className="text-emerald-700"
                        />
                        <div className="text-xs text-emerald-800 font-mono">
                          = {((equivBaseNum * equivFactor) / (equivBaseDen * equivFactor)).toFixed(3)} ✓
                        </div>
                        <span className="text-[10px] text-emerald-600 block">
                          La prova con la divisione dà lo stesso risultato!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: RIDUZIONE AI MINIMI TERMINI CON IL M.C.D. */}
            {/* ======================================================== */}
            {selectedSubtopic === "reduction-minimum-terms" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 3 · Ridurre ai minimi termini
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Semplificare: Ecco a Cosa Serviva il M.C.D.!
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      In una scuola i ragazzi sono i <Frac num={12} den={18} size="xs" /> delle ragazze: è molto più chiaro dire <strong><Frac num={2} den={3} size="xs" /></strong>! Dividendo sia sopra che sotto per il loro <strong>M.C.D.</strong> arrivi ai minimi termini in un colpo solo.
                    </p>
                  </div>

                  {/* I 3 Metodi per Semplificare */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-black text-blue-600 uppercase">1. Divisioni Successive</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <Frac num={12} den={18} size="xs" /> : 2 → <Frac num={6} den={9} size="xs" /> <br />
                        <Frac num={6} den={9} size="xs" /> : 3 → <Frac num={2} den={3} size="xs" /> <br />
                        (Passo dopo passo)
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 space-y-2">
                      <span className="text-xs font-black text-blue-700 uppercase">2. In un Colpo con il M.C.D.</span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        M.C.D.(12, 18) = 6 <br />
                        <Frac num={12} den={18} size="xs" /> : 6 → <strong><Frac num={2} den={3} size="xs" /></strong>! <br />
                        (Il metodo più rapido)
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-black text-emerald-600 uppercase">3. Con la Scomposizione</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        (2² × 3) / (2 × 3²) <br />
                        Semplifico i fattori comuni → <Frac num={2} den={3} size="xs" />!
                      </p>
                    </div>
                  </div>

                  {/* Semplificatore Automatico Step-by-Step */}
                  {/* Laboratorio 5: Imbuto Riduttore (Layout Verticale a Torre) */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Torre di Semplificazione con M.C.D.
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Imbuto di Riduzione ai Minimi Termini
                      </h3>
                      <p className="text-xs text-slate-500">
                        Inserisci qualsiasi frazione: l'algoritmo rileva il Massimo Comune Divisore e la riduce all'istante!
                      </p>
                    </div>

                    {/* Struttura a Torre / Imbuto */}
                    <div className="max-w-lg mx-auto space-y-4">
                      {/* Piano 1: Ingresso Frazione da Ridurre */}
                      <div className="bg-white p-6 rounded-3xl border-2 border-blue-200 shadow-xs text-center space-y-3">
                        <span className="text-xs font-bold text-dida-blue uppercase tracking-wider block">
                          1. Frazione di Partenza
                        </span>
                        <div className="flex flex-col items-center gap-1 bg-blue-50/40 p-3 rounded-2xl border border-blue-100 max-w-xs mx-auto">
                          <input
                            type="number"
                            min="1"
                            max="200"
                            value={redNum}
                            onChange={(e) => setRedNum(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-20 p-2 text-center rounded-xl border-2 border-blue-300 font-mono font-bold text-xl text-slate-800 bg-white"
                            title="Numeratore"
                          />
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full my-0.5"></div>
                          <input
                            type="number"
                            min="1"
                            max="200"
                            value={redDen}
                            onChange={(e) => setRedDen(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-20 p-2 text-center rounded-xl border-2 border-blue-300 font-mono font-bold text-xl text-slate-800 bg-white"
                            title="Denominatore"
                          />
                        </div>
                      </div>

                      {/* Piano 2: Il Filtro M.C.D. (Strettoia dell'Imbuto) */}
                      <div className="text-center relative">
                        <div className="inline-flex items-center gap-2 bg-orange-100 border-2 border-orange-300 text-orange-950 px-6 py-2 rounded-full font-black text-xs shadow-xs">
                          <span>⚙️ Filtro M.C.D.:</span>
                          <span className="text-dida-orange text-base font-mono">÷ {redInfo.gcd}</span>
                          <span>(Massimo Comune Divisore)</span>
                        </div>
                      </div>

                      {/* Piano 3: Caveau Frazione Irriducibile Risultante */}
                      <div className="bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-xs text-center space-y-3">
                        <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                          3. Risultato ai Minimi Termini
                        </span>
                        <div className="flex items-center justify-center gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 max-w-xs mx-auto">
                          <Frac num={redInfo.simpNum} den={redInfo.simpDen} size="xl" className="text-emerald-700" />
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {redInfo.isIrreducible
                            ? "✅ La frazione era già IRRIDUCIBILE (M.C.D. = 1, numeri primi tra loro)!"
                            : `✅ Semplificata con successo dividendo entrambi i termini per ${redInfo.gcd}!`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: CONFRONTARE LE FRAZIONI & SEMIRETTA */}
            {/* ======================================================== */}
            {selectedSubtopic === "fraction-comparison" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 4 · Chi ne ha di più?
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Confrontare le Frazioni & La Semiretta
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Come capire quale frazione è più grande? Esistono casi immediati (stesso denominatore, stesso numeratore) e due metodi potenti per denominatori diversi: <strong>minimo comune denominatore</strong> e <strong>prodotto a croce</strong>!
                    </p>
                  </div>

                  {/* I Casi Facili */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-xs font-bold text-dida-blue">1. Propria vs Impropria</span>
                      <p className="text-xs text-slate-600">
                        La propria è &lt; 1, l'impropria è &gt; 1. Vince sempre l'impropria! (<Frac num={4} den={5} size="xs" /> &lt; <Frac num={7} den={2} size="xs" />)
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-xs font-bold text-emerald-600">2. Stesso Denominatore</span>
                      <p className="text-xs text-slate-600">
                        Vince il numeratore più <strong>GRANDE</strong>: più pezzi uguali! (<Frac num={4} den={9} size="xs" /> &gt; <Frac num={2} den={9} size="xs" />)
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-xs font-bold text-amber-600">3. Stesso Numeratore</span>
                      <p className="text-xs text-slate-600">
                        Vince il denominatore più <strong>PICCOLO</strong>: fette più grosse! (<Frac num={3} den={4} size="xs" /> &gt; <Frac num={3} den={5} size="xs" />)
                      </p>
                    </div>
                  </div>

                  {/* Laboratorio 6: Bilancia di Confronto (Layout Bilancia Digitale a 2 Piatti) */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Bilancia Digitale Frazionaria
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Quale Frazione Pesa di Più?
                      </h3>
                      <p className="text-xs text-slate-500">
                        Carica i due piatti della bilancia: il perno centrale rileva istantaneamente la maggiore!
                      </p>
                    </div>

                    {/* Stazione Bilancia a 2 Piatti con Perno Centrale */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center max-w-3xl mx-auto">
                      {/* Piatto Sinistro: Frazione A (5 cols) */}
                      <div className="md:col-span-5 bg-white p-6 rounded-3xl border-2 border-blue-200 shadow-xs text-center space-y-3 flex flex-col items-center">
                        <span className="text-xs font-black text-dida-blue uppercase tracking-wider">
                          Piatto A (Frazione A)
                        </span>
                        <div className="flex flex-col items-center gap-1 bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={compNumA}
                            onChange={(e) => setCompNumA(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-1.5 text-center rounded-xl border-2 border-blue-300 font-mono font-bold text-xl bg-white"
                          />
                          <div className="w-20 h-1 bg-slate-800 rounded-full my-0.5"></div>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={compDenA}
                            onChange={(e) => setCompDenA(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-1.5 text-center rounded-xl border-2 border-blue-300 font-mono font-bold text-xl bg-white"
                          />
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                          Valore decimale ≈ {compInfo.valA.toFixed(3)}
                        </span>
                      </div>

                      {/* Perno Centrale: Simbolo di Confronto Gigante (2 cols) */}
                      <div className="md:col-span-2 flex flex-col items-center justify-center my-2 md:my-0">
                        <div className="w-16 h-16 rounded-2xl bg-dida-orange text-white font-mono font-black text-3xl flex items-center justify-center shadow-md">
                          {compInfo.symbol}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                          Esito
                        </span>
                      </div>

                      {/* Piatto Destro: Frazione B (5 cols) */}
                      <div className="md:col-span-5 bg-white p-6 rounded-3xl border-2 border-orange-200 shadow-xs text-center space-y-3 flex flex-col items-center">
                        <span className="text-xs font-black text-dida-orange uppercase tracking-wider">
                          Piatto B (Frazione B)
                        </span>
                        <div className="flex flex-col items-center gap-1 bg-orange-50/50 p-3 rounded-2xl border border-orange-100">
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={compNumB}
                            onChange={(e) => setCompNumB(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-1.5 text-center rounded-xl border-2 border-orange-300 font-mono font-bold text-xl bg-white"
                          />
                          <div className="w-20 h-1 bg-slate-800 rounded-full my-0.5"></div>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={compDenB}
                            onChange={(e) => setCompDenB(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-1.5 text-center rounded-xl border-2 border-orange-300 font-mono font-bold text-xl bg-white"
                          />
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                          Valore decimale ≈ {compInfo.valB.toFixed(3)}
                        </span>
                      </div>
                    </div>

                    {/* Scheda Dimostrazione a Prodotto Incrociato */}
                    <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 max-w-xl mx-auto text-center space-y-1 shadow-xs">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                        Verifica con il Prodotto Incrociato:
                      </span>
                      <p className="text-xs font-mono text-slate-700">
                        ({compNumA} × {compDenB} = <strong>{compNumA * compDenB}</strong>) {compInfo.symbol} ({compNumB} × {compDenA} = <strong>{compNumB * compDenA}</strong>)
                      </p>
                    </div>

                    {/* I 2 Metodi Spiegati Affiancati */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Metodo m.c.d. */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <span className="text-xs font-black uppercase text-blue-700">
                          Metodo 1 · Denominatore Comune (m.c.m.)
                        </span>
                        <div className="text-xs text-slate-700 leading-relaxed space-y-1">
                          <p>m.c.m.({compDenA}, {compDenB}) = <strong>{compInfo.lcmDen}</strong></p>
                          <div className="flex items-center gap-2">
                            <Frac num={compNumA} den={compDenA} size="xs" />
                            <span>➔</span>
                            <Frac num={compInfo.newNumA} den={compInfo.lcmDen} size="xs" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Frac num={compNumB} den={compDenB} size="xs" />
                            <span>➔</span>
                            <Frac num={compInfo.newNumB} den={compInfo.lcmDen} size="xs" />
                          </div>
                          <p className="pt-1">
                            Poiché {compInfo.newNumA} {compInfo.symbol} {compInfo.newNumB} ➔ <Frac num={compNumA} den={compDenA} size="xs" /> {compInfo.symbol} <Frac num={compNumB} den={compDenB} size="xs" />!
                          </p>
                        </div>
                      </div>

                      {/* Metodo Prodotto a Croce */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <span className="text-xs font-black uppercase text-amber-700">
                          Metodo 2 · Prodotto a Croce (Veloce!)
                        </span>
                        <div className="text-xs text-slate-700 leading-relaxed font-mono space-y-1">
                          <p>1ª sopra × 2ª sotto: {compNumA} × {compDenB} = <strong>{compInfo.crossA}</strong></p>
                          <p>1ª sotto × 2ª sopra: {compDenA} × {compNumB} = <strong>{compInfo.crossB}</strong></p>
                          <p className="pt-1 font-sans text-xs">
                            Poiché {compInfo.crossA} {compInfo.symbol} {compInfo.crossB} ➔ <Frac num={compNumA} den={compDenA} size="xs" /> {compInfo.symbol} <Frac num={compNumB} den={compDenB} size="xs" />!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Visualizzazione sulla Semiretta 0..3 */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block text-center">
                        Posizione sulla Semiretta Orientata dei Numeri Razionali (0 → 3)
                      </span>
                      <div className="relative w-full h-18 pt-6">
                        {/* Linea orizzontale */}
                        <div className="w-full h-1 bg-slate-300 absolute top-9"></div>
                        {/* Tacche 0, 1, 2, 3 */}
                        {[0, 1, 2, 3].map((val) => (
                          <div
                            key={val}
                            className="absolute top-7 flex flex-col items-center -translate-x-1/2"
                            style={{ left: `${(val / 3) * 100}%` }}
                          >
                            <div className="w-1 h-5 bg-slate-500 rounded-full"></div>
                            <span className="text-xs font-mono font-bold text-slate-700 mt-1">{val}</span>
                          </div>
                        ))}

                        {/* Punto Frazione A */}
                        {compInfo.valA <= 3 && (
                          <motion.div
                            animate={{ left: `${(compInfo.valA / 3) * 100}%` }}
                            className="absolute top-1 -translate-x-1/2 flex flex-col items-center z-10"
                          >
                            <span className="text-[10px] text-white bg-blue-600 px-2 py-0.5 rounded-full shadow-xs flex items-center">
                              <Frac num={compNumA} den={compDenA} size="xs" />
                            </span>
                            <div className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-2 ring-white"></div>
                          </motion.div>
                        )}

                        {/* Punto Frazione B */}
                        {compInfo.valB <= 3 && (
                          <motion.div
                            animate={{ left: `${(compInfo.valB / 3) * 100}%` }}
                            className="absolute top-1 -translate-x-1/2 flex flex-col items-center z-10"
                          >
                            <span className="text-[10px] text-white bg-emerald-600 px-2 py-0.5 rounded-full shadow-xs flex items-center">
                              <Frac num={compNumB} den={compDenB} size="xs" />
                            </span>
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 ring-2 ring-white"></div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 6: PROBLEMI CON LE FRAZIONI (DIRETTO E INVERSO) */}
            {/* ======================================================== */}
            {selectedSubtopic === "fraction-problems" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 5 · Dalla parte all'intero e ritorno
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Problemi: Diretto o Inverso?
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      La domanda chiave prima di ogni calcolo: <strong>conosco l'intero</strong> (problema diretto) o <strong>conosco già una parte</strong> (problema inverso)?
                    </p>
                  </div>

                  {/* Schema Comparativo Diretto vs Inverso */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        DIRETTO · Conosco l'INTERO
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Cerco una PARTE</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Testo tipico: "Il serbatoio è 56 litri, consuma i <Frac num={4} den={7} size="xs" />...". <br />
                        Regola: <strong>: denominatore, × numeratore</strong>. <br />
                        Il risultato è <strong>PIÙ PICCOLO</strong> dell'intero!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-amber-50/70 border-2 border-amber-200 space-y-3">
                      <span className="text-xs font-black uppercase text-amber-700 bg-white px-3 py-1 rounded-full border border-amber-200">
                        INVERSO · Conosco una PARTE
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Cerco l'INTERO</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Testo tipico: "I <Frac num={7} den={9} size="xs" /> del prezzo <strong>sono</strong> 280 €...". <br />
                        Regola: <strong>: numeratore, × denominatore</strong>. <br />
                        Il risultato è <strong>PIÙ GRANDE</strong> della parte!
                      </p>
                    </div>
                  </div>

                  {/* Laboratorio 7: Risolutore di Problemi con Segmenti (Layout Blueprint Canvas) */}
                  <div className="p-6 md:p-8 rounded-3xl bg-blue-50/30 border-2 border-blue-200/80 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-blue-200/60 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Studio Risolutore · Blueprint a Segmenti
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Risolvi Problemi Diretti e Inversi con il Modello a Barre
                      </h3>
                      <p className="text-xs text-slate-600">
                        Passa tra problema diretto e inverso: il modello adatta i segmenti e visualizza la formula risolutiva!
                      </p>

                      {/* Selettore Modalità a Switch Segmentato */}
                      <div className="flex bg-white p-1 rounded-2xl border-2 border-blue-200 mt-2 shadow-xs">
                        <button
                          onClick={() => setProblemMode("diretto")}
                          className={`px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                            problemMode === "diretto"
                              ? "bg-dida-blue text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Problema Diretto (Trova la Parte)
                        </button>
                        <button
                          onClick={() => setProblemMode("inverso")}
                          className={`px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                            problemMode === "inverso"
                              ? "bg-dida-orange text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Problema Inverso (Trova l'Intero)
                        </button>
                      </div>
                    </div>

                    {/* Preset Rapidi tratti dalle slide */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Casi reali dalle slide:</span>
                      <button
                        onClick={() => { setProblemMode("diretto"); setProbValue(56); setProbNum(4); setProbDen(7); }}
                        className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:border-blue-200 cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        Serbatoio 56 l (<Frac num={4} den={7} size="xs" />)
                      </button>
                      <button
                        onClick={() => { setProblemMode("inverso"); setProbValue(280); setProbNum(7); setProbDen(9); }}
                        className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:border-orange-200 cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        Chitarra 280 € (<Frac num={7} den={9} size="xs" />)
                      </button>
                      <button
                        onClick={() => { setProblemMode("diretto"); setProbValue(80); setProbNum(1); setProbDen(4); }}
                        className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:border-blue-200 cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        Scarpe 80 € (sconto <Frac num={1} den={4} size="xs" />)
                      </button>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs items-center max-w-2xl mx-auto">
                      <div className="text-center">
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          {problemMode === "diretto" ? "Valore dell'Intero:" : "Valore della Parte Nota:"}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={probValue}
                          onChange={(e) => setProbValue(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-36 p-2 text-center rounded-xl border-2 border-blue-300 font-mono font-bold text-xl text-slate-800 bg-blue-50/30"
                        />
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-600 block mb-1">Frazione di riferimento:</span>
                        <div className="flex flex-col items-center gap-1 bg-orange-50/40 p-2 rounded-2xl border border-orange-200">
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={probNum}
                            onChange={(e) => setProbNum(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-1 text-center rounded-xl border-2 border-orange-300 font-mono font-bold text-lg text-slate-800 bg-white"
                            title="Numeratore"
                          />
                          <div className="w-20 h-1 bg-slate-800 rounded-full my-0.5"></div>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={probDen}
                            onChange={(e) => setProbDen(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-1 text-center rounded-xl border-2 border-orange-300 font-mono font-bold text-lg text-slate-800 bg-white"
                            title="Denominatore"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Rappresentazione a Barra e Risoluzione Passo-Passo */}
                    {problemResult && (
                      <div className="space-y-4 max-w-3xl mx-auto">
                        {/* Barra grafica */}
                        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xs space-y-3">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <span>Modello a Barre (Unità Frazionarie)</span>
                            <span className="text-dida-blue font-mono font-black">{probNum}/{probDen}</span>
                          </div>
                          <div className="w-full h-14 rounded-2xl border-2 border-slate-300 flex overflow-hidden bg-slate-100 shadow-inner">
                            {Array.from({ length: probDen }).map((_, i) => (
                              <div
                                key={i}
                                className={`flex-1 border-r last:border-r-0 border-slate-300 flex items-center justify-center font-mono font-bold text-xs ${
                                  i < probNum
                                    ? problemMode === "diretto" ? "bg-dida-blue text-white shadow-inner" : "bg-dida-orange text-white shadow-inner"
                                    : "bg-white text-slate-600"
                                }`}
                              >
                                {problemResult.unitPart.toLocaleString()}
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs font-bold text-slate-600 pt-1">
                            <span className={problemMode === "diretto" ? "text-dida-blue" : "text-dida-orange"}>
                              Parte ({probNum} unità) = {problemMode === "diretto" ? problemResult.finalPart.toLocaleString() : probValue.toLocaleString()}
                            </span>
                            <span className="text-slate-700">
                              Intero ({probDen} unità) = {problemMode === "diretto" ? probValue.toLocaleString() : problemResult.fullValue.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Risoluzione Passo Passo con vere linee di frazione */}
                        <div className="p-6 rounded-3xl bg-white border-2 border-blue-200 shadow-xs space-y-3">
                          <span className="text-xs font-black uppercase text-dida-blue tracking-wider block">
                            Passaggi di Calcolo Guidato:
                          </span>
                          <div className="space-y-2.5 text-xs md:text-sm">
                            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-slate-800 flex items-center flex-wrap gap-2">
                              <strong>1. Calcolo 1 parte (unità frazionaria <Frac num={1} den={probDen} size="xs" />):</strong>
                              <span className="font-mono font-bold text-dida-blue">
                                {problemMode === "diretto"
                                  ? `${probValue} : ${probDen} = ${problemResult.unitPart.toLocaleString()}`
                                  : `${probValue} : ${probNum} = ${problemResult.unitPart.toLocaleString()}`}
                              </span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 text-slate-800 flex items-center flex-wrap gap-2">
                              <strong>2. Calcolo risultato:</strong>
                              <span className="font-mono font-bold text-dida-orange">
                                {problemMode === "diretto"
                                  ? `${problemResult.unitPart.toLocaleString()} × ${probNum} = ${problemResult.finalPart.toLocaleString()} (la parte cercata)`
                                  : `${problemResult.unitPart.toLocaleString()} × ${probDen} = ${problemResult.fullValue.toLocaleString()} (l'intero totale)`}
                              </span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center flex-wrap gap-2">
                              <strong>3. Conclusione:</strong>
                              <span>
                                {problemMode === "diretto"
                                  ? `Parte restante: ${probValue} − ${problemResult.finalPart.toLocaleString()} = ${problemResult.remaining.toLocaleString()}`
                                  : `Verifica: i ${probNum}/${probDen} di ${problemResult.fullValue.toLocaleString()} danno esattamente ${probValue} ✓`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            </div>
          </motion.div>
        ) : (
          /* ======================================================== */
          /* TAB ALLENA (PALESTRA DI ESERCIZI) */
          /* ======================================================== */
          <motion.div
            key="tab-allena-fractions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 px-4"
          >
            {/* Banner Palestra */}
            <div className="rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 shadow-lg text-center flex flex-col items-center gap-3.5">
              <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-amber-950 bg-white/30 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/40 shadow-xs">
                Palestra di Aritmetica · Frazioni
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Mettiti alla Prova con le Frazioni e i Quesiti INVALSI
              </h2>
              <p className="text-amber-100 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Esercizi di calcolo, riconoscimento di tipologie, frazioni equivalenti e problemi reali tratti direttamente dalle prove d'esame!
              </p>
            </div>

            {/* SEZIONE 1: Quiz Calcolo e Concetti con vera linea di frazione */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Attività 1 · Calcolo Rapido & Concetti
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">La Frazione di un Numero</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 1,
                    qTitle: (
                      <span>Quanto valgono i <Frac num={2} den={3} size="xs" /> di 9 figurine?</span>
                    ),
                    options: [
                      { id: "a", label: "6 figurine (9:3 × 2)", correct: true },
                      { id: "b", label: "3 figurine", correct: false },
                      { id: "c", label: "18 figurine", correct: false },
                    ],
                    explain: (
                      <span>9 : 3 = 3 (<Frac num={1} den={3} size="xs" />), poi 3 × 2 = 6 figurine!</span>
                    )
                  },
                  {
                    id: 2,
                    qTitle: (
                      <span>Quanto valgono i <Frac num={5} den={6} size="xs" /> di 42 litri?</span>
                    ),
                    options: [
                      { id: "a", label: "30 litri", correct: false },
                      { id: "b", label: "35 litri (42:6 × 5)", correct: true },
                      { id: "c", label: "40 litri", correct: false },
                    ],
                    explain: "42 : 6 = 7, poi 7 × 5 = 35 litri!"
                  },
                  {
                    id: 3,
                    qTitle: (
                      <span>Quale tra queste è una frazione APPARENTE?</span>
                    ),
                    options: [
                      { id: "a", label: "7/4", frac: <Frac num={7} den={4} size="xs" />, correct: false },
                      { id: "b", label: "12/3 (vale 4 interi)", frac: <Frac num={12} den={3} size="xs" />, correct: true },
                      { id: "c", label: "3/7", frac: <Frac num={3} den={7} size="xs" />, correct: false },
                    ],
                    explain: "12 è multiplo di 3, infatti 12:3 = 4 interi!"
                  },
                  {
                    id: 4,
                    qTitle: (
                      <span>Qual è la frazione complementare di <Frac num={3} den={8} size="xs" />?</span>
                    ),
                    options: [
                      { id: "a", label: "5/8", frac: <Frac num={5} den={8} size="xs" />, correct: true },
                      { id: "b", label: "8/3", frac: <Frac num={8} den={3} size="xs" />, correct: false },
                      { id: "c", label: "1/8", frac: <Frac num={1} den={8} size="xs" />, correct: false },
                    ],
                    explain: (
                      <span>Per completare l'intero servono <Frac num={5} den={8} size="xs" />!</span>
                    )
                  },
                ].map((item) => {
                  const ans = exQuizAnswers[item.id];
                  return (
                    <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="text-sm font-bold text-slate-800">{item.qTitle}</div>
                      <div className="flex flex-col gap-2">
                        {item.options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setExQuizAnswers(prev => ({ ...prev, [item.id]: opt.id }))}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border text-left transition cursor-pointer flex items-center gap-2 ${
                              ans === opt.id
                                ? opt.correct
                                  ? "bg-emerald-500 text-white border-emerald-600"
                                  : "bg-rose-500 text-white border-rose-600"
                                : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                            }`}
                          >
                            {opt.frac ? opt.frac : null}
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                      {ans && (
                        <div className="text-xs font-semibold text-slate-600">
                          {ans === item.options.find(o => o.correct)?.id
                            ? <span className="flex items-center gap-1 text-emerald-700">✅ {item.explain}</span>
                            : <span className="text-rose-600">❌ Riprova, rifletti sulla regola!</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE 2: Classificazione P, I o A? */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Attività 2 · Classificazione Rapida
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Propria (P), Impropria (I) o Apparente (A)?</h3>
                <p className="text-xs text-slate-500">Seleziona la lettera corretta per ciascuna frazione.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { num: 9, den: 4, correct: "I", note: "Impropria: num > den" },
                  { num: 3, den: 6, correct: "P", note: "Propria: num < den" },
                  { num: 9, den: 3, correct: "A", note: "Apparente: 9:3 = 3" },
                  { num: 6, den: 5, correct: "I", note: "Impropria: num > den" },
                  { num: 12, den: 3, correct: "A", note: "Apparente: 12:3 = 4" },
                  { num: 3, den: 7, correct: "P", note: "Propria: num < den" },
                  { num: 15, den: 5, correct: "A", note: "Apparente: 15:5 = 3" },
                  { num: 1, den: 4, correct: "P", note: "Propria: num < den" },
                ].map((item, idx) => {
                  const keyStr = `${item.num}/${item.den}`;
                  const current = exTypeAnswers[keyStr];
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2 flex flex-col items-center">
                      <Frac num={item.num} den={item.den} size="lg" className="text-slate-900" />
                      <div className="flex justify-center gap-1.5 mt-1">
                        {(["P", "I", "A"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => setExTypeAnswers(prev => ({ ...prev, [keyStr]: type }))}
                            className={`w-8 h-8 rounded-lg text-xs font-black transition cursor-pointer border ${
                              current === type
                                ? type === item.correct
                                  ? "bg-emerald-500 text-white border-emerald-600"
                                  : "bg-rose-500 text-white border-rose-600"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      {current && (
                        <span className="text-[10px] block font-semibold text-slate-500">
                          {current === item.correct ? "✅ " + item.note : "❌ Riprova"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE 3: PROVE INVALSI UFFICIALI (Slide 44, 45, 46) */}
            <div className="rounded-[2rem] border-2 border-dida-blue/30 bg-white p-6 md:p-8 shadow-md space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-dida-blue text-white flex items-center justify-center font-black shadow-md">
                    <Award size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100">
                      Preparazione Prove Nazionali
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                      Come alle Prove INVALSI: Frazioni
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-semibold">Quesiti ufficiali dalle prove nazionali</span>
              </div>

              {/* Quesito INVALSI 1: Olio e Ricotta */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Quesito 1 · Olio e Ricotta
                </span>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  Francesco deve riempire di olio un contenitore da <strong>50 litri</strong>. Ha già riempito i <strong><Frac num={6} den={10} size="xs" /></strong>. <br />
                  Quanti litri deve ancora aggiungere per completarlo?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "10 litri", correct: false },
                    { id: "B", val: "20 litri", correct: true },
                    { id: "C", val: "30 litri", correct: false },
                    { id: "D", val: "40 litri", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, olio: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                        invalsiAnswers.olio === opt.id
                          ? opt.correct
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : "bg-rose-500 text-white border-rose-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt.id}. {opt.val}
                    </button>
                  ))}
                </div>
                {invalsiAnswers.olio && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.olio === "B"
                      ? "✅ Esatto! Ogni decimo è 50:10 = 5 litri. Mancano 4/10: 5 × 4 = 20 litri (oppure 50 - 30 = 20 l)!"
                      : "❌ Attento: 6/10 sono 30 litri già versati. La domanda chiede quanti ne mancano!"}
                  </p>
                )}
              </div>

              {/* Quesito INVALSI 2: Crema di Ricotta */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  Quesito 2 · La Crema del Nonno
                </span>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  Per la crema servono <strong><Frac num={2} den={3} size="xs" /> di ricotta</strong> e <strong><Frac num={1} den={3} size="xs" /> di zucchero</strong>. Il nonno usa <strong>300 grammi di ricotta</strong>. <br />
                  Quanti grammi di zucchero gli servono?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "100 g", correct: false },
                    { id: "B", val: "150 g", correct: true },
                    { id: "C", val: "200 g", correct: false },
                    { id: "D", val: "250 g", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, ricotta: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                        invalsiAnswers.ricotta === opt.id
                          ? opt.correct
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : "bg-rose-500 text-white border-rose-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt.id}. {opt.val}
                    </button>
                  ))}
                </div>
                {invalsiAnswers.ricotta && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.ricotta === "B"
                      ? "✅ Bravissimo! 2 parti su 3 valgono 300 g, quindi 1 parte (lo zucchero) vale 300 : 2 = 150 grammi!"
                      : "❌ Ricorda: la ricotta rappresenta 2 parti su 3 (= 300g). Lo zucchero è 1 sola parte!"}
                  </p>
                )}
              </div>

              {/* Quesito INVALSI 3: Chi ha speso di più? */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  Quesito 3 · Saverio, Giorgio e Marco
                </span>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  I tre amici ricevono la stessa somma. Dopo una settimana: a Saverio resta <strong><Frac num={1} den={4} size="xs" /></strong>, a Marco <strong><Frac num={1} den={3} size="xs" /></strong>, a Giorgio la <strong>metà (<Frac num={1} den={2} size="xs" />)</strong>. <br />
                  Chi ha <strong>speso di più</strong>?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[
                    { id: "sav", val: "Saverio (resta 1/4)", frac: <Frac num={1} den={4} size="xs" />, correct: true },
                    { id: "mar", val: "Marco (resta 1/3)", frac: <Frac num={1} den={3} size="xs" />, correct: false },
                    { id: "gio", val: "Giorgio (resta 1/2)", frac: <Frac num={1} den={2} size="xs" />, correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, speso: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                        invalsiAnswers.speso === opt.id
                          ? opt.correct
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : "bg-rose-500 text-white border-rose-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{opt.id === "sav" ? "Saverio" : opt.id === "mar" ? "Marco" : "Giorgio"} (resta</span>
                      {opt.frac}
                      <span>)</span>
                    </button>
                  ))}
                </div>
                {invalsiAnswers.speso && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.speso === "sav"
                      ? "✅ TRUCCO INVALSI: Chi ha speso di più è chi ha la frazione rimasta più PICCOLA! Poiché 1/4 < 1/3 < 1/2, a Saverio resta di meno, quindi ha speso i 3/4!"
                      : "❌ Attenzione al tranello: chi ha la frazione rimasta più piccola è colui che ha speso di più!"}
                  </p>
                )}
              </div>
            </div>

            {/* SEZIONE 4: Sfida Finale Vero o Falso (Slide 47) */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
              <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Sfida Finale · Vero o Falso a Squadre
              </span>
              <p className="text-xs text-slate-500">Metti alla prova tutto ciò che hai imparato:</p>

              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    text: (<span>a · <Frac num={1} den={8} size="xs" /> è più grande di <Frac num={1} den={3} size="xs" /></span>),
                    correct: false,
                    note: "Falso: più grande è il denominatore, più piccolo è il pezzo!"
                  },
                  {
                    id: 2,
                    text: (<span>b · <Frac num={6} den={6} size="xs" /> è una frazione apparente</span>),
                    correct: true,
                    note: "Vero: vale esattamente 1 intero!"
                  },
                  {
                    id: 3,
                    text: (<span>c · <Frac num={2} den={4} size="xs" /> e <Frac num={3} den={6} size="xs" /> sono equivalenti</span>),
                    correct: true,
                    note: "Vero: entrambe valgono la metà (0,5)!"
                  },
                  {
                    id: 4,
                    text: (<span>d · I <Frac num={3} den={4} size="xs" /> di 20 sono 15</span>),
                    correct: true,
                    note: "Vero: 20 : 4 = 5, poi 5 × 3 = 15!"
                  },
                  {
                    id: 5,
                    text: (<span>e · <Frac num={12} den={18} size="xs" /> ridotta ai minimi termini è <Frac num={2} den={3} size="xs" /></span>),
                    correct: true,
                    note: "Vero: dividendo per il M.C.D. 6 si ottiene 2/3!"
                  },
                  {
                    id: 6,
                    text: (<span>f · Se i <Frac num={2} den={5} size="xs" /> sono 10, l'intero è 4</span>),
                    correct: false,
                    note: "Falso: se 2 parti valgono 10, 1 parte vale 5 e l'intero (5 parti) vale 25!"
                  },
                ].map((q) => {
                  const ans = vfAnswers[q.id];
                  return (
                    <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                      <div className="text-xs font-bold text-slate-800 flex-1">{q.text}</div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setVfAnswers(prev => ({ ...prev, [q.id]: true }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            ans === true
                              ? q.correct === true ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600"
                              : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                          }`}
                        >
                          Vero
                        </button>
                        <button
                          onClick={() => setVfAnswers(prev => ({ ...prev, [q.id]: false }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            ans === false
                              ? q.correct === false ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600"
                              : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                          }`}
                        >
                          Falso
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
