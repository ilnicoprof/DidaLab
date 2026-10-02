import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, Sparkles, CheckCircle2, XCircle,
  HelpCircle, ChevronRight, ChevronLeft, Award, RotateCcw,
  BookOpen, Zap, Check, X, Star, Calendar, Scissors
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
  { id: "mod1", subtopicMap: "divisors-multiples", title: "1. Multipli e Divisori", short: "1. Multipli & Divisori" },
  { id: "mod2", subtopicMap: "divisibility-criteria", title: "2. I Trucchi per Dividere", short: "2. I Criteri" },
  { id: "mod3", subtopicMap: "prime-composite-numbers", title: "3. I Numeri Primi (Solitari)", short: "3. Numeri Primi" },
  { id: "mod4", subtopicMap: "gcd", title: "4. M.C.D.: I Sacchetti di Caramelle", short: "4. M.C.D. (Spezzare)" },
  { id: "mod5", subtopicMap: "lcm", title: "5. m.c.m.: Quando ci Rincontriamo?", short: "5. m.c.m. (Ritrovarsi)" },
  { id: "mod6", subtopicMap: "gcd-lcm-problems", title: "6. M.C.D. o m.c.m.? Come Riconoscerli", short: "6. M.C.D. o m.c.m.?" },
];

export default function DivisibilityLessonInclusion({
  onBack,
  subjectName,
  topicName,
  initialSubtopicId,
  initialTab = "impara",
}: Props) {
  const getInitialModId = () => {
    if (!initialSubtopicId) return "mod1";
    const found = INCLUSION_MODULES.find(m => m.subtopicMap === initialSubtopicId);
    return found ? found.id : "mod1";
  };

  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [activeModuleId, setActiveModuleId] = useState<string>(getInitialModId);

  // Sintesi Vocale
  const { ttsEnabled, isSpeaking, speak, stop, toggleTts } = useSpeech();

  // Stati Esercizi Inclusione
  const [q1Answer, setQ1Answer] = useState<boolean | null>(null);
  const [q2Answer, setQ2Answer] = useState<number | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const currentModIndex = INCLUSION_MODULES.findIndex(m => m.id === activeModuleId);

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
                Modalità Inclusiva · BES &amp; DSA
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {subjectName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Multipli, Divisori, M.C.D. e m.c.m. Facili
            </h1>
          </div>
        </div>

        {/* TTS & Tab Mode Controls */}
        <div className="flex items-center gap-2 flex-wrap self-stretch md:self-auto">
          <button
            onClick={toggleTts}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition cursor-pointer border shadow-sm ${
              ttsEnabled
                ? "bg-amber-500 text-white border-amber-600 shadow-amber-200 animate-pulse"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {ttsEnabled ? "Voce Attiva" : "Attiva Voce"}
          </button>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab("impara")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === "impara"
                  ? "bg-white text-dida-orange shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BookOpen size={16} />
              Impara
            </button>
            <button
              onClick={() => setActiveTab("allena")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === "allena"
                  ? "bg-white text-dida-blue shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Zap size={16} />
              Esercizi
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === "impara" ? (
          <motion.div
            key="tab-impara-div-inc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Navigazione orizzontale */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {INCLUSION_MODULES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveModuleId(m.id);
                    if (ttsEnabled) speak(m.title);
                  }}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition cursor-pointer border ${
                    activeModuleId === m.id
                      ? "bg-dida-orange text-white border-dida-orange shadow-md scale-105"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {m.short}
                </button>
              ))}
            </div>

            {/* MODULO 1: MULTIPLI E DIVISORI */}
            {activeModuleId === "mod1" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 1 · Salti e Divisioni
                  </span>
                  <button
                    onClick={() => speak("I multipli sono i numeri della tabellina, ottenuti moltiplicando. I divisori sono i numeri che dividono esattamente senza lasciare resto!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🐰</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Multipli (a salti) e Divisori (senza resto)
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 text-center space-y-2">
                    <span className="text-xs font-black text-dida-blue uppercase">I Multipli di 5</span>
                    <div className="font-mono text-xl font-black text-slate-800">5, 10, 15, 20, 25…</div>
                    <p className="text-xs text-slate-600">Salti di 5 in 5: non finiscono mai!</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 text-center space-y-2">
                    <span className="text-xs font-black text-amber-800 uppercase">I Divisori di 12</span>
                    <div className="font-mono text-xl font-black text-slate-800">1, 2, 3, 4, 6, 12</div>
                    <p className="text-xs text-slate-600">Dividono 12 con resto zero!</p>
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 2: I CRITERI */}
            {activeModuleId === "mod2" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 2 · Trucchi da Detective
                  </span>
                  <button
                    onClick={() => speak("I numeri pari si dividono sempre per due. I numeri che finiscono con zero o cinque si dividono per cinque. E se la somma delle cifre fa tre, sei o nove, si dividono per tre!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🕵️‍♂️</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    I Trucchi per Capire Subito se si Divide
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-1">
                    <span className="text-xs font-black text-sky-800">Per 2</span>
                    <p className="text-xs text-slate-600">Se l'ultima cifra è PARI (0, 2, 4, 6, 8).</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                    <span className="text-xs font-black text-amber-800">Per 5</span>
                    <p className="text-xs text-slate-600">Se finisce con 0 oppure con 5.</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                    <span className="text-xs font-black text-emerald-800">Per 10</span>
                    <p className="text-xs text-slate-600">Se finisce con lo zero (0).</p>
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 3: I NUMERI PRIMI */}
            {activeModuleId === "mod3" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 3 · I Numeri Solitari
                  </span>
                  <button
                    onClick={() => speak("I numeri primi si dividono solo per uno e per se stessi. Come il due, il tre, il cinque, il sette. Non si possono spezzare in squadre!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">👑</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    I Numeri Primi: Solo 1 e Se Stessi!
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    2, 3, 5, 7, 11, 13, 17, 19… sono i mattoncini fondamentali della matematica!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center text-xs text-amber-900 font-bold">
                  Il 2 è l'UNICO numero primo che è anche pari!
                </div>
              </div>
            )}

            {/* MODULO 4: M.C.D. FACILE */}
            {activeModuleId === "mod4" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 4 · Spezzare in Sacchetti
                  </span>
                  <button
                    onClick={() => speak("Il Massimo Comune Divisore serve quando devi fare dei sacchetti tutti uguali senza far avanzare nulla. Trova il numero di sacchetti più grande possibile!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🍬</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    M.C.D.: I Sacchetti di Caramelle (Spezzare)
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    12 caramelle alla fragola e 18 alla menta: <br />
                    Possiamo preparare <strong>6 sacchetti uguali</strong>, ognuno con 2 fragole e 3 mente!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 text-center font-mono font-bold text-base text-dida-blue">
                  M.C.D.(12, 18) = 6 sacchetti!
                </div>
              </div>
            )}

            {/* MODULO 5: m.c.m. FACILE */}
            {activeModuleId === "mod5" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 5 · Ritrovarsi nel Tempo
                  </span>
                  <button
                    onClick={() => speak("Il minimo comune multiplo serve quando due cose si ripetono e vuoi sapere quando accadranno di nuovo insieme. Come due amici che fanno sport in giorni diversi!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🗓️</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    m.c.m.: Quando ci Rincontriamo? (Ritrovarsi)
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Luca va in piscina ogni 4 giorni, Sara ogni 6 giorni: <br />
                    Si ritroveranno insieme tra <strong>12 giorni</strong>!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center font-mono font-bold text-base text-emerald-800">
                  m.c.m.(4, 6) = 12 giorni!
                </div>
              </div>
            )}

            {/* MODULO 6: M.C.D. O m.c.m.? LA SCELTA */}
            {activeModuleId === "mod6" && (
              <div className="rounded-[2.5rem] border-2 border-purple-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    Modulo 6 · Come Scegliere
                  </span>
                  <button
                    onClick={() => speak("Chiediti sempre: devo spezzare in parti uguali oppure cose che si ripetono e si ritrovano insieme? Per spezzare usa il Massimo Comune Divisore. Per ritrovarsi usa il minimo comune multiplo!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🧭</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    M.C.D. o m.c.m.? La Regola d'Oro
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Due parole magiche per non sbagliare mai nei problemi:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 space-y-2 text-center">
                    <div className="text-2xl">✂️</div>
                    <h3 className="font-black text-dida-blue text-base">SPEZZARE → M.C.D.</h3>
                    <p className="text-xs text-slate-600">
                      Dividere in sacchetti, mazzetti o nastri uguali. <br />
                      <strong>Il risultato è PIÙ PICCOLO!</strong>
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2 text-center">
                    <div className="text-2xl">🗓️</div>
                    <h3 className="font-black text-emerald-800 text-base">RITROVARSI → m.c.m.</h3>
                    <p className="text-xs text-slate-600">
                      Cose che si ripetono nel tempo o confezioni da pareggiare. <br />
                      <strong>Il risultato è PIÙ GRANDE!</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pulsanti Avanti / Indietro */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={goToPrevModule}
                disabled={currentModIndex === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm disabled:opacity-40 hover:bg-slate-50 cursor-pointer shadow-sm"
              >
                <ChevronLeft size={18} /> Modulo Precedente
              </button>
              <button
                onClick={goToNextModule}
                disabled={currentModIndex === INCLUSION_MODULES.length - 1}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-dida-orange text-white font-bold text-sm disabled:opacity-40 hover:bg-orange-600 cursor-pointer shadow-md"
              >
                Modulo Successivo <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* ======================================================== */
          /* TAB ALLENA INCLUSIONE */
          /* ======================================================== */
          <motion.div
            key="tab-allena-div-inc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-[2.5rem] bg-gradient-to-r from-orange-400 to-amber-500 text-white p-6 md:p-8 shadow-md text-center space-y-2">
              <span className="text-xs font-black uppercase text-orange-950 bg-white/20 px-3 py-1 rounded-full">
                Esercizi Guidati
              </span>
              <h2 className="text-2xl font-black">Gioca con i Divisori e Vinci le Stelline!</h2>
              <p className="text-orange-100 text-xs max-w-md mx-auto">
                Tocca la risposta corretta per guadagnare le stelline dorate!
              </p>
            </div>

            {/* Domanda 1 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 1</span>
                {q1Answer === true && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Bravissimo!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                Il numero <strong>35</strong> è divisibile per <strong>5</strong>?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: true, label: "SÌ, finisce con 5!", correct: true },
                  { val: false, label: "NO, è dispari", correct: false },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setQ1Answer(opt.val);
                      if (ttsEnabled) {
                        speak(opt.correct ? "Esatto! Tutti i numeri che finiscono con cinque si dividono per cinque!" : "Attenzione: se finisce con cinque si può sempre dividere per cinque!");
                      }
                    }}
                    className={`py-4 rounded-2xl text-sm font-bold border-2 transition cursor-pointer ${
                      q1Answer === opt.val
                        ? opt.correct
                          ? "bg-emerald-500 text-white border-emerald-600 scale-105"
                          : "bg-rose-500 text-white border-rose-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Domanda 2 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 2</span>
                {q2Answer === 7 && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Stellina guadagnata!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                Quale tra questi numeri è un <strong>NUMERO PRIMO</strong>?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[6, 7, 9].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setQ2Answer(val);
                      if (ttsEnabled) {
                        speak(val === 7 ? "Bravissimo! Sette è un numero primo, si divide solo per uno e per sette!" : "Attenzione, questo numero si può dividere per due o per tre!");
                      }
                    }}
                    className={`py-4 rounded-2xl text-xl font-black font-mono border-2 transition cursor-pointer ${
                      q2Answer === val
                        ? val === 7
                          ? "bg-emerald-500 text-white border-emerald-600 scale-105"
                          : "bg-rose-500 text-white border-rose-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Domanda 3 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 3</span>
                {q3Answer === "MCD" && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Bravissimo!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                Per fare il <strong>massimo numero di sacchetti uguali</strong> di caramelle, cosa usi?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "MCD", label: "M.C.D. (per spezzare in gruppi)", correct: true },
                  { id: "mcm", label: "m.c.m. (per ritrovarsi nel tempo)", correct: false },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setQ3Answer(opt.id);
                      if (ttsEnabled) {
                        speak(opt.correct ? "Corretto! Per spezzare e dividere in sacchetti uguali si usa il Massimo Comune Divisore!" : "Ricorda: il minimo comune multiplo serve per ritrovarsi nel tempo, non per fare sacchetti!");
                      }
                    }}
                    className={`py-4 px-3 rounded-2xl text-xs font-bold border-2 transition cursor-pointer ${
                      q3Answer === opt.id
                        ? opt.correct
                          ? "bg-emerald-500 text-white border-emerald-600 scale-105"
                          : "bg-rose-500 text-white border-rose-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
