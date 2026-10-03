import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, Sparkles, CheckCircle2, XCircle,
  HelpCircle, ChevronRight, ChevronLeft, Award, RotateCcw,
  BookOpen, Zap, Compass, Scissors, Clock, Info, Check, X,
  AlertCircle, Scale, Eye, Sliders, Play, Calculator, Layers
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
  { id: "angle-def", title: "1. L'Angolo & La Misura in Gradi", short: "1. Cos'è & Gradi" },
  { id: "angles-comparison-vertical", title: "2. Il Goniometro & Confronto", short: "2. Misura & Confronto" },
  { id: "angles-consecutive-adjacent-operations", title: "3. Angoli Vicini, Opposti e Calcoli", short: "3. Vicini, Opposti & Calcoli" },
  { id: "bisector-angle-types", title: "4. Multipli, Metà e Bisettrice", short: "4. Bisettrice & Multipli" },
  { id: "complementary-supplementary-explementary", title: "5. Coppie Speciali & Problemi", short: "5. Coppie Speciali & Problemi" },
];

export default function AnglesLesson({
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
    // Backward compatibility
    if (initialSubtopicId === "angle-measure") return "angle-def";
    return "angle-def";
  });

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // LAB 1: Goniometro & Pac-Man
  const [lab1Angle, setLab1Angle] = useState<number>(60);
  const [lab1ShowConcave, setLab1ShowConcave] = useState<boolean>(false);

  // LAB 2: Stima e Lunghezza Bracci
  const [lab2ArmLengthA, setLab2ArmLengthA] = useState<number>(140);
  const [lab2ArmLengthB, setLab2ArmLengthB] = useState<number>(70);
  const [lab2AngleA, setLab2AngleA] = useState<number>(45);
  const [lab2AngleB, setLab2AngleB] = useState<number>(45);
  const [lab2Overlay, setLab2Overlay] = useState<boolean>(false);

  // LAB 3: Forbici / Meccano a X (Opposti al vertice) e Calcoli
  const [lab3AngleAlpha, setLab3AngleAlpha] = useState<number>(54); // Esattamente come nella slide 17!
  // Calcolatore Sessagesimale
  const [calcDeg1, setCalcDeg1] = useState<number>(8);
  const [calcMin1, setCalcMin1] = useState<number>(15);
  const [calcSec1, setCalcSec1] = useState<number>(27);
  const [calcDeg2, setCalcDeg2] = useState<number>(12);
  const [calcMin2, setCalcMin2] = useState<number>(40);
  const [calcSec2, setCalcSec2] = useState<number>(3);
  const [calcOp, setCalcOp] = useState<"add" | "sub">("add");

  // LAB 4: Bisettrice & Origami
  const [lab4Angle, setLab4Angle] = useState<number>(80);
  const [lab4Folded, setLab4Folded] = useState<boolean>(false);

  // LAB 5: Coppie Speciali & Problemi
  const [lab5SpecialAngle, setLab5SpecialAngle] = useState<number>(35);
  // Problema Guidato a Parti
  const [lab5ProblemModel, setLab5ProblemModel] = useState<"sum_mult" | "diff_sub">("sum_mult");
  const [lab5SumVal, setLab5SumVal] = useState<number>(120); // Dalla slide 39: somma 120, uno doppio dell'altro
  const [lab5DiffVal, setLab5DiffVal] = useState<number>(68); // Dalla slide 40: diff 68, uno 1/3 dell'altro

  // ==========================================
  // --- STATI PALESTRA ALLENA ---
  // ==========================================
  // Invalsi 1: Orologio
  const [inv1A, setInv1A] = useState<string>("");
  const [inv1B, setInv1B] = useState<string>("");
  const [inv1Submitted, setInv1Submitted] = useState<boolean>(false);

  // Invalsi 2: Piero e Rubinetto
  const [inv2Direction, setInv2Direction] = useState<string | null>(null);
  const [inv2Rotation, setInv2Rotation] = useState<string | null>(null);

  // Invalsi 3: Le due bisettrici
  const [inv3Answer, setInv3Answer] = useState<string>("");
  const [inv3Submitted, setInv3Submitted] = useState<boolean>(false);

  // Sfida Finale: 6 Vero/Falso
  const [vfAnswers, setVfAnswers] = useState<Record<string, boolean | null>>({});

  // Exit Ticket 3-2-1
  const [exit3, setExit3] = useState<string>("");
  const [exit2, setExit2] = useState<string>("");
  const [exit1, setExit1] = useState<string>("");
  const [exitSaved, setExitSaved] = useState<boolean>(false);

  // Funzione classificazione angolo
  const getAngleType = (deg: number) => {
    if (deg === 0) return { name: "Nullo", color: "text-slate-500", bg: "bg-slate-100", border: "border-slate-300" };
    if (deg > 0 && deg < 90) return { name: "Acuto", color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-300" };
    if (deg === 90) return { name: "Retto (90°)", color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-300" };
    if (deg > 90 && deg < 180) return { name: "Ottuso", color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-300" };
    if (deg === 180) return { name: "Piatto (180°)", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-300" };
    if (deg > 180 && deg < 360) return { name: "Concavo", color: "text-purple-700", bg: "bg-purple-100", border: "border-purple-300" };
    return { name: "Giro (360°)", color: "text-rose-700", bg: "bg-rose-100", border: "border-rose-300" };
  };

  // Helper calcolo sessagesimale
  const computeSexagesimal = () => {
    if (calcOp === "add") {
      let totalSec = calcSec1 + calcSec2;
      let extraMin = Math.floor(totalSec / 60);
      let remSec = totalSec % 60;

      let totalMin = calcMin1 + calcMin2 + extraMin;
      let extraDeg = Math.floor(totalMin / 60);
      let remMin = totalMin % 60;

      let totalDeg = calcDeg1 + calcDeg2 + extraDeg;
      return { deg: totalDeg, min: remMin, sec: remSec, rawSec: totalSec, rawMin: totalMin };
    } else {
      let sec1 = calcSec1;
      let min1 = calcMin1;
      let deg1 = calcDeg1;

      if (sec1 < calcSec2) {
        min1 -= 1;
        sec1 += 60;
      }
      if (min1 < calcMin2) {
        deg1 -= 1;
        min1 += 60;
      }
      let diffSec = sec1 - calcSec2;
      let diffMin = min1 - calcMin2;
      let diffDeg = deg1 - calcDeg2;

      return { deg: Math.max(0, diffDeg), min: Math.max(0, diffMin), sec: Math.max(0, diffSec), rawSec: 0, rawMin: 0 };
    }
  };

  const sexagesimalRes = computeSexagesimal();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 px-3 md:px-6">
      {/* ======================================================== */}
      {/* TOP HEADER NAVIGATION BAR */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-dida-blue hover:border-dida-blue/40 transition shadow-xs cursor-pointer"
            title="Torna all'indice generale"
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
              Gli Angoli
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

      {/* ======================================================== */}
      {/* SCHEDA 1: IMPARA (TEORIA + LABORATORI DIVERSIFICATI) */}
      {/* ======================================================== */}
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
            {/* MODULO 1: COS'È L'ANGOLO & MISURA IN GRADI */}
            {/* ======================================================== */}
            {selectedSubtopic === "angle-def" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 1 · Fondamenti degli Angoli
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Che cos'è un Angolo & Come si Misura
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Dall'alfabeto semaforico delle navi alla fetta di Pac-Man: scopri vertice, lati, ampiezza e il sistema sessagesimale a base 60!
                    </p>
                  </div>

                  {/* Schede Teoria Visiva: 3 Pilastri */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        VERTICE E LATI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Origine O & Semirette a, b</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        L'angolo è la <strong>parte di piano</strong> compresa tra due semirette che hanno la stessa origine $O$, detta <strong>vertice</strong>. I lati sono le semirette!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        CONVESSO O CONCAVO?
                      </span>
                      <h4 className="text-lg font-black text-slate-800">La Bocca di Pac-Man</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Due semirette dividono il piano in 2 parti! <strong>Convesso:</strong> NON contiene i prolungamenti dei lati (la bocca). <strong>Concavo:</strong> contiene i prolungamenti (tutto il resto del corpo)!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        SISTEMA SESSAGESIMALE
                      </span>
                      <h4 className="text-lg font-black text-slate-800">1° = 60' · 1' = 60''</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Si misura in gradi (°). Come per le ore: 1° = 60 primi, 1' = 60 secondi. L'angolo giro è di 360°!
                      </p>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* LABORATORIO 1: IL GONIOMETRO DINAMICO & PAC-MAN */}
                  {/* ======================================================== */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 1
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Quadrante degli Angoli & Visualizzatore Dinamico
                      </h3>
                      <p className="text-xs text-slate-500">
                        Trascina il cursore per aprire l'angolo da 0° a 360°. Osserva la classificazione, i raggi e la distinzione tra angolo convesso e concavo!
                      </p>
                    </div>

                    {/* Controlli Cursore Ampiezza */}
                    <div className="max-w-xl mx-auto space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>0° (Nullo)</span>
                        <span className="px-3 py-1 rounded-full bg-white border border-slate-300 shadow-xs text-dida-blue font-black text-sm">
                          {lab1Angle}°
                        </span>
                        <span>360° (Giro)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={lab1Angle}
                        onChange={(e) => setLab1Angle(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-blue"
                      />

                      {/* Preset Rapidi da Slide */}
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        {[
                          { label: "0° Nullo", val: 0 },
                          { label: "45° Acuto", val: 45 },
                          { label: "90° Retto", val: 90 },
                          { label: "120° Ottuso", val: 120 },
                          { label: "180° Piatto", val: 180 },
                          { label: "270° Concavo", val: 270 },
                          { label: "360° Giro", val: 360 },
                        ].map((btn) => (
                          <button
                            key={btn.val}
                            onClick={() => setLab1Angle(btn.val)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              lab1Angle === btn.val
                                ? "bg-dida-blue text-white border-dida-blue shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Canvas Grafico SVG dell'Angolo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="h-72 bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center relative shadow-inner overflow-hidden p-4">
                        <svg width="240" height="240" viewBox="-120 -120 240 240" className="overflow-visible">
                          {/* Cerchio guida goniometrico */}
                          <circle cx="0" cy="0" r="100" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4" />
                          <line x1="-110" y1="0" x2="110" y2="0" stroke="#CBD5E1" strokeWidth="1" />
                          <line x1="0" y1="-110" x2="0" y2="110" stroke="#CBD5E1" strokeWidth="1" />

                          {/* Settore Circolare Colorato */}
                          {lab1Angle > 0 && lab1Angle < 360 && (
                            <path
                              d={`M 0 0 L 100 0 A 100 100 0 ${lab1Angle > 180 ? 1 : 0} 0 ${
                                100 * Math.cos((-lab1Angle * Math.PI) / 180)
                              } ${100 * Math.sin((-lab1Angle * Math.PI) / 180)} Z`}
                              fill={lab1Angle > 180 ? "rgba(168, 85, 247, 0.25)" : "rgba(239, 125, 0, 0.25)"}
                              stroke={lab1Angle > 180 ? "#9333EA" : "#EF7D00"}
                              strokeWidth="2"
                            />
                          )}
                          {lab1Angle === 360 && (
                            <circle cx="0" cy="0" r="100" fill="rgba(244, 63, 94, 0.2)" stroke="#E11D48" strokeWidth="2" />
                          )}

                          {/* Se l'angolo è 90°, disegna il quadratino dell'angolo retto (slide 7) */}
                          {lab1Angle === 90 && (
                            <rect x="0" y="-18" width="18" height="18" fill="none" stroke="#10B981" strokeWidth="2.5" />
                          )}

                          {/* Lato Base Fisso OA */}
                          <line x1="0" y1="0" x2="110" y2="0" stroke="#0070B8" strokeWidth="4" strokeLinecap="round" />
                          <text x="115" y="4" fontSize="12" fontWeight="bold" fill="#0070B8">a</text>

                          {/* Lato Mobile Ruotante OB */}
                          {lab1Angle > 0 && (
                            <line
                              x1="0"
                              y1="0"
                              x2={110 * Math.cos((-lab1Angle * Math.PI) / 180)}
                              y2={110 * Math.sin((-lab1Angle * Math.PI) / 180)}
                              stroke="#EA580C"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                          )}

                          {/* Vertice O */}
                          <circle cx="0" cy="0" r="6" fill="#0070B8" />
                          <text x="-16" y="16" fontSize="12" fontWeight="bold" fill="#0070B8">O</text>
                        </svg>

                        <span className="absolute bottom-2 text-[10px] text-slate-400 font-mono">
                          Vertice O con semiretta base a e semiretta inclinata b
                        </span>
                      </div>

                      {/* Box Info Dinamiche & Badge Tipo */}
                      <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Classificazione</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-black border ${getAngleType(lab1Angle).bg} ${getAngleType(lab1Angle).color} ${getAngleType(lab1Angle).border}`}>
                              {getAngleType(lab1Angle).name}
                            </span>
                          </div>

                          <div className="text-sm font-bold text-slate-800">
                            Ampiezza impostata: <span className="font-mono text-dida-orange text-lg">{lab1Angle}°</span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {lab1Angle === 0 && "Le due semirette coincidono e non c'è apertura: ampiezza esattamente di 0°."}
                            {lab1Angle > 0 && lab1Angle < 90 && "Minore di un angolo retto (meno di 90°): è un angolo acuto!"}
                            {lab1Angle === 90 && "Ampiezza esatta di 90°: le semirette sono perpendicolari! Si indica con il quadratino."}
                            {lab1Angle > 90 && lab1Angle < 180 && "Maggiore di 90° ma minore di 180°: è un angolo ottuso!"}
                            {lab1Angle === 180 && "I due lati sono semirette opposte sulla stessa retta: angolo piatto (180°)."}
                            {lab1Angle > 180 && lab1Angle < 360 && "Maggiore di 180°: l'angolo racchiude più di mezzo piano, è un angolo concavo!"}
                            {lab1Angle === 360 && "Un giro completo intorno al vertice: ampiezza massima di 360°."}
                          </p>
                        </div>

                        {/* Alfabeto Semaforico Callout (dalla Slide 2-3) */}
                        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-start gap-3">
                          <Info className="text-orange-600 shrink-0 mt-0.5" size={18} />
                          <div>
                            <strong>ALFABETO SEMAFORICO DELLE NAVI:</strong> Nel passato i marinai usavano le braccia come semirette con bandiere!
                            Lettera <strong>A</strong> = angolo acuto; Lettera <strong>B</strong> = angolo retto (90°); Lettera <strong>C</strong> = angolo ottuso; Lettera <strong>D</strong> = angolo piatto (180°)!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: IL GONIOMETRO & IL CONFRONTO */}
            {/* ======================================================== */}
            {selectedSubtopic === "angles-comparison-vertical" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 2 & 4 · Misura & Confronto
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Il Goniometro & Il Confronto tra Angoli
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Come usare correttamente il goniometro in 3 mosse e perché la lunghezza dei lati NON cambia l'ampiezza dell'angolo!
                    </p>
                  </div>

                  {/* Teoria in 3 mosse */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        MOSSA 1
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Centro sul Vertice O</h4>
                      <p className="text-xs text-slate-600">
                        Appoggia il centro a mirino del goniometro esattamente sul vertice O dell'angolo.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        MOSSA 2
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Linea 0 su un Lato</h4>
                      <p className="text-xs text-slate-600">
                        Allinea perfettamente la linea dello 0 del goniometro con il lato base OA.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        MOSSA 3
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Leggi la Scala Giusta</h4>
                      <p className="text-xs text-slate-600">
                        Attenzione: ci sono 2 scale! Se l'angolo è acuto deve essere &lt; 90°; se è ottuso deve essere &gt; 90°!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 2: COMPARATORE & PROVA DEI BRACCI LUNGHI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 2
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        La Trappola dei Lati Lunghi & Sovrapposizione
                      </h3>
                      <p className="text-xs text-slate-500">
                        Dalla Slide 21: A ha lati lunghissimi, B ha lati cortissimi. Chi ha l'angolo più grande? Modifica le lunghezze e sovrapponi per verificare!
                      </p>
                    </div>

                    {/* Controlli Angolo A e Angolo B */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Box Angolo A */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-blue-700">Angolo A (Blu)</span>
                          <span className="font-mono font-bold text-xs bg-blue-50 px-2 py-0.5 rounded text-blue-800">
                            {lab2AngleA}° · Lunghezza braccio: {lab2ArmLengthA}px
                          </span>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] text-slate-500 block">Ampiezza:</label>
                          <input
                            type="range"
                            min="20"
                            max="140"
                            value={lab2AngleA}
                            onChange={(e) => setLab2AngleA(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
                          />
                          <label className="text-[11px] text-slate-500 block">Lunghezza semirette (finta grandezza):</label>
                          <input
                            type="range"
                            min="60"
                            max="160"
                            value={lab2ArmLengthA}
                            onChange={(e) => setLab2ArmLengthA(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                      </div>

                      {/* Box Angolo B */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-orange-700">Angolo B (Arancione)</span>
                          <span className="font-mono font-bold text-xs bg-orange-50 px-2 py-0.5 rounded text-orange-800">
                            {lab2AngleB}° · Lunghezza braccio: {lab2ArmLengthB}px
                          </span>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] text-slate-500 block">Ampiezza:</label>
                          <input
                            type="range"
                            min="20"
                            max="140"
                            value={lab2AngleB}
                            onChange={(e) => setLab2AngleB(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-orange-600"
                          />
                          <label className="text-[11px] text-slate-500 block">Lunghezza semirette (finta grandezza):</label>
                          <input
                            type="range"
                            min="60"
                            max="160"
                            value={lab2ArmLengthB}
                            onChange={(e) => setLab2ArmLengthB(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-orange-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tasto Sovrapposizione */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => setLab2Overlay(!lab2Overlay)}
                        className={`px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm border transition shadow-sm cursor-pointer ${
                          lab2Overlay
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {lab2Overlay ? "Separa gli Angoli" : "📄 Sovrapponi con Foglio Trasparente"}
                      </button>
                    </div>

                    {/* Canvas di Visualizzazione / Sovrapposizione */}
                    <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-6 relative overflow-hidden shadow-inner">
                      {lab2Overlay ? (
                        <svg width="340" height="220" viewBox="0 0 340 220" className="overflow-visible">
                          <circle cx="170" cy="180" r="5" fill="#334155" />
                          <text x="155" y="195" fontSize="12" fontWeight="bold" fill="#334155">Vertici Uniti</text>

                          {/* Base Comune */}
                          <line x1="170" y1="180" x2="300" y2="180" stroke="#64748B" strokeWidth="3" strokeDasharray="3 3" />

                          {/* Angolo A (Blu) */}
                          <line
                            x1="170"
                            y1="180"
                            x2={170 + lab2ArmLengthA * Math.cos((-lab2AngleA * Math.PI) / 180)}
                            y2={180 + lab2ArmLengthA * Math.sin((-lab2AngleA * Math.PI) / 180)}
                            stroke="#0070B8"
                            strokeWidth="3.5"
                          />

                          {/* Angolo B (Arancione) */}
                          <line
                            x1="170"
                            y1="180"
                            x2={170 + lab2ArmLengthB * Math.cos((-lab2AngleB * Math.PI) / 180)}
                            y2={180 + lab2ArmLengthB * Math.sin((-lab2AngleB * Math.PI) / 180)}
                            stroke="#EF7D00"
                            strokeWidth="3.5"
                          />
                        </svg>
                      ) : (
                        <div className="flex items-center justify-around w-full">
                          {/* Figura Angolo A */}
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-blue-700 mb-2">Angolo A ({lab2AngleA}°)</span>
                            <svg width="150" height="150" viewBox="0 0 150 150">
                              <line x1="20" y1="130" x2={20 + lab2ArmLengthA} y2="130" stroke="#0070B8" strokeWidth="3" />
                              <line
                                x1="20"
                                y1="130"
                                x2={20 + lab2ArmLengthA * Math.cos((-lab2AngleA * Math.PI) / 180)}
                                y2={130 + lab2ArmLengthA * Math.sin((-lab2AngleA * Math.PI) / 180)}
                                stroke="#0070B8"
                                strokeWidth="3"
                              />
                              <circle cx="20" cy="130" r="4" fill="#0070B8" />
                            </svg>
                          </div>

                          {/* Separatore */}
                          <div className="h-32 border-r border-slate-200"></div>

                          {/* Figura Angolo B */}
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-orange-700 mb-2">Angolo B ({lab2AngleB}°)</span>
                            <svg width="150" height="150" viewBox="0 0 150 150">
                              <line x1="20" y1="130" x2={20 + lab2ArmLengthB} y2="130" stroke="#EF7D00" strokeWidth="3" />
                              <line
                                x1="20"
                                y1="130"
                                x2={20 + lab2ArmLengthB * Math.cos((-lab2AngleB * Math.PI) / 180)}
                                y2={130 + lab2ArmLengthB * Math.sin((-lab2AngleB * Math.PI) / 180)}
                                stroke="#EF7D00"
                                strokeWidth="3"
                              />
                              <circle cx="20" cy="130" r="4" fill="#EF7D00" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Risultato del Confronto */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center font-bold text-sm">
                      {lab2AngleA === lab2AngleB ? (
                        <span className="text-emerald-700">
                          ✨ <strong>CONGRUENTI (A ≡ B):</strong> Hanno esattamente la stessa apertura di {lab2AngleA}°!
                          La lunghezza diversa dei bracci era solo un'illusione ottica!
                        </span>
                      ) : lab2AngleA > lab2AngleB ? (
                        <span className="text-blue-700">
                          📏 <strong>A È MAGGIORE (A &gt; B):</strong> {lab2AngleA}° &gt; {lab2AngleB}°. Il lato di A è più aperto e cade fuori da B!
                        </span>
                      ) : (
                        <span className="text-orange-700">
                          📐 <strong>B È MAGGIORE (A &lt; B):</strong> {lab2AngleA}° &lt; {lab2AngleB}°. L'angolo B è più spalancato!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: ANGOLI VICINI, OPPOSTI & CALCOLI */}
            {/* ======================================================== */}
            {selectedSubtopic === "angles-consecutive-adjacent-operations" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 3 & 5 · Relazioni & Operazioni
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Angoli Vicini, Opposti al Vertice & Calcoli in Colonna
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Scopri il segreto delle forbici e del meccano (gli opposti sono congruenti) e impara ad addizionare o sottrarre con il prestito in base 60!
                    </p>
                  </div>

                  {/* Teoria Consecutivi / Adiacenti / Opposti */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        CONSECUTIVI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">1 Vertice & 1 Lato in Comune</h4>
                      <p className="text-xs text-slate-600">
                        Come i guinzagli del dog-sitter: si toccano su un lato comune ma si aprono in direzioni diverse.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        ADIACENTI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Somma = 180° (Piatto)</h4>
                      <p className="text-xs text-slate-600">
                        Sono consecutivi e i loro lati non comuni formano una retta orizzontale continua!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        OPPOSTI AL VERTICE
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Due rette che si incrociano</h4>
                      <p className="text-xs text-slate-600">
                        I due angoli opposti hanno la stessa identica ampiezza: $\alpha \equiv \alpha'$ e $\beta \equiv \beta'$!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 3A: FORBICI A 'X' MECCANICHE */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 3A
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Meccano a X & Forbici Snodate
                      </h3>
                      <p className="text-xs text-slate-500">
                        Muovi l'angolo $\alpha$ e osserva come cambiano gli altri tre angoli generati dall'incrocio di due rette!
                      </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Apertura minima (15°)</span>
                        <span className="font-mono text-dida-blue font-black">{lab3AngleAlpha}°</span>
                        <span>Apertura massima (165°)</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="165"
                        value={lab3AngleAlpha}
                        onChange={(e) => setLab3AngleAlpha(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-blue"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Canvas a X */}
                      <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center shadow-inner relative overflow-hidden">
                        <svg width="260" height="220" viewBox="-130 -110 260 220">
                          {/* Rette incidenti */}
                          <line x1="-120" y1="0" x2="120" y2="0" stroke="#0070B8" strokeWidth="4" />
                          <line
                            x1={-120 * Math.cos((lab3AngleAlpha * Math.PI) / 180)}
                            y1={120 * Math.sin((lab3AngleAlpha * Math.PI) / 180)}
                            x2={120 * Math.cos((lab3AngleAlpha * Math.PI) / 180)}
                            y2={-120 * Math.sin((lab3AngleAlpha * Math.PI) / 180)}
                            stroke="#EA580C"
                            strokeWidth="4"
                          />

                          {/* Archi opposti α e α' */}
                          <path
                            d={`M 35 0 A 35 35 0 0 0 ${35 * Math.cos((-lab3AngleAlpha * Math.PI) / 180)} ${
                              35 * Math.sin((-lab3AngleAlpha * Math.PI) / 180)
                            }`}
                            fill="none"
                            stroke="#0070B8"
                            strokeWidth="4"
                          />
                          <path
                            d={`M -35 0 A 35 35 0 0 0 ${-35 * Math.cos((-lab3AngleAlpha * Math.PI) / 180)} ${
                              -35 * Math.sin((-lab3AngleAlpha * Math.PI) / 180)
                            }`}
                            fill="none"
                            stroke="#0070B8"
                            strokeWidth="4"
                          />

                          {/* Fermacampione al centro */}
                          <circle cx="0" cy="0" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />

                          <text x="45" y="-10" fontSize="13" fontWeight="bold" fill="#0070B8">α = {lab3AngleAlpha}°</text>
                          <text x="-95" y="20" fontSize="13" fontWeight="bold" fill="#0070B8">α' = {lab3AngleAlpha}°</text>
                          <text x="-15" y="-45" fontSize="13" fontWeight="bold" fill="#EA580C">β = {180 - lab3AngleAlpha}°</text>
                          <text x="-15" y="55" fontSize="13" fontWeight="bold" fill="#EA580C">β' = {180 - lab3AngleAlpha}°</text>
                        </svg>
                      </div>

                      {/* Calcolo automatico degli angoli */}
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                          <span className="text-xs font-bold text-blue-900 block">ANGOLI OPPOSTI CONGRUENTI:</span>
                          <span className="text-lg font-black text-blue-800 font-mono">
                            α = α' = {lab3AngleAlpha}°
                          </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                          <span className="text-xs font-bold text-orange-950 block">ANGOLI ADIACENTI (SUPPLEMENTARI = 180°):</span>
                          <span className="text-lg font-black text-orange-800 font-mono">
                            β = β' = 180° − {lab3AngleAlpha}° = {180 - lab3AngleAlpha}°
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                          💡 <strong>Somma dei 4 angoli:</strong> {lab3AngleAlpha}° + {180 - lab3AngleAlpha}° + {lab3AngleAlpha}° + {180 - lab3AngleAlpha}° = <strong>360°</strong> (un giro completo)!
                        </div>
                      </div>
                    </div>

                    {/* LABORATORIO 3B: CALCOLATRICE SESSAGESIMALE (FORMA NORMALE & PRESTITO) */}
                    <div className="border-t border-slate-200 pt-6 space-y-4">
                      <div className="text-center max-w-lg mx-auto space-y-1">
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                          Banco di Calcolo Sessagesimale
                        </span>
                        <h4 className="text-lg font-black text-slate-800">
                          Addizione e Sottrazione in Colonna con Prestito
                        </h4>
                      </div>

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setCalcOp("add")}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            calcOp === "add" ? "bg-dida-blue text-white border-dida-blue" : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          ➕ Addizione (con riduzione in forma normale)
                        </button>
                        <button
                          onClick={() => setCalcOp("sub")}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            calcOp === "sub" ? "bg-dida-orange text-white border-dida-orange" : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          ➖ Sottrazione (con prestito 1' = 60'')
                        </button>
                      </div>

                      {/* Display Colonnato in stile Lavagna */}
                      <div className="max-w-md mx-auto p-5 rounded-2xl bg-white border border-slate-200 shadow-sm font-mono text-center space-y-3">
                        <div className="flex justify-around text-xs font-bold text-slate-400 border-b pb-1">
                          <span>Gradi (°)</span>
                          <span>Primi (')</span>
                          <span>Secondi ('')</span>
                        </div>

                        <div className="flex justify-around text-base font-bold text-slate-800">
                          <span>{calcDeg1}°</span>
                          <span>{calcMin1}'</span>
                          <span>{calcSec1}''</span>
                        </div>

                        <div className="flex justify-around text-base font-bold text-slate-800">
                          <span className="text-dida-orange mr-4">{calcOp === "add" ? "+" : "−"}</span>
                          <span>{calcDeg2}°</span>
                          <span>{calcMin2}'</span>
                          <span>{calcSec2}''</span>
                        </div>

                        <div className="border-t-2 border-slate-700 pt-2 flex justify-around text-lg font-black text-emerald-700 bg-emerald-50 py-2 rounded-xl">
                          <span>{sexagesimalRes.deg}°</span>
                          <span>{sexagesimalRes.min}'</span>
                          <span>{sexagesimalRes.sec}''</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: MULTIPLI, METÀ E LA BISETTRICE */}
            {/* ======================================================== */}
            {selectedSubtopic === "bisector-angle-types" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 6 · Frazioni d'Angolo & Simmetria
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Multipli, Sottomultipli e la Bisettrice
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Come calcolare il doppio o un terzo di un angolo e la semiretta bisettrice che divide a metà ogni angolo!
                    </p>
                  </div>

                  {/* Teoria in pillole */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        MULTIPLI & SOTTOMULTIPLI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Doppio, Triplo, Metà</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Per moltiplicare o dividere un angolo per un numero naturale, si moltiplica o divide ciascuna unità (gradi, primi e secondi) e poi si riduce in forma normale se secondi o primi superano 60!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        LA BISETTRICE
                      </span>
                      <h4 className="text-lg font-black text-slate-800">La semiretta che taglia a metà</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Parte dal vertice e divide l'angolo in <strong>due angoli congruenti</strong>. Si trova facilmente piegando il foglio in modo da far combaciare i due lati dell'angolo!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 4: SIMULATORE DELLA BISETTRICE & PIEGA */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 4
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        La Piega Magica della Bisettrice
                      </h3>
                      <p className="text-xs text-slate-500">
                        Scegli l'ampiezza dell'angolo e aziona la piega per veder nascere la semiretta bisettrice tratteggiata!
                      </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Angolo totale:</span>
                        <span className="font-mono text-dida-blue font-black text-base">{lab4Angle}°</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="160"
                        step="2"
                        value={lab4Angle}
                        onChange={(e) => setLab4Angle(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-blue"
                      />
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={() => setLab4Folded(!lab4Folded)}
                        className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold border transition shadow-sm cursor-pointer ${
                          lab4Folded
                            ? "bg-dida-orange text-white border-dida-orange"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {lab4Folded ? "📖 Riapri l'angolo" : "✂️ Traccia la Bisettrice (Piega il foglio)"}
                      </button>
                    </div>

                    {/* Canvas della Bisettrice */}
                    <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-6 shadow-inner relative">
                      <svg width="280" height="200" viewBox="0 0 280 200">
                        <circle cx="40" cy="160" r="5" fill="#0070B8" />
                        <text x="20" y="175" fontSize="12" fontWeight="bold" fill="#0070B8">O</text>

                        {/* Lato 1 OA */}
                        <line x1="40" y1="160" x2="240" y2="160" stroke="#0070B8" strokeWidth="4" />
                        <text x="245" y="165" fontSize="12" fontWeight="bold" fill="#0070B8">A</text>

                        {/* Lato 2 OB */}
                        <line
                          x1="40"
                          y1="160"
                          x2={40 + 200 * Math.cos((-lab4Angle * Math.PI) / 180)}
                          y2={160 + 200 * Math.sin((-lab4Angle * Math.PI) / 180)}
                          stroke="#0070B8"
                          strokeWidth="4"
                        />
                        <text
                          x={45 + 200 * Math.cos((-lab4Angle * Math.PI) / 180)}
                          y={160 + 200 * Math.sin((-lab4Angle * Math.PI) / 180)}
                          fontSize="12"
                          fontWeight="bold"
                          fill="#0070B8"
                        >
                          B
                        </text>

                        {/* Bisettrice Tratteggiata Arancione */}
                        {lab4Folded && (
                          <>
                            <line
                              x1="40"
                              y1="160"
                              x2={40 + 210 * Math.cos(((-lab4Angle / 2) * Math.PI) / 180)}
                              y2={160 + 210 * Math.sin(((-lab4Angle / 2) * Math.PI) / 180)}
                              stroke="#EF7D00"
                              strokeWidth="3.5"
                              strokeDasharray="6 4"
                            />
                            <text
                              x={45 + 210 * Math.cos(((-lab4Angle / 2) * Math.PI) / 180)}
                              y={160 + 210 * Math.sin(((-lab4Angle / 2) * Math.PI) / 180)}
                              fontSize="12"
                              fontWeight="bold"
                              fill="#EF7D00"
                            >
                              Bisettrice
                            </text>
                          </>
                        )}
                      </svg>
                    </div>

                    {lab4Folded && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center font-bold text-sm text-emerald-900">
                        🎉 L'angolo di {lab4Angle}° è diviso esattamente in due metà uguali da:
                        <span className="font-mono text-base ml-2">
                          {lab4Angle / 2}° e {lab4Angle / 2}°!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: COPPIE SPECIALI & PROBLEMI CON GLI ANGOLI */}
            {/* ======================================================== */}
            {selectedSubtopic === "complementary-supplementary-explementary" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 7 & 8 · Coppie Speciali & Modelli di Problemi
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Coppie Speciali (C-S-E) & Risoluzione di Problemi
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Il trucco alfabetico: Complementari (90°), Supplementari (180°), Esplementari (360°)! E il metodo delle parti per risolvere qualsiasi problema!
                    </p>
                  </div>

                  {/* Trucco C-S-E */}
                  <div className="p-5 rounded-3xl bg-amber-50/80 border-2 border-amber-200 text-center space-y-2">
                    <span className="text-xs font-black uppercase text-amber-800 bg-white px-3 py-1 rounded-full border border-amber-300">
                      IL TRUCCO D'ORO DELLE SLIDE (PAGINA 35)
                    </span>
                    <h3 className="text-xl font-black text-amber-950 font-mono">C · S · E = 90° · 180° · 360°</h3>
                    <p className="text-xs text-amber-900">
                      In ordine <strong>alfabetico</strong> e <strong>crescente</strong>: C (Complementari = 90°), S (Supplementari = 180°), E (Esplementari = 360°)!
                    </p>
                  </div>

                  {/* LABORATORIO 5A: CALCOLATORE COPPIE SPECIALI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 5A
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Cercatore delle Coppie Speciali
                      </h3>
                      <p className="text-xs text-slate-500">
                        Imposta l'angolo iniziale α e calcola all'istante il suo complementare, supplementare ed esplementare!
                      </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Angolo base α:</span>
                        <span className="font-mono text-dida-blue font-black text-base">{lab5SpecialAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="89"
                        value={lab5SpecialAngle}
                        onChange={(e) => setLab5SpecialAngle(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-blue"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Complementare */}
                      <div className="p-5 rounded-2xl bg-white border border-blue-200 text-center space-y-2 shadow-xs">
                        <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          COMPLEMENTARE (90°)
                        </span>
                        <div className="text-2xl font-black text-slate-800 font-mono">
                          {90 - lab5SpecialAngle}°
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {lab5SpecialAngle}° + {90 - lab5SpecialAngle}° = 90° (Retto)
                        </p>
                      </div>

                      {/* Supplementare */}
                      <div className="p-5 rounded-2xl bg-white border border-orange-200 text-center space-y-2 shadow-xs">
                        <span className="text-xs font-black text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full">
                          SUPPLEMENTARE (180°)
                        </span>
                        <div className="text-2xl font-black text-slate-800 font-mono">
                          {180 - lab5SpecialAngle}°
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {lab5SpecialAngle}° + {180 - lab5SpecialAngle}° = 180° (Piatto)
                        </p>
                      </div>

                      {/* Esplementare */}
                      <div className="p-5 rounded-2xl bg-white border border-emerald-200 text-center space-y-2 shadow-xs">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          ESPLEMENTARE (360°)
                        </span>
                        <div className="text-2xl font-black text-slate-800 font-mono">
                          {360 - lab5SpecialAngle}°
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {lab5SpecialAngle}° + {360 - lab5SpecialAngle}° = 360° (Giro)
                        </p>
                      </div>
                    </div>

                    {/* LABORATORIO 5B: RISOLUTORE PROBLEMI A STRISCE E PARTI */}
                    <div className="border-t border-slate-200 pt-6 space-y-4">
                      <div className="text-center max-w-lg mx-auto space-y-1">
                        <span className="text-xs font-bold text-dida-blue uppercase tracking-wider">
                          Laboratorio 5B · Il Metodo delle Parti
                        </span>
                        <h4 className="text-lg font-black text-slate-800">
                          Risolutore Visivo di Problemi con gli Angoli
                        </h4>
                      </div>

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setLab5ProblemModel("sum_mult")}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            lab5ProblemModel === "sum_mult"
                              ? "bg-dida-blue text-white border-dida-blue"
                              : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          Modello 1: Somma e Multiplo (Slide 39)
                        </button>
                        <button
                          onClick={() => setLab5ProblemModel("diff_sub")}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            lab5ProblemModel === "diff_sub"
                              ? "bg-dida-orange text-white border-dida-orange"
                              : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          Modello 2: Differenza e Sottomultiplo (Slide 40)
                        </button>
                      </div>

                      {/* Display Risoluzione Problema Guidata */}
                      {lab5ProblemModel === "sum_mult" ? (
                        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 max-w-xl mx-auto shadow-xs">
                          <div className="text-xs text-slate-600 bg-blue-50 p-3 rounded-xl border border-blue-200">
                            <strong>Problema Slide 39:</strong> La somma di due angoli α e β è <strong>120°</strong> e β è il <strong>doppio</strong> di α (β = 2 × α). Quanto misura ciascuno?
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-blue-700 w-16">α (1 parte):</span>
                              <div className="h-6 w-20 bg-blue-500 rounded-md text-white font-bold text-xs flex items-center justify-center">
                                40°
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-orange-700 w-16">β (2 parti):</span>
                              <div className="h-6 w-20 bg-orange-500 rounded-md text-white font-bold text-xs flex items-center justify-center mr-1">
                                40°
                              </div>
                              <div className="h-6 w-20 bg-orange-500 rounded-md text-white font-bold text-xs flex items-center justify-center">
                                40°
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
                            <p>1. Conta le parti totali: 1 + 2 = <strong>3 parti uguali</strong>.</p>
                            <p>2. Valore di 1 parte: 120° : 3 = <strong>40° (quindi α = 40°)</strong>.</p>
                            <p>3. Valore di 2 parti: 40° × 2 = <strong>80° (quindi β = 80°)</strong>.</p>
                            <p className="text-emerald-700 font-bold">✓ Verifica: 40° + 80° = 120°!</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 max-w-xl mx-auto shadow-xs">
                          <div className="text-xs text-slate-600 bg-orange-50 p-3 rounded-xl border border-orange-200">
                            <strong>Problema Slide 40:</strong> La differenza tra α e β è <strong>68°</strong> e β è <Frac num="1" den="3" size="xs" /> di α. Quanto misura ciascuno?
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-blue-700 w-16">α (3 parti):</span>
                              <div className="h-6 w-16 bg-blue-500 rounded-md text-white font-bold text-xs flex items-center justify-center">34°</div>
                              <div className="h-6 w-16 bg-emerald-500 rounded-md text-white font-bold text-xs flex items-center justify-center">34°</div>
                              <div className="h-6 w-16 bg-emerald-500 rounded-md text-white font-bold text-xs flex items-center justify-center">34°</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-orange-700 w-16">β (1 parte):</span>
                              <div className="h-6 w-16 bg-orange-500 rounded-md text-white font-bold text-xs flex items-center justify-center">34°</div>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
                            <p>1. Con la differenza si tolgono le parti: 3 − 1 = <strong>2 parti</strong>.</p>
                            <p>2. Valore di 1 parte: 68° : 2 = <strong>34° (quindi β = 34°)</strong>.</p>
                            <p>3. Valore di 3 parti: 34° × 3 = <strong>102° (quindi α = 102°)</strong>.</p>
                            <p className="text-emerald-700 font-bold">✓ Verifica: 102° − 34° = 68°!</p>
                          </div>
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

      {/* ======================================================== */}
      {/* SCHEDA 2: ALLENA (PALESTRA: ERRORI, INVALSI, SFIDA, EXIT TICKET) */}
      {/* ======================================================== */}
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
              «Lati più lunghi = angolo più grande?»
            </h3>
            <p className="text-sm text-rose-900 leading-relaxed">
              <strong>ATTENZIONE:</strong> I lati di un angolo sono <strong>semirette</strong> e continuano all'infinito!
              Disegnare un segmento più lungo sul foglio <strong>NON allarga l'ampiezza dell'angolo</strong>!
              L'ampiezza misura soltanto la rotazione tra le due semirette attorno al vertice O.
            </p>
          </div>

          {/* Sezione INVALSI */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-dida-blue uppercase tracking-wider">
                Prove Ufficiali Nazionali
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                Quesiti Ufficiali INVALSI sugli Angoli
              </h3>
            </div>

            {/* Quesito INVALSI 1: L'Orologio (Slide 47) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  Quesito 1 · L'Orologio (Slide 47)
                </span>
                <span className="text-xs text-slate-400 font-bold">5 minuti</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                <strong>a.</strong> Che angolo descrive la lancetta dei minuti in mezz'ora?
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Es. 180"
                  value={inv1A}
                  onChange={(e) => setInv1A(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-bold w-32 focus:border-dida-blue outline-none"
                />
                <span className="text-sm font-bold text-slate-600">gradi (°)</span>
              </div>

              <p className="text-sm font-medium text-slate-700 pt-2">
                <strong>b.</strong> Sono le 11:00. Che ore saranno dopo che la lancetta dei minuti ha descritto un angolo di 90°?
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Es. 11:15"
                  value={inv1B}
                  onChange={(e) => setInv1B(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-bold w-36 focus:border-dida-blue outline-none"
                />
              </div>

              <button
                onClick={() => setInv1Submitted(true)}
                className="px-5 py-2 rounded-xl bg-dida-blue text-white font-bold text-xs cursor-pointer hover:bg-blue-700 shadow-xs"
              >
                Verifica Risposte
              </button>

              {inv1Submitted && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold">
                  {inv1A.trim() === "180" && (inv1B.trim() === "11:15" || inv1B.trim() === "11.15") ? (
                    "🎉 Perfetto! In un'ora (360°) ci sono 60 minuti, quindi mezz'ora è 180°! E 90° equivale a 15 minuti esatti (11:15)!"
                  ) : (
                    "💡 Soluzione: a) Mezz'ora = metà giro = 180°. b) 90° = 1/4 di giro = 15 minuti, quindi le 11:15!"
                  )}
                </div>
              )}
            </div>

            {/* Quesito INVALSI 2: Piero e la Bussola (Slide 51) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                  Quesito 2 · Piero e le Rotazioni (Slide 51)
                </span>
                <span className="text-xs text-slate-400 font-bold">6 minuti</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Piero guarda verso <strong>SUD</strong>. Gira verso destra di 90° e poi ancora verso destra di 90°. Verso dove guarda adesso?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "sud", label: "A) Sud" },
                  { id: "ovest", label: "B) Ovest" },
                  { id: "nord", label: "C) Nord (Corretto)" },
                  { id: "est", label: "D) Est" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setInv2Direction(opt.id)}
                    className={`p-3 rounded-2xl text-xs font-bold border transition cursor-pointer text-center ${
                      inv2Direction === opt.id
                        ? opt.id === "nord"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-rose-600 text-white border-rose-600 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {inv2Direction && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                  {inv2Direction === "nord"
                    ? "🎉 Bravissimo! Da Sud girare di 90° a destra porta a Ovest, e altri 90° portano a NORD (rotazione totale di 180° = angolo piatto)!"
                    : "Riprova: 90° + 90° fa 180°, cioè esattamente la direzione opposta al punto di partenza!"}
                </div>
              )}
            </div>
          </div>

          {/* Sezione Sfida Finale: 6 Vero / Falso */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Sfida Finale a Squadre (Slide 53)
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
                { id: "a", text: "a. Un angolo di 120° è un angolo ottuso.", correct: true },
                { id: "b", text: "b. L'ampiezza di un angolo dipende dalla lunghezza dei suoi lati.", correct: false },
                { id: "c", text: "c. Due angoli opposti al vertice sono congruenti.", correct: true },
                { id: "d", text: "d. 25° 70' è scritto in forma normale.", correct: false },
                { id: "e", text: "e. 35° e 55° sono angoli complementari.", correct: true },
                { id: "f", text: "f. La bisettrice di un angolo retto (90°) forma due angoli di 45°.", correct: true },
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

          {/* Exit Ticket 3-2-1 (Slide 54) */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-slate-50 border-2 border-slate-200 space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-3 py-1 rounded-full">
                Per Chiudere · Exit Ticket 3 · 2 · 1 (Slide 54)
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Il tuo taccuino di fine lezione
              </h3>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  3 angoli che vedi adesso dal tuo banco (e che tipo sono):
                </label>
                <input
                  type="text"
                  placeholder="Es. spigolo quaderno (retto), forbici aperte (acuto), porta socchiusa (ottuso)..."
                  value={exit3}
                  onChange={(e) => setExit3(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 border-none outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  2 parole nuove scoperte oggi:
                </label>
                <input
                  type="text"
                  placeholder="Es. bisettrice, esplementare..."
                  value={exit2}
                  onChange={(e) => setExit2(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 border-none outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  1 domanda che ti è rimasta in mente:
                </label>
                <input
                  type="text"
                  placeholder="Es. come si misura un angolo su una sfera?"
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
