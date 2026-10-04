import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, BookOpen, Zap
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
  { id: "triangles-general-characteristics", title: "1. Proprietà, Rigidità & Costruibilità", short: "1. Rigidità & Costruibilità" },
  { id: "triangles-classification", title: "2. Classificazione per Lati e per Angoli", short: "2. Classificazione & Perimetro" },
  { id: "altitudes-medians-orthocenter-centroid", title: "3. Altezze e Mediane (Ortocentro & Baricentro)", short: "3. Ortocentro & Baricentro" },
  { id: "bisectors-axes-incenter-circumcenter", title: "4. Bisettrici e Assi (Incentro & Circocentro)", short: "4. Incentro & Circocentro" },
  { id: "congruence-criteria", title: "5. I 3 Criteri di Congruenza (Triangoli Gemelli)", short: "5. Criteri di Congruenza" },
];

export default function TrianglesLesson({
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
    if (initialSubtopicId === "notable-points-isosceles-equilateral") {
      return "altitudes-medians-orthocenter-centroid";
    }
    return "triangles-general-characteristics";
  });

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // LAB 1: Disuguaglianza triangolare (11, 7, 5 vs 11, 6, 2)
  const [sideMax, setSideMax] = useState<number>(11);
  const [sideB, setSideB] = useState<number>(7);
  const [sideC, setSideC] = useState<number>(5);

  // LAB 2: Matrice 3x3 Lati x Angoli
  const [matrixSide, setMatrixSide] = useState<"scaleno" | "isoscele" | "equilatero">("isoscele");
  const [matrixAngle, setMatrixAngle] = useState<"acutangolo" | "rettangolo" | "ottusangolo">("rettangolo");

  // LAB 3: Ortocentro e Baricentro Dinamici
  const [lab3AngleType, setLab3AngleType] = useState<"acuto" | "retto" | "ottuso">("acuto");
  const [showCenterType, setShowCenterType] = useState<"ortocentro" | "baricentro">("ortocentro");

  // LAB 4: Incentro & Circocentro (Cerchi)
  const [activeCircle, setActiveCircle] = useState<"inscribed" | "circumscribed">("inscribed");

  // LAB 5: Criteri di Congruenza
  const [activeCriterion, setActiveCriterion] = useState<1 | 2 | 3>(1);
  const [congruenceOverlay, setCongruenceOverlay] = useState<boolean>(false);

  // ==========================================
  // --- STATI PALESTRA ALLENA ---
  // ==========================================
  // INVALSI 1: Terzo lato (lati 6 cm e 10 cm)
  const [inv1Choice, setInv1Choice] = useState<string | null>(null);

  // INVALSI 2: Altezze nascoste nell'ottusangolo
  const [inv2Choice, setInv2Choice] = useState<string | null>(null);

  // Sfida Finale V/F
  const [vfAnswers, setVfAnswers] = useState<Record<string, boolean | null>>({});

  // Exit Ticket 3-2-1
  const [exit3, setExit3] = useState<string>("");
  const [exit2, setExit2] = useState<string>("");
  const [exit1, setExit1] = useState<string>("");
  const [exitSaved, setExitSaved] = useState<boolean>(false);

  // Calcolo Costruibilità Triangolo
  const sumTwoSides = sideB + sideC;
  const diffTwoSides = Math.abs(sideB - sideC);
  const canFormTriangle = sideMax < sumTwoSides && sideMax > diffTwoSides;

  // Verifica Matrice Lati x Angoli
  const isMatrixImpossible = matrixSide === "equilatero" && (matrixAngle === "rettangolo" || matrixAngle === "ottusangolo");

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
              I Triangoli
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
            {/* MODULO 1: PROPRIETÀ, RIGIDITÀ & COSTRUIBILITÀ */}
            {/* ======================================================== */}
            {selectedSubtopic === "triangles-general-characteristics" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 1 · Perché Proprio il Triangolo?
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      La Struttura Più Forte del Mondo & La Disuguaglianza Triangolare
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Perché gru, ponti e tetti sono fatti di triangoli? Perché il triangolo è indeformabile! Ma attenzione: non con qualsiasi misura di lati si può chiudere!
                    </p>
                  </div>

                  {/* 3 Pilastri Teoria */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        NON SI PIEGA!
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Figura Indeformabile</h4>
                      <p className="text-xs text-slate-600">
                        Un quadrilatero si deforma e si affloscia se premi su un vertice. Se aggiungi una diagonale lo dividi in 2 triangoli e diventa <strong>rigido come l'acciaio</strong>!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        SOMMA DEGLI ANGOLI
                      </span>
                      <h4 className="text-lg font-black text-slate-800 font-mono">Interni = 180°</h4>
                      <p className="text-xs text-slate-600">
                        Colorando i 3 angoli e piegandoli verso il lato opposto (Slide 3), si uniscono formando esattamente un <strong>angolo piatto di 180°</strong>!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        DISUGUAGLIANZA
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Regola dei 3 Lati</h4>
                      <p className="text-xs text-slate-600">
                        Ogni lato deve essere <strong>minore della somma</strong> degli altri due e <strong>maggiore della loro differenza</strong>!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 1: BANCO DI COSTRUIBILITÀ DEL TRIANGOLO */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 1
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Si Può Sempre Costruire? (Slide 5)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Dalla Slide 5: confronta 11, 7, 5 (si chiude!) con 11, 6, 2 (non arriva a toccarsi!). Muovi i cursori per verificare la regola!
                      </p>
                    </div>

                    {/* Cursori Lati */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-600 block">Lato Base A: {sideMax} cm</span>
                        <input
                          type="range"
                          min="8"
                          max="16"
                          value={sideMax}
                          onChange={(e) => setSideMax(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded accent-blue-600 cursor-pointer"
                        />
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-600 block">Lato B: {sideB} cm</span>
                        <input
                          type="range"
                          min="2"
                          max="10"
                          value={sideB}
                          onChange={(e) => setSideB(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded accent-orange-600 cursor-pointer"
                        />
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-600 block">Lato C: {sideC} cm</span>
                        <input
                          type="range"
                          min="2"
                          max="10"
                          value={sideC}
                          onChange={(e) => setSideC(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded accent-emerald-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Preset Rapidi da Slide */}
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => { setSideMax(11); setSideB(7); setSideC(5); }}
                        className="px-4 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Esempio 1 (Slide 5): 11, 7, 5 cm (Si chiude)
                      </button>
                      <button
                        onClick={() => { setSideMax(11); setSideB(6); setSideC(2); }}
                        className="px-4 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Esempio 2 (Slide 5): 11, 6, 2 cm (Non si chiude!)
                      </button>
                    </div>

                    {/* Visualizzazione Barra di Confronto */}
                    <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-full max-w-md">
                          <span className="text-xs font-bold text-slate-500 mb-1 block">Lato Base A: {sideMax} cm</span>
                          <div
                            className="h-5 bg-blue-600 rounded-lg text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs"
                            style={{ width: `${sideMax * 22}px` }}
                          >
                            {sideMax} cm
                          </div>
                        </div>

                        <div className="w-full max-w-md">
                          <span className="text-xs font-bold text-slate-500 mb-1 block">
                            Somma Lati B + C: {sideB} + {sideC} = <strong>{sumTwoSides} cm</strong>
                          </span>
                          <div className="flex items-center gap-1">
                            <div
                              className="h-5 bg-orange-500 rounded-l-lg text-white font-mono text-xs flex items-center justify-center"
                              style={{ width: `${sideB * 22}px` }}
                            >
                              {sideB}
                            </div>
                            <div
                              className="h-5 bg-emerald-500 rounded-r-lg text-white font-mono text-xs flex items-center justify-center"
                              style={{ width: `${sideC * 22}px` }}
                            >
                              {sideC}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Esito */}
                      <div
                        className={`p-4 rounded-2xl border text-center font-bold text-sm ${
                          canFormTriangle
                            ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                            : "bg-rose-50 border-rose-300 text-rose-900"
                        }`}
                      >
                        {canFormTriangle ? (
                          <span>
                            🎉 <strong>IL TRIANGOLO SI PUÒ COSTRUIRE!</strong> {sideMax} cm &lt; {sideB} + {sideC} = {sumTwoSides} cm. I due lati ruotando riescono a incontrarsi e formare il vertice!
                          </span>
                        ) : (
                          <span>
                            ❌ <strong>IMPOSSIBILE COSTRUIRE IL TRIANGOLO!</strong> Il lato base ({sideMax} cm) è maggiore o uguale alla somma degli altri due ({sumTwoSides} cm). I lati restano stesi senza potersi toccare!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: CLASSIFICAZIONE PER LATI E ANGOLI */}
            {/* ======================================================== */}
            {selectedSubtopic === "triangles-classification" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 2 · Tassonomia & La Tabella Magica
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Che Triangolo È? Guarda i Lati e Guarda gli Angoli
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Due criteri di classificazione indipendenti che si incrociano in una matrice speciale... con due caselle matematicamente impossibili!
                    </p>
                  </div>

                  {/* Teoria in 2 colonne: Lati vs Angoli */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Classificazione per Lati */}
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        1 · GUARDA I LATI
                      </span>
                      <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                        <li>• <strong>Scaleno:</strong> 3 lati completamente diversi tra loro.</li>
                        <li>• <strong>Isoscele:</strong> 2 lati congruenti (lati obliqui) e <strong>angoli alla base uguali</strong>!</li>
                        <li>• <strong>Equilatero:</strong> 3 lati uguali e 3 angoli di <strong>60° ciascuno</strong> (180° : 3 = 60°). È un poligono regolare!</li>
                      </ul>
                    </div>

                    {/* Classificazione per Angoli */}
                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        2 · GUARDA GLI ANGOLI
                      </span>
                      <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                        <li>• <strong>Acutangolo:</strong> tutti e 3 gli angoli sono acuti (&lt; 90°).</li>
                        <li>• <strong>Rettangolo:</strong> ha 1 angolo retto (90°). I lati del retto sono i <strong>cateti</strong>, quello opposto è l'<strong>ipotenusa</strong>. I due acuti sono complementari (somma 90°)!</li>
                        <li>• <strong>Ottusangolo:</strong> ha 1 angolo ottuso (&gt; 90°) e 2 acuti.</li>
                      </ul>
                    </div>
                  </div>

                  {/* LABORATORIO 2: LA TABELLA A DOPPIA ENTRATA (Slide 10) */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 2
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        La Tabella dei Triangoli & Le Caselle Impossibili (Slide 10)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tocca un incrocio tra tipo di Lati e tipo di Angoli per vedere se la figura esiste o se è geometricamente impossibile!
                      </p>
                    </div>

                    {/* Tabella Selezionabile */}
                    <div className="overflow-x-auto">
                      <table className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden text-center text-xs">
                        <thead className="bg-slate-100 font-black text-slate-700">
                          <tr>
                            <th className="p-3 border-r border-b">Lati \ Angoli</th>
                            <th className="p-3 border-r border-b">Acutangolo</th>
                            <th className="p-3 border-r border-b">Rettangolo</th>
                            <th className="p-3 border-b">Ottusangolo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(["scaleno", "isoscele", "equilatero"] as const).map((side) => (
                            <tr key={side} className="border-b last:border-b-0">
                              <td className="p-3 font-bold bg-slate-50 text-slate-800 uppercase text-[11px] border-r">
                                {side}
                              </td>
                              {(["acutangolo", "rettangolo", "ottusangolo"] as const).map((ang) => {
                                const isSelected = matrixSide === side && matrixAngle === ang;
                                const isImp = side === "equilatero" && (ang === "rettangolo" || ang === "ottusangolo");
                                return (
                                  <td
                                    key={ang}
                                    onClick={() => { setMatrixSide(side); setMatrixAngle(ang); }}
                                    className={`p-3 border-r last:border-r-0 cursor-pointer font-bold transition ${
                                      isSelected
                                        ? "bg-dida-blue text-white shadow-inner scale-95"
                                        : isImp
                                        ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                                        : "hover:bg-blue-50 text-slate-700"
                                    }`}
                                  >
                                    {isImp ? "❌ IMPOSSIBILE" : "✅ Esiste"}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Dettaglio Casella Selezionata */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 max-w-xl mx-auto text-center space-y-2">
                      <div className="text-sm font-bold text-slate-800">
                        Incrocio selezionato: <span className="uppercase text-dida-blue">{matrixSide}</span> + <span className="uppercase text-dida-orange">{matrixAngle}</span>
                      </div>

                      {isMatrixImpossible ? (
                        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 font-bold">
                          🚫 <strong>PERCHÉ È IMPOSSIBILE? (Slide 10):</strong> Un triangolo equilatero ha per definizione tutti e 3 gli angoli di 60° (60° + 60° + 60° = 180°).
                          Non può MAI avere un angolo di 90° (rettangolo) né un angolo ottuso!
                        </div>
                      ) : (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold">
                          ✨ <strong>COMBINAZIONE VALIDA:</strong> Questo triangolo esiste nella realtà geometrica!
                          {matrixSide === "isoscele" && matrixAngle === "rettangolo" && " Esempio classico: la squadra a 45°-45°-90°!"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: ALTEZZE & MEDIANE (ORTOCENTRO E BARICENTRO) */}
            {/* ======================================================== */}
            {selectedSubtopic === "altitudes-medians-orthocenter-centroid" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 3 · I Punti Notevoli (Parte 1)
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Altezze, Mediane, Ortocentro & Baricentro
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Ogni segmento speciale si ripete 3 volte e si incontra in un punto magico! Scopri il punto di equilibrio (baricentro) e dove cade l'ortocentro negli ottusangoli!
                    </p>
                  </div>

                  {/* Teoria Altezza vs Mediana */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        ALTEZZA & ORTOCENTRO (O)
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Perpendicolare al lato opposto</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Le 3 altezze si incontrano nell'<strong>Ortocentro</strong>. Attenzione:
                        <br />
                        • Acutangolo: <strong>dentro</strong>.
                        <br />
                        • Rettangolo: <strong>sul vertice dell'angolo retto</strong>!
                        <br />
                        • Ottusangolo: <strong>FUORI dal triangolo</strong> (Slide 15 e 20)!
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        MEDIANA & BARICENTRO (G)
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Punto di equilibrio fisico</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        La mediana unisce il vertice con il punto medio del lato opposto. Le 3 mediane si incontrano nel <strong>Baricentro</strong> (centro di gravità: se appoggi la punta della matita sul baricentro, il triangolo di cartone rimane in equilibrio!).
                        <br />
                        Proprietà d'oro: <strong>AD = 2 × DM</strong> (il tratto verso il vertice è doppio di quello verso il lato!).
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 3: ESPLORATORE DEI PUNTI NOTEVOLI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 3
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Dove Cadono i Centri? (Slide 20)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Scegli il tipo di triangolo e il centro notevole per osservare la sua posizione esatta: dentro, sul vertice o fuori!
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => setShowCenterType("ortocentro")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          showCenterType === "ortocentro" ? "bg-dida-blue text-white border-dida-blue" : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        📐 Altezze & Ortocentro
                      </button>
                      <button
                        onClick={() => setShowCenterType("baricentro")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          showCenterType === "baricentro" ? "bg-dida-orange text-white border-dida-orange" : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        ⚖️ Mediane & Baricentro (Equilibrio)
                      </button>
                    </div>

                    <div className="flex justify-center gap-2">
                      {[
                        { id: "acuto", label: "Triangolo Acutangolo" },
                        { id: "retto", label: "Triangolo Rettangolo" },
                        { id: "ottuso", label: "Triangolo Ottusangolo" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setLab3AngleType(t.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                            lab3AngleType === t.id
                              ? "bg-slate-800 text-white border-slate-800"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Canvas Dinamico */}
                    <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center p-4 relative shadow-inner">
                      <div className="text-center space-y-3">
                        <div className="text-lg font-black text-slate-800 font-mono">
                          {showCenterType === "ortocentro" ? "ORTOCENTRO:" : "BARICENTRO:"}
                        </div>
                        <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950 font-bold max-w-md mx-auto">
                          {showCenterType === "ortocentro" ? (
                            lab3AngleType === "acuto"
                              ? "🔵 Si trova DENTRO al triangolo."
                              : lab3AngleType === "retto"
                              ? "🔴 Coincide esattamente con il VERTICE dell'angolo retto (Slide 15 & 20)!"
                              : "🚨 Cade COMPLETAMENTE FUORI dal triangolo, sui prolungamenti delle altezze!"
                          ) : (
                            "🟢 Il Baricentro si trova SEMPRE DENTRO a qualunque triangolo (punto di baricentro di massa)!"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: BISETTRICI E ASSI (INCENTRO & CIRCOCENTRO) */}
            {/* ======================================================== */}
            {selectedSubtopic === "bisectors-axes-incenter-circumcenter" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 3 · I Punti Notevoli (Parte 2)
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      Bisettrici, Assi, Incentro & Circocentro
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      I due centri dei cerchi: il cerchio inscritto dentro (incentro) e il cerchio circoscritto che tocca i vertici (circocentro)!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        BISETTRICI & INCENTRO (I)
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Equidistante dai 3 Lati</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Le bisettrici dividono gli angoli a metà e si incontrano nell'<strong>Incentro</strong>. È sempre interno ed è il centro del <strong>cerchio inscritto</strong> (il cerchio più grande che sta dentro al triangolo).
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        ASSI & CIRCOCENTRO (Q)
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Equidistante dai 3 Vertici</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Gli assi sono le perpendicolari nei punti medi dei lati. Si incontrano nel <strong>Circocentro</strong>, centro del <strong>cerchio circoscritto</strong> che passa per i 3 vertici! Nel triangolo rettangolo cade a metà dell'ipotenusa!
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 4: SIMULATORE INCENTRO & CIRCOCENTRO */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 4
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        I Cerchi del Triangolo: Dentro o Fuori?
                      </h3>
                      <p className="text-xs text-slate-500">
                        Scegli quale cerchio visualizzare per comprendere l'equidistanza dai lati (incentro) o dai vertici (circocentro)!
                      </p>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setActiveCircle("inscribed")}
                        className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                          activeCircle === "inscribed" ? "bg-dida-blue text-white border-dida-blue shadow-sm" : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        🎯 Cerchio Inscritto (Incentro - Raggio perpendicolare ai lati)
                      </button>
                      <button
                        onClick={() => setActiveCircle("circumscribed")}
                        className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                          activeCircle === "circumscribed" ? "bg-dida-orange text-white border-dida-orange shadow-sm" : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        ⭕ Cerchio Circoscritto (Circocentro - Raggio ai vertici)
                      </button>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs font-medium text-slate-700">
                      💡 <strong>Nel triangolo equilatero:</strong> I quattro punti notevoli (Ortocentro, Baricentro, Incentro, Circocentro) <strong>COINCIDONO TUTTI NELLO STESSO PUNTO ESATTO</strong> (Slide 20)!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: I 3 CRITERI DI CONGRUENZA */}
            {/* ======================================================== */}
            {selectedSubtopic === "congruence-criteria" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Header Centrato */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                      Lezione 4 · Triangoli Gemelli
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                      I 3 Criteri di Congruenza dei Triangoli
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Per essere sicuri che due triangoli siano gemelli perfetti e sovrapponibili, NON serve misurare tutti i 6 elementi: ne bastano solo 3!
                    </p>
                  </div>

                  {/* 3 Criteri */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                        1° CRITERIO (L-A-L)
                      </span>
                      <h4 className="text-lg font-black text-slate-800">2 Lati e l'Angolo Compreso</h4>
                      <p className="text-xs text-slate-600">
                        Due lati congruenti e l'angolo compreso tra essi congruente.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                        2° CRITERIO (A-L-A)
                      </span>
                      <h4 className="text-lg font-black text-slate-800">1 Lato e i 2 Angoli Adiacenti</h4>
                      <p className="text-xs text-slate-600">
                        Un lato congruente e i due angoli adiacenti ad esso congruenti.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                        3° CRITERIO (L-L-L)
                      </span>
                      <h4 className="text-lg font-black text-slate-800">Tutti e 3 i Lati</h4>
                      <p className="text-xs text-slate-600">
                        I tre lati rispettivamente congruenti ai tre lati dell'altro.
                      </p>
                    </div>
                  </div>

                  {/* LABORATORIO 5: IL BANCO DEI GEMELLI */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    {/* Header Laboratorio perfettamente centrato */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                        Laboratorio Interattivo · Modulo 5
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        La Prova della Carta da Forno (Slide 24)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Bastano 3 elementi (di cui almeno un lato) per creare una copia clone identica! Perché 3 angoli uguali non bastano?
                      </p>
                    </div>

                    <div className="flex justify-center flex-wrap gap-2">
                      {([
                        { id: 1, label: "1° L-A-L" },
                        { id: 2, label: "2° A-L-A" },
                        { id: 3, label: "3° L-L-L" },
                      ] as const).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setActiveCriterion(c.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            activeCriterion === c.id ? "bg-dida-blue text-white border-dida-blue shadow-sm" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>

                    {/* I due triangoli: in evidenza i 3 elementi che il criterio chiede di confrontare */}
                    {(() => {
                      const A = { x: 20, y: 150 };
                      const B = { x: 150, y: 150 };
                      const C = { x: 60, y: 45 };
                      const sides = { AB: [A, B], AC: [A, C], BC: [B, C] } as const;
                      const given = {
                        1: { sides: ["AB", "AC"], angles: ["A"] },
                        2: { sides: ["AB"], angles: ["A", "B"] },
                        3: { sides: ["AB", "AC", "BC"], angles: [] },
                      }[activeCriterion];
                      const arc = (v: { x: number; y: number }, p: { x: number; y: number }, q: { x: number; y: number }) => {
                        const r = 22;
                        const u = (t: { x: number; y: number }) => {
                          const d = Math.hypot(t.x - v.x, t.y - v.y);
                          return { x: v.x + ((t.x - v.x) / d) * r, y: v.y + ((t.y - v.y) / d) * r };
                        };
                        const s1 = u(p);
                        const s2 = u(q);
                        return `M ${v.x} ${v.y} L ${s1.x} ${s1.y} A ${r} ${r} 0 0 ${v === A ? 0 : 1} ${s2.x} ${s2.y} Z`;
                      };
                      const angles = { A: arc(A, B, C), B: arc(B, A, C) } as const;
                      const Triangle = ({ color }: { color: string }) => (
                        <>
                          <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={color} fillOpacity="0.15" stroke="#94A3B8" strokeWidth="2" />
                          {given.angles.map((k) => (
                            <path key={k} d={angles[k as "A" | "B"]} fill={color} fillOpacity="0.55" />
                          ))}
                          {given.sides.map((k) => {
                            const [p, q] = sides[k as keyof typeof sides];
                            return <line key={k} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={color} strokeWidth="5" strokeLinecap="round" />;
                          })}
                        </>
                      );
                      return (
                        <div className="bg-white rounded-3xl border border-slate-200 p-4 flex justify-center">
                          <svg viewBox="0 0 360 170" className="w-full max-w-lg">
                            <Triangle color="#2563EB" />
                            <motion.g
                              initial={false}
                              animate={{ x: congruenceOverlay ? 0 : 190, opacity: congruenceOverlay ? 0.75 : 1 }}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                              <Triangle color="#EA580C" />
                            </motion.g>
                          </svg>
                        </div>
                      );
                    })()}
                    <p className="text-xs text-center text-slate-600 font-medium">
                      {activeCriterion === 1 && "Se due lati e l'angolo tra loro sono uguali, il terzo lato è obbligato: i triangoli coincidono."}
                      {activeCriterion === 2 && "Se un lato e i due angoli ai suoi estremi sono uguali, le altre due semirette si incontrano nello stesso punto."}
                      {activeCriterion === 3 && "Con tre lati uguali c'è un solo modo di chiudere il triangolo: il telaio è rigido!"}
                    </p>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setCongruenceOverlay(!congruenceOverlay)}
                        className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                          congruenceOverlay ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-white text-slate-700 border-slate-300"
                        }`}
                      >
                        {congruenceOverlay ? "Separa i Due Triangoli" : "📄 Sovrapponi sulla Carta da Forno"}
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center font-bold text-xs md:text-sm text-slate-800">
                      ⚠️ <strong>ATTENZIONE (Slide 24):</strong> Se conosciamo solo <strong>3 angoli uguali</strong> i triangoli NON sono per forza congruenti: possono avere la stessa forma ma uno essere minuscolo e l'altro gigante (si dicono <em>simili</em>, non congruenti!).
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
              «Due angoli retti in un triangolo?»
            </h3>
            <p className="text-sm text-rose-900 leading-relaxed">
              <strong>ATTENZIONE:</strong> La somma totale degli angoli interni di un triangolo deve essere <strong>180° esatti</strong>.
              Se un triangolo avesse due angoli retti, farebbero già 90° + 90° = 180°, lasciando 0° per il terzo vertice (le due rette sarebbero parallele e non si toccherebbero mai!).
              Un triangolo può avere <strong>al massimo un angolo retto o un angolo ottuso</strong>.
            </p>
          </div>

          {/* Sezione INVALSI */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-dida-blue uppercase tracking-wider">
                Prove Ufficiali Nazionali
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                Quesiti Ufficiali INVALSI sui Triangoli
              </h3>
            </div>

            {/* Quesito INVALSI 1: Il Terzo Lato (Slide 30) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  Quesito 1 · Il Terzo Lato (Slide 30)
                </span>
                <span className="text-xs text-slate-400 font-bold">5 minuti</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Un triangolo ha due lati che misurano <strong>6 cm</strong> e <strong>10 cm</strong>. Quale tra queste <strong>NON PUÒ</strong> essere la misura del terzo lato?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "a", label: "A) 6,5 cm" },
                  { id: "b", label: "B) 10 cm" },
                  { id: "c", label: "C) 15,5 cm" },
                  { id: "d", label: "D) 17 cm" },
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
                    ? "🎉 Bravissimo! Per la disuguaglianza triangolare il terzo lato deve essere minore di 10 + 6 = 16 cm e maggiore di 10 − 6 = 4 cm. 17 cm è troppo lungo e la figura non si chiuderebbe!"
                    : "Riprova: calcola 10 + 6 = 16 cm e 10 − 6 = 4 cm. Il terzo lato deve stare tra 4 e 16 cm!"}
                </div>
              )}
            </div>

            {/* Quesito INVALSI 2: Altezze Nascoste (Slide 32) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                  Quesito 2 · Altezze nell'Ottusangolo (Slide 32)
                </span>
                <span className="text-xs text-slate-400 font-bold">6 minuti</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                In un triangolo ottusangolo le altezze relative ai lati dell'angolo ottuso cadono:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setInv2Choice("ext")}
                  className={`p-3 rounded-2xl text-xs font-bold border transition cursor-pointer text-left ${
                    inv2Choice === "ext" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  🟢 Fuori dal triangolo, sui prolungamenti dei lati
                </button>
                <button
                  onClick={() => setInv2Choice("int")}
                  className={`p-3 rounded-2xl text-xs font-bold border transition cursor-pointer text-left ${
                    inv2Choice === "int" ? "bg-rose-600 text-white border-rose-600" : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  🔴 Sempre e solo all'interno del triangolo
                </button>
              </div>
              {inv2Choice === "ext" && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold">
                  🎉 Esatto! Come visto nella Slide 15 e 32, per tracciare la perpendicolare bisogna prolungare la base fuori dalla figura!
                </div>
              )}
            </div>
          </div>

          {/* Sfida Finale 6 V/F (Slide 34) */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Sfida Finale a Squadre (Slide 34)
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  I 6 Vero o Falso sui Triangoli
                </h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-950 font-black text-xs">
                Punteggio: {Object.values(vfAnswers).filter(Boolean).length} / 6
              </span>
            </div>

            <div className="space-y-3">
              {[
                { id: "a", text: "a. Un triangolo può avere due angoli retti.", correct: false },
                { id: "b", text: "b. Il triangolo equilatero ha tre angoli di 60°.", correct: true },
                { id: "c", text: "c. Con lati di 3, 4 e 9 cm si costruisce un triangolo.", correct: false },
                { id: "d", text: "d. Il baricentro è sempre interno al triangolo.", correct: true },
                { id: "e", text: "e. Nel triangolo rettangolo l'ortocentro è il vertice dell'angolo retto.", correct: true },
                { id: "f", text: "f. Due triangoli con tre angoli uguali sono sempre congruenti.", correct: false },
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

          {/* Exit Ticket 3-2-1 (Slide 35) */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-slate-50 border-2 border-slate-200 space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-3 py-1 rounded-full">
                Per Chiudere · Exit Ticket 3 · 2 · 1 (Slide 35)
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Il tuo taccuino di fine lezione
              </h3>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  3 triangoli che vedi intorno a te (e che tipo sono):
                </label>
                <input
                  type="text"
                  placeholder="Es. squadra da disegno (rettangolo isoscele), traliccio luce (equilatero)..."
                  value={exit3}
                  onChange={(e) => setExit3(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 border-none outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-600 block">
                  2 punti notevoli che ricordi:
                </label>
                <input
                  type="text"
                  placeholder="Es. baricentro, ortocentro, incentro..."
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
                  placeholder="Es. come si calcola l'area se non conosco l'altezza?"
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
