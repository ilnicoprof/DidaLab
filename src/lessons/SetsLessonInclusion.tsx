import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, Sparkles, CheckCircle2, XCircle,
  HelpCircle, ChevronRight, ChevronLeft, Award, RotateCcw,
  BookOpen, Zap, FileText, Check, X
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

// 8 Inclusion Modules matching Pages 1-4 of the Inclusion PDF
const INCLUSION_SET_MODULES = [
  { id: "mod1", subtopicMap: "sets", title: "1. Che cos'è un insieme", short: "1. Cos'è" },
  { id: "mod2", subtopicMap: "sets", title: "2. Dentro o Fuori? (∈ e ∉)", short: "2. ∈ / ∉" },
  { id: "mod3", subtopicMap: "particular-sets", title: "3. Finito, Infinito, Vuoto", short: "3. F / I / ∅" },
  { id: "mod4", subtopicMap: "representations", title: "4. Come si scrive un insieme", short: "4. Scrittura" },
  { id: "mod5", subtopicMap: "subsets", title: "5. I sottoinsiemi", short: "5. Sottoinsiemi" },
  { id: "mod6", subtopicMap: "intersection-union", title: "6. L'intersezione (∩)", short: "6. Intersezione ∩" },
  { id: "mod7", subtopicMap: "intersection-union", title: "7. L'unione (∪)", short: "7. Unione ∪" },
  { id: "mod8", subtopicMap: "intersection-union", title: "8. Insiemi disgiunti", short: "8. Disgiunti" },
];

