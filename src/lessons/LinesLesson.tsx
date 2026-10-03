import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, Sparkles, CheckCircle2, XCircle,
  HelpCircle, ChevronRight, ChevronLeft, Award, RotateCcw,
  BookOpen, Zap, Info, Check, X, AlertCircle, Grid, Sliders,
  Move, Scissors, Ruler, Split, Layers, Sun
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
  { id: "lines-positions-plane", title: "1. Posizioni Reciproche & Pieghe", short: "1. Posizioni & Pieghe" },
  { id: "perpendicular-lines", title: "2. Rette Perpendicolari & Squadra", short: "2. Perpendicolari" },
  { id: "distance-point-line-segment-bisector", title: "3. Distanza, Proiezione & Asse", short: "3. Distanza & Asse" },
  { id: "parallel-lines", title: "4. Rette Parallele & I Binari", short: "4. Parallele & Binari" },
  { id: "transversal-lines", title: "5. Tre Rette, Otto Angoli", short: "5. La Trasversale (8 Angoli)" },
];

export default function LinesLesson({
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
    if (initialSubtopicId === "cartesian-reference-perpendicular-rays") {
      return "distance-point-line-segment-bisector";
    }
    return "lines-positions-plane";
  });

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // LAB 1: Posizioni Reciproche (Incidenti, Parallele, Perpendicolari)
  const [linePositionType, setLinePositionType] = useState<"incident" | "parallel" | "perpendicular">("perpendicular");

  // LAB 2: Riga e Squadra Scorrevole
  const [squarePos, setSquarePos] = useState<number>(140); // posizione x del punto P

  // LAB 3: Proiezione (Ombra del segmento) & Asse
  const [projAngle, setProjAngle] = useState<number>(30); // inclinazione segmento
  const [axisPointY, setAxisPointY] = useState<number>(50); // posizione P sull'asse

  // LAB 4: Binari del Treno & Distanza Costante
  const [trackDistance, setTrackDistance] = useState<number>(60);

  // LAB 5: La Trasversale e gli 8 Angoli
  const [transversalAngle, setTransversalAngle] = useState<number>(50); // slide 26: 50° e 130°

  // ==========================================
  // --- STATI PALESTRA ALLENA ---
  // ==========================================
  // INVALSI 1: Foglio Piegato
  const [inv1Choice, setInv1Choice] = useState<string | null>(null);

  // INVALSI 2: Squadra che scorre lungo la riga
  const [inv2Choice, setInv2Choice] = useState<string | null>(null);

  // INVALSI 3: Trasversale con DAC = 55°
  const [inv3Choice, setInv3Choice] = useState<string | null>(null);

  // Sfida Finale: 6 Vero/Falso
  const [vfAnswers, setVfAnswers] = useState<Record<string, boolean | null>>({});

  // Exit Ticket 3-2-1
  const [exit3, setExit3] = useState<string>("");
  const [exit2, setExit2] = useState<string>("");
  const [exit1, setExit1] = useState<string>("");
  const [exitSaved, setExitSaved] = useState<boolean>(false);

  // Calcoli Lab 3 Proiezione
  const segmentLength = 120;
  const projectedWidth = Math.round(segmentLength * Math.cos((projAngle * Math.PI) / 180));

  // Calcoli Lab 3 Asse: Distanza PA e PB
  const halfSegment = 70;
  const distPA = Math.round(Math.sqrt(halfSegment * halfSegment + axisPointY * axisPointY));

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
              Le Rette nel Piano
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
            {/* MODULO 1: POSIZIONI RECIPROCHE & PIEGHE ORIGAMI */}
            {/* ======================================================== */}
            {selectedSubtopic === "lines-positions-plane" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 1 & 2 · Relazioni tra Rette
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Come Stanno Due Rette nel Piano?
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Dall'arte dell'origami ai passaggi pedonali: incidenti (1 punto), parallele (0 punti) o perpendicolari (4 angoli retti)!
                    </p>
                  </div>

                  {/* 3 Possibilità */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        INCIDENTI
                      </span>
                      <h4 className="text-lg font-black text-slate-800">1 Solo Punto in Comune</h4>
                      <p className="text-xs text-slate-600">
                        Le due rette si tagliano a X. Formano 4 angoli a due a due opposti al vertice e congruenti.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        PARALLELE (r // s)
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Nessun Punto in Comune</h4>
                      <p className="text-xs text-slate-600">
                        Mantengono sempre la stessa distanza e non si incontrano mai, anche se prolungate all'infinito!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        PERPENDICOLARI (r ⊥ s)
                      </span>
                      <h4 className="text-lg font-black text-slate-800">4 Angoli Retti da 90°</h4>
                      <p className="text-xs text-slate-600">
                        Un caso speciale di incidenti: dividono il piano in 4 angoli perfettamente identici da 90°!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 1: BANCO DELLE POSIZIONI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 1
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Simulatore delle Pieghe nel Piano (Slide 7)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Scegli una relazione per osservare le due rette, il loro punto di incontro e gli angoli formati!
                      </p>
                    </div>

                    <div className="flex justify-center gap-3">
                      {[
                        { id: "incident", label: "Incidenti (Incrocio a X)" },
                        { id: "parallel", label: "Parallele (r // s)" },
                        { id: "perpendicular", label: "Perpendicolari (r ⊥ s)" },
                      ].map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => setLinePositionType(btn.id as any)}
                          className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                            linePositionType === btn.id
                              ? "bg-dida-blue text-white border-dida-blue shadow-sm"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>

                    {/* Canvas SVG */}
                    <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-4 relative shadow-inner">
                      <svg width="340" height="200" viewBox="0 0 340 200">
                        {linePositionType === "parallel" && (
                          <>
                            <line x1="20" y1="70" x2="320" y2="70" stroke="#0070B8" strokeWidth="4" />
                            <text x="325" y="75" fontSize="12" fontWeight="bold" fill="#0070B8">r</text>
                            <line x1="20" y1="130" x2="320" y2="130" stroke="#EF7D00" strokeWidth="4" />
                            <text x="325" y="135" fontSize="12" fontWeight="bold" fill="#EF7D00">s</text>
                          </>
                        )}

                        {linePositionType === "incident" && (
                          <>
                            <line x1="20" y1="100" x2="320" y2="100" stroke="#0070B8" strokeWidth="4" />
                            <line x1="60" y1="170" x2="280" y2="30" stroke="#EF7D00" strokeWidth="4" />
                            <circle cx="170" cy="100" r="6" fill="#DC2626" />
                            <text x="175" y="90" fontSize="11" fontWeight="bold" fill="#DC2626">Punto Comune P</text>
                          </>
                        )}

                        {linePositionType === "perpendicular" && (
                          <>
                            <line x1="20" y1="100" x2="320" y2="100" stroke="#0070B8" strokeWidth="4" />
                            <line x1="170" y1="20" x2="170" y2="180" stroke="#EF7D00" strokeWidth="4" />
                            <rect x="170" y="82" width="18" height="18" fill="none" stroke="#10B981" strokeWidth="2.5" />
                            <text x="195" y="96" fontSize="11" fontWeight="bold" fill="#10B981">90°</text>
                          </>
                        )}
                      </svg>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center font-bold text-xs md:text-sm text-slate-800">
                      {linePositionType === "parallel" && "r // s · Nessun punto di intersezione: distanza rigorosamente costante ovunque!"}
                      {linePositionType === "incident" && "Hanno 1 solo punto in comune dove si intersecano: formano 2 angoli acuti e 2 ottusi!"}
                      {linePositionType === "perpendicular" && "r ⊥ s · Formano 4 angoli retti di 90° esatti. È la base di tutti gli incroci ortogonali!"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: RETTE PERPENDICOLARI & RIGA E SQUADRA */}
            {/* ======================================================== */}
            {selectedSubtopic === "perpendicular-lines" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 2 · Tecnica del Disegno Geometrico
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      La Perpendicolare per un Punto con Riga e Squadra
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Come far scorrere la squadra lungo la riga per tracciare una perpendicolare perfetta: il punto H è il piede della perpendicolare!
                    </p>
                  </div>

                  {/* Teoria 4 Mosse */}
                  <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2">
                    <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                      TEOREMA FONDAMENTALE
                    </span>
                    <h4 className="text-lg font-black text-slate-800">Unicità della Perpendicolare</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Per un punto $P$ (che si trovi sulla retta o fuori da essa) passa <strong>UNA E UNA SOLA perpendicolare</strong> alla retta data!
                      Il punto d'incrocio $H$ sulla retta prende il nome ufficiale di <strong>piede della perpendicolare</strong>.
                    </p>
                  </div>

                  {/* LABORATORIO 2: SQUADRA SCORREVOLE */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 2
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        La Squadra che Scivola Lungo la Riga (Slide 9)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Muovi il cursore per far scorrere la squadra da disegno lungo la retta base r fino a centrare il punto P!
                      </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Fai scorrere la squadra:</span>
                        <span className="font-mono text-dida-blue font-black">x = {squarePos}px</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="260"
                        value={squarePos}
                        onChange={(e) => setSquarePos(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-blue"
                      />
                    </div>

                    {/* Canvas Simulatore Riga & Squadra */}
                    <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-4 relative shadow-inner">
                      <svg width="340" height="200" viewBox="0 0 340 200">
                        {/* Retta orizzontale r (la riga) */}
                        <line x1="20" y1="150" x2="320" y2="150" stroke="#64748B" strokeWidth="5" />
                        <text x="325" y="154" fontSize="12" fontWeight="bold" fill="#64748B">r</text>

                        {/* Punto Fisso P fuori da r */}
                        <circle cx="160" cy="50" r="5" fill="#DC2626" />
                        <text x="170" y="52" fontSize="12" fontWeight="bold" fill="#DC2626">P</text>

                        {/* Squadra da disegno gialla trasparente mobile */}
                        <polygon
                          points={`${squarePos},150 ${squarePos + 80},150 ${squarePos},50`}
                          fill="rgba(245, 158, 11, 0.25)"
                          stroke="#D97706"
                          strokeWidth="2.5"
                        />

                        {/* Se la squadra è allineata a x=160, compare la retta s perpendicolare! */}
                        {Math.abs(squarePos - 160) < 5 && (
                          <>
                            <line x1="160" y1="20" x2="160" y2="180" stroke="#0070B8" strokeWidth="3.5" strokeDasharray="4 2" />
                            <circle cx="160" cy="150" r="5" fill="#0070B8" />
                            <text x="165" y="170" fontSize="11" fontWeight="bold" fill="#0070B8">H (Piede)</text>
                            <rect x="160" y="132" width="18" height="18" fill="none" stroke="#10B981" strokeWidth="2" />
                          </>
                        )}
                      </svg>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center font-bold text-xs md:text-sm text-slate-800">
                      {Math.abs(squarePos - 160) < 5 ? (
                        <span className="text-emerald-700">
                          🎉 CENTRATO! La squadra tocca P: la linea verticale è la retta perpendicolare s ⊥ r con piede H!
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          Scorri la squadra fino a x = 160px per allineare il cateto verticale con il punto P!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: DISTANZA, PROIEZIONE & ASSE */}
            {/* ======================================================== */}
            {selectedSubtopic === "distance-point-line-segment-bisector" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 3 · La Strada Più Corta
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Distanza, Ombre Proiettate & L'Asse di un Segmento
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      La perpendicolare è la strada più breve tra un punto e una retta! Scopri come varia la proiezione e la magica proprietà dell'asse!
                    </p>
                  </div>

                  {/* Teoria Distanza vs Asse */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        DISTANZA & PROIEZIONE
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Il Percorso Più Breve</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        La distanza di un punto da una retta è la lunghezza del <strong>segmento di perpendicolare PH</strong>. Qualsiasi segmento obliquo $PQ$ è più lungo!
                        La <strong>proiezione</strong> è l'ombra del segmento: se obliquo è più corta, se parallelo è uguale, se perpendicolare è un solo punto!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        L'ASSE DEL SEGMENTO
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Perpendicolare nel Punto Medio M</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        L'asse taglia il segmento a metà a 90°. Proprietà geometrica fondamentale: <strong>ogni punto P dell'asse è equidistante dagli estremi: PA = PB</strong>!
                        Si trova piegando il foglio per far toccare A su B!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 3A: PROIETTORE DELLE OMBRE */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 3A
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        L'Ombra del Segmento: Parallelo, Obliquo o Perpendicolare?
                      </h3>
                      <p className="text-xs text-slate-500">
                        Dalla Slide 14: ruota il segmento AB da 0° (parallelo) a 90° (perpendicolare) e osserva come cambia la sua ombra proiettata sulla retta r!
                      </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Inclinazione segmento:</span>
                        <span className="font-mono text-dida-blue font-black">{projAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        value={projAngle}
                        onChange={(e) => setProjAngle(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-blue"
                      />
                    </div>

                    {/* Canvas Proiezione */}
                    <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-4 relative shadow-inner">
                      <svg width="340" height="200" viewBox="0 0 340 200">
                        {/* Sole in alto */}
                        <circle cx="170" cy="20" r="14" fill="#FBBF24" />
                        <text x="170" y="24" fontSize="10" fontWeight="bold" fill="#78350F" textAnchor="middle">☀️ Sole</text>

                        {/* Segmento AB Inclinato */}
                        {(() => {
                          const xA = 170 - projectedWidth / 2;
                          const yA = 70 + (projAngle * 0.4);
                          const xB = 170 + projectedWidth / 2;
                          const yB = 70 - (projAngle * 0.4);

                          return (
                            <>
                              {/* Raggi d'ombra perpendicolari tratteggiati */}
                              <line x1={xA} y1={yA} x2={xA} y2={160} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
                              <line x1={xB} y1={yB} x2={xB} y2={160} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />

                              {/* Segmento AB */}
                              <line x1={xA} y1={yA} x2={xB} y2={yB} stroke="#0070B8" strokeWidth="4.5" strokeLinecap="round" />
                              <circle cx={xA} cy={yA} r="4" fill="#0070B8" />
                              <circle cx={xB} cy={yB} r="4" fill="#0070B8" />
                              <text x={xA - 12} y={yA - 6} fontSize="11" fontWeight="bold" fill="#0070B8">A</text>
                              <text x={xB + 6} y={yB - 6} fontSize="11" fontWeight="bold" fill="#0070B8">B</text>

                              {/* Retta r orizzontale */}
                              <line x1="20" y1="160" x2="320" y2="160" stroke="#334155" strokeWidth="3" />
                              <text x="325" y="164" fontSize="12" fontWeight="bold" fill="#334155">r</text>

                              {/* Proiezione A'B' evidenziata in arancione */}
                              <line x1={xA} y1={160} x2={xB} y2={160} stroke="#EF7D00" strokeWidth="5" strokeLinecap="round" />
                              <circle cx={xA} cy={160} r="4" fill="#EF7D00" />
                              <circle cx={xB} cy={160} r="4" fill="#EF7D00" />
                              <text x={xA} y={178} fontSize="10" fontWeight="bold" fill="#EA580C">A'</text>
                              <text x={xB} y={178} fontSize="10" fontWeight="bold" fill="#EA580C">B'</text>
                            </>
                          );
                        })()}
                      </svg>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center font-bold text-xs md:text-sm text-slate-800">
                      {projAngle === 0 && "PARALLELO: La proiezione A'B' ha la stessa identica lunghezza di AB (120px)!"}
                      {projAngle > 0 && projAngle < 90 && `OBLIQUO (${projAngle}°): La proiezione è più corta del segmento reale (${projectedWidth}px < 120px)!`}
                      {projAngle === 90 && "PERPENDICOLARE (90°): Con il sole a picco la proiezione collassa in UN SOLO PUNTO (A' ≡ B')!"}
                    </div>

                    {/* LABORATORIO 3B: L'ASSE EQUIDISTANTE */}
                    <div className="border-t border-slate-200 pt-6 space-y-4">
                      <div className="text-center max-w-lg mx-auto space-y-1">
                        <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                          Laboratorio 3B · L'Asse Equidistante (Slide 15 & 16)
                        </span>
                        <h4 className="text-lg font-black text-slate-800">
                          Ogni Punto P dell'Asse ha PA = PB
                        </h4>
                      </div>

                      <div className="max-w-md mx-auto space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                          <span>Sposta P lungo l'asse:</span>
                          <span className="font-mono text-dida-orange font-black">Altezza y = {axisPointY}px</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="90"
                          value={axisPointY}
                          onChange={(e) => setAxisPointY(Number(e.target.value))}
                          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-orange"
                        />
                      </div>

                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs font-bold text-emerald-950 font-mono">
                        Distanza PA: <strong>{distPA} mm</strong> ≡ Distanza PB: <strong>{distPA} mm</strong>!
                        <br />
                        <span className="font-sans font-medium text-[11px] text-emerald-800">
                          Non importa quanto in alto o in basso sposti il punto P: la distanza dai due estremi A e B è sempre rigorosamente identica!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: LE RETTE PARALLELE & I BINARI */}
            {/* ======================================================== */}
            {selectedSubtopic === "parallel-lines" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 4 · Il V Postulato di Euclide
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Le Rette Parallele: Sempre alla Stessa Distanza
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Come i binari del treno (se si avvicinassero il treno deraglierebbe!) e il famoso postulato di Euclide sulla parallela per un punto esterno!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        I BINARI DEL TRENO
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Distanza Rigorosamente Uguale</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        I segmenti di perpendicolare tra due rette parallele sono tutti identici ($AH \equiv BK \equiv CL$). La distanza tra due parallele è la lunghezza di un qualsiasi segmento di perpendicolare!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        V POSTULATO DI EUCLIDE
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Una e Una Sola Parallela</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Dato un punto esterno $P$ a una retta $r$, esiste <strong>una sola retta passante per P e parallela a r</strong>. È uno dei postulati più celebri della storia della matematica!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 4: I BINARI REGOLABILI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 4
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Binario a Scartamento Costante (Slide 20)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Allarga o stringi la distanza tra i due binari e verifica che tutti i segmenti trasversali di perpendicolare rimangono perfettamente uguali!
                      </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Scartamento binari:</span>
                        <span className="font-mono text-dida-blue font-black">{trackDistance}px</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="90"
                        value={trackDistance}
                        onChange={(e) => setTrackDistance(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-blue"
                      />
                    </div>

                    {/* Canvas Binari */}
                    <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-4 relative shadow-inner">
                      <svg width="340" height="200" viewBox="0 0 340 200">
                        {/* Binario superiore r */}
                        <line x1="20" y1={100 - trackDistance / 2} x2="320" y2={100 - trackDistance / 2} stroke="#334155" strokeWidth="4" />
                        <text x="325" y={104 - trackDistance / 2} fontSize="12" fontWeight="bold" fill="#334155">r</text>

                        {/* Binario inferiore s */}
                        <line x1="20" y1={100 + trackDistance / 2} x2="320" y2={100 + trackDistance / 2} stroke="#334155" strokeWidth="4" />
                        <text x="325" y={104 + trackDistance / 2} fontSize="12" fontWeight="bold" fill="#334155">s</text>

                        {/* Traversine di perpendicolare (AH, BK, CL) */}
                        {[60, 110, 160, 210, 260].map((x, idx) => (
                          <g key={idx}>
                            <line
                              x1={x}
                              y1={100 - trackDistance / 2}
                              x2={x}
                              y2={100 + trackDistance / 2}
                              stroke="#EA580C"
                              strokeWidth="3.5"
                            />
                            <rect
                              x={x}
                              y={100 - trackDistance / 2}
                              width="8"
                              height="8"
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="1.5"
                            />
                          </g>
                        ))}
                      </svg>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center font-bold text-xs md:text-sm text-slate-800">
                      AH = BK = CL = {trackDistance} mm. Due rette parallele non cambiano mai distanza!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: TRE RETTE, OTTO ANGOLI (LA TRASVERSALE) */}
            {/* ======================================================== */}
            {selectedSubtopic === "transversal-lines" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 5 · Il Teorema delle Rette Parallele
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Tre Rette, Otto Angoli: Il Teorema della Trasversale
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Quando una retta trasversale taglia due parallele, si formano 8 angoli... ma basta conoscerne uno solo per scoprire tutti gli altri sette!
                    </p>
                  </div>

                  {/* Teoria Coppie di Angoli */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        CONGRUENTI (UGUALI!)
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
                        <li>• <strong>Alterni Interni:</strong> dentro le due rette, a lati opposti della trasversale (3-5 e 4-6).</li>
                        <li>• <strong>Alterni Esterni:</strong> fuori dalle rette, a lati opposti (1-7 e 2-8).</li>
                        <li>• <strong>Corrispondenti:</strong> nella stessa posizione su ciascuna retta (1-5, 2-6, 3-7, 4-8).</li>
                      </ul>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        SUPPLEMENTARI (SOMMA = 180°)
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
                        <li>• <strong>Coniugati Interni:</strong> dentro le rette, dalla stessa parte della trasversale (3-6 e 4-5).</li>
                        <li>• <strong>Coniugati Esterni:</strong> fuori dalle rette, dalla stessa parte della trasversale (2-7 e 1-8).</li>
                      </ul>
                    </div>
                  </div>

                  {/* LABORATORIO 5: IL CALCOLATORE DEGLI 8 ANGOLI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 5
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Il Calcolatore Istantaneo degli 8 Angoli (Slide 26)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Dalla Slide 26: imposta l'angolo acuto α (es. 50°) e osserva come tutti gli 8 angoli assumono il valore di 50° oppure di 130° (180° − 50°)!
                      </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Angolo acuto α:</span>
                        <span className="font-mono text-dida-blue font-black text-base">{transversalAngle}°</span>
                        <span>Angolo ottuso β (180° − α):</span>
                        <span className="font-mono text-dida-orange font-black text-base">{180 - transversalAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="25"
                        max="80"
                        value={transversalAngle}
                        onChange={(e) => setTransversalAngle(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-blue"
                      />
                    </div>

                    {/* Canvas della Trasversale con 8 Angoli Colorati */}
                    <div className="h-72 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-4 relative shadow-inner overflow-hidden">
                      <svg width="340" height="230" viewBox="0 0 340 230">
                        {/* Rette Parallele r e s */}
                        <line x1="20" y1="75" x2="320" y2="75" stroke="#334155" strokeWidth="3.5" />
                        <text x="325" y="80" fontSize="12" fontWeight="bold" fill="#334155">r</text>

                        <line x1="20" y1="155" x2="320" y2="155" stroke="#334155" strokeWidth="3.5" />
                        <text x="325" y="160" fontSize="12" fontWeight="bold" fill="#334155">s</text>

                        {/* Retta Trasversale t inclinata */}
                        {(() => {
                          const rad = (transversalAngle * Math.PI) / 180;
                          const dx = 160 / Math.tan(rad);
                          const x1 = 170 - dx / 2;
                          const y1 = 20;
                          const x2 = 170 + dx / 2;
                          const y2 = 210;

                          return (
                            <>
                              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#EA580C" strokeWidth="3.5" />
                              <text x={x1 + 6} y={y1 + 4} fontSize="12" fontWeight="bold" fill="#EA580C">t</text>
                            </>
                          );
                        })()}

                        {/* Etichette degli 8 Angoli */}
                        <g fontSize="11" fontWeight="bold">
                          {/* Incrocio Superiore */}
                          <text x="135" y="65" fill="#0070B8">1: {transversalAngle}°</text>
                          <text x="175" y="65" fill="#EA580C">2: {180 - transversalAngle}°</text>
                          <text x="175" y="98" fill="#0070B8">3: {transversalAngle}°</text>
                          <text x="135" y="98" fill="#EA580C">4: {180 - transversalAngle}°</text>

                          {/* Incrocio Inferiore */}
                          <text x="165" y="145" fill="#0070B8">5: {transversalAngle}°</text>
                          <text x="205" y="145" fill="#EA580C">6: {180 - transversalAngle}°</text>
                          <text x="205" y="178" fill="#0070B8">7: {transversalAngle}°</text>
                          <text x="165" y="178" fill="#EA580C">8: {180 - transversalAngle}°</text>
                        </g>
                      </svg>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs font-bold text-emerald-950 font-mono">
                      ✨ <strong>REGOLA DEI 2 VALORI (Slide 26):</strong>
                      <br />
                      Gli angoli Blu (1, 3, 5, 7) misurano tutti esattamente <strong>{transversalAngle}°</strong>!
                      <br />
                      Gli angoli Arancioni (2, 4, 6, 8) misurano tutti <strong>{180 - transversalAngle}°</strong>!
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
              «Per un punto passano infinite perpendicolari a una retta?»
            </h3>
            <p className="text-sm text-rose-900 leading-relaxed">
              <strong>ATTENZIONE:</strong> Per un punto passano infinite rette in generale, ma rispetto a una retta data ne passa <strong>UNA E UNA SOLA perpendicolare</strong>!
              Inoltre, per un punto esterno passa anche <strong>UNA E UNA SOLA parallela</strong> (V Postulato di Euclide)!
            </p>
          </div>

          {/* Sezione INVALSI */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-dida-blue uppercase tracking-wider">
                Prove Ufficiali Nazionali
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                Quesiti Ufficiali INVALSI sulle Rette
              </h3>
            </div>

            {/* Quesito INVALSI 1: Il Foglio Piegato (Slide 33) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  Quesito 1 · Il Foglio Piegato (Slide 33)
                </span>
                <span className="text-xs text-slate-400 font-bold">5 minuti</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Un foglio rettangolare viene piegato a caso, prima lungo un lato e poi lungo l'altro. Riaprendo il foglio, come sono tra loro le due pieghe?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "a", label: "A) Perpendicolari e non incidenti" },
                  { id: "b", label: "B) Incidenti e parallele" },
                  { id: "c", label: "C) Parallele e non incidenti" },
                  { id: "d", label: "D) Incidenti ma non perpendicolari (Corretto)" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setInv1Choice(opt.id)}
                    className={`p-3 rounded-2xl text-xs font-bold border transition cursor-pointer text-left ${
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
                    ? "🎉 Esatto! Essendo piegato a caso, le due linee si incrociano in un punto (incidenti) ma non formano un angolo di 90° (non perpendicolari)!"
                    : "Pensa alla definizione: si toccano in un punto (quindi sono incidenti) ma l'angolo è casuale, non di 90°!"}
                </div>
              )}
            </div>

            {/* Quesito INVALSI 2: Parallele e Trasversale (Slide 35) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                  Quesito 2 · Angoli con Somma 180° (Slide 35)
                </span>
                <span className="text-xs text-slate-400 font-bold">6 minuti</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Data una retta trasversale che taglia due parallele $r \parallel s$, quali tra queste coppie di angoli hanno <strong>somma uguale a 180°</strong> (supplementari)?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "a", label: "A) Alterni interni" },
                  { id: "b", label: "B) Corrispondenti" },
                  { id: "c", label: "C) Coniugati interni (Corretto)" },
                  { id: "d", label: "D) Alterni esterni" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setInv3Choice(opt.id)}
                    className={`p-3 rounded-2xl text-xs font-bold border transition cursor-pointer text-center ${
                      inv3Choice === opt.id
                        ? opt.id === "c"
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
                  {inv3Choice === "c"
                    ? "🎉 Perfetto! Gli alterni e i corrispondenti sono congruenti (uguali), mentre i CONIUGATI (interni ed esterni) sono supplementari (sommano a 180°)!"
                    : "Attento: alterni e corrispondenti sono uguali tra loro; quelli che sommano a 180° sono i coniugati!"}
                </div>
              )}
            </div>
          </div>

          {/* Sfida Finale 6 V/F (Slide 38) */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Sfida Finale a Squadre (Slide 38)
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  I 6 Vero o Falso sulle Rette
                </h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-950 font-black text-xs">
                Punteggio: {Object.values(vfAnswers).filter(Boolean).length} / 6
              </span>
            </div>

            <div className="space-y-3">
              {[
                { id: "a", text: "a. Due rette parallele non hanno punti in comune.", correct: true },
                { id: "b", text: "b. Due rette perpendicolari formano 4 angoli retti.", correct: true },
                { id: "c", text: "c. Per un punto passano infinite perpendicolari a una retta.", correct: false },
                { id: "d", text: "d. La distanza di un punto da una retta si misura sulla perpendicolare.", correct: true },
                { id: "e", text: "e. L'asse di un segmento passa per il punto medio ed è perpendicolare.", correct: true },
                { id: "f", text: "f. Con r // s gli angoli alterni interni sono supplementari.", correct: false },
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

          {/* Exit Ticket 3-2-1 (Slide 39) */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-slate-50 border-2 border-slate-200 space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-3 py-1 rounded-full">
                Per Chiudere · Exit Ticket di Carta (Slide 39)
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Il tuo taccuino di fine lezione
              </h3>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  3 esempi di rette parallele che vedi nella tua stanza o nello sport:
                </label>
                <input
                  type="text"
                  placeholder="Es. binari del treno, righe del quaderno, corsie della piscina..."
                  value={exit3}
                  onChange={(e) => setExit3(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 border-none outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  2 simboli geometrici imparati oggi:
                </label>
                <input
                  type="text"
                  placeholder="Es. // (parallele), ⊥ (perpendicolari)..."
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
                  placeholder="Es. cosa succede alle parallele nello spazio a 3 dimensioni?"
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
