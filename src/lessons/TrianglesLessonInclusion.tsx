import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, Sparkles, CheckCircle2, XCircle,
  HelpCircle, ChevronRight, ChevronLeft, Award, RotateCcw,
  BookOpen, Zap, Check, X, Triangle, Scale
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
  { id: "mod1", title: "1. Perché il Triangolo è Speciale?", short: "1. Non si piega mai!" },
  { id: "mod2", title: "2. I Triangoli per Lati", short: "2. I Lati (3 tipi)" },
  { id: "mod3", title: "3. I Triangoli per Angoli", short: "3. Gli Angoli (3 tipi)" },
  { id: "mod4", title: "4. Il Baricentro in Equilibrio", short: "4. Punto di Equilibrio" },
  { id: "mod5", title: "5. I Triangoli Gemelli", short: "5. Triangoli Gemelli" },
];

export default function TrianglesLessonInclusion({
  onBack,
  subjectName,
  topicName,
  initialSubtopicId,
  initialTab = "impara",
}: Props) {
  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [activeModuleId, setActiveModuleId] = useState<string>("mod1");

  // TTS
  const { ttsEnabled, speak, toggleTts } = useSpeech();

  // Stati Interattivi
  const [balanceSuccess, setBalanceSuccess] = useState<boolean>(false);

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
              I Triangoli Facilitati
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
                    mod1: "Il triangolo è la figura più forte del mondo perché non si deforma mai! Per questo gli ingegneri lo usano per costruire gru, ponti e tetti!",
                    mod2: "Guardando i lati ci sono tre tipi di triangolo: scaleno con tre lati diversi; isoscele con due lati uguali; equilatero con tutti e tre i lati uguali!",
                    mod3: "Guardando gli angoli ci sono tre tipi di triangolo: acutangolo con tre angoli stretti; rettangolo con un angolo retto di novanta gradi; ottusangolo con un angolo largo!",
                    mod4: "Il baricentro è il punto magico di equilibrio: se appoggi un triangolo di cartone sulla punta della matita proprio nel baricentro, non cade mai!",
                    mod5: "Due triangoli si dicono gemelli o congruenti quando si possono sovrapporre alla perfezione!",
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
                    <span className="text-3xl">🏗️</span>
                    <h4 className="font-bold text-blue-900 text-lg">La figura indeformabile</h4>
                  </div>
                  <p>
                    Se prendi 4 listelli e premi, il quadrato si schiaccia e si piega.
                    Se prendi 3 listelli a triangolo e premi con tutta la tua forza... <strong>non si muove di un millimetro</strong>!
                  </p>
                  <p className="text-sm bg-white p-3 rounded-2xl border border-blue-200 text-blue-950 font-medium">
                    📌 <strong>Somma degli angoli:</strong> I 3 angoli di qualsiasi triangolo fanno sempre insieme <strong>180° esatti</strong> (un angolo piatto)!
                  </p>
                </div>
              </div>
            )}

            {/* MODULO 2 */}
            {activeModuleId === "mod2" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                    <span className="font-black text-blue-700 text-sm block">SCALENO</span>
                    <p className="text-xs text-slate-600">3 lati tutti diversi.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-1">
                    <span className="font-black text-orange-700 text-sm block">ISOSCELE</span>
                    <p className="text-xs text-slate-600">2 lati obliqui uguali e angoli alla base uguali!</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="font-black text-emerald-700 text-sm block">EQUILATERO</span>
                    <p className="text-xs text-slate-600">3 lati uguali e 3 angoli da 60°!</p>
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 3 */}
            {activeModuleId === "mod3" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                    <span className="font-black text-blue-700 text-sm block">ACUTANGOLO</span>
                    <p className="text-xs text-slate-600">3 angoli acuti (&lt; 90°).</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="font-black text-emerald-700 text-sm block">RETTANGOLO</span>
                    <p className="text-xs text-slate-600">1 angolo retto (90°). Cateti e ipotenusa.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-1">
                    <span className="font-black text-orange-700 text-sm block">OTTUSANGOLO</span>
                    <p className="text-xs text-slate-600">1 angolo ottuso (&gt; 90°).</p>
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 4 */}
            {activeModuleId === "mod4" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 text-slate-700 space-y-3 text-center">
                  <span className="text-4xl">✏️📐</span>
                  <h4 className="font-bold text-amber-950 text-lg">Il Baricentro: il punto di equilibrio</h4>
                  <p className="text-sm max-w-md mx-auto">
                    Se tracci le 3 mediane (le righe che collegano i vertici alla metà dei lati opposti), si incontrano nel <strong>baricentro</strong>.
                  </p>
                  <button
                    onClick={() => setBalanceSuccess(!balanceSuccess)}
                    className="px-6 py-2.5 rounded-2xl bg-dida-orange text-white font-bold text-sm shadow-md cursor-pointer"
                  >
                    {balanceSuccess ? "Riponi la matita" : "Equilibra sulla punta della matita!"}
                  </button>
                  {balanceSuccess && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900">
                      🎉 Perfetto! Il triangolo rimane orizzontale in bilico senza cadere!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODULO 5 */}
            {activeModuleId === "mod5" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 text-slate-700 space-y-3">
                  <h4 className="font-bold text-blue-900 text-lg">I Triangoli Gemelli</h4>
                  <p className="text-sm">
                    Per essere sicuri che due triangoli siano gemelli e si sovrappongano, basta verificare <strong>3 elementi</strong> (con almeno un lato):
                  </p>
                  <ul className="text-xs space-y-1 font-medium">
                    <li>• Due lati e l'angolo in mezzo</li>
                    <li>• Un lato e i due angoli vicini</li>
                    <li>• Tutti e tre i lati uguali</li>
                  </ul>
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
                4 Piccole Sfide sui Triangoli
              </h2>
            </div>

            {/* Domanda 1 */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                1. Un triangolo con tutti e 3 i lati uguali si chiama:
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
                  🟢 Triangolo EQUILATERO
                </button>
                <button
                  onClick={() => setQ1("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q1 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 Triangolo Scaleno
                </button>
              </div>
              {q1 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Bravissimo! Equi-latero significa lati uguali!
                </p>
              )}
            </div>

            {/* Domanda 2 */}
            <div className="p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                2. Un triangolo può avere 2 angoli retti (da 90°)?
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
                  🟢 NO, la somma di tutti e 3 deve fare 180°
                </button>
                <button
                  onClick={() => setQ2("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q2 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 SÌ, sempre
                </button>
              </div>
              {q2 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Esatto! 90° + 90° fa già 180°, quindi non c'è spazio per un terzo angolo!
                </p>
              )}
            </div>

            {/* Domanda 3 */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                3. Il BARICENTRO del triangolo è:
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
                  🟢 Il punto di equilibrio dove si incontrano le mediane
                </button>
                <button
                  onClick={() => setQ3("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q3 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 Un angolo esterno
                </button>
              </div>
              {q3 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Super! Il baricentro è il punto di gravità ed equilibrio!
                </p>
              )}
            </div>

            {/* Domanda 4 */}
            <div className="p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                4. Perché gru e ponti sono costruiti con i triangoli?
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
                  🟢 Perché il triangolo è indeformabile e rigidissimo
                </button>
                <button
                  onClick={() => setQ4("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q4 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 Perché pesa meno dell'aria
                </button>
              </div>
              {q4 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Fantastico! Il triangolo non si deforma mai!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
