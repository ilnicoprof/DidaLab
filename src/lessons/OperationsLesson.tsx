import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, BookOpen, Zap, CheckCircle2, XCircle, Sparkles,
  ChevronRight, RotateCcw, AlertCircle, Info, Award, HelpCircle,
  Plus, Minus, X, Divide, Calculator, ShoppingBag, SplitSquareVertical,
  Check, Star, Users, DollarSign
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
  { id: "addition-properties", title: "L'Addizione e le sue Proprietà", short: "1. Addizione (+)" },
  { id: "subtraction-properties", title: "La Sottrazione e l'Invariantiva", short: "2. Sottrazione (−)" },
  { id: "multiplication-properties", title: "La Moltiplicazione e la Distributiva", short: "3. Moltiplicazione (×)" },
  { id: "division-properties", title: "La Divisione e i Casi Particolari", short: "4. Divisione (:)" },
  { id: "expressions-order", title: "Le Espressioni e le Precedenze", short: "5. Espressioni" },
  { id: "problem-solving-methods", title: "Risolvere i Problemi con i Segmenti", short: "6. Problemi" },
];

export default function OperationsLesson({
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
    return "addition-properties";
  });

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // Modulo 1: Cassiere Veloce (Addizione)
  const [scontrinoStep, setScontrinoStep] = useState<number>(0);

  // Modulo 2: Differenza d'Età (Sottrazione Invariantiva)
  const [etaAnni, setEtaAnni] = useState<number>(0); // anni nel futuro (+4) o passato (-3)

  // Modulo 3: Rettangolo Distributivo (Moltiplicazione)
  const [distribBaseDecine, setDistribBaseDecine] = useState<number>(20);
  const [distribBaseUnita, setDistribBaseUnita] = useState<number>(7);
  const [distribAltezza, setDistribAltezza] = useState<number>(3);

  // Modulo 4: Divisione con Resto
  const [divCaramelle, setDivCaramelle] = useState<number>(23);
  const [divAmici, setDivAmici] = useState<number>(4);

  // Modulo 5: Gioco dei Quattro 4
  const [fourResultChoice, setFourResultChoice] = useState<number>(0);

  // Modulo 6: Metodo dei Segmenti (Somma e Differenza)
  const [segSomma, setSegSomma] = useState<number>(36);
  const [segDiff, setSegDiff] = useState<number>(6);

  // ==========================================
  // --- STATI ESERCIZI (ALLENA) ---
  // ==========================================
  const [exPropAnswers, setExPropAnswers] = useState<Record<number, string | null>>({});
  const [exMentalAnswers, setExMentalAnswers] = useState<Record<number, string>>({});
  const [exZeroAnswers, setExZeroAnswers] = useState<Record<number, string | null>>({});
  const [exExprAnswers, setExExprAnswers] = useState<Record<number, number | null>>({});
  const [invalsiAnswers, setInvalsiAnswers] = useState<Record<string, any>>({});
  const [vfAnswers, setVfAnswers] = useState<Record<number, boolean | null>>({});

  // Calcolo segmenti per problemi
  const segmentiCalc = useMemo(() => {
    if (segSomma < segDiff) return { minore: 0, maggiore: 0, valido: false };
    const diffVal = segSomma - segDiff;
    if (diffVal % 2 !== 0) {
      // per numeri con virgola ammissibili
      const minore = (segSomma - segDiff) / 2;
      const maggiore = minore + segDiff;
      return { minore, maggiore, valido: true };
    }
    const minore = (segSomma - segDiff) / 2;
    const maggiore = minore + segDiff;
    return { minore, maggiore, valido: true };
  }, [segSomma, segDiff]);

  // Lista soluzioni del gioco dei quattro 4
  const fourFourSolutions: Record<number, { expr: string; explain: string }> = {
    0: { expr: "44 − 44 = 0 oppure 4 − 4 + 4 − 4 = 0", explain: "(4 − 4) fa 0, sommato a un altro 0 dà 0!" },
    1: { expr: "(44 : 44) = 1 oppure (4 : 4) × (4 : 4) = 1", explain: "Qualsiasi numero diviso per se stesso fa 1!" },
    2: { expr: "(4 : 4) + (4 : 4) = 2", explain: "1 + 1 = 2: due divisioni identiche sommate tra loro!" },
    3: { expr: "(4 + 4 + 4) : 4 = 3", explain: "12 diviso 4 = 3!" },
    4: { expr: "4 + (4 − 4) × 4 = 4", explain: "0 moltiplicato per 4 si annulla, rimane il primo 4!" },
    5: { expr: "(4 × 4 + 4) : 4 = 5", explain: "(16 + 4) : 4 = 20 : 4 = 5!" },
    6: { expr: "4 + (4 + 4) : 4 = 6", explain: "4 + (8 : 4) = 4 + 2 = 6!" },
    7: { expr: "44 : 4 − 4 = 7", explain: "11 − 4 = 7!" },
    8: { expr: "4 + 4 + 4 − 4 = 8", explain: "Sommi tre 4 e ne togli uno, rimangono due 4 sommati!" },
    9: { expr: "4 + 4 + (4 : 4) = 9", explain: "4 + 4 + 1 = 9!" },
  };

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
              Le Quattro Operazioni
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
            {/* MODULO 1: L'ADDIZIONE E LE SUE PROPRIETÀ */}
            {/* ======================================================== */}
            {selectedSubtopic === "addition-properties" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 1 · Mettere Insieme
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      L'Addizione: Termini e Proprietà
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      L'addizione è l'operazione che fa corrispondere a due numeri, detti <strong>addendi</strong>, un terzo numero chiamato <strong>somma</strong> (o totale).
                    </p>
                  </div>

                  {/* Schema dei Termini */}
                  <div className="flex items-center justify-center gap-3 md:gap-6 py-2">
                    <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 text-center w-28 md:w-36">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-dida-blue block mb-1">Addendo</span>
                      <span className="text-3xl font-black font-mono text-slate-800">16</span>
                    </div>
                    <span className="text-3xl font-black text-dida-blue">+</span>
                    <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 text-center w-28 md:w-36">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-dida-blue block mb-1">Addendo</span>
                      <span className="text-3xl font-black font-mono text-slate-800">13</span>
                    </div>
                    <span className="text-3xl font-black text-slate-400">=</span>
                    <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center w-28 md:w-36 shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">Somma</span>
                      <span className="text-3xl font-black font-mono text-emerald-800">29</span>
                    </div>
                  </div>

                  {/* Le 4 Proprietà dell'Addizione */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-black uppercase text-dida-blue block">1. Commutativa</span>
                      <p className="text-xs text-slate-600">
                        Cambiando l'ordine degli addendi, la somma non cambia: <br />
                        <strong className="font-mono text-slate-800 text-sm">a + b = b + a</strong>
                      </p>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-700">
                        16 + 9 = 9 + 16 = 25
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-black uppercase text-amber-600 block">2. Associativa</span>
                      <p className="text-xs text-slate-600">
                        Sostituendo a due addendi la loro somma, il risultato finale non cambia: <br />
                        <strong className="font-mono text-slate-800 text-sm">(a + b) + c = a + (b + c)</strong>
                      </p>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-700">
                        (7 + 3) + 12 = 10 + 12 = 22
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-black uppercase text-emerald-600 block">3. Elemento Neutro</span>
                      <p className="text-xs text-slate-600">
                        Lo <strong>0</strong> non modifica la somma: sommare zero lascia il numero identico: <br />
                        <strong className="font-mono text-slate-800 text-sm">a + 0 = a</strong>
                      </p>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-700">
                        45 + 0 = 45
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-black uppercase text-purple-600 block">4. Interna a ℕ</span>
                      <p className="text-xs text-slate-600">
                        La somma di due numeri naturali è <strong>sempre</strong> un numero naturale: <br />
                        <strong className="font-mono text-slate-800 text-sm">∀ a,b ∈ ℕ ⇒ (a+b) ∈ ℕ</strong>
                      </p>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-700">
                        Sempre possibile in ℕ!
                      </div>
                    </div>
                  </div>

                  {/* WIDGET INTERATTIVO: Il Cassiere più Veloce */}
                  <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                        Laboratorio Interattivo · Scorciatoie del Calcolo Mentale
                      </span>
                      <h3 className="text-xl font-black">Il Cassiere più Veloce: Trova le Coppie del 10 o 100</h3>
                      <p className="text-xs text-slate-400 max-w-xl mx-auto">
                        Invece di sommare in ordine, sfrutta le proprietà <strong>commutativa</strong> e <strong>associativa</strong> per unire numeri amici!
                      </p>
                    </div>

                    {/* Esempio scontrino a passi */}
                    <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 max-w-lg mx-auto space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700 pb-2">
                        <span>Scontrino spesa:</span>
                        <span className="text-amber-400 font-bold">4 articoli da sommare a mente</span>
                      </div>

                      <div className="flex justify-center items-center gap-2 font-mono text-lg font-bold">
                        <span className={`px-2.5 py-1 rounded-lg border ${scontrinoStep >= 1 ? "bg-amber-500/20 text-amber-300 border-amber-400" : "bg-slate-700 text-white border-slate-600"}`}>
                          7 €
                        </span>
                        <span>+</span>
                        <span className={`px-2.5 py-1 rounded-lg border ${scontrinoStep >= 1 ? "bg-sky-500/20 text-sky-300 border-sky-400" : "bg-slate-700 text-white border-slate-600"}`}>
                          18 €
                        </span>
                        <span>+</span>
                        <span className={`px-2.5 py-1 rounded-lg border ${scontrinoStep >= 1 ? "bg-amber-500/20 text-amber-300 border-amber-400" : "bg-slate-700 text-white border-slate-600"}`}>
                          3 €
                        </span>
                        <span>+</span>
                        <span className={`px-2.5 py-1 rounded-lg border ${scontrinoStep >= 1 ? "bg-sky-500/20 text-sky-300 border-sky-400" : "bg-slate-700 text-white border-slate-600"}`}>
                          12 €
                        </span>
                      </div>

                      {scontrinoStep >= 1 && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center font-mono text-sm space-y-1">
                          <p className="text-amber-300 font-bold">
                            = (7 + 3) + (18 + 12)
                          </p>
                          <p className="text-xs text-slate-400 font-sans">
                            Proprietà commutativa (sposto gli addendi) + associativa (raggruppo)!
                          </p>
                        </div>
                      )}

                      {scontrinoStep >= 2 && (
                        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500 text-center font-mono text-base font-black text-emerald-300">
                          = 10 € + 30 € = 40 € !
                        </div>
                      )}

                      <div className="flex justify-center gap-2 pt-2">
                        <button
                          onClick={() => setScontrinoStep((scontrinoStep + 1) % 3)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md"
                        >
                          {scontrinoStep === 0 ? "1. Raggruppa i numeri amici" : scontrinoStep === 1 ? "2. Calcola a mente!" : "Ricomincia"}
                        </button>
                      </div>
                    </div>

                    {/* Attenzione alla virgola nell'incolonnamento */}
                    <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center text-xs text-slate-300 space-y-1">
                      <span className="text-amber-400 font-bold uppercase tracking-wider block">
                        ⚠️ Regola Fondamentale per i Decimali in Colonna
                      </span>
                      <p>
                        Incolonna <strong>sempre la virgola sotto la virgola</strong>, e aggiungi gli zeri per pareggiare le cifre decimali:
                        <br />
                        <span className="font-mono text-white text-sm">39,60 + 78,00 + 17,09 = 134,69 €</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: LA SOTTRAZIONE E LA PROPRIETÀ INVARIANTIVA */}
            {/* ======================================================== */}
            {selectedSubtopic === "subtraction-properties" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200/80 shadow-xs">
                      Lezione 2 · Togliere e Trovare la Differenza
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      La Sottrazione e la Proprietà Invariantiva
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      La sottrazione è l'operazione <strong>inversa</strong> dell'addizione: calcola quanto manca al secondo numero per raggiungere il primo.
                    </p>
                  </div>

                  {/* Schema dei Termini */}
                  <div className="flex items-center justify-center gap-3 md:gap-6 py-2">
                    <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-200 text-center w-28 md:w-36">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block mb-1">Minuendo</span>
                      <span className="text-3xl font-black font-mono text-slate-800">42</span>
                    </div>
                    <span className="text-3xl font-black text-dida-orange">−</span>
                    <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-200 text-center w-28 md:w-36">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block mb-1">Sottraendo</span>
                      <span className="text-3xl font-black font-mono text-slate-800">17</span>
                    </div>
                    <span className="text-3xl font-black text-slate-400">=</span>
                    <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center w-28 md:w-36 shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">Differenza</span>
                      <span className="text-3xl font-black font-mono text-emerald-800">25</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center space-y-1">
                    <span className="text-xs font-black uppercase text-amber-900">
                      La Prova della Sottrazione:
                    </span>
                    <p className="font-mono font-bold text-sm text-amber-950">
                      Differenza + Sottraendo = Minuendo &nbsp; (25 + 17 = 42 ✓)
                    </p>
                  </div>

                  {/* Proprietà e Vincoli */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 space-y-2">
                      <span className="text-xs font-black uppercase text-rose-700">
                        NON è Commutativa e NON è Interna a ℕ!
                      </span>
                      <h4 className="font-black text-slate-800">15 − 5 ≠ 5 − 15</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Se hai 5 € in tasca, non puoi spenderne 15 €! Nell'insieme dei numeri naturali ℕ, la sottrazione <span className="font-mono font-bold">a − b</span> è possibile solo se <span className="font-mono font-bold">a ≥ b</span>.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 space-y-2">
                      <span className="text-xs font-black uppercase text-dida-blue">
                        La Proprietà Invariantiva
                      </span>
                      <h4 className="font-black text-slate-800">(a ± n) − (b ± n) = a − b</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Se aggiungi o sottrai lo <strong>stesso numero</strong> sia al minuendo sia al sottraendo, la differenza rimane identica!
                      </p>
                    </div>
                  </div>

                  {/* WIDGET INTERATTIVO: La Differenza d'Età Non Cambia Mai */}
                  <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                        Laboratorio Interattivo · La Differenza nel Tempo
                      </span>
                      <h3 className="text-xl font-black">La Differenza d'Età Non Cambia Mai</h3>
                      <p className="text-xs text-slate-400 max-w-xl mx-auto">
                        Agnese ha 12 anni e Camilla ha 5 anni. Quanti anni di differenza ci sono? Cambia gli anni per vedere l'invariantiva in azione:
                      </p>
                    </div>

                    <div className="flex justify-center gap-2">
                      {[-3, 0, 4, 10].map((shift) => (
                        <button
                          key={shift}
                          onClick={() => setEtaAnni(shift)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            etaAnni === shift
                              ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md"
                              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          {shift === 0 ? "Oggi" : shift > 0 ? `Tra ${shift} anni` : `${Math.abs(shift)} anni fa`}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto text-center font-mono">
                      <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-sans">Età Agnese</span>
                        <span className="text-2xl font-black text-sky-400">{12 + etaAnni}</span>
                      </div>
                      <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-sans">Età Camilla</span>
                        <span className="text-2xl font-black text-rose-400">{5 + etaAnni}</span>
                      </div>
                      <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500">
                        <span className="text-[10px] text-emerald-300 block font-sans">Differenza</span>
                        <span className="text-2xl font-black text-emerald-400">
                          {(12 + etaAnni) - (5 + etaAnni)} anni!
                        </span>
                      </div>
                    </div>

                    {/* Trucco calcolo a mente */}
                    <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center text-xs space-y-1">
                      <span className="text-amber-400 font-bold uppercase tracking-wider block">
                        💡 Trucco di Calcolo Mentale con l'Invariantiva
                      </span>
                      <p className="text-slate-300">
                        Per calcolare <span className="font-mono text-white font-bold">41 − 19</span>: aggiungi 1 a entrambi! <br />
                        <span className="font-mono text-emerald-400 font-bold text-sm">42 − 20 = 22</span> (immediato e senza prestito!).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: LA MOLTIPLICAZIONE E LA DISTRIBUTIVA */}
            {/* ======================================================== */}
            {selectedSubtopic === "multiplication-properties" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
                      Lezione 3 · Addendi Uguali Ripetuti
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      La Moltiplicazione e la Proprietà Distributiva
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      La moltiplicazione è un'addizione abbreviata di addendi tutti uguali: <span className="font-mono font-bold">9 + 9 + 9 = 9 × 3 = 27</span>.
                    </p>
                  </div>

                  {/* Schema dei Termini */}
                  <div className="flex items-center justify-center gap-3 md:gap-6 py-2">
                    <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center w-28 md:w-36">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">Fattore</span>
                      <span className="text-3xl font-black font-mono text-slate-800">7</span>
                    </div>
                    <span className="text-3xl font-black text-emerald-600">×</span>
                    <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center w-28 md:w-36">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">Fattore</span>
                      <span className="text-3xl font-black font-mono text-slate-800">8</span>
                    </div>
                    <span className="text-3xl font-black text-slate-400">=</span>
                    <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-300 text-center w-28 md:w-36 shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-dida-blue block mb-1">Prodotto</span>
                      <span className="text-3xl font-black font-mono text-dida-blue">56</span>
                    </div>
                  </div>

                  {/* Proprietà Speciali */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-black uppercase text-dida-blue block">Commutativa & Associativa</span>
                      <p className="text-xs text-slate-600">
                        L'ordine dei fattori non cambia il prodotto: <span className="font-mono font-bold">4 × 29 = 29 × 4 = 116</span>.
                      </p>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-xs text-emerald-700">
                        Coppie magiche: <br />
                        2 × 5 = 10 · 4 × 25 = 100 · 8 × 125 = 1000
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-black uppercase text-amber-600 block">1 Neutro · 0 Assorbente</span>
                      <p className="text-xs text-slate-600">
                        Moltiplicare per 1 lascia il numero invariato: <span className="font-mono font-bold">9 × 1 = 9</span>.<br />
                        Moltiplicare per 0 annulla tutto: <span className="font-mono font-bold">7 × 0 = 0</span>.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-black uppercase text-purple-600 block">Per 10, 100, 1000</span>
                      <p className="text-xs text-slate-600">
                        La virgola si sposta verso destra di 1, 2 o 3 posti: <br />
                        <span className="font-mono font-bold">5,36 × 100 = 536</span>
                      </p>
                    </div>
                  </div>

                  {/* WIDGET INTERATTIVO: Il Rettangolo Distributivo */}
                  <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                        Geometria del Calcolo Mentale
                      </span>
                      <h3 className="text-xl font-black">La Proprietà Distributiva: Spezza il Numero Difficile!</h3>
                      <p className="text-xs text-slate-400 max-w-xl mx-auto">
                        Come calcolare a mente <span className="font-mono text-amber-400 font-bold">{distribAltezza} × {distribBaseDecine + distribBaseUnita}</span>? Spezza la base in decine e unità:
                      </p>
                    </div>

                    {/* Rappresentazione Rettangolo Spezzato */}
                    <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-4">
                      <div className="flex h-24 rounded-xl overflow-hidden border-2 border-slate-600 text-center font-mono font-black text-sm">
                        <div className="bg-sky-600 flex flex-col items-center justify-center transition-all" style={{ width: "70%" }}>
                          <span className="text-xs text-sky-200 font-sans">Base {distribBaseDecine}</span>
                          <span>{distribAltezza} × {distribBaseDecine} = {distribAltezza * distribBaseDecine}</span>
                        </div>
                        <div className="bg-amber-600 flex flex-col items-center justify-center transition-all" style={{ width: "30%" }}>
                          <span className="text-xs text-amber-200 font-sans">Base {distribBaseUnita}</span>
                          <span>{distribAltezza} × {distribBaseUnita} = {distribAltezza * distribBaseUnita}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl text-center font-mono text-base font-bold text-emerald-400">
                        {distribAltezza} × ({distribBaseDecine} + {distribBaseUnita}) = {distribAltezza * distribBaseDecine} + {distribAltezza * distribBaseUnita} = {distribAltezza * (distribBaseDecine + distribBaseUnita)} !
                      </div>

                      <div className="flex justify-center gap-4 text-xs">
                        <button
                          onClick={() => { setDistribBaseDecine(20); setDistribBaseUnita(7); setDistribAltezza(3); }}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer"
                        >
                          Esempio: 3 × 27
                        </button>
                        <button
                          onClick={() => { setDistribBaseDecine(40); setDistribBaseUnita(4); setDistribAltezza(5); }}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer"
                        >
                          Esempio: 5 × 44
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: LA DIVISIONE E I CASI PARTICOLARI */}
            {/* ======================================================== */}
            {selectedSubtopic === "division-properties" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200/80 shadow-xs">
                      Lezione 4 · Dividere in Parti Uguali
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      La Divisione, il Resto e i Casi Speciali
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      La divisione è l'operazione inversa della moltiplicazione: <span className="font-mono font-bold">a : b = q ⇔ q × b = a</span>.
                    </p>
                  </div>

                  {/* Schema con Resto */}
                  <div className="p-6 rounded-3xl bg-purple-50/70 border border-purple-200 text-center space-y-3">
                    <span className="text-xs font-black uppercase text-purple-800">
                      Formula della Divisione con Resto
                    </span>
                    <div className="text-2xl font-mono font-black text-purple-950">
                      Dividendo = (Divisore × Quoziente) + Resto
                    </div>
                    <p className="text-xs text-purple-900">
                      Regola fondamentale: il <strong>resto deve sempre essere strettamente minore del divisore</strong> (r &lt; d)!
                    </p>
                  </div>

                  {/* Casi Particolari dello Zero e dell'Uno */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Divisore 1</span>
                      <span className="text-xl font-mono font-black text-slate-800 block">7 : 1 = 7</span>
                      <p className="text-[11px] text-slate-500">Il numero non cambia</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Numeri Uguali</span>
                      <span className="text-xl font-mono font-black text-slate-800 block">5 : 5 = 1</span>
                      <p className="text-[11px] text-slate-500">Un numero diviso se stesso fa 1</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1">
                      <span className="text-xs font-bold text-dida-blue uppercase">Zero Diviso</span>
                      <span className="text-xl font-mono font-black text-dida-blue block">0 : 6 = 0</span>
                      <p className="text-[11px] text-slate-500">0 caramelle a 6 amici: 0 a testa</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-center space-y-1">
                      <span className="text-xs font-bold text-rose-700 uppercase">Diviso Zero ⚠️</span>
                      <span className="text-xl font-mono font-black text-rose-700 block">4 : 0 = IMPOSSIBILE</span>
                      <span className="text-xs font-mono font-bold text-rose-600 block">0 : 0 = INDETERMINATO</span>
                    </div>
                  </div>

                  {/* WIDGET INTERATTIVO: Il Resto Conta */}
                  <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black text-purple-400 uppercase tracking-wider">
                        Laboratorio Interattivo · La Divisione nella Realtà
                      </span>
                      <h3 className="text-xl font-black">Il Resto Conta: Dividiamo le Caramelle</h3>
                      <p className="text-xs text-slate-400">
                        Imposta caramelle e amici per osservare quoziente, resto e la verifica automatica:
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                      <div className="text-center space-y-1">
                        <label className="text-xs text-slate-400">Caramelle (Dividendo)</label>
                        <input
                          type="number"
                          value={divCaramelle}
                          onChange={(e) => setDivCaramelle(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-32 text-center text-xl font-mono font-black bg-slate-800 border border-slate-700 rounded-xl py-2 text-white focus:outline-none"
                        />
                      </div>

                      <span className="text-2xl font-black text-purple-400">:</span>

                      <div className="text-center space-y-1">
                        <label className="text-xs text-slate-400">Amici (Divisore)</label>
                        <input
                          type="number"
                          value={divAmici}
                          onChange={(e) => setDivAmici(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-32 text-center text-xl font-mono font-black bg-slate-800 border border-slate-700 rounded-xl py-2 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Risultato Divisione */}
                    {(() => {
                      const q = Math.floor(divCaramelle / divAmici);
                      const r = divCaramelle % divAmici;
                      return (
                        <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 max-w-lg mx-auto text-center space-y-2">
                          <div className="text-2xl font-mono font-black text-purple-300">
                            {divCaramelle} : {divAmici} = {q} con resto {r}
                          </div>
                          <div className="text-xs text-slate-300 font-mono">
                            Verifica: ({divAmici} × {q}) + {r} = {divAmici * q + r} ✓
                          </div>
                          <div className="text-[11px] text-amber-400 pt-1 font-sans">
                            {r > 0 ? `Avanzano ${r} caramelle non distribuite!` : "Divisione esatta: nessuna caramella avanzata!"}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Trucco Invariantiva per eliminare la virgola */}
                    <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center text-xs text-slate-300">
                      <span className="text-amber-400 font-bold block mb-1">
                        💡 Proprietà Invariantiva per le Divisioni con la Virgola
                      </span>
                      Moltiplica entrambi per 10: <span className="font-mono text-white font-bold">4,5 : 0,9 = 45 : 9 = 5</span>!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: LE ESPRESSIONI E LE PRECEDENZE */}
            {/* ======================================================== */}
            {selectedSubtopic === "expressions-order" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 5 · L'Ordine Conta
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Le Espressioni: Le Regole del Traffico dei Calcoli
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Un'espressione è una serie di operazioni numeriche concatenate. Per risolverla correttamente occorre rispettare una gerarchia precisa!
                    </p>
                  </div>

                  {/* Le 3 Regole di Precedenza */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 space-y-2">
                      <span className="w-8 h-8 rounded-full bg-dida-blue text-white flex items-center justify-center font-black text-sm">
                        1
                      </span>
                      <h4 className="font-black text-slate-900">Le Parentesi</h4>
                      <p className="text-xs text-slate-600">
                        Prima le <strong>tonde ( )</strong>, poi le <strong>quadre [ ]</strong>, infine le <strong>graffe &#123; &#125;</strong>.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-2">
                      <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-sm">
                        2
                      </span>
                      <h4 className="font-black text-slate-900">Moltiplicazioni e Divisioni</h4>
                      <p className="text-xs text-slate-600">
                        Hanno la precedenza su somme e sottrazioni. Si svolgono da sinistra verso destra nell'ordine in cui compaiono!
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2">
                      <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                        3
                      </span>
                      <h4 className="font-black text-slate-900">Addizioni e Sottrazioni</h4>
                      <p className="text-xs text-slate-600">
                        Si svolgono per ultime, sempre rigorosamente procedendo da sinistra verso destra.
                      </p>
                    </div>
                  </div>

                  {/* Esempio Trabocchetto */}
                  <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-xs font-black uppercase text-amber-900">
                      Il Classico Errore: È Giusto 56 o 41?
                    </span>
                    <div className="font-mono text-2xl font-black text-slate-800">
                      5 + 9 × 4 = ?
                    </div>
                    <p className="text-xs text-slate-600">
                      Chi fa prima 5 + 9 ottiene 14 × 4 = 56 (SBAGLIATO!). <br />
                      La moltiplicazione va PRIMA: <span className="font-bold text-emerald-700">5 + 36 = 41 (CORRETTO!)</span>.
                    </p>
                  </div>

                  {/* WIDGET INTERATTIVO: La Sfida dei Quattro 4 */}
                  <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                        La Sfida Storica della Matematica
                      </span>
                      <h3 className="text-xl font-black">Il Gioco dei Quattro 4</h3>
                      <p className="text-xs text-slate-400 max-w-xl mx-auto">
                        Usando esattamente quattro 4, le parentesi e le quattro operazioni (+, −, ×, :), riesci a ottenere tutti i numeri da 0 a 9? Scegli un numero:
                      </p>
                    </div>

                    <div className="flex justify-center gap-1.5 flex-wrap">
                      {Array.from({ length: 10 }).map((_, n) => (
                        <button
                          key={n}
                          onClick={() => setFourResultChoice(n)}
                          className={`w-10 h-10 rounded-xl font-mono font-black text-sm transition cursor-pointer border ${
                            fourResultChoice === n
                              ? "bg-amber-500 text-slate-950 border-amber-400 scale-110 shadow-lg"
                              : "bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>

                    {fourFourSolutions[fourResultChoice] && (
                      <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 max-w-lg mx-auto text-center space-y-2">
                        <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                          Soluzione per ottenere {fourResultChoice}:
                        </span>
                        <div className="font-mono text-xl font-black text-white">
                          {fourFourSolutions[fourResultChoice].expr}
                        </div>
                        <p className="text-xs text-slate-300 font-sans">
                          {fourFourSolutions[fourResultChoice].explain}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 6: RISOLVERE I PROBLEMI CON I SEGMENTI */}
            {/* ======================================================== */}
            {selectedSubtopic === "problem-solving-methods" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
                      Lezione 6 · Il Metodo in 5 Passi
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Risolvere i Problemi: Il Metodo dei Segmenti
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Risolvere un problema matematico è come un'indagine poliziesca. Non lanciarti subito nei calcoli: segui i 5 passi del detective!
                    </p>
                  </div>

                  {/* 5 Passi */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                      <span className="text-xs font-bold text-dida-blue block">1. LEGGO</span>
                      <p className="text-[11px] text-slate-600">Sottolineo i dati, cerchio la domanda</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                      <span className="text-xs font-bold text-amber-700 block">2. TABELLA</span>
                      <p className="text-[11px] text-slate-600">Dati noti e incognita da trovare</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <span className="text-xs font-bold text-emerald-700 block">3. DISEGNO</span>
                      <p className="text-[11px] text-slate-600">Traccio lo schema a segmenti</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                      <span className="text-xs font-bold text-purple-700 block">4. CALCOLO</span>
                      <p className="text-[11px] text-slate-600">Operazioni o espressione unica</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1 col-span-2 md:col-span-1">
                      <span className="text-xs font-bold text-slate-800 block">5. RISPONDO</span>
                      <p className="text-[11px] text-slate-600">Frase, unità di misura e verifica</p>
                    </div>
                  </div>

                  {/* WIDGET INTERATTIVO: Disegno dei Segmenti (Somma e Differenza) */}
                  <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                        Laboratorio Visivo · Somma e Differenza
                      </span>
                      <h3 className="text-xl font-black">Problemi con Somma e Differenza Noti</h3>
                      <p className="text-xs text-slate-400 max-w-xl mx-auto">
                        In una scatola ci sono caramelle alla fragola e al limone. Imposta la somma totale e la differenza tra le due quantità:
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                      <div className="text-center space-y-1">
                        <label className="text-xs text-slate-400">Somma Totale</label>
                        <input
                          type="number"
                          value={segSomma}
                          onChange={(e) => setSegSomma(parseInt(e.target.value) || 0)}
                          className="w-32 text-center text-xl font-mono font-black bg-slate-800 border border-slate-700 rounded-xl py-2 text-white focus:outline-none"
                        />
                      </div>

                      <div className="text-center space-y-1">
                        <label className="text-xs text-slate-400">Differenza (in più)</label>
                        <input
                          type="number"
                          value={segDiff}
                          onChange={(e) => setSegDiff(parseInt(e.target.value) || 0)}
                          className="w-32 text-center text-xl font-mono font-black bg-slate-800 border border-slate-700 rounded-xl py-2 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {segmentiCalc.valido && (
                      <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 max-w-lg mx-auto space-y-4">
                        {/* Schema Grafico a Segmenti */}
                        <div className="space-y-2 text-xs font-bold">
                          <div className="flex items-center gap-3">
                            <span className="w-16 text-right text-rose-300">Minore:</span>
                            <div className="h-7 bg-rose-500 rounded-lg flex items-center justify-center text-white font-mono px-3" style={{ width: "45%" }}>
                              {segmentiCalc.minore}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-16 text-right text-amber-300">Maggiore:</span>
                            <div className="h-7 flex rounded-lg overflow-hidden" style={{ width: "65%" }}>
                              <div className="bg-rose-500 h-full flex items-center justify-center text-white font-mono px-3" style={{ width: "70%" }}>
                                {segmentiCalc.minore}
                              </div>
                              <div className="bg-amber-500 h-full flex items-center justify-center text-slate-950 font-mono px-2" style={{ width: "30%" }}>
                                +{segDiff}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Formule Risolutive */}
                        <div className="p-3 bg-slate-900 rounded-xl space-y-1 text-center font-mono text-xs">
                          <p className="text-amber-300">
                            Quantità Minore = (Somma − Differenza) : 2 = ({segSomma} − {segDiff}) : 2 = <strong>{segmentiCalc.minore}</strong>
                          </p>
                          <p className="text-emerald-300">
                            Quantità Maggiore = Minore + Differenza = {segmentiCalc.minore} + {segDiff} = <strong>{segmentiCalc.maggiore}</strong>
                          </p>
                        </div>
                        <div className="text-center text-[11px] text-slate-400 font-sans">
                          Verifica: {segmentiCalc.minore} + {segmentiCalc.maggiore} = {segSomma} ✓
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ======================================================== */
          /* TAB ALLENA (PALESTRA DI ESERCIZI) */
          /* ======================================================== */
          <motion.div
            key="tab-allena-ops"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 px-4"
          >
            {/* Banner Introduzione Palestra */}
            <div className="rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 shadow-lg text-center flex flex-col items-center gap-3.5">
              <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-amber-950 bg-white/30 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/40 shadow-xs">
                Palestra delle Operazioni · Livello 1ª Media
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Mettiti alla Prova con Esercizi, Espressioni e INVALSI
              </h2>
              <p className="text-amber-100 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Risolvi calcoli con le proprietà furbi, individua le precedenze corrette e affronta i quesiti ufficiali delle prove nazionali!
              </p>
            </div>

            {/* SEZIONE 1: Riconosci la Proprietà Usata */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Attività 1 · Caccia alla Proprietà
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Quale Proprietà è Stata Usata?</h3>
                <p className="text-xs text-slate-500">Seleziona la proprietà applicata in ciascun calcolo.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 1,
                    calc: "16 + 9 + 4 = 16 + 4 + 9 = 29",
                    options: [
                      { id: "comm", label: "Commutativa", correct: true },
                      { id: "inv", label: "Invariantiva", correct: false },
                      { id: "dist", label: "Distributiva", correct: false },
                    ],
                    explain: "È stata cambiata la posizione degli addendi: proprietà commutativa!"
                  },
                  {
                    id: 2,
                    calc: "41 − 19 = (41 + 1) − (19 + 1) = 42 − 20 = 22",
                    options: [
                      { id: "comm", label: "Commutativa", correct: false },
                      { id: "inv", label: "Invariantiva", correct: true },
                      { id: "assoc", label: "Associativa", correct: false },
                    ],
                    explain: "È stato aggiunto 1 sia al minuendo sia al sottraendo: proprietà invariantiva!"
                  },
                  {
                    id: 3,
                    calc: "3 × (20 + 7) = 3 × 20 + 3 × 7 = 60 + 21 = 81",
                    options: [
                      { id: "dist", label: "Distributiva", correct: true },
                      { id: "comm", label: "Commutativa", correct: false },
                      { id: "neutro", label: "Elemento neutro", correct: false },
                    ],
                    explain: "La moltiplicazione è stata distribuita su ciascun addendo: proprietà distributiva!"
                  },
                  {
                    id: 4,
                    calc: "4,5 : 0,9 = 45 : 9 = 5",
                    options: [
                      { id: "inv", label: "Invariantiva", correct: true },
                      { id: "assoc", label: "Associativa", correct: false },
                      { id: "dist", label: "Distributiva", correct: false },
                    ],
                    explain: "Entrambi i termini della divisione sono stati moltiplicati per 10: proprietà invariantiva!"
                  },
                ].map((item) => {
                  const currentAns = exPropAnswers[item.id];
                  return (
                    <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="font-mono font-bold text-sm text-slate-800 bg-white p-3 rounded-xl border border-slate-200 text-center">
                        {item.calc}
                      </div>
                      <div className="flex gap-2">
                        {item.options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setExPropAnswers(prev => ({ ...prev, [item.id]: opt.id }))}
                            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              currentAns === opt.id
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
                      {currentAns && (
                        <p className="text-xs font-semibold text-slate-600">
                          {currentAns === item.options.find(o => o.correct)?.id
                            ? `✅ ${item.explain}`
                            : "❌ Riprova, osserva quale operazione è stata trasformata!"}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE 2: Le Espressioni Aritmetiche */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-blue uppercase tracking-wider">
                  Attività 2 · Risolvi le Espressioni
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Calcola Rispettando le Precedenze</h3>
                <p className="text-xs text-slate-500">Ricorda: prima le parentesi, poi × e :, infine + e −!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 1,
                    expr: "30 : 5 + 4 × 3 − 7 = ?",
                    correct: 11,
                    options: [11, 23, 17],
                    explain: "30:5=6, 4×3=12 → 6 + 12 − 7 = 18 − 7 = 11!"
                  },
                  {
                    id: 2,
                    expr: "5 + (18 − 3 × 4) = ?",
                    correct: 11,
                    options: [11, 65, 17],
                    explain: "Nella tonda prima 3×4=12, poi 18−12=6 → 5 + 6 = 11!"
                  },
                  {
                    id: 3,
                    expr: "(15 − 5) × (4 + 6 : 2) = ?",
                    correct: 70,
                    options: [70, 50, 35],
                    explain: "Prima tonda: 10. Seconda tonda: 6:2=3, 4+3=7. Infine: 10 × 7 = 70!"
                  },
                  {
                    id: 4,
                    expr: "50 − [12 + (8 − 2 × 3) × 5] = ?",
                    correct: 28,
                    options: [28, 18, 32],
                    explain: "Nella tonda 2×3=6, 8−6=2. Nella quadra 2×5=10, 12+10=22. Infine 50−22=28!"
                  },
                ].map((item) => {
                  const ans = exExprAnswers[item.id];
                  return (
                    <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="font-mono font-black text-base text-slate-900 bg-white p-3 rounded-xl border border-slate-200 text-center">
                        {item.expr}
                      </div>
                      <div className="flex gap-2">
                        {item.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setExExprAnswers(prev => ({ ...prev, [item.id]: opt }))}
                            className={`flex-1 py-2.5 rounded-xl font-mono font-bold text-sm border transition cursor-pointer ${
                              ans === opt
                                ? opt === item.correct
                                  ? "bg-emerald-500 text-white border-emerald-600"
                                  : "bg-rose-500 text-white border-rose-600"
                                : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {ans !== undefined && ans !== null && (
                        <p className="text-xs font-semibold text-slate-600">
                          {ans === item.correct ? `✅ Esatto: ${item.explain}` : "❌ Attento alle precedenze!"}
                        </p>
                      )}
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
                <span className="text-xs text-slate-400 font-semibold">Quesiti ufficiali di aritmetica</span>
              </div>

              {/* Quesito INVALSI 1: Lo Scontrino Macchiato */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Quesito 1 · Lo Scontrino Macchiato
                </span>
                <p className="text-sm font-bold text-slate-800">
                  Uno scontrino riporta: <strong>Pasta = 2,50 €</strong>, <strong>Fragole = 5,20 €</strong> e un flacone di <strong>Detersivo</strong> il cui prezzo è coperto da una macchia. Il <strong>TOTALE è 9,80 €</strong>. Quanto è costato il detersivo?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "1,10 €", correct: false },
                    { id: "B", val: "2,10 €", correct: true },
                    { id: "C", val: "2,70 €", correct: false },
                    { id: "D", val: "3,10 €", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, q1: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-mono font-bold transition cursor-pointer ${
                        invalsiAnswers.q1 === opt.id
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
                {invalsiAnswers.q1 && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.q1 === "B"
                      ? "✅ Corretto: 9,80 − (2,50 + 5,20) = 9,80 − 7,70 = 2,10 €!"
                      : "❌ Riprova: sottrai dal totale la somma degli altri due prezzi noti."}
                  </p>
                )}
              </div>

              {/* Quesito INVALSI 2: Cartellini e Simboli */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-dida-blue bg-blue-100 px-3 py-1 rounded-full">
                  Quesito 2 · Cartellini e Simboli Misteriosi
                </span>
                <p className="text-sm font-bold text-slate-800">
                  Dato il sistema di equazioni a simboli: <br />
                  <span className="font-mono text-base font-extrabold text-dida-blue">
                    20 × ◆ = ● &nbsp; e &nbsp; ● − 15 = 65
                  </span>
                  <br />
                  Qual è il valore del rombo (◆)?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "2", correct: false },
                    { id: "B", val: "3", correct: false },
                    { id: "C", val: "4", correct: true },
                    { id: "D", val: "5", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, q2: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-mono font-bold transition cursor-pointer ${
                        invalsiAnswers.q2 === opt.id
                          ? opt.correct
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : "bg-rose-500 text-white border-rose-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt.id}. ◆ = {opt.val}
                    </button>
                  ))}
                </div>
                {invalsiAnswers.q2 && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.q2 === "C"
                      ? "✅ Bravissimo! Da ● − 15 = 65 ricaviamo ● = 65 + 15 = 80. Quindi 20 × ◆ = 80 ⇒ ◆ = 80 : 20 = 4!"
                      : "❌ Riprova: calcola prima il valore del cerchio nero aggiungendo 15 a 65."}
                  </p>
                )}
              </div>

              {/* Quesito INVALSI 3: Occhio alle Virgole */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  Quesito 3 · Divisioni Equivalenti
                </span>
                <p className="text-sm font-bold text-slate-800">
                  Data la divisione con virgola <span className="font-mono text-base font-extrabold text-purple-700">2,629 : 1,3</span>, quale divisione fornisce ESATTAMENTE lo stesso risultato grazie alla proprietà invariantiva?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { id: "A", val: "2629 : 13", correct: false },
                    { id: "B", val: "26,29 : 13", correct: true },
                    { id: "C", val: "262,9 : 13", correct: false },
                    { id: "D", val: "2,629 : 130", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, q3: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-mono font-bold transition cursor-pointer text-left ${
                        invalsiAnswers.q3 === opt.id
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
                {invalsiAnswers.q3 && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.q3 === "B"
                      ? "✅ Esatto: moltiplicando entrambi i termini per 10, il divisore 1,3 diventa l'intero 13 e il dividendo 2,629 diventa 26,29!"
                      : "❌ Per togliere la virgola a 1,3 basta moltiplicare per 10 entrambi i termini, ottenendo 26,29 : 13."}
                  </p>
                )}
              </div>

              {/* SEZIONE 4: Sfida Finale Vero o Falso */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Sfida Finale · Vero o Falso
                </span>
                <p className="text-xs text-slate-500">Metti alla prova la tua padronanza teorica:</p>

                <div className="space-y-3">
                  {[
                    { id: 1, text: "L'addizione e la moltiplicazione godono entrambe della proprietà commutativa.", correct: true },
                    { id: 2, text: "La sottrazione gode della proprietà commutativa in ℕ.", correct: false, note: "Falso: 15 − 5 ≠ 5 − 15!" },
                    { id: 3, text: "(12 + 4) − (5 + 4) = 12 − 5 per la proprietà invariantiva.", correct: true },
                    { id: 4, text: "La divisione 4 : 0 ha come risultato 0.", correct: false, note: "Falso: dividere per zero è IMPOSSIBILE!" },
                    { id: 5, text: "Nell'espressione 5 + 9 × 4 il risultato corretto è 56.", correct: false, note: "Falso: prima la moltiplicazione, fa 41!" },
                    { id: 6, text: "3 × 27 = 3 × 20 + 3 × 7 per la proprietà distributiva.", correct: true },
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
