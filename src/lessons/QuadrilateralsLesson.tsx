import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, Sparkles, CheckCircle2, XCircle,
  HelpCircle, ChevronRight, ChevronLeft, Award, RotateCcw,
  BookOpen, Zap, Info, Check, X, AlertCircle, Grid, Sliders,
  Shapes, LayoutGrid, Ruler, Move, Compass, Split
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
  { id: "quadrilateral-sides-angles", title: "1. Il Quadrilatero & Snodabilità", short: "1. Snodabilità & Regole" },
  { id: "trapezoids", title: "2. Il Trapezio (Basi & Proiezioni)", short: "2. Il Trapezio" },
  { id: "parallelograms", title: "3. Il Parallelogramma & Diagonali", short: "3. Parallelogramma" },
  { id: "special-parallelograms", title: "4. Rettangolo, Rombo e Quadrato", short: "4. Rettangolo, Rombo, Quadrato" },
  { id: "tangram-euler", title: "5. Diagramma di Venn & Il Tangram", short: "5. Venn & Tangram" },
];

export default function QuadrilateralsLesson({
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
    if (initialSubtopicId === "rectangles" || initialSubtopicId === "rhombuses" || initialSubtopicId === "squares") {
      return "special-parallelograms";
    }
    return "quadrilateral-sides-angles";
  });

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // LAB 1: Telaio Snodabile
  const [lab1SkewAngle, setLab1SkewAngle] = useState<number>(70); // gradi inclinazione
  const [lab1SideLengths, setLab1SideLengths] = useState<[number, number, number, number]>([13, 8, 4, 2]); // dalla slide 5

  // LAB 2: Trapezio (Basi, Proiezioni, Isoscele)
  const [trapType, setTrapType] = useState<"isoscele" | "rettangolo" | "scaleno">("isoscele");
  const [trapBaseBig, setTrapBaseBig] = useState<number>(14);
  const [trapBaseSmall, setTrapBaseSmall] = useState<number>(8);
  const [trapHeight, setTrapHeight] = useState<number>(4);
  const [trapOblSide, setTrapOblSide] = useState<number>(5);

  // LAB 3: Parallelogramma & Diagonali che si dimezzano
  const [paraBase, setParaBase] = useState<number>(7);
  const [paraSide, setParaSide] = useState<number>(5);
  const [paraAngle, setParaAngle] = useState<number>(55); // slide 13: 55° e 125°

  // LAB 4: Rettangolo, Rombo, Quadrato
  const [activeSpecial, setActiveSpecial] = useState<"rectangle" | "rhombus" | "square">("rectangle");

  // LAB 5: Diagramma di Venn & Tangram
  const [tangramSelectedPiece, setTangramSelectedPiece] = useState<string | null>(null);

  // ==========================================
  // --- STATI PALESTRA ALLENA ---
  // ==========================================
  // INVALSI 1: Perimetro Trapezio (con altezza-trabocchetto)
  const [inv1Choice, setInv1Choice] = useState<string | null>(null);

  // INVALSI 2: Piano Cartesiano A(5;0), B(9;4), D(1;4) -> C?
  const [inv2Coords, setInv2Coords] = useState<string>("");
  const [inv2Submitted, setInv2Submitted] = useState<boolean>(false);

  // INVALSI 3: Cornice 22x15 con 3cm bordo
  const [inv3Choice, setInv3Choice] = useState<string | null>(null);

  // Sfida Finale: 6 Vero/Falso
  const [vfAnswers, setVfAnswers] = useState<Record<string, boolean | null>>({});

  // Exit Ticket 3-2-1
  const [exit3, setExit3] = useState<string>("");
  const [exit2, setExit2] = useState<string>("");
  const [exit1, setExit1] = useState<string>("");
  const [exitSaved, setExitSaved] = useState<boolean>(false);

  // Calcoli Lab 2 Trapezio Isoscele
  const trapProjection = ((trapBaseBig - trapBaseSmall) / 2).toFixed(1);
  const trapPerimeter = trapBaseBig + trapBaseSmall + trapOblSide * 2;

  // Calcoli Lab 3 Parallelogramma
  const paraPerimeter = (paraBase + paraSide) * 2;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 px-3 md:px-6">
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
              I Quadrilateri
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
          <div className="lg:col-span-9 min-w-0">
            <AnimatePresence mode="wait">
            {/* ======================================================== */}
            {/* MODULO 1: IL QUADRILATERO & SNODABILITÀ */}
            {/* ======================================================== */}
            {selectedSubtopic === "quadrilateral-sides-angles" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 2 · Fondamenti del Quadrilatero
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Quattro Lati che Si Deformano & Le Regole d'Oro
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      A differenza del triangolo che è indeformabile, il quadrilatero è snodabile! Scopri la somma degli angoli (360°) e quando si può costruire.
                    </p>
                  </div>

                  {/* Teoria in 3 schede */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        ELEMENTI & DIAGONALI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">4 Lati · 4 Angoli · 2 Diagonali</h4>
                      <p className="text-xs text-slate-600">
                        Ha 4 vertici, 4 lati e <strong>2 diagonali</strong>. Una diagonale lo divide in 2 triangoli: 2 × 180° = <strong>360°</strong>!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        NON È RIGIDO!
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Figura Deformabile</h4>
                      <p className="text-xs text-slate-600">
                        Un telaio di 4 listelli uniti con fermacampioni si deforma continuamente! I lati rimangono uguali ma gli angoli cambiano.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        COSTRUIBILITÀ
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Ogni lato &lt; Somma altri 3</h4>
                      <p className="text-xs text-slate-600">
                        Es. con 17 cm &gt; 5 + 7 + 2 = 14 cm la figura NON si chiude! Con 13 cm &lt; 8 + 4 + 2 = 14 cm SI chiude!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 1: IL TELAIO SNODABILE A 4 LISTELLI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 1
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Quadrilatero Snodabile con Fermacampioni
                      </h3>
                      <p className="text-xs text-slate-500">
                        Trascina il cursore per deformare il quadrilatero: guarda come cambiano gli angoli mentre la lunghezza delle 4 stecche rimane fissa!
                      </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Inclinazione telaio:</span>
                        <span className="font-mono text-dida-blue font-black">{lab1SkewAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="90"
                        value={lab1SkewAngle}
                        onChange={(e) => setLab1SkewAngle(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-blue"
                      />
                    </div>

                    {/* Canvas Deformazione SVG */}
                    <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-6 relative shadow-inner overflow-hidden">
                      <svg width="320" height="200" viewBox="0 0 320 200">
                        {(() => {
                          const w = 140;
                          const h = 90;
                          const dx = h / Math.tan((lab1SkewAngle * Math.PI) / 180);
                          const x0 = 80;
                          const y0 = 150;

                          const pA = { x: x0, y: y0 };
                          const pB = { x: x0 + w, y: y0 };
                          const pC = { x: x0 + w + dx, y: y0 - h };
                          const pD = { x: x0 + dx, y: y0 - h };

                          return (
                            <>
                              {/* Quadrilatero colorato */}
                              <polygon
                                points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y} ${pD.x},${pD.y}`}
                                fill="rgba(0, 112, 184, 0.15)"
                                stroke="#0070B8"
                                strokeWidth="4"
                              />

                              {/* Fermacampioni sui 4 vertici */}
                              {[pA, pB, pC, pD].map((p, idx) => (
                                <g key={idx}>
                                  <circle cx={p.x} cy={p.y} r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
                                </g>
                              ))}

                              {/* Nomi vertici */}
                              <text x={pA.x - 18} y={pA.y + 12} fontSize="12" fontWeight="bold" fill="#0070B8">A ({lab1SkewAngle}°)</text>
                              <text x={pB.x + 8} y={pB.y + 12} fontSize="12" fontWeight="bold" fill="#0070B8">B ({180 - lab1SkewAngle}°)</text>
                              <text x={pC.x + 8} y={pC.y - 8} fontSize="12" fontWeight="bold" fill="#0070B8">C ({lab1SkewAngle}°)</text>
                              <text x={pD.x - 20} y={pD.y - 8} fontSize="12" fontWeight="bold" fill="#0070B8">D ({180 - lab1SkewAngle}°)</text>
                            </>
                          );
                        })()}
                      </svg>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center font-bold text-xs md:text-sm text-slate-800">
                      💡 <strong>SCOPERTA FONDAMENTALE (Slide 10):</strong> I soli lati non bastano a definire la forma di un quadrilatero!
                      Servono anche gli <strong>angoli</strong> perché le 4 stecche possono piegarsi in infiniti parallelogrammi diversi!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: IL TRAPEZIO */}
            {/* ======================================================== */}
            {selectedSubtopic === "trapezoids" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 3 · Una Sola Coppia di Lati Paralleli
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Il Trapezio: Basi, Lati Obliqui e Proiezioni
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Dal lampione stradale al tetto della mansarda: scopri la base maggiore, la base minore e la magica formula delle proiezioni nel trapezio isoscele!
                    </p>
                  </div>

                  {/* Teoria 3 Tipi di Trapezio */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        ISOSCELE
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Lati Obliqui Uguali</h4>
                      <p className="text-xs text-slate-600">
                        Diagonali congruenti, angoli alla base congruenti e due proiezioni identiche calcolabili con:
                        <br />
                        <strong>p = (B − b) : 2</strong>!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        RETTANGOLO
                      </span>
                      <h4 className="text-lg font-black text-slate-800">2 Angoli Retti (90°)</h4>
                      <p className="text-xs text-slate-600">
                        Un lato obliquo è perpendicolare alle due basi: coincide esattamente con l'altezza $h$ del trapezio!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        SCALENO
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Lati Obliqui Disuguali</h4>
                      <p className="text-xs text-slate-600">
                        I due lati obliqui hanno lunghezze diverse e formano angoli differenti rispetto alle due basi parallele.
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 2: BANCO DI MISURA DEL TRAPEZIO */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 2
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Trapezio Isoscele & La Formula delle Proiezioni
                      </h3>
                      <p className="text-xs text-slate-500">
                        Dalla Slide 9 e 25: regola la Base Maggiore (B) e la Base Minore (b) per osservare come si calcolano all'istante le proiezioni e il perimetro!
                      </p>
                    </div>

                    {/* Cursori Dimensioni */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-600 block">Base Maggiore B: {trapBaseBig} cm</span>
                        <input
                          type="range"
                          min="10"
                          max="20"
                          value={trapBaseBig}
                          onChange={(e) => setTrapBaseBig(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded accent-blue-600 cursor-pointer"
                        />
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-600 block">Base Minore b: {trapBaseSmall} cm</span>
                        <input
                          type="range"
                          min="4"
                          max={trapBaseBig - 2}
                          value={trapBaseSmall}
                          onChange={(e) => setTrapBaseSmall(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded accent-orange-600 cursor-pointer"
                        />
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-600 block">Lato Obliquo l: {trapOblSide} cm</span>
                        <input
                          type="range"
                          min="4"
                          max="10"
                          value={trapOblSide}
                          onChange={(e) => setTrapOblSide(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded accent-emerald-600 cursor-pointer"
                        />
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-600 block">Altezza h: {trapHeight} cm</span>
                        <input
                          type="range"
                          min="3"
                          max="8"
                          value={trapHeight}
                          onChange={(e) => setTrapHeight(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded accent-slate-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Canvas Trapezio Isoscele SVG */}
                    <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-4 relative shadow-inner overflow-hidden">
                      <svg width="340" height="190" viewBox="0 0 340 190">
                        {(() => {
                          const scale = 14;
                          const wBig = trapBaseBig * scale;
                          const wSmall = trapBaseSmall * scale;
                          const h = trapHeight * scale;
                          const proj = ((wBig - wSmall) / 2);
                          const x0 = 170 - wBig / 2;
                          const y0 = 150;

                          const pA = { x: x0, y: y0 };
                          const pB = { x: x0 + wBig, y: y0 };
                          const pC = { x: x0 + wBig - proj, y: y0 - h };
                          const pD = { x: x0 + proj, y: y0 - h };

                          const pH = { x: pD.x, y: y0 };
                          const pK = { x: pC.x, y: y0 };

                          return (
                            <>
                              {/* Poligono Trapezio */}
                              <polygon
                                points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y} ${pD.x},${pD.y}`}
                                fill="rgba(239, 125, 0, 0.15)"
                                stroke="#EF7D00"
                                strokeWidth="3.5"
                              />

                              {/* Altezze tratteggiate DH e CK */}
                              <line x1={pD.x} y1={pD.y} x2={pH.x} y2={pH.y} stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" />
                              <line x1={pC.x} y1={pC.y} x2={pK.x} y2={pK.y} stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" />

                              {/* Proiezioni AH e KB evidenziate in blu */}
                              <line x1={pA.x} y1={pA.y} x2={pH.x} y2={pH.y} stroke="#0070B8" strokeWidth="4" />
                              <line x1={pK.x} y1={pK.y} x2={pB.x} y2={pB.y} stroke="#0070B8" strokeWidth="4" />

                              <text x={170} y={pD.y - 8} fontSize="11" fontWeight="bold" fill="#EA580C" textAnchor="middle">
                                b = {trapBaseSmall} cm
                              </text>
                              <text x={170} y={y0 + 16} fontSize="11" fontWeight="bold" fill="#EA580C" textAnchor="middle">
                                B = {trapBaseBig} cm
                              </text>
                              <text x={(pA.x + pH.x) / 2} y={y0 + 14} fontSize="10" fontWeight="bold" fill="#0070B8" textAnchor="middle">
                                p={trapProjection}
                              </text>
                              <text x={(pK.x + pB.x) / 2} y={y0 + 14} fontSize="10" fontWeight="bold" fill="#0070B8" textAnchor="middle">
                                p={trapProjection}
                              </text>
                            </>
                          );
                        })()}
                      </svg>
                    </div>

                    {/* Statistiche & Alert Trabocchetto INVALSI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1 font-mono">
                        <p className="font-bold text-slate-900">FORMULA PROIEZIONE (Slide 9):</p>
                        <p>p = (B − b) : 2 = ({trapBaseBig} − {trapBaseSmall}) : 2 = <strong>{trapProjection} cm</strong></p>
                        <p className="pt-1 font-bold text-slate-900">CALCOLO PERIMETRO:</p>
                        <p>2p = B + b + 2×l = {trapBaseBig} + {trapBaseSmall} + 2×{trapOblSide} = <strong>{trapPerimeter} cm</strong></p>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                        <div>
                          <strong>TRABOCCHETTO INVALSI (Slide 25):</strong>
                          <br />
                          L'altezza $h$ ({trapHeight} cm) <strong>NON È UN LATO</strong>! Non deve mai essere sommata per calcolare il perimetro! Inoltre il perimetro si misura in <strong>cm</strong>, non in cm²!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: IL PARALLELOGRAMMA */}
            {/* ======================================================== */}
            {selectedSubtopic === "parallelograms" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 4 · Lati Opposti Paralleli
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Il Parallelogramma & Il Punto Medio delle Diagonali
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Lati opposti congruenti, angoli opposti congruenti e diagonali che si dimezzano scambievolmente a vicenda nel centro!
                    </p>
                  </div>

                  {/* Teoria 3 Proprietà */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        LATI OPPOSTI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Paralleli & Congruenti</h4>
                      <p className="text-xs text-slate-600">
                        AB ≡ DC e AD ≡ BC. Il perimetro è semplicemente: <strong>2p = (a + b) × 2</strong>!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        ANGOLI OPPOSTI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Â ≡ Ĉ e B̂ ≡ D̂</h4>
                      <p className="text-xs text-slate-600">
                        Gli angoli opposti sono uguali. Due angoli consecutivi sullo stesso lato sono <strong>supplementari (sommano a 180°)</strong>!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        DIAGONALI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Si Tagliano a Metà</h4>
                      <p className="text-xs text-slate-600">
                        Il loro punto di intersezione è il punto medio di entrambe! Ciascuna diagonale divide il parallelogramma in 2 triangoli congruenti.
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 3: SIMULATORE PARALLELOGRAMMA */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 3
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Parallelogramma con Diagonali & Angoli Opposti
                      </h3>
                      <p className="text-xs text-slate-500">
                        Varia l'inclinazione dell'angolo (dalla Slide 13: 55° e 125°) e guarda l'incrocio delle diagonali nel centro!
                      </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Angolo Â:</span>
                        <span className="font-mono text-dida-blue font-black">{paraAngle}°</span>
                        <span>Angolo B̂ (180° − Â):</span>
                        <span className="font-mono text-dida-orange font-black">{180 - paraAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="85"
                        value={paraAngle}
                        onChange={(e) => setParaAngle(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-blue"
                      />
                    </div>

                    {/* Canvas Parallelogramma SVG */}
                    <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-4 relative shadow-inner">
                      <svg width="340" height="200" viewBox="0 0 340 200">
                        {(() => {
                          const w = 170;
                          const h = 85;
                          const dx = h / Math.tan((paraAngle * Math.PI) / 180);
                          const x0 = 70;
                          const y0 = 150;

                          const pA = { x: x0, y: y0 };
                          const pB = { x: x0 + w, y: y0 };
                          const pC = { x: x0 + w + dx, y: y0 - h };
                          const pD = { x: x0 + dx, y: y0 - h };

                          const center = { x: (pA.x + pC.x) / 2, y: (pA.y + pC.y) / 2 };

                          return (
                            <>
                              {/* Poligono */}
                              <polygon
                                points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y} ${pD.x},${pD.y}`}
                                fill="rgba(16, 185, 129, 0.15)"
                                stroke="#10B981"
                                strokeWidth="3.5"
                              />

                              {/* Diagonali AC e BD */}
                              <line x1={pA.x} y1={pA.y} x2={pC.x} y2={pC.y} stroke="#EF7D00" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1={pB.x} y1={pB.y} x2={pD.x} y2={pD.y} stroke="#0070B8" strokeWidth="2" strokeDasharray="4 3" />

                              {/* Centro di incrocio */}
                              <circle cx={center.x} cy={center.y} r="5" fill="#DC2626" />
                              <text x={center.x + 8} y={center.y - 6} fontSize="10" fontWeight="bold" fill="#DC2626">Centro</text>

                              {/* Etichette vertici */}
                              <text x={pA.x - 14} y={pA.y + 12} fontSize="11" fontWeight="bold" fill="#1E293B">A ({paraAngle}°)</text>
                              <text x={pB.x + 4} y={pB.y + 12} fontSize="11" fontWeight="bold" fill="#1E293B">B ({180 - paraAngle}°)</text>
                              <text x={pC.x + 4} y={pC.y - 6} fontSize="11" fontWeight="bold" fill="#1E293B">C ({paraAngle}°)</text>
                              <text x={pD.x - 14} y={pD.y - 6} fontSize="11" fontWeight="bold" fill="#1E293B">D ({180 - paraAngle}°)</text>
                            </>
                          );
                        })()}
                      </svg>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center font-bold text-xs md:text-sm text-slate-800">
                      Perimetro del Parallelogramma con lati a = {paraBase} cm e b = {paraSide} cm:
                      <span className="font-mono text-dida-blue text-base ml-2">
                        2p = ({paraBase} + {paraSide}) × 2 = {paraPerimeter} cm!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: RETTANGOLO, ROMBO E QUADRATO */}
            {/* ======================================================== */}
            {selectedSubtopic === "special-parallelograms" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 5 · Parallelogrammi Speciali
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Rettangolo, Rombo e Quadrato
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Scopri i parallelogrammi speciali: il rettangolo (4 angoli retti), il rombo (4 lati congruenti) e il quadrato che è entrambi insieme!
                    </p>
                  </div>

                  {/* Switcher 3 Figure */}
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setActiveSpecial("rectangle")}
                      className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                        activeSpecial === "rectangle"
                          ? "bg-dida-blue text-white border-dida-blue shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      1. Il Rettangolo
                    </button>
                    <button
                      onClick={() => setActiveSpecial("rhombus")}
                      className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                        activeSpecial === "rhombus"
                          ? "bg-dida-orange text-white border-dida-orange shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      2. Il Rombo
                    </button>
                    <button
                      onClick={() => setActiveSpecial("square")}
                      className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                        activeSpecial === "square"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      3. Il Quadrato (Il Re!)
                    </button>
                  </div>

                  {/* Scheda Dinamica Figura */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {activeSpecial === "rectangle" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="space-y-3 text-slate-700 text-sm">
                            <span className="text-xs font-black uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                              Caratteristiche del Rettangolo
                            </span>
                            <h3 className="text-2xl font-black text-slate-800">4 Angoli Retti (90°)</h3>
                            <ul className="space-y-2 text-xs">
                              <li>• <strong>Lati:</strong> lati opposti uguali a due a due ($b$ e $h$).</li>
                              <li>• <strong>Diagonali:</strong> le due diagonali sono <strong>perfettamente CONGRUENTI</strong> ($AC \equiv BD$).</li>
                              <li>• <strong>Perimetro:</strong> $2p = (b + h) \times 2$.</li>
                            </ul>
                          </div>

                          <div className="h-56 bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-4">
                            <svg width="220" height="130" viewBox="0 0 220 130">
                              <rect x="25" y="20" width="170" height="90" fill="rgba(0,112,184,0.15)" stroke="#0070B8" strokeWidth="3" />
                              <line x1="25" y1="20" x2="195" y2="110" stroke="#EA580C" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="195" y1="20" x2="25" y2="110" stroke="#EA580C" strokeWidth="2" strokeDasharray="4 3" />
                              <text x="110" y="125" fontSize="11" fontWeight="bold" fill="#0070B8" textAnchor="middle">Diagonali UGUALI (AC ≡ BD)</text>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSpecial === "rhombus" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="space-y-3 text-slate-700 text-sm">
                            <span className="text-xs font-black uppercase text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                              Caratteristiche del Rombo
                            </span>
                            <h3 className="text-2xl font-black text-slate-800">4 Lati Congruenti</h3>
                            <ul className="space-y-2 text-xs">
                              <li>• <strong>Lati:</strong> tutti e 4 i lati sono perfettamente uguali ($l$).</li>
                              <li>• <strong>Diagonali:</strong> sono <strong>PERPENDICOLARI (a 90°)</strong> e sono bisettrici degli angoli!</li>
                              <li>• <strong>Perimetro:</strong> $2p = l \times 4$. Formula inversa: $l = 2p : 4$.</li>
                            </ul>
                          </div>

                          <div className="h-56 bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-4">
                            <svg width="200" height="150" viewBox="0 0 200 150">
                              <polygon points="100,15 180,75 100,135 20,75" fill="rgba(239,125,0,0.15)" stroke="#EF7D00" strokeWidth="3" />
                              <line x1="100" y1="15" x2="100" y2="135" stroke="#0070B8" strokeWidth="2" strokeDasharray="3 3" />
                              <line x1="20" y1="75" x2="180" y2="75" stroke="#0070B8" strokeWidth="2" strokeDasharray="3 3" />
                              <rect x="94" y="69" width="12" height="12" fill="none" stroke="#10B981" strokeWidth="1.5" />
                              <text x="100" y="147" fontSize="11" fontWeight="bold" fill="#EF7D00" textAnchor="middle">Diagonali PERPENDICOLARI (⊥)</text>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSpecial === "square" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="space-y-3 text-slate-700 text-sm">
                            <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                              Il Quadrato: Rombo + Rettangolo Insieme!
                            </span>
                            <h3 className="text-2xl font-black text-slate-800">Poligono Regolare</h3>
                            <ul className="space-y-2 text-xs">
                              <li>• Ha sia <strong>4 lati uguali</strong> (come il rombo) sia <strong>4 angoli retti</strong> (come il rettangolo)!</li>
                              <li>• Le sue diagonali sono sia <strong>CONGRUENTI</strong> sia <strong>PERPENDICOLARI</strong>!</li>
                              <li>• <strong>Perimetro:</strong> $2p = l \times 4$. Lato: $l = 2p : 4$.</li>
                            </ul>
                          </div>

                          <div className="h-56 bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-4">
                            <svg width="170" height="170" viewBox="0 0 170 170">
                              <rect x="25" y="25" width="120" height="120" fill="rgba(16,185,129,0.15)" stroke="#10B981" strokeWidth="3" />
                              <line x1="25" y1="25" x2="145" y2="145" stroke="#EA580C" strokeWidth="2" strokeDasharray="3 3" />
                              <line x1="145" y1="25" x2="25" y2="145" stroke="#EA580C" strokeWidth="2" strokeDasharray="3 3" />
                              <rect x="79" y="79" width="12" height="12" fill="none" stroke="#0070B8" strokeWidth="1.5" />
                              <text x="85" y="162" fontSize="10" fontWeight="bold" fill="#047857" textAnchor="middle">Uguali E Perpendicolari!</text>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: DIAGRAMMA DI VENN & IL TANGRAM */}
            {/* ======================================================== */}
            {selectedSubtopic === "tangram-euler" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 1 & Insiemi · Relazioni & Giochi
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Il Diagramma di Venn & I Sette Pezzi del Tangram
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Perché ogni quadrato è anche un rettangolo e anche un rombo? E come si ricompone il famoso Tangram cinese di 7 pezzi?
                    </p>
                  </div>

                  {/* Diagramma di Venn */}
                  <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        DIAGRAMMA DI EULERO-VENN (Slide 18)
                      </span>
                      <h4 className="text-lg font-black text-slate-800">
                        Chi è sottoinsieme di chi?
                      </h4>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-blue-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                      <p>
                        • <strong>Tutti i Parallelogrammi</strong> racchiudono sia i rettangoli sia i rombi.
                      </p>
                      <p>
                        • All'incrocio tra la famiglia dei <strong>Rettangoli</strong> (angoli congruenti) e dei <strong>Rombi</strong> (lati congruenti) c'è il <strong>QUADRATO</strong>!
                      </p>
                      <p className="text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        📌 <strong>Regola da ricordare:</strong> Ogni quadrato è sia un rombo sia un rettangolo! Ma non ogni rettangolo è un quadrato.
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 5: I 7 PEZZI DEL TANGRAM */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 5
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Tangram Cinese: Sette Pezzi, Mille Figure (Slide 2 & 23)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tocca i 7 pezzi per scoprire la loro forma: con questi 7 pezzi si possono formare tutti i quadrilateri del mondo!
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      {[
                        { id: "tri_big", label: "2 Triangoli Grandi", color: "bg-red-100 border-red-300 text-red-800" },
                        { id: "tri_med", label: "1 Triangolo Medio", color: "bg-blue-100 border-blue-300 text-blue-800" },
                        { id: "tri_small", label: "2 Triangoli Piccoli", color: "bg-purple-100 border-purple-300 text-purple-800" },
                        { id: "quad", label: "1 Quadrato", color: "bg-amber-100 border-amber-300 text-amber-800" },
                        { id: "para", label: "1 Parallelogramma", color: "bg-emerald-100 border-emerald-300 text-emerald-800" },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-2xl border font-bold text-xs ${item.color} shadow-xs`}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs font-medium text-slate-700">
                      💡 <strong>SFIDA DEL TANGRAM (Slide 23):</strong> Unendo i 2 triangolini piccoli puoi formare: un quadrato, un triangolo grande oppure un parallelogramma!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
          </div>
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
              «L'altezza va sommata nel perimetro?»
            </h3>
            <p className="text-sm text-rose-900 leading-relaxed">
              <strong>ATTENZIONE:</strong> Nel trapezio e nel parallelogramma l'altezza $h$ è un segmento interno utile per l'area, ma <strong>NON è un lato del contorno</strong>!
              Nel perimetro si sommano SOLO i lati esterni ($B + b + 2l$).
            </p>
          </div>

          {/* Sezione INVALSI */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-dida-blue uppercase tracking-wider">
                Prove Ufficiali Nazionali
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                Quesiti Ufficiali INVALSI sui Quadrilateri
              </h3>
            </div>

            {/* Quesito INVALSI 1: Perimetro del Trapezio (Slide 25) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  Quesito 1 · Il Perimetro del Trapezio (Slide 25)
                </span>
                <span className="text-xs text-slate-400 font-bold">4 minuti</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Trapezio isoscele: base maggiore <strong>14 cm</strong>, base minore <strong>8 cm</strong>, altezza <strong>4 cm</strong>, lati obliqui <strong>5 cm</strong>. Quanto misura il suo perimetro?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "a", label: "A) 36 cm²" },
                  { id: "b", label: "B) 31 cm" },
                  { id: "c", label: "C) 44 cm²" },
                  { id: "d", label: "D) 32 cm (Corretto)" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setInv1Choice(opt.id)}
                    className={`p-3 rounded-2xl text-xs font-bold border transition cursor-pointer text-center ${
                      inv1Choice === opt.id
                        ? opt.id === "d"
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
                  {inv1Choice === "d"
                    ? "🎉 Perfetto! Perimetro = 14 + 8 + 5 + 5 = 32 cm! L'altezza da 4 cm era solo un distrattore e il perimetro si esprime in cm, non in cm²!"
                    : "Attento: non sommare l'altezza (4 cm) e non scegliere cm² che è unità di superficie!"}
                </div>
              )}
            </div>

            {/* Quesito INVALSI 2: Foto e Cornice (Slide 28) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                  Quesito 2 · Foto e Cornice di Cartoncino (Slide 28)
                </span>
                <span className="text-xs text-slate-400 font-bold">6 minuti</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Una foto misura <strong>22 × 15 cm</strong>. Viene messa una cornice larga <strong>3 cm</strong> su tutti e 4 i lati. Quali sono le dimensioni del cartoncino completo?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "a", label: "A) 28 × 21 cm (Corretto)" },
                  { id: "b", label: "B) 25 × 21 cm" },
                  { id: "c", label: "C) 28 × 18 cm" },
                  { id: "d", label: "D) 25 × 18 cm" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setInv3Choice(opt.id)}
                    className={`p-3 rounded-2xl text-xs font-bold border transition cursor-pointer text-center ${
                      inv3Choice === opt.id
                        ? opt.id === "a"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-rose-600 text-white border-rose-600 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {inv3Choice && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold">
                  {inv3Choice === "a"
                    ? "🎉 Bravissimo! La cornice aggiunge 3 cm sia a destra che a sinistra (22 + 3 + 3 = 28 cm) e 3 cm sopra e sotto (15 + 3 + 3 = 21 cm)!"
                    : "Ricorda che la cornice è presente su ENTRAMBI i lati: devi aggiungere 3 cm due volte per ogni dimensione!"}
                </div>
              )}
            </div>
          </div>

          {/* Sfida Finale: 6 Vero / Falso (Slide 29) */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Sfida Finale a Squadre (Slide 29)
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  I 6 Vero o Falso sui Quadrilateri
                </h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-950 font-black text-xs">
                Punteggio: {Object.values(vfAnswers).filter(Boolean).length} / 6
              </span>
            </div>

            <div className="space-y-3">
              {[
                { id: "a", text: "a. La somma degli angoli interni di un quadrilatero è 360°.", correct: true },
                { id: "b", text: "b. Il trapezio ha i lati opposti paralleli a due a due.", correct: false },
                { id: "c", text: "c. Il rettangolo ha le diagonali congruenti.", correct: true },
                { id: "d", text: "d. Nel rombo le diagonali sono perpendicolari.", correct: true },
                { id: "e", text: "e. Ogni quadrato è anche un rombo.", correct: true },
                { id: "f", text: "f. Ogni rettangolo è anche un quadrato.", correct: false },
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

          {/* Exit Ticket 3-2-1 (Slide 30) */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-slate-50 border-2 border-slate-200 space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-3 py-1 rounded-full">
                Per Chiudere · Exit Ticket 3 · 2 · 1 (Slide 30)
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Il tuo taccuino di fine lezione
              </h3>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  3 quadrilateri che vedi adesso dal tuo banco (con il loro nome):
                </label>
                <input
                  type="text"
                  placeholder="Es. banco (rettangolo), foglio quaderno (rettangolo), fermaglio (parallelogramma)..."
                  value={exit3}
                  onChange={(e) => setExit3(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 border-none outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  2 formule del perimetro che ricordi:
                </label>
                <input
                  type="text"
                  placeholder="Es. rettangolo 2*(b+h), rombo l*4..."
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
                  placeholder="Es. come si calcola la superficie di un quadrilatero irregolare?"
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
