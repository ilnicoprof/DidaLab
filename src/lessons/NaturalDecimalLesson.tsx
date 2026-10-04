import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, BookOpen, Zap, AlertCircle, Award, X
} from "lucide-react";

interface Props {
  key?: string;
  onBack: () => void;
  subjectName: string;
  topicName: string;
  initialSubtopicId?: string;
  initialTab?: "impara" | "allena";
}

const SUBTOPICS = [
  { id: "natural-numbers", title: "I Numeri Naturali e il Sistema Decimale", short: "Naturali & Base 10" },
  { id: "natural-comparison", title: "Confrontare e Ordinare", short: "Confronto (<, >, =)" },
  { id: "decimal-numbers", title: "I Numeri Decimali e la Retta", short: "I Decimali" },
  { id: "decimal-comparison", title: "Confrontare i Decimali", short: "Confronto Decimali" },
  { id: "polynomial-form", title: "La Scrittura Polinomiale", short: "Scrittura Polinomiale" },
  { id: "rounding-estimation", title: "Arrotondamento e Stime", short: "Arrotondare (≈)" },
];

export default function NaturalDecimalLesson({
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
    return "natural-numbers";
  });

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // Modulo 1: Semiretta & Abaco
  const [lineStart, setLineStart] = useState<number>(0);
  const [activeNatural, setActiveNatural] = useState<number>(5);

  // Abaco (Migliaia, Centinaia, Decine, Unità)
  const [abacoK, setAbacoK] = useState<number>(2);
  const [abacoH, setAbacoH] = useState<number>(3);
  const [abacoDa, setAbacoDa] = useState<number>(5);
  const [abacoU, setAbacoU] = useState<number>(4);

  // Modulo 2: Laboratorio di confronto
  const [compNum1, setCompNum1] = useState<number>(1572);
  const [compNum2, setCompNum2] = useState<number>(1538);

  // Modulo 3: Fetta di pizza & Decimi/Centesimi
  const [pizzaFette, setPizzaFette] = useState<number>(3); // 3 fette su 10 = 0.3

  // Modulo 4: Scanner decimali
  const [decA, setDecA] = useState<string>("1.5");
  const [decB, setDecB] = useState<string>("1.432");

  // Modulo 5: Scompositore polinomiale interattivo
  const [polyInput, setPolyInput] = useState<string>("2354");

  // Modulo 6: Simulatore Regola del 5
  const [roundNumber, setRoundNumber] = useState<number>(1368.215);
  const [roundTarget, setRoundTarget] = useState<"k" | "da" | "u" | "decimi" | "centesimi">("u");

  // ==========================================
  // --- STATI ESERCIZI (ALLENA) ---
  // ==========================================
  const [exNatAnswers, setExNatAnswers] = useState<Record<number, string>>({});
  const [exCompAnswers, setExCompAnswers] = useState<Record<number, "<" | "=" | ">" | null>>({});
  const [invalsiAnswers, setInvalsiAnswers] = useState<Record<string, any>>({});
  const [eliminaSelected, setEliminaSelected] = useState<number[]>([]);
  const [vfAnswers, setVfAnswers] = useState<Record<number, boolean | null>>({});

  // Calcolo valore abaco
  const abacoTotale = useMemo(() => {
    return abacoK * 1000 + abacoH * 100 + abacoDa * 10 + abacoU;
  }, [abacoK, abacoH, abacoDa, abacoU]);

  // Calcolo scomposizione polinomiale di polyInput
  const parsedPoly = useMemo(() => {
    const raw = polyInput.trim().replace(",", ".");
    const val = parseFloat(raw);
    if (isNaN(val)) return null;
    const parts = raw.split(".");
    const intStr = parts[0] || "0";
    const decStr = parts[1] || "";

    const terms: { coeff: number; unitLabel: string; valueLabel: string; color: string }[] = [];

    // Cifre intere
    const intLen = intStr.length;
    for (let i = 0; i < intLen; i++) {
      const digit = parseInt(intStr[i], 10);
      const power = intLen - 1 - i;
      const mult = Math.pow(10, power);
      if (digit > 0 || intLen === 1) {
        let color = "bg-amber-100 text-amber-800 border-amber-300";
        let unitLabel = "unità";
        if (mult === 10) { unitLabel = "decine"; color = "bg-orange-100 text-orange-800 border-orange-300"; }
        else if (mult === 100) { unitLabel = "centinaia"; color = "bg-emerald-100 text-emerald-800 border-emerald-300"; }
        else if (mult === 1000) { unitLabel = "migliaia"; color = "bg-purple-100 text-purple-800 border-purple-300"; }
        else if (mult > 1000) { unitLabel = `10^${power}`; color = "bg-indigo-100 text-indigo-800 border-indigo-300"; }

        terms.push({
          coeff: digit,
          unitLabel,
          valueLabel: `${digit} × ${mult.toLocaleString("it-IT")}`,
          color
        });
      }
    }

    // Cifre decimali
    for (let j = 0; j < decStr.length; j++) {
      const digit = parseInt(decStr[j], 10);
      if (digit > 0) {
        let unitLabel = "decimi";
        let multStr = "0,1";
        let color = "bg-sky-100 text-sky-800 border-sky-300";
        if (j === 1) { unitLabel = "centesimi"; multStr = "0,01"; color = "bg-rose-100 text-rose-800 border-rose-300"; }
        else if (j === 2) { unitLabel = "millesimi"; multStr = "0,001"; color = "bg-teal-100 text-teal-800 border-teal-300"; }
        else if (j > 2) { unitLabel = `10^-${j + 1}`; multStr = `0.${"0".repeat(j)}1`; color = "bg-slate-100 text-slate-800 border-slate-300"; }

        terms.push({
          coeff: digit,
          unitLabel,
          valueLabel: `${digit} × ${multStr}`,
          color
        });
      }
    }

    return { val, raw, terms };
  }, [polyInput]);

  // Calcolo arrotondamento
  const roundInfo = useMemo(() => {
    let desc = "alle unità";
    let placeDigit = 0;
    let nextDigit = 0;
    let rounded = 0;

    const num = roundNumber;
    if (roundTarget === "k") {
      desc = "alle migliaia";
      placeDigit = Math.floor(Math.abs(num) / 1000) % 10;
      nextDigit = Math.floor(Math.abs(num) / 100) % 10;
      rounded = Math.round(num / 1000) * 1000;
    } else if (roundTarget === "da") {
      desc = "alle decine";
      placeDigit = Math.floor(Math.abs(num) / 10) % 10;
      nextDigit = Math.floor(Math.abs(num)) % 10;
      rounded = Math.round(num / 10) * 10;
    } else if (roundTarget === "u") {
      desc = "alle unità";
      placeDigit = Math.floor(Math.abs(num)) % 10;
      nextDigit = Math.floor((Math.abs(num) * 10) % 10);
      rounded = Math.round(num);
    } else if (roundTarget === "decimi") {
      desc = "ai decimi";
      placeDigit = Math.floor((Math.abs(num) * 10) % 10);
      nextDigit = Math.floor((Math.abs(num) * 100) % 10);
      rounded = Math.round(num * 10) / 10;
    } else if (roundTarget === "centesimi") {
      desc = "ai centesimi";
      placeDigit = Math.floor((Math.abs(num) * 100) % 10);
      nextDigit = Math.floor((Math.abs(num) * 1000) % 10);
      rounded = Math.round(num * 100) / 100;
    }

    const isEccesso = nextDigit >= 5;
    return { desc, placeDigit, nextDigit, isEccesso, rounded };
  }, [roundNumber, roundTarget]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-7xl mx-auto space-y-8 pb-16"
    >
      {/* Top Header */}
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
              Numeri Naturali e Decimali
            </h1>
          </div>
        </div>

        {/* Modalità: Impara / Allena */}
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
            key="tab-impara"
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

            {/* ======================================================== */}
            {/* SUBTOPIC 1: I NUMERI NATURALI E IL SISTEMA DECIMALE */}
            {/* ======================================================== */}
            {selectedSubtopic === "natural-numbers" && (
              <div className="space-y-8">
                {/* Scheda Teoria Principale */}
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 1 · I Fondamenti dell'Aritmetica
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      I Numeri Naturali e il Sistema Decimale
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      I numeri fanno parte della nostra vita in ogni istante: contiamo i giorni, misuriamo altezze e temperature, indichiamo l'ordine d'arrivo di una gara. Ma come sono fatti e come si scrivono?
                    </p>
                  </div>

                  {/* 3 Funzioni dei Numeri */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-dida-blue text-white flex items-center justify-center font-black mx-auto">
                        #
                      </div>
                      <h4 className="font-extrabold text-slate-800">1. Contare (Cardinali)</h4>
                      <p className="text-xs text-slate-600">
                        Indicano <strong>quanti</strong> elementi ci sono in un gruppo discreto.<br />
                        <em>Es. 24 compagni di classe, 12 mesi.</em>
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black mx-auto">
                        1°
                      </div>
                      <h4 className="font-extrabold text-slate-800">2. Mettere in Ordine (Ordinali)</h4>
                      <p className="text-xs text-slate-600">
                        Indicano la <strong>posizione</strong> in una sequenza o classifica.<br />
                        <em>Es. Salire al 3° piano, vincere il 1° premio.</em>
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black mx-auto">
                        📏
                      </div>
                      <h4 className="font-extrabold text-slate-800">3. Misurare (Grandezze)</h4>
                      <p className="text-xs text-slate-600">
                        Quantificano una grandezza fisica rispetto a un'unità di misura.<br />
                        <em>Es. Una temperatura di 19 °C, un prezzo di 2,50 €.</em>
                      </p>
                    </div>
                  </div>

                  {/* Definizione Insieme N */}
                  <div className="rounded-3xl bg-slate-50 border-2 border-slate-200 p-6 md:p-8 space-y-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-black font-serif text-dida-blue bg-white border border-blue-200 rounded-2xl px-4 py-1.5 shadow-sm">
                          ℕ
                        </span>
                        <div>
                          <h3 className="text-lg font-black text-slate-900">L'Insieme dei Numeri Naturali</h3>
                          <p className="text-xs text-slate-500">I numeri che usiamo naturalmente per contare</p>
                        </div>
                      </div>
                      <span className="font-mono text-base font-extrabold text-slate-800 bg-white px-4 py-2 rounded-xl border border-slate-200">
                        ℕ = &#123; 0, 1, 2, 3, 4, 5, 6, … &#125;
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                        <span className="text-xs font-black uppercase tracking-wider text-dida-blue">È Infinito</span>
                        <p className="text-xs text-slate-600">
                          Non esiste un numero massimo: ad ogni numero si può sempre aggiungere <strong>+1</strong> ottenendo un numero ancora più grande.
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-600">È Ordinato</span>
                        <p className="text-xs text-slate-600">
                          Dati due numeri naturali distinti, possiamo sempre stabilire con certezza quale sia il minore e quale il maggiore.
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Inizia da 0</span>
                        <p className="text-xs text-slate-600">
                          Lo <strong>0</strong> è l'elemento minimo: non possiede alcun precedente nell'insieme dei numeri naturali!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Precedente e Successivo */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50 to-orange-50 border border-slate-200 space-y-4">
                    <h3 className="text-lg font-black text-slate-800 text-center">
                      Precedente (n − 1) e Successivo (n + 1)
                    </h3>
                    <p className="text-xs text-slate-600 text-center max-w-xl mx-auto">
                      Ogni numero naturale <span className="font-mono font-bold">n &gt; 0</span> è preceduto da <span className="font-mono font-bold">n − 1</span> e seguito dal suo successivo <span className="font-mono font-bold">n + 1</span>.
                    </p>
                    <div className="flex items-center justify-center gap-3 md:gap-6 pt-2">
                      <div className="text-center p-3 md:p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-sm w-28">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Precedente (n−1)</span>
                        <span className="text-2xl font-black text-slate-700">{activeNatural > 0 ? activeNatural - 1 : "—"}</span>
                      </div>
                      <span className="text-slate-400 font-black text-xl">→</span>
                      <div className="text-center p-4 md:p-5 rounded-2xl bg-dida-blue text-white shadow-md w-32 border-2 border-blue-600 scale-105">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block mb-1">Numero (n)</span>
                        <span className="text-3xl font-black">{activeNatural}</span>
                      </div>
                      <span className="text-slate-400 font-black text-xl">→</span>
                      <div className="text-center p-3 md:p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-sm w-28">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Successivo (n+1)</span>
                        <span className="text-2xl font-black text-slate-700">{activeNatural + 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* WIDGET 1: La Semiretta Orientata Graduata */}
                  <div className="p-6 md:p-8 rounded-3xl bg-orange-50/40 border-2 border-orange-200/80 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-orange-200/60 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio Visivo
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        La Semiretta Orientata Graduata
                      </h3>
                      <p className="text-xs text-slate-600 max-w-xl mx-auto">
                        Un posto preciso per ogni numero. Il punto <strong>O</strong> corrisponde allo <strong>0</strong> (origine). Il valore di un punto si chiama <strong>ascissa</strong>.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="bg-orange-100 text-dida-orange px-2.5 py-1 rounded-lg border border-orange-200 font-bold">
                            Origine: <strong>O (0)</strong>
                          </span>
                          <span className="bg-blue-100 text-dida-blue px-2.5 py-1 rounded-lg border border-blue-200 font-bold">
                            Unità campione: <strong>u</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setLineStart(Math.max(0, lineStart - 5))}
                            disabled={lineStart === 0}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-orange-50 hover:border-orange-200 text-slate-700 disabled:opacity-40 rounded-xl border border-slate-200 cursor-pointer font-bold transition text-xs"
                          >
                            ◀ Scorri a sinistra
                          </button>
                          <button
                            onClick={() => setLineStart(lineStart + 5)}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-orange-50 hover:border-orange-200 text-slate-700 rounded-xl border border-slate-200 cursor-pointer font-bold transition text-xs"
                          >
                            Scorri a destra ▶
                          </button>
                        </div>
                      </div>

                      {/* SVG Semiretta su fondo chiaro */}
                      <div className="overflow-x-auto py-2 bg-slate-50/70 rounded-xl border border-slate-200">
                        <svg viewBox="0 0 850 140" className="w-full min-w-[700px] h-32 select-none">
                          <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284C7" />
                            </marker>
                          </defs>

                          {/* Linea principale in dida-blue */}
                          <line x1="40" y1="70" x2="800" y2="70" stroke="#0284C7" strokeWidth="4" markerEnd="url(#arrow)" />

                          {/* Tacche e numeri */}
                          {Array.from({ length: 11 }).map((_, idx) => {
                            const val = lineStart + idx;
                            const x = 50 + idx * 70;
                            const isSelected = val === activeNatural;
                            const isZero = val === 0;

                            return (
                              <g
                                key={val}
                                onClick={() => setActiveNatural(val)}
                                className="cursor-pointer group"
                              >
                                <line
                                  x1={x}
                                  y1={isZero ? "45" : "55"}
                                  x2={x}
                                  y2={isZero ? "95" : "85"}
                                  stroke={isSelected ? "#EA580C" : isZero ? "#0284C7" : "#CBD5E1"}
                                  strokeWidth={isSelected ? 4 : isZero ? 3 : 2}
                                />
                                {isZero && (
                                  <text x={x} y="38" textAnchor="middle" className="text-xs font-black fill-sky-700">
                                    O (Origine)
                                  </text>
                                )}
                                <circle
                                  cx={x}
                                  cy="70"
                                  r={isSelected ? 8 : 5}
                                  fill={isSelected ? "#EA580C" : "#0284C7"}
                                />
                                <text
                                  x={x}
                                  y="112"
                                  textAnchor="middle"
                                  className={`font-mono text-sm font-black transition-all ${
                                    isSelected ? "fill-orange-600 text-base" : "fill-slate-600 group-hover:fill-slate-900"
                                  }`}
                                >
                                  {val}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
                        <p>
                          💡 Clicca su un numero sulla semiretta per selezionarlo e calcolarne l'ascissa.
                        </p>
                        <p className="text-dida-orange font-bold bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
                          Numero selezionato: {activeNatural} (Ascissa del punto = {activeNatural})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WIDGET 2: Il Sistema Decimale Posizionale & Abaco */}
                  <div className="space-y-6 pt-8 border-t border-slate-100">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                      <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                        Base 10 e Valore Posizionale
                      </span>
                      <h3 className="text-2xl font-black text-slate-900">
                        10 Cifre per Scrivere Qualunque Numero
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Il nostro sistema è <strong>decimale</strong> (usiamo 10 cifre da 0 a 9 e raggruppiamo di 10 in 10) e <strong>posizionale</strong>: il valore di una cifra dipende dal posto in cui si trova!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                        <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                          Valore Assoluto
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          È il valore intrinseco della cifra presa da sola, a prescindere dal posto: la cifra <strong>5</strong> vale sempre cinque.
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                        <span className="text-xs font-black text-dida-blue uppercase tracking-wider">
                          Valore Posizionale (Relativo)
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Dipende dal posto: nel numero <strong>56</strong> la cifra 5 vale 5 decine (50), mentre in <strong>5400</strong> vale 5 migliaia (5000)!
                        </p>
                      </div>
                    </div>

                    {/* L'Abaco Digitale */}
                    <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-black text-slate-800">L'Abaco Digitale</h4>
                          <p className="text-xs text-slate-500">Aggiungi o rimuovi le perline su ciascuna asta</p>
                        </div>
                        <div className="text-right bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                          <span className="text-[10px] font-black uppercase text-slate-400 block">Numero Totale</span>
                          <span className="text-2xl font-black font-mono text-dida-blue">
                            {abacoTotale.toLocaleString("it-IT")}
                          </span>
                        </div>
                      </div>

                      {/* Colonne dell'abaco */}
                      <div className="grid grid-cols-4 gap-3 max-w-xl mx-auto text-center">
                        {/* Migliaia (k) */}
                        <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 flex flex-col items-center">
                          <span className="text-xs font-black text-purple-700">k (Migliaia)</span>
                          <span className="text-3xl font-black text-purple-900 my-2">{abacoK}</span>
                          <div className="flex gap-1 mt-auto">
                            <button
                              onClick={() => setAbacoK(Math.max(0, abacoK - 1))}
                              className="w-8 h-8 rounded-lg bg-white border border-purple-300 font-bold hover:bg-purple-100"
                            >-</button>
                            <button
                              onClick={() => setAbacoK(Math.min(9, abacoK + 1))}
                              className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700"
                            >+</button>
                          </div>
                          <span className="text-[10px] text-purple-600 font-bold mt-2">= {abacoK * 1000}</span>
                        </div>

                        {/* Centinaia (h) */}
                        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex flex-col items-center">
                          <span className="text-xs font-black text-emerald-700">h (Centinaia)</span>
                          <span className="text-3xl font-black text-emerald-900 my-2">{abacoH}</span>
                          <div className="flex gap-1 mt-auto">
                            <button
                              onClick={() => setAbacoH(Math.max(0, abacoH - 1))}
                              className="w-8 h-8 rounded-lg bg-white border border-emerald-300 font-bold hover:bg-emerald-100"
                            >-</button>
                            <button
                              onClick={() => setAbacoH(Math.min(9, abacoH + 1))}
                              className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                            >+</button>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-bold mt-2">= {abacoH * 100}</span>
                        </div>

                        {/* Decine (da) */}
                        <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-200 flex flex-col items-center">
                          <span className="text-xs font-black text-orange-700">da (Decine)</span>
                          <span className="text-3xl font-black text-orange-900 my-2">{abacoDa}</span>
                          <div className="flex gap-1 mt-auto">
                            <button
                              onClick={() => setAbacoDa(Math.max(0, abacoDa - 1))}
                              className="w-8 h-8 rounded-lg bg-white border border-orange-300 font-bold hover:bg-orange-100"
                            >-</button>
                            <button
                              onClick={() => setAbacoDa(Math.min(9, abacoDa + 1))}
                              className="w-8 h-8 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600"
                            >+</button>
                          </div>
                          <span className="text-[10px] text-orange-600 font-bold mt-2">= {abacoDa * 10}</span>
                        </div>

                        {/* Unità (u) */}
                        <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 flex flex-col items-center">
                          <span className="text-xs font-black text-blue-700">u (Unità)</span>
                          <span className="text-3xl font-black text-blue-900 my-2">{abacoU}</span>
                          <div className="flex gap-1 mt-auto">
                            <button
                              onClick={() => setAbacoU(Math.max(0, abacoU - 1))}
                              className="w-8 h-8 rounded-lg bg-white border border-blue-300 font-bold hover:bg-blue-100"
                            >-</button>
                            <button
                              onClick={() => setAbacoU(Math.min(9, abacoU + 1))}
                              className="w-8 h-8 rounded-lg bg-dida-blue text-white font-bold hover:bg-blue-700"
                            >+</button>
                          </div>
                          <span className="text-[10px] text-blue-600 font-bold mt-2">= {abacoU * 1}</span>
                        </div>
                      </div>

                      <div className="text-center text-xs text-slate-500 font-medium">
                        Regola aurea: <strong>10 unità di un ordine formano esattamente 1 unità dell'ordine immediatamente superiore.</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SUBTOPIC 2: CONFRONTARE E ORDINARE I NUMERI NATURALI */}
            {/* ======================================================== */}
            {selectedSubtopic === "natural-comparison" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200/80 shadow-xs">
                      Lezione 2 · Relazioni d'Ordine
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Chi è il Più Grande? Confronto e Ordinamento
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Confrontare due quantità significa stabilire se sono identiche oppure se una prevale sull'altra. I matematici usano simboli rigorosi e regole infallibili!
                    </p>
                  </div>

                  {/* I 4 Simboli del confronto */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <span className="text-3xl font-black font-mono text-slate-800 block">=</span>
                      <h4 className="font-extrabold text-sm text-slate-800">Uguale</h4>
                      <p className="text-[11px] text-slate-500">Stesso valore identico</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <span className="text-3xl font-black font-mono text-slate-800 block">≠</span>
                      <h4 className="font-extrabold text-sm text-slate-800">Diverso</h4>
                      <p className="text-[11px] text-slate-500">Valori non coincidenti</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1">
                      <span className="text-3xl font-black font-mono text-dida-blue block">&lt;</span>
                      <h4 className="font-extrabold text-sm text-dida-blue">Minore</h4>
                      <p className="text-[11px] text-slate-500">La punta guarda il più piccolo</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-center space-y-1">
                      <span className="text-3xl font-black font-mono text-dida-orange block">&gt;</span>
                      <h4 className="font-extrabold text-sm text-dida-orange">Maggiore</h4>
                      <p className="text-[11px] text-slate-500">L'apertura guarda il più grande</p>
                    </div>
                  </div>

                  {/* Trucco mnemonico */}
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center space-y-1">
                    <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                      💡 Regola d'Oro dei Simboli
                    </span>
                    <p className="text-sm font-bold text-amber-950">
                      La punta acuta del simbolo indica sempre il numero più piccolo: <span className="font-mono text-base">3 &lt; 7 &lt; 15</span>
                    </p>
                  </div>

                  {/* Le Due Regole del Confronto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="p-6 rounded-3xl bg-blue-50/60 border border-blue-200 space-y-3">
                      <div className="inline-block text-xs font-black uppercase tracking-wider text-dida-blue bg-white px-3 py-1 rounded-full border border-blue-200">
                        Regola 1 · Numero di Cifre Diverso
                      </div>
                      <h4 className="text-lg font-bold text-slate-800">Vince chi ha più cifre</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Se due numeri hanno una quantità differente di cifre, il numero con più cifre è sempre maggiore, indipendentemente dal valore delle cifre stesse!
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-blue-200 text-center font-mono font-bold text-lg text-slate-800">
                        1206 &gt; 972 <span className="text-xs text-slate-400 font-sans block font-normal">(4 cifre superano 3 cifre)</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/60 border border-orange-200 space-y-3">
                      <div className="inline-block text-xs font-black uppercase tracking-wider text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        Regola 2 · Stesso Numero di Cifre
                      </div>
                      <h4 className="text-lg font-bold text-slate-800">Confronta da sinistra verso destra</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Si esaminano le cifre partendo dalla posizione di ordine più alto (a sinistra). Il primo disallineamento stabilisce il vincitore!
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-orange-200 text-center font-mono font-bold text-lg text-slate-800">
                        1572 &gt; 1538 <span className="text-xs text-slate-400 font-sans block font-normal">(1=1, 5=5, ma 7 decine &gt; 3 decine)</span>
                      </div>
                    </div>
                  </div>

                  {/* Laboratorio Interattivo di Confronto */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio Interattivo
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Laboratorio di Confronto Cifra per Cifra
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        Inserisci due numeri per confrontarli automaticamente con la regola posizionale:
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                      <div className="text-center space-y-2 bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs">
                        <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Primo Numero</label>
                        <input
                          type="number"
                          value={compNum1}
                          onChange={(e) => setCompNum1(parseInt(e.target.value) || 0)}
                          className="w-36 text-center text-2xl font-mono font-black bg-orange-50/40 border-2 border-orange-200 rounded-xl py-2 text-slate-800 focus:outline-none focus:border-dida-orange"
                        />
                      </div>

                      <div className="text-center">
                        <span className="text-3xl font-black font-mono text-dida-orange bg-white px-6 py-3 rounded-2xl border-2 border-orange-200 shadow-sm block">
                          {compNum1 > compNum2 ? ">" : compNum1 < compNum2 ? "<" : "="}
                        </span>
                      </div>

                      <div className="text-center space-y-2 bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs">
                        <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Secondo Numero</label>
                        <input
                          type="number"
                          value={compNum2}
                          onChange={(e) => setCompNum2(parseInt(e.target.value) || 0)}
                          className="w-36 text-center text-2xl font-mono font-black bg-blue-50/40 border-2 border-blue-200 rounded-xl py-2 text-slate-800 focus:outline-none focus:border-dida-blue"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 text-center text-xs text-slate-600 max-w-xl mx-auto shadow-xs">
                      {compNum1.toString().length !== compNum2.toString().length ? (
                        <p>
                          Regola 1 applicata: <strong className="text-slate-800">{compNum1 > compNum2 ? compNum1 : compNum2}</strong> ha più cifre ({Math.max(compNum1.toString().length, compNum2.toString().length)} contro {Math.min(compNum1.toString().length, compNum2.toString().length)}), quindi è maggiore!
                        </p>
                      ) : compNum1 === compNum2 ? (
                        <p className="text-emerald-700 font-bold">Tutte le cifre coincidono esattamente: i due numeri sono perfettamente uguali.</p>
                      ) : (
                        <p>
                          Stesso numero di cifre ({compNum1.toString().length}): procedendo da sinistra, la prima cifra disuguale determina che <strong className="text-slate-800">{compNum1 > compNum2 ? compNum1 : compNum2}</strong> è più grande!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SUBTOPIC 3: I NUMERI DECIMALI E LA RETTA */}
            {/* ======================================================== */}
            {selectedSubtopic === "decimal-numbers" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-4 py-1.5 rounded-full border border-sky-200/80 shadow-xs">
                      Lezione 3 · Oltre l'Intero
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      I Numeri Decimali: Quando l'Intero Non Basta
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Se compri un panino che costa 2 euro e mezzo, o misuri una lunghezza che supera 1 metro ma non raggiunge i 2 metri, i numeri naturali non bastano più: servono i <strong>numeri decimali</strong>!
                    </p>
                  </div>

                  {/* La Fetta di Pizza: Interattivo */}
                  <div className="p-6 rounded-3xl bg-amber-50/80 border-2 border-amber-200 space-y-6">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                        Laboratorio della Pizza
                      </span>
                      <h3 className="text-xl font-black text-slate-900">Dividiamo l'Unità in 10 Parti Uguali</h3>
                      <p className="text-xs text-slate-600">
                        1 pizza intera = 1 unità. Dividendo la pizza in 10 fette uguali, ciascuna fetta è <strong>1 decimo</strong> = <strong>0,1</strong>.
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                      {/* SVG Pizza a spicchi */}
                      <svg viewBox="0 0 200 200" className="w-44 h-44 select-none">
                        <circle cx="100" cy="100" r="90" fill="#FED7AA" stroke="#EA580C" strokeWidth="4" />
                        {Array.from({ length: 10 }).map((_, idx) => {
                          const angle = (idx * 36) * (Math.PI / 180);
                          const nextAngle = ((idx + 1) * 36) * (Math.PI / 180);
                          const x1 = 100 + 90 * Math.cos(angle);
                          const y1 = 100 + 90 * Math.sin(angle);
                          const x2 = 100 + 90 * Math.cos(nextAngle);
                          const y2 = 100 + 90 * Math.sin(nextAngle);
                          const isEaten = idx < pizzaFette;

                          return (
                            <path
                              key={idx}
                              d={`M 100 100 L ${x1} ${y1} A 90 90 0 0 1 ${x2} ${y2} Z`}
                              fill={isEaten ? "#FB923C" : "#FFEDD5"}
                              stroke="#C2410C"
                              strokeWidth="2"
                              className="transition-colors duration-300"
                            />
                          );
                        })}
                        <circle cx="100" cy="100" r="10" fill="#EA580C" />
                      </svg>

                      {/* Controlli slider fette */}
                      <div className="space-y-4 text-center md:text-left">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">
                            Fette considerate: <strong className="text-lg text-amber-700">{pizzaFette} fette</strong> su 10
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={pizzaFette}
                            onChange={(e) => setPizzaFette(parseInt(e.target.value))}
                            className="w-56 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                          />
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-amber-300 space-y-1">
                          <div className="text-xs text-slate-500">Scrittura in frazione decimale:</div>
                          <div className="text-lg font-black font-mono text-slate-800">
                            {pizzaFette} / 10 = {(pizzaFette / 10).toFixed(1).replace(".", ",")}
                          </div>
                          <div className="text-xs text-amber-700 font-bold">
                            {pizzaFette === 10 ? "1 pizza intera (1 unità!)" : `${pizzaFette} decimi di pizza`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decimi, Centesimi, Millesimi */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 text-center space-y-2">
                      <span className="text-xs font-black text-sky-800 uppercase">1. Il Decimo (d)</span>
                      <span className="text-3xl font-black font-mono text-sky-700 block">0,1</span>
                      <p className="text-xs text-slate-600">
                        L'intero diviso in 10 parti uguali.<br />
                        <em>Es. 0,10 € (10 centesimi di euro) = 1 decimo di euro; 1 dm = 0,1 m.</em>
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
                      <span className="text-xs font-black text-rose-800 uppercase">2. Il Centesimo (c)</span>
                      <span className="text-3xl font-black font-mono text-rose-700 block">0,01</span>
                      <p className="text-xs text-slate-600">
                        L'intero diviso in 100 parti uguali (o il decimo diviso in 10).<br />
                        <em>Es. 0,01 € = 1 centesimo di euro; 1 cm = 0,01 m.</em>
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                      <span className="text-xs font-black text-emerald-800 uppercase">3. Il Millesimo (m)</span>
                      <span className="text-3xl font-black font-mono text-emerald-700 block">0,001</span>
                      <p className="text-xs text-slate-600">
                        L'intero diviso in 1000 parti uguali.<br />
                        <em>Es. 1 mL = 0,001 L; 1 mm = 0,001 m.</em>
                      </p>
                    </div>
                  </div>

                  {/* Da Ricordare Box */}
                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-center font-mono font-bold text-xs md:text-sm text-slate-800">
                    10 millesimi = 1 centesimo &nbsp;·&nbsp; 10 centesimi = 1 decimo &nbsp;·&nbsp; 10 decimi = 1 unità
                  </div>

                  {/* Parte Intera vs Parte Decimale & Proprietà Zeri */}
                  <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 space-y-6">
                    <h3 className="text-lg font-black text-slate-900 text-center">
                      Anatomia del Numero con la Virgola
                    </h3>
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-4 rounded-2xl bg-dida-blue text-white text-center w-36 shadow-sm">
                        <span className="text-[10px] font-bold uppercase text-blue-200 block">Parte Intera</span>
                        <span className="text-3xl font-black font-mono">36</span>
                      </div>
                      <span className="text-4xl font-black text-slate-400">,</span>
                      <div className="p-4 rounded-2xl bg-dida-orange text-white text-center w-36 shadow-sm">
                        <span className="text-[10px] font-bold uppercase text-orange-200 block">Parte Decimale</span>
                        <span className="text-3xl font-black font-mono">75</span>
                      </div>
                    </div>
                    <p className="text-center text-xs text-slate-600 max-w-lg mx-auto">
                      Si legge: <em>«trentasei virgola settantacinque»</em> oppure, con linguaggio matematico, <em>«trentasei unità e settantacinque centesimi»</em>.
                    </p>

                    {/* Proprietà zeri */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                      <span className="text-xs font-black uppercase text-amber-700 tracking-wider block text-center">
                        Regola Cruciale: Gli zeri in fondo non contano!
                      </span>
                      <p className="text-xs text-slate-600 text-center max-w-xl mx-auto">
                        Aggiungere zeri alla fine della parte decimale non altera il valore del numero:
                      </p>
                      <div className="text-center font-mono font-black text-lg text-slate-800">
                        3,5 = 3,50 = 3,500
                      </div>
                      <p className="text-[11px] text-slate-500 text-center">
                        Questa proprietà è utilissima per <strong>pareggiare le cifre</strong> quando dobbiamo fare confronti o somme!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SUBTOPIC 4: CONFRONTARE I NUMERI DECIMALI */}
            {/* ======================================================== */}
            {selectedSubtopic === "decimal-comparison" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200/80 shadow-xs">
                      Lezione 4 · Occhio ai Trabocchetti
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Confrontare i Numeri Decimali: La Trappola delle Cifre!
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Con i numeri decimali la regola «chi ha più cifre è più grande» NON FUNZIONA! Scopri come evitare gli errori più diffusi.
                    </p>
                  </div>

                  {/* La Trappola */}
                  <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-300 space-y-3 text-center">
                    <span className="text-xs font-black text-rose-700 uppercase tracking-wider inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-rose-200">
                      <AlertCircle size={14} /> Attenzione alla Trappola!
                    </span>
                    <h3 className="text-xl font-black text-rose-950">
                      Avere più cifre decimali NON significa essere più grandi!
                    </h3>
                    <div className="flex items-center justify-center gap-4 text-xl font-mono font-black text-slate-800 py-2">
                      <div className="p-3 bg-white rounded-xl border border-rose-200">
                        1,432 <span className="text-xs font-normal text-slate-400 block font-sans">(4 cifre)</span>
                      </div>
                      <span className="text-rose-600 text-2xl font-bold">&lt;</span>
                      <div className="p-3 bg-white rounded-xl border border-rose-200">
                        1,5 <span className="text-xs font-normal text-slate-400 block font-sans">(2 cifre)</span>
                      </div>
                    </div>
                    <p className="text-xs text-rose-900 max-w-xl mx-auto">
                      Perché? Perché se pareggiamo le cifre con gli zeri, <span className="font-mono font-bold">1,5 = 1,500</span>. Ed è evidente che 1,500 è maggiore di 1,432 (5 decimi superano 4 decimi)!
                    </p>
                  </div>

                  {/* Metodo Scientifico in 2 Passi */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 space-y-2">
                      <span className="w-7 h-7 rounded-full bg-dida-blue text-white flex items-center justify-center font-black text-xs">
                        1
                      </span>
                      <h4 className="font-extrabold text-slate-900">Confronta prima la PARTE INTERA</h4>
                      <p className="text-xs text-slate-600">
                        Se le parti intere sono diverse, vince chi ha la parte intera maggiore, qualunque cosa ci sia dopo la virgola!
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-blue-200 font-mono font-bold text-slate-800 text-center text-sm">
                        7,14 &gt; 4,96 <span className="text-xs text-slate-400 block font-sans">(perché 7 unità &gt; 4 unità)</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                        2
                      </span>
                      <h4 className="font-extrabold text-slate-900">Se le parti intere sono uguali: DECIMI, poi CENTESIMI...</h4>
                      <p className="text-xs text-slate-600">
                        Confronta prima i decimi. Se sono identici, confronta i centesimi, poi i millesimi. Oppure pareggia gli zeri!
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono font-bold text-slate-800 text-center text-sm">
                        1,581 &gt; 1,564 <span className="text-xs text-slate-400 block font-sans">(decimi 5=5, ma 8 centesimi &gt; 6 centesimi)</span>
                      </div>
                    </div>
                  </div>

                  {/* Scanner Interattivo Decimali */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Scanner Interattivo con Pareggiamento degli Zeri
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        Confronta due numeri con la virgola pareggiando le cifre decimali:
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                      <div className="text-center space-y-2 bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs">
                        <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Primo decimale</label>
                        <input
                          type="text"
                          value={decA}
                          onChange={(e) => setDecA(e.target.value)}
                          className="w-36 text-center text-2xl font-mono font-black bg-orange-50/40 border-2 border-orange-200 rounded-xl py-2 text-slate-800 focus:outline-none focus:border-dida-orange"
                        />
                      </div>

                      {/* Esito confronto */}
                      {(() => {
                        const valA = parseFloat(decA.replace(",", "."));
                        const valB = parseFloat(decB.replace(",", "."));
                        const sym = isNaN(valA) || isNaN(valB) ? "?" : valA > valB ? ">" : valA < valB ? "<" : "=";
                        return (
                          <div className="text-center">
                            <span className="text-3xl font-black font-mono text-dida-blue bg-white px-6 py-3 rounded-2xl border-2 border-blue-200 shadow-sm block">
                              {sym}
                            </span>
                          </div>
                        );
                      })()}

                      <div className="text-center space-y-2 bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs">
                        <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Secondo decimale</label>
                        <input
                          type="text"
                          value={decB}
                          onChange={(e) => setDecB(e.target.value)}
                          className="w-36 text-center text-2xl font-mono font-black bg-blue-50/40 border-2 border-blue-200 rounded-xl py-2 text-slate-800 focus:outline-none focus:border-dida-blue"
                        />
                      </div>
                    </div>

                    {/* Pareggiamento zeri visivo */}
                    {(() => {
                      const cleanA = decA.replace(",", ".");
                      const cleanB = decB.replace(",", ".");
                      const pA = cleanA.split(".")[1] || "";
                      const pB = cleanB.split(".")[1] || "";
                      const maxDec = Math.max(pA.length, pB.length);
                      const padA = (cleanA.split(".")[0] || "0") + "," + pA.padEnd(maxDec, "0");
                      const padB = (cleanB.split(".")[0] || "0") + "," + pB.padEnd(maxDec, "0");

                      return (
                        <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 text-center space-y-2 max-w-lg mx-auto shadow-xs">
                          <span className="text-xs text-dida-orange font-bold uppercase tracking-wider block">
                            Pareggiando le cifre decimali con gli zeri:
                          </span>
                          <div className="font-mono text-xl font-black text-slate-800 flex justify-center gap-6">
                            <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-xl border border-orange-200">{padA}</span>
                            <span className="text-slate-400 self-center">vs</span>
                            <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">{padB}</span>
                          </div>
                          <p className="text-xs text-slate-500 pt-1">
                            Ora è immediato: il confronto è evidente cifra per cifra!
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SUBTOPIC 5: LA SCRITTURA POLINOMIALE */}
            {/* ======================================================== */}
            {selectedSubtopic === "polynomial-form" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200/80 shadow-xs">
                      Lezione 5 · Scomposizione
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      La Scrittura Polinomiale: Il Cuore del Numero
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      La forma polinomiale mostra un numero come la <strong>somma dei valori posizionali</strong> delle sue cifre, moltiplicate per le potenze di 10 (per la parte intera) e per i valori frazionari 0,1, 0,01, 0,001 (per la parte decimale).
                    </p>
                  </div>

                  {/* Esempio Grafico Base */}
                  <div className="p-6 rounded-3xl bg-purple-50/70 border border-purple-200 space-y-4">
                    <span className="text-xs font-black uppercase text-purple-700 tracking-wider block text-center">
                      Esempio con Numero Naturale
                    </span>
                    <div className="text-center font-mono font-black text-2xl text-purple-950">
                      2354 = 2000 + 300 + 50 + 4
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-purple-200 text-center font-mono font-extrabold text-base md:text-lg text-purple-900 shadow-sm">
                      (2 × 1000) + (3 × 100) + (5 × 10) + (4 × 1)
                    </div>
                  </div>

                  {/* Esempio con Decimali */}
                  <div className="p-6 rounded-3xl bg-sky-50/70 border border-sky-200 space-y-4">
                    <span className="text-xs font-black uppercase text-sky-700 tracking-wider block text-center">
                      Anche con i Decimali!
                    </span>
                    <div className="text-center font-mono font-black text-2xl text-sky-950">
                      67,425
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-sky-200 text-center font-mono font-extrabold text-xs md:text-base text-sky-900 shadow-sm overflow-x-auto">
                      (6 × 10) + (7 × 1) + (4 × 0,1) + (2 × 0,01) + (5 × 0,001)
                    </div>
                    <p className="text-xs text-slate-600 text-center">
                      I decimi si moltiplicano per <strong>0,1</strong>, i centesimi per <strong>0,01</strong>, i millesimi per <strong>0,001</strong>.
                    </p>
                  </div>

                  {/* Lo Zero Segnaposto */}
                  <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center space-y-2">
                    <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                      ⚠️ Attenzione allo Zero Segnaposto!
                    </span>
                    <p className="text-xs text-amber-950 leading-relaxed max-w-xl mx-auto">
                      Se manca un ordine di grandezza, nel numero si inserisce lo <strong>0</strong> come segnaposto per non far slittare le altre cifre:
                    </p>
                    <div className="font-mono font-bold text-base text-amber-900">
                      (4 × 100) + (5 × 1) = 405 <span className="text-xs font-sans text-amber-700 block font-normal">(e NON 45!)</span>
                    </div>
                  </div>

                  {/* WIDGET INTERATTIVO: Generatore Polinomiale */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio Interattivo
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Costruisci la Scomposizione di Qualunque Numero
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        Digita un numero (naturale o con la virgola) per vedere la scomposizione in tempo reale:
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <input
                        type="text"
                        value={polyInput}
                        onChange={(e) => setPolyInput(e.target.value)}
                        placeholder="Es. 2354 oppure 67,425"
                        className="text-center text-2xl font-mono font-black bg-white border-2 border-orange-300 rounded-2xl px-6 py-3 text-slate-800 focus:outline-none focus:border-dida-orange w-72 shadow-xs"
                      />
                    </div>

                    {parsedPoly && parsedPoly.terms.length > 0 && (
                      <div className="space-y-4 max-w-2xl mx-auto">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {parsedPoly.terms.map((t, idx) => (
                            <div
                              key={idx}
                              className={`px-3 py-2 rounded-xl border-2 text-xs font-mono font-bold shadow-xs ${t.color}`}
                            >
                              {t.valueLabel}
                              <span className="block text-[9px] font-sans font-semibold opacity-70">
                                ({t.coeff} {t.unitLabel})
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 text-center font-mono text-sm text-slate-800 shadow-xs">
                          <strong className="text-dida-orange">{parsedPoly.raw}</strong> = {parsedPoly.terms.map(t => `(${t.valueLabel})`).join(" + ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SUBTOPIC 6: ARROTONDAMENTO E STIME */}
            {/* ======================================================== */}
            {selectedSubtopic === "rounding-estimation" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
                      Lezione 6 · Precisione e Stima
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Arrotondare e Stimare: Quando Basta un Numero «Circa»
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Non sempre serve una misura al millimetro o al centesimo: per sapere quanto dista Marte o se 15 € bastano per la spesa, un valore approssimato è più rapido e comodo!
                    </p>
                  </div>

                  {/* Il Simbolo Circa Uguale */}
                  <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-4xl font-black font-mono text-emerald-600 block">≈</span>
                    <h4 className="font-extrabold text-slate-800 text-base">Il Simbolo «Circa Uguale»</h4>
                    <p className="text-xs text-slate-600">
                      Si usa quando un numero viene approssimato o stimato:
                    </p>
                    <div className="font-mono font-bold text-sm text-slate-800">
                      83.572.000 km ≈ 84.000.000 km (circa 84 milioni di km)
                    </div>
                  </div>

                  {/* La Regola del 5 */}
                  <div className="rounded-3xl bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-300 p-6 md:p-8 space-y-6">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black uppercase text-emerald-800 tracking-wider bg-white px-3 py-1 rounded-full border border-emerald-200">
                        La Regola Universale del 5
                      </span>
                      <h3 className="text-2xl font-black text-slate-900">Guarda Sempre la Cifra a Destra!</h3>
                      <p className="text-xs text-slate-600 max-w-xl mx-auto">
                        Individua la cifra dell'ordine a cui vuoi arrotondare, poi osserva la <strong>cifra immediatamente alla sua destra</strong>:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-3xl bg-white border-2 border-blue-200 space-y-2 text-center">
                        <span className="text-xs font-black text-dida-blue uppercase tracking-wider">
                          Se è da 0 a 4 (0, 1, 2, 3, 4)
                        </span>
                        <h4 className="text-xl font-black text-slate-800">Arrotondamento per DIFETTO</h4>
                        <p className="text-xs text-slate-600">
                          La cifra considerata <strong>resta uguale</strong>, mentre tutte le cifre successive diventano zero (o si eliminano se decimali).
                        </p>
                        <div className="p-3 bg-blue-50 rounded-xl font-mono text-xs font-bold text-blue-900">
                          1.368.215 (alle migliaia) → 2 &lt; 5 → ≈ 1.368.000
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-white border-2 border-emerald-200 space-y-2 text-center">
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
                          Se è da 5 a 9 (5, 6, 7, 8, 9)
                        </span>
                        <h4 className="text-xl font-black text-slate-800">Arrotondamento per ECCESSO</h4>
                        <p className="text-xs text-slate-600">
                          La cifra considerata <strong>aumenta di 1</strong> (+1), mentre tutte le cifre successive diventano zero (o si eliminano se decimali).
                        </p>
                        <div className="p-3 bg-emerald-50 rounded-xl font-mono text-xs font-bold text-emerald-900">
                          1.368.215 (alle decine di migliaia) → 8 ≥ 5 → ≈ 1.370.000
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WIDGET INTERATTIVO: Simulatore di Arrotondamento */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio di Approssimazione
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Simulatore della Regola del 5
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        Scegli l'ordine di arrotondamento e guarda l'analisi automatica:
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs text-center">
                        <label className="text-xs font-bold text-slate-500 block mb-1 uppercase tracking-wider">Numero da arrotondare</label>
                        <input
                          type="number"
                          step="0.001"
                          value={roundNumber}
                          onChange={(e) => setRoundNumber(parseFloat(e.target.value) || 0)}
                          className="w-44 text-center text-xl font-mono font-black bg-orange-50/40 border-2 border-orange-200 rounded-xl py-2 text-slate-800 focus:outline-none focus:border-dida-orange"
                        />
                      </div>

                      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs text-center">
                        <label className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-wider">Arrotonda a</label>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {(["k", "da", "u", "decimi", "centesimi"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setRoundTarget(t)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                                roundTarget === t
                                  ? "bg-dida-orange text-white border-orange-600 font-black shadow-md scale-105"
                                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-orange-50 hover:border-orange-200"
                              }`}
                            >
                              {t === "k" ? "Migliaia" : t === "da" ? "Decine" : t === "u" ? "Unità" : t === "decimi" ? "Decimi" : "Centesimi"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Scheda Esito Simulatore */}
                    <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 max-w-lg mx-auto text-center space-y-3 shadow-sm">
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Arrotondamento <strong>{roundInfo.desc}</strong>:
                      </div>
                      <div className="text-3xl font-mono font-black text-dida-orange">
                        ≈ {roundInfo.rounded.toLocaleString("it-IT", { maximumFractionDigits: 3 })}
                      </div>
                      <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl text-xs text-slate-700">
                        La cifra a destra è <strong className="font-mono text-sm">{roundInfo.nextDigit}</strong> ({roundInfo.nextDigit >= 5 ? "≥ 5" : "< 5"}): arrotondamento per{" "}
                        <strong className={roundInfo.isEccesso ? "text-emerald-700 font-bold" : "text-blue-700 font-bold"}>
                          {roundInfo.isEccesso ? "ECCESSO (+1)" : "DIFETTO"}
                        </strong>.
                      </div>
                    </div>
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
            key="tab-allena"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 px-4"
          >
            {/* Banner Introduzione */}
            <div className="rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 shadow-lg text-center flex flex-col items-center gap-3.5">
              <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-amber-950 bg-white/30 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/40 shadow-xs">
                Palestra di Aritmetica · Livello 1ª Media
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Mettiti alla Prova con Esercizi e Quesiti INVALSI
              </h2>
              <p className="text-amber-100 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Esercitati sulle proprietà dei numeri naturali, il valore posizionale, il confronto decimale, la scomposizione e i quesiti ufficiali delle prove nazionali!
              </p>
            </div>

            {/* SEZIONE 1: Precedente, Successivo e Valore Posizionale */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Attività 1 · Base
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Precedente, Successivo e Posizione</h3>
                <p className="text-xs text-slate-500">Completa le risposte o seleziona l'opzione corretta.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Domanda 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-sm font-bold text-slate-800">
                    1. Qual è il precedente di 40 e il successivo di 1799?
                  </p>
                  <div className="flex gap-2">
                    {[
                      { id: "a", label: "39 e 1800", correct: true },
                      { id: "b", label: "41 e 1798", correct: false },
                      { id: "c", label: "39 e 1798", correct: false },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setExNatAnswers(prev => ({ ...prev, 1: opt.id }))}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          exNatAnswers[1] === opt.id
                            ? opt.correct
                              ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                              : "bg-rose-50 border-rose-400 text-rose-800"
                            : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {exNatAnswers[1] && (
                    <p className="text-xs text-emerald-700 font-semibold pt-1">
                      {exNatAnswers[1] === "a" ? "✅ Corretto! 40 − 1 = 39 e 1799 + 1 = 1800." : "❌ Riprova: il precedente è n−1, il successivo è n+1."}
                    </p>
                  )}
                </div>

                {/* Domanda 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-sm font-bold text-slate-800">
                    2. Che numero corrisponde a «8 migliaia, 2 centinaia e 4 unità»?
                  </p>
                  <div className="flex gap-2">
                    {[
                      { id: "a", label: "824", correct: false },
                      { id: "b", label: "8204", correct: true },
                      { id: "c", label: "8240", correct: false },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setExNatAnswers(prev => ({ ...prev, 2: opt.id }))}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          exNatAnswers[2] === opt.id
                            ? opt.correct
                              ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                              : "bg-rose-50 border-rose-400 text-rose-800"
                            : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {exNatAnswers[2] && (
                    <p className="text-xs text-emerald-700 font-semibold pt-1">
                      {exNatAnswers[2] === "b" ? "✅ Esatto! Manca l'ordine delle decine, quindi si inserisce lo zero segnaposto: 8204." : "❌ Attenzione allo zero segnaposto nelle decine!"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SEZIONE 2: Il Confronto Interattivo (<, =, >) */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-blue uppercase tracking-wider">
                  Attività 2 · Confronto Rapido
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Inserisci il Simbolo Corretto (&lt;, =, &gt;)</h3>
                <p className="text-xs text-slate-500">Clicca sul simbolo giusto tra i due numeri.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 1, left: "729", right: "3104", correct: "<" },
                  { id: 2, left: "1,432", right: "1,5", correct: "<" },
                  { id: 3, left: "3,40", right: "3,4", correct: "=" },
                  { id: 4, left: "5273", right: "5231", correct: ">" },
                  { id: 5, left: "71,68", right: "71,67", correct: ">" },
                  { id: 6, left: "0,51", right: "0,510", correct: "=" },
                ].map((item) => {
                  const currentAns = exCompAnswers[item.id];
                  const isDone = currentAns !== undefined && currentAns !== null;
                  const isCorrect = currentAns === item.correct;

                  return (
                    <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                      <div className="flex items-center justify-center gap-3 font-mono font-black text-lg text-slate-800">
                        <span>{item.left}</span>
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black border ${
                          isDone
                            ? isCorrect ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600"
                            : "bg-white text-slate-400 border-slate-300"
                        }`}>
                          {currentAns || "?"}
                        </span>
                        <span>{item.right}</span>
                      </div>

                      <div className="flex justify-center gap-2">
                        {(["<", "=", ">"] as const).map((sym) => (
                          <button
                            key={sym}
                            onClick={() => setExCompAnswers(prev => ({ ...prev, [item.id]: sym }))}
                            className={`w-9 h-9 rounded-xl font-mono font-black text-base transition border cursor-pointer ${
                              currentAns === sym
                                ? sym === item.correct
                                  ? "bg-emerald-600 text-white border-emerald-700"
                                  : "bg-rose-600 text-white border-rose-700"
                                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                            }`}
                          >
                            {sym}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE 3: PROVE INVALSI (Tratte direttamente dalle slide!) */}
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
                      Come alle Prove INVALSI
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-semibold">Quesiti di ragionamento matematico</span>
              </div>

              {/* Quesito INVALSI 1: Elimina i numeri */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    Quesito 1 · Elimina i Numeri
                  </span>
                  <span className="text-xs text-slate-500">Trova il numero superstite</span>
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Dato l'elenco di numeri, elimina quelli che possiedono ALMENO UNA di queste 3 caratteristiche:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-rose-700 font-bold flex items-center gap-2">
                    <X size={16} /> Minori di 5 decine (&lt; 50)
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-rose-700 font-bold flex items-center gap-2">
                    <X size={16} /> Maggiori di 80 (&gt; 80)
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-rose-700 font-bold flex items-center gap-2">
                    <X size={16} /> Numeri PARI
                  </div>
                </div>

                {/* Griglia numeri interattivi da eliminare */}
                <div className="flex flex-wrap justify-center gap-3 py-3">
                  {[54, 27, 34, 78, 16, 43, 65, 81, 92].map((num) => {
                    const isEliminated =
                      num < 50 || // minori di 5 decine (27, 34, 16, 43)
                      num > 80 || // maggiori di 80 (81, 92)
                      num % 2 === 0; // pari (54, 78)
                    // Il solo superstite è 65! (65 >= 50, <= 80, dispari)

                    const isChosen = eliminaSelected.includes(num);

                    return (
                      <button
                        key={num}
                        onClick={() => {
                          setEliminaSelected(prev =>
                            prev.includes(num) ? prev.filter(x => x !== num) : [...prev, num]
                          );
                        }}
                        className={`w-14 h-14 rounded-2xl font-mono text-lg font-black transition border-2 cursor-pointer ${
                          isChosen
                            ? !isEliminated
                              ? "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg"
                              : "bg-rose-500 text-white border-rose-600 line-through opacity-70"
                            : "bg-white text-slate-800 border-slate-300 hover:border-amber-400"
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center text-xs">
                  {eliminaSelected.includes(65) ? (
                    <p className="text-emerald-700 font-extrabold text-sm">
                      🎉 Bravissimo! Il numero rimasto è esattamente <strong>65</strong> (è &ge; 50, &le; 80 ed è dispari)!
                    </p>
                  ) : (
                    <p className="text-slate-500">
                      Clicca sul numero che secondo te è l'unico a non venire eliminato dai 3 filtri!
                    </p>
                  )}
                </div>
              </div>

              {/* Quesito INVALSI 2: Centesimi e Decimali */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-dida-blue bg-blue-100 px-3 py-1 rounded-full">
                  Quesito 2 · Valore dei Centesimi
                </span>
                <p className="text-sm font-bold text-slate-800">
                  a) Quale scrittura decimale corrisponde a «115 centesimi»?
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "1,15", correct: true },
                    { id: "B", val: "11,5", correct: false },
                    { id: "C", val: "0,115", correct: false },
                    { id: "D", val: "1,015", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, q2a: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-mono font-bold transition cursor-pointer ${
                        invalsiAnswers.q2a === opt.id
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
                {invalsiAnswers.q2a && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.q2a === "A"
                      ? "✅ Esatto: 115 centesimi = 115 / 100 = 1,15 (1 unità intera e 15 centesimi)."
                      : "❌ Riprova: 100 centesimi formano 1 unità intera, quindi 115 centesimi = 1,15."}
                  </p>
                )}

                <p className="text-sm font-bold text-slate-800 pt-3 border-t border-slate-200">
                  b) A quale numero corrisponde la dicitura «12 decine, 7 decimi e 2 millesimi»?
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "12,702", correct: false },
                    { id: "B", val: "120,702", correct: true },
                    { id: "C", val: "12,72", correct: false },
                    { id: "D", val: "120,72", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, q2b: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-mono font-bold transition cursor-pointer ${
                        invalsiAnswers.q2b === opt.id
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
                {invalsiAnswers.q2b && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.q2b === "B"
                      ? "✅ Perfetto: 12 decine = 120; 7 decimi = 0,7; 0 centesimi; 2 millesimi = 0,002 → 120,702!"
                      : "❌ 12 decine valgono 120 unità intere, non 12! Inoltre i centesimi sono 0."}
                  </p>
                )}
              </div>

              {/* Quesito INVALSI 3: Ragionamento su n + 1 */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  Quesito 3 · Chi Ha Ragione?
                </span>
                <p className="text-sm text-slate-700">
                  L'insegnante formula questa domanda alla classe: <br />
                  <strong className="text-slate-900">«Se n è un numero naturale qualsiasi, che cosa possiamo affermare con assoluta certezza su n + 1?»</strong>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: "A", name: "Cristina", text: "«n + 1 è sempre un numero pari, perché se fai 3 + 1 = 4»", correct: false },
                    { id: "B", name: "Angela", text: "«n + 1 è sempre il numero successivo di n»", correct: true },
                    { id: "C", name: "Piero", text: "«n + 1 è sempre un numero dispari, perché 10 + 1 = 11»", correct: false },
                    { id: "D", name: "Sonia", text: "«n + 1 sommato a n dà sempre un numero pari»", correct: false },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, q3: item.id }))}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        invalsiAnswers.q3 === item.id
                          ? item.correct
                            ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                            : "bg-rose-50 border-rose-400 text-rose-900"
                          : "bg-white border-slate-200 hover:bg-slate-100 text-slate-800"
                      }`}
                    >
                      <div className="font-extrabold text-sm mb-1">{item.name} ({item.id})</div>
                      <div className="text-xs text-slate-600">{item.text}</div>
                    </button>
                  ))}
                </div>
                {invalsiAnswers.q3 && (
                  <p className="text-xs text-emerald-700 font-bold pt-1">
                    {invalsiAnswers.q3 === "B"
                      ? "✅ Angela ha sempre ragione: per definizione matematica in ℕ, n + 1 è il numero immediatamente successivo a n! Cristina e Piero hanno provato un solo caso particolare."
                      : "❌ Attento: se n è pari (es. 4), n+1 è dispari (5); se n è dispari (3), n+1 è pari (4). L'unica proprietà sempre vera è quella di Angela!"}
                  </p>
                )}
              </div>

              {/* SEZIONE 4: Sfida Finale Vero o Falso */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Sfida Finale · Vero o Falso
                </span>
                <p className="text-xs text-slate-500">Verifica la tua comprensione globale dell'argomento:</p>

                <div className="space-y-3">
                  {[
                    { id: 1, text: "Lo 0 è il più piccolo dei numeri naturali e non ha precedente in ℕ.", correct: true },
                    { id: 2, text: "Nel numero 5102 la cifra 1 ha valore posizionale pari a 100 unità.", correct: true },
                    { id: 3, text: "I numeri decimali 4,5 e 4,50 rappresentano quantità diverse.", correct: false, note: "Falso: gli zeri finali non alterano il valore (4,5 = 4,50)." },
                    { id: 4, text: "1,432 è maggiore di 1,5 perché è formato da più cifre.", correct: false, note: "Falso: pareggiando le cifre, 1,5 = 1,500 > 1,432." },
                    { id: 5, text: "La scrittura polinomiale (3 × 100) + (5 × 1) corrisponde a 350.", correct: false, note: "Falso: corrisponde a 305! (3 centinaia e 5 unità)." },
                    { id: 6, text: "Il numero 6,48 arrotondato ai decimi con la regola del 5 diventa ≈ 6,5.", correct: true, note: "Vero: l'8 sui centesimi è ≥ 5, quindi arrotondiamo per eccesso." },
                  ].map((q) => {
                    const ans = vfAnswers[q.id];

                    return (
                      <div key={q.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <span className="text-xs font-bold text-slate-800 flex-1">{q.text}</span>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => setVfAnswers(prev => ({ ...prev, [q.id]: true }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                              ans === true
                                ? q.correct === true ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                            }`}
                          >
                            Vero
                          </button>
                          <button
                            onClick={() => setVfAnswers(prev => ({ ...prev, [q.id]: false }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                              ans === false
                                ? q.correct === false ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
