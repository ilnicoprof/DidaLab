import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, BookOpen, Zap, CheckCircle2, XCircle, Sparkles,
  ChevronRight, RotateCcw, AlertCircle, Info, Award, HelpCircle,
  Scissors, Check, X, Star, Ruler, Compass, Grid, Layers,
  Split, MoveHorizontal, Eye, Navigation, MapPin, Calculator, Play
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
 * Componente Frazione con Linea Orizzontale Reale
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
  { id: "segments-def", title: "1. Il Segmento, Misura & Spezzata", short: "1. Segmento & Spezzata" },
  { id: "segments-comparison", title: "2. Confrontare i Segmenti", short: "2. Confronto (≡, >, <)" },
  { id: "segments-operations", title: "3. Somma e Differenza", short: "3. Somma & Differenza" },
  { id: "segment-midpoint", title: "4. Multipli, Sottomultipli e Punto Medio", short: "4. Punto Medio & Piano" },
  { id: "segments-problems", title: "5. I Problemi con i Segmenti", short: "5. Problemi con i Segmenti" },
];

export default function SegmentsLesson({
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
    // Backward compatibility con i vecchi ID da App.tsx
    if (initialSubtopicId === "segments-comparison-operations") return "segments-comparison";
    if (initialSubtopicId === "segment-measure-midpoint") return "segment-midpoint";
    if (initialSubtopicId === "segments-problem-solving") return "segments-problems";
    return "segments-def";
  });

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // Lab 1: Misura Segmento & Spezzata
  const [lab1LengthCm, setLab1LengthCm] = useState<number>(5.8);
  const [lab1SpezzataType, setLab1SpezzataType] = useState<"aperta-semplice" | "chiusa-semplice" | "aperta-intrecciata" | "chiusa-intrecciata">("aperta-semplice");

  // Lab 2: Confronto con Compasso & Calibro
  const [compLenA, setCompLenA] = useState<number>(14);
  const [compLenB, setCompLenB] = useState<number>(11);
  const [isCompassActive, setIsCompassActive] = useState<boolean>(false);

  // Lab 3: Somma e Differenza
  const [opMode, setOpMode] = useState<"somma" | "differenza">("somma");
  const [segLenA, setSegLenA] = useState<number>(21);
  const [segLenB, setSegLenB] = useState<number>(8);
  const [unitA, setUnitA] = useState<"cm" | "mm">("cm");
  const [unitB, setUnitB] = useState<"cm" | "mm">("cm");

  // Lab 4: Multipli, Sottomultipli e Punto Medio
  const [midBaseLen, setMidBaseLen] = useState<number>(16);
  const [midFolded, setMidFolded] = useState<boolean>(false);
  const [multMultiplier, setMultMultiplier] = useState<number>(2);
  // Coordinate punto medio piano cartesiano
  const [ptAx, setPtAx] = useState<number>(1);
  const [ptAy, setPtAy] = useState<number>(4);
  const [ptBx, setPtBx] = useState<number>(7);
  const [ptBy, setPtBy] = useState<number>(2);

  // Lab 5: I Problemi con i Segmenti
  const [probType, setProbType] = useState<"somma-differenza" | "somma-multiplo" | "differenza-multiplo">("somma-differenza");
  const [probSum, setProbSum] = useState<number>(98);
  const [probDiff, setProbDiff] = useState<number>(28);
  const [probMultiplier, setProbMultiplier] = useState<number>(2); // es. Lucia ha il doppio (2x)

  // ==========================================
  // --- STATI PALESTRA DI ESERCIZI (ALLENA) ---
  // ==========================================
  const [exErrors, setExErrors] = useState<Record<number, boolean | null>>({});
  const [invalsiAnswers, setInvalsiAnswers] = useState<Record<string, string>>({});
  const [vfAnswers, setVfAnswers] = useState<Record<string, boolean | null>>({});
  const [exitTicketText, setExitTicketText] = useState({ seg1: "", seg2: "", seg3: "", word1: "", word2: "", question: "" });

  // Calcolo punto medio coordinate cartesiane
  const midPointCoords = useMemo(() => {
    return {
      xm: (ptAx + ptBx) / 2,
      ym: (ptAy + ptBy) / 2,
    };
  }, [ptAx, ptAy, ptBx, ptBy]);

  // Calcolo problemi
  const probResult = useMemo(() => {
    if (probType === "somma-differenza") {
      const minore = (probSum - probDiff) / 2;
      const maggiore = (probSum + probDiff) / 2;
      return { minore, maggiore, check: minore + maggiore === probSum };
    } else if (probType === "somma-multiplo") {
      const parts = 1 + probMultiplier;
      const onePart = probSum / parts;
      const partMinore = onePart;
      const partMaggiore = onePart * probMultiplier;
      return { minore: partMinore, maggiore: partMaggiore, parts, onePart };
    } else {
      const diffParts = Math.max(1, probMultiplier - 1);
      const onePart = probDiff / diffParts;
      const partMinore = onePart;
      const partMaggiore = onePart * probMultiplier;
      return { minore: partMinore, maggiore: partMaggiore, parts: diffParts, onePart };
    }
  }, [probType, probSum, probDiff, probMultiplier]);

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
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-dida-blue hover:border-dida-blue/30 transition shadow-xs cursor-pointer"
            title="Torna agli argomenti"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Classe 1ª · Geometria
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {subjectName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              I Segmenti
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
            key="tab-impara-segments"
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
            {/* MODULO 1: IL SEGMENTO, MISURA CON RIGHELLO E LA SPEZZATA */}
            {/* ======================================================== */}
            {selectedSubtopic === "segments-def" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 1 · Un pezzo di retta con un inizio e una fine
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Il Segmento, la Misura & la Spezzata
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Il <strong>segmento</strong> è la parte di retta compresa tra due punti detti <strong>estremi</strong> ($A$ e $B$). Rappresenta la strada più breve tra due punti!
                    </p>
                  </div>

                  {/* 3 Concetti Chiave a Confronto */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        GLI ESTREMI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">I punti A e B</h4>
                      <p className="text-xs text-slate-600">
                        Indicano esattamente dove inizia e dove finisce il segmento. Si scrivono sempre con lettere maiuscole!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        COME SI SCRIVE
                      </span>
                      <h4 className="text-lg font-black text-slate-800 font-mono">AB oppure BA</h4>
                      <p className="text-xs text-slate-600">
                        Con un trattino sopra: AB (con linea sopra) indica la <strong>misura</strong> (es. AB = 5,8 cm).
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        CONSECUTIVI O ADIACENTI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Si toccano?</h4>
                      <p className="text-xs text-slate-600">
                        <strong>Consecutivi:</strong> hanno 1 estremo in comune.<br />
                        <strong>Adiacenti:</strong> consecutivi E sulla stessa retta!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 1: STUDIO RIGHELLO DIGITALE & SANDBOX DELLA SPEZZATA */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-8">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Righello di Precisione
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Misura il Segmento con il Righello Millimetrato
                      </h3>
                      <p className="text-xs text-slate-500">
                        Trascina il cursore per allungare il segmento e leggi la misura precisa: ricorda di allineare lo <strong>0</strong> sull'estremo A, non il bordo della plastica!
                      </p>
                    </div>

                    {/* SEZIONE A: IL RIGHELLO DIGITALE */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-blue-200 shadow-xs space-y-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-blue-100 pb-4">
                        <div className="flex items-center gap-3">
                          <Ruler className="text-dida-blue" size={24} />
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Misura Attuale di AB</span>
                            <div className="text-2xl font-black text-slate-900 font-mono flex items-center gap-2">
                              <span>AB = {lab1LengthCm.toFixed(1)} cm</span>
                              <span className="text-sm font-bold text-dida-orange font-sans">({(lab1LengthCm * 10).toFixed(0)} mm)</span>
                            </div>
                          </div>
                        </div>

                        {/* Slider Lunghezza */}
                        <div className="w-full md:w-64 space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>Regola lunghezza:</span>
                            <span className="text-dida-blue font-mono font-black">{lab1LengthCm} cm</span>
                          </div>
                          <input
                            type="range"
                            min="2"
                            max="15"
                            step="0.1"
                            value={lab1LengthCm}
                            onChange={(e) => setLab1LengthCm(parseFloat(e.target.value))}
                            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* AREA DI DISEGNO CON RIGHELLO E SEGMENTO */}
                      <div className="relative w-full h-44 bg-slate-50 rounded-2xl border-2 border-slate-300 p-6 flex flex-col justify-center overflow-x-auto shadow-inner">
                        {/* Segmento AB */}
                        <div className="relative h-12 flex items-center" style={{ width: `${Math.min(lab1LengthCm * 36, 560)}px` }}>
                          {/* Estremo A */}
                          <div className="absolute left-0 -top-6 flex flex-col items-center z-20">
                            <span className="font-mono font-black text-sm text-blue-700">A</span>
                            <div className="w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-200 shadow-xs"></div>
                          </div>

                          {/* Linea Segmento */}
                          <div className="w-full h-2.5 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full shadow-xs"></div>

                          {/* Estremo B */}
                          <div className="absolute right-0 -top-6 flex flex-col items-center z-20">
                            <span className="font-mono font-black text-sm text-orange-700">B</span>
                            <div className="w-4 h-4 rounded-full bg-orange-500 ring-4 ring-orange-200 shadow-xs"></div>
                          </div>
                        </div>

                        {/* Righello Millimetrato Sotto al Segmento */}
                        <div className="relative w-full h-14 bg-gradient-to-b from-amber-100/90 to-amber-200/90 rounded-xl border-2 border-amber-300 mt-2 shadow-sm overflow-hidden flex items-start">
                          {/* Tacche dei Centimetri e Millimetri */}
                          {Array.from({ length: 16 }).map((_, cm) => (
                            <div
                              key={cm}
                              className="absolute top-0 flex flex-col items-center"
                              style={{ left: `${cm * 36}px` }}
                            >
                              <div className="w-[1.5px] h-6 bg-slate-800"></div>
                              <span className="text-[10px] font-mono font-bold text-slate-800 select-none">{cm}</span>
                              {/* 9 millimetri intermedi */}
                              {cm < 15 && Array.from({ length: 9 }).map((_, mm) => (
                                <div
                                  key={mm}
                                  className="absolute top-0 w-[1px] bg-slate-500"
                                  style={{
                                    left: `${(mm + 1) * 3.6}px`,
                                    height: (mm + 1) === 5 ? "14px" : "8px",
                                  }}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Box di Regola Pratica */}
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
                        <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                        <div>
                          <strong>REGOLE D'ORO PER MISURARE:</strong> Allinea sempre lo <strong>0</strong> del righello con l'estremo A iniziale (non il bordo di plastica trasparente del righello!). Ricorda: 1 cm = 10 mm e 1 dm = 10 cm.
                        </div>
                      </div>
                    </div>

                    {/* SEZIONE B: SANDBOX DELLA SPEZZATA (4 TIPI) */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-orange-200 shadow-xs space-y-6">
                      <div className="text-center max-w-xl mx-auto space-y-2">
                        <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                          La Spezzata · Più Segmenti Consecutivi
                        </span>
                        <h4 className="text-xl font-black text-slate-800">
                          Laboratorio Interattivo dei 4 Tipi di Spezzata
                        </h4>
                        <p className="text-xs text-slate-500">
                          Seleziona la tipologia di spezzata per osservare come si collegano i lati e i vertici!
                        </p>

                        {/* Bottoni 4 Tipi */}
                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                          {[
                            { id: "aperta-semplice", label: "Aperta Semplice" },
                            { id: "chiusa-semplice", label: "Chiusa Semplice (Poligono)" },
                            { id: "aperta-intrecciata", label: "Aperta Intrecciata" },
                            { id: "chiusa-intrecciata", label: "Chiusa Intrecciata (Stella)" },
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setLab1SpezzataType(t.id as any)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                                lab1SpezzataType === t.id
                                  ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Display Grafico Spezzata */}
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
                        <svg viewBox="0 0 400 180" className="w-full max-w-md h-44 drop-shadow-sm">
                          {lab1SpezzataType === "aperta-semplice" && (
                            <g>
                              <polyline points="40,140 120,40 220,120 340,50" fill="none" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                              {[[40,140,"A"], [120,40,"B"], [220,120,"C"], [340,50,"D"]].map(([x,y,l]) => (
                                <g key={l}>
                                  <circle cx={x as number} cy={y as number} r="7" fill="#EA580C" stroke="#fff" strokeWidth="2" />
                                  <text x={(x as number) - 5} y={(y as number) - 12} className="font-mono font-black text-xs fill-slate-800">{l}</text>
                                </g>
                              ))}
                            </g>
                          )}
                          {lab1SpezzataType === "chiusa-semplice" && (
                            <g>
                              <polygon points="60,130 110,40 250,30 330,110 200,150" fill="rgba(2, 132, 199, 0.1)" stroke="#0284C7" strokeWidth="4" strokeLinejoin="round" />
                              {[[60,130,"A"], [110,40,"B"], [250,30,"C"], [330,110,"D"], [200,150,"E"]].map(([x,y,l]) => (
                                <g key={l}>
                                  <circle cx={x as number} cy={y as number} r="7" fill="#EA580C" stroke="#fff" strokeWidth="2" />
                                  <text x={(x as number) - 5} y={(y as number) - 12} className="font-mono font-black text-xs fill-slate-800">{l}</text>
                                </g>
                              ))}
                            </g>
                          )}
                          {lab1SpezzataType === "aperta-intrecciata" && (
                            <g>
                              <polyline points="50,140 200,30 320,140 80,60" fill="none" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                              {[[50,140,"A"], [200,30,"B"], [320,140,"C"], [80,60,"D"]].map(([x,y,l]) => (
                                <g key={l}>
                                  <circle cx={x as number} cy={y as number} r="7" fill="#EA580C" stroke="#fff" strokeWidth="2" />
                                  <text x={(x as number) - 5} y={(y as number) - 12} className="font-mono font-black text-xs fill-slate-800">{l}</text>
                                </g>
                              ))}
                            </g>
                          )}
                          {lab1SpezzataType === "chiusa-intrecciata" && (
                            <g>
                              <polygon points="200,20 250,150 100,70 300,70 150,150" fill="rgba(234, 88, 12, 0.1)" stroke="#EA580C" strokeWidth="4" strokeLinejoin="round" />
                              {[[200,20,"A"], [250,150,"B"], [100,70,"C"], [300,70,"D"], [150,150,"E"]].map(([x,y,l]) => (
                                <g key={l}>
                                  <circle cx={x as number} cy={y as number} r="7" fill="#0284C7" stroke="#fff" strokeWidth="2" />
                                  <text x={(x as number) - 5} y={(y as number) - 12} className="font-mono font-black text-xs fill-slate-800">{l}</text>
                                </g>
                              ))}
                            </g>
                          )}
                        </svg>

                        <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-center text-xs">
                          {lab1SpezzataType === "aperta-semplice" && "L'ultimo estremo NON torna al primo e i lati non si incrociano."}
                          {lab1SpezzataType === "chiusa-semplice" && "L'ultimo estremo torna al primo: racchiude uno spazio e forma un poligono!"}
                          {lab1SpezzataType === "aperta-intrecciata" && "I lati si intersecano in punti che non sono estremi."}
                          {lab1SpezzataType === "chiusa-intrecciata" && "Chiusa (torna al punto di partenza) e con segmenti che si sovrappongono e incrociano."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: CONFRONTARE I SEGMENTI (COMPASSO & CONGRUENZA) */}
            {/* ======================================================== */}
            {selectedSubtopic === "segments-comparison" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-200/80 shadow-xs">
                      Lezione 2 · Più lungo, più corto o uguale?
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Il Confronto tra Segmenti & la Congruenza
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Per confrontare due segmenti possiamo usare il <strong>compasso</strong> o una striscia di carta: sovrapponendo il primo estremo, guardiamo dove cade il secondo!
                    </p>
                  </div>

                  {/* I 3 Casi del Confronto */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-300 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        CONGRUENTI (≡)
                      </span>
                      <h4 className="text-xl font-black text-emerald-900 font-mono">AB ≡ CD</h4>
                      <p className="text-xs text-slate-600">
                        Hanno la <strong>stessa lunghezza</strong>: sovrapponendo A con C, l'estremo B cade esattamente su D!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-800 bg-white px-3 py-1 rounded-full border border-orange-200">
                        MAGGIORE (&gt;)
                      </span>
                      <h4 className="text-xl font-black text-orange-900 font-mono">AB &gt; CD</h4>
                      <p className="text-xs text-slate-600">
                        L'estremo B cade <strong>fuori</strong> rispetto a D: il segmento AB è più lungo di CD!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-800 bg-white px-3 py-1 rounded-full border border-blue-200">
                        MINORE (&lt;)
                      </span>
                      <h4 className="text-xl font-black text-blue-900 font-mono">AB &lt; CD</h4>
                      <p className="text-xs text-slate-600">
                        L'estremo B cade <strong>dentro</strong> rispetto a D: il segmento AB è più corto di CD!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 2: COMPARATORE A COMPASSO VIRTUALE */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio Dinamico · Compasso di Precisione
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Confronta i Due Segmenti con il Compasso
                      </h3>
                      <p className="text-xs text-slate-500">
                        Regola le lunghezze dei due segmenti e attiva il compasso per misurare l'apertura e vedere dove cade l'estremo!
                      </p>

                      {/* Presets di Esempio Reale */}
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {[
                          { label: "Congruenti (12 cm e 12 cm)", a: 12, b: 12 },
                          { label: "Matita vs Gomma (15 cm vs 6 cm)", a: 15, b: 6 },
                          { label: "Astuccio vs Penna (20 cm vs 14 cm)", a: 20, b: 14 },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCompLenA(preset.a);
                              setCompLenB(preset.b);
                            }}
                            className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:border-dida-orange hover:text-dida-orange transition cursor-pointer shadow-xs"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cockpit Doppio Segmento con Compasso */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Segmento AB (Blu) */}
                      <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 shadow-xs space-y-4">
                        <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                          <span className="text-xs font-black uppercase text-blue-900">Segmento AB</span>
                          <span className="text-base font-black font-mono text-blue-700 bg-white px-3 py-0.5 rounded-xl border border-blue-200">
                            {compLenA} cm
                          </span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="25"
                          value={compLenA}
                          onChange={(e) => setCompLenA(parseInt(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                        />
                        <div className="relative h-10 flex items-center bg-white p-2 rounded-xl border border-blue-100">
                          <span className="font-mono font-bold text-xs text-blue-700 mr-2">A</span>
                          <div className="h-2.5 bg-blue-500 rounded-full" style={{ width: `${compLenA * 12}px` }}></div>
                          <span className="font-mono font-bold text-xs text-blue-700 ml-2">B</span>
                        </div>
                      </div>

                      {/* Segmento CD (Arancio) */}
                      <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 shadow-xs space-y-4">
                        <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                          <span className="text-xs font-black uppercase text-orange-900">Segmento CD</span>
                          <span className="text-base font-black font-mono text-orange-700 bg-white px-3 py-0.5 rounded-xl border border-orange-200">
                            {compLenB} cm
                          </span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="25"
                          value={compLenB}
                          onChange={(e) => setCompLenB(parseInt(e.target.value))}
                          className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                        />
                        <div className="relative h-10 flex items-center bg-white p-2 rounded-xl border border-orange-100">
                          <span className="font-mono font-bold text-xs text-orange-700 mr-2">C</span>
                          <div className="h-2.5 bg-orange-500 rounded-full" style={{ width: `${compLenB * 12}px` }}></div>
                          <span className="font-mono font-bold text-xs text-orange-700 ml-2">D</span>
                        </div>
                      </div>
                    </div>

                    {/* BARRA DI SOVRAPPOSIZIONE E VERIFICA COMPASSO */}
                    <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xs space-y-4 text-center">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-3">
                        <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                          Esito del Confronto Diretto
                        </span>
                        <div className={`px-4 py-1.5 rounded-xl font-mono font-black text-lg border shadow-xs ${
                          compLenA === compLenB
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : compLenA > compLenB
                            ? "bg-orange-50 text-orange-800 border-orange-300"
                            : "bg-blue-50 text-blue-800 border-blue-300"
                        }`}>
                          {compLenA === compLenB ? "AB ≡ CD (Congruenti)" : compLenA > compLenB ? "AB > CD (AB è maggiore)" : "AB < CD (AB è minore)"}
                        </div>
                      </div>

                      {/* Binario di Allineamento (A sovrapposto a C) */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <span className="text-[11px] text-slate-500 block">
                          Allineamento degli estremi iniziali: <strong>A ≡ C</strong>
                        </span>
                        <div className="space-y-2 max-w-lg mx-auto">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs w-16 text-right text-blue-700">AB:</span>
                            <div className="h-3.5 bg-blue-500 rounded-full" style={{ width: `${compLenA * 14}px` }}></div>
                            <span className="font-mono text-xs text-slate-500">{compLenA} cm</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs w-16 text-right text-orange-700">CD:</span>
                            <div className="h-3.5 bg-orange-500 rounded-full" style={{ width: `${compLenB * 14}px` }}></div>
                            <span className="font-mono text-xs text-slate-500">{compLenB} cm</span>
                          </div>
                        </div>
                      </div>

                      {/* Proprietà Transitiva Callout */}
                      <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 text-left">
                        <strong>PROPRIETÀ TRANSITIVA DEL CONFRONTO:</strong> Se AB ≡ CD e CD ≡ EF, allora anche AB ≡ EF! E analogamente se AB &gt; CD e CD &gt; EF, allora per forza AB &gt; EF.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: SOMMA E DIFFERENZA DI SEGMENTI */}
            {/* ======================================================== */}
            {selectedSubtopic === "segments-operations" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 3 · In fila oppure sovrapposti
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      La Somma e la Differenza di Segmenti
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Per sommare due segmenti li mettiamo <strong>adiacenti (uno dopo l'altro)</strong>. Per sottrarli li <strong>sovrapponiamo</strong>: la differenza è esattamente il pezzo che avanza!
                    </p>
                  </div>

                  {/* Somma vs Differenza Teoria */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        1 · LA SOMMA (In Fila)
                      </span>
                      <h3 className="text-xl font-black text-slate-800">AB + CD = AD</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Si dispongono i due segmenti in modo che siano adiacenti (B ≡ C). Il segmento somma ha come estremi il primo (A) e l'ultimo (D). Es: 21 cm + 8 cm = 29 cm.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        2 · LA DIFFERENZA (Il pezzo che avanza)
                      </span>
                      <h3 className="text-xl font-black text-slate-800">AB − CD = DB</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Si allineano i primi due estremi (A ≡ C). La differenza è la parte di segmento maggiore che sporge oltre il minore! Es: 21 cm − 8 cm = 13 cm.
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 3: NASTRO MECCANICO SOMMA & DIFFERENZA */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Meccanico · Allineatore di Segmenti
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Costruisci la Somma o Asporta la Differenza
                      </h3>
                      <p className="text-xs text-slate-500">
                        Alterna la modalità per vedere i segmenti scivolare in fila (Somma) o sovrapporsi con forbici di taglio (Differenza)!
                      </p>

                      {/* Commutatore Somma / Differenza */}
                      <div className="flex bg-white p-1 rounded-2xl border border-slate-300 mt-2 shadow-xs">
                        <button
                          onClick={() => setOpMode("somma")}
                          className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            opMode === "somma" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Modalità SOMMA (In Fila)
                        </button>
                        <button
                          onClick={() => setOpMode("differenza")}
                          className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            opMode === "differenza" ? "bg-orange-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Modalità DIFFERENZA (Sovrapposti)
                        </button>
                      </div>
                    </div>

                    {/* Ingressi Valori e Unità */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-3xl bg-white border border-blue-200 shadow-xs flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black uppercase text-blue-700 block mb-1">Primo Segmento (AB):</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number" min="1" max="100" value={segLenA}
                              onChange={(e) => setSegLenA(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-20 p-2 text-center rounded-xl border border-blue-300 font-mono font-black text-xl text-blue-900"
                            />
                            <span className="font-bold text-slate-600">cm</span>
                          </div>
                        </div>
                        <div className="h-3 bg-blue-500 rounded-full" style={{ width: `${Math.min(segLenA * 6, 160)}px` }}></div>
                      </div>

                      <div className="p-5 rounded-3xl bg-white border border-orange-200 shadow-xs flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black uppercase text-orange-700 block mb-1">Secondo Segmento (CD):</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number" min="1" max="100" value={segLenB}
                              onChange={(e) => setSegLenB(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-20 p-2 text-center rounded-xl border border-orange-300 font-mono font-black text-xl text-orange-900"
                            />
                            <span className="font-bold text-slate-600">cm</span>
                          </div>
                        </div>
                        <div className="h-3 bg-orange-500 rounded-full" style={{ width: `${Math.min(segLenB * 6, 160)}px` }}></div>
                      </div>
                    </div>

                    {/* VISTA DINAMICA DEL NASTRO */}
                    <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xs space-y-4">
                      <span className="text-xs font-black uppercase text-slate-500 tracking-wider block text-center">
                        Rappresentazione Meccanica sulla Retta:
                      </span>

                      {opMode === "somma" ? (
                        <div className="space-y-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-200">
                          {/* Segmenti In Fila */}
                          <div className="flex items-center justify-center gap-1 overflow-x-auto py-3">
                            <div className="h-8 bg-blue-500 rounded-l-xl flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs px-4" style={{ minWidth: "120px" }}>
                              AB = {segLenA} cm
                            </div>
                            <div className="h-8 bg-orange-500 rounded-r-xl flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs px-4" style={{ minWidth: "80px" }}>
                              CD = {segLenB} cm
                            </div>
                          </div>

                          {/* Risultato Somma */}
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-blue-200">
                            <div className="text-sm font-bold text-slate-800">
                              Segmento Somma: AD = ({segLenA} + {segLenB}) cm
                            </div>
                            <div className="text-xl font-black font-mono text-blue-700 bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-300">
                              AD = {segLenA + segLenB} cm
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 p-4 rounded-2xl bg-orange-50/50 border border-orange-200">
                          {/* Segmenti Sovrapposti con Taglio */}
                          <div className="space-y-2 max-w-md mx-auto py-2">
                            <div className="flex items-center gap-2">
                              <span className="w-12 font-bold text-xs text-blue-800">AB:</span>
                              <div className="h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white font-mono font-bold text-xs" style={{ width: `${Math.min(segLenA * 10, 320)}px` }}>
                                {segLenA} cm
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-12 font-bold text-xs text-orange-800">CD:</span>
                              <div className="h-6 bg-orange-500 rounded-lg flex items-center justify-center text-white font-mono font-bold text-xs" style={{ width: `${Math.min(segLenB * 10, 320)}px` }}>
                                {segLenB} cm
                              </div>
                            </div>
                          </div>

                          {/* Differenza Rimanente */}
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-emerald-200">
                            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                              <Scissors size={18} className="text-orange-500" />
                              <span>Differenza (il pezzo che avanza): ({segLenA} − {segLenB}) cm</span>
                            </div>
                            <div className="text-xl font-black font-mono text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-300">
                              Differenza = {Math.abs(segLenA - segLenB)} cm
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Alert Attenzione alle Unità di Misura (dalla Slide 16) */}
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                        <div>
                          <strong>ATTENZIONE ALLE UNITÀ DI MISURA DIVERSE!</strong> Prima di sommare o sottrarre devi portare tutto alla stessa unità!
                          <br />
                          Esempio dalla Slide 16: 13,6 cm + 84 mm = 13,6 cm + 8,4 cm = <strong>22 cm</strong> (oppure 220 mm)!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: MULTIPLI, SOTTOMULTIPLI E PUNTO MEDIO */}
            {/* ======================================================== */}
            {selectedSubtopic === "segment-midpoint" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-200/80 shadow-xs">
                      Lezione 4 · Moltiplicare, dimezzare e trovare il centro
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Multipli, Sottomultipli & Il Punto Medio
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Un segmento può essere replicato più volte (<strong>multiplo</strong>) o diviso in parti uguali (<strong>sottomultiplo</strong>). Il <strong>punto medio</strong> è il punto che divide il segmento esattamente a metà ($AM \equiv MB$)!
                    </p>
                  </div>

                  {/* Teoria Multipli e Punto Medio */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        MULTIPLI E SOTTOMULTIPLI
                      </span>
                      <h3 className="text-xl font-black text-slate-800">Doppio, Triplo, Metà</h3>
                      <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                        <p><strong>Multiplo:</strong> CD = 3 × AB → 3 × 12 cm = 36 cm.</p>
                        <p><strong>Sottomultiplo:</strong> <Frac num="1" den="4" size="xs" /> AB → 24 cm : 4 = 6 cm.</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        IL PUNTO MEDIO (M)
                      </span>
                      <h3 className="text-xl font-black text-slate-800">AM ≡ MB (Le due metà congruenti)</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Piegando il foglio per far combaciare A con B, la piega taglia il segmento nel punto medio M. Sul piano cartesiano con le coordinate si calcola facendo la media: xM = (xA + xB) : 2 e yM = (yA + yB) : 2!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 4: BANCO PIEGA MAGICA & PIANO CARTESIANO */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-8">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Podio del Punto Medio
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        La Piega Magica & Il Punto Medio con le Coordinate
                      </h3>
                      <p className="text-xs text-slate-500">
                        Esplora come piegare il foglio per trovare la metà e sposta i punti sul piano cartesiano per vedere il calcolo della media in tempo reale!
                      </p>
                    </div>

                    {/* LIVELLO 1: LA PIEGA DEL PUNTO MEDIO & MULTIPLI */}
                    <div className="bg-white p-6 rounded-3xl border-2 border-blue-200 shadow-xs space-y-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-blue-100 pb-3">
                        <div>
                          <span className="text-xs font-black uppercase text-blue-900 block">1. Il Punto Medio Fisico</span>
                          <span className="text-sm font-bold text-slate-700">Lunghezza di AB: {midBaseLen} cm</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setMidFolded(!midFolded)}
                            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                          >
                            <RotateCcw size={14} />
                            {midFolded ? "Riapri il Foglio" : "Piega il Foglio (A su B)!"}
                          </button>
                        </div>
                      </div>

                      {/* Animazione Segmento con Punto Medio */}
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-4">
                        <div className="relative w-full max-w-lg h-16 flex items-center justify-between px-6 bg-white rounded-xl border border-slate-300">
                          {/* Estremo A */}
                          <div className="flex flex-col items-center">
                            <span className="font-mono font-bold text-xs text-blue-700">A</span>
                            <div className="w-3.5 h-3.5 rounded-full bg-blue-600"></div>
                          </div>

                          {/* Linea intera */}
                          <div className="flex-1 h-2 bg-slate-200 mx-2 relative flex items-center">
                            {/* Metà AM */}
                            <div className="h-full bg-blue-500 rounded-l-full w-1/2"></div>
                            {/* Metà MB */}
                            <div className="h-full bg-orange-500 rounded-r-full w-1/2"></div>

                            {/* Punto Medio M */}
                            <div className="absolute left-1/2 -translate-x-1/2 -top-5 flex flex-col items-center z-10">
                              <span className="font-mono font-black text-xs text-emerald-700">M (Centro)</span>
                              <div className="w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs"></div>
                              {midFolded && (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                                  Piega Combaciata!
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Estremo B */}
                          <div className="flex flex-col items-center">
                            <span className="font-mono font-bold text-xs text-orange-700">B</span>
                            <div className="w-3.5 h-3.5 rounded-full bg-orange-500"></div>
                          </div>
                        </div>

                        <div className="flex justify-around w-full max-w-md text-xs font-mono font-bold">
                          <span className="text-blue-700">AM = {(midBaseLen / 2).toFixed(1)} cm</span>
                          <span className="text-emerald-700">AM ≡ MB</span>
                          <span className="text-orange-700">MB = {(midBaseLen / 2).toFixed(1)} cm</span>
                        </div>
                      </div>
                    </div>

                    {/* LIVELLO 2: IL PUNTO MEDIO SUL PIANO CARTESIANO (SLIDE 23) */}
                    <div className="bg-white p-6 rounded-3xl border-2 border-orange-200 shadow-xs space-y-6">
                      <div className="text-center max-w-xl mx-auto space-y-1">
                        <span className="text-xs font-black uppercase text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                          2. Geometria Analitica · La Media delle Coordinate
                        </span>
                        <h4 className="text-xl font-black text-slate-800">
                          Punto Medio sul Piano Cartesiano
                        </h4>
                        <p className="text-xs text-slate-500">
                          Modifica le coordinate dei punti A e B: le formule calcolano la media aritmetica di $x$ e di $y$ per posizionare il punto medio $M$!
                        </p>
                      </div>

                      {/* Controlli Coordinate */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                          <span className="font-bold text-xs text-blue-900">Punto A:</span>
                          <div className="flex items-center gap-2 font-mono">
                            <span>x:</span>
                            <input
                              type="number" min="0" max="10" value={ptAx}
                              onChange={(e) => setPtAx(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
                              className="w-12 p-1 text-center rounded-lg border border-blue-300 bg-white font-bold"
                            />
                            <span>y:</span>
                            <input
                              type="number" min="0" max="10" value={ptAy}
                              onChange={(e) => setPtAy(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
                              className="w-12 p-1 text-center rounded-lg border border-blue-300 bg-white font-bold"
                            />
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 flex items-center justify-between">
                          <span className="font-bold text-xs text-orange-900">Punto B:</span>
                          <div className="flex items-center gap-2 font-mono">
                            <span>x:</span>
                            <input
                              type="number" min="0" max="10" value={ptBx}
                              onChange={(e) => setPtBx(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
                              className="w-12 p-1 text-center rounded-lg border border-orange-300 bg-white font-bold"
                            />
                            <span>y:</span>
                            <input
                              type="number" min="0" max="10" value={ptBy}
                              onChange={(e) => setPtBy(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
                              className="w-12 p-1 text-center rounded-lg border border-orange-300 bg-white font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Display Piano Cartesiano SVG */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-7 bg-slate-50 p-4 rounded-2xl border border-slate-300 flex items-center justify-center">
                          <svg viewBox="0 0 240 240" className="w-full max-w-[240px] h-auto">
                            {/* Griglia 10x10 */}
                            {Array.from({ length: 11 }).map((_, i) => (
                              <g key={i}>
                                <line x1={20 + i * 20} y1="20" x2={20 + i * 20} y2="220" stroke="#CBD5E1" strokeWidth="1" />
                                <line x1="20" y1={20 + i * 20} x2="220" y2={20 + i * 20} stroke="#CBD5E1" strokeWidth="1" />
                                <text x={18 + i * 20} y="235" className="text-[8px] font-mono fill-slate-400">{i}</text>
                                <text x="5" y={223 - i * 20} className="text-[8px] font-mono fill-slate-400">{i}</text>
                              </g>
                            ))}

                            {/* Assi */}
                            <line x1="20" y1="220" x2="225" y2="220" stroke="#1E293B" strokeWidth="2" />
                            <line x1="20" y1="220" x2="20" y2="15" stroke="#1E293B" strokeWidth="2" />

                            {/* Segmento AB */}
                            <line
                              x1={20 + ptAx * 20} y1={220 - ptAy * 20}
                              x2={20 + ptBx * 20} y2={220 - ptBy * 20}
                              stroke="#0284C7" strokeWidth="3"
                            />

                            {/* Punto A */}
                            <circle cx={20 + ptAx * 20} cy={220 - ptAy * 20} r="5" fill="#0284C7" />
                            <text x={25 + ptAx * 20} y={215 - ptAy * 20} className="text-[10px] font-mono font-bold fill-blue-900">A</text>

                            {/* Punto B */}
                            <circle cx={20 + ptBx * 20} cy={220 - ptBy * 20} r="5" fill="#EA580C" />
                            <text x={25 + ptBx * 20} y={215 - ptBy * 20} className="text-[10px] font-mono font-bold fill-orange-900">B</text>

                            {/* Punto Medio M */}
                            <circle cx={20 + midPointCoords.xm * 20} cy={220 - midPointCoords.ym * 20} r="6" fill="#10B981" stroke="#fff" strokeWidth="1.5" />
                            <text x={25 + midPointCoords.xm * 20} y={215 - midPointCoords.ym * 20} className="text-[10px] font-mono font-black fill-emerald-800">M</text>
                          </svg>
                        </div>

                        {/* Formule di Calcolo */}
                        <div className="md:col-span-5 space-y-3 font-mono text-xs">
                          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                            <span className="text-slate-500 font-sans block text-[11px]">Media asse X:</span>
                            <span className="font-bold text-blue-900 text-sm">
                              xM = ({ptAx} + {ptBx}) : 2 = <strong>{midPointCoords.xm}</strong>
                            </span>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                            <span className="text-slate-500 font-sans block text-[11px]">Media asse Y:</span>
                            <span className="font-bold text-orange-900 text-sm">
                              yM = ({ptAy} + {ptBy}) : 2 = <strong>{midPointCoords.ym}</strong>
                            </span>
                          </div>
                          <div className="p-3.5 bg-emerald-50 rounded-xl border-2 border-emerald-300 text-center">
                            <span className="text-[11px] text-emerald-800 font-sans uppercase font-black block">Coordinate Punto Medio:</span>
                            <span className="text-lg font-black text-emerald-700">
                              M ({midPointCoords.xm} ; {midPointCoords.ym})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: I PROBLEMI CON I SEGMENTI (CACCIATORE DI PROBLEMI) */}
            {/* ======================================================== */}
            {selectedSubtopic === "segments-problems" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-orange bg-orange-50 px-4 py-1.5 rounded-full border border-orange-200/80 shadow-xs">
                      Lezione 5 · Disegna, poi calcola
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      I Problemi con i Segmenti: I Grandi Modelli
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      I problemi geometrici e aritmetici si risolvono disegnando i <strong>segmenti a strisce uguali</strong>: togliendo la differenza restano parti uguali, oppure contando le parti del multiplo!
                    </p>
                  </div>

                  {/* I 2 Modelli a Confronto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        MODELLO 1 · SOMMA E DIFFERENZA
                      </span>
                      <h3 className="text-xl font-black text-slate-800">"A Ciascuno il Suo"</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Togli la differenza dalla somma totale: ottieni due parti uguali!<br />
                        <strong>minore</strong> = (somma − differenza) : 2<br />
                        <strong>maggiore</strong> = (somma + differenza) : 2
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        MODELLO 2 · SOMMA E MULTIPLO
                      </span>
                      <h3 className="text-xl font-black text-slate-800">"Conta le Parti Uguali"</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Se Lucia ha il doppio di Gerardo, Gerardo ha 1 parte e Lucia 2 parti $\rightarrow$ 3 parti in tutto!<br />
                        <strong>1 parte</strong> = Totale : (1 + 2) = Totale : 3.
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 5: BLUEPRINT RESOLVER DEI PROBLEMI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio Interattivo · Cacciatore di Problemi
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Risolutore Automatico a Segmenti Modulari
                      </h3>
                      <p className="text-xs text-slate-500">
                        Scegli il modello di problema, imposta i dati o carica un preset delle slide ministeriali!
                      </p>

                      {/* Commutatore Tipo Problema */}
                      <div className="flex flex-wrap justify-center bg-white p-1 rounded-2xl border border-slate-300 mt-2 shadow-xs gap-1">
                        <button
                          onClick={() => { setProbType("somma-differenza"); setProbSum(98); setProbDiff(28); }}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            probType === "somma-differenza" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600"
                          }`}
                        >
                          Somma e Differenza (Marco e Claudia)
                        </button>
                        <button
                          onClick={() => { setProbType("somma-multiplo"); setProbSum(36); setProbMultiplier(2); }}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            probType === "somma-multiplo" ? "bg-orange-600 text-white shadow-xs" : "text-slate-600"
                          }`}
                        >
                          Somma e Multiplo (I Kiwi di Gerardo e Lucia)
                        </button>
                        <button
                          onClick={() => { setProbType("differenza-multiplo"); setProbDiff(8); setProbMultiplier(3); }}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            probType === "differenza-multiplo" ? "bg-purple-600 text-white shadow-xs" : "text-slate-600"
                          }`}
                        >
                          Differenza e Multiplo (I Due Gatti)
                        </button>
                      </div>
                    </div>

                    {/* Cockpit Ingressi Dati */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                      {probType === "somma-differenza" ? (
                        <>
                          <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Somma Totale:</label>
                            <input
                              type="number" min="1" value={probSum}
                              onChange={(e) => setProbSum(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full p-2.5 rounded-xl border border-blue-300 font-mono font-black text-xl text-blue-900 bg-blue-50/30"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Differenza ("in più"):</label>
                            <input
                              type="number" min="0" value={probDiff}
                              onChange={(e) => setProbDiff(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full p-2.5 rounded-xl border border-orange-300 font-mono font-black text-xl text-orange-900 bg-orange-50/30"
                            />
                          </div>
                        </>
                      ) : probType === "somma-multiplo" ? (
                        <>
                          <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Somma Totale (es. 36 kiwi):</label>
                            <input
                              type="number" min="1" value={probSum}
                              onChange={(e) => setProbSum(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full p-2.5 rounded-xl border border-blue-300 font-mono font-black text-xl text-blue-900 bg-blue-50/30"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Rapporto Multiplo (es. 2 = doppio):</label>
                            <input
                              type="number" min="2" max="10" value={probMultiplier}
                              onChange={(e) => setProbMultiplier(Math.max(2, parseInt(e.target.value) || 2))}
                              className="w-full p-2.5 rounded-xl border border-orange-300 font-mono font-black text-xl text-orange-900 bg-orange-50/30"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Differenza (es. 8 kg):</label>
                            <input
                              type="number" min="1" value={probDiff}
                              onChange={(e) => setProbDiff(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full p-2.5 rounded-xl border border-blue-300 font-mono font-black text-xl text-blue-900 bg-blue-50/30"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Rapporto Multiplo (es. 3 = triplo):</label>
                            <input
                              type="number" min="2" max="10" value={probMultiplier}
                              onChange={(e) => setProbMultiplier(Math.max(2, parseInt(e.target.value) || 2))}
                              className="w-full p-2.5 rounded-xl border border-orange-300 font-mono font-black text-xl text-orange-900 bg-orange-50/30"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Rappresentazione a Strisce dei Segmenti */}
                    <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xs space-y-4">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                        Rappresentazione Grafica a Strisce Modulari:
                      </span>

                      {probType === "somma-differenza" ? (
                        <div className="space-y-3 font-mono text-xs max-w-lg mx-auto">
                          {/* Minore */}
                          <div className="flex items-center gap-3">
                            <span className="w-20 font-bold text-blue-700">Minore:</span>
                            <div className="h-9 flex-1 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                              Parte Base
                            </div>
                            <span className="w-16 text-right font-black text-blue-900 font-sans">{probResult.minore}</span>
                          </div>

                          {/* Maggiore con eccedenza arancio */}
                          <div className="flex items-center gap-3">
                            <span className="w-20 font-bold text-orange-700">Maggiore:</span>
                            <div className="flex flex-1 gap-1">
                              <div className="h-9 flex-1 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                                Parte Base
                              </div>
                              <div className="h-9 w-24 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                                +{probDiff}
                              </div>
                            </div>
                            <span className="w-16 text-right font-black text-orange-900 font-sans">{probResult.maggiore}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 font-mono text-xs max-w-lg mx-auto">
                          {/* 1° soggetto (1 parte) */}
                          <div className="flex items-center gap-3">
                            <span className="w-20 font-bold text-blue-700">1° (1 parte):</span>
                            <div className="h-9 flex-1 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                              {probResult.onePart}
                            </div>
                            <span className="w-16 text-right font-black text-blue-900 font-sans">{probResult.minore}</span>
                          </div>

                          {/* 2° soggetto (multiplo parti) */}
                          <div className="flex items-center gap-3">
                            <span className="w-20 font-bold text-orange-700">2° ({probMultiplier} parti):</span>
                            <div className="flex flex-1 gap-1">
                              {Array.from({ length: probMultiplier }).map((_, i) => (
                                <div key={i} className="h-9 flex-1 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                                  {probResult.onePart}
                                </div>
                              ))}
                            </div>
                            <span className="w-16 text-right font-black text-orange-900 font-sans">{probResult.maggiore}</span>
                          </div>
                        </div>
                      )}

                      {/* Calcolo Matematico Passo-Passo */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1.5">
                        {probType === "somma-differenza" ? (
                          <>
                            <p>1. Tolgo la differenza dalla somma: {probSum} − {probDiff} = {probSum - probDiff} (due parti uguali)</p>
                            <p>2. Trovo la parte minore: ({probSum} − {probDiff}) : 2 = <strong>{probResult.minore}</strong></p>
                            <p className="text-emerald-700 font-bold text-sm">
                              3. Trovo la parte maggiore: {probResult.minore} + {probDiff} = <strong>{probResult.maggiore}</strong> ✓ (Verifica: {probResult.minore} + {probResult.maggiore} = {probSum})
                            </p>
                          </>
                        ) : probType === "somma-multiplo" ? (
                          <>
                            <p>1. Conto le parti uguali totali: 1 + {probMultiplier} = {probResult.parts} parti uguali</p>
                            <p>2. Valore di 1 parte: {probSum} : {probResult.parts} = <strong>{probResult.onePart}</strong></p>
                            <p className="text-emerald-700 font-bold text-sm">
                              3. Risultati: 1° = {probResult.minore} · 2° = ({probResult.onePart} × {probMultiplier}) = <strong>{probResult.maggiore}</strong> ✓
                            </p>
                          </>
                        ) : (
                          <>
                            <p>1. Conto la differenza di parti: {probMultiplier} − 1 = {probResult.parts} parti di scarto = {probDiff}</p>
                            <p>2. Valore di 1 parte: {probDiff} : {probResult.parts} = <strong>{probResult.onePart}</strong></p>
                            <p className="text-emerald-700 font-bold text-sm">
                              3. Risultati: 1° = {probResult.minore} · 2° = ({probResult.onePart} × {probMultiplier}) = <strong>{probResult.maggiore}</strong> ✓
                            </p>
                          </>
                        )}
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
          /* TAB ALLENA (PALESTRA DI ESERCIZI: I SEGMENTI) */
          /* ======================================================== */
          <motion.div
            key="tab-allena-segments"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 px-4"
          >
            {/* Banner Palestra */}
            <div className="rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 shadow-lg text-center flex flex-col items-center gap-3.5">
              <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-amber-950 bg-white/30 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/40 shadow-xs">
                Palestra di Geometria · Livello 1ª Media
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Mettiti alla Prova con i Segmenti e i Quesiti Ufficiali INVALSI
              </h2>
              <p className="text-amber-100 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Misura, confronta, risolvi i problemi del banco di Andrea e affronta la Sfida Finale Vero/Falso!
              </p>
            </div>

            {/* SEZIONE 1: OCCHIO ALL'ERRORE TIPICO */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Attività 1 · Occhio all'Errore Tipico!
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">L'Affermazione è Corretta o Sbagliata?</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 1,
                    q: "Per misurare un segmento si allinea l'estremo A con il bordo esterno di plastica del righello.",
                    isCorrect: false,
                    explain: "ERRORE GRAVE! L'estremo A va allineato con lo ZERO (0) della scala millimetrata, non con il bordo di plastica!"
                  },
                  {
                    id: 2,
                    q: "Due segmenti adiacenti sono sempre anche consecutivi.",
                    isCorrect: true,
                    explain: "CORRETTO! Perché due segmenti siano adiacenti devono prima di tutto essere consecutivi (avere un estremo comune) e in più trovarsi sulla stessa retta."
                  },
                  {
                    id: 3,
                    q: "13 cm + 5 mm = 18 cm.",
                    isCorrect: false,
                    explain: "ERRORE SULLE UNITÀ! 5 mm = 0,5 cm, quindi la somma corretta è 13,5 cm (oppure 135 mm), non 18 cm!"
                  },
                ].map((item) => {
                  const ans = exErrors[item.id];
                  return (
                    <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-center flex flex-col justify-between">
                      <p className="text-xs text-slate-800 font-bold leading-relaxed">{item.q}</p>
                      <div className="space-y-2">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setExErrors(prev => ({ ...prev, [item.id]: true }))}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              ans === true ? "bg-blue-600 text-white border-blue-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            Vero
                          </button>
                          <button
                            onClick={() => setExErrors(prev => ({ ...prev, [item.id]: false }))}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              ans === false ? "bg-orange-500 text-white border-orange-500 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            Falso
                          </button>
                        </div>
                        {ans !== undefined && (
                          <div className={`p-2.5 rounded-xl text-[11px] font-bold ${
                            ans === item.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {ans === item.isCorrect ? "✓ Esatto! " : "✕ Sbagliato! "} {item.explain}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE 2: QUESITI UFFICIALI INVALSI (DALLE SLIDE 33 A 37) */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-blue uppercase tracking-wider">
                  Attività 2 · Quesiti Ufficiali delle Prove Nazionali INVALSI
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Come alle Prove Nazionali</h3>
              </div>

              <div className="space-y-6">
                {/* Quesito 1: Il Banco di Andrea (Slide 33) */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                      INVALSI 1 · Il Banco di Andrea
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                    Andrea misura il banco con matite da <strong>15 cm</strong>. 8 matite in fila non bastano, 9 sono troppe. Quanto può essere lungo il banco?
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: "A", val: "120 cm" },
                      { key: "B", val: "130 cm" },
                      { key: "C", val: "135 cm" },
                      { key: "D", val: "140 cm" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setInvalsiAnswers(prev => ({ ...prev, andrea: opt.key }))}
                        className={`p-3 rounded-2xl border text-center font-bold text-xs transition cursor-pointer ${
                          invalsiAnswers.andrea === opt.key
                            ? opt.key === "B"
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-xs"
                              : "bg-rose-500 text-white border-rose-500"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {opt.key}) {opt.val}
                      </button>
                    ))}
                  </div>
                  {invalsiAnswers.andrea && (
                    <div className={`p-3 rounded-xl text-xs font-bold ${
                      invalsiAnswers.andrea === "B" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {invalsiAnswers.andrea === "B"
                        ? "✓ ESATTO! 8 matite = 8 × 15 = 120 cm. 9 matite = 9 × 15 = 135 cm. Il banco deve essere compreso tra 120 e 135 cm: l'unica risposta valida è 130 cm!"
                        : "✕ Ripensa al suggerimento: 8 matite fanno 120 cm e 9 fanno 135 cm. La misura deve trovarsi tra 120 e 135!"}
                    </div>
                  )}
                </div>

                {/* Quesito 2: I Tavoli di Gino (Slide 36) */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                      INVALSI 2 · I Tavoli di Gino
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                    Un tavolo con 1 pannello quadrato e cornice misura <strong>120 cm</strong>. Con 2 pannelli misura <strong>210 cm</strong>. Quanto è lungo il tavolo con <strong>3 pannelli</strong>?
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: "A", val: "270 cm" },
                      { key: "B", val: "300 cm" },
                      { key: "C", val: "330 cm" },
                      { key: "D", val: "360 cm" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setInvalsiAnswers(prev => ({ ...prev, gino: opt.key }))}
                        className={`p-3 rounded-2xl border text-center font-bold text-xs transition cursor-pointer ${
                          invalsiAnswers.gino === opt.key
                            ? opt.key === "B"
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-xs"
                              : "bg-rose-500 text-white border-rose-500"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {opt.key}) {opt.val}
                      </button>
                    ))}
                  </div>
                  {invalsiAnswers.gino && (
                    <div className={`p-3 rounded-xl text-xs font-bold ${
                      invalsiAnswers.gino === "B" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {invalsiAnswers.gino === "B"
                        ? "✓ RISPOSTA CORRETTA! L'aggiunta di 1 pannello aumenta la lunghezza di 210 − 120 = 90 cm. Quindi con 3 pannelli sarà 210 + 90 = 300 cm!"
                        : "✕ Attento: calcola di quanto si allunga il tavolo passando da 1 a 2 pannelli: 210 − 120 = 90 cm. Aggiungi altri 90 cm!"}
                    </div>
                  )}
                </div>

                {/* Quesito 3: I Passi di Mario (Slide 37) */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                      INVALSI 3 · I Passi di Mario
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                    Mario va a scuola con passo regolare: fa <strong>90 passi al minuto</strong>, per un totale di <strong>540 passi</strong>. Ciascun passo è lungo <strong>60 cm</strong>. Quanto è lungo il percorso?
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: "A", val: "324 m" },
                      { key: "B", val: "486 m" },
                      { key: "C", val: "3,24 km" },
                      { key: "D", val: "4,86 km" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setInvalsiAnswers(prev => ({ ...prev, mario: opt.key }))}
                        className={`p-3 rounded-2xl border text-center font-bold text-xs transition cursor-pointer ${
                          invalsiAnswers.mario === opt.key
                            ? opt.key === "A"
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-xs"
                              : "bg-rose-500 text-white border-rose-500"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {opt.key}) {opt.val}
                      </button>
                    ))}
                  </div>
                  {invalsiAnswers.mario && (
                    <div className={`p-3 rounded-xl text-xs font-bold ${
                      invalsiAnswers.mario === "A" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {invalsiAnswers.mario === "A"
                        ? "✓ ESATTO! 540 passi × 60 cm = 32.400 cm = 324 m! E ci impiega esattamente 540 : 90 = 6 minuti!"
                        : "✕ Attenzione alle equivalenze: 540 × 60 cm = 32.400 cm. Converti i centimetri in metri!"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SEZIONE 3: SFIDA FINALE VERO O FALSO (SLIDE 38) */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Attività 3 · Sfida Finale a Squadre (dalla Slide 38)
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Completa la Sfida dei Segmenti</h3>
              </div>

              <div className="space-y-3">
                {[
                  { id: "a", text: "Il segmento ha due estremi.", correct: true },
                  { id: "b", text: "Due segmenti adiacenti sono sempre consecutivi.", correct: true },
                  { id: "c", text: "Se AB ≡ CD, i due segmenti hanno la stessa lunghezza.", correct: true },
                  { id: "d", text: "13 cm + 5 mm = 18 cm.", correct: false },
                  { id: "e", text: "Il punto medio divide il segmento in tre parti uguali.", correct: false },
                  { id: "f", text: "Se CD = 3 AB e AB = 4 cm, allora CD = 12 cm.", correct: true },
                ].map((item) => {
                  const ans = vfAnswers[item.id];
                  return (
                    <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
                      <span className="text-xs md:text-sm font-bold text-slate-800">
                        {item.id}) {item.text}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setVfAnswers(prev => ({ ...prev, [item.id]: true }))}
                          className={`w-10 h-9 rounded-xl font-black font-mono text-xs border transition cursor-pointer ${
                            ans === true ? "bg-blue-600 text-white border-blue-600 shadow-xs" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          V
                        </button>
                        <button
                          onClick={() => setVfAnswers(prev => ({ ...prev, [item.id]: false }))}
                          className={`w-10 h-9 rounded-xl font-black font-mono text-xs border transition cursor-pointer ${
                            ans === false ? "bg-orange-600 text-white border-orange-600 shadow-xs" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          F
                        </button>
                        {ans !== undefined && (
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                            ans === item.correct ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {ans === item.correct ? "✓ Giusto" : "✕ Errore"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE 4: EXIT TICKET 3-2-1 (SLIDE 39) */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Chiusura della Lezione · Exit Ticket 3 · 2 · 1 (Slide 39)
                </span>
                <h3 className="text-lg font-black text-slate-800">Cosa porti a casa da questa lezione?</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center">3</span>
                  <strong className="block text-blue-900">3 segmenti che vedi dal tuo banco:</strong>
                  <input
                    type="text"
                    placeholder="es. bordo del banco, matita, righello"
                    className="w-full p-2 rounded-xl bg-white border border-blue-200 text-slate-800"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-black flex items-center justify-center">2</span>
                  <strong className="block text-orange-900">2 parole nuove imparate oggi:</strong>
                  <input
                    type="text"
                    placeholder="es. congruenti, spezzata, punto medio"
                    className="w-full p-2 rounded-xl bg-white border border-orange-200 text-slate-800"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center">1</span>
                  <strong className="block text-emerald-900">1 domanda che ti resta:</strong>
                  <input
                    type="text"
                    placeholder="Scrivi una curiosità per il professore..."
                    className="w-full p-2 rounded-xl bg-white border border-emerald-200 text-slate-800"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
