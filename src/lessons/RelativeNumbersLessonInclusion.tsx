import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, Sparkles, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, Award, RotateCcw, BookOpen, Zap,
  Check, X, ThermometerSnowflake, Ruler, ArrowRightLeft, Target
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
  { id: "mod1", title: "1. Il Termometro (+ e -)", short: "1. Caldo e Freddo" },
  { id: "mod2", title: "2. I Numeri Interi (Z)", short: "2. I Numeri Interi" },
  { id: "mod3", title: "3. La Retta e l'Ascensore", short: "3. La Retta" },
  { id: "mod4", title: "4. I Gemelli Opposti", short: "4. Opposti e Distanza" },
  { id: "mod5", title: "5. Chi Vince? Il Confronto", short: "5. Chi è più grande?" },
];

export default function RelativeNumbersLessonInclusion({
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
  const [elevator, setElevator] = useState<number>(0);

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
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-dida-orange hover:border-dida-orange/30 transition shadow-xs cursor-pointer"
            title="Torna indietro"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Modalità Inclusiva · Algebra Facile
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              I Numeri Relativi
            </h1>
          </div>
        </div>

        {/* Audio and Tab Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTts}
            className={`p-3 rounded-2xl border transition flex items-center gap-2 font-bold text-sm cursor-pointer shadow-xs ${
              ttsEnabled
                ? "bg-orange-50 border-orange-200 text-dida-orange"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-800"
            }`}
            title={ttsEnabled ? "Disattiva sintesi vocale" : "Attiva sintesi vocale"}
          >
            {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span className="hidden sm:inline">Voce Guida</span>
          </button>

          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab("impara")}
              className={`px-4 py-2 rounded-xl text-sm font-black transition cursor-pointer flex items-center gap-2 ${
                activeTab === "impara"
                  ? "bg-white text-dida-blue shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <BookOpen size={16} />
              Impara
            </button>
            <button
              onClick={() => setActiveTab("allena")}
              className={`px-4 py-2 rounded-xl text-sm font-black transition cursor-pointer flex items-center gap-2 ${
                activeTab === "allena"
                  ? "bg-dida-orange text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
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
          {/* Subtopic Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {INCLUSION_MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModuleId(mod.id);
                  if (ttsEnabled) speak(mod.title);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition cursor-pointer border flex items-center gap-2 ${
                  activeModuleId === mod.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-blue-50/50"
                }`}
              >
                <span>{mod.short}</span>
              </button>
            ))}
          </div>

          {/* Module 1 */}
          {activeModuleId === "mod1" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                      Sopra e Sotto lo Zero
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Che Freddo! Il Termometro
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("I numeri relativi servono per indicare grandezze che vanno in due direzioni. Se fa caldo, i gradi sono sopra lo zero e si mette il più. Se fa freddo e gela, i gradi sono sotto lo zero e si mette il meno.")}
                      className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200 flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xs shrink-0">+</div>
                    <div>
                      <h3 className="font-black text-orange-900 text-lg">I Numeri Positivi</h3>
                      <p className="text-xs font-bold text-orange-800">Sopra lo zero. Es: <span className="font-mono bg-white px-1 py-0.5 rounded border border-orange-200">+15 °C</span></p>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xs shrink-0">-</div>
                    <div>
                      <h3 className="font-black text-blue-900 text-lg">I Numeri Negativi</h3>
                      <p className="text-xs font-bold text-blue-800">Sotto lo zero. Es: <span className="font-mono bg-white px-1 py-0.5 rounded border border-blue-200">-5 °C</span></p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-center font-bold text-slate-700">
                  <span className="text-2xl mr-2">0</span> Lo ZERO non ha segno! Non è né positivo né negativo.
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 2 */}
          {activeModuleId === "mod2" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-amber-600 tracking-wider">
                      La Famiglia Z
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      L'insieme dei Numeri Interi
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Finora hai conosciuto i numeri naturali. Se aggiungiamo il segno più o il segno meno, otteniamo i Numeri Interi Relativi, che in matematica si indicano con la lettera Z.")}
                      className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <p className="text-base text-slate-700 leading-relaxed font-medium">
                  Se prendiamo i numeri naturali (0, 1, 2, 3...) e ci mettiamo il segno davanti, formiamo l'insieme <strong className="text-amber-600 text-xl font-serif">ℤ</strong> (Numeri Interi Relativi).
                </p>

                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 text-center">
                  <div className="font-mono text-xl md:text-2xl font-black text-amber-900 tracking-widest break-words leading-loose">
                    ... -4, -3, -2, -1, 0, +1, +2, +3, +4 ...
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                  💡 Il segno <strong className="text-lg">+</strong> si può anche non scrivere! Se vedi un numero senza segno (es. <span className="font-mono">8</span>), significa che è positivo (<span className="font-mono">+8</span>).
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 3 */}
          {activeModuleId === "mod3" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">
                      La Linea dei Numeri
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      La Retta e l'Ascensore
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Possiamo disegnare i numeri relativi su una riga dritta: lo zero è il centro, a destra ci sono i positivi, a sinistra i negativi. È proprio come la pulsantiera di un ascensore! Prova a cliccare i bottoni dell'ascensore.")}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                  {/* Ascensore */}
                  <div className="bg-slate-800 p-3 rounded-2xl border-4 border-slate-700 w-24">
                    <div className="flex flex-col gap-1.5">
                      {[3, 2, 1, 0, -1, -2, -3].map((f) => (
                        <button
                          key={f}
                          onClick={() => setElevator(f)}
                          className={`w-full py-1 rounded font-mono font-black text-center cursor-pointer transition ${
                            elevator === f ? "bg-emerald-400 text-slate-900" : f === 0 ? "bg-slate-500 text-white" : f > 0 ? "bg-slate-700 text-orange-400" : "bg-slate-700 text-blue-400"
                          }`}
                        >
                          {f > 0 ? `+${f}` : f === 0 ? "T(0)" : f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Retta */}
                  <div className="flex-1 w-full bg-white p-6 rounded-2xl border border-emerald-200 shadow-xs relative overflow-hidden">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-slate-300"></div>
                    <div className="flex justify-between items-center relative z-10">
                      {[-3, -2, -1, 0, 1, 2, 3].map((num) => (
                        <div key={num} className="flex flex-col items-center">
                          <div className={`w-1 h-3 mb-1 ${num === 0 ? 'bg-slate-800 w-1.5 h-4' : 'bg-slate-400'}`}></div>
                          <span className={`text-[11px] font-black ${
                            elevator === num 
                              ? 'text-emerald-500 scale-150 transform transition-all' 
                              : num === 0 ? 'text-slate-800' : num > 0 ? 'text-orange-500' : 'text-blue-500'
                          }`}>
                            {num > 0 ? `+${num}` : num}
                          </span>
                        </div>
                      ))}
                    </div>
                    <motion.div 
                      className="absolute w-4 h-4 bg-emerald-400 border-2 border-white rounded-full top-1/2 -translate-y-1/2 z-20 shadow-sm"
                      animate={{ left: `calc(${((elevator + 3) / 6) * 100}% - 8px)` }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 4 */}
          {activeModuleId === "mod4" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-purple-600 tracking-wider">
                      Distanza e Segni
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      I Numeri Opposti
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Due numeri opposti sono come due gemelli: hanno lo stesso numero, ma uno ha la maglietta col più e l'altro la maglietta col meno. La loro distanza dallo zero è identica! Questa distanza si chiama valore assoluto, e si scrive tra due sbarrette.")}
                      className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="flex items-center gap-8">
                    <div className="bg-white p-3 rounded-xl border border-blue-300 shadow-sm font-black text-blue-600 text-2xl font-mono">-5</div>
                    <ArrowRightLeft className="text-purple-400" size={32} />
                    <div className="bg-white p-3 rounded-xl border border-orange-300 shadow-sm font-black text-orange-600 text-2xl font-mono">+5</div>
                  </div>
                  <p className="text-sm font-bold text-slate-700">Questi due numeri sono OPPOSTI.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="font-black text-slate-800 flex items-center gap-2"><Target size={18} className="text-purple-500"/> Il Valore Assoluto</h3>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">
                    È la <strong>distanza</strong> del numero dallo zero. Si toglie il segno! Si indica con le sbarrette dritte <strong>| |</strong>.
                  </p>
                  <div className="flex justify-center gap-6 font-mono font-black text-lg bg-white p-3 rounded-xl border border-slate-200">
                    <span>|-5| = 5</span>
                    <span>|+5| = 5</span>
                  </div>
                  <p className="text-center text-xs font-bold text-purple-600">I numeri opposti hanno lo stesso valore assoluto!</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 5 */}
          {activeModuleId === "mod5" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-rose-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-rose-600 tracking-wider">
                      Regole Pratiche
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Chi vince? Il Confronto
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Come capire quale numero è più grande? Immagina la retta: chi sta più a destra vince sempre! Quindi un numero positivo batte un negativo, lo zero batte un negativo. Tra due negativi vince quello più vicino allo zero.")}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <p className="text-base text-slate-700 leading-relaxed font-bold text-center bg-rose-50 p-3 rounded-xl border border-rose-200">
                  🏆 Sulla retta, CHI STA PIÙ A DESTRA VINCE SEMPRE!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 text-center shadow-xs">
                    <h4 className="text-xs font-black text-slate-500 mb-2 uppercase">Positivo batte Negativo</h4>
                    <div className="text-xl font-black font-mono">
                      <span className="text-orange-500">+4</span> <span className="text-slate-800">&gt;</span> <span className="text-blue-500">-10</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 text-center shadow-xs">
                    <h4 className="text-xs font-black text-slate-500 mb-2 uppercase">Zero batte Negativo</h4>
                    <div className="text-xl font-black font-mono">
                      <span className="text-slate-800">0</span> <span className="text-slate-800">&gt;</span> <span className="text-blue-500">-5</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border-2 border-rose-300 text-center shadow-xs bg-rose-50/30">
                    <h4 className="text-xs font-black text-rose-700 mb-2 uppercase">Tra due Negativi...</h4>
                    <div className="text-xl font-black font-mono">
                      <span className="text-blue-500">-2</span> <span className="text-slate-800">&gt;</span> <span className="text-blue-500">-9</span>
                    </div>
                    <p className="text-[10px] font-bold text-rose-600 mt-1">Vince chi è più vicino a zero!</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module Navigation Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={goToPrevModule}
              disabled={currentModIndex === 0}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 cursor-pointer ${
                currentModIndex === 0
                  ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs"
              }`}
            >
              <ChevronLeft size={16} />
              Precedente
            </button>

            {currentModIndex < INCLUSION_MODULES.length - 1 ? (
              <button
                onClick={goToNextModule}
                className="px-5 py-2.5 rounded-xl font-black text-sm bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Successivo
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setActiveTab("allena")}
                className="px-5 py-2.5 rounded-xl font-black text-sm bg-dida-orange text-white hover:bg-orange-600 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Vai alla Palestra
                <Zap size={16} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Tab Allena */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-dida-orange tracking-wider">
                  Palestra Inclusiva
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                  Mettiti alla Prova!
                </h2>
              </div>
              <button
                onClick={() => {
                  setQ1(null); setQ2(null); setQ3(null); setQ4(null);
                }}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Ricomincia quiz"
              >
                <RotateCcw size={16} /> Ricomincia
              </button>
            </div>

            {/* Domanda 1 */}
            <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200 space-y-3">
              <span className="text-xs font-black text-dida-orange">Domanda 1</span>
              <p className="font-bold text-slate-900 text-sm">
                Se la temperatura passa da 0 gradi a 4 gradi sotto zero, quale numero scrivi?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "+4" },
                  { id: "B", text: "-4", correct: true },
                ].map((opt) => (
                  <button
                    key={opt.id} onClick={() => setQ1(opt.id)}
                    className={`p-3 rounded-xl font-bold text-sm text-left border transition cursor-pointer flex items-center justify-between ${
                      q1 === opt.id ? opt.correct ? "bg-emerald-500 text-white border-emerald-600 shadow-xs" : "bg-rose-500 text-white border-rose-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:border-orange-300"
                    }`}
                  >
                    <span>{opt.text}</span>
                    {q1 === opt.id && (opt.correct ? <Check size={16} /> : <X size={16} />)}
                  </button>
                ))}
              </div>
            </div>

            {/* Domanda 2 */}
            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-3">
              <span className="text-xs font-black text-blue-600">Domanda 2</span>
              <p className="font-bold text-slate-900 text-sm">
                Qual è il VALORE ASSOLUTO di -7? Cioè |-7| = ?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "7", correct: true },
                  { id: "B", text: "-7" },
                ].map((opt) => (
                  <button
                    key={opt.id} onClick={() => setQ2(opt.id)}
                    className={`p-3 rounded-xl font-bold text-sm text-left border transition cursor-pointer flex items-center justify-between ${
                      q2 === opt.id ? opt.correct ? "bg-emerald-500 text-white border-emerald-600 shadow-xs" : "bg-rose-500 text-white border-rose-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <span>{opt.text}</span>
                    {q2 === opt.id && (opt.correct ? <Check size={16} /> : <X size={16} />)}
                  </button>
                ))}
              </div>
            </div>

            {/* Domanda 3 */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3">
              <span className="text-xs font-black text-emerald-600">Domanda 3</span>
              <p className="font-bold text-slate-900 text-sm">
                I numeri +5 e -5 si dicono:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "Concordi" },
                  { id: "B", text: "Opposti", correct: true },
                ].map((opt) => (
                  <button
                    key={opt.id} onClick={() => setQ3(opt.id)}
                    className={`p-3 rounded-xl font-bold text-sm text-left border transition cursor-pointer flex items-center justify-between ${
                      q3 === opt.id ? opt.correct ? "bg-emerald-500 text-white border-emerald-600 shadow-xs" : "bg-rose-500 text-white border-rose-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <span>{opt.text}</span>
                    {q3 === opt.id && (opt.correct ? <Check size={16} /> : <X size={16} />)}
                  </button>
                ))}
              </div>
            </div>

            {/* Domanda 4 */}
            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200 space-y-3">
              <span className="text-xs font-black text-purple-600">Domanda 4</span>
              <p className="font-bold text-slate-900 text-sm">
                Chi è più grande tra -2 e -8?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "È più grande -8" },
                  { id: "B", text: "È più grande -2 (è più vicino allo zero!)", correct: true },
                ].map((opt) => (
                  <button
                    key={opt.id} onClick={() => setQ4(opt.id)}
                    className={`p-3 rounded-xl font-bold text-sm text-left border transition cursor-pointer flex items-center justify-between ${
                      q4 === opt.id ? opt.correct ? "bg-emerald-500 text-white border-emerald-600 shadow-xs" : "bg-rose-500 text-white border-rose-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:border-purple-300"
                    }`}
                  >
                    <span>{opt.text}</span>
                    {q4 === opt.id && (opt.correct ? <Check size={16} /> : <X size={16} />)}
                  </button>
                ))}
              </div>
            </div>

            {/* Punteggio Finale */}
            {q1 && q2 && q3 && q4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center space-y-2 shadow-sm"
              >
                <div className="inline-block p-3 rounded-full bg-white/20 backdrop-blur-xs">
                  <Award size={28} />
                </div>
                <h3 className="text-xl font-black">Ottimo Lavoro!</h3>
                <p className="text-xs font-medium text-orange-50">
                  Hai completato le 4 domande della palestra inclusiva.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
