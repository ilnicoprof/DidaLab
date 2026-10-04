import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Award,
  RotateCcw, BookOpen, Zap, Check, X
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
  { id: "mod1", title: "1. Addizione e Sottrazione", short: "1. Somma e Togli" },
  { id: "mod2", title: "2. Moltiplicazione e Divisione", short: "2. La Regola dei Segni" },
  { id: "mod3", title: "3. Via le Parentesi!", short: "3. Le Espressioni" },
  { id: "mod4", title: "4. Le Potenze (Pari e Dispari)", short: "4. Le Potenze" },
];

// Sottoargomento scelto nell'indice → scheda da aprire
const SUBTOPIC_TO_MODULE: Record<string, string> = {
  "relative-addition": "mod1",
  "relative-subtraction-expressions": "mod1",
  "relative-multiplication-division": "mod2",
  "relative-four-operations": "mod3",
  "relative-powers-roots": "mod4",
};

export default function RelativeOperationsLessonInclusion({
  onBack,
  initialSubtopicId,
  initialTab = "impara",
}: Props) {
  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [activeModuleId, setActiveModuleId] = useState<string>(
    () => SUBTOPIC_TO_MODULE[initialSubtopicId ?? ""] ?? "mod1"
  );

  // TTS
  const { ttsEnabled, speak, toggleTts } = useSpeech();

  // Stati Interattivi
  const [signRule, setSignRule] = useState<number>(0);

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
              Calcoli con i Relativi
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
                      L'Addizione Algebrica
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Amici (Concordi) o Nemici (Discordi)?
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Se due numeri hanno lo stesso segno sono amici, si sommano! Se hanno segni diversi sono nemici, quindi si fa la differenza e vince il segno del numero più forte, cioè quello più grande senza segno.")}
                      className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col gap-2">
                    <h3 className="font-black text-orange-900 text-lg flex items-center gap-2"><CheckCircle2 className="text-orange-600"/> Stesso Segno (Concordi)</h3>
                    <p className="text-sm font-bold text-orange-800">Unite le forze! SOMMA i numeri e tieni il segno.</p>
                    <div className="bg-white p-3 rounded-xl border border-orange-300 font-mono font-black text-center text-lg text-slate-800 mt-2">
                      (+3) + (+4) = <span className="text-orange-600">+7</span><br/>
                      (-2) + (-5) = <span className="text-blue-600">-7</span>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col gap-2">
                    <h3 className="font-black text-rose-900 text-lg flex items-center gap-2"><Sparkles className="text-rose-600"/> Segno Diverso (Discordi)</h3>
                    <p className="text-sm font-bold text-rose-800">Si scontrano! Fai la SOTTRAZIONE e metti il segno del "più forte".</p>
                    <div className="bg-white p-3 rounded-xl border border-rose-300 font-mono font-black text-center text-lg text-slate-800 mt-2">
                      (+8) + (-3) = <span className="text-orange-600">+5</span><br/>
                      (-9) + (+2) = <span className="text-blue-600">-7</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-100 rounded-xl border border-slate-300">
                  <h4 className="font-black text-slate-800 mb-1 text-sm">E la Sottrazione?</h4>
                  <p className="text-sm font-medium text-slate-700">Togliere significa <strong>AGGIUNGERE L'OPPOSTO</strong>. Cambia il meno in più e gira il segno del secondo numero!</p>
                  <p className="font-mono font-black text-slate-800 text-center mt-2 bg-white py-2 rounded-lg border border-slate-200">
                    (+5) - (-2) &rarr; (+5) + (+2) = +7
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 2 */}
          {activeModuleId === "mod2" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-purple-600 tracking-wider">
                      Moltiplicazione e Divisione
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      La Regola dei Segni
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Per moltiplicare o dividere fai il calcolo normale con i numeri. Per il segno, usa questa regola facilissima: se i segni sono uguali fa sempre Più, se sono diversi fa sempre Meno.")}
                      className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200 flex flex-col items-center">
                  <h4 className="font-black text-purple-900 text-lg mb-4">Seleziona una coppia di segni:</h4>
                  
                  <div className="flex gap-4 mb-6">
                    <button onClick={() => setSignRule(0)} className={`px-4 py-2 rounded-xl font-black text-xl font-mono border-2 transition ${signRule === 0 ? "bg-orange-500 text-white border-orange-600" : "bg-white text-slate-500 border-slate-300"}`}>+ · +</button>
                    <button onClick={() => setSignRule(1)} className={`px-4 py-2 rounded-xl font-black text-xl font-mono border-2 transition ${signRule === 1 ? "bg-orange-500 text-white border-orange-600" : "bg-white text-slate-500 border-slate-300"}`}>- · -</button>
                    <button onClick={() => setSignRule(2)} className={`px-4 py-2 rounded-xl font-black text-xl font-mono border-2 transition ${signRule === 2 ? "bg-blue-500 text-white border-blue-600" : "bg-white text-slate-500 border-slate-300"}`}>+ · -</button>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border-4 border-purple-300 w-full max-w-sm text-center shadow-xs">
                    {signRule === 0 && (
                      <div>
                        <div className="text-4xl font-black text-orange-600 mb-2">+</div>
                        <p className="font-bold text-slate-700">Più per Più fa PIÙ (Segni Uguali)</p>
                        <p className="font-mono text-sm mt-2 bg-slate-100 py-1 rounded">(+3) · (+4) = +12</p>
                      </div>
                    )}
                    {signRule === 1 && (
                      <div>
                        <div className="text-4xl font-black text-orange-600 mb-2">+</div>
                        <p className="font-bold text-slate-700">Meno per Meno fa PIÙ (Segni Uguali)</p>
                        <p className="font-mono text-sm mt-2 bg-slate-100 py-1 rounded">(-3) · (-4) = +12</p>
                      </div>
                    )}
                    {signRule === 2 && (
                      <div>
                        <div className="text-4xl font-black text-blue-600 mb-2">-</div>
                        <p className="font-bold text-slate-700">Più per Meno fa MENO (Segni Diversi)</p>
                        <p className="font-mono text-sm mt-2 bg-slate-100 py-1 rounded">(+3) · (-4) = -12</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-sm font-bold text-emerald-900 text-center">
                    La regola vale in modo identico anche per la DIVISIONE!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 3 */}
          {activeModuleId === "mod3" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-amber-600 tracking-wider">
                      Le Espressioni
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Via le Parentesi!
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Nelle espressioni lunghe possiamo togliere le parentesi per fare prima. Se davanti alla parentesi c'è un più, riscrivi tutto uguale. Se c'è un meno, cambia tutti i segni di quello che c'è dentro!")}
                      className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white border-2 border-emerald-200 shadow-xs flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-2xl">+</div>
                    <h3 className="font-black text-slate-800">Segno PIÙ davanti</h3>
                    <p className="text-xs font-bold text-slate-600">I segni dentro restano UGUALI.</p>
                    <div className="font-mono font-bold text-sm bg-slate-50 p-2 rounded w-full border border-slate-200">
                      +(<span className="text-blue-600">-3</span> <span className="text-orange-600">+5</span>)<br/>
                      diventa <span className="text-blue-600">-3</span> <span className="text-orange-600">+5</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border-2 border-rose-200 shadow-xs flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-black text-2xl">-</div>
                    <h3 className="font-black text-slate-800">Segno MENO davanti</h3>
                    <p className="text-xs font-bold text-slate-600">TUTTI i segni dentro CAMBIANO.</p>
                    <div className="font-mono font-bold text-sm bg-slate-50 p-2 rounded w-full border border-slate-200">
                      -(<span className="text-blue-600">-3</span> <span className="text-orange-600">+5</span>)<br/>
                      diventa <span className="text-orange-600">+3</span> <span className="text-blue-600">-5</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-center">
                  <h4 className="font-black text-slate-800 text-sm mb-1">Precedenze (Chi viene prima?)</h4>
                  <p className="text-xs font-bold text-slate-600">
                    1. Potenze &rarr; 2. Moltiplicazioni/Divisioni &rarr; 3. Addizioni/Sottrazioni
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 4 */}
          {activeModuleId === "mod4" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
                      Pari e Dispari
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Le Potenze
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() => speak("Nelle potenze con base negativa devi guardare l'esponente, cioè il numerino in alto. Se l'esponente è pari, il risultato diventa positivo. Se l'esponente è dispari, il risultato resta negativo.")}
                      className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-200 text-center">
                  <h4 className="font-black text-indigo-900 text-lg mb-4">Base Negativa? Guarda in alto!</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border-2 border-orange-300 shadow-xs">
                      <div className="font-black text-slate-800 mb-2">Esponente PARI (2, 4, 6...)</div>
                      <div className="text-3xl font-black font-mono text-slate-800 mb-1">
                        (-2)<sup className="text-orange-500">2</sup>
                      </div>
                      <div className="text-xl font-black text-orange-600">= +4</div>
                      <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Il risultato è POSITIVO</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border-2 border-blue-300 shadow-xs">
                      <div className="font-black text-slate-800 mb-2">Esponente DISPARI (3, 5, 7...)</div>
                      <div className="text-3xl font-black font-mono text-slate-800 mb-1">
                        (-2)<sup className="text-blue-500">3</sup>
                      </div>
                      <div className="text-xl font-black text-blue-600">= -8</div>
                      <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Il risultato è NEGATIVO</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                  <p className="text-sm font-black text-rose-900 text-center">
                    Attenzione! Senza parentesi l'esponente non comanda il segno!<br/>
                    <span className="font-mono bg-white px-2 py-1 rounded inline-block mt-2 text-rose-700 border border-rose-200">-3² = -9</span>
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
                Quanto fa (-8) + (+3)? Sono discordi, vincono i negativi!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "-5", correct: true },
                  { id: "B", text: "+11" },
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
                Quanto fa (-4) · (-5)? Meno per meno...
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "+20", correct: true },
                  { id: "B", text: "-20" },
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
                Se tolgo le parentesi in -( -3 ), cosa ottengo?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "-3 (resta uguale)" },
                  { id: "B", text: "+3 (il segno meno cambia tutto)", correct: true },
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
                Quanto fa (-2)³ ? L'esponente è dispari...
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "A", text: "-8", correct: true },
                  { id: "B", text: "+8" },
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
                <h3 className="text-xl font-black">Complimenti!</h3>
                <p className="text-xs font-medium text-orange-50">
                  Hai imparato le operazioni con i numeri relativi.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
