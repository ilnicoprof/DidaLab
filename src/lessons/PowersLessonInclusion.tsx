import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, ChevronRight, ChevronLeft, BookOpen, Zap, Star,
  Grid, Box
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
  { id: "mod1", subtopicMap: "power", title: "1. Numeri che Crescono in Fretta", short: "1. La Crescita" },
  { id: "mod2", subtopicMap: "power", title: "2. Base ed Esponente", short: "2. Base ed Esponente" },
  { id: "mod3", subtopicMap: "geometric-powers", title: "3. Il Quadrato e il Cubo", short: "3. Quadrato & Cubo" },
  { id: "mod4", subtopicMap: "power-properties-same-base", title: "4. Le Scorciatoie (Stessa Base)", short: "4. Scorciatoie" },
  { id: "mod5", subtopicMap: "scientific-notation", title: "5. Gli Zeri del 10", short: "5. Potenze di 10" },
];

export default function PowersLessonInclusion({
  onBack,
  subjectName,
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
  const { ttsEnabled, speak, toggleTts } = useSpeech();

  // Stati Esercizi Inclusione
  const [q1Answer, setQ1Answer] = useState<number | null>(null);
  const [q2Answer, setQ2Answer] = useState<boolean | null>(null);
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
              Le Potenze Facili
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
            key="tab-impara-pow-inc"
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

            {/* MODULO 1: LA CRESCITA */}
            {activeModuleId === "mod1" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 1 · Piegare un Foglio
                  </span>
                  <button
                    onClick={() => speak("Le potenze sono numeri che crescono velocissimi! Se pieghi un foglio a metà gli strati raddoppiano sempre: due, quattro, otto, sedici, trentadue!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">📄</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Il Foglio che Raddoppia Sempre!
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    1 piega = 2 strati. 2 pieghe = 4 strati. 3 pieghe = 8 strati. 4 pieghe = 16 strati!
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-center space-y-3">
                  <div className="text-3xl font-mono font-black text-slate-900">
                    2 × 2 × 2 × 2 = <span className="text-dida-orange">2⁴ = 16</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Si scrive <strong>2⁴</strong> e si legge <em>«due alla quarta»</em>.
                  </p>
                </div>
              </div>
            )}

            {/* MODULO 2: BASE ED ESPONENTE */}
            {activeModuleId === "mod2" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 2 · Chi Comanda
                  </span>
                  <button
                    onClick={() => speak("Il numero grande in basso si chiama base. Il numerino piccolo in alto si chiama esponente e dice quante volte la base deve moltiplicarsi per se stessa!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">👑</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Base ed Esponente
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Il <strong>numero grande</strong> è chi si moltiplica. Il <strong>numerino in alto</strong> dice quante volte!
                  </p>
                </div>

                <div className="flex justify-center items-center py-4">
                  <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-300 text-center font-mono">
                    <span className="text-6xl font-black text-dida-blue">5</span>
                    <span className="text-3xl font-black text-amber-500 -translate-y-5 inline-block">³</span>
                    <div className="text-xs font-sans font-bold text-slate-700 mt-2">
                      5 × 5 × 5 = <strong className="text-emerald-600 text-base">125</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-center text-xs text-rose-900 font-bold">
                  ⚠️ Attenzione: 5³ NON è 5 × 3 = 15! Fa 125!
                </div>
              </div>
            )}

            {/* MODULO 3: QUADRATO E CUBO */}
            {activeModuleId === "mod3" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 3 · Piastrelle e Cubetti
                  </span>
                  <button
                    onClick={() => speak("Tre alla seconda si chiama tre al quadrato perché forma una piastrella quadrata con nove caselle. Tre alla terza si chiama tre al cubo perché forma un cubo solido con ventisette cubetti!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 text-center space-y-2">
                    <Grid className="text-dida-blue mx-auto" size={32} />
                    <h3 className="font-black text-lg text-slate-900">Al Quadrato (² )</h3>
                    <div className="font-mono text-2xl font-black text-dida-blue">3² = 9</div>
                    <p className="text-xs text-slate-600">Una griglia quadrata 3 × 3 da 9 piastrelle.</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-purple-50 border-2 border-purple-200 text-center space-y-2">
                    <Box className="text-purple-600 mx-auto" size={32} />
                    <h3 className="font-black text-lg text-slate-900">Al Cubo (³ )</h3>
                    <div className="font-mono text-2xl font-black text-purple-700">3³ = 27</div>
                    <p className="text-xs text-slate-600">Un cubo di Rubik solido da 27 cubetti!</p>
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 4: LE SCORCIATOIE */}
            {activeModuleId === "mod4" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 4 · Scorciatoie
                  </span>
                  <button
                    onClick={() => speak("Se le potenze hanno la stessa base, basta sommare gli esponenti per moltiplicare, oppure sottrarli per dividere. Facilissimo!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-2">
                    <span className="text-xs font-black uppercase text-emerald-800">Con il Per (×): Somma!</span>
                    <div className="font-mono text-2xl font-black text-emerald-900">2³ × 2² = 2⁵</div>
                    <p className="text-xs text-slate-600">3 + 2 = 5.</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-sky-50 border-2 border-sky-200 text-center space-y-2">
                    <span className="text-xs font-black uppercase text-sky-800">Con il Diviso (:): Sottrai!</span>
                    <div className="font-mono text-2xl font-black text-sky-900">5⁴ : 5² = 5²</div>
                    <p className="text-xs text-slate-600">4 − 2 = 2.</p>
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 5: GLI ZERI DEL 10 */}
            {activeModuleId === "mod5" && (
              <div className="rounded-[2.5rem] border-2 border-orange-200 bg-white p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-50 px-3 py-1 rounded-full">
                    Modulo 5 · Il Trucco del 10
                  </span>
                  <button
                    onClick={() => speak("Per calcolare le potenze di dieci basta contare gli zeri. Dieci alla terza ha tre zeri e fa mille. Dieci alla sesta ha sei zeri e fa un milione!")}
                    className="flex items-center gap-1.5 text-xs font-bold text-dida-orange hover:underline cursor-pointer"
                  >
                    <Volume2 size={16} /> Ascolta spiegazione
                  </button>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="text-5xl">🚀</div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Le Potenze di 10 Contano gli Zeri!
                  </h2>
                </div>

                <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-center space-y-3 font-mono font-bold text-lg">
                  <div>10¹ = 10 <span className="text-xs font-sans text-slate-500">(1 zero)</span></div>
                  <div>10² = 100 <span className="text-xs font-sans text-slate-500">(2 zeri)</span></div>
                  <div>10³ = 1000 <span className="text-xs font-sans text-slate-500">(3 zeri = mille)</span></div>
                  <div className="text-amber-800">10⁶ = 1.000.000 <span className="text-xs font-sans text-slate-500">(6 zeri = 1 milione!)</span></div>
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
            key="tab-allena-pow-inc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-[2.5rem] bg-gradient-to-r from-orange-400 to-amber-500 text-white p-6 md:p-8 shadow-md text-center space-y-2">
              <span className="text-xs font-black uppercase text-orange-950 bg-white/20 px-3 py-1 rounded-full">
                Esercizi Guidati
              </span>
              <h2 className="text-2xl font-black">Gioca con le Potenze e Vinci le Stelline!</h2>
              <p className="text-orange-100 text-xs max-w-md mx-auto">
                Tocca la risposta che ritieni corretta per guadagnare le stelline dorate!
              </p>
            </div>

            {/* Domanda 1 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 1</span>
                {q1Answer === 8 && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Bravissimo!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                Quanto fa &nbsp; <span className="font-mono text-xl">2³</span>?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[6, 8, 9].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setQ1Answer(val);
                      if (ttsEnabled) {
                        speak(val === 8 ? "Esatto! Due per due per due fa otto!" : "Attenzione: non fare due per tre, moltiplica il due per se stesso tre volte!");
                      }
                    }}
                    className={`py-4 rounded-2xl text-xl font-black font-mono border-2 transition cursor-pointer ${
                      q1Answer === val
                        ? val === 8
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

            {/* Domanda 2 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 2</span>
                {q2Answer === true && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Stellina guadagnata!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                È vero che &nbsp; <span className="font-mono text-xl">5⁰ = 1</span>?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: true, label: "SÌ, fa sempre 1!", correct: true },
                  { val: false, label: "NO, fa 0", correct: false },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setQ2Answer(opt.val);
                      if (ttsEnabled) {
                        speak(opt.correct ? "Bravissimo! Qualsiasi numero elevato a zero vale sempre uno." : "Ricorda la regola d'oro: l'esponente zero dà sempre uno!");
                      }
                    }}
                    className={`py-4 rounded-2xl text-sm font-bold border-2 transition cursor-pointer ${
                      q2Answer === opt.val
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

            {/* Domanda 3 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-dida-orange uppercase">Domanda 3</span>
                {q3Answer === "3⁵" && <span className="text-amber-500 font-black text-sm flex items-center gap-1"><Star size={16} fill="currentColor" /> Bravissimo!</span>}
              </div>
              <p className="text-base font-bold text-slate-800">
                Qual è il risultato di &nbsp; <span className="font-mono text-xl">3² × 3³</span>?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: "3⁵", label: "3⁵ (sommi 2 + 3 = 5)", correct: true },
                  { val: "3⁶", label: "3⁶ (moltiplichi 2 × 3 = 6)", correct: false },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setQ3Answer(opt.val);
                      if (ttsEnabled) {
                        speak(opt.correct ? "Corretto! Con la stessa base e il per si sommano gli esponenti!" : "Attenzione: con la moltiplicazione gli esponenti si sommano, non si moltiplicano!");
                      }
                    }}
                    className={`py-4 rounded-2xl text-sm font-bold border-2 transition cursor-pointer ${
                      q3Answer === opt.val
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
