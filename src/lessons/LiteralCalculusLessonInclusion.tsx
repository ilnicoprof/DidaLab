import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, Sparkles, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, Award, RotateCcw, BookOpen, Zap,
  Check, X, Box, Layers, Cuboid, HelpCircle
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
  { id: "mod1", title: "1. Lettere al posto dei numeri", short: "1. Le Lettere" },
  { id: "mod2", title: "2. I Mattoncini (I Monomi)", short: "2. I Monomi" },
  { id: "mod3", title: "3. Mele con Mele", short: "3. Somma e Prodotto" },
  { id: "mod4", title: "4. Il Quadrato di Binomio", short: "4. Il Quadrato Magico" },
];

export default function LiteralCalculusLessonInclusion({
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
              Il Calcolo Letterale
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
                      Le Scatole Magiche
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Lettere al posto dei numeri
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Nell'algebra usiamo le lettere al posto dei numeri. Immagina che la lettera x sia una scatola chiusa: dentro può esserci qualsiasi numero! Quando mettiamo un numero al posto della lettera, possiamo calcolare il risultato.")}
                      className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-200 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-32 h-32 bg-amber-200 border-4 border-amber-400 rounded-2xl shadow-inner flex flex-col items-center justify-center">
                    <span className="text-5xl font-black font-serif italic text-amber-700">x</span>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-widest mt-2">Scatola</span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="font-black text-slate-800 text-lg">Cosa significa 3x ?</h3>
                    <p className="text-sm font-medium text-slate-700">
                      In algebra il segno "per" (·) non si scrive quasi mai tra un numero e una lettera. Quindi <strong>3x</strong> significa <strong>3 moltiplicato per x</strong> (tre scatole!).
                    </p>
                    <div className="bg-white p-3 rounded-xl border border-blue-200 font-mono font-black text-blue-600 text-center">
                      3x = 3 · x
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h4 className="font-black text-emerald-900 mb-1">Mettiamo un numero nella scatola!</h4>
                  <p className="text-sm font-bold text-emerald-800">
                    Se x = 5, allora l'espressione <strong>3x</strong> diventa <strong>3 · 5 = 15</strong>. Hai calcolato il valore numerico!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 2 */}
          {activeModuleId === "mod2" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-orange-600 tracking-wider">
                      I Mattoncini dell'Algebra
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      I Monomi
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Un monomio è come un mattoncino base dell'algebra. È formato da un numero, che chiamiamo coefficiente, e da una o più lettere attaccate, che chiamiamo parte letterale.")}
                      className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="bg-slate-50 p-8 rounded-[40px] border-2 border-slate-200 flex flex-col items-center shadow-xs">
                  <div className="flex items-end font-serif">
                    <span className="text-6xl font-black text-blue-600 mr-2">-4</span>
                    <span className="text-6xl font-black text-orange-500 italic">a</span>
                    <span className="text-6xl font-black text-orange-500 italic relative">b<sup className="text-3xl text-slate-700 absolute -top-4 -right-4">2</sup></span>
                  </div>
                  
                  <div className="flex justify-between w-full mt-6 max-w-sm">
                    <div className="text-center">
                      <div className="w-0.5 h-6 bg-slate-300 mx-auto mb-2"></div>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-xl text-xs font-black uppercase border border-blue-200">Coefficiente</div>
                      <div className="text-[10px] font-bold text-slate-500 mt-1">Il Numero</div>
                    </div>
                    <div className="text-center">
                      <div className="w-0.5 h-6 bg-slate-300 mx-auto mb-2"></div>
                      <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-xl text-xs font-black uppercase border border-orange-200">Parte Letterale</div>
                      <div className="text-[10px] font-bold text-slate-500 mt-1">Le Lettere</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <h4 className="font-black text-emerald-900 text-sm mb-1">Monomi SIMILI</h4>
                    <p className="text-xs font-bold text-emerald-800">
                      Due monomi sono simili se hanno <strong className="underline">ESATTAMENTE le stesse lettere</strong> con gli stessi esponentini.<br/>
                      <span className="font-mono bg-white px-1 mt-2 inline-block rounded">3x</span> e <span className="font-mono bg-white px-1 mt-2 inline-block rounded">-5x</span> sono simili!
                    </p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                    <h4 className="font-black text-rose-900 text-sm mb-1">Grado del Monomio</h4>
                    <p className="text-xs font-bold text-rose-800">
                      Per sapere il "livello" di un monomio, <strong className="underline">SOMMA tutti gli esponenti</strong> delle sue lettere.<br/>
                      <span className="font-mono bg-white px-1 mt-2 inline-block rounded">x²y</span> ha grado 3 (2 di x + 1 di y nascosto).
                    </p>
                  </div>
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
                      Regole di Calcolo
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Somma e Prodotto
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Per sommare o sottrarre i monomi c'è una regola d'oro: Mele con Mele! Puoi sommare solo i monomi simili. Le lettere restano uguali e sommi i numeri. Invece, per moltiplicare, puoi farlo sempre: numeri per numeri e lettere per lettere, sommando gli esponenti.")}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200">
                  <h3 className="font-black text-orange-900 text-lg mb-2">1. L'Addizione (Mele con Mele)</h3>
                  <p className="text-sm font-bold text-orange-800 mb-3">
                    Puoi sommare <strong>SOLO I SIMILI</strong>! Fai il conto con i numeri e lascia le lettere uguali.
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-orange-300 font-mono font-black text-center text-lg text-slate-800">
                    <span className="text-emerald-500">2a</span> + <span className="text-emerald-500">3a</span> = <span className="text-emerald-600">5a</span>
                  </div>
                  <p className="text-[10px] text-center font-bold text-orange-600 mt-2 uppercase">"Due mele più tre mele fa cinque mele"</p>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
                  <h3 className="font-black text-blue-900 text-lg mb-2">2. Moltiplicazione (Si fa sempre!)</h3>
                  <ul className="text-sm font-bold text-blue-800 list-decimal pl-5 mb-3">
                    <li>Segno per segno</li>
                    <li>Numero per numero</li>
                    <li>Lettera per lettera (sommando i loro piccoli esponenti!)</li>
                  </ul>
                  <div className="bg-white p-3 rounded-xl border border-blue-300 font-mono font-black text-center text-lg text-slate-800">
                    (<span className="text-blue-500">2x</span>) · (<span className="text-orange-500">3x²</span>) = <span className="text-purple-600">6x³</span>
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
                      I Prodotti Notevoli
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Il Quadrato di Binomio
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Il quadrato di binomio è una formula magica. Quando fai il quadrato di a più b, il risultato ha tre pezzi: il quadrato del primo, il doppio prodotto del primo per il secondo, e il quadrato del secondo. Ricorda: ci sono 3 pezzi, mai due!")}
                      className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200 text-center">
                  <h4 className="font-black text-purple-900 text-lg mb-4">La Formula Magica (3 Pezzi!)</h4>
                  
                  <div className="bg-white p-4 rounded-2xl border-4 border-purple-300 shadow-xs font-mono font-black text-[15px] sm:text-xl text-slate-800 mb-6">
                    (a + b)² = <span className="text-rose-500">a²</span> + <span className="text-indigo-600 border-b-4 border-indigo-300">2ab</span> + <span className="text-blue-500">b²</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-rose-100 p-3 rounded-xl border border-rose-200">
                      <div className="font-black text-rose-800 font-mono text-lg">a²</div>
                      <div className="text-[10px] font-bold text-rose-600 uppercase">Quadrato<br/>del Primo</div>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-xl border border-indigo-200 relative">
                      <div className="absolute -top-3 -right-2 bg-yellow-400 text-yellow-900 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs">x2</div>
                      <div className="font-black text-indigo-800 font-mono text-lg">2ab</div>
                      <div className="text-[10px] font-bold text-indigo-600 uppercase">Doppio Prodotto<br/>(Il Pezzo Mezzo!)</div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-xl border border-blue-200">
                      <div className="font-black text-blue-800 font-mono text-lg">b²</div>
                      <div className="text-[10px] font-bold text-blue-600 uppercase">Quadrato<br/>del Secondo</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                  <p className="text-sm font-black text-rose-900 text-center uppercase flex items-center justify-center gap-2">
                    <XCircle size={20} className="text-rose-600" />
                    Errore Gravissimo: (a+b)² NON è a² + b² !
                  </p>
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
                Qual è il coefficiente del monomio -3xy ?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "xy" },
                  { id: "B", text: "-3", correct: true },
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
                Puoi sommare 2a e 3b?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "Sì, fa 5ab" },
                  { id: "B", text: "No, non sono simili!", correct: true },
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
                Se moltiplichi a per a, ottieni:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "2a" },
                  { id: "B", text: "a²", correct: true },
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
                Il quadrato del binomio (a+b)² quanti pezzi ha alla fine?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "Due pezzi (a² + b²)" },
                  { id: "B", text: "Tre pezzi (a² + 2ab + b²)", correct: true },
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
                <h3 className="text-xl font-black">Meraviglioso!</h3>
                <p className="text-xs font-medium text-orange-50">
                  Hai superato il test di base sul calcolo letterale!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
