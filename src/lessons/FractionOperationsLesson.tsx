import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, BookOpen, Zap, CheckCircle2, XCircle, Sparkles,
  ChevronRight, RotateCcw, AlertCircle, Info, Award, HelpCircle,
  Hash, Scissors, RefreshCw, Check, X, Star, Users, Search,
  Music, Grid, Split, Calculator, ArrowRight, Play, CheckCircle
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
  { id: "fraction-addition", title: "1. Addizione di Frazioni", short: "1. Addizione (+)" },
  { id: "fraction-subtraction", title: "2. Sottrazione di Frazioni", short: "2. Sottrazione (−)" },
  { id: "fraction-multiplication", title: "3. Moltiplicazione & A Croce", short: "3. Moltiplicazione (×)" },
  { id: "fraction-division", title: "4. Divisione & Inversa", short: "4. Divisione (:)" },
  { id: "fraction-power", title: "5. Potenze & Espressioni", short: "5. Potenze & Espressioni" },
  { id: "fraction-segments", title: "6. Problemi con i Segmenti", short: "6. Segmenti (Somma/Diff)" },
  { id: "fraction-music", title: "7. Musica, Maestro! (Le Durate)", short: "7. Musica & Frazioni" },
];

export default function FractionOperationsLesson({
  onBack,
  subjectName,
  topicName,
  initialSubtopicId,
  initialTab = "impara",
}: Props) {
  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>(() => {
    if (initialSubtopicId && SUBTOPICS.some(s => s.id === initialSubtopicId)) {
      return initialSubtopicId;
    }
    return "fraction-addition";
  });

  // Funzioni matematiche base
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

  const calcLcm = (a: number, b: number): number => {
    if (!a || !b) return 0;
    return Math.abs(a * b) / calcGcd(a, b);
  };

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // Modulo 1: Addizione
  const [opNumA, setOpNumA] = useState<number>(5);
  const [opDenA, setOpDenA] = useState<number>(9);
  const [opSign, setOpSign] = useState<"+" | "−">("+");
  const [opNumB, setOpNumB] = useState<number>(7);
  const [opDenB, setOpDenB] = useState<number>(12);

  // Modulo 2: Sottrazione Dedicata
  const [subNumA, setSubNumA] = useState<number>(3);
  const [subDenA, setSubDenA] = useState<number>(4);
  const [subNumB, setSubNumB] = useState<number>(1);
  const [subDenB, setSubDenB] = useState<number>(3);

  // Modulo 3: Moltiplicazione & Griglia Rettangolare
  const [multNumA, setMultNumA] = useState<number>(2);
  const [multDenA, setMultDenA] = useState<number>(3);
  const [multNumB, setMultNumB] = useState<number>(1);
  const [multDenB, setMultDenB] = useState<number>(5);

  // Modulo 4: Divisione
  const [divNumA, setDivNumA] = useState<number>(9);
  const [divDenA, setDivDenA] = useState<number>(16);
  const [divNumB, setDivNumB] = useState<number>(3);
  const [divDenB, setDivDenB] = useState<number>(8);
  const [divFlipped, setDivFlipped] = useState<boolean>(false);

  // Modulo 5: Potenze ed Espressioni
  const [powBaseNum, setPowBaseNum] = useState<number>(3);
  const [powBaseDen, setPowBaseDen] = useState<number>(4);
  const [powExp, setPowExp] = useState<number>(2);
  const [powWithParentheses, setPowWithParentheses] = useState<boolean>(true);
  const [exprStep, setExprStep] = useState<number>(0);

  // Modulo 6: Segmenti
  const [segMode, setSegMode] = useState<"somma" | "differenza">("somma");
  const [segTotal, setSegTotal] = useState<number>(84);
  const [segNum, setSegNum] = useState<number>(2);
  const [segDen, setSegDen] = useState<number>(5);

  // Modulo 7: Musica Maestro
  const [musicMeasures, setMusicMeasures] = useState<number[]>([4, 4, 8, 8]); // 4 = quarto, 8 = ottavo
  const [isPlayingBeat, setIsPlayingBeat] = useState<boolean>(false);
  const [activeBeatIndex, setActiveBeatIndex] = useState<number>(-1);

  const playRhythm = () => {
    if (isPlayingBeat || musicMeasures.length === 0) return;
    setIsPlayingBeat(true);
    let idx = 0;
    setActiveBeatIndex(0);
    const timer = setInterval(() => {
      idx++;
      if (idx >= musicMeasures.length) {
        clearInterval(timer);
        setIsPlayingBeat(false);
        setActiveBeatIndex(-1);
      } else {
        setActiveBeatIndex(idx);
      }
    }, 500);
  };

  // ==========================================
  // --- STATI ESERCIZI (ALLENA) ---
  // ==========================================
  const [exErrorsAnswers, setExErrorsAnswers] = useState<Record<number, boolean | null>>({});
  const [invalsiAnswers, setInvalsiAnswers] = useState<Record<string, string>>({});
  const [vfAnswers, setVfAnswers] = useState<Record<number, boolean | null>>({});

  // Calcolo Addizione
  const addSubResult = useMemo(() => {
    const lcm = calcLcm(opDenA, opDenB);
    const scaledNumA = opNumA * (lcm / opDenA);
    const scaledNumB = opNumB * (lcm / opDenB);
    const resNumRaw = opSign === "+" ? scaledNumA + scaledNumB : scaledNumA - scaledNumB;
    const gcd = calcGcd(resNumRaw, lcm);
    const simpNum = resNumRaw / gcd;
    const simpDen = lcm / gcd;

    return {
      lcm,
      scaledNumA,
      scaledNumB,
      resNumRaw,
      simpNum,
      simpDen,
      isNegative: resNumRaw < 0,
      isSimp: gcd > 1
    };
  }, [opNumA, opDenA, opNumB, opDenB, opSign]);

  // Calcolo Sottrazione Dedicata
  const subResult = useMemo(() => {
    const lcm = calcLcm(subDenA, subDenB);
    const scaledNumA = subNumA * (lcm / subDenA);
    const scaledNumB = subNumB * (lcm / subDenB);
    const resNumRaw = scaledNumA - scaledNumB;
    const isNegative = resNumRaw < 0;
    const absRes = Math.abs(resNumRaw);
    const gcd = calcGcd(absRes, lcm);
    const simpNum = resNumRaw / gcd;
    const simpDen = lcm / gcd;

    return {
      lcm,
      scaledNumA,
      scaledNumB,
      resNumRaw,
      simpNum,
      simpDen,
      isNegative,
      isSimp: gcd > 1 && resNumRaw !== 0,
      valA: subNumA / subDenA,
      valB: subNumB / subDenB,
    };
  }, [subNumA, subDenA, subNumB, subDenB]);

  // Calcolo Moltiplicazione con semplificazione a croce
  const multResult = useMemo(() => {
    const rawNum = multNumA * multNumB;
    const rawDen = multDenA * multDenB;
    const crossGcd1 = calcGcd(multNumA, multDenB);
    const crossGcd2 = calcGcd(multNumB, multDenA);

    const simpNumA = multNumA / crossGcd1;
    const simpDenB = multDenB / crossGcd1;

    const simpNumB = multNumB / crossGcd2;
    const simpDenA = multDenA / crossGcd2;

    const finalNum = simpNumA * simpNumB;
    const finalDen = simpDenA * simpDenB;

    return {
      rawNum, rawDen,
      crossGcd1, crossGcd2,
      simpNumA, simpDenA, simpNumB, simpDenB,
      finalNum, finalDen
    };
  }, [multNumA, multDenA, multNumB, multDenB]);

  // Calcolo Divisione (moltiplica per l'inversa)
  const divResult = useMemo(() => {
    const invNum = divDenB;
    const invDen = divNumB;

    const rawNum = divNumA * invNum;
    const rawDen = divDenA * invDen;

    const crossGcd1 = calcGcd(divNumA, invDen);
    const crossGcd2 = calcGcd(invNum, divDenA);

    const simpNumA = divNumA / crossGcd1;
    const simpInvDen = invDen / crossGcd1;

    const simpInvNum = invNum / crossGcd2;
    const simpDenA = divDenA / crossGcd2;

    const finalNum = simpNumA * simpInvNum;
    const finalDen = simpDenA * simpInvDen;

    return {
      invNum, invDen,
      rawNum, rawDen,
      simpNumA, simpDenA, simpInvNum, simpInvDen,
      finalNum, finalDen
    };
  }, [divNumA, divDenA, divNumB, divDenB]);

  // Calcolo Potenza
  const powResult = useMemo(() => {
    const numPow = Math.pow(powBaseNum, powExp);
    const denPow = Math.pow(powBaseDen, powExp);
    return { numPow, denPow };
  }, [powBaseNum, powBaseDen, powExp]);

  // Calcolo Segmenti
  const segResult = useMemo(() => {
    if (segMode === "somma") {
      const partsTotal = segNum + segDen;
      const onePart = segTotal / partsTotal;
      const numA = onePart * segNum;
      const numB = onePart * segDen;
      return { partsTotal, onePart, numA, numB };
    } else {
      const partsDiff = Math.abs(segDen - segNum) || 1;
      const onePart = segTotal / partsDiff;
      const numA = onePart * segNum;
      const numB = onePart * segDen;
      return { partsDiff, onePart, numA, numB };
    }
  }, [segMode, segTotal, segNum, segDen]);

  // Calcolo Battuta Musicale
  const musicSum = useMemo(() => {
    const sum = musicMeasures.reduce((acc, curr) => acc + (1 / curr), 0);
    return sum;
  }, [musicMeasures]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-6xl mx-auto space-y-8 pb-16"
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
              Le Operazioni con le Frazioni
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
            key="tab-impara-ops"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 px-4"
          >
            {/* Pillole Sottoargomenti */}
            <div className="flex justify-center flex-wrap gap-2 pb-1">
              {SUBTOPICS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubtopic(sub.id)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-sm transition cursor-pointer border ${
                    selectedSubtopic === sub.id
                      ? "bg-dida-blue text-white border-dida-blue shadow-lg shadow-blue-500/20 scale-[1.02]"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {sub.short}
                </button>
              ))}
            </div>

            {/* ======================================================== */}
            {/* MODULO 1 & 2: ADDIZIONE E SOTTRAZIONE */}
            {/* ======================================================== */}
            {/* ======================================================== */}
            {/* MODULO 1: ADDIZIONE DI FRAZIONI (PIPELINE SEQUENZIALE) */}
            {/* ======================================================== */}
            {selectedSubtopic === "fraction-addition" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Lezione Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 1 · Fette dello stesso tipo… e fette diverse
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      L'Addizione tra Frazioni & il Denominatore Comune
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Per sommare due frazioni dobbiamo prima fare in modo che abbiano lo <strong>stesso denominatore</strong>: troviamo il loro <strong>minimo comune denominatore (m.c.m.)</strong> per tagliare l'intero in fette identiche!
                    </p>
                  </div>

                  {/* I 2 Casi a Confronto con vere linee di frazione */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        1 · STESSO DENOMINATORE (Facile!)
                      </span>
                      <h3 className="text-xl font-black text-slate-800">5 noni + 2 noni = 7 noni</h3>
                      <div className="text-xs text-slate-600 leading-relaxed font-sans space-y-1">
                        <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                          <Frac num={5} den={9} size="sm" /> + <Frac num={2} den={9} size="sm" /> = <Frac num={7} den={9} size="sm" />
                        </div>
                        <p>Come contare le mele: 5 mele + 2 mele = 7 mele.</p>
                        <p className="text-rose-600 font-bold">
                          ATTENZIONE: il denominatore NON si somma mai! <Frac num={1} den={2} size="xs" /> + <Frac num={1} den={2} size="xs" /> fa 1, NON <Frac num={2} den={4} size="xs" />!
                        </p>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        2 · DENOMINATORI DIVERSI (m.c.m.)
                      </span>
                      <h3 className="text-xl font-black text-slate-800 flex items-center gap-1">
                        <span>Pizza Party:</span> <Frac num={1} den={2} size="md" /> + <Frac num={1} den={3} size="md" />
                      </h3>
                      <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                        <p>m.c.m.(2, 3) = 6</p>
                        <div className="flex items-center gap-1">
                          <Frac num={1} den={2} size="xs" /> = <Frac num={3} den={6} size="xs" /> · <Frac num={1} den={3} size="xs" /> = <Frac num={2} den={6} size="xs" />
                        </div>
                        <div className="flex items-center gap-1 font-bold text-slate-900">
                          <Frac num={3} den={6} size="xs" /> + <Frac num={2} den={6} size="xs" /> = <Frac num={5} den={6} size="sm" />!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LABORATORIO 1: PIPELINE SEQUENZIALE DELL'ADDIZIONE */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Pipeline di Addizione
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Somma tra Frazioni: La Pipeline dell'm.c.m.
                      </h3>
                      <p className="text-xs text-slate-500">
                        Segui le 3 fasi connesse: imposta le due frazioni, sincronizza i denominatori e unisci i numeratori in un'unica frazione!
                      </p>

                      {/* Bottoni Preset Rapidi */}
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {[
                          { label: "1/2 + 1/3", a: [1, 2], b: [1, 3] },
                          { label: "3/4 + 1/6", a: [3, 4], b: [1, 6] },
                          { label: "5/9 + 7/12", a: [5, 9], b: [7, 12] },
                          { label: "2/5 + 3/10", a: [2, 5], b: [3, 10] },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setOpNumA(preset.a[0]);
                              setOpDenA(preset.a[1]);
                              setOpNumB(preset.b[0]);
                              setOpDenB(preset.b[1]);
                              setOpSign("+");
                            }}
                            className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:border-dida-blue hover:text-dida-blue transition cursor-pointer shadow-xs"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* FASE 1: CAPSULA DELLE FRAZIONI INIZIALI */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-dida-blue uppercase tracking-wider">
                        <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">1</span>
                        <span>Fase 1 · Inserisci le due frazioni da sommare</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                        {/* Prima Frazione (Blue Capsule) */}
                        <div className="md:col-span-5 p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 shadow-xs flex flex-col items-center gap-3">
                          <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Prima Frazione</span>
                          <div className="flex flex-col items-center gap-1">
                            <input
                              type="number" min="1" max="30" value={opNumA}
                              onChange={(e) => setOpNumA(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-16 p-2 text-center rounded-xl border border-blue-300 font-mono font-bold text-xl bg-white text-blue-900 shadow-xs"
                            />
                            <div className="w-20 h-1.5 bg-blue-600 rounded-full my-0.5"></div>
                            <input
                              type="number" min="1" max="30" value={opDenA}
                              onChange={(e) => setOpDenA(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-16 p-2 text-center rounded-xl border border-blue-300 font-mono font-bold text-xl bg-white text-blue-900 shadow-xs"
                            />
                          </div>
                          {/* Mini visualizzatore barre */}
                          <div className="w-full bg-white/80 p-2 rounded-xl border border-blue-200 text-center">
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">Ripartizione ({opNumA}/{opDenA})</span>
                            <div className="flex h-4 gap-0.5 rounded overflow-hidden bg-slate-100 p-0.5 border border-slate-200">
                              {Array.from({ length: Math.min(opDenA, 24) }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`flex-1 rounded-xs ${i < opNumA ? "bg-blue-500" : "bg-transparent"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Operatore Centrale + */}
                        <div className="md:col-span-1 flex justify-center">
                          <div className="w-12 h-12 rounded-full bg-white border-2 border-blue-300 shadow-xs flex items-center justify-center font-mono font-black text-2xl text-blue-600">
                            +
                          </div>
                        </div>

                        {/* Seconda Frazione (Orange Capsule) */}
                        <div className="md:col-span-5 p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 shadow-xs flex flex-col items-center gap-3">
                          <span className="text-xs font-bold text-orange-800 uppercase tracking-wide">Seconda Frazione</span>
                          <div className="flex flex-col items-center gap-1">
                            <input
                              type="number" min="1" max="30" value={opNumB}
                              onChange={(e) => setOpNumB(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-16 p-2 text-center rounded-xl border border-orange-300 font-mono font-bold text-xl bg-white text-orange-900 shadow-xs"
                            />
                            <div className="w-20 h-1.5 bg-orange-500 rounded-full my-0.5"></div>
                            <input
                              type="number" min="1" max="30" value={opDenB}
                              onChange={(e) => setOpDenB(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-16 p-2 text-center rounded-xl border border-orange-300 font-mono font-bold text-xl bg-white text-orange-900 shadow-xs"
                            />
                          </div>
                          {/* Mini visualizzatore barre */}
                          <div className="w-full bg-white/80 p-2 rounded-xl border border-orange-200 text-center">
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">Ripartizione ({opNumB}/{opDenB})</span>
                            <div className="flex h-4 gap-0.5 rounded overflow-hidden bg-slate-100 p-0.5 border border-slate-200">
                              {Array.from({ length: Math.min(opDenB, 24) }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`flex-1 rounded-xs ${i < opNumB ? "bg-orange-500" : "bg-transparent"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FASE 2: IL PONTE DI SINCRONIZZAZIONE (m.c.m.) */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-wider">
                        <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">2</span>
                        <span>Fase 2 · Sincronizza i denominatori col minimo comune multiplo (m.c.m.)</span>
                      </div>
                      <div className="p-5 rounded-3xl bg-white border-2 border-orange-200 shadow-xs space-y-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-orange-100 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">Nuovo Denominatore Comune:</span>
                            <span className="px-3.5 py-1 rounded-xl bg-orange-100 text-orange-900 font-mono font-black text-base border border-orange-300">
                              m.c.m.({opDenA}, {opDenB}) = {addSubResult.lcm}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            Fattore scala: ({addSubResult.lcm}÷{opDenA} = {addSubResult.lcm / opDenA}) e ({addSubResult.lcm}÷{opDenB} = {addSubResult.lcm / opDenB})
                          </span>
                        </div>

                        {/* Equazioni di espansione sincronizzate */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Frac num={opNumA} den={opDenA} size="sm" />
                              <span className="text-xs text-blue-700 font-bold">× {addSubResult.lcm / opDenA} ➔</span>
                            </div>
                            <Frac num={addSubResult.scaledNumA} den={addSubResult.lcm} size="md" className="text-blue-900 bg-white px-3 py-1 rounded-xl border border-blue-200" />
                          </div>
                          <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Frac num={opNumB} den={opDenB} size="sm" />
                              <span className="text-xs text-orange-700 font-bold">× {addSubResult.lcm / opDenB} ➔</span>
                            </div>
                            <Frac num={addSubResult.scaledNumB} den={addSubResult.lcm} size="md" className="text-orange-900 bg-white px-3 py-1 rounded-xl border border-orange-200" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FASE 3: CAMERA DI FUSIONE DEI NUMERATORI & RISULTATO */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase tracking-wider">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
                        <span>Fase 3 · Calcola la somma su un'unica linea di frazione</span>
                      </div>
                      <div className="p-6 rounded-3xl bg-white border-2 border-emerald-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center flex-wrap justify-center gap-3 text-lg font-bold text-slate-800">
                          <Frac num={opNumA} den={opDenA} size="lg" />
                          <span>+</span>
                          <Frac num={opNumB} den={opDenB} size="lg" />
                          <span>=</span>
                          <Frac num={`${addSubResult.scaledNumA} + ${addSubResult.scaledNumB}`} den={addSubResult.lcm} size="lg" />
                          <span>=</span>
                          <Frac num={addSubResult.resNumRaw} den={addSubResult.lcm} size="lg" />
                        </div>

                        {/* Forziere Risultato Irriducibile */}
                        <div className="flex items-center gap-3 bg-emerald-50 px-5 py-3.5 rounded-2xl border-2 border-emerald-300">
                          <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                            {addSubResult.isSimp ? "Ridotta ai Minimi Termini:" : "Risultato Finale:"}
                          </span>
                          <Frac num={addSubResult.simpNum} den={addSubResult.simpDen} size="xl" className="text-emerald-700 font-black" />
                        </div>
                      </div>
                    </div>

                    {/* Scorciatoia Intero + Frazione */}
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                      <strong>SCORCIATOIA INTERO + FRAZIONE:</strong> Per calcolare ad esempio <span className="font-bold">3 + <Frac num={1} den={5} size="xs" /></span> fai semplicemente: <span className="font-bold">(3 × 5 + 1) / 5 = <Frac num={16} den={5} size="xs" /></span>! Il denominatore dell'intero è sempre 1 sottointeso.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: SOTTRAZIONE DI FRAZIONI (CALIBRO SOTTRATTIVO) */}
            {/* ======================================================== */}
            {selectedSubtopic === "fraction-subtraction" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Lezione Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-200/80 shadow-xs">
                      Lezione 1b · Togliere da una frazione
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      La Sottrazione tra Frazioni & il Taglio dei Resti
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Sottrarre significa calcolare la <strong>differenza</strong> o asportare una parte da una quantità iniziale. Anche qui, prima di tagliare dobbiamo avere lo <strong>stesso denominatore (m.c.m.)</strong>!
                    </p>
                  </div>

                  {/* Teoria Sottrazione a Confronto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        1 · STESSO DENOMINATORE
                      </span>
                      <h3 className="text-xl font-black text-slate-800">7 ottavi − 3 ottavi = 4 ottavi</h3>
                      <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                        <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                          <Frac num={7} den={8} size="sm" /> − <Frac num={3} den={8} size="sm" /> = <Frac num={4} den={8} size="sm" /> = <Frac num={1} den={2} size="sm" />
                        </div>
                        <p>Si sottraggono solo i numeratori (7 − 3 = 4), il denominatore (8) rimane invariato!</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        2 · DENOMINATORI DIVERSI
                      </span>
                      <h3 className="text-xl font-black text-slate-800 flex items-center gap-1">
                        <Frac num={3} den={4} size="md" /> − <Frac num={1} den={3} size="md" />
                      </h3>
                      <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                        <p>m.c.m.(4, 3) = 12</p>
                        <div className="flex items-center gap-1">
                          <Frac num={9} den={12} size="xs" /> − <Frac num={4} den={12} size="xs" /> = <Frac num={5} den={12} size="sm" />!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LABORATORIO 2: CALIBRO SOTTRATTIVO & RIGHELLO DEI RESTI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio Interattivo · Righello Sottrattivo
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Sottrazione tra Frazioni: Il Calibro dei Resti
                      </h3>
                      <p className="text-xs text-slate-500">
                        Visualizza la grandezza iniziale (Minuendo), asporta la parte sottratta e scopri il resto tagliato in parti uguali!
                      </p>

                      {/* Bottoni Preset Rapidi */}
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {[
                          { label: "3/4 − 1/3", a: [3, 4], b: [1, 3] },
                          { label: "5/6 − 1/2", a: [5, 6], b: [1, 2] },
                          { label: "7/8 − 1/4", a: [7, 8], b: [1, 4] },
                          { label: "1 − 2/5", a: [5, 5], b: [2, 5] },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSubNumA(preset.a[0]);
                              setSubDenA(preset.a[1]);
                              setSubNumB(preset.b[0]);
                              setSubDenB(preset.b[1]);
                            }}
                            className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:border-dida-orange hover:text-dida-orange transition cursor-pointer shadow-xs"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cockpit Ingressi a Calibro */}
                    <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                      {/* Minuendo (Blue Pod) */}
                      <div className="md:col-span-5 p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 shadow-xs flex flex-col items-center gap-2">
                        <span className="text-xs font-black uppercase text-blue-700">Minuendo (Ciò che hai)</span>
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="number" min="1" max="30" value={subNumA}
                            onChange={(e) => setSubNumA(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-2 text-center rounded-xl border border-blue-300 font-mono font-bold text-xl bg-white text-blue-900 shadow-xs"
                          />
                          <div className="w-20 h-1.5 bg-blue-600 rounded-full my-0.5"></div>
                          <input
                            type="number" min="1" max="30" value={subDenA}
                            onChange={(e) => setSubDenA(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-2 text-center rounded-xl border border-blue-300 font-mono font-bold text-xl bg-white text-blue-900 shadow-xs"
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono font-bold">Valore: {subResult.valA.toFixed(2)}</span>
                      </div>

                      {/* Segno Meno */}
                      <div className="md:col-span-1 flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-orange-300 shadow-xs flex items-center justify-center font-mono font-black text-2xl text-orange-600">
                          −
                        </div>
                      </div>

                      {/* Sottraendo (Orange Pod) */}
                      <div className="md:col-span-5 p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 shadow-xs flex flex-col items-center gap-2">
                        <span className="text-xs font-black uppercase text-orange-700">Sottraendo (Ciò che togli)</span>
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="number" min="1" max="30" value={subNumB}
                            onChange={(e) => setSubNumB(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-2 text-center rounded-xl border border-orange-300 font-mono font-bold text-xl bg-white text-orange-900 shadow-xs"
                          />
                          <div className="w-20 h-1.5 bg-orange-500 rounded-full my-0.5"></div>
                          <input
                            type="number" min="1" max="30" value={subDenB}
                            onChange={(e) => setSubDenB(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-2 text-center rounded-xl border border-orange-300 font-mono font-bold text-xl bg-white text-orange-900 shadow-xs"
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono font-bold">Valore: {subResult.valB.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* IL RIGHELLO DEI RESTI (CALIBRO VISIVO) */}
                    <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xs space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>Righello di Confronto e Asportazione</span>
                        <span className="text-orange-600 font-mono">m.c.m.({subDenA}, {subDenB}) = {subResult.lcm} fette uguali</span>
                      </div>

                      {/* Barra Grafica a Calibro */}
                      <div className="space-y-3">
                        {/* Barra Minuendo A */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-blue-800">
                            <span>Quantità Iniziale (Minuendo): <Frac num={subNumA} den={subDenA} size="xs" /> = <Frac num={subResult.scaledNumA} den={subResult.lcm} size="xs" /></span>
                            <span>{subResult.scaledNumA} fette su {subResult.lcm}</span>
                          </div>
                          <div className="w-full h-8 bg-slate-100 rounded-xl p-1 flex gap-0.5 border border-slate-200">
                            {Array.from({ length: Math.min(subResult.lcm, 30) }).map((_, i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-xs transition-all ${
                                  i < subResult.scaledNumA ? "bg-blue-500" : "bg-transparent"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Barra Sottraendo B con Taglio Forbici */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-orange-800">
                            <span>Parte Asportata (Sottraendo): <Frac num={subNumB} den={subDenB} size="xs" /> = <Frac num={subResult.scaledNumB} den={subResult.lcm} size="xs" /></span>
                            <span>✂ {subResult.scaledNumB} fette rimosse</span>
                          </div>
                          <div className="w-full h-8 bg-slate-100 rounded-xl p-1 flex gap-0.5 border border-slate-200">
                            {Array.from({ length: Math.min(subResult.lcm, 30) }).map((_, i) => {
                              const isSubtracted = i < subResult.scaledNumB;
                              const isRemaining = i >= subResult.scaledNumB && i < subResult.scaledNumA;
                              return (
                                <div
                                  key={i}
                                  className={`flex-1 rounded-xs flex items-center justify-center text-[9px] font-bold text-white transition-all ${
                                    isSubtracted
                                      ? "bg-orange-400 opacity-60"
                                      : isRemaining
                                      ? "bg-emerald-500 shadow-xs"
                                      : "bg-transparent"
                                  }`}
                                >
                                  {isSubtracted && "✕"}
                                  {isRemaining && "✓"}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Notifica Resto */}
                      {subResult.isNegative ? (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold text-center">
                          ⚠️ Attenzione: il sottraendo è maggiore del minuendo! Nelle frazioni tra numeri naturali la differenza risulterebbe negativa ({subResult.resNumRaw}/{subResult.lcm}).
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                            <Frac num={subNumA} den={subDenA} size="md" />
                            <span>−</span>
                            <Frac num={subNumB} den={subDenB} size="md" />
                            <span>=</span>
                            <Frac num={`${subResult.scaledNumA} − ${subResult.scaledNumB}`} den={subResult.lcm} size="md" />
                            <span>=</span>
                            <Frac num={subResult.resNumRaw} den={subResult.lcm} size="md" />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">Resto Finale:</span>
                            <Frac num={subResult.simpNum} den={subResult.simpDen} size="xl" className="text-emerald-700 bg-white px-4 py-1.5 rounded-xl border border-emerald-200 font-black" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Scorciatoia 1 - frazione */}
                    <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950 leading-relaxed">
                      <strong>SCORCIATOIA 1 INTERO − FRAZIONE:</strong> Per togliere una frazione da 1 intero (es. <span className="font-bold">1 − <Frac num={3} den={7} size="xs" /></span>), pensa l'intero come <Frac num={7} den={7} size="xs" />: basta fare <span className="font-bold">(7 − 3) / 7 = <Frac num={4} den={7} size="xs" /></span>!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: MOLTIPLICAZIONE (BANCO A MATRICE INCROCIATA 2D) */}
            {/* ======================================================== */}
            {selectedSubtopic === "fraction-multiplication" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Lezione Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 2 · La frazione di una frazione
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Moltiplicazione & Semplificazione a Croce
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      In matematica <strong>"di" vuol dire "per (×)"</strong>! Esempio: un operaio ha piastrellato i <Frac num={3} den={4} size="xs" /> della metà (<Frac num={1} den={2} size="xs" />) di una stanza ➔ <span className="font-bold text-blue-700"><Frac num={3} den={4} size="xs" /> × <Frac num={1} den={2} size="xs" /> = <Frac num={3} den={8} size="xs" /></span>.
                    </p>
                  </div>

                  {/* Teoria Regole & Semplificazione a Croce */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        LA REGOLA BASE
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Numeratore × Numeratore, Denominatore × Denominatore</h3>
                      <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <Frac num="a" den="b" size="xs" /> × <Frac num="c" den="d" size="xs" /> = <Frac num="a × c" den="b × d" size="xs" />
                        </div>
                        <div className="flex items-center gap-1 font-bold text-blue-800 pt-1">
                          <Frac num={3} den={4} size="xs" /> × 8 = <Frac num="3 × 8" den="4" size="xs" /> = <Frac num={24} den={4} size="xs" /> = 6!
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        IL TRUCCO: A CROCE!
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Prima Semplifico, poi Moltiplico</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Posso semplificare un numeratore con un denominatore incrociato, <strong>anche di frazioni diverse</strong>! I numeri diventano piccoli subito e il risultato è già irriducibile. Vale solo nella moltiplicazione!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 3: STUDIO A MATRICE INCROCIATA 2D */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Dinamico · Matrice 2D & Semplificazione a Croce
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Moltiplicazione Guidata con Semplificazione a Croce
                      </h3>
                      <p className="text-xs text-slate-500">
                        Esplora l'intersezione bidimensionale delle due frazioni e osserva i fasci diagonali della semplificazione a croce!
                      </p>

                      {/* Bottoni Presets */}
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {[
                          { label: "2/3 × 3/5", a: [2, 3], b: [3, 5] },
                          { label: "3/4 × 8/9", a: [3, 4], b: [8, 9] },
                          { label: "5/6 × 2/5", a: [5, 6], b: [2, 5] },
                          { label: "4/7 × 7/8", a: [4, 7], b: [7, 8] },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setMultNumA(preset.a[0]);
                              setMultDenA(preset.a[1]);
                              setMultNumB(preset.b[0]);
                              setMultDenB(preset.b[1]);
                            }}
                            className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:border-dida-blue hover:text-dida-blue transition cursor-pointer shadow-xs"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ASYMMETRIC 2-ZONE STUDIO */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                      {/* ZONA 1 (5/12): GRIGLIA GEOMETRICA 2D (LA PIASTRELLA) */}
                      <div className="lg:col-span-5 p-6 rounded-3xl bg-blue-50/60 border-2 border-blue-200 flex flex-col justify-between space-y-4 shadow-xs">
                        <div className="flex justify-between items-center border-b border-blue-200/60 pb-2">
                          <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                            1. Area Rettangolare 2D
                          </span>
                          <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                            {multNumA}/{multDenA} di {multNumB}/{multDenB}
                          </span>
                        </div>

                        {/* Visual Griglia Rettangolare */}
                        <div className="bg-white p-4 rounded-2xl border border-blue-200 flex flex-col items-center justify-center">
                          <div
                            className="grid gap-1 p-2 bg-slate-50 rounded-xl border border-slate-200"
                            style={{
                              gridTemplateColumns: `repeat(${multDenA}, minmax(0, 1fr))`,
                              gridTemplateRows: `repeat(${multDenB}, minmax(0, 1fr))`,
                              width: "100%",
                              maxWidth: "240px",
                              aspectRatio: "1/1",
                            }}
                          >
                            {Array.from({ length: multDenB }).map((_, r) =>
                              Array.from({ length: multDenA }).map((_, c) => {
                                const inA = c < multNumA;
                                const inB = r < multNumB;
                                const inBoth = inA && inB;

                                return (
                                  <div
                                    key={`${r}-${c}`}
                                    className={`rounded-xs transition-all ${
                                      inBoth
                                        ? "bg-gradient-to-br from-blue-600 to-orange-500 shadow-xs"
                                        : inA
                                        ? "bg-blue-200/80"
                                        : inB
                                        ? "bg-orange-200/80"
                                        : "bg-slate-200/50"
                                    }`}
                                  />
                                );
                              })
                            )}
                          </div>
                          <div className="flex justify-around w-full pt-3 text-[11px] font-mono font-bold text-slate-600">
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-xs bg-blue-300"></span> 1ª Frazione
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-xs bg-orange-300"></span> 2ª Frazione
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-xs bg-gradient-to-r from-blue-600 to-orange-500"></span> Prodotto ({multNumA * multNumB})
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                          La zona sovrapposta a due colori mostra esattamente <strong>{multNumA * multNumB} caselle</strong> su <strong>{multDenA * multDenB} totali</strong>.
                        </p>
                      </div>

                      {/* ZONA 2 (7/12): IL BANCO DELLA SEMPLIFICAZIONE A CROCE */}
                      <div className="lg:col-span-7 p-6 rounded-3xl bg-orange-50/50 border-2 border-orange-200 flex flex-col justify-between space-y-4 shadow-xs">
                        <div className="flex justify-between items-center border-b border-orange-200/60 pb-2">
                          <span className="text-xs font-black uppercase text-orange-900 tracking-wider">
                            2. Banco a Croce & Risultato
                          </span>
                          <span className="text-[11px] font-bold text-orange-700 bg-white px-2 py-0.5 rounded-full border border-orange-200">
                            Calcolo Ottimizzato
                          </span>
                        </div>

                        {/* Input Frazioni con Fasci Incrociati */}
                        <div className="bg-white p-5 rounded-2xl border border-orange-200 space-y-4">
                          <div className="flex items-center justify-around gap-4">
                            {/* Frazione 1 */}
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] text-blue-700 uppercase font-black">1ª Frazione</span>
                              <div className="relative">
                                <input
                                  type="number" min="1" max="50" value={multNumA}
                                  onChange={(e) => setMultNumA(Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-16 p-1.5 text-center rounded-xl border border-blue-300 font-mono font-bold text-lg bg-blue-50/50 text-blue-900"
                                />
                                {multResult.crossGcd1 > 1 && (
                                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full shadow-xs">
                                    ➔ {multResult.simpNumA}
                                  </span>
                                )}
                              </div>
                              <div className="w-16 h-1 bg-slate-800 rounded-full my-0.5"></div>
                              <div className="relative">
                                <input
                                  type="number" min="1" max="50" value={multDenA}
                                  onChange={(e) => setMultDenA(Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-16 p-1.5 text-center rounded-xl border border-blue-300 font-mono font-bold text-lg bg-blue-50/50 text-blue-900"
                                />
                                {multResult.crossGcd2 > 1 && (
                                  <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full shadow-xs">
                                    ➔ {multResult.simpDenA}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Simbolo Moltiplicazione */}
                            <span className="text-3xl font-black text-orange-500">×</span>

                            {/* Frazione 2 */}
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] text-orange-700 uppercase font-black">2ª Frazione</span>
                              <div className="relative">
                                <input
                                  type="number" min="1" max="50" value={multNumB}
                                  onChange={(e) => setMultNumB(Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-16 p-1.5 text-center rounded-xl border border-orange-300 font-mono font-bold text-lg bg-orange-50/50 text-orange-900"
                                />
                                {multResult.crossGcd2 > 1 && (
                                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full shadow-xs">
                                    ➔ {multResult.simpNumB}
                                  </span>
                                )}
                              </div>
                              <div className="w-16 h-1 bg-slate-800 rounded-full my-0.5"></div>
                              <div className="relative">
                                <input
                                  type="number" min="1" max="50" value={multDenB}
                                  onChange={(e) => setMultDenB(Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-16 p-1.5 text-center rounded-xl border border-orange-300 font-mono font-bold text-lg bg-orange-50/50 text-orange-900"
                                />
                                {multResult.crossGcd1 > 1 && (
                                  <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full shadow-xs">
                                    ➔ {multResult.simpDenB}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Dossier Semplificazioni Diagonali */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Diagonale 1 ({multNumA} ✕ {multDenB}):</span>
                              <strong className={multResult.crossGcd1 > 1 ? "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200" : "text-slate-400"}>
                                {multResult.crossGcd1 > 1 ? `M.C.D. = ${multResult.crossGcd1} (divido per ${multResult.crossGcd1})` : "Nessuna semplificazione"}
                              </strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Diagonale 2 ({multNumB} ✕ {multDenA}):</span>
                              <strong className={multResult.crossGcd2 > 1 ? "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200" : "text-slate-400"}>
                                {multResult.crossGcd2 > 1 ? `M.C.D. = ${multResult.crossGcd2} (divido per ${multResult.crossGcd2})` : "Nessuna semplificazione"}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Risultato Diretto */}
                        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between">
                          <div className="text-xs text-slate-600">
                            <span>Senza semplificare: <Frac num={multResult.rawNum} den={multResult.rawDen} size="xs" /></span>
                            <span className="block font-bold text-emerald-800">Con la croce ➔ subito irriducibile!</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Frac num={multResult.finalNum} den={multResult.finalDen} size="xl" className="text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-xl border-2 border-emerald-300 font-black" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: LA DIVISIONE (TEATRO DELLA FRAZIONE INVERSA) */}
            {/* ======================================================== */}
            {selectedSubtopic === "fraction-division" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Lezione Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-200/80 shadow-xs">
                      Lezione 2b · Moltiplico per l'inversa
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      La Divisione tra Frazioni: Quante Volte Ci Sta?
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Dividere per una frazione significa chiedersi: <em>"quante volte ci sta questa frazione nell'intero?"</em>. Ad esempio, 3 pizze divise in fette da <Frac num={1} den={4} size="xs" /> ci danno <span className="font-bold text-blue-700">3 : <Frac num={1} den={4} size="xs" /> = 3 × 4 = 12 fette</span>!
                    </p>
                  </div>

                  {/* La Regola dei 3 Passi */}
                  <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
                    <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                      LA REGOLA D'ORO DEI 3 PASSI
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm pt-2">
                      <div className="p-4 bg-white rounded-2xl border border-orange-200 text-center flex flex-col items-center gap-1">
                        <strong className="text-slate-800 block text-xs">1. La Prima Resta Identica</strong>
                        <Frac num={divNumA} den={divDenA} size="md" className="text-blue-700" />
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-orange-200 text-center flex flex-col items-center justify-center gap-1">
                        <strong className="text-slate-800 block text-xs">2. Il (:) Diventa (×)</strong>
                        <span className="text-orange-600 font-bold text-2xl font-mono">×</span>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-orange-200 text-center flex flex-col items-center gap-1">
                        <strong className="text-slate-800 block text-xs">3. La Seconda si CAPOVOLGE</strong>
                        <Frac num={divDenB} den={divNumB} size="md" className="text-emerald-700 font-bold" />
                      </div>
                    </div>
                  </div>

                  {/* LABORATORIO 4: TEATRO DELLA FRAZIONE INVERSA */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio Interattivo · Teatro della Frazione Inversa
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Capovolgi la Seconda Frazione e Calcola
                      </h3>
                      <p className="text-xs text-slate-500">
                        Premi il pulsante per attivare la "Capovolta" e osservare la trasformazione istantanea da divisione a moltiplicazione!
                      </p>

                      {/* Bottoni Presets */}
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {[
                          { label: "9/16 : 3/8", a: [9, 16], b: [3, 8] },
                          { label: "3/4 : 1/2", a: [3, 4], b: [1, 2] },
                          { label: "5/6 : 5/12", a: [5, 6], b: [5, 12] },
                          { label: "2/3 : 4/9", a: [2, 3], b: [4, 9] },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setDivNumA(preset.a[0]);
                              setDivDenA(preset.a[1]);
                              setDivNumB(preset.b[0]);
                              setDivDenB(preset.b[1]);
                              setDivFlipped(false);
                            }}
                            className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:border-dida-orange hover:text-dida-orange transition cursor-pointer shadow-xs"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* PALCOSCENICO DELLA CAPOVOLTA */}
                    <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                      {/* Frazione A (Dividendo su piedistallo blu) */}
                      <div className="md:col-span-4 p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 flex flex-col items-center gap-2 shadow-xs">
                        <span className="text-xs font-bold text-blue-800 uppercase">Dividendo (1ª Frazione)</span>
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="number" min="1" max="50" value={divNumA}
                            onChange={(e) => setDivNumA(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-2 text-center rounded-xl border border-blue-300 font-mono font-bold text-xl bg-white text-blue-900"
                          />
                          <div className="w-20 h-1.5 bg-blue-600 rounded-full my-0.5"></div>
                          <input
                            type="number" min="1" max="50" value={divDenA}
                            onChange={(e) => setDivDenA(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-2 text-center rounded-xl border border-blue-300 font-mono font-bold text-xl bg-white text-blue-900"
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">Resta invariata</span>
                      </div>

                      {/* Nodo Operatore Interattivo ( : vs × ) */}
                      <div className="md:col-span-3 flex flex-col items-center gap-2">
                        <motion.div
                          animate={{ rotate: divFlipped ? 180 : 0 }}
                          className="w-14 h-14 rounded-2xl bg-white border-2 border-orange-300 shadow-md flex items-center justify-center font-mono font-black text-2xl text-orange-600"
                        >
                          {divFlipped ? "×" : ":"}
                        </motion.div>
                        <button
                          onClick={() => setDivFlipped(!divFlipped)}
                          className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw size={13} className={divFlipped ? "rotate-180" : ""} />
                          {divFlipped ? "Ripristina (:)" : "Capovolgi! (×)"}
                        </button>
                      </div>

                      {/* Frazione B (Kinetic Card Divisore) */}
                      <motion.div
                        animate={{ scale: divFlipped ? [1, 1.05, 1] : 1 }}
                        className={`md:col-span-4 p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 shadow-xs ${
                          divFlipped ? "bg-emerald-50/70 border-emerald-300" : "bg-orange-50/70 border-orange-200"
                        }`}
                      >
                        <span className="text-xs font-bold uppercase text-slate-700">
                          {divFlipped ? "Frazione Inversa / Reciproca" : "Divisore (2ª Frazione)"}
                        </span>
                        <div className="flex flex-col items-center gap-1 font-mono font-bold text-xl">
                          <div className={`w-16 p-2 text-center rounded-xl border shadow-xs transition-colors ${
                            divFlipped ? "bg-emerald-100 text-emerald-900 border-emerald-300" : "bg-white text-orange-900 border-orange-300"
                          }`}>
                            {divFlipped ? divDenB : divNumB}
                          </div>
                          <div className={`w-20 h-1.5 rounded-full my-0.5 ${divFlipped ? "bg-emerald-600" : "bg-orange-500"}`}></div>
                          <div className={`w-16 p-2 text-center rounded-xl border shadow-xs transition-colors ${
                            divFlipped ? "bg-emerald-100 text-emerald-900 border-emerald-300" : "bg-white text-orange-900 border-orange-300"
                          }`}>
                            {divFlipped ? divNumB : divDenB}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">
                          {divFlipped ? "Numeratore e Denominatore scambiati!" : "In attesa di capovolta..."}
                        </span>
                      </motion.div>
                    </div>

                    {/* Banner Prodotto Inverso = 1 */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="font-bold text-orange-700">Proprietà delle Frazioni Reciproche:</span>
                        <span><Frac num={divNumB} den={divDenB} size="xs" /> × <Frac num={divDenB} den={divNumB} size="xs" /> = 1 intero sempre!</span>
                      </div>
                      <span className="text-slate-500 font-sans">
                        La moltiplicazione per l'inversa annulla la divisione.
                      </span>
                    </div>

                    {/* Risoluzione Guidata */}
                    <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-xs space-y-3">
                      <span className="text-xs font-black uppercase text-slate-500 tracking-wider block text-center">
                        Passaggi di Calcolo in Riga:
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-3 text-lg font-bold text-slate-800">
                        <Frac num={divNumA} den={divDenA} size="lg" />
                        <span className="text-orange-500 font-mono">:</span>
                        <Frac num={divNumB} den={divDenB} size="lg" />
                        <span>=</span>
                        <Frac num={divNumA} den={divDenA} size="lg" />
                        <span className="text-emerald-600 font-mono">×</span>
                        <Frac num={divResult.invNum} den={divResult.invDen} size="lg" className="text-emerald-700" />
                        <span>=</span>
                        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-2xl border-2 border-emerald-300">
                          <Frac num={divResult.finalNum} den={divResult.finalDen} size="xl" className="text-emerald-700 font-black" />
                          <CheckCircle2 size={20} className="text-emerald-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: POTENZE ED ESPRESSIONI (PODIO ESPONENZIALE) */}
            {/* ======================================================== */}
            {selectedSubtopic === "fraction-power" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Lezione Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 3 · L'ordine giusto per non perdersi
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      La Potenza di una Frazione & Le Espressioni
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Per elevare a potenza una frazione, <strong>si elevano sia il numeratore sia il denominatore</strong>: <span className="font-bold">(<Frac num="a" den="b" size="xs" />)ⁿ = <Frac num="aⁿ" den="bⁿ" size="xs" /></span>. Attenzione: le parentesi sono fondamentali!
                    </p>
                  </div>

                  {/* Teoria Parentesi a Confronto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 space-y-2">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        CON LE PARENTESI
                      </span>
                      <div className="text-lg font-black text-blue-900 flex items-center gap-2">
                        <span>(<Frac num={5} den={3} size="md" />)² =</span>
                        <Frac num="5²" den="3²" size="md" />
                        <span>=</span>
                        <Frac num={25} den={9} size="md" />
                      </div>
                      <p className="text-xs text-slate-600">L'esponente 2 si applica sia al 5 sia al 3!</p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50 border-2 border-orange-200 space-y-2">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        SENZA PARENTESI
                      </span>
                      <div className="text-lg font-black text-orange-900 flex items-center gap-2">
                        <Frac num="5²" den={3} size="md" />
                        <span>=</span>
                        <Frac num={25} den={3} size="md" />
                      </div>
                      <p className="text-xs text-slate-600">L'esponente vale solo per il numeratore sopra!</p>
                    </div>
                  </div>

                  {/* LABORATORIO 5: PODIO ESPONENZIALE & ALBERO PRECEDENZE */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Podio Esponenziale
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Reattore di Potenze di Frazione
                      </h3>
                      <p className="text-xs text-slate-500">
                        Regola la frazione di base e l'esponente, e alterna tra "con parentesi" e "senza parentesi" per vedere la differenza!
                      </p>

                      {/* Switch Con / Senza Parentesi */}
                      <div className="flex bg-white p-1 rounded-2xl border border-slate-300 mt-2 shadow-xs">
                        <button
                          onClick={() => setPowWithParentheses(true)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            powWithParentheses ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          ( a / b )ⁿ CON Parentesi
                        </button>
                        <button
                          onClick={() => setPowWithParentheses(false)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            !powWithParentheses ? "bg-orange-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          aⁿ / b SENZA Parentesi
                        </button>
                      </div>
                    </div>

                    {/* LIVELLO 1: IL PODIO ESPONENZIALE */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Controlli Base ed Esponente (5/12) */}
                      <div className="md:col-span-5 p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 shadow-xs space-y-4">
                        <span className="text-xs font-black uppercase text-blue-900 block border-b border-blue-200 pb-2">
                          1. Imposta Base ed Esponente
                        </span>
                        <div className="flex items-center justify-around">
                          {/* Frazione Base */}
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-slate-500 font-bold">Base</span>
                            <input
                              type="number" min="1" max="10" value={powBaseNum}
                              onChange={(e) => setPowBaseNum(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-14 p-1.5 text-center rounded-xl border border-blue-300 font-mono font-bold text-lg bg-white"
                            />
                            <div className="w-16 h-1 bg-slate-800 rounded-full my-0.5"></div>
                            <input
                              type="number" min="1" max="10" value={powBaseDen}
                              onChange={(e) => setPowBaseDen(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-14 p-1.5 text-center rounded-xl border border-blue-300 font-mono font-bold text-lg bg-white"
                            />
                          </div>

                          {/* Esponente */}
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-orange-600 font-bold">Esponente (n)</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map((exp) => (
                                <button
                                  key={exp}
                                  onClick={() => setPowExp(exp)}
                                  className={`w-9 h-9 rounded-xl font-mono font-black text-sm transition cursor-pointer border ${
                                    powExp === exp
                                      ? "bg-orange-500 text-white border-orange-500 shadow-xs scale-105"
                                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                  }`}
                                >
                                  {exp}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Podio Risultato con Catena Moltiplicativa (7/12) */}
                      <div className="md:col-span-7 p-6 rounded-3xl bg-white border-2 border-orange-200 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700 border-b border-orange-100 pb-2">
                          <span>Catena di Moltiplicazione Ripetuta:</span>
                          <span className={powWithParentheses ? "text-blue-700 font-mono" : "text-orange-700 font-mono"}>
                            {powWithParentheses ? "Elevamento di numeratore e denominatore" : "Elevamento del solo numeratore"}
                          </span>
                        </div>

                        {/* Catena Visiva */}
                        <div className="flex flex-wrap items-center justify-center gap-2 text-base font-bold text-slate-800">
                          {powWithParentheses ? (
                            <>
                              <span>( <Frac num={powBaseNum} den={powBaseDen} size="md" /> )<sup>{powExp}</sup> =</span>
                              <Frac num={`${powBaseNum}<sup>${powExp}</sup>`} den={`${powBaseDen}<sup>${powExp}</sup>`} size="md" />
                              <span>=</span>
                              <Frac num={powResult.numPow} den={powResult.denPow} size="xl" className="text-blue-700 bg-blue-50 px-4 py-2 rounded-2xl border-2 border-blue-300 font-black" />
                            </>
                          ) : (
                            <>
                              <Frac num={`${powBaseNum}<sup>${powExp}</sup>`} den={powBaseDen} size="md" />
                              <span>=</span>
                              <Frac num={powResult.numPow} den={powBaseDen} size="xl" className="text-orange-700 bg-orange-50 px-4 py-2 rounded-2xl border-2 border-orange-300 font-black" />
                            </>
                          )}
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 text-center">
                          {powWithParentheses
                            ? `Moltiplico la frazione per se stessa ${powExp} volte: (${powBaseNum}/${powBaseDen}) × ...`
                            : `Il denominatore (${powBaseDen}) non viene toccato perché è fuori dalla potenza!`}
                        </div>
                      </div>
                    </div>

                    {/* LIVELLO 2: ALBERO DELLE PRECEDENZE (ESPRESSIONE GUIDATA SLIDE 19) */}
                    <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xs space-y-5">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-3">
                        <div>
                          <span className="text-xs font-black uppercase text-dida-blue tracking-wider block">
                            Risolutore Interattivo di Espressione
                          </span>
                          <h4 className="text-base font-bold text-slate-800">
                            Espressione Guidata (dalla Slide 19 del Ministero)
                          </h4>
                        </div>

                        {/* Controlli Stepper Espressione */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExprStep(Math.max(0, exprStep - 1))}
                            disabled={exprStep === 0}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 disabled:opacity-40 cursor-pointer hover:bg-slate-200"
                          >
                            ◀ Passo Indietro
                          </button>
                          <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-xs font-black text-blue-800 font-mono">
                            Passo {exprStep} / 4
                          </span>
                          <button
                            onClick={() => setExprStep(Math.min(4, exprStep + 1))}
                            disabled={exprStep === 4}
                            className="px-3 py-1.5 rounded-xl bg-dida-blue text-white text-xs font-bold disabled:opacity-40 cursor-pointer shadow-xs hover:bg-blue-700"
                          >
                            Passo Successivo ▶
                          </button>
                        </div>
                      </div>

                      {/* Display Espressione Dinamica */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-sans text-xs md:text-sm">
                        <div className={`p-3 rounded-xl border transition-all ${
                          exprStep === 0 ? "bg-blue-50 border-blue-300 shadow-xs" : "bg-white border-slate-200 opacity-80"
                        }`}>
                          <strong className="text-slate-700 block mb-1">Passo 0 · Espressione iniziale:</strong>
                          <div className="flex items-center flex-wrap gap-2 text-base font-bold">
                            <Frac num={10} den={15} size="sm" /> × (<Frac num={1} den={2} size="sm" />)² + <Frac num={1} den={3} size="sm" /> : <Frac num={4} den={15} size="sm" /> − 1
                          </div>
                        </div>

                        {exprStep >= 1 && (
                          <div className={`p-3 rounded-xl border transition-all ${
                            exprStep === 1 ? "bg-blue-50 border-blue-300 shadow-xs" : "bg-white border-slate-200 opacity-80"
                          }`}>
                            <strong className="text-blue-800 block mb-1">Passo 1 · Semplifico 10/15 in 2/3 e calcolo la potenza (1/2)²:</strong>
                            <div className="flex items-center flex-wrap gap-2 text-base font-bold">
                              = <Frac num={2} den={3} size="sm" /> × <Frac num={1} den={4} size="sm" /> + <Frac num={1} den={3} size="sm" /> : <Frac num={4} den={15} size="sm" /> − 1
                            </div>
                          </div>
                        )}

                        {exprStep >= 2 && (
                          <div className={`p-3 rounded-xl border transition-all ${
                            exprStep === 2 ? "bg-orange-50 border-orange-300 shadow-xs" : "bg-white border-slate-200 opacity-80"
                          }`}>
                            <strong className="text-orange-800 block mb-1">Passo 2 · Trasformo la divisione in moltiplicazione per l'inversa:</strong>
                            <div className="flex items-center flex-wrap gap-2 text-base font-bold">
                              = <Frac num={2} den={3} size="sm" /> × <Frac num={1} den={4} size="sm" /> + <Frac num={1} den={3} size="sm" /> × <Frac num={15} den={4} size="sm" className="text-orange-700" /> − 1
                            </div>
                          </div>
                        )}

                        {exprStep >= 3 && (
                          <div className={`p-3 rounded-xl border transition-all ${
                            exprStep === 3 ? "bg-blue-50 border-blue-300 shadow-xs" : "bg-white border-slate-200 opacity-80"
                          }`}>
                            <strong className="text-blue-800 block mb-1">Passo 3 · Eseguo le moltiplicazioni con semplificazione a croce:</strong>
                            <div className="flex items-center flex-wrap gap-2 text-base font-bold">
                              = <Frac num={1} den={6} size="sm" /> + <Frac num={5} den={4} size="sm" /> − 1
                            </div>
                          </div>
                        )}

                        {exprStep >= 4 && (
                          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 shadow-xs space-y-1">
                            <strong className="block text-emerald-800">Passo 4 · Minimo comune denominatore m.c.m.(6, 4, 1) = 12 e risultato:</strong>
                            <div className="flex items-center flex-wrap gap-2 text-lg font-black text-slate-800">
                              = <Frac num="2 + 15 − 12" den={12} size="md" /> = <Frac num={5} den={12} size="xl" className="text-emerald-700" /> ✓ (Risultato finale ai minimi termini!)
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 6: PROBLEMI CON I SEGMENTI (BANCO TECNICO DEI SEGMENTI) */}
            {/* ======================================================== */}
            {selectedSubtopic === "fraction-segments" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Lezione Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-orange bg-orange-50 px-4 py-1.5 rounded-full border border-orange-200/80 shadow-xs">
                      Lezione 4 · Somma o differenza e una frazione
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      I Problemi con i Segmenti: Somma o Differenza
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Quando conosciamo la <strong>somma</strong> o la <strong>differenza</strong> di due grandezze e il loro rapporto di frazione, il trucco infallibile è disegnare i <strong>segmentini uguali (le parti unitarie)</strong>!
                    </p>
                  </div>

                  {/* Le 2 Strategie a Confronto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        CONOSCO LA SOMMA
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Sommo i termini della frazione</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Gerardo spende 84 € per felpa e jeans. La felpa è <Frac num={2} den={5} size="xs" /> dei jeans: <br />
                        Parti totali: 2 + 5 = <strong>7 parti uguali</strong>. <br />
                        1 parte = 84 : 7 = <strong>12 €</strong>. <br />
                        Felpa = 12 × 2 = 24 € · Jeans = 12 × 5 = 60 €!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        CONOSCO LA DIFFERENZA
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Sottraggo i termini della frazione</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        In gita le ragazze sono 12 in più dei ragazzi (<Frac num={7} den={4} size="xs" /> dei ragazzi): <br />
                        Parti di differenza: 7 − 4 = <strong>3 parti uguali = 12</strong>. <br />
                        1 parte = 12 : 3 = <strong>4</strong>. <br />
                        Ragazze = 4 × 7 = 28 · Ragazzi = 4 × 4 = 16!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 6: ARCHIMEDES TECHNICAL DRAFTING BENCH */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio di Geometria · Banco Tecnico dei Segmenti
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Banco da Disegno Tecnico dei Segmenti
                      </h3>
                      <p className="text-xs text-slate-500">
                        Imposta la modalità e i dati del problema: i segmentini unitari si disegnano e si quotano in tempo reale!
                      </p>

                      {/* Modalità Somma vs Differenza */}
                      <div className="flex bg-white p-1 rounded-2xl border border-slate-300 mt-2 shadow-xs">
                        <button
                          onClick={() => setSegMode("somma")}
                          className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            segMode === "somma" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Modalità SOMMA (A + B)
                        </button>
                        <button
                          onClick={() => setSegMode("differenza")}
                          className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            segMode === "differenza" ? "bg-orange-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Modalità DIFFERENZA (B − A)
                        </button>
                      </div>

                      {/* Bottoni Presets Problemi Reali */}
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {[
                          { label: "Felpa & Jeans (Somma 84€, 2/5)", mode: "somma" as const, tot: 84, n: 2, d: 5 },
                          { label: "Gita Scolastica (Diff 12, 7/4)", mode: "differenza" as const, tot: 12, n: 7, d: 4 },
                          { label: "Nastri Colorati (Somma 72cm, 3/5)", mode: "somma" as const, tot: 72, n: 3, d: 5 },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSegMode(preset.mode);
                              setSegTotal(preset.tot);
                              setSegNum(preset.n);
                              setSegDen(preset.d);
                            }}
                            className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:border-dida-orange hover:text-dida-orange transition cursor-pointer shadow-xs"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cockpit Ingressi Valori */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs items-center">
                      <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                          {segMode === "somma" ? "Valore della SOMMA TOTALE:" : "Valore della DIFFERENZA:"}
                        </label>
                        <input
                          type="number" min="1" value={segTotal}
                          onChange={(e) => setSegTotal(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-36 p-2 text-center rounded-xl border-2 border-orange-300 font-mono font-black text-2xl text-slate-900 bg-white"
                        />
                      </div>

                      <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-black uppercase text-slate-700 block mb-1">Rapporto di Frazione:</span>
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="number" min="1" max="15" value={segNum}
                            onChange={(e) => setSegNum(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-1.5 text-center rounded-xl border border-blue-300 font-mono font-bold text-lg text-blue-900 bg-white"
                            title="Parti del 1° Segmento"
                          />
                          <div className="w-20 h-1 bg-slate-800 rounded-full my-0.5"></div>
                          <input
                            type="number" min="1" max="15" value={segDen}
                            onChange={(e) => setSegDen(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-1.5 text-center rounded-xl border border-orange-300 font-mono font-bold text-lg text-orange-900 bg-white"
                            title="Parti del 2° Segmento"
                          />
                        </div>
                      </div>
                    </div>

                    {/* IL TAVOLO DA DISEGNO DEI SEGMENTI QUOTATI */}
                    <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xs space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2 text-xs font-bold text-slate-600">
                        <span>Disegno Tecnico dei Segmentini Unitari (u)</span>
                        <span className="text-dida-orange font-mono">
                          1 Unità = {segTotal} ÷ {segMode === "somma" ? segResult.partsTotal : segResult.partsDiff} = <strong>{segResult.onePart.toLocaleString()}</strong>
                        </span>
                      </div>

                      {/* Tracciamento Segmento 1 */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-blue-900">
                          <span>1° Segmento ({segNum} parti unitarie):</span>
                          <span className="text-sm font-black font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                            Misura: {segResult.numA.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          {Array.from({ length: Math.min(segNum, 20) }).map((_, i) => (
                            <div
                              key={i}
                              className="h-10 flex-1 bg-blue-500 rounded-lg border border-blue-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs"
                            >
                              {segResult.onePart.toLocaleString()}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tracciamento Segmento 2 */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-orange-900">
                          <span>2° Segmento ({segDen} parti unitarie):</span>
                          <span className="text-sm font-black font-mono text-orange-700 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
                            Misura: {segResult.numB.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          {Array.from({ length: Math.min(segDen, 20) }).map((_, i) => (
                            <div
                              key={i}
                              className="h-10 flex-1 bg-orange-500 rounded-lg border border-orange-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs"
                            >
                              {segResult.onePart.toLocaleString()}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Calcolo Analitico Finale */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1.5">
                        <p className="text-slate-700">
                          1. Conteggio parti: {segMode === "somma" ? `${segNum} + ${segDen} = ${segResult.partsTotal} parti totali` : `|${segDen} − ${segNum}| = ${segResult.partsDiff} parti di scarto`}
                        </p>
                        <p className="text-slate-700">
                          2. Valore di 1 parte: {segTotal} : {segMode === "somma" ? segResult.partsTotal : segResult.partsDiff} = <strong>{segResult.onePart.toLocaleString()}</strong>
                        </p>
                        <p className="text-emerald-700 font-bold text-sm pt-1">
                          3. Risultati: 1° = ({segResult.onePart} × {segNum}) = <strong>{segResult.numA.toLocaleString()}</strong> · 2° = ({segResult.onePart} × {segDen}) = <strong>{segResult.numB.toLocaleString()}</strong> ✓
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 7: MUSICA, MAESTRO! (LO SPARTITO DELLE FRAZIONI) */}
            {/* ======================================================== */}
            {selectedSubtopic === "fraction-music" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Lezione Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Interdisciplinare · Musica & Matematica
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Musica, Maestro! Le Note sono Frazioni
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Chi suona uno strumento legge lo spartito: le note non indicano secondi, ma <strong>frazioni dell'intero</strong>! In un tempo di <Frac num={4} den={4} size="xs" />, ogni battuta deve valere esattamente <strong>1 intero (<Frac num={4} den={4} size="xs" />)</strong>.
                    </p>
                  </div>

                  {/* Tabella Durata delle Note in Palette Arancio e Blu */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { name: "Semibreve", sym: "𝅝", dur: <span className="text-2xl font-black">1</span>, note: "Intero (4/4)", color: "bg-blue-50 border-blue-200 text-blue-900" },
                      { name: "Minima", sym: "𝅗𝅥", dur: <Frac num={1} den={2} size="lg" />, note: "Metà (2/4)", color: "bg-orange-50 border-orange-200 text-orange-900" },
                      { name: "Semiminima", sym: "𝅘𝅥", dur: <Frac num={1} den={4} size="lg" />, note: "Un Quarto (1/4)", color: "bg-blue-50 border-blue-200 text-blue-900" },
                      { name: "Croma", sym: "𝅘𝅥𝅮", dur: <Frac num={1} den={8} size="lg" />, note: "Un Ottavo (1/8)", color: "bg-orange-50 border-orange-200 text-orange-900" },
                      { name: "Semicroma", sym: "𝅘𝅥𝅯", dur: <Frac num={1} den={16} size="lg" />, note: "Un Sedicesimo (1/16)", color: "bg-blue-50 border-blue-200 text-blue-900" },
                    ].map((n) => (
                      <div key={n.name} className={`p-4 rounded-2xl border-2 text-center space-y-1 shadow-xs ${n.color}`}>
                        <span className="text-3xl block">{n.sym}</span>
                        <span className="text-xs font-black uppercase block">{n.name}</span>
                        <div className="py-1 flex items-center justify-center">{n.dur}</div>
                        <span className="text-[11px] opacity-75 font-bold block">{n.note}</span>
                      </div>
                    ))}
                  </div>

                  {/* LABORATORIO 7: LO SPARTITO DELLE FRAZIONI 4/4 */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Compositore Musicale · Lo Spartito 4/4
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Riempi la Battuta di <Frac num={4} den={4} size="sm" />
                      </h3>
                      <p className="text-xs text-slate-500">
                        Clicca sulle note per aggiungerle sul pentagramma: quando la somma raggiunge esattamente 1 (4/4) la battuta è completa!
                      </p>

                      {/* Indicatore Stato Battuta */}
                      <div className={`px-5 py-1.5 rounded-full text-xs font-black uppercase border mt-2 shadow-xs transition-all ${
                        Math.abs(musicSum - 1) < 0.001
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : musicSum > 1
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : "bg-orange-100 text-orange-900 border-orange-300"
                      }`}>
                        Totale Battuta: {musicSum.toFixed(2)} / 1.00 (
                        {Math.abs(musicSum - 1) < 0.001
                          ? "🎉 Perfetta 4/4!"
                          : musicSum > 1
                          ? "⚠️ Troppe Note!"
                          : `⏳ Incompleta, manca ${(1 - musicSum).toFixed(2)}`}
                        )
                      </div>
                    </div>

                    {/* Scatola degli Strumenti Note */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {[
                          { sym: "𝅝", label: "Semibreve (1)", den: 1, color: "hover:border-blue-400" },
                          { sym: "𝅗𝅥", label: "+ Minima (1/2)", den: 2, color: "hover:border-orange-400" },
                          { sym: "𝅘𝅥", label: "+ Semiminima (1/4)", den: 4, color: "hover:border-blue-400" },
                          { sym: "𝅘𝅥𝅮", label: "+ Croma (1/8)", den: 8, color: "hover:border-orange-400" },
                          { sym: "𝅘𝅥𝅯", label: "+ Semicroma (1/16)", den: 16, color: "hover:border-blue-400" },
                        ].map((btn) => (
                          <button
                            key={btn.den}
                            onClick={() => setMusicMeasures((prev) => [...prev, btn.den])}
                            className={`px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 transition cursor-pointer shadow-xs flex items-center gap-1.5 ${btn.color}`}
                          >
                            <span className="text-base">{btn.sym}</span>
                            <span>{btn.label}</span>
                          </button>
                        ))}
                        <button
                          onClick={() => setMusicMeasures([])}
                          className="px-4 py-2 rounded-2xl bg-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-300 transition cursor-pointer"
                        >
                          Svuota
                        </button>
                        <button
                          onClick={playRhythm}
                          disabled={isPlayingBeat || musicMeasures.length === 0}
                          className="px-4 py-2 rounded-2xl bg-dida-blue hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-40"
                        >
                          <Play size={14} />
                          {isPlayingBeat ? "Riproduzione..." : "Ascolta Ritmo"}
                        </button>
                      </div>

                      {/* IL VERO PENTAGRAMMA MUSICALE A 5 RIGHE */}
                      <div className="relative w-full h-36 bg-white rounded-3xl border-2 border-slate-300 p-6 flex items-center overflow-x-auto shadow-inner">
                        {/* 5 Linee del Pentagramma */}
                        <div className="absolute inset-x-0 inset-y-8 flex flex-col justify-between pointer-events-none px-4">
                          <div className="w-full h-[1.5px] bg-slate-300"></div>
                          <div className="w-full h-[1.5px] bg-slate-300"></div>
                          <div className="w-full h-[1.5px] bg-slate-300"></div>
                          <div className="w-full h-[1.5px] bg-slate-300"></div>
                          <div className="w-full h-[1.5px] bg-slate-300"></div>
                        </div>

                        {/* Chiave di Violino & Frazione Tempo 4/4 */}
                        <div className="relative z-10 flex items-center gap-2 mr-6 text-slate-800 shrink-0">
                          <span className="font-serif font-black text-4xl text-dida-blue">𝄞</span>
                          <Frac num={4} den={4} size="md" className="text-dida-orange font-black" />
                          <span className="w-0.5 h-16 bg-slate-400 mx-1"></span>
                        </div>

                        {/* Note Aggiunte sulla Battuta */}
                        <div className="relative z-10 flex items-center gap-3 flex-1 overflow-x-auto py-2">
                          {musicMeasures.length === 0 ? (
                            <span className="text-xs text-slate-400 italic">
                              Pentagramma vuoto: aggiungi note dai pulsanti in alto per riempire la battuta...
                            </span>
                          ) : (
                            musicMeasures.map((d, idx) => {
                              const noteSymbol =
                                d === 1 ? "𝅝" : d === 2 ? "𝅗𝅥" : d === 4 ? "𝅘𝅥" : d === 8 ? "𝅘𝅥𝅮" : "𝅘𝅥𝅯";
                              const isCurrentNote = activeBeatIndex === idx;

                              return (
                                <motion.button
                                  key={idx}
                                  animate={{ scale: isCurrentNote ? 1.25 : 1 }}
                                  onClick={() =>
                                    setMusicMeasures((prev) => prev.filter((_, i) => i !== idx))
                                  }
                                  title="Clicca per rimuovere la nota"
                                  className={`h-20 px-3 rounded-2xl border-2 flex flex-col items-center justify-center font-bold text-xs shadow-xs transition-all cursor-pointer ${
                                    isCurrentNote
                                      ? "bg-amber-300 border-amber-500 shadow-md ring-2 ring-amber-400"
                                      : d % 4 === 0
                                      ? "bg-blue-50/90 border-blue-200 text-blue-900 hover:bg-blue-100"
                                      : "bg-orange-50/90 border-orange-200 text-orange-900 hover:bg-orange-100"
                                  }`}
                                >
                                  <span className="text-2xl leading-none">{noteSymbol}</span>
                                  <Frac num={1} den={d} size="xs" className="mt-1" />
                                  <span className="text-[9px] text-slate-400 mt-0.5">✕ togli</span>
                                </motion.button>
                              );
                            })
                          )}
                        </div>

                        {/* Stanghetta di Chiusura Battuta */}
                        <div className="relative z-10 ml-auto shrink-0 flex items-center gap-1 text-slate-400">
                          <span className="w-0.5 h-16 bg-slate-400"></span>
                          <span className="w-1.5 h-16 bg-slate-700"></span>
                        </div>
                      </div>

                      {/* Barra di Avanzamento Frazionaria della Battuta */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                          <span>Completamento Battuta:</span>
                          <span className="font-mono text-dida-blue">{Math.round(musicSum * 100)}% dell'intero</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full transition-all duration-300 ${
                              Math.abs(musicSum - 1) < 0.001
                                ? "bg-emerald-500"
                                : musicSum > 1
                                ? "bg-rose-500"
                                : "bg-gradient-to-r from-blue-500 to-orange-500"
                            }`}
                            style={{ width: `${Math.min(musicSum * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ======================================================== */
          /* TAB ALLENA (PALESTRA OPERAZIONI FRAZIONI) */
          /* ======================================================== */
          <motion.div
            key="tab-allena-ops"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 px-4"
          >
            {/* Banner Palestra */}
            <div className="rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 shadow-lg text-center flex flex-col items-center gap-3.5">
              <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-amber-950 bg-white/30 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/40 shadow-xs">
                Palestra di Operazioni · Livello 1ª Media
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Mettiti alla Prova con le 4 Operazioni e i Quesiti INVALSI
              </h2>
              <p className="text-amber-100 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Addizioni, sottrazioni, semplificazioni a croce, potenze e quesiti reali tratti dalle prove nazionali!
              </p>
            </div>

            {/* SEZIONE 1: Correggi l'Errore (Slide 8) */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Attività 1 · Occhio all'Errore Tipico!
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">L'Uguaglianza è Corretta o Sbagliata?</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 1,
                    eq: (<span><Frac num={5} den={6} size="sm" /> + <Frac num={1} den={6} size="sm" /> = <Frac num={6} den={12} size="sm" /> ?</span>),
                    isCorrect: false,
                    explain: (<span>ERRORE GRAVISSIMO! Il denominatore non si somma: fa <Frac num={6} den={6} size="xs" /> = 1 intero!</span>)
                  },
                  {
                    id: 2,
                    eq: (<span><Frac num={3} den={5} size="sm" /> + <Frac num={4} den={5} size="sm" /> + <Frac num={2} den={5} size="sm" /> = <Frac num={9} den={5} size="sm" /> ?</span>),
                    isCorrect: true,
                    explain: "CORRETTO! Stesso denominatore (5), si sommano i numeratori 3 + 4 + 2 = 9!"
                  },
                  {
                    id: 3,
                    eq: (<span><Frac num={2} den={13} size="sm" /> + <Frac num={11} den={13} size="sm" /> = <Frac num={13} den={26} size="sm" /> ?</span>),
                    isCorrect: false,
                    explain: (<span>ERRORE! Non sommare i denominatori! Fa <Frac num={13} den={13} size="xs" /> = 1 intero!</span>)
                  },
                ].map((item) => {
                  const ans = exErrorsAnswers[item.id];
                  return (
                    <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-center flex flex-col items-center">
                      <div className="text-base font-black text-slate-800 py-1 flex items-center justify-center">{item.eq}</div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setExErrorsAnswers(prev => ({ ...prev, [item.id]: true }))}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            ans === true
                              ? item.isCorrect ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600"
                              : "bg-white text-slate-700 border-slate-300"
                          }`}
                        >
                          Corretta
                        </button>
                        <button
                          onClick={() => setExErrorsAnswers(prev => ({ ...prev, [item.id]: false }))}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            ans === false
                              ? !item.isCorrect ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600"
                              : "bg-white text-slate-700 border-slate-300"
                          }`}
                        >
                          Sbagliata
                        </button>
                      </div>
                      {ans !== null && ans !== undefined && (
                        <div className="text-xs font-semibold text-slate-600 pt-1">
                          {ans === item.isCorrect ? <span className="text-emerald-700 flex items-center gap-1 justify-center">✅ {item.explain}</span> : <span className="text-rose-600 flex items-center gap-1 justify-center">❌ {item.explain}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE 2: PROVE INVALSI UFFICIALI (Slide 33, 34, 35) */}
            <div className="rounded-[2rem] border-2 border-dida-blue/30 bg-white p-6 md:p-8 shadow-md space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-dida-blue text-white flex items-center justify-center font-black shadow-md">
                    <Award size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100">
                      Prove Nazionali INVALSI
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                      Quesiti Ufficiali di Operazioni con Frazioni
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-semibold">Dalle slide ministeriali</span>
              </div>

              {/* Quesito INVALSI 1: La Vincita al Totocalcio */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Quesito 1 · La Vincita al Totocalcio
                </span>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  Un padre e i suoi 4 figli si dividono una vincita: al padre va <strong><Frac num={1} den={3} size="xs" /></strong>, il resto è diviso in parti uguali tra i <strong>4 figli</strong>. <br />
                  Che frazione della somma totale spetta a ogni figlio?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", frac: <Frac num={1} den={2} size="xs" />, correct: false },
                    { id: "B", frac: <Frac num={1} den={3} size="xs" />, correct: false },
                    { id: "C", frac: <Frac num={1} den={4} size="xs" />, correct: false },
                    { id: "D", frac: <Frac num={1} den={6} size="xs" />, correct: true },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, toto: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                        invalsiAnswers.toto === opt.id
                          ? opt.correct
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : "bg-rose-500 text-white border-rose-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{opt.id}.</span>
                      {opt.frac}
                    </button>
                  ))}
                </div>
                {invalsiAnswers.toto && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.toto === "D"
                      ? "✅ Bravissimo! Ai figli resta 1 − 1/3 = 2/3. Ognuno prende 1/4 di 2/3: 1/4 × 2/3 = 2/12 = 1/6 della somma totale!"
                      : "❌ Guida: al padre va 1/3, quindi ai figli restano i 2/3. Ogni figlio prende 1/4 dei 2/3: moltiplica (1/4 × 2/3)!"}
                  </p>
                )}
              </div>

              {/* Quesito INVALSI 2: Sport e Pasticcini */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  Quesito 2 · Gli Atleti del Club
                </span>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  Un club ha <strong>150 atleti</strong>: <Frac num={2} den={5} size="xs" /> fanno tennis, <Frac num={1} den={3} size="xs" /> fa scherma e il resto fa atletica. <br />
                  Quanti atleti fanno atletica?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "40 atleti", correct: true },
                    { id: "B", val: "50 atleti", correct: false },
                    { id: "C", val: "60 atleti", correct: false },
                    { id: "D", val: "70 atleti", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, atleti: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                        invalsiAnswers.atleti === opt.id
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
                {invalsiAnswers.atleti && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.atleti === "A"
                      ? "✅ Esatto! Tennis = 150 : 5 × 2 = 60 atleti. Scherma = 150 : 3 = 50 atleti. Insieme fanno 60 + 50 = 110 atleti. Atletica = 150 − 110 = 40 atleti!"
                      : "❌ Calcola prima quanti atleti fanno tennis e quanti scherma, poi sottrai la loro somma da 150!"}
                  </p>
                )}
              </div>

              {/* Quesito INVALSI 3: La Borraccia di Michele */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  Quesito 3 · La Borraccia di Michele
                </span>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  La borraccia di Michele, piena per metà (<Frac num={1} den={2} size="xs" />), contiene <strong>0,6 litri</strong>. Michele ne beve la metà: quanta acqua rimane? E piena quanta ne contiene?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "Rimane 0,03 l", correct: false },
                    { id: "B", val: "Rimane 0,3 l (piena 1,2 l)", correct: true },
                    { id: "C", val: "Rimane 1/2 l", correct: false },
                    { id: "D", val: "Rimane 1,2 l", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, borraccia: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                        invalsiAnswers.borraccia === opt.id
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
                {invalsiAnswers.borraccia && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.borraccia === "B"
                      ? "✅ Perfetto! Beve la metà di 0,6 litri, quindi beve 0,3 l e ne restano 0,3 l. Piena interamente contiene il doppio: 0,6 × 2 = 1,2 litri!"
                      : "❌ Se c'erano 0,6 litri e ne beve la metà, 0,6 : 2 = 0,3 litri rimasti!"}
                  </p>
                )}
              </div>
            </div>

            {/* SEZIONE 3: Sfida Finale a Squadre V/F */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
              <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Sfida Finale · Vero o Falso
              </span>
              <p className="text-xs text-slate-500">Metti alla prova tutto il capitolo di operazioni:</p>

              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    text: (<span>a · <Frac num={1} den={2} size="xs" /> + <Frac num={1} den={3} size="xs" /> = <Frac num={2} den={5} size="xs" /></span>),
                    correct: false,
                    note: "Falso: non si sommano i denominatori! Fa 5/6."
                  },
                  {
                    id: 2,
                    text: (<span>b · <Frac num={3} den={4} size="xs" /> × <Frac num={1} den={2} size="xs" /> = <Frac num={3} den={8} size="xs" /></span>),
                    correct: true,
                    note: "Vero: (3×1)/(4×2) = 3/8!"
                  },
                  {
                    id: 3,
                    text: (<span>c · 2 : <Frac num={1} den={4} size="xs" /> = 8</span>),
                    correct: true,
                    note: "Vero: 2 × 4/1 = 8!"
                  },
                  {
                    id: 4,
                    text: (<span>d · (<Frac num={2} den={3} size="xs" />)² = <Frac num={4} den={3} size="xs" /></span>),
                    correct: false,
                    note: "Falso: si eleva anche il denominatore, fa 4/9!"
                  },
                  {
                    id: 5,
                    text: (<span>e · 1 − <Frac num={3} den={7} size="xs" /> = <Frac num={4} den={7} size="xs" /></span>),
                    correct: true,
                    note: "Vero: 7/7 − 3/7 = 4/7 (complementare)!"
                  },
                  {
                    id: 6,
                    text: (<span>f · Somma 40, uno è <Frac num={3} den={5} size="xs" /> dell'altro: sono 25 e 15</span>),
                    correct: true,
                    note: "Vero: 3+5=8 parti, 40:8=5; 5×3=15 e 5×5=25!"
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
