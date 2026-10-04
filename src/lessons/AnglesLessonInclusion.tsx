import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, ChevronRight, ChevronLeft, BookOpen, Zap
} from "lucide-react";
import { useSpeech } from "../hooks/useSpeech";

interface Props {
  key?: string;
  onBack: () => void;
  subjectName: string;
  topicName: string;
  initialSubtopicId?: string;
  initialTab?: "impara" | "allena";
}

/**
 * Componente Frazione per Modalità Inclusione con Linea Orizzontale Chiara
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

  const lineWeight = size === "xl" ? "h-[2px]" : size === "lg" ? "h-[2px]" : "h-[1.5px]";

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none ${sizeClasses} ${className}`}>
      <span className="px-1 text-center w-full pb-[2px] leading-none">{num}</span>
      <span className={`w-full ${lineWeight} bg-current rounded-full`}></span>
      <span className="px-1 text-center w-full pt-[2px] leading-none">{den}</span>
    </span>
  );
};

const INCLUSION_MODULES = [
  { id: "mod1", title: "1. Che cos'è un Angolo?", short: "1. Cos'è l'Angolo" },
  { id: "mod2", title: "2. I 4 Tipi di Angolo", short: "2. Acuto, Retto, Ottuso" },
  { id: "mod3", title: "3. Misurare con il Goniometro", short: "3. Il Goniometro" },
  { id: "mod4", title: "4. La Bisettrice a Metà", short: "4. La Bisettrice" },
  { id: "mod5", title: "5. Il Trucco C-S-E", short: "5. Coppie Speciali" },
];

// Sottoargomento scelto nell'indice → scheda da aprire
const SUBTOPIC_TO_MODULE: Record<string, string> = {
  "angle-def": "mod1",
  "angles-comparison-vertical": "mod3",
  "angles-consecutive-adjacent-operations": "mod3",
  "bisector-angle-types": "mod4",
  "complementary-supplementary-explementary": "mod5",
};

export default function AnglesLessonInclusion({
  onBack,
  subjectName,
  topicName,
  initialSubtopicId,
  initialTab = "impara",
}: Props) {
  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [activeModuleId, setActiveModuleId] = useState<string>(
    () => SUBTOPIC_TO_MODULE[initialSubtopicId ?? ""] ?? "mod1"
  );

  // Sintesi Vocale
  const { ttsEnabled, speak, toggleTts } = useSpeech();

  // Stati Interattivi
  const [interactiveAngle, setInteractiveAngle] = useState<number>(90);
  const [bisectorCut, setBisectorCut] = useState<boolean>(false);

  // Stati Allena
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [q4, setQ4] = useState<string | null>(null);

  const currentModIndex = INCLUSION_MODULES.findIndex((m) => m.id === activeModuleId);

  const goToNextModule = () => {
    if (currentModIndex < INCLUSION_MODULES.length - 1) {
      setActiveModuleId(INCLUSION_MODULES[currentModIndex + 1].id);
    }
  };

  const goToPrevModule = () => {
    if (currentModIndex > 0) {
      setActiveModuleId(INCLUSION_MODULES[currentModIndex - 1].id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-5xl mx-auto space-y-6 pb-20 px-4"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-dida-orange hover:border-dida-orange/30 transition shadow-sm cursor-pointer"
            title="Torna indietro"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Modalità Inclusiva · Geometria Facile
              </span>
              <span className="text-xs font-bold text-slate-400">
                {subjectName} · {topicName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Gli Angoli Facilitati
            </h1>
          </div>
        </div>

        {/* Audio and Tab Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTts}
            className={`p-3 rounded-2xl border transition flex items-center gap-2 font-bold text-sm cursor-pointer shadow-xs ${
              ttsEnabled
                ? "bg-amber-100 border-amber-300 text-amber-900"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
            title="Lettura Vocale Automatica"
          >
            {ttsEnabled ? <Volume2 size={20} className="text-amber-700 animate-pulse" /> : <VolumeX size={20} />}
            <span>Voce Guida {ttsEnabled ? "Attiva" : "Disattiva"}</span>
          </button>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab("impara")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition cursor-pointer ${
                activeTab === "impara"
                  ? "bg-white text-dida-orange shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen size={16} />
              Impara
            </button>
            <button
              onClick={() => setActiveTab("allena")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition cursor-pointer ${
                activeTab === "allena"
                  ? "bg-white text-dida-orange shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap size={16} />
              Allena
            </button>
          </div>
        </div>
      </div>

      {activeTab === "impara" ? (
        <div className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {INCLUSION_MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModuleId(mod.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition cursor-pointer border ${
                  activeModuleId === mod.id
                    ? "bg-dida-orange text-white border-dida-orange shadow-md scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {mod.short}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Guida Chiara, Visuale & Pratica
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">
                  {INCLUSION_MODULES[currentModIndex].title}
                </h2>
              </div>
              <button
                onClick={() => {
                  const texts: Record<string, string> = {
                    mod1: "L'angolo è la parte di piano tra due semirette che partono dallo stesso punto O, detto vertice. È come quando allarghi le braccia!",
                    mod2: "Ci sono quattro angoli fondamentali: Acuto se è più piccolo di novanta gradi; Retto se è esattamente di novanta gradi come lo spigolo del foglio; Ottuso se è più largo di novanta gradi; Piatto se è di centottanta gradi, come una linea retta!",
                    mod3: "Per misurare un angolo usa il goniometro. Metti il centro del mirino sul vertice O, metti la linea dello zero su un lato, e guarda dove passa l'altro lato!",
                    mod4: "La bisettrice è una riga magica che divide l'angolo in due metà perfettamente identiche. Puoi trovarla piegando il foglio in due!",
                    mod5: "Ricorda la regola C S E in ordine alfabetico e crescente: C sta per complementari che fanno novanta gradi. S sta per supplementari che fanno centottanta gradi. E sta per esplementari che fanno trecentosessanta gradi!",
                  };
                  speak(texts[activeModuleId] || "");
                }}
                className="p-3 rounded-2xl bg-orange-50 text-dida-orange hover:bg-orange-100 border border-orange-200 transition cursor-pointer"
                title="Ascolta spiegazione"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* MODULO 1 */}
            {activeModuleId === "mod1" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-blue-50/80 border-2 border-blue-200 text-slate-700 leading-relaxed text-base space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🙋‍♂️</span>
                    <p className="font-bold text-blue-900 text-lg">
                      Due braccia che si allargano dallo stesso punto!
                    </p>
                  </div>
                  <p>
                    Metti le mani sul petto e aprine una verso destra e una verso l'alto:
                    il tuo corpo è il <strong>vertice O</strong>, le tue braccia sono i <strong>due lati</strong> e lo spazio tra le braccia è l'<strong>ampiezza dell'angolo</strong>!
                  </p>
                  <p className="text-sm bg-white p-3 rounded-2xl border border-blue-200 text-blue-950 font-medium">
                    📌 <strong>Ricorda:</strong> Anche se le tue braccia fossero lunghe un chilometro, l'angolo rimarrebbe sempre uguale! Conta solo quanto sono aperte!
                  </p>
                </div>
              </div>
            )}

            {/* MODULO 2 */}
            {activeModuleId === "mod2" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 space-y-2">
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-black text-xs">ACUTO</span>
                    <h4 className="font-black text-slate-800 text-lg">Meno di 90°</h4>
                    <p className="text-xs text-slate-600">È stretto e appuntito, come una fetta di torta sottile o le forbici quasi chiuse.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs">RETTO</span>
                    <h4 className="font-black text-slate-800 text-lg">Esattamente 90°</h4>
                    <p className="text-xs text-slate-600">Perfetto come lo spigolo di un foglio A4, di un tavolo o di una porta!</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-orange-50 border-2 border-orange-200 space-y-2">
                    <span className="px-3 py-1 rounded-full bg-orange-600 text-white font-black text-xs">OTTUSO</span>
                    <h4 className="font-black text-slate-800 text-lg">Tra 90° e 180°</h4>
                    <p className="text-xs text-slate-600">È largo e spalancato, più largo di un angolo retto.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-2">
                    <span className="px-3 py-1 rounded-full bg-amber-600 text-white font-black text-xs">PIATTO</span>
                    <h4 className="font-black text-slate-800 text-lg">Esattamente 180°</h4>
                    <p className="text-xs text-slate-600">I due lati formano una linea retta continua!</p>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-3 text-center">
                  <span className="text-xs font-bold text-slate-500">Trascina per provare:</span>
                  <input
                    type="range"
                    min="10"
                    max="180"
                    value={interactiveAngle}
                    onChange={(e) => setInteractiveAngle(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dida-orange"
                  />
                  <div className="text-xl font-black text-dida-orange font-mono">
                    {interactiveAngle}° · {interactiveAngle < 90 ? "ACUTO" : interactiveAngle === 90 ? "RETTO (90°)" : interactiveAngle < 180 ? "OTTUSO" : "PIATTO (180°)"}
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 3 */}
            {activeModuleId === "mod3" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 space-y-3 text-slate-700">
                  <h4 className="text-lg font-black text-amber-950">Le 3 Mosse con il Goniometro:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm font-medium">
                    <li>Metti il mirino (centro) del goniometro sul <strong>vertice O</strong>.</li>
                    <li>Fai combaciare la riga dello <strong>zero (0°)</strong> con il primo lato.</li>
                    <li>Guarda dove passa il secondo lato sulla scala che iniziava da zero!</li>
                  </ol>
                </div>
              </div>
            )}

            {/* MODULO 4 */}
            {activeModuleId === "mod4" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 space-y-3 text-slate-700">
                  <h4 className="text-lg font-black text-blue-950">La Bisettrice taglia a metà</h4>
                  <p className="text-sm">
                    Immagina di piegare l'angolo a metà: la linea di piegatura è la <strong>bisettrice</strong>!
                    Divide l'angolo in due fette esattamente uguali!
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 text-center space-y-4">
                  <button
                    onClick={() => setBisectorCut(!bisectorCut)}
                    className="px-6 py-2.5 rounded-2xl bg-dida-orange text-white font-bold text-sm shadow-md cursor-pointer"
                  >
                    {bisectorCut ? "Riapri l'angolo" : "✂️ Piega a metà (Bisettrice)"}
                  </button>

                  <div className="h-40 bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-4">
                    <svg width="220" height="140" viewBox="0 0 220 140">
                      <line x1="30" y1="110" x2="190" y2="110" stroke="#0070B8" strokeWidth="4" />
                      <line x1="30" y1="110" x2="140" y2="30" stroke="#0070B8" strokeWidth="4" />
                      {bisectorCut && (
                        <line x1="30" y1="110" x2="180" y2="60" stroke="#EF7D00" strokeWidth="3" strokeDasharray="5 4" />
                      )}
                      <circle cx="30" cy="110" r="5" fill="#0070B8" />
                    </svg>
                  </div>
                  {bisectorCut && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900">
                      🎉 L'angolo è diviso in 2 parti congruenti!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODULO 5 */}
            {activeModuleId === "mod5" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 space-y-3 text-slate-700">
                  <h4 className="text-xl font-black text-emerald-950 font-mono text-center">
                    C · S · E = 90° · 180° · 360°
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>• <strong>C = Complementari:</strong> la loro somma fa <strong>90°</strong> (un angolo retto).</p>
                    <p>• <strong>S = Supplementari:</strong> la loro somma fa <strong>180°</strong> (un angolo piatto).</p>
                    <p>• <strong>E = Esplementari:</strong> la loro somma fa <strong>360°</strong> (un angolo giro).</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={goToPrevModule}
                disabled={currentModIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft size={18} /> Precedente
              </button>
              <span className="text-xs font-bold text-slate-400">
                Modulo {currentModIndex + 1} di {INCLUSION_MODULES.length}
              </span>
              <button
                onClick={goToNextModule}
                disabled={currentModIndex === INCLUSION_MODULES.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-dida-orange text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-600 cursor-pointer shadow-sm"
              >
                Successivo <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* SCHEDA ALLENA INCLUSIVA */
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                Palestra Serena & Facilitata
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">
                4 Piccole Sfide sugli Angoli
              </h2>
            </div>

            {/* Domanda 1 */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                1. Un angolo che misura 90° si chiama:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setQ1("correct")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q1 === "correct"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🟢 Angolo RETTO
                </button>
                <button
                  onClick={() => setQ1("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q1 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 Angolo Ottuso
                </button>
              </div>
              {q1 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Bravissimo! 90° è l'angolo retto, come l'angolo della stanza!
                </p>
              )}
            </div>

            {/* Domanda 2 */}
            <div className="p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                2. Se allungo i lati disegnati di un angolo, l'angolo diventa più grande?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setQ2("correct")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q2 === "correct"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🟢 NO, rimane della stessa ampiezza
                </button>
                <button
                  onClick={() => setQ2("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q2 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 SÌ, diventa più largo
                </button>
              </div>
              {q2 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Esatto! Conta solo l'apertura tra i lati, non la loro lunghezza disegnata!
                </p>
              )}
            </div>

            {/* Domanda 3 */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                3. La BISETTRICE di un angolo:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setQ3("correct")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q3 === "correct"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🟢 Divide l'angolo in due metà perfettamente uguali
                </button>
                <button
                  onClick={() => setQ3("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q3 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 Raddoppia l'angolo
                </button>
              </div>
              {q3 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Super! La bisettrice è la linea di metà!
                </p>
              )}
            </div>

            {/* Domanda 4 */}
            <div className="p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                4. Due angoli SUPPLEMENTARI insieme formano:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setQ4("correct")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q4 === "correct"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🟢 180° (un angolo piatto)
                </button>
                <button
                  onClick={() => setQ4("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q4 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 90° (un angolo retto)
                </button>
              </div>
              {q4 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Fantastico! C (90°), S (180°), E (360°)!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
