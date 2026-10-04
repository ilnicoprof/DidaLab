import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, BookOpen, Zap, RotateCcw, Award, Calendar, Scissors
} from "lucide-react";
import { gcd, lcm, divisors, factorSteps, factorize, formatFactors, commonFactors, allFactors } from "../lib/math";

const clampInt = (value: string, min: number, max: number) =>
  Math.min(max, Math.max(min, parseInt(value) || min));

const NumberField = ({ value, onChange, min, max, label }: {
  value: number; onChange: (n: number) => void; min: number; max: number; label: string;
}) => (
  <label className="flex flex-col items-center gap-1">
    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(clampInt(e.target.value, min, max))}
      className="w-28 text-center text-2xl font-mono font-black bg-white border-2 border-slate-300 rounded-2xl py-1.5 text-slate-800 focus:outline-none focus:border-dida-blue"
    />
  </label>
);

/** Elenco con puntini se troppo lungo: mostra i primi elementi e l'ultimo */
const shortList = (list: number[], max = 12) =>
  list.length <= max ? list.join(", ") : `${list.slice(0, max - 1).join(", ")}, …, ${list[list.length - 1]}`;

interface Props {
  key?: string;
  onBack: () => void;
  subjectName: string;
  topicName: string;
  initialSubtopicId?: string;
  initialTab?: "impara" | "allena";
}

const SUBTOPICS = [
  { id: "divisors-multiples", title: "Multipli e Divisori", short: "1. Multipli & Divisori" },
  { id: "divisibility-criteria", title: "I Criteri di Divisibilità", short: "2. Criteri di Divisibilità" },
  { id: "prime-composite-numbers", title: "Numeri Primi e Scomposizione", short: "3. Numeri Primi" },
  { id: "gcd", title: "Il Massimo Comune Divisore (M.C.D.)", short: "4. M.C.D. (Spezzare)" },
  { id: "lcm", title: "Il Minimo Comune Multiplo (m.c.m.)", short: "5. m.c.m. (Ritrovarsi)" },
  { id: "gcd-lcm-problems", title: "M.C.D. o m.c.m.? Come Riconoscerli", short: "6. M.C.D. o m.c.m.?" },
];

