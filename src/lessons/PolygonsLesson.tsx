import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, Sparkles, CheckCircle2, XCircle,
  HelpCircle, ChevronRight, ChevronLeft, Award, RotateCcw,
  BookOpen, Zap, Info, Check, X, AlertCircle, Grid, Sliders,
  Shapes, LayoutGrid, Ruler, Layers
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
 * Componente Frazione Reale con Linea Orizzontale (standard DidaLab)
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
  { id: "polygon-characteristics", title: "1. Cos'è un Poligono & Convesso/Concavo", short: "1. Cos'è & Convesso/Concavo" },
  { id: "polygon-perimeter", title: "2. Costruibilità & Perimetro", short: "2. Costruibilità & Perimetro" },
  { id: "polygon-diagonals", title: "3. Nomi dei Poligoni & Diagonali", short: "3. Nomi & Diagonali" },
  { id: "polygon-angles-sum", title: "4. La Somma degli Angoli", short: "4. Somma Angoli (Si & Se)" },
  { id: "regular-polygons-properties", title: "5. Poligoni Regolari & Tassellazioni", short: "5. Regolari & Tassellazioni" },
];

export default function PolygonsLesson({
  onBack,
  subjectName,
  topicName,
  initialSubtopicId,
  initialTab = "impara",
}: Props) {
  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>(() => {
    if (initialSubtopicId && SUBTOPICS.some((s) => s.id === initialSubtopicId)) {
      return initialSubtopicId;
    }
    return "polygon-characteristics";
  });

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // LAB 1: Test Convesso vs Concavo
  const [lab1Shape, setLab1Shape] = useState<"convex" | "concave">("convex");
  const [lab1ShowRulerLines, setLab1ShowRulerLines] = useState<boolean>(true);

  // LAB 2: Costruibilità (Si chiude o no?) & Spago Magico
  const [sideLong, setSideLong] = useState<number>(14);
  const [sideA, setSideA] = useState<number>(2);
  const [sideB, setSideB] = useState<number>(4);
  const [sideC, setSideC] = useState<number>(5);
  // Spago magico isoperimetrico
  const [magicRopeShape, setMagicRopeShape] = useState<"triangle" | "square" | "hexagon">("square");

  // LAB 3: Poligoni e Diagonali (da 3 a 12 lati)
  const [polygonSides, setPolygonSides] = useState<number>(5); // default pentagono

  // LAB 4: Taglio in Triangoli (Si = (n-2)*180) & Esterni (360)
  const [triangulationSides, setTriangulationSides] = useState<number>(5);

  // LAB 5: Tassellatura del piano (quali poligoni tassellano)
  const [tilingShape, setTilingShape] = useState<"triangle" | "square" | "pentagon" | "hexagon">("hexagon");

  // ==========================================
  // --- STATI PALESTRA ALLENA ---
  // ==========================================
  // INVALSI 1: Mappa USA
  const [inv1Choice, setInv1Choice] = useState<string | null>(null);

  // INVALSI 2: Prato a scalini (10m x 5m)
  const [inv2Choice, setInv2Choice] = useState<string | null>(null);

  // INVALSI 3: Ottagono sul reticolo
  const [inv3Answer, setInv3Answer] = useState<string | null>(null);

  // Sfida Finale V/F
  const [vfAnswers, setVfAnswers] = useState<Record<string, boolean | null>>({});

  // Exit Ticket 3-2-1
  const [exit3, setExit3] = useState<string>("");
  const [exit2, setExit2] = useState<string>("");
  const [exit1, setExit1] = useState<string>("");
  const [exitSaved, setExitSaved] = useState<boolean>(false);

  // Calcolo Diagonali
  const diagonalsFromVertex = Math.max(0, polygonSides - 3);
  const totalDiagonals = (polygonSides * (polygonSides - 3)) / 2;

  // Calcolo Costruibilità Lab 2
  const sumOtherSides = sideA + sideB + sideC;
  const isConstructible = sideLong < sumOtherSides;

  // Calcolo Somma Angoli Lab 4
  const numTriangles = triangulationSides - 2;
  const sumInternalAngles = numTriangles * 180;
  const singleRegularAngle = (sumInternalAngles / triangulationSides).toFixed(1);

  // Nomi Poligoni
  const getPolygonName = (n: number) => {
    const names: Record<number, string> = {
      3: "Triangolo",
      4: "Quadrilatero",
      5: "Pentagono",
      6: "Esagono",
      7: "Ettagono",
      8: "Ottagono",
      9: "Ennagono",
      10: "Decagono",
      12: "Dodecagono",
    };
    return names[n] || `${n}-gono`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 px-3 md:px-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-dida-blue hover:border-dida-blue/40 transition shadow-xs cursor-pointer"
            title="Torna indietro"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Geometria · Classe 1ª
              </span>
              <span className="text-xs font-bold text-slate-400">
                {subjectName} · {topicName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 tracking-tight">
              I Poligoni
            </h1>
          </div>
        </div>

        {/* Tab Switcher: Impara vs Allena */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setActiveTab("impara")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "impara"
                ? "bg-white text-dida-blue shadow-sm scale-102"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen size={16} className="text-dida-blue" />
            Impara
          </button>
          <button
            onClick={() => setActiveTab("allena")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "allena"
                ? "bg-white text-dida-orange shadow-sm scale-102"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Zap size={16} className="text-dida-orange" />
            Allena
          </button>
        </div>
      </div>

      {/* SCHEDA 1: IMPARA */}
      {activeTab === "impara" && (
        <div className="space-y-6">
          {/* Sotto-Argomenti Pill Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SUBTOPICS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubtopic(sub.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedSubtopic === sub.id
                    ? "bg-dida-blue text-white border-dida-blue shadow-md scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {sub.short}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ======================================================== */}
            {/* MODULO 1: COS'È UN POLIGONO & CONVESSO/CONCAVO */}
            {/* ======================================================== */}
            {selectedSubtopic === "polygon-characteristics" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 1 & 2 · Definizione e Topologia
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Che cos'è un Poligono & Il Test dei Prolungamenti
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      La parte di piano dentro una spezzata chiusa semplice: scopri lati, vertici e la differenza tra figure convesse e concave!
                    </p>
                  </div>

                  {/* 3 Pilastri Teoria */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        LA DEFINIZIONE
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Spezzata Chiusa Semplice</h4>
                      <p className="text-xs text-slate-600">
                        Un poligono è la <strong>parte di piano</strong> delimitata da una spezzata chiusa semplice. I segmenti sono i <strong>lati</strong>, gli estremi sono i <strong>vertici</strong>!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        CONSECUTIVI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Lati e Vertici Vicini</h4>
                      <p className="text-xs text-slate-600">
                        Due lati sono consecutivi se hanno un vertice in comune (es. AB e BC). Due vertici sono consecutivi se appartengono allo stesso lato!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        CONVESSO O CONCAVO?
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Il Test del Righello</h4>
                      <p className="text-xs text-slate-600">
                        Prolunga ogni lato con il righello: se <strong>nessun prolungamento</strong> attraversa il poligono è <strong>CONVESSO</strong>; se almeno uno lo attraversa è <strong>CONCAVO</strong>!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 1: IL TEST DEI PROLUNGAMENTI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 1
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Banco di Prova Convesso vs Concavo
                      </h3>
                      <p className="text-xs text-slate-500">
                        Cambia forma e attiva o disattiva le rette prolungate per vedere se attraversano l'area interna del poligono!
                      </p>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setLab1Shape("convex")}
                        className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                          lab1Shape === "convex"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Poligono Convesso (Pentagono)
                      </button>
                      <button
                        onClick={() => setLab1Shape("concave")}
                        className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                          lab1Shape === "concave"
                            ? "bg-dida-orange text-white border-dida-orange shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Poligono Concavo (a Freccia)
                      </button>
                      <button
                        onClick={() => setLab1ShowRulerLines(!lab1ShowRulerLines)}
                        className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                          lab1ShowRulerLines ? "bg-blue-100 text-blue-900 border-blue-300" : "bg-white text-slate-500 border-slate-200"
                        }`}
                      >
                        📏 {lab1ShowRulerLines ? "Nascondi Prolungamenti" : "Mostra Prolungamenti"}
                      </button>
                    </div>

                    <div className="h-72 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
                      <svg width="360" height="240" viewBox="0 0 360 240">
                        {lab1Shape === "convex" ? (
                          <>
                            {/* Prolungamenti pentagono convesso */}
                            {lab1ShowRulerLines && (
                              <g stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4">
                                <line x1="180" y1="20" x2="380" y2="180" />
                                <line x1="300" y1="110" x2="160" y2="300" />
                                <line x1="260" y1="210" x2="-20" y2="210" />
                                <line x1="100" y1="210" x2="-20" y2="50" />
                                <line x1="60" y1="110" x2="260" y2="-40" />
                              </g>
                            )}
                            {/* Pentagono Convesso */}
                            <polygon
                              points="180,40 290,110 250,200 110,200 70,110"
                              fill="rgba(16, 185, 129, 0.2)"
                              stroke="#10B981"
                              strokeWidth="3.5"
                            />
                            <text x="175" y="30" fontSize="12" fontWeight="bold" fill="#047857">A</text>
                            <text x="300" y="115" fontSize="12" fontWeight="bold" fill="#047857">B</text>
                            <text x="260" y="215" fontSize="12" fontWeight="bold" fill="#047857">C</text>
                            <text x="95" y="215" fontSize="12" fontWeight="bold" fill="#047857">D</text>
                            <text x="50" y="115" fontSize="12" fontWeight="bold" fill="#047857">E</text>
                          </>
                        ) : (
                          <>
                            {/* Prolungamenti poligono concavo che tagliano l'interno */}
                            {lab1ShowRulerLines && (
                              <g stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3">
                                {/* Prolungamento che attraversa l'interno */}
                                <line x1="70" y1="50" x2="310" y2="190" />
                                <line x1="290" y1="50" x2="50" y2="190" />
                              </g>
                            )}
                            {/* Freccia Concava */}
                            <polygon
                              points="80,50 180,110 280,50 220,200 140,200"
                              fill="rgba(239, 125, 0, 0.25)"
                              stroke="#EF7D00"
                              strokeWidth="3.5"
                            />
                            <text x="65" y="45" fontSize="12" fontWeight="bold" fill="#EA580C">A</text>
                            <text x="180" y="130" fontSize="12" fontWeight="bold" fill="#EF4444">B (rientrante)</text>
                            <text x="290" y="45" fontSize="12" fontWeight="bold" fill="#EA580C">C</text>
                            <text x="225" y="215" fontSize="12" fontWeight="bold" fill="#EA580C">D</text>
                            <text x="125" y="215" fontSize="12" fontWeight="bold" fill="#EA580C">E</text>
                          </>
                        )}
                      </svg>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center font-bold text-sm">
                      {lab1Shape === "convex" ? (
                        <span className="text-emerald-700">
                          ✅ <strong>POLIGONO CONVESSO:</strong> Nessun prolungamento attraversa la parte interna della figura! Tutti i segmenti rimangono all'esterno.
                        </span>
                      ) : (
                        <span className="text-rose-700">
                          ⚠️ <strong>POLIGONO CONCAVO:</strong> I prolungamenti rossi tratteggiati dei lati entrano e attraversano l'interno della figura!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: COSTRUIBILITÀ & PERIMETRO */}
            {/* ======================================================== */}
            {selectedSubtopic === "polygon-perimeter" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 3 · Condizione di Esistenza & Misura
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Si Può Costruire? & Il Perimetro con lo Spago
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Si può sempre costruire un poligono con qualsiasi misura di lati? E cosa significa che due figure diverse sono isoperimetriche?
                    </p>
                  </div>

                  {/* Teoria Costruibilità e Perimetro */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        REGOLA D'ORO DELLA COSTRUIBILITÀ
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Ogni lato &lt; Somma degli altri</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Un poligono si può chiudere <strong>SOLO SE</strong> ciascun lato è <strong>minore della somma di tutti gli altri lati</strong>!
                        Se un lato è troppo lungo ($14 &gt; 2 + 4 + 5 = 11$), i lati non si toccano e la spezzata resta aperta!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        PERIMETRO & ISOPERIMETRIA
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Il Giro Completo</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Il perimetro ($2p$) è la somma di tutti i lati. Due figure sono <strong>isoperimetriche</strong> quando hanno lo <strong>stesso perimetro</strong>, anche se hanno forma completamente diversa (come lo spago chiuso di 60 cm)!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 2A: SIMULATORE DI COSTRUIBILITÀ */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 2A
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Si Chiude o Non Si Chiude? (Slide 10)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Metti alla prova la regola delle strisce: verifica se la somma dei 3 lati minori riesce a coprire la lunghezza del lato lungo!
                      </p>
                    </div>

                    {/* Cursori Lati */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-600 block">Lato Lungo: {sideLong} cm</span>
                        <input
                          type="range"
                          min="6"
                          max="16"
                          value={sideLong}
                          onChange={(e) => setSideLong(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded accent-blue-600 cursor-pointer"
                        />
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-600 block">Lato 1: {sideA} cm</span>
                        <input
                          type="range"
                          min="1"
                          max="6"
                          value={sideA}
                          onChange={(e) => setSideA(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded accent-orange-600 cursor-pointer"
                        />
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-600 block">Lato 2: {sideB} cm</span>
                        <input
                          type="range"
                          min="1"
                          max="6"
                          value={sideB}
                          onChange={(e) => setSideB(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded accent-orange-600 cursor-pointer"
                        />
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-600 block">Lato 3: {sideC} cm</span>
                        <input
                          type="range"
                          min="1"
                          max="6"
                          value={sideC}
                          onChange={(e) => setSideC(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded accent-orange-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Visualizzatore Meccanico a Strisce */}
                    <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4">
                      <div className="flex flex-col items-center gap-3">
                        {/* Lato Lungo */}
                        <div className="w-full max-w-md">
                          <span className="text-xs font-bold text-slate-500 mb-1 block">Lato Lungo:</span>
                          <div
                            className="h-5 bg-blue-600 rounded-lg shadow-xs flex items-center justify-center text-white text-xs font-mono font-bold"
                            style={{ width: `${sideLong * 24}px` }}
                          >
                            {sideLong} cm
                          </div>
                        </div>

                        {/* Somma altri 3 lati */}
                        <div className="w-full max-w-md">
                          <span className="text-xs font-bold text-slate-500 mb-1 block">
                            Somma altri lati: {sideA} + {sideB} + {sideC} = <strong>{sumOtherSides} cm</strong>
                          </span>
                          <div className="flex items-center gap-1">
                            <div
                              className="h-5 bg-orange-500 rounded-l-lg flex items-center justify-center text-white text-xs font-mono"
                              style={{ width: `${sideA * 24}px` }}
                            >
                              {sideA}
                            </div>
                            <div
                              className="h-5 bg-amber-500 flex items-center justify-center text-white text-xs font-mono"
                              style={{ width: `${sideB * 24}px` }}
                            >
                              {sideB}
                            </div>
                            <div
                              className="h-5 bg-emerald-500 rounded-r-lg flex items-center justify-center text-white text-xs font-mono"
                              style={{ width: `${sideC * 24}px` }}
                            >
                              {sideC}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Esito Costruibilità */}
                      <div
                        className={`p-4 rounded-2xl border text-center font-bold text-sm ${
                          isConstructible
                            ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                            : "bg-rose-50 border-rose-300 text-rose-900"
                        }`}
                      >
                        {isConstructible ? (
                          <span>
                            🎉 <strong>SI CHIUDE!</strong> {sideLong} cm &lt; {sumOtherSides} cm. I tre lati corti sono abbastanza lunghi da congiungersi e formare il poligono!
                          </span>
                        ) : (
                          <span>
                            ❌ <strong>NON SI CHIUDE!</strong> Il lato lungo di {sideLong} cm supera la somma degli altri ({sumOtherSides} cm). La spezzata resta aperta nel vuoto!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* LABORATORIO 2B: LO SPAGO MAGICO ISOPERIMETRICO */}
                    <div className="border-t border-slate-200 pt-6 space-y-4">
                      <div className="text-center max-w-lg mx-auto space-y-1">
                        <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                          Laboratorio 2B · Lo Spago Magico (Slide 12)
                        </span>
                        <h4 className="text-lg font-black text-slate-800">
                          Figure Diverse, Stesso Perimetro (60 cm)
                        </h4>
                      </div>

                      <div className="flex justify-center gap-3">
                        {[
                          { id: "triangle", label: "Triangolo (3 lati da 20 cm)" },
                          { id: "square", label: "Quadrato (4 lati da 15 cm)" },
                          { id: "hexagon", label: "Esagono (6 lati da 10 cm)" },
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => setMagicRopeShape(btn.id as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              magicRopeShape === btn.id
                                ? "bg-dida-orange text-white border-dida-orange shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs font-medium text-slate-700 space-y-1">
                        <p>
                          Tutte e 3 le figure sono formate dallo stesso anello di spago chiuso lungo <strong>60 cm</strong>.
                        </p>
                        <p className="text-dida-blue font-bold">
                          Sono figure <strong>ISOPERIMETRICHE</strong>: stesso perimetro, ma l'esagono racchiude più superficie!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: NOMI DEI POLIGONI & DIAGONALI */}
            {/* ======================================================== */}
            {selectedSubtopic === "polygon-diagonals" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 4 · Classificazione & Combinatoria
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      I Nomi dei Poligoni & La Formula delle Diagonali
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Dal triangolo al dodecagono: unisci vertici non consecutivi e scopri quante diagonali ha qualsiasi poligono!
                    </p>
                  </div>

                  {/* Teoria Diagonali e Formula */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        COS'È LA DIAGONALE
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Segmento Non Consecutivo</h4>
                      <p className="text-xs text-slate-600">
                        Unisce due vertici che NON sono vicini. Attenzione: il triangolo ha <strong>0 diagonali</strong> perché tutti i suoi 3 vertici sono consecutivi!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        DA OGNI VERTICE
                      </span>
                      <h4 className="text-lg font-black text-slate-800 font-mono">n − 3 diagonali</h4>
                      <p className="text-xs text-slate-600">
                        Da un vertice non puoi andare verso se stesso e verso i 2 vertici vicini, quindi escono sempre $n - 3$ diagonali!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        FORMULA TOTALE
                      </span>
                      <h4 className="text-lg font-black text-slate-800 font-mono">
                        d = n × (n − 3) : 2
                      </h4>
                      <p className="text-xs text-slate-600">
                        Si divide per 2 perché ogni diagonale unisce 2 vertici (come quando 2 amici si stringono la mano)!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 3: TRACCIATORE DIAGONALI DINAMICO */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 3
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Generatore di Diagonali & Gioco delle Strette di Mano
                      </h3>
                      <p className="text-xs text-slate-500">
                        Scegli il numero di lati (da 3 a 12) per osservare tutte le diagonali tracciate all'interno e il calcolo della formula in tempo reale!
                      </p>
                    </div>

                    {/* Bottoni Rapidi Selezione Poligono */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {[3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                        <button
                          key={n}
                          onClick={() => setPolygonSides(n)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            polygonSides === n
                              ? "bg-dida-blue text-white border-dida-blue shadow-xs scale-105"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {n} lati ({getPolygonName(n)})
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Canvas Poligono con Diagonali SVG */}
                      <div className="h-72 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-4 relative shadow-inner overflow-hidden">
                        <svg width="260" height="260" viewBox="-130 -130 260 260">
                          {/* Calcolo vertici distribuiti su cerchio r=100 */}
                          {(() => {
                            const r = 95;
                            const pts = Array.from({ length: polygonSides }).map((_, i) => {
                              const angle = (i * 2 * Math.PI) / polygonSides - Math.PI / 2;
                              return {
                                x: r * Math.cos(angle),
                                y: r * Math.sin(angle),
                              };
                            });

                            // Tutte le coppie per diagonali
                            const diagLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
                            for (let i = 0; i < polygonSides; i++) {
                              for (let j = i + 1; j < polygonSides; j++) {
                                // Non deve essere lato consecutivo
                                const isSide = j === i + 1 || (i === 0 && j === polygonSides - 1);
                                if (!isSide) {
                                  diagLines.push({
                                    x1: pts[i].x,
                                    y1: pts[i].y,
                                    x2: pts[j].x,
                                    y2: pts[j].y,
                                  });
                                }
                              }
                            }

                            return (
                              <>
                                {/* Diagonali Arancioni */}
                                {diagLines.map((d, idx) => (
                                  <line
                                    key={idx}
                                    x1={d.x1}
                                    y1={d.y1}
                                    x2={d.x2}
                                    y2={d.y2}
                                    stroke="#EF7D00"
                                    strokeWidth="1.5"
                                    strokeDasharray="3 3"
                                    opacity="0.8"
                                  />
                                ))}

                                {/* Poligono Esterno Blu */}
                                <polygon
                                  points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                                  fill="rgba(0, 112, 184, 0.08)"
                                  stroke="#0070B8"
                                  strokeWidth="3.5"
                                />

                                {/* Vertici */}
                                {pts.map((p, idx) => (
                                  <circle key={idx} cx={p.x} cy={p.y} r="5" fill="#0070B8" />
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                      </div>

                      {/* Display Statistiche Formula */}
                      <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                            Formula delle Diagonali:
                          </span>
                          <div className="text-xl font-black text-slate-800">
                            {getPolygonName(polygonSides)} (n = {polygonSides})
                          </div>

                          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-mono space-y-1">
                            <p>• Da ogni singolo vertice: n − 3 = {polygonSides} − 3 = <strong>{diagonalsFromVertex} diagonali</strong></p>
                            <p>• Calcolo totale: {polygonSides} × {diagonalsFromVertex} : 2 = <strong>{totalDiagonals} diagonali totali</strong></p>
                          </div>

                          <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-xs text-orange-950">
                            🤝 <strong>IL GIOCO DELLE STRETTE DI MANO:</strong> Se {polygonSides} compagni si mettono in cerchio e ognuno stringe la mano a tutti TRANNE ai due vicini di banco, avverranno esattamente <strong>{totalDiagonals} strette di mano</strong>!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: LA SOMMA DEGLI ANGOLI */}
            {/* ======================================================== */}
            {selectedSubtopic === "polygon-angles-sum" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 6 · Angoli Interni ed Esterni
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      La Somma degli Angoli: Tutto Parte dai 180° del Triangolo
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Perché qualsiasi poligono si può tagliare in (n − 2) triangoli e perché la somma degli angoli esterni è sempre fissa a 360°!
                    </p>
                  </div>

                  {/* Teoria Somma Angoli */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        SOMMA DEGLI ANGOLI INTERNI (Si)
                      </span>
                      <h4 className="text-xl font-black text-slate-800 font-mono">
                        Si = (n − 2) × 180°
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Tracciando tutte le diagonali da un solo vertice, il poligono si scompone in <strong>(n − 2) triangoli</strong>. Poiché ogni triangolo ha somma angoli di 180°, basta moltiplicare per 180°!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        SOMMA DEGLI ANGOLI ESTERNI (Se)
                      </span>
                      <h4 className="text-xl font-black text-slate-800 font-mono">
                        Se = 360° (SEMPRE FISSA!)
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Qualunque sia il numero di lati (triangolo, pentagono o decagono), se cammini lungo tutto il contorno ritorni esattamente al punto di partenza facendo un <strong>giro completo di 360°</strong>!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 4: SIMULATORE DI TAGLIO IN TRIANGOLI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 4
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Taglio in Triangoli & Calcolo della Somma
                      </h3>
                      <p className="text-xs text-slate-500">
                        Guarda visivamente la scomposizione a ventaglio da un vertice e calcola sia la somma totale sia l'ampiezza dell'angolo singolo se è regolare!
                      </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Poligono:</span>
                        <span className="font-mono text-dida-blue font-black text-base">
                          {getPolygonName(triangulationSides)} ({triangulationSides} lati)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="8"
                        value={triangulationSides}
                        onChange={(e) => setTriangulationSides(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-blue"
                      />
                    </div>

                    {/* Tabella di Sintesi Dinamica */}
                    <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                      <div className="grid grid-cols-3 gap-3 text-center border-b pb-3">
                        <div>
                          <span className="text-[11px] text-slate-400 font-bold block">Triangoli formati</span>
                          <span className="text-lg font-black text-slate-800 font-mono">
                            {triangulationSides} − 2 = {numTriangles}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 font-bold block">Somma Angoli Interni</span>
                          <span className="text-lg font-black text-dida-blue font-mono">
                            {numTriangles} × 180° = {sumInternalAngles}°
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 font-bold block">Somma Esterni</span>
                          <span className="text-lg font-black text-emerald-700 font-mono">
                            360° fissa
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium text-center">
                        Se il poligono è regolare (tutti gli angoli uguali), ciascun angolo interno misura:
                        <br />
                        <span className="font-mono font-bold text-sm text-blue-800">
                          {sumInternalAngles}° : {triangulationSides} = {singleRegularAngle}°
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: POLIGONI REGOLARI & TASSELLAZIONI */}
            {/* ======================================================== */}
            {selectedSubtopic === "regular-polygons-properties" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 5 & Attività Finale · Proprietà & Tassellatura
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Poligoni Regolari & Il Mistero del Favo delle Api
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Equilatero, equiangolo e regolare: scopri come calcolare il perimetro e perché solo alcuni poligoni riescono a pavimentare il piano senza buchi!
                    </p>
                  </div>

                  {/* 3 Definizioni Fondamentali */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        EQUILATERO
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Tutti i Lati Uguali</h4>
                      <p className="text-xs text-slate-600">
                        Ha tutti i lati di uguale lunghezza (es. il rombo), ma non necessariamente gli angoli uguali!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        EQUIANGOLO
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Tutti gli Angoli Uguali</h4>
                      <p className="text-xs text-slate-600">
                        Ha tutti gli angoli della stessa ampiezza (es. il rettangolo con quattro angoli di 90°), ma non i lati uguali!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        REGOLARE
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Lati E Angoli Uguali</h4>
                      <p className="text-xs text-slate-600">
                        Sia equilatero sia equiangolo (es. triangolo equilatero, quadrato, esagono regolare). Formula perimetro: <strong>2p = l × n</strong>!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 5: LA TASSELLATURA DEL PIANO */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 5
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Quali Poligoni Regolari Tassellano il Piano? (Slide 29)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tassellare significa coprire il piano SENZA lasciare buchi e senza sovrapposizioni. Perché le api scelgono proprio l'esagono?
                      </p>
                    </div>

                    <div className="flex justify-center gap-3">
                      {[
                        { id: "triangle", label: "Triangoli (60°)", can: true, why: "60° × 6 = 360°" },
                        { id: "square", label: "Quadrati (90°)", can: true, why: "90° × 4 = 360°" },
                        { id: "pentagon", label: "Pentagoni (108°)", can: false, why: "108° non divide 360°" },
                        { id: "hexagon", label: "Esagoni (120°)", can: true, why: "120° × 3 = 360° (Le Api!)" },
                      ].map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => setTilingShape(btn.id as any)}
                          className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                            tilingShape === btn.id
                              ? btn.can
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                : "bg-rose-600 text-white border-rose-600 shadow-sm"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
                      {tilingShape === "hexagon" && (
                        <div className="space-y-2">
                          <span className="text-4xl">🐝🍯</span>
                          <h4 className="text-lg font-black text-emerald-800">
                            IL FAVO DELLE API: L'ESAGONO PERFETTO!
                          </h4>
                          <p className="text-xs text-slate-600 max-w-xl mx-auto">
                            L'angolo interno dell'esagono regolare è di <strong>120°</strong>. Attorno a un vertice si incontrano esattamente 3 esagoni:
                            <strong> 120° × 3 = 360°</strong>!
                            L'esagono è la forma che racchiude più miele consumando meno cera di tutte!
                          </p>
                        </div>
                      )}

                      {tilingShape === "pentagon" && (
                        <div className="space-y-2">
                          <span className="text-4xl">🚫</span>
                          <h4 className="text-lg font-black text-rose-800">
                            IL PENTAGONO LASCIA BUCHI VUOTI!
                          </h4>
                          <p className="text-xs text-slate-600 max-w-xl mx-auto">
                            L'angolo interno del pentagono regolare è di <strong>108°</strong>. Tre pentagoni fanno 324° (mancano 36°), quattro farebbero 432° (si accavallano). È impossibile pavimentare con soli pentagoni regolari!
                          </p>
                        </div>
                      )}

                      {(tilingShape === "triangle" || tilingShape === "square") && (
                        <div className="space-y-2">
                          <span className="text-4xl">🧱</span>
                          <h4 className="text-lg font-black text-blue-800">
                            TASSELLAZIONE REGOLARE RIUSCITA!
                          </h4>
                          <p className="text-xs text-slate-600 max-w-xl mx-auto">
                            L'angolo interno è un sottomultiplo esatto di 360°: il vertice si riempie completamente senza lasciare alcuna fessura!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* SCHEDA 2: ALLENA */}
      {activeTab === "allena" && (
        <div className="space-y-8">
          {/* Sezione Errore Tipico */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-rose-50/60 border-2 border-rose-200 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-white px-3 py-1 rounded-full border border-rose-200">
                Occhio all'Errore Tipico!
              </span>
            </div>
            <h3 className="text-xl font-black text-rose-950">
              «I triangoli hanno diagonali?»
            </h3>
            <p className="text-sm text-rose-900 leading-relaxed">
              <strong>ATTENZIONE:</strong> La diagonale per definizione deve unire due vertici <strong>NON consecutivi</strong>.
              In un triangolo ci sono solo 3 vertici e sono tutti e tre vicini tra loro (consecutivi). Quindi il triangolo ha <strong>ZERO diagonali</strong>: d = 3 × (3 − 3) : 2 = 0!
            </p>
          </div>

          {/* Sezione INVALSI */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-dida-blue uppercase tracking-wider">
                Prove Ufficiali Nazionali
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                Quesiti Ufficiali INVALSI sui Poligoni
              </h3>
            </div>

            {/* Quesito INVALSI 1: La Carta degli USA (Slide 31) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  Quesito 1 · La Carta degli Stati Uniti (Slide 31)
                </span>
                <span className="text-xs text-slate-400 font-bold">4 minuti</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Osservando i confini geografici, quale di questi stati dell'Ovest americano ha la forma di un <strong>esagono (6 lati)</strong>?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "colorado", label: "A) Colorado (4 lati)" },
                  { id: "utah", label: "B) Utah (6 lati - Corretto)" },
                  { id: "nevada", label: "C) Nevada" },
                  { id: "newmexico", label: "D) New Mexico" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setInv1Choice(opt.id)}
                    className={`p-3 rounded-2xl text-xs font-bold border transition cursor-pointer text-center ${
                      inv1Choice === opt.id
                        ? opt.id === "utah"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-rose-600 text-white border-rose-600 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {inv1Choice && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                  {inv1Choice === "utah"
                    ? "🎉 Bravissimo! Lo Utah ha 6 lati di confine (un rettangolo con una rientranza in alto a destra dovuta al Wyoming)!"
                    : "Riprova: il Colorado ha 4 lati (rettangolo), lo Utah ne ha esattamente 6!"}
                </div>
              )}
            </div>

            {/* Quesito INVALSI 2: Il Prato a Scalini (Slide 33) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                  Quesito 2 · Scalini e Perimetro (Slide 33)
                </span>
                <span className="text-xs text-slate-400 font-bold">6 minuti</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Il prato di Paolo ha forma a scalini: la base è lunga <strong>10 m</strong> e l'altezza totale è <strong>5 m</strong>. Si può calcolare il perimetro senza conoscere la misura dei singoli gradini?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "a", label: "A) Sì, 15 m" },
                  { id: "b", label: "B) Sì, 30 m (Corretto)" },
                  { id: "c", label: "C) Sì, 50 m" },
                  { id: "d", label: "D) Non si può" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setInv2Choice(opt.id)}
                    className={`p-3 rounded-2xl text-xs font-bold border transition cursor-pointer text-center ${
                      inv2Choice === opt.id
                        ? opt.id === "b"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-rose-600 text-white border-rose-600 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {inv2Choice && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold">
                  {inv2Choice === "b"
                    ? "🎉 Esatto! Proiettando i tratti orizzontali dei gradini si ottiene di nuovo la base da 10 m, e proiettando quelli verticali l'altezza da 5 m: perimetro = (10 + 5) × 2 = 30 m!"
                    : "Pensa alla proiezione: la somma di tutti i pezzetti orizzontali fa 10 m e quella dei verticali fa 5 m!"}
                </div>
              )}
            </div>
          </div>

          {/* Sfida Finale 6 V/F (Slide 35) */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Sfida Finale a Squadre (Slide 35)
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  I 6 Vero o Falso
                </h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-950 font-black text-xs">
                Punteggio: {Object.values(vfAnswers).filter(Boolean).length} / 6
              </span>
            </div>

            <div className="space-y-3">
              {[
                { id: "a", text: "a. Un cerchio è un poligono.", correct: false },
                { id: "b", text: "b. Il triangolo non ha diagonali.", correct: true },
                { id: "c", text: "c. Con lati di 2, 3 e 8 cm si può costruire un triangolo.", correct: false },
                { id: "d", text: "d. Un quadrato è un poligono regolare.", correct: true },
                { id: "e", text: "e. La somma degli angoli interni di un esagono è 720°.", correct: true },
                { id: "f", text: "f. La somma degli angoli esterni dipende dal numero di lati.", correct: false },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <span className="text-xs md:text-sm font-bold text-slate-800">{item.text}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setVfAnswers((prev) => ({ ...prev, [item.id]: item.correct === true }))}
                      className={`px-4 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                        vfAnswers[item.id] !== undefined
                          ? item.correct === true
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-400 border-slate-200"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      VERO
                    </button>
                    <button
                      onClick={() => setVfAnswers((prev) => ({ ...prev, [item.id]: item.correct === false }))}
                      className={`px-4 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                        vfAnswers[item.id] !== undefined
                          ? item.correct === false
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-400 border-slate-200"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      FALSO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exit Ticket 3-2-1 (Slide 36) */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-slate-50 border-2 border-slate-200 space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-3 py-1 rounded-full">
                Per Chiudere · Exit Ticket 3 · 2 · 1 (Slide 36)
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Il tuo taccuino di fine lezione
              </h3>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  3 poligoni che vedi adesso dal tuo banco (con il loro nome):
                </label>
                <input
                  type="text"
                  placeholder="Es. banco (quadrilatero/rettangolo), matita a sezione esagonale, squadra (triangolo)..."
                  value={exit3}
                  onChange={(e) => setExit3(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 border-none outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  2 formule nuove scoperte oggi:
                </label>
                <input
                  type="text"
                  placeholder="Es. d = n*(n-3)/2, Si = (n-2)*180°..."
                  value={exit2}
                  onChange={(e) => setExit2(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 border-none outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  1 domanda che ti resta:
                </label>
                <input
                  type="text"
                  placeholder="Es. esistono poligoni con 1000 lati?"
                  value={exit1}
                  onChange={(e) => setExit1(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 border-none outline-none"
                />
              </div>

              <button
                onClick={() => setExitSaved(true)}
                className="w-full py-3 rounded-2xl bg-dida-blue text-white font-bold text-sm shadow-md hover:bg-blue-700 transition cursor-pointer"
              >
                {exitSaved ? "✓ Registrato con successo nel tuo quaderno DidaLab!" : "Salva Exit Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