export default function SetsLessonInclusion({
  onBack,
  subjectName,
  topicName,
  initialSubtopicId,
  initialTab = "impara"
}: Props) {
  // Map initial subtopic to one of the 8 modules
  const getInitialModId = () => {
    if (!initialSubtopicId) return "mod1";
    const found = INCLUSION_SET_MODULES.find(m => m.subtopicMap === initialSubtopicId);
    return found ? found.id : "mod1";
  };

  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [activeModuleId, setActiveModuleId] = useState<string>(getInitialModId);
  const [showPeiModal, setShowPeiModal] = useState<boolean>(false);

  // --- TTS (Sintesi Vocale) ---
  const { ttsEnabled, isSpeaking, speak, toggleTts } = useSpeech();

  // --- EXERCISE STATES (matching exactly pages 1 to 4) ---
  // Mod 1: Cerchia Sì/No
  const [m1Answers, setM1Answers] = useState<Record<number, boolean | null>>({});
  // Mod 2: Cerchia Simbolo ∈ o ∉
  const [m2Answers, setM2Answers] = useState<Record<string, "in" | "out" | null>>({});
  // Mod 3: Collega con una riga (finito, infinito, vuoto)
  const [m3Matches, setM3Matches] = useState<Record<string, string | null>>({});
  const [m3EmptySymbol, setM3EmptySymbol] = useState<string | null>(null);
  // Mod 4: Completa lettere e Disegna/Metti dentro
  const [m4Vocals, setM4Vocals] = useState<string[]>([]);
  const [m4InsidePoints, setM4InsidePoints] = useState<number[]>([]);
  // Mod 5: Sottoinsiemi Sì/No
  const [m5Answers, setM5Answers] = useState<Record<number, boolean | null>>({});
  // Mod 6: Intersezione completa & cerchia
  const [m6Tokens, setM6Tokens] = useState<number[]>([]);
  const [m6Person, setM6Person] = useState<string | null>(null);
  // Mod 7: Unione cerchia & V/F
  const [m7Choice, setM7Choice] = useState<string | null>(null);
  const [m7Vf, setM7Vf] = useState<boolean | null>(null);
  // Mod 8: Disgiunti V/F e Cerchia
  const [m8Vf1, setM8Vf1] = useState<boolean | null>(null);
  const [m8Vf2, setM8Vf2] = useState<boolean | null>(null);
  const [m8DisgiuntiChoice, setM8DisgiuntiChoice] = useState<string | null>(null);

  const currentModIndex = INCLUSION_SET_MODULES.findIndex(m => m.id === activeModuleId);

  const goToNextModule = () => {
    if (currentModIndex < INCLUSION_SET_MODULES.length - 1) {
      setActiveModuleId(INCLUSION_SET_MODULES[currentModIndex + 1].id);
    }
  };

  const goToPrevModule = () => {
    if (currentModIndex > 0) {
      setActiveModuleId(INCLUSION_SET_MODULES[currentModIndex - 1].id);
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
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                Didattica Inclusiva · BES & DSA
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {subjectName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Insiemi: Schede Facili e Visuali
            </h1>
          </div>
        </div>

        {/* Top Controls: Speech + Mode Toggle */}
        <div className="flex items-center gap-2 flex-wrap self-stretch md:self-auto">
          {/* TTS Read Aloud Toggle */}
          <button
            onClick={toggleTts}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition cursor-pointer border shadow-sm ${
              ttsEnabled
                ? "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {ttsEnabled ? <Volume2 size={18} className={isSpeaking ? "animate-bounce" : ""} /> : <VolumeX size={18} />}
            <span>{ttsEnabled ? "Voce Attiva" : "Ascolta con Voce"}</span>
          </button>

          {/* PEI Goals Button */}
          <button
            onClick={() => setShowPeiModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:border-dida-orange hover:text-dida-orange transition shadow-sm cursor-pointer"
          >
            <FileText size={16} />
            <span>Guida PEI</span>
          </button>

          {/* Mode Switcher: Impara / Allena */}
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
              Impara Facile
            </button>
            <button
              onClick={() => setActiveTab("allena")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === "allena"
                  ? "bg-dida-orange text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Zap size={16} />
              Schede & Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Module Navigation Pills - Centered */}
      <div className="flex justify-center flex-wrap gap-1.5 pb-1">
        {INCLUSION_SET_MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveModuleId(mod.id)}
            className={`px-3 py-2 rounded-2xl font-bold text-xs transition cursor-pointer border ${
              activeModuleId === mod.id
                ? "bg-dida-orange text-white border-orange-600 shadow-md scale-105"
                : "bg-white text-slate-700 border-slate-200 hover:bg-orange-50/50"
            }`}
          >
            {mod.short}
          </button>
        ))}
      </div>

      {/* MAIN CONTAINER (Styled like an inclusive worksheet) */}
      <div className="rounded-[2.5rem] border-2 border-orange-200 bg-[#FFFDFB] p-6 md:p-10 shadow-md space-y-8">
        
        {/* ========================================================= */}
        {/* MODULO 1: CHE COS'È UN INSIEME                           */}
        {/* ========================================================= */}
        {activeModuleId === "mod1" && (
          <div className="space-y-6">
            {/* Header Tag */}
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white font-black text-sm uppercase tracking-wider">
                <span>1</span> Che cos'è un insieme
              </div>
              <button
                onClick={() => speak("Metto delle cose in un gruppo. Per ogni cosa so subito se è dentro o fuori. Questo gruppo si chiama insieme. Il suo nome è una lettera grande: A, B, C. Esempio: i giorni della settimana è un insieme. Le canzoni belle no: ognuno ha gusti diversi.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Teoria in Stampatello con Immagine */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="p-4 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-5xl">👥🍎⭐</div>
                  <p className="font-black text-blue-900 text-sm">IL GRUPPO</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <p className="font-extrabold text-slate-800 text-base md:text-lg leading-relaxed uppercase">
                  METTO DELLE COSE IN UN GRUPPO. PER OGNI COSA SO SUBITO SE È DENTRO O FUORI.
                </p>
                <p className="font-bold text-slate-700 text-sm md:text-base leading-relaxed uppercase">
                  QUESTO GRUPPO SI CHIAMA <span className="text-blue-700 underline decoration-2">INSIEME</span>. IL SUO NOME È UNA LETTERA GRANDE: <strong>A, B, C</strong>.
                </p>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold space-y-1">
                  <p><strong>ESEMPIO:</strong> «I GIORNI DELLA SETTIMANA» È UN INSIEME.</p>
                  <p>«LE CANZONI BELLE» NO: OGNUNO HA GUSTI DIVERSI.</p>
                </div>
              </div>
            </div>

            {/* Esercizio: CERCHIA SÌ O NO */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white font-black text-xs uppercase">
                CERCHIA · È UN INSIEME? CERCHIA SÌ O NO.
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { id: 1, text: "I GIORNI DELLA SETTIMANA", correct: true, explain: "SÌ: sono 7 e sono uguali per tutti!" },
                  { id: 2, text: "I FILM PIÙ BELLI", correct: false, explain: "NO: i gusti personali non sono un insieme." },
                  { id: 3, text: "LE LETTERE DELLA PAROLA «MARE»", correct: true, explain: "SÌ: le lettere sono M, A, R, E chiare e sicure." },
                ].map((item) => {
                  const ans = m1Answers[item.id];
                  const isChecked = ans !== undefined && ans !== null;
                  const isCorrect = isChecked && ans === item.correct;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <span className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">
                        {item.text}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setM1Answers(prev => ({ ...prev, [item.id]: true }))}
                          className={`w-14 py-1.5 rounded-full font-black text-xs border transition cursor-pointer ${
                            ans === true
                              ? item.correct
                                ? "bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200"
                                : "bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
                          }`}
                        >
                          SÌ
                        </button>
                        <button
                          onClick={() => setM1Answers(prev => ({ ...prev, [item.id]: false }))}
                          className={`w-14 py-1.5 rounded-full font-black text-xs border transition cursor-pointer ${
                            ans === false
                              ? !item.correct
                                ? "bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200"
                                : "bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
                          }`}
                        >
                          NO
                        </button>
                      </div>
                      {isChecked && (
                        <p className={`text-xs font-bold sm:w-full mt-1 ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          {isCorrect ? "✓ Bravo! " : "✗ Riprova: "} {item.explain}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULO 2: DENTRO O FUORI? (∈ e ∉)                         */}
        {/* ========================================================= */}
        {activeModuleId === "mod2" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500 text-white font-black text-sm uppercase tracking-wider">
                <span>2</span> Dentro o Fuori?
              </div>
              <button
                onClick={() => speak("M è il gruppo delle lettere di LUNA. La U è dentro M. La F è fuori. Il simbolo appartiene vuol dire è dentro. Il simbolo non appartiene vuol dire è fuori. Esempio: U appartiene a M vuol dire: la U è dentro M.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Visual Venn Graphic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="p-4 rounded-3xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center">
                <svg viewBox="0 0 200 150" className="w-52 h-40">
                  {/* Nome dell'insieme M ALL'ESTERNO in alto a sinistra */}
                  <text x="18" y="26" className="font-black text-2xl fill-blue-700">M</text>

                  {/* Confine dell'insieme (linea chiusa) */}
                  <ellipse cx="95" cy="85" rx="65" ry="52" fill="#DBEAFE" stroke="#2563EB" strokeWidth="3" />

                  {/* Lettere sparse dentro il cerchio (non in riga) */}
                  <text x="52" y="72" className="font-black text-base fill-slate-800">• L</text>
                  <text x="108" y="65" className="font-black text-base fill-slate-800">• U</text>
                  <text x="62" y="112" className="font-black text-base fill-slate-800">• N</text>
                  <text x="116" y="108" className="font-black text-base fill-slate-800">• A</text>

                  {/* Elemento all'esterno */}
                  <text x="175" y="88" className="font-black text-base fill-rose-600">• F</text>
                </svg>
                <span className="text-[11px] font-bold text-slate-500 mt-1">M è all'esterno · La lettera F è FUORI!</span>
              </div>

              <div className="md:col-span-2 space-y-3 uppercase font-extrabold text-slate-800 text-sm md:text-base leading-relaxed">
                <p>M È IL GRUPPO DELLE LETTERE DI «LUNA». LA <strong>U È DENTRO M</strong>. LA <strong>F È FUORI</strong>.</p>
                <p>
                  IL SIMBOLO <span className="font-mono text-2xl text-blue-600 px-2 py-0.5 bg-blue-50 rounded-lg">∈</span> VUOL DIRE <strong>È DENTRO</strong>.
                </p>
                <p>
                  IL SIMBOLO <span className="font-mono text-2xl text-orange-600 px-2 py-0.5 bg-orange-50 rounded-lg">∉</span> VUOL DIRE <strong>È FUORI</strong>.
                </p>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold normal-case">
                  <strong>Esempio:</strong> U ∈ M vuol dire «la lettera U è dentro M».
                </div>
              </div>
            </div>

            {/* Esercizio Cerchia il Simbolo Giusto */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-orange-500 text-white font-black text-xs uppercase">
                CERCHIA · M = LETTERE DI «LUNA». CERCHIA IL SIMBOLO GIUSTO.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "N", item: "N … M", correct: "in", explain: "La N è dentro M (∈)" },
                  { id: "B", item: "B … M", correct: "out", explain: "La B non c'è in LUNA, è fuori (∉)" },
                  { id: "A", item: "A … M", correct: "in", explain: "La A è dentro M (∈)" },
                ].map((row) => {
                  const ans = m2Answers[row.id];
                  const isChecked = Boolean(ans);
                  const isCorrect = isChecked && ans === row.correct;

                  return (
                    <div key={row.id} className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                      <p className="font-mono font-black text-lg text-slate-800">{row.item}</p>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setM2Answers(prev => ({ ...prev, [row.id]: "in" }))}
                          className={`w-12 h-12 rounded-2xl font-mono text-2xl font-black border transition cursor-pointer ${
                            ans === "in"
                              ? row.correct === "in"
                                ? "bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200"
                                : "bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200"
                              : "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300"
                          }`}
                        >
                          ∈
                        </button>
                        <button
                          onClick={() => setM2Answers(prev => ({ ...prev, [row.id]: "out" }))}
                          className={`w-12 h-12 rounded-2xl font-mono text-2xl font-black border transition cursor-pointer ${
                            ans === "out"
                              ? row.correct === "out"
                                ? "bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200"
                                : "bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200"
                              : "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300"
                          }`}
                        >
                          ∉
                        </button>
                      </div>
                      {isChecked && (
                        <p className={`text-xs font-bold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          {isCorrect ? "✓ Esatto!" : "✗ Attenzione!"} {row.explain}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULO 3: FINITO, INFINITO, VUOTO                         */}
        {/* ========================================================= */}
        {activeModuleId === "mod3" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-wider">
                <span>3</span> Finito, Infinito, Vuoto
              </div>
              <button
                onClick={() => speak("Finito: posso contare tutto. Infinito: non finisce mai. Vuoto: dentro non c'è niente, il vuoto si scrive ∅. Esempio: le note sono 7, finito. I numeri non finiscono mai, infinito. I gatti con le ali? Nessuno: vuoto.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* 3 Visual Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-5 rounded-3xl bg-blue-50 border-2 border-blue-300 space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                  7
                </div>
                <h4 className="font-black text-blue-900 text-base uppercase">FINITO</h4>
                <p className="text-xs text-slate-700 font-bold uppercase">POSSO CONTARE TUTTO.</p>
                <p className="text-[11px] text-slate-500 italic">Es. le note musicali sono 7</p>
              </div>

              <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-sm">
                  0,1,2…
                </div>
                <h4 className="font-black text-emerald-900 text-base uppercase">INFINITO</h4>
                <p className="text-xs text-slate-700 font-bold uppercase">NON FINISCE MAI.</p>
                <p className="text-[11px] text-slate-500 italic">Es. i numeri non hanno fine</p>
              </div>

              <div className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                  ∅
                </div>
                <h4 className="font-black text-rose-900 text-base uppercase">VUOTO</h4>
                <p className="text-xs text-slate-700 font-bold uppercase">DENTRO NON C'È NIENTE.</p>
                <p className="text-[11px] text-slate-500 italic">Es. i gatti con le ali? Nessuno!</p>
              </div>
            </div>

            {/* Esercizio COLLEGA / TESSERE */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs uppercase">
                COLLEGA · SCEGLI LA TESSERA GIUSTA
              </div>

              <div className="space-y-3">
                {[
                  { id: "giorni", text: "I GIORNI DELLA SETTIMANA", correct: "FINITO" },
                  { id: "numeri", text: "I NUMERI (1, 2, 3, 4, ...)", correct: "INFINITO" },
                  { id: "mesi32", text: "I MESI CON 32 GIORNI", correct: "VUOTO" },
                ].map((item) => {
                  const match = m3Matches[item.id];
                  const isCorrect = match === item.correct;

                  return (
                    <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="font-extrabold text-sm text-slate-800 uppercase">{item.text}</span>
                      <div className="flex items-center gap-1.5">
                        {["FINITO", "INFINITO", "VUOTO"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setM3Matches(prev => ({ ...prev, [item.id]: opt }))}
                            className={`px-3 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                              match === opt
                                ? opt === item.correct
                                  ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200"
                                  : "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {match && (
                        <span className={`text-xs font-bold sm:w-full mt-1 ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          {isCorrect ? "✓ Perfetto!" : "✗ Ripensa alla definizione."}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cerchia come si scrive il vuoto */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
                <span className="font-black text-xs uppercase text-amber-900">CERCHIA · IL VUOTO SI SCRIVE…</span>
                <div className="flex gap-2">
                  {[
                    { sym: "∅", correct: true },
                    { sym: "∈", correct: false },
                  ].map((btn) => (
                    <button
                      key={btn.sym}
                      onClick={() => setM3EmptySymbol(btn.sym)}
                      className={`w-14 h-12 rounded-2xl font-mono text-2xl font-black border transition cursor-pointer ${
                        m3EmptySymbol === btn.sym
                          ? btn.correct
                            ? "bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200"
                            : "bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200"
                          : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {btn.sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULO 4: COME SI SCRIVE UN INSIEME                       */}
        {/* ========================================================= */}
        {activeModuleId === "mod4" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600 text-white font-black text-sm uppercase tracking-wider">
                <span>4</span> Come si scrive un insieme
              </div>
              <button
                onClick={() => speak("Posso scrivere le cose in fila, dentro due parentesi graffe. Oppure disegno una linea chiusa: dentro metto le cose con un puntino. Questo disegno si chiama diagramma di Venn. Esempio le note musicali.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-purple-50 border border-purple-200 space-y-3 font-extrabold text-slate-800 text-sm md:text-base uppercase leading-relaxed">
              <p>POSSO SCRIVERE LE COSE IN FILA, DENTRO DUE PARENTESI <strong>&#123; &#125;</strong>.</p>
              <p>OPPURE DISEGNO UNA <strong>LINEA CHIUSA</strong>. DENTRO METTO LE COSE CON UN PUNTINO. QUESTO DISEGNO SI CHIAMA <strong>DIAGRAMMA DI VENN</strong>.</p>
              <div className="p-3 bg-white rounded-2xl border border-purple-200 font-mono text-xs font-bold text-purple-900 normal-case">
                Esempio note: A = &#123;DO, RE, MI, FA, SOL, LA, SI&#125;
              </div>
            </div>

            {/* Esercizio COMPLETA CON LE PAROLE DEL RIQUADRO */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-purple-600 text-white font-black text-xs uppercase">
                COMPLETA · LE VOCALI MANCANTI
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-4">
                <p className="font-black text-xs text-slate-500 uppercase">Tessere disponibili (clicca per inserire):</p>
                <div className="flex justify-center gap-3">
                  {["I", "U"].map((letter) => {
                    const isUsed = m4Vocals.includes(letter);
                    return (
                      <button
                        key={letter}
                        onClick={() => {
                          if (!isUsed) setM4Vocals(prev => [...prev, letter]);
                        }}
                        disabled={isUsed}
                        className={`w-12 h-12 rounded-2xl font-black text-xl border transition shadow-sm ${
                          isUsed
                            ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed"
                            : "bg-purple-600 text-white border-purple-700 hover:bg-purple-700 cursor-pointer"
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                  {m4Vocals.length > 0 && (
                    <button
                      onClick={() => setM4Vocals([])}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                    >
                      Azzera
                    </button>
                  )}
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 font-mono text-xl font-black text-purple-900">
                  LE VOCALI: V = &#123; A, E, {m4Vocals.includes("I") ? "I" : "___"} , O, {m4Vocals.includes("U") ? "U" : "___"} &#125;
                </div>

                {m4Vocals.includes("I") && m4Vocals.includes("U") && (
                  <p className="text-xs font-black text-emerald-700">✓ Bravissimo! Hai completato le 5 vocali: A, E, I, O, U!</p>
                )}
              </div>

              {/* Interattivo: METTI 1, 2, 3 DENTRO LA LINEA CHIUSA */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <p className="font-black text-xs uppercase text-slate-700">
                  METTI DENTRO IL CERCHIO I NUMERI 1, 2, 3:
                </p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {[1, 2, 3].map((num) => {
                    const isInside = m4InsidePoints.includes(num);
                    return (
                      <button
                        key={num}
                        onClick={() => {
                          setM4InsidePoints(prev =>
                            prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
                          );
                        }}
                        className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer border ${
                          isInside ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 border-slate-300"
                        }`}
                      >
                        {isInside ? `✓ ${num} è dentro` : `+ Metti ${num}`}
                      </button>
                    );
                  })}
                </div>

                {/* SVG Venn Circle Container */}
                <div className="relative rounded-2xl bg-blue-50/50 border border-blue-200 p-4 flex flex-col items-center justify-center">
                  <svg viewBox="0 0 240 130" className="w-56 h-36">
                    {/* Nome insieme A all'esterno */}
                    <text x="18" y="24" className="font-black text-xl fill-blue-700">A</text>

                    {/* Cerchio chiuso */}
                    <ellipse cx="120" cy="72" rx="80" ry="46" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />

                    {/* Punti inseriti sparsi naturalmente dentro il cerchio */}
                    {m4InsidePoints.includes(1) && (
                      <text x="75" y="65" className="font-black text-base fill-slate-800">• 1</text>
                    )}
                    {m4InsidePoints.includes(2) && (
                      <text x="145" y="60" className="font-black text-base fill-slate-800">• 2</text>
                    )}
                    {m4InsidePoints.includes(3) && (
                      <text x="110" y="98" className="font-black text-base fill-slate-800">• 3</text>
                    )}
                  </svg>
                  {m4InsidePoints.length === 0 ? (
                    <span className="text-[11px] font-bold text-slate-400 mt-1">Il cerchio è vuoto. Clicca sui tasti sopra per inserire i numeri!</span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 mt-1">✓ I numeri sono dentro l'insieme A!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULO 5: I SOTTOINSIEMI                                  */}
        {/* ========================================================= */}
        {activeModuleId === "mod5" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600 text-white font-black text-sm uppercase tracking-wider">
                <span>5</span> I Sottoinsiemi
              </div>
              <button
                onClick={() => speak("Guarda il disegno. A è un gruppo grande. B è un gruppo piccolo. B sta tutto dentro A. Il gruppo piccolo si chiama sottoinsieme. Esempio: tutta la classe è il gruppo grande, chi gioca a calcio è un gruppo piccolo dentro.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Visual Graphic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="p-4 rounded-3xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center">
                <svg viewBox="0 0 240 160" className="w-56 h-40">
                  {/* Nome insieme A ALL'ESTERNO in alto a sinistra */}
                  <text x="16" y="26" className="font-black text-xl fill-blue-700">A</text>

                  {/* Grande cerchio A */}
                  <ellipse cx="120" cy="92" rx="98" ry="58" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />

                  {/* Elementi in A sparsi naturalmente */}
                  <text x="50" y="78" className="font-bold text-sm fill-slate-700">• 3</text>
                  <text x="96" y="60" className="font-bold text-sm fill-slate-700">• 5</text>
                  <text x="66" y="125" className="font-bold text-sm fill-slate-700">• 4</text>

                  {/* Nome insieme B ALL'ESTERNO del cerchio piccolo */}
                  <text x="185" y="55" className="font-black text-sm fill-orange-700">B</text>

                  {/* Piccolo cerchio B interno */}
                  <ellipse cx="165" cy="100" rx="38" ry="32" fill="#FED7AA" stroke="#EA580C" strokeWidth="2.5" />

                  {/* Elementi in B sparsi */}
                  <text x="145" y="104" className="font-black text-sm fill-orange-950">• 1</text>
                  <text x="178" y="98" className="font-black text-sm fill-orange-950">• 2</text>
                </svg>
                <span className="text-[11px] font-bold text-slate-500 mt-1">A e B all'esterno · B sta TUTTO DENTRO ad A!</span>
              </div>

              <div className="md:col-span-2 space-y-3 font-extrabold text-slate-800 text-sm md:text-base leading-relaxed uppercase">
                <p>A È UN GRUPPO GRANDE. B È UN GRUPPO PICCOLO. <strong>B STA TUTTO DENTRO A</strong>.</p>
                <p>IL GRUPPO PICCOLO SI CHIAMA <span className="text-orange-600 underline">SOTTOINSIEME</span>.</p>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold normal-case">
                  <strong>Esempio:</strong> Tutta la classe è il gruppo grande. Chi gioca a calcio è un gruppo piccolo dentro: è un sottoinsieme!
                </div>
              </div>
            </div>

            {/* Esercizio Cerchia Sì/No */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs uppercase">
                CERCHIA · STA TUTTO DENTRO? SÌ O NO
              </div>

              <div className="space-y-3">
                {[
                  { id: 1, text: "IL GRUPPO {1, 2} STA TUTTO DENTRO {1, 2, 3, 4}?", correct: true, explain: "SÌ: sia 1 che 2 si trovano dentro il gruppo grande!" },
                  { id: 2, text: "IL GRUPPO {1, 7} STA TUTTO DENTRO {1, 2, 3, 4}?", correct: false, explain: "NO: il numero 7 non fa parte del gruppo grande, rimane fuori!" },
                ].map((item) => {
                  const ans = m5Answers[item.id];
                  const isChecked = ans !== undefined && ans !== null;
                  const isCorrect = isChecked && ans === item.correct;

                  return (
                    <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="font-extrabold text-sm text-slate-800 uppercase">{item.text}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setM5Answers(prev => ({ ...prev, [item.id]: true }))}
                          className={`w-14 py-1.5 rounded-full font-black text-xs border transition cursor-pointer ${
                            ans === true
                              ? item.correct
                                ? "bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200"
                                : "bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
                          }`}
                        >
                          SÌ
                        </button>
                        <button
                          onClick={() => setM5Answers(prev => ({ ...prev, [item.id]: false }))}
                          className={`w-14 py-1.5 rounded-full font-black text-xs border transition cursor-pointer ${
                            ans === false
                              ? !item.correct
                                ? "bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200"
                                : "bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
                          }`}
                        >
                          NO
                        </button>
                      </div>
                      {isChecked && (
                        <p className={`text-xs font-bold sm:w-full mt-1 ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          {isCorrect ? "✓ Esatto! " : "✗ Rifletti: "} {item.explain}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULO 6: L'INTERSEZIONE (∩)                              */}
        {/* ========================================================= */}
        {activeModuleId === "mod6" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-600 text-white font-black text-sm uppercase tracking-wider">
                <span>6</span> L'Intersezione ∩
              </div>
              <button
                onClick={() => speak("Guarda la parte gialla. Lì ci sono le cose che stanno in tutti e due i cerchi. Sono le cose in comune. Si chiama intersezione. Il simbolo intersezione vuol dire in comune. Esempio Livio e Monica fanno ballo e anche canto.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Visual Venn Graphic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="p-4 rounded-3xl bg-amber-50/50 border border-amber-200 flex flex-col items-center justify-center">
                <svg viewBox="0 0 240 160" className="w-56 h-40">
                  {/* Cerchio A */}
                  <circle cx="80" cy="92" r="50" fill="#DBEAFE" fillOpacity="0.7" stroke="#2563EB" strokeWidth="2.5" />
                  {/* Cerchio B */}
                  <circle cx="160" cy="92" r="50" fill="#FFEDD5" fillOpacity="0.7" stroke="#EA580C" strokeWidth="2.5" />
                  
                  {/* Intersezione gialla */}
                  <g>
                    <defs>
                      <clipPath id="cA">
                        <circle cx="80" cy="92" r="50" />
                      </clipPath>
                    </defs>
                    <circle cx="160" cy="92" r="50" clipPath="url(#cA)" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
                  </g>

                  {/* Nomi insiemi ALL'ESTERNO in alto */}
                  <text x="38" y="26" className="font-bold text-xs fill-blue-800">
                    <tspan className="font-black text-base fill-blue-700">A</tspan> BALLO
                  </text>
                  <text x="150" y="26" className="font-bold text-xs fill-orange-800">
                    <tspan className="font-black text-base fill-orange-700">B</tspan> CANTO
                  </text>

                  {/* Elementi in A (solo ballo) sparsi */}
                  <text x="46" y="80" className="font-bold text-[11px] fill-slate-800">• IVO</text>
                  <text x="56" y="115" className="font-bold text-[11px] fill-slate-800">• RITA</text>

                  {/* Elementi in B (solo canto) sparsi */}
                  <text x="170" y="80" className="font-bold text-[11px] fill-slate-800">• ANNA</text>
                  <text x="162" y="115" className="font-bold text-[11px] fill-slate-800">• UGO</text>

                  {/* Elementi nell'intersezione (in comune) */}
                  <text x="120" y="78" textAnchor="middle" className="font-black text-[11px] fill-amber-900">• LIVIO</text>
                  <text x="120" y="110" textAnchor="middle" className="font-black text-[11px] fill-amber-900">• MONICA</text>
                </svg>
                <span className="text-[11px] font-black text-amber-700 mt-1">A e B all'esterno · PARTE GIALLA = IN COMUNE!</span>
              </div>

              <div className="md:col-span-2 space-y-3 font-extrabold text-slate-800 text-sm md:text-base leading-relaxed uppercase">
                <p>GUARDA LA <strong>PARTE GIALLA</strong>. LÌ CI SONO LE COSE CHE STANNO IN TUTTI E DUE I CERCHI.</p>
                <p>SONO LE COSE <strong>IN COMUNE</strong>. SI CHIAMA <strong>INTERSEZIONE</strong>. IL SIMBOLO <span className="font-mono text-2xl text-amber-600 font-black">∩</span> VUOL DIRE <strong>IN COMUNE</strong>.</p>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold normal-case">
                  <strong>Esempio:</strong> Livio e Monica fanno ballo E ANCHE canto: stanno nella parte gialla!
                </div>
              </div>
            </div>

            {/* Esercizio COMPLETA & CERCHIA */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-600 text-white font-black text-xs uppercase">
                COMPLETA · COSA C'È IN COMUNE TRA I DUE INSIEMI?
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <p className="font-mono text-sm font-bold text-slate-800">
                  Dati: A = &#123;1, 2, 3&#125; &nbsp;e&nbsp; B = &#123;2, 3, 5&#125;.
                </p>
                <p className="font-bold text-xs text-slate-500 uppercase">Tocca i numeri presenti in entrambi i gruppi:</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 5].map((n) => {
                    const isSelected = m6Tokens.includes(n);
                    return (
                      <button
                        key={n}
                        onClick={() => {
                          setM6Tokens(prev =>
                            prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]
                          );
                        }}
                        className={`w-12 h-12 rounded-2xl font-black text-lg border transition cursor-pointer ${
                          isSelected
                            ? [2, 3].includes(n)
                              ? "bg-amber-500 text-white border-amber-600 ring-4 ring-amber-200"
                              : "bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200"
                            : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                {m6Tokens.includes(2) && m6Tokens.includes(3) && !m6Tokens.includes(1) && !m6Tokens.includes(5) && (
                  <p className="text-xs font-black text-emerald-700">✓ Esatto! In comune ci sono proprio 2 e 3!</p>
                )}
              </div>

              {/* Cerchia chi fa ballo e anche canto */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">CERCHIA · CHI FA BALLO E ANCHE CANTO?</span>
                <div className="flex gap-2">
                  {[
                    { name: "LIVIO", correct: true },
                    { name: "ANNA", correct: false },
                  ].map((btn) => (
                    <button
                      key={btn.name}
                      onClick={() => setM6Person(btn.name)}
                      className={`px-4 py-2 rounded-xl font-black text-xs border transition cursor-pointer ${
                        m6Person === btn.name
                          ? btn.correct
                            ? "bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-200"
                            : "bg-rose-600 text-white border-rose-700 ring-4 ring-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {btn.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULO 7: L'UNIONE (∪)                                    */}
        {/* ========================================================= */}
        {activeModuleId === "mod7" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white font-black text-sm uppercase tracking-wider">
                <span>7</span> L'Unione ∪
              </div>
              <button
                onClick={() => speak("Metto insieme tutte le cose dei due cerchi. Chi sta in tutti e due lo scrivo una volta sola. Si chiama unione. Il simbolo unione vuol dire tutti insieme. Esempio Luca e Sara fanno una festa insieme: fanno una lista sola con i loro amici.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Visual Graphic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="p-4 rounded-3xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center">
                <svg viewBox="0 0 240 160" className="w-56 h-40">
                  {/* Cerchio A */}
                  <circle cx="80" cy="92" r="50" fill="#BFDBFE" stroke="#2563EB" strokeWidth="2.5" />
                  {/* Cerchio B */}
                  <circle cx="160" cy="92" r="50" fill="#BFDBFE" stroke="#2563EB" strokeWidth="2.5" />

                  {/* Nomi insiemi ALL'ESTERNO in alto */}
                  <text x="38" y="26" className="font-bold text-xs fill-blue-900">
                    <tspan className="font-black text-base fill-blue-700">A</tspan> LUCA
                  </text>
                  <text x="150" y="26" className="font-bold text-xs fill-blue-900">
                    <tspan className="font-black text-base fill-blue-700">B</tspan> SARA
                  </text>

                  {/* Elementi in A sparsi */}
                  <text x="44" y="80" className="font-bold text-[11px] fill-slate-800">• ALE</text>
                  <text x="54" y="115" className="font-bold text-[11px] fill-slate-800">• BEA</text>

                  {/* Elemento comune al centro */}
                  <text x="120" y="96" textAnchor="middle" className="font-black text-[12px] fill-blue-950">• DANI</text>

                  {/* Elementi in B sparsi */}
                  <text x="172" y="80" className="font-bold text-[11px] fill-slate-800">• ENZO</text>
                  <text x="162" y="115" className="font-bold text-[11px] fill-slate-800">• FEDE</text>
                </svg>
                <span className="text-[11px] font-bold text-slate-500 mt-1">A e B all'esterno · Festa insieme = Unica lista!</span>
              </div>

              <div className="md:col-span-2 space-y-3 font-extrabold text-slate-800 text-sm md:text-base leading-relaxed uppercase">
                <p>METTO INSIEME TUTTE LE COSE DEI DUE CERCHI.</p>
                <p>CHI STA IN TUTTI E DUE LO SCRIVO <strong>UNA VOLTA SOLA</strong>. SI CHIAMA <strong>UNIONE</strong>.</p>
                <p>IL SIMBOLO <span className="font-mono text-2xl text-blue-600 font-black">∪</span> VUOL DIRE <strong>TUTTI INSIEME</strong>.</p>
              </div>
            </div>

            {/* Esercizio Cerchia la risposta giusta & V/F */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-extrabold text-xs uppercase text-slate-800">
                  CERCHIA · METTO INSIEME &#123;1, 2&#125; E &#123;2, 3&#125;. OTTENGO…
                </span>
                <div className="flex gap-2">
                  {[
                    { opt: "{1, 2, 3}", correct: true },
                    { opt: "{2}", correct: false },
                  ].map((btn) => (
                    <button
                      key={btn.opt}
                      onClick={() => setM7Choice(btn.opt)}
                      className={`px-4 py-2 rounded-xl font-mono font-black text-xs border transition cursor-pointer ${
                        m7Choice === btn.opt
                          ? btn.correct
                            ? "bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-200"
                            : "bg-rose-600 text-white border-rose-700 ring-4 ring-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {btn.opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-extrabold text-xs uppercase text-slate-800">
                  V / F · NELLA LISTA DELLA FESTA DANI È SCRITTO DUE VOLTE.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setM7Vf(true)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m7Vf === true ? "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    V
                  </button>
                  <button
                    onClick={() => setM7Vf(false)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m7Vf === false ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    F
                  </button>
                </div>
              </div>
              {m7Vf !== null && (
                <p className={`text-xs font-bold ${m7Vf === false ? "text-emerald-700" : "text-rose-700"}`}>
                  {m7Vf === false ? "✓ Esatto! È falso perché negli insiemi non si ripetono i doppioni." : "✗ Ricorda: chi è presente in entrambi si scrive una volta sola!"}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULO 8: INSIEMI DISGIUNTI                               */}
        {/* ========================================================= */}
        {activeModuleId === "mod8" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-white font-black text-sm uppercase tracking-wider">
                <span>8</span> Insiemi Disgiunti
              </div>
              <button
                onClick={() => speak("Due gruppi non hanno niente in comune. Li disegno lontani. Si chiamano disgiunti. Esempio i numeri pari e i numeri dispari. Nessun numero è pari e dispari insieme.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Visual Graphic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center">
                <svg viewBox="0 0 240 145" className="w-56 h-36">
                  {/* Cerchio DISPARI */}
                  <circle cx="65" cy="82" r="44" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2.5" />
                  {/* Cerchio PARI */}
                  <circle cx="175" cy="82" r="44" fill="#FFEDD5" stroke="#F97316" strokeWidth="2.5" />

                  {/* Nomi ALL'ESTERNO in alto */}
                  <text x="65" y="24" textAnchor="middle" className="font-black text-xs fill-blue-800">DISPARI</text>
                  <text x="175" y="24" textAnchor="middle" className="font-black text-xs fill-orange-800">PARI</text>

                  {/* Elementi DISPARI sparsi con puntino */}
                  <text x="44" y="70" className="font-bold text-[11px] fill-slate-800">• 1</text>
                  <text x="76" y="66" className="font-bold text-[11px] fill-slate-800">• 3</text>
                  <text x="46" y="104" className="font-bold text-[11px] fill-slate-800">• 5</text>
                  <text x="78" y="102" className="font-bold text-[11px] fill-slate-800">• 7</text>

                  {/* Elementi PARI sparsi con puntino */}
                  <text x="154" y="70" className="font-bold text-[11px] fill-slate-800">• 2</text>
                  <text x="186" y="66" className="font-bold text-[11px] fill-slate-800">• 4</text>
                  <text x="156" y="104" className="font-bold text-[11px] fill-slate-800">• 6</text>
                  <text x="188" y="102" className="font-bold text-[11px] fill-slate-800">• 8</text>
                </svg>
                <span className="text-[11px] font-bold text-slate-500 mt-1">DISPARI e PARI all'esterno · Separati = Disgiunti!</span>
              </div>

              <div className="md:col-span-2 space-y-3 font-extrabold text-slate-800 text-sm md:text-base leading-relaxed uppercase">
                <p>DUE GRUPPI NON HANNO NIENTE IN COMUNE. LI DISEGNO LONTANI.</p>
                <p>SI CHIAMANO <span className="text-blue-700 underline">DISGIUNTI</span>.</p>
                <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-700 font-semibold normal-case">
                  <strong>Esempio:</strong> I numeri pari e i numeri dispari. Nessun numero al mondo può essere pari e dispari contemporaneamente!
                </div>
              </div>
            </div>

            {/* Esercizi V/F e Cerchia */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">V / F · IL 4 È UN NUMERO PARI.</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setM8Vf1(true)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m8Vf1 === true ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    V
                  </button>
                  <button
                    onClick={() => setM8Vf1(false)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m8Vf1 === false ? "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    F
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">V / F · IL 3 È PARI E ANCHE DISPARI.</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setM8Vf2(true)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m8Vf2 === true ? "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    V
                  </button>
                  <button
                    onClick={() => setM8Vf2(false)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m8Vf2 === false ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    F
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">CERCHIA · I NUMERI PARI E I NUMERI DISPARI SONO…</span>
                <div className="flex gap-2">
                  {[
                    { opt: "DISGIUNTI", correct: true },
                    { opt: "UGUALI", correct: false },
                  ].map((btn) => (
                    <button
                      key={btn.opt}
                      onClick={() => setM8DisgiuntiChoice(btn.opt)}
                      className={`px-4 py-2 rounded-xl font-black text-xs border transition cursor-pointer ${
                        m8DisgiuntiChoice === btn.opt
                          ? btn.correct
                            ? "bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-200"
                            : "bg-rose-600 text-white border-rose-700 ring-4 ring-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {btn.opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Module Navigator (Prev / Next) */}
        <div className="flex items-center justify-between pt-4 border-t border-orange-200">
          <button
            onClick={goToPrevModule}
            disabled={currentModIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
              currentModIndex === 0
                ? "text-slate-300 border-slate-100 cursor-not-allowed"
                : "text-slate-700 bg-white border-slate-300 hover:bg-orange-50 cursor-pointer"
            }`}
          >
            <ChevronLeft size={16} /> Scheda Precedente
          </button>

          <span className="text-xs font-black text-slate-400">
            Scheda {currentModIndex + 1} di {INCLUSION_SET_MODULES.length}
          </span>

          <button
            onClick={goToNextModule}
            disabled={currentModIndex === INCLUSION_SET_MODULES.length - 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
              currentModIndex === INCLUSION_SET_MODULES.length - 1
                ? "text-slate-300 border-slate-100 cursor-not-allowed"
                : "text-white bg-dida-orange border-orange-600 hover:bg-orange-600 cursor-pointer shadow-sm"
            }`}
          >
            Prossima Scheda <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* MODALE OBIETTIVI PERSONALIZZATI (PAGINA 9 DEL PDF) */}
      <AnimatePresence>
        {showPeiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2rem] border-2 border-orange-300 p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-xs font-black uppercase text-dida-orange bg-orange-100 px-3 py-1 rounded-full">
                    Guida per il Docente & Educatore (PEI)
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Obiettivi Personalizzati: Insiemi</h3>
                </div>
                <button
                  onClick={() => setShowPeiModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <p className="text-xs font-black text-amber-900 uppercase">MACROOBIETTIVO:</p>
                <p className="text-xs text-slate-700">
                  Raggruppare oggetti della vita quotidiana secondo una caratteristica e riconoscere l'appartenenza a un gruppo (dentro / fuori).
                </p>
              </div>

              {/* Levels Grid */}
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-800 uppercase">Micro-obiettivo: Dire se un elemento è dentro o fuori da un gruppo</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-black text-blue-700 block mb-1">INIZIALE</span>
                    <p className="text-[11px] text-slate-600">Con guida fisica, mette un oggetto dentro o fuori da un cerchio di corda.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-black text-emerald-700 block mb-1">BASE</span>
                    <p className="text-[11px] text-slate-600">Sceglie tra due oggetti quello che va nel gruppo (es. «i frutti»).</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-black text-amber-700 block mb-1">INTERMEDIO</span>
                    <p className="text-[11px] text-slate-600">Divide 4-6 oggetti o immagini in due gruppi con una caratteristica data.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-black text-purple-700 block mb-1">AVANZATO</span>
                    <p className="text-[11px] text-slate-600">Inventa da solo un gruppo e dice chi sta dentro e chi sta fuori.</p>
                  </div>
                </div>
              </div>

              {/* Adattamenti didattici */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 text-xs">
                <p className="font-black text-blue-900 uppercase">Adattamenti Consigliati (D.I. 182/2020):</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>Motricità fine:</strong> pennarelli grossi, pulsanti touch ampi con bordi marcati.</li>
                  <li><strong>Comunicazione:</strong> risposte indicando, con cartellini SÌ/NO o simboli della CAA.</li>
                  <li><strong>Attenzione:</strong> una consegna alla volta, pause brevi, rinforzo positivo immediato.</li>
                  <li><strong>Manipolazione:</strong> cerchi di corda o hula hoop per sperimentare fisicamente l'inclusione.</li>
                </ul>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setShowPeiModal(false)}
                  className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
                >
                  Chiudi Guida
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