export default function DivisibilityLesson({
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
    return "divisors-multiples";
  });

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // Modulo 1: Trova Divisori e Multipli
  const [activeNum, setActiveNum] = useState<number>(24);

  // Modulo 2: Tester Criteri
  const [testCriteriaNum, setTestCriteriaNum] = useState<number>(432);

  // Modulo 3: Scomposizione e Albero
  const [treeNum, setTreeNum] = useState<number>(60);

  // Modulo 4: M.C.D. Multi-Strategia
  const [mcdNumA, setMcdNumA] = useState<number>(24);
  const [mcdNumB, setMcdNumB] = useState<number>(32);
  const [mcdStrategy, setMcdStrategy] = useState<"sacchetti" | "elenco" | "venn" | "scomposizione">("sacchetti");

  // Modulo 5: m.c.m. Multi-Strategia
  const [mcmNumA, setMcmNumA] = useState<number>(4);
  const [mcmNumB, setMcmNumB] = useState<number>(6);
  const [mcmStrategy, setMcmStrategy] = useState<"calendario" | "elenco" | "venn" | "scomposizione">("calendario");

  // ==========================================
  // --- STATI ESERCIZI (ALLENA) ---
  // ==========================================
  const [exDivAnswers, setExDivAnswers] = useState<Record<number, string | null>>({});
  const [exCalcAnswers, setExCalcAnswers] = useState<Record<number, string>>({});
  const [invalsiAnswers, setInvalsiAnswers] = useState<Record<string, any>>({});
  const [vfAnswers, setVfAnswers] = useState<Record<number, boolean | null>>({});

  // Calcolo divisori di activeNum
  const divisoriList = useMemo(() => divisors(activeNum), [activeNum]);

  // Calcolo primi 8 multipli di activeNum
  const multipliList = useMemo(
    () => Array.from({ length: 8 }, (_, i) => activeNum * (i + 1)),
    [activeNum]
  );

  // Scomposizione in colonna di treeNum
  const treeSteps = useMemo(() => factorSteps(treeNum), [treeNum]);

  // Calcolo M.C.D. tra mcdNumA e mcdNumB con i tre metodi
  const mcdCalc = useMemo(() => {
    const a = mcdNumA;
    const b = mcdNumB;
    const divA = divisors(a);
    const divB = divisors(b);
    const common = divA.filter(x => divB.includes(x));
    const soloA = divA.filter(x => !divB.includes(x));
    const soloB = divB.filter(x => !divA.includes(x));
    const factA = factorize(a);
    const factB = factorize(b);
    return { a, b, divA, divB, common, soloA, soloB, mcd: gcd(a, b), factA, factB, factMcd: commonFactors(factA, factB) };
  }, [mcdNumA, mcdNumB]);

  // Calcolo m.c.m. tra mcmNumA e mcmNumB con i tre metodi
  const mcmCalc = useMemo(() => {
    const a = mcmNumA;
    const b = mcmNumB;
    const mcm = lcm(a, b);
    // Multipli fino al m.c.m. compreso, più un giro per far vedere che si ripete
    const multA = Array.from({ length: (2 * mcm) / a }, (_, i) => a * (i + 1));
    const multB = Array.from({ length: (2 * mcm) / b }, (_, i) => b * (i + 1));
    const commonMult = multA.filter(x => multB.includes(x));
    const factA = factorize(a);
    const factB = factorize(b);
    return { a, b, multA, multB, commonMult, mcm, factA, factB, factMcm: allFactors(factA, factB) };
  }, [mcmNumA, mcmNumB]);

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
              Multipli, Divisori, M.C.D. e m.c.m.
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
            key="tab-impara-div"
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
            {/* MODULO 1: MULTIPLI E DIVISORI */}
            {/* ======================================================== */}
            {selectedSubtopic === "divisors-multiples" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 1 · Le Tabelline da Vicino
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Multipli e Divisori: Due Facce della Stessa Medaglia
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Quando una divisione ha resto 0, i numeri sono legati da una relazione perfetta. Ad esempio: <span className="font-mono font-bold text-slate-900">28 : 7 = 4 con resto 0</span>.
                    </p>
                  </div>

                  {/* Schema Duale */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 flex flex-col items-start gap-3">
                      <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-dida-blue bg-white px-3.5 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Il Numero Grande · Il Multiplo
                      </span>
                      <h3 className="text-xl font-black text-slate-800">28 è multiplo di 7 e di 4</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Un multiplo si ottiene moltiplicando: <span className="font-mono font-bold">7 × 4 = 28</span>. <br />
                        I multipli sono <strong>infiniti</strong>: la tabellina continua all'infinito! Ogni numero è multiplo di se stesso (<span className="font-mono">7 × 1 = 7</span>).
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-amber-50/70 border-2 border-amber-200 flex flex-col items-start gap-3">
                      <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-amber-800 bg-white px-3.5 py-1.5 rounded-full border border-amber-200 shadow-xs">
                        I Numeri Piccoli · I Divisori
                      </span>
                      <h3 className="text-xl font-black text-slate-800">7 e 4 sono divisori di 28</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Un divisore divide il numero esattamente con resto zero. <br />
                        I divisori sono <strong>finiti</strong>: il più piccolo è sempre <strong>1</strong> e il più grande è il <strong>numero stesso</strong>.
                      </p>
                    </div>
                  </div>

                  {/* WIDGET INTERATTIVO: Esploratore di Divisori e Multipli */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio Interattivo · Carta d'Identità del Numero
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Esplora Divisori e Multipli
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        Digita un numero per visualizzare l'elenco completo dei suoi divisori e i primi multipli:
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={activeNum}
                        onChange={(e) => setActiveNum(clampInt(e.target.value, 1, 200))}
                        className="w-36 text-center text-3xl font-mono font-black bg-white border-2 border-orange-300 rounded-2xl py-2 text-slate-800 focus:outline-none focus:border-dida-orange shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {/* Divisori */}
                      <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-xs">
                        <span className="text-xs text-dida-orange font-bold uppercase tracking-wider block text-center">
                          Tutti i Divisori D({activeNum}) — Totale: {divisoriList.length}
                        </span>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {divisoriList.map((d) => (
                            <span key={d} className="px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-800 font-mono font-bold text-sm rounded-lg">
                              {d}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500 text-center font-medium">
                          {divisoriList.length === 2 ? "⭐ È un NUMERO PRIMO (ha solo 1 e se stesso)!" : "È un NUMERO COMPOSTO."}
                        </p>
                      </div>

                      {/* Multipli */}
                      <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-xs">
                        <span className="text-xs text-dida-blue font-bold uppercase tracking-wider block text-center">
                          Primi Multipli M({activeNum})
                        </span>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {multipliList.map((m) => (
                            <span key={m} className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 font-mono font-bold text-sm rounded-lg">
                              {m}
                            </span>
                          ))}
                          <span className="px-2 py-1 text-slate-400 text-sm font-bold">…</span>
                        </div>
                        <p className="text-[11px] text-slate-500 text-center font-medium">
                          I multipli continuano all'infinito aggiungendo sempre +{activeNum}!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: I CRITERI DI DIVISIBILITÀ */}
            {/* ======================================================== */}
            {selectedSubtopic === "divisibility-criteria" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
                      Lezione 2 · Senza Fare la Divisione!
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      I Criteri di Divisibilità: Scorciatoie Infallibili
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      I criteri permettono di capire istantaneamente se un numero è divisibile per 2, 3, 4, 5, 9, 10, 11 o 25 senza bisogno di eseguire l'operazione in colonna!
                    </p>
                  </div>

                  {/* Le 3 Famiglie di Criteri */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col gap-2.5">
                      <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-dida-blue bg-white px-3 py-1 rounded-full border border-blue-200 self-start">
                        1. L'Ultima Cifra
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                        <li>• <strong>Per 2</strong>: finisce con cifra pari (0, 2, 4, 6, 8).</li>
                        <li>• <strong>Per 5</strong>: finisce con 0 oppure 5.</li>
                        <li>• <strong>Per 10</strong>: finisce con lo zero (0).</li>
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col gap-2.5">
                      <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200 self-start">
                        2. Le Ultime Due Cifre
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                        <li>• <strong>Per 4</strong>: ultime due cifre 00 o multiplo di 4 (es. 5<strong>36</strong>).</li>
                        <li>• <strong>Per 25</strong>: finisce con 00, 25, 50, 75.</li>
                        <li>• <strong>Per 100</strong>: finisce con due zeri (00).</li>
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col gap-2.5">
                      <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-amber-800 bg-white px-3 py-1 rounded-full border border-amber-200 self-start">
                        3. La Somma delle Cifre
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                        <li>• <strong>Per 3</strong>: la somma delle cifre è nella tabellina del 3.</li>
                        <li>• <strong>Per 9</strong>: la somma delle cifre è nella tabellina del 9.</li>
                        <li>• <strong>Per 11</strong>: differenza tra cifre di posto dispari e pari = 0 o 11!</li>
                      </ul>
                    </div>
                  </div>

                  {/* WIDGET INTERATTIVO: Tester dei Criteri */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Scanner Automatico dei Criteri
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Collauda Qualsiasi Numero
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        Digita un numero per vedere quali criteri di divisibilità supera al volo:
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <input
                        type="number"
                        value={testCriteriaNum}
                        onChange={(e) => setTestCriteriaNum(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-44 text-center text-3xl font-mono font-black bg-white border-2 border-orange-300 rounded-2xl py-2 text-slate-800 focus:outline-none focus:border-dida-orange shadow-xs"
                      />
                    </div>

                    {/* Griglia di verifica criteri */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto text-xs font-bold">
                      {[
                        { div: 2, test: testCriteriaNum % 2 === 0, rule: "Ultima cifra pari" },
                        { div: 3, test: testCriteriaNum % 3 === 0, rule: "Somma cifre multiplo di 3" },
                        { div: 4, test: testCriteriaNum % 4 === 0, rule: "Ultime due cifre divisibili per 4" },
                        { div: 5, test: testCriteriaNum % 5 === 0, rule: "Termina con 0 o 5" },
                        { div: 9, test: testCriteriaNum % 9 === 0, rule: "Somma cifre multiplo di 9" },
                        { div: 10, test: testCriteriaNum % 10 === 0, rule: "Termina con 0" },
                        { div: 11, test: testCriteriaNum % 11 === 0, rule: "Differenza posti pari/dispari" },
                        { div: 25, test: testCriteriaNum % 25 === 0, rule: "Termina con 00, 25, 50, 75" },
                      ].map((item) => (
                        <div
                          key={item.div}
                          className={`p-3 rounded-xl border-2 flex items-center justify-between shadow-xs ${
                            item.test
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}
                        >
                          <div>
                            <span className="text-sm font-mono font-black block">Divisibile per {item.div}</span>
                            <span className="text-[10px] font-normal text-slate-500">{item.rule}</span>
                          </div>
                          <span className="text-lg">{item.test ? "✅" : "❌"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: NUMERI PRIMI E SCOMPOSIZIONE */}
            {/* ======================================================== */}
            {selectedSubtopic === "prime-composite-numbers" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200/80 shadow-xs">
                      Lezione 3 · I Mattoncini dell'Universo Numerico
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Numeri Primi e la Scomposizione in Fattori Primi
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Un numero primo ha <strong>esattamente due divisori</strong>: 1 e se stesso. Tutti gli altri numeri si chiamano <strong>composti</strong> e possono essere "smontati" in un prodotto unico di numeri primi (la loro carta d'identità!).
                    </p>
                  </div>

                  {/* Curiosità e Regole sui Primi */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center gap-1.5 text-center">
                      <span className="inline-flex items-center text-xs font-black text-amber-800 uppercase bg-white px-3 py-1 rounded-full border border-amber-200">
                        L'1 NON è Primo
                      </span>
                      <p className="text-xs text-slate-600">Ha un solo divisore (se stesso). La definizione richiede 2 divisori distinti!</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col items-center gap-1.5 text-center">
                      <span className="inline-flex items-center text-xs font-black text-dida-blue uppercase bg-white px-3 py-1 rounded-full border border-blue-200">
                        Il 2: L'Unico Primo Pari
                      </span>
                      <p className="text-xs text-slate-600">Tutti gli altri numeri pari sono divisibili per 2, quindi sono composti!</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center gap-1.5 text-center">
                      <span className="inline-flex items-center text-xs font-black text-emerald-800 uppercase bg-white px-3 py-1 rounded-full border border-emerald-200">
                        I Primi sono Infiniti
                      </span>
                      <p className="text-xs text-slate-600">Dimostrato oltre 2300 anni fa da Euclide di Alessandria!</p>
                    </div>
                  </div>

                  {/* L'Albero dei Fattori: Alberi diversi, stesse foglie! */}
                  <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black uppercase text-purple-700">
                        Teorema Fondamentale dell'Aritmetica
                      </span>
                      <h3 className="text-xl font-black text-slate-900">L'Albero dei Fattori: Alberi Diversi, Stesse Foglie!</h3>
                      <p className="text-xs text-slate-600 max-w-lg mx-auto">
                        Qualunque strada scegli per scomporre il numero 60, le foglie finali (i fattori primi) saranno sempre le stesse:
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 font-mono text-center text-lg font-black text-purple-900 max-w-md mx-auto shadow-sm">
                      60 = 2 × 2 × 3 × 5 = <span className="text-dida-blue">2² × 3 × 5</span>
                    </div>

                    {/* Laboratorio: scomponi il tuo numero in colonna */}
                    <div className="p-5 rounded-2xl bg-white border-2 border-purple-200 space-y-4 max-w-xl mx-auto">
                      <p className="text-xs font-black uppercase text-purple-700 text-center">Laboratorio · Scomponi il tuo numero</p>
                      <div className="flex justify-center">
                        <NumberField label="Numero da scomporre" value={treeNum} onChange={setTreeNum} min={2} max={9999} />
                      </div>
                      <div className="flex justify-center">
                        <table className="font-mono text-base font-bold text-slate-800">
                          <tbody>
                            {treeSteps.map(([n, p], i) => (
                              <tr key={i}>
                                <td className="pr-4 text-right border-r-2 border-slate-400">{n}</td>
                                <td className="pl-4 text-purple-700">{p}</td>
                              </tr>
                            ))}
                            <tr>
                              <td className="pr-4 text-right border-r-2 border-slate-400">1</td>
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-center font-mono text-lg font-black text-purple-900">
                        {treeNum} = {treeSteps.length === 1 ? `${treeNum} (è un numero primo!)` : formatFactors(factorize(treeNum))}
                      </p>
                    </div>

                    {/* Scorciatoia degli zeri */}
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-center text-xs space-y-1">
                      <span className="text-amber-900 font-bold block">
                        💡 La Scorciatoia degli Zeri per i Numeri Grandi
                      </span>
                      <p className="text-amber-950">
                        Ogni zero finale vale un fattore 10, cioè <span className="font-mono font-bold">2 × 5</span>! <br />
                        <span className="font-mono font-bold">300 = 3 × 100 = 3 × 2² × 5²</span> (istantaneo!).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: IL MASSIMO COMUNE DIVISORE (M.C.D.) */}
            {/* ======================================================== */}
            {selectedSubtopic === "gcd" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 4 · Dividere in Parti Uguali (Spezzare)
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Il Massimo Comune Divisore (M.C.D.)
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Il <strong>M.C.D.</strong> di due o più numeri è il <strong>più grande tra tutti i loro divisori comuni</strong>. Risponde alla domanda: <em>«Quanti gruppi uguali al massimo posso formare senza avanzi?»</em>.
                    </p>
                  </div>

                  {/* Selettore delle Strategie */}
                  <div className="flex justify-center flex-wrap gap-2">
                    {[
                      { id: "sacchetti", label: "🍬 Esempio Reale (Sacchetti)" },
                      { id: "elenco", label: "📋 Metodo 1: L'Elenco" },
                      { id: "venn", label: "⭕ Metodo 2: Diagramma di Venn" },
                      { id: "scomposizione", label: "⚙️ Metodo 3: Scomposizione" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setMcdStrategy(s.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          mcdStrategy === s.id
                            ? "bg-dida-blue text-white border-blue-600 shadow-md scale-105"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* STRATEGIA: Sacchetti di Caramelle (Esempio Intuitivo) */}
                  {mcdStrategy === "sacchetti" && (
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-amber-50 border-2 border-blue-200 space-y-4">
                      <div className="text-center flex flex-col items-center gap-2.5">
                        <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100/70 px-3.5 py-1 rounded-full">
                          L'Esempio Intuitivo della Festa
                        </span>
                        <h3 className="text-xl font-black text-slate-900">I Sacchetti di Caramelle</h3>
                        <p className="text-xs text-slate-600 max-w-xl mx-auto">
                          Hai <strong>12 caramelle alla fragola</strong> e <strong>18 alla menta</strong>. Vuoi preparare sacchetti regalo <strong>tutti uguali</strong>, usando tutte le caramelle senza avanzi. Quanti sacchetti puoi fare al massimo?
                        </p>
                      </div>

                      <div className="p-6 bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto text-center space-y-3 shadow-sm">
                        <div className="text-sm font-bold text-slate-700">
                          Il numero di sacchetti deve dividere sia 12 sia 18:
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          Divisori di 12: 1, 2, 3, 4, <strong>6</strong>, 12 <br />
                          Divisori di 18: 1, 2, 3, <strong>6</strong>, 9, 18
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl font-mono text-base font-black text-emerald-800 border border-emerald-200">
                          M.C.D.(12, 18) = 6 sacchetti al massimo!
                        </div>
                        <div className="text-xs text-slate-600">
                          In ogni sacchetto ci saranno: <br />
                          <strong>12 : 6 = 2 fragole</strong> e <strong>18 : 6 = 3 mente</strong>!
                        </div>
                      </div>
                    </div>
                  )}

                  {mcdStrategy !== "sacchetti" && (
                    <div className="flex justify-center gap-6">
                      <NumberField label="Primo numero" value={mcdNumA} onChange={setMcdNumA} min={1} max={200} />
                      <NumberField label="Secondo numero" value={mcdNumB} onChange={setMcdNumB} min={1} max={200} />
                    </div>
                  )}

                  {/* STRATEGIA: Metodo dell'Elenco */}
                  {mcdStrategy === "elenco" && (
                    <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
                      <span className="text-xs font-black uppercase text-dida-blue block text-center">
                        Metodo 1: Scrivere l'Elenco dei Divisori
                      </span>
                      <div className="max-w-md mx-auto space-y-3 font-mono text-sm">
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          D({mcdCalc.a}) = &#123; {mcdCalc.divA.map((d, i) => (
                            <React.Fragment key={d}>{i > 0 && ", "}{mcdCalc.common.includes(d) ? <strong>{d}</strong> : d}</React.Fragment>
                          ))} &#125;
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          D({mcdCalc.b}) = &#123; {mcdCalc.divB.map((d, i) => (
                            <React.Fragment key={d}>{i > 0 && ", "}{mcdCalc.common.includes(d) ? <strong>{d}</strong> : d}</React.Fragment>
                          ))} &#125;
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs font-sans text-dida-blue">
                          Divisori comuni: {mcdCalc.common.join(", ")}. Il più grande è <strong>{mcdCalc.mcd}</strong>!
                        </div>
                        <div className="text-center text-lg font-black text-emerald-700">
                          M.C.D.({mcdCalc.a}, {mcdCalc.b}) = {mcdCalc.mcd}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STRATEGIA: Diagramma di Venn */}
                  {mcdStrategy === "venn" && (
                    <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
                      <span className="text-xs font-black uppercase text-purple-700 block text-center">
                        Metodo 2: Il Diagramma di Eulero-Venn
                      </span>
                      <div className="flex justify-center py-2">
                        {/* SVG Venn M.C.D. */}
                        <svg viewBox="0 0 420 230" className="w-full max-w-md select-none">
                          <circle cx="150" cy="110" r="95" fill="#DBEAFE" fillOpacity="0.7" stroke="#3B82F6" strokeWidth="3" />
                          <circle cx="270" cy="110" r="95" fill="#FEF3C7" fillOpacity="0.7" stroke="#F59E0B" strokeWidth="3" />
                          <text x="70" y="22" className="font-bold text-sm fill-blue-700">D({mcdCalc.a})</text>
                          <text x="350" y="22" textAnchor="end" className="font-bold text-sm fill-amber-700">D({mcdCalc.b})</text>

                          {/* Divisori solo del primo, solo del secondo e comuni (nell'intersezione) */}
                          {[
                            { items: mcdCalc.soloA, x: 105, perRow: 3 },
                            { items: mcdCalc.soloB, x: 315, perRow: 3 },
                            { items: mcdCalc.common, x: 210, perRow: 3 },
                          ].map(({ items, x, perRow }) => {
                            const rows = Math.ceil(items.length / perRow);
                            return Array.from({ length: rows }, (_, row) => (
                              <text
                                key={`${x}-${row}`}
                                x={x}
                                y={114 + (row - (rows - 1) / 2) * 17}
                                textAnchor="middle"
                                className={`font-mono text-xs ${x === 210 ? "font-bold fill-slate-900" : "fill-slate-800"}`}
                              >
                                {items.slice(row * perRow, row * perRow + perRow).join(", ")}
                              </text>
                            ));
                          })}
                          <text x="210" y="224" textAnchor="middle" className="font-mono text-sm font-black fill-emerald-700">M.C.D. = {mcdCalc.mcd}</text>
                        </svg>
                      </div>
                      <p className="text-xs text-slate-600 text-center">
                        Nell'intersezione ci sono i divisori in comune &#123;{mcdCalc.common.join(", ")}&#125;. Il più grande dell'intersezione è <strong>{mcdCalc.mcd}</strong>!
                      </p>
                    </div>
                  )}

                  {/* STRATEGIA: Scomposizione in fattori primi */}
                  {mcdStrategy === "scomposizione" && (
                    <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
                      <span className="text-xs font-black uppercase text-emerald-700 block text-center">
                        Metodo 3: La Ricetta della Scomposizione (Per Numeri Grandi)
                      </span>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto space-y-2 font-mono text-xs">
                        <div>{mcdCalc.a} = {formatFactors(mcdCalc.factA)}</div>
                        <div>{mcdCalc.b} = {formatFactors(mcdCalc.factB)}</div>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 font-sans border border-emerald-200">
                          <strong>La regola:</strong> prendi <em>SOLO i fattori COMUNI</em>
                          {mcdCalc.factMcd.length > 0 ? ` (${mcdCalc.factMcd.map(([p]) => p).join(" e ")})` : ""}, ciascuno con l'<em>esponente MINORE</em>!
                          <div className="font-mono font-black text-sm pt-1">
                            {mcdCalc.factMcd.length === 0
                              ? `Nessun fattore comune: M.C.D.(${mcdCalc.a}, ${mcdCalc.b}) = 1`
                              : `M.C.D.(${mcdCalc.a}, ${mcdCalc.b}) = ${formatFactors(mcdCalc.factMcd)} = ${mcdCalc.mcd}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Due Casi Speciali al Volo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-center space-y-1">
                      <span className="text-xs font-black uppercase text-amber-900">Numeri Primi tra Loro</span>
                      <p className="font-mono font-bold text-sm text-slate-800">M.C.D.(10, 9) = 1</p>
                      <p className="text-[11px] text-slate-600">Non hanno divisori comuni tranne l'1!</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-300 text-center space-y-1">
                      <span className="text-xs font-black uppercase text-dida-blue">Uno è Divisore dell'Altro</span>
                      <p className="font-mono font-bold text-sm text-slate-800">M.C.D.(6, 18) = 6</p>
                      <p className="text-[11px] text-slate-600">Il più piccolo è già il divisore comune massimo!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: IL MINIMO COMUNE MULTIPLO (m.c.m.) */}
            {/* ======================================================== */}
            {selectedSubtopic === "lcm" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
                      Lezione 5 · Quando ci Rincontriamo? (Ritrovarsi)
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Il Minimo Comune Multiplo (m.c.m.)
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Il <strong>m.c.m.</strong> di due o più numeri è il <strong>più piccolo tra tutti i loro multipli comuni</strong> (escluso lo zero). Risponde alla domanda: <em>«Dopo quanto tempo ci ritroviamo insieme?»</em> oppure <em>«Quanti ne compro per pareggiare le confezioni?»</em>.
                    </p>
                  </div>

                  {/* Selettore delle Strategie per m.c.m. */}
                  <div className="flex justify-center flex-wrap gap-2">
                    {[
                      { id: "calendario", label: "📅 Esempio Reale (Calendario)" },
                      { id: "elenco", label: "📋 Metodo 1: L'Elenco" },
                      { id: "venn", label: "⭕ Metodo 2: Diagramma di Venn" },
                      { id: "scomposizione", label: "⚙️ Metodo 3: Scomposizione" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setMcmStrategy(s.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          mcmStrategy === s.id
                            ? "bg-emerald-600 text-white border-emerald-700 shadow-md scale-105"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* STRATEGIA: Calendario Allenamenti */}
                  {mcmStrategy === "calendario" && (
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 border-2 border-emerald-200 space-y-4">
                      <div className="text-center flex flex-col items-center gap-2.5">
                        <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-full">
                          L'Esempio Intuitivo del Centro Sportivo
                        </span>
                        <h3 className="text-xl font-black text-slate-900">Quando ci Rincontriamo?</h3>
                        <p className="text-xs text-slate-600 max-w-xl mx-auto">
                          Luca va a calcio <strong>ogni 4 giorni</strong>. Sara va in piscina <strong>ogni 6 giorni</strong>. Oggi si sono incontrati. Tra quanti giorni si ritroveranno di nuovo insieme?
                        </p>
                      </div>

                      <div className="p-6 bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto text-center space-y-3 shadow-sm">
                        <div className="text-xs font-mono space-y-1 text-slate-700">
                          <div>Giorni di Luca: 4, 8, <strong className="text-emerald-600 text-base">12</strong>, 16, 20, <strong className="text-emerald-600 text-base">24</strong>…</div>
                          <div>Giorni di Sara: 6, <strong className="text-emerald-600 text-base">12</strong>, 18, <strong className="text-emerald-600 text-base">24</strong>…</div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl font-mono text-base font-black text-emerald-800 border border-emerald-200">
                          m.c.m.(4, 6) = 12 giorni!
                        </div>
                        <p className="text-xs text-slate-600">
                          Si ritroveranno per la prima volta tra <strong>12 giorni</strong> (e poi tra 24, 36 giorni...). 12 è il <strong>minimo comune multiplo</strong>!
                        </p>
                      </div>
                    </div>
                  )}

                  {mcmStrategy !== "calendario" && (
                    <div className="flex justify-center gap-6">
                      <NumberField label="Primo numero" value={mcmNumA} onChange={setMcmNumA} min={1} max={30} />
                      <NumberField label="Secondo numero" value={mcmNumB} onChange={setMcmNumB} min={1} max={30} />
                    </div>
                  )}

                  {/* STRATEGIA: Metodo dell'Elenco */}
                  {mcmStrategy === "elenco" && (
                    <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
                      <span className="text-xs font-black uppercase text-emerald-700 block text-center">
                        Metodo 1: L'Elenco dei Primi Multipli
                      </span>
                      <div className="max-w-md mx-auto space-y-3 font-mono text-sm">
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          M({mcmCalc.a}) = &#123; {shortList(mcmCalc.multA.filter(m => m <= mcmCalc.mcm))}… &#125;
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          M({mcmCalc.b}) = &#123; {shortList(mcmCalc.multB.filter(m => m <= mcmCalc.mcm))}… &#125;
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-sans text-emerald-800 text-center">
                          Il primo multiplo comune incontrato (diverso da zero) è <strong>{mcmCalc.mcm}</strong>!
                        </div>
                        <div className="text-center text-lg font-black text-emerald-700">
                          m.c.m.({mcmCalc.a}, {mcmCalc.b}) = {mcmCalc.mcm}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STRATEGIA: Diagramma di Venn */}
                  {mcmStrategy === "venn" && (
                    <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4 text-center">
                      <span className="text-xs font-black uppercase text-sky-700 block">
                        Metodo 2: Intersezione dei Multipli
                      </span>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto font-mono text-xs space-y-2">
                        <div>
                          Multipli in comune M({mcmCalc.a}) ∩ M({mcmCalc.b}) = &#123; <strong className="text-emerald-600">{mcmCalc.mcm}</strong>,{" "}
                          {[2, 3, 4].map(k => mcmCalc.mcm * k).join(", ")}… &#125;
                        </div>
                        <div className="p-2 bg-sky-50 text-sky-900 rounded-lg">
                          Il m.c.m. è il <strong>minimo elemento</strong> dell'intersezione: <strong>{mcmCalc.mcm}</strong>!
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STRATEGIA: Scomposizione in Fattori Primi */}
                  {mcmStrategy === "scomposizione" && (
                    <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
                      <span className="text-xs font-black uppercase text-emerald-700 block text-center">
                        Metodo 3: La Ricetta del m.c.m. con la Scomposizione
                      </span>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto space-y-2 font-mono text-xs">
                        <div>{mcmCalc.a} = {formatFactors(mcmCalc.factA)}</div>
                        <div>{mcmCalc.b} = {formatFactors(mcmCalc.factB)}</div>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 font-sans border border-emerald-200">
                          <strong>La regola:</strong> prendi <em>TUTTI i fattori (comuni e non comuni)</em>, ciascuno una sola volta con l'<em>esponente MAGGIORE</em>!
                          <div className="font-mono font-black text-sm pt-1">
                            m.c.m.({mcmCalc.a}, {mcmCalc.b}) = {formatFactors(mcmCalc.factMcm)} = {mcmCalc.mcm}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Due Casi Speciali al Volo per m.c.m. */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-center space-y-1">
                      <span className="text-xs font-black uppercase text-amber-900">Se sono Primi tra Loro</span>
                      <p className="font-mono font-bold text-sm text-slate-800">m.c.m.(5, 6) = 5 × 6 = 30</p>
                      <p className="text-[11px] text-slate-600">Il m.c.m. è semplicemente il loro prodotto! (mentre il M.C.D. è 1)</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-1">
                      <span className="text-xs font-black uppercase text-emerald-900">Uno è Multiplo dell'Altro</span>
                      <p className="font-mono font-bold text-sm text-slate-800">m.c.m.(9, 18) = 18</p>
                      <p className="text-[11px] text-slate-600">Il più grande è già il multiplo comune minimo! (mentre 9 è il M.C.D.)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 6: M.C.D. O m.c.m.? COME RICONOSCERLI */}
            {/* ======================================================== */}
            {selectedSubtopic === "gcd-lcm-problems" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200/80 shadow-xs">
                      Lezione 6 · Guida per i Problemi
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      M.C.D. o m.c.m.? La Bussola per Risolvere i Problemi
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Quando leggi il testo di un problema, poniti sempre la domanda fondamentale: <strong>devo SPEZZARE in gruppi uguali oppure devo capire quando cose diverse si RITROVANO insieme?</strong>
                    </p>
                  </div>

                  {/* La Bussola delle Parole Spia */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-300 space-y-3">
                      <div className="flex items-center gap-2">
                        <Scissors className="text-dida-blue" size={24} />
                        <h3 className="text-xl font-black text-slate-900">SPEZZARE → M.C.D.</h3>
                      </div>
                      <p className="text-xs text-slate-600">
                        Devo <strong>dividere</strong> quantità diverse in parti uguali, sacchetti uguali, o pezzi più lunghi possibile senza scarti.
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs space-y-1">
                        <span className="font-bold text-dida-blue block">Parole Spia:</span>
                        <p className="text-slate-600"><em>«il massimo numero di confezioni», «dividere in gruppi uguali», «pezzi più lunghi possibile»</em></p>
                        <span className="text-[10px] text-amber-700 font-bold block pt-1">
                          Il risultato è PIÙ PICCOLO dei dati!
                        </span>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-emerald-600" size={24} />
                        <h3 className="text-xl font-black text-slate-900">RITROVARSI → m.c.m.</h3>
                      </div>
                      <p className="text-xs text-slate-600">
                        Eventi periodici che <strong>si ripetono</strong> a intervalli regolari e devo scoprire quando avverranno contemporaneamente di nuovo.
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1">
                        <span className="font-bold text-emerald-700 block">Parole Spia:</span>
                        <p className="text-slate-600"><em>«ogni quanti giorni», «di nuovo insieme», «contemporaneamente», «pareggiare le confezioni»</em></p>
                        <span className="text-[10px] text-amber-700 font-bold block pt-1">
                          Il risultato è PIÙ GRANDE dei dati!
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tabella di Confronto Speculare */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-2xl overflow-hidden">
                      <thead className="bg-slate-100 text-slate-800 font-black">
                        <tr>
                          <th className="p-3 border border-slate-200">Caratteristica</th>
                          <th className="p-3 border border-slate-200 text-dida-blue">M.C.D.</th>
                          <th className="p-3 border border-slate-200 text-emerald-700">m.c.m.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-3 font-bold">Cosa cerco?</td>
                          <td className="p-3">Il divisore comune più <strong>GRANDE</strong></td>
                          <td className="p-3">Il multiplo comune più <strong>PICCOLO</strong></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold">Quali fattori scelgo?</td>
                          <td className="p-3">Solo i fattori <strong>COMUNI</strong></td>
                          <td className="p-3">Fattori <strong>COMUNI e NON COMUNI</strong></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold">Quale esponente?</td>
                          <td className="p-3">L'esponente <strong>MINORE</strong></td>
                          <td className="p-3">L'esponente <strong>MAGGIORE</strong></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold">Se uno è multiplo dell'altro (es. 9 e 18)</td>
                          <td className="p-3">Il più <strong>piccolo</strong> (9)</td>
                          <td className="p-3">Il più <strong>grande</strong> (18)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold">Se sono primi tra loro (es. 5 e 6)</td>
                          <td className="p-3">Vale sempre <strong>1</strong></td>
                          <td className="p-3">È il loro <strong>prodotto</strong> (5 × 6 = 30)</td>
                        </tr>
                      </tbody>
                    </table>
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
            key="tab-allena-div"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 px-4"
          >
            <div className="rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 shadow-lg text-center flex flex-col items-center gap-3.5">
              <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-amber-950 bg-white/30 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/40 shadow-xs">
                Palestra di Aritmetica · Livello 1ª Media
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Mettiti alla Prova con Divisori, M.C.D., m.c.m. e INVALSI
              </h2>
              <p className="text-amber-100 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Risolvi calcoli a colpo d'occhio, applica le diverse strategie e affronta i quesiti delle prove nazionali!
              </p>
            </div>

            {/* SEZIONE 1: Divisori e Criteri */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Attività 1 · Criteri e Divisori
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Divisibile o No?</h3>
                <p className="text-xs text-slate-500">Seleziona la risposta esatta.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 1,
                    q: "Il numero 2817 è divisibile per 9?",
                    options: [
                      { id: "a", label: "SÌ, perché 2 + 8 + 1 + 7 = 18", correct: true },
                      { id: "b", label: "NO, finisce con 7", correct: false },
                      { id: "c", label: "SÌ, perché è dispari", correct: false },
                    ],
                    explain: "La somma delle cifre è 18, che è un multiplo di 9!"
                  },
                  {
                    id: 2,
                    q: "Quale tra questi numeri è un NUMERO PRIMO?",
                    options: [
                      { id: "a", label: "27", correct: false },
                      { id: "b", label: "1", correct: false },
                      { id: "c", label: "41", correct: true },
                    ],
                    explain: "41 si può dividere solo per 1 e per 41!"
                  },
                  {
                    id: 3,
                    q: "Qual è il M.C.D. tra 10 e 9?",
                    options: [
                      { id: "a", label: "90", correct: false },
                      { id: "b", label: "1", correct: true },
                      { id: "c", label: "0", correct: false },
                    ],
                    explain: "10 e 9 non hanno fattori primi in comune: il loro M.C.D. è 1!"
                  },
                  {
                    id: 4,
                    q: "Qual è il m.c.m. tra 4 e 6?",
                    options: [
                      { id: "a", label: "24", correct: false },
                      { id: "b", label: "12", correct: true },
                      { id: "c", label: "2", correct: false },
                    ],
                    explain: "12 è il più piccolo multiplo comune di 4 e 6 (4×3 = 12, 6×2 = 12)!"
                  },
                ].map((item) => {
                  const ans = exDivAnswers[item.id];
                  return (
                    <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <p className="text-sm font-bold text-slate-800">{item.q}</p>
                      <div className="flex flex-col gap-2">
                        {item.options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setExDivAnswers(prev => ({ ...prev, [item.id]: opt.id }))}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border text-left transition cursor-pointer ${
                              ans === opt.id
                                ? opt.correct
                                  ? "bg-emerald-500 text-white border-emerald-600"
                                  : "bg-rose-500 text-white border-rose-600"
                                : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {ans && (
                        <p className="text-xs font-semibold text-slate-600">
                          {ans === item.options.find(o => o.correct)?.id
                            ? `✅ ${item.explain}`
                            : "❌ Riprova, rifletti sulle regole!"}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE 1b: Calcola tu M.C.D. e m.c.m. */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                    Attività 2 · Calcola tu
                  </span>
                  <h3 className="text-xl font-black text-slate-800 mt-1">Scrivi il risultato</h3>
                  <p className="text-xs text-slate-500">Usa il metodo che preferisci: elenco, Venn o scomposizione.</p>
                </div>
                <button
                  onClick={() => setExCalcAnswers({})}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer self-center"
                >
                  <RotateCcw size={14} /> Azzera Risposte
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 1, kind: "M.C.D.", a: 18, b: 24 },
                  { id: 2, kind: "m.c.m.", a: 10, b: 15 },
                  { id: 3, kind: "M.C.D.", a: 36, b: 48 },
                  { id: 4, kind: "m.c.m.", a: 6, b: 9 },
                ].map((item) => {
                  const correct = item.kind === "M.C.D." ? gcd(item.a, item.b) : lcm(item.a, item.b);
                  const raw = exCalcAnswers[item.id] ?? "";
                  const answered = raw.trim() !== "";
                  const isCorrect = answered && parseInt(raw) === correct;
                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border space-y-2 ${
                        !answered ? "bg-slate-50 border-slate-200" : isCorrect ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono font-black text-slate-800">{item.kind}({item.a}, {item.b}) =</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={raw}
                          onChange={(e) => setExCalcAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                          className="w-24 text-center font-mono text-lg font-black bg-white border-2 border-slate-300 rounded-xl py-1 focus:outline-none focus:border-dida-orange"
                          aria-label={`${item.kind} di ${item.a} e ${item.b}`}
                        />
                      </div>
                      {answered && (
                        <p className={`text-xs font-semibold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          {isCorrect
                            ? `✅ Esatto: ${item.a} = ${formatFactors(factorize(item.a))}, ${item.b} = ${formatFactors(factorize(item.b))}.`
                            : item.kind === "M.C.D."
                              ? "❌ Riprova: cerca il divisore comune PIÙ GRANDE (fattori comuni, esponente minore)."
                              : "❌ Riprova: cerca il multiplo comune PIÙ PICCOLO (tutti i fattori, esponente maggiore)."}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE 2: PROVE INVALSI (Tratte direttamente dalle slide!) */}
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
                      Come alle Prove INVALSI: Multipli e Divisibilità
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-semibold">Quesiti ufficiali di logica aritmetica</span>
              </div>

              {/* Quesito INVALSI 1: La Cifra Nascosta */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Quesito 1 · La Cifra Nascosta
                </span>
                <p className="text-sm font-bold text-slate-800">
                  Nel numero <span className="font-mono text-base font-extrabold text-amber-700">44▲</span> la cifra delle unità è coperta da una macchia. <br />
                  Quale di queste cifre rende il numero <strong className="text-dida-blue">DIVISIBILE PER 3</strong>?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "Cifra 0 (440)", correct: false },
                    { id: "B", val: "Cifra 1 (441)", correct: true },
                    { id: "C", val: "Cifra 2 (442)", correct: false },
                    { id: "D", val: "Cifra 3 (443)", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, q1: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                        invalsiAnswers.q1 === opt.id
                          ? opt.correct
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : "bg-rose-500 text-white border-rose-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt.val}
                    </button>
                  ))}
                </div>
                {invalsiAnswers.q1 && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.q1 === "B"
                      ? "✅ Esatto: 4 + 4 + 1 = 9, che è un multiplo di 3! Quindi 441 è divisibile per 3."
                      : "❌ Ricorda: la somma delle cifre 4 + 4 + ▲ deve essere nella tabellina del 3!"}
                  </p>
                )}
              </div>

              {/* Quesito INVALSI 2: Sport e Ritrovarsi */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-dida-blue bg-blue-100 px-3 py-1 rounded-full">
                  Quesito 2 · Filippo e gli Allenamenti
                </span>
                <p className="text-sm font-bold text-slate-800">
                  Filippo fa <strong>nuoto ogni 3 giorni</strong>, <strong>corsa ogni 6 giorni</strong> e <strong>bicicletta ogni 8 giorni</strong>. Oggi ha fatto tutti e tre gli sport contemporaneamente. <br />
                  Tra quanti giorni si allenerà di nuovo in tutti e tre gli sport nello stesso giorno?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "8 giorni", correct: false },
                    { id: "B", val: "12 giorni", correct: false },
                    { id: "C", val: "24 giorni", correct: true },
                    { id: "D", val: "48 giorni", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, q2: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                        invalsiAnswers.q2 === opt.id
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
                {invalsiAnswers.q2 && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.q2 === "C"
                      ? "✅ Bravissimo! È un problema di RITROVARSI, quindi serve il m.c.m.(3, 6, 8) = 24 giorni!"
                      : "❌ Si tratta di un problema di coincidenza nel tempo: devi calcolare il m.c.m. tra 3, 6 e 8."}
                  </p>
                )}
              </div>

              {/* SEZIONE 3: Sfida Finale Vero o Falso */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Sfida Finale · Vero o Falso
                </span>
                <p className="text-xs text-slate-500">Metti alla prova la tua comprensione:</p>

                <div className="space-y-3">
                  {[
                    { id: 1, text: "Il numero 1 è un numero primo.", correct: false, note: "Falso: l'1 ha un solo divisore!" },
                    { id: 2, text: "Il 2 è l'unico numero primo pari.", correct: true, note: "Vero: tutti gli altri numeri pari sono divisibili per 2." },
                    { id: 3, text: "15 e 16 sono numeri primi tra loro.", correct: true, note: "Vero: il loro M.C.D. è 1." },
                    { id: 4, text: "Il m.c.m. tra 4 e 6 è 24.", correct: false, note: "Falso: il MINIMO è 12!" },
                    { id: 5, text: "531 è divisibile per 9.", correct: true, note: "Vero: 5 + 3 + 1 = 9." },
                    { id: 6, text: "Il M.C.D. non può mai superare il più piccolo dei numeri.", correct: true, note: "Vero: un divisore non può essere più grande del numero stesso!" },
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
