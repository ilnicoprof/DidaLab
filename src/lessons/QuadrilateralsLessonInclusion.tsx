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

const INCLUSION_MODULES = [
  { id: "mod1", title: "1. Che cos'è un Quadrilatero?", short: "1. 4 Lati che si piegano" },
  { id: "mod2", title: "2. Il Trapezio", short: "2. Il Trapezio" },
  { id: "mod3", title: "3. Il Parallelogramma", short: "3. Il Parallelogramma" },
  { id: "mod4", title: "4. Rettangolo, Rombo, Quadrato", short: "4. I 3 Campioni" },
  { id: "mod5", title: "5. Il Tangram Magico", short: "5. Il Tangram" },
];

// Sottoargomento scelto nell'indice → scheda da aprire
const SUBTOPIC_TO_MODULE: Record<string, string> = {
  "quadrilateral-sides-angles": "mod1",
  "trapezoids": "mod2",
  "parallelograms": "mod3",
  "special-parallelograms": "mod4",
  "tangram-euler": "mod5",
};

export default function QuadrilateralsLessonInclusion({
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

  // TTS
  const { ttsEnabled, speak, toggleTts } = useSpeech();

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
              I Quadrilateri Facilitati
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
                    mod1: "Il quadrilatero è una figura chiusa con quattro lati e quattro angoli. Non è rigido come il triangolo: se lo spingi con le mani si piega e si deforma!",
                    mod2: "Il trapezio ha una sola coppia di lati paralleli: la base maggiore sotto e la base minore sopra!",
                    mod3: "Il parallelogramma ha i lati opposti paralleli a due a due. Le sue due diagonali si incrociano tagliandosi esattamente a metà!",
                    mod4: "Il rettangolo ha quattro angoli retti. Il rombo ha quattro lati uguali. Il quadrato ha sia quattro lati uguali sia quattro angoli retti!",
                    mod5: "Il Tangram è un antico gioco cinese di sette pezzi con cui puoi costruire tutte le figure geometriche del mondo!",
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
                  <h4 className="font-bold text-blue-900 text-lg">4 Lati che si piegano</h4>
                  <p>
                    Immagina 4 listelli uniti con dei fermagli agli angoli.
                    A differenza del triangolo (che rimane bloccato e fermo), il quadrilatero <strong>si deforma continuamente</strong>!
                  </p>
                  <p className="text-sm bg-white p-3 rounded-2xl border border-blue-200 text-blue-950 font-medium">
                    📌 <strong>La somma degli angoli:</strong> I 4 angoli interni di qualsiasi quadrilatero insieme fanno sempre <strong>360°</strong> (un giro completo)!
                  </p>
                </div>
              </div>
            )}

            {/* MODULO 2 */}
            {activeModuleId === "mod2" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-orange-50 border-2 border-orange-200 text-slate-700 space-y-3">
                  <h4 className="font-bold text-orange-950 text-lg">Il Trapezio e le sue due Basi</h4>
                  <p className="text-sm">
                    Ha due lati dritti e paralleli come i binari di un treno:
                  </p>
                  <ul className="text-xs space-y-1.5 font-medium">
                    <li>• <strong>Base Maggiore (B):</strong> il lato parallelo più lungo.</li>
                    <li>• <strong>Base Minore (b):</strong> il lato parallelo più corto.</li>
                    <li>• <strong>Lati Obliqui:</strong> i due lati che uniscono le basi.</li>
                  </ul>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
                    ⚠️ Attenzione: l'altezza interna NON è un lato del perimetro!
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 3 */}
            {activeModuleId === "mod3" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 text-slate-700 space-y-3">
                  <h4 className="font-bold text-blue-950 text-lg">Il Parallelogramma</h4>
                  <p className="text-sm">
                    I lati opposti sono paralleli a due a due e hanno la stessa lunghezza!
                    Le due diagonali si incrociano tagliandosi a vicenda esattamente a <strong>metà</strong>!
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-blue-200 text-center font-bold text-xs text-dida-blue font-mono">
                    Perimetro: (Lato 1 + Lato 2) × 2
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 4 */}
            {activeModuleId === "mod4" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                    <span className="font-black text-blue-700 text-sm block">RETTANGOLO</span>
                    <p className="text-xs text-slate-600">4 angoli retti (90°). Diagonali uguali.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-1">
                    <span className="font-black text-orange-700 text-sm block">ROMBO</span>
                    <p className="text-xs text-slate-600">4 lati tutti uguali. Diagonali perpendicolari (⊥).</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="font-black text-emerald-700 text-sm block">QUADRATO</span>
                    <p className="text-xs text-slate-600">Sia 4 lati uguali sia 4 angoli retti!</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs font-bold text-emerald-900">
                  ✨ Il Quadrato è speciale: è sia un rettangolo sia un rombo!
                </div>
              </div>
            )}

            {/* MODULO 5 */}
            {activeModuleId === "mod5" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 text-slate-700 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">🧩</span>
                    <h4 className="font-bold text-amber-950 text-lg">Il Tangram: 7 Pezzi Magici</h4>
                  </div>
                  <p className="text-sm">
                    È un antico puzzle cinese composto da: 5 triangoli, 1 quadrato e 1 parallelogramma.
                    Mettendoli insieme puoi formare tantissimi quadrilateri diversi!
                  </p>
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
                4 Piccole Sfide sui Quadrilateri
              </h2>
            </div>

            {/* Domanda 1 */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                1. Quanto fa la somma di tutti gli angoli interni di un quadrilatero?
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
                  🟢 360° (un giro completo)
                </button>
                <button
                  onClick={() => setQ1("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q1 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 180°
                </button>
              </div>
              {q1 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Bravissimo! 2 triangoli da 180° fanno 360°!
                </p>
              )}
            </div>

            {/* Domanda 2 */}
            <div className="p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                2. Un quadrilatero con 4 lati tutti congruenti si chiama:
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
                  🟢 Rombo (o Quadrato)
                </button>
                <button
                  onClick={() => setQ2("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q2 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 Rettangolo
                </button>
              </div>
              {q2 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Esatto! Il rombo ha tutti e 4 i lati uguali!
                </p>
              )}
            </div>

            {/* Domanda 3 */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                3. Nel calcolo del perimetro di un trapezio, devi sommare l'altezza interna?
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
                  🟢 NO, l'altezza non è un lato del contorno
                </button>
                <button
                  onClick={() => setQ3("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q3 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 SÌ, si somma sempre
                </button>
              </div>
              {q3 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Super! Si sommano solo i lati esterni!
                </p>
              )}
            </div>

            {/* Domanda 4 */}
            <div className="p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                4. È vero che ogni quadrato è anche un rettangolo?
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
                  🟢 VERO, perché ha 4 angoli retti
                </button>
                <button
                  onClick={() => setQ4("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q4 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 FALSO, sono figure diverse
                </button>
              </div>
              {q4 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Fantastico! Il quadrato è un rettangolo speciale con i lati tutti uguali!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
