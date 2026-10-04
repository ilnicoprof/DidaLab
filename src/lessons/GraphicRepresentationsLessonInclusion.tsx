import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, ChevronRight, ChevronLeft, BookOpen, Zap, FileText
} from "lucide-react";
import { useSpeech } from "../hooks/useSpeech";
import TapOrder from "../components/TapOrder";

interface Props {
  key?: string;
  onBack: () => void;
  subjectName: string;
  topicName: string;
  initialSubtopicId?: string;
  initialTab?: "impara" | "allena";
}

// 7 Modules matching Pages 5 to 8 of the Inclusion PDF
const INCLUSION_GRAPH_MODULES = [
  { id: "mod9", subtopicMap: "tables", title: "9. I dati sono ovunque", short: "9. I Dati" },
  { id: "mod10", subtopicMap: "tables", title: "10. La tabella e le stanghette", short: "10. Tabella" },
  { id: "mod11", subtopicMap: "ideogram", title: "11. L'ideogramma", short: "11. Ideogramma" },
  { id: "mod12", subtopicMap: "ortogram", title: "12. Il diagramma a barre", short: "12. Barre" },
  { id: "mod13", subtopicMap: "aerogram", title: "13. L'areogramma a torta", short: "13. Torta" },
  { id: "mod14", subtopicMap: "cartesian-diagram", title: "14. Il diagramma cartesiano", short: "14. Cartesiano" },
  { id: "mod15", subtopicMap: "cartesian-diagram", title: "15. Il grafico al computer", short: "15. Al Computer" },
];

export default function GraphicRepresentationsLessonInclusion({
  onBack,
  subjectName,
  initialSubtopicId,
  initialTab = "impara"
}: Props) {
  // Map initial subtopic to module
  const getInitialModId = () => {
    if (!initialSubtopicId) return "mod9";
    const found = INCLUSION_GRAPH_MODULES.find(m => m.subtopicMap === initialSubtopicId);
    return found ? found.id : "mod9";
  };

  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [activeModuleId, setActiveModuleId] = useState<string>(getInitialModId);
  const [showPeiModal, setShowPeiModal] = useState<boolean>(false);

  // --- TTS (Sintesi Vocale) ---
  const { ttsEnabled, isSpeaking, speak, toggleTts } = useSpeech();

  // --- EXERCISE STATES (Pages 5 to 8) ---
  // Mod 9: Ordina 1-4 & V/F
  const [m9Vf, setM9Vf] = useState<boolean | null>(null);

  // Mod 10: Tabella stanghette & Cerchia frutto più votato
  const [m10Counts, setM10Counts] = useState<Record<string, number | null>>({
    mela: null,
    banana: null,
    pera: null,
  });
  const [m10Winner, setM10Winner] = useState<string | null>(null);

  // Mod 11: Ideogramma pizza (2 pizze = quante persone?) & Cerchia pizza preferita
  const [m11Answer, setM11Answer] = useState<number | null>(null);
  const [m11Winner, setM11Winner] = useState<string | null>(null);

  // Mod 12: Diagramma a Barre (chi beve più latte, chi beve meno, quanti litri famiglia B)
  const [m12Max, setM12Max] = useState<string | null>(null);
  const [m12Min, setM12Min] = useState<string | null>(null);
  const [m12LitresB, setM12LitresB] = useState<number | null>(null);

  // Mod 13: Areogramma (fetta più grande & V/F)
  const [m13Fetta, setM13Fetta] = useState<string | null>(null);
  const [m13Vf, setM13Vf] = useState<boolean | null>(null);

  // Mod 14: Diagramma Cartesiano (settimana 5 cane, linea sale/scende, V/F)
  const [m14Weight5, setM14Weight5] = useState<string | null>(null);
  const [m14Direction, setM14Direction] = useState<string | null>(null);
  const [m14Vf, setM14Vf] = useState<boolean | null>(null);

  // Mod 15: Grafico al computer (Ordina 1-3 & V/F)
  const [m15Vf, setM15Vf] = useState<boolean | null>(null);

  const currentModIndex = INCLUSION_GRAPH_MODULES.findIndex(m => m.id === activeModuleId);

  const goToNextModule = () => {
    if (currentModIndex < INCLUSION_GRAPH_MODULES.length - 1) {
      setActiveModuleId(INCLUSION_GRAPH_MODULES[currentModIndex + 1].id);
    }
  };

  const goToPrevModule = () => {
    if (currentModIndex > 0) {
      setActiveModuleId(INCLUSION_GRAPH_MODULES[currentModIndex - 1].id);
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
              Tabelle e Grafici: Schede Facili e Visuali
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
        {INCLUSION_GRAPH_MODULES.map((mod) => (
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
        {/* MODULO 9: I DATI SONO OVUNQUE                             */}
        {/* ========================================================= */}
        {activeModuleId === "mod9" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600 text-white font-black text-sm uppercase tracking-wider">
                <span>9</span> I dati sono ovunque
              </div>
              <button
                onClick={() => speak("I dati sono numeri e informazioni. Li trovo nel meteo, nelle classifiche, nei videogiochi. Uno: faccio una domanda. Due: raccolgo le risposte. Tre: le scrivo in una tabella. Quattro: poi faccio un grafico. Esempio: qual è lo sport preferito della classe?")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* 4 Colored Blocks: 1 DOMANDA -> 2 DATI -> 3 TABELLA -> 4 GRAFICO */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-blue-600 text-white font-black space-y-1 shadow-sm">
                <span className="text-xl">❓ 1</span>
                <p className="text-xs uppercase">DOMANDA</p>
              </div>
              <div className="p-4 rounded-2xl bg-orange-500 text-white font-black space-y-1 shadow-sm">
                <span className="text-xl">📝 2</span>
                <p className="text-xs uppercase">DATI</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-600 text-white font-black space-y-1 shadow-sm">
                <span className="text-xl">📊 3</span>
                <p className="text-xs uppercase">TABELLA</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-600 text-white font-black space-y-1 shadow-sm">
                <span className="text-xl">📈 4</span>
                <p className="text-xs uppercase">GRAFICO</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-orange-50/60 border border-orange-200 space-y-2 font-extrabold text-slate-800 text-sm md:text-base uppercase leading-relaxed">
              <p>I DATI SONO NUMERI E INFORMAZIONI. LI TROVO NEL METEO, NELLE CLASSIFICHE, NEI VIDEOGIOCHI.</p>
              <p>FACCIO UNA DOMANDA ➔ RACCOLGO LE RISPOSTE ➔ LE SCRIVO IN UNA TABELLA ➔ POI FACCIO UN GRAFICO.</p>
              <div className="p-3 bg-white rounded-2xl border border-orange-200 text-xs text-orange-950 font-bold normal-case">
                <strong>Esempio:</strong> «Qual è lo sport preferito della classe?»
              </div>
            </div>

            {/* Esercizi: ORDINA & V/F */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-orange-600 text-white font-black text-xs uppercase">
                ORDINA · METTI IN ORDINE: SCRIVI 1, 2, 3, 4
              </div>

              <TapOrder
                steps={["FACCIO UNA DOMANDA", "RACCOLGO LE RISPOSTE", "SCRIVO LA TABELLA", "FACCIO IL GRAFICO"]}
                display={[2, 0, 3, 1]}
                accent="bg-orange-500"
              />

              {/* V/F */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                <span className="font-black text-xs uppercase text-slate-800">
                  V / F · LA CLASSIFICA DEL CAMPIONATO È FATTA DI DATI.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setM9Vf(true)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m9Vf === true ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    V
                  </button>
                  <button
                    onClick={() => setM9Vf(false)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m9Vf === false ? "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    F
                  </button>
                </div>
              </div>
              {m9Vf !== null && (
                <p className={`text-xs font-bold ${m9Vf === true ? "text-emerald-700" : "text-rose-700"}`}>
                  {m9Vf === true ? "✓ Esatto! Punti, vittorie e gol sono tutti dati statistici!" : "✗ Rifletti: una classifica contiene punti, numeri e partite!"}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULO 10: LA TABELLA E LE STANGHETTE                     */}
        {/* ========================================================= */}
        {activeModuleId === "mod10" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-wider">
                <span>10</span> La tabella
              </div>
              <button
                onClick={() => speak("Faccio una domanda alla classe. Per ogni risposta segno una stanghetta. Poi conto le stanghette. Scrivo il numero nella tabella. Esempio: calcio 4 stanghette uguale 4 risposte.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Mini Table Example */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center">
                <table className="border-collapse bg-white rounded-xl shadow-sm text-center text-xs font-bold w-full">
                  <thead>
                    <tr className="bg-emerald-100 text-emerald-900 border-b border-emerald-200">
                      <th className="p-2">Sport</th>
                      <th className="p-2">Stanghette</th>
                      <th className="p-2">N°</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-2 font-black">CALCIO</td>
                      <td className="p-2 font-mono text-base text-emerald-600">||||</td>
                      <td className="p-2 font-black text-blue-700">4</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-black">NUOTO</td>
                      <td className="p-2 font-mono text-base text-emerald-600">||</td>
                      <td className="p-2 font-black text-blue-700">2</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="md:col-span-2 space-y-3 font-extrabold text-slate-800 text-sm md:text-base leading-relaxed uppercase">
                <p>FACCIO UNA DOMANDA ALLA CLASSE. PER OGNI RISPOSTA SEGNO UNA <strong>STANGHETTA (|)</strong>.</p>
                <p>POI CONTO LE STANGHETTE. <strong>SCRIVO IL NUMERO NELLA TABELLA</strong>.</p>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold normal-case">
                  <strong>Esempio:</strong> CALCIO |||| = 4 risposte.
                </div>
              </div>
            </div>

            {/* Esercizio TABELLA: CONTA LE STANGHETTE */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs uppercase">
                TABELLA · CONTA LE STANGHETTE E SELEZIONA IL NUMERO
              </div>

              <div className="space-y-3">
                {[
                  { fruit: "🍎 MELA", marks: "|||", options: [2, 3, 4], correct: 3 },
                  { fruit: "🍌 BANANA", marks: "|||||", options: [4, 5, 6], correct: 5 },
                  { fruit: "🍐 PERA", marks: "||", options: [1, 2, 3], correct: 2 },
                ].map((row) => {
                  const key = row.fruit.slice(2).trim().toLowerCase();
                  const selectedVal = m10Counts[key];

                  return (
                    <div key={row.fruit} className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <span className="font-extrabold text-sm text-slate-800 w-28 uppercase">{row.fruit}</span>
                        <span className="font-mono text-xl font-bold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                          {row.marks}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">Scegli:</span>
                        {row.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setM10Counts(prev => ({ ...prev, [key]: opt }))}
                            className={`w-10 h-10 rounded-xl font-black text-sm border transition cursor-pointer ${
                              selectedVal === opt
                                ? opt === row.correct
                                  ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200"
                                  : "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200"
                                : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cerchia il frutto con più voti */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                <span className="font-black text-xs uppercase text-slate-800">
                  CERCHIA · IL FRUTTO CON PIÙ VOTI È…
                </span>
                <div className="flex gap-2">
                  {[
                    { name: "MELA", correct: false },
                    { name: "BANANA", correct: true },
                    { name: "PERA", correct: false },
                  ].map((btn) => (
                    <button
                      key={btn.name}
                      onClick={() => setM10Winner(btn.name)}
                      className={`px-4 py-2 rounded-xl font-black text-xs border transition cursor-pointer ${
                        m10Winner === btn.name
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
        {/* MODULO 11: L'IDEOGRAMMA                                   */}
        {/* ========================================================= */}
        {activeModuleId === "mod11" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600 text-white font-black text-sm uppercase tracking-wider">
                <span>11</span> L'Ideogramma
              </div>
              <button
                onClick={() => speak("Qui un disegno vale un numero. Guardo la scritta in alto: una pizza uguale 2 persone. Questo grafico si chiama ideogramma. Esempio margherita tre pizze: conto due, quattro, sei, sono sei persone.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-orange-100 border border-orange-300 text-center">
              <span className="font-mono font-black text-base text-orange-950">
                LEGENDA: 🍕 1 PIZZA = 2 PERSONE
              </span>
            </div>

            {/* Visual Example: Margherita */}
            <div className="p-5 rounded-3xl bg-purple-50 border border-purple-200 space-y-3">
              <p className="font-extrabold text-slate-800 text-sm md:text-base uppercase leading-relaxed">
                QUI UN DISEGNO VALE UN NUMERO. GUARDO LA SCRITTA IN ALTO: <strong>1 PIZZA = 2 PERSONE</strong>.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-black text-sm text-slate-800">MARGHERITA:</span>
                <span className="text-2xl">🍕 🍕 🍕</span>
                <span className="font-mono font-black text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl">
                  CONTO 2, 4, 6 ➔ SONO 6 PERSONE
                </span>
              </div>
            </div>

            {/* Esercizio: Prosciutto */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-black text-xs uppercase text-slate-800 block">
                    PROSCIUTTO: 2 PIZZE (🍕 🍕). QUANTE PERSONE?
                  </span>
                  <span className="text-[11px] text-slate-500">Ricorda: ogni pizza vale 2 persone (2 + 2)</span>
                </div>
                <div className="flex gap-2">
                  {[2, 4, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setM11Answer(num)}
                      className={`w-12 h-10 rounded-xl font-black text-sm border transition cursor-pointer ${
                        m11Answer === num
                          ? num === 4
                            ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200"
                            : "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cerchia pizza che piace di più */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">
                  CERCHIA · LA PIZZA CHE PIACE DI PIÙ È…
                </span>
                <div className="flex gap-2">
                  {[
                    { name: "MARGHERITA", correct: true },
                    { name: "PROSCIUTTO", correct: false },
                  ].map((btn) => (
                    <button
                      key={btn.name}
                      onClick={() => setM11Winner(btn.name)}
                      className={`px-4 py-2 rounded-xl font-black text-xs border transition cursor-pointer ${
                        m11Winner === btn.name
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
        {/* MODULO 12: IL DIAGRAMMA A BARRE                           */}
        {/* ========================================================= */}
        {activeModuleId === "mod12" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white font-black text-sm uppercase tracking-wider">
                <span>12</span> Il Diagramma a Barre
              </div>
              <button
                onClick={() => speak("Ogni numero è un rettangolo in piedi. Il numero è grande? Il rettangolo è alto. Si chiama diagramma a barre. Esempio 4 famiglie: A, B, C, D. Quanto latte bevono in un mese? La famiglia C beve 32 litri.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Visual Bar Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="p-4 rounded-3xl bg-blue-50 border border-blue-200 flex flex-col items-center">
                <svg viewBox="0 0 240 160" className="w-56 h-40">
                  <line x1="20" y1="130" x2="220" y2="130" stroke="#94A3B8" strokeWidth="2" />
                  {/* A: 18L */}
                  <rect x="35" y="70" width="30" height="60" fill="#2563EB" rx="3" />
                  <text x="50" y="62" textAnchor="middle" className="text-[10px] font-bold fill-blue-900">18 L</text>
                  <text x="50" y="145" textAnchor="middle" className="text-[11px] font-black fill-slate-700">A</text>

                  {/* B: 20L */}
                  <rect x="80" y="60" width="30" height="70" fill="#06B6D4" rx="3" />
                  <text x="95" y="52" textAnchor="middle" className="text-[10px] font-bold fill-cyan-900">20 L</text>
                  <text x="95" y="145" textAnchor="middle" className="text-[11px] font-black fill-slate-700">B</text>

                  {/* C: 32L */}
                  <rect x="125" y="25" width="30" height="105" fill="#EA580C" rx="3" />
                  <text x="140" y="17" textAnchor="middle" className="text-[10px] font-black fill-orange-700">32 L</text>
                  <text x="140" y="145" textAnchor="middle" className="text-[11px] font-black fill-slate-700">C</text>

                  {/* D: 10L */}
                  <rect x="170" y="95" width="30" height="35" fill="#8B5CF6" rx="3" />
                  <text x="185" y="87" textAnchor="middle" className="text-[10px] font-bold fill-purple-900">10 L</text>
                  <text x="185" y="145" textAnchor="middle" className="text-[11px] font-black fill-slate-700">D</text>
                </svg>
              </div>

              <div className="space-y-3 font-extrabold text-slate-800 text-sm md:text-base leading-relaxed uppercase">
                <p>OGNI NUMERO È UN <strong>RETTANGOLO IN PIEDI</strong>.</p>
                <p>IL NUMERO È GRANDE? ➔ IL RETTANGOLO È <strong>ALTO</strong>!</p>
                <p className="normal-case text-xs text-slate-600 font-semibold">
                  Esempio: 4 famiglie (A, B, C, D) e litri di latte. La famiglia C ha la colonna più alta (32 L)!
                </p>
              </div>
            </div>

            {/* Esercizi */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">CERCHIA · CHI BEVE PIÙ LATTE? (RETTANGOLO PIÙ ALTO)</span>
                <div className="flex gap-2">
                  {["A", "B", "C", "D"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setM12Max(f)}
                      className={`w-10 h-10 rounded-xl font-black text-sm border transition cursor-pointer ${
                        m12Max === f
                          ? f === "C"
                            ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200"
                            : "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">CERCHIA · CHI BEVE MENO LATTE? (RETTANGOLO PIÙ BASSO)</span>
                <div className="flex gap-2">
                  {["A", "B", "C", "D"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setM12Min(f)}
                      className={`w-10 h-10 rounded-xl font-black text-sm border transition cursor-pointer ${
                        m12Min === f
                          ? f === "D"
                            ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200"
                            : "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">QUANTI LITRI BEVE LA FAMIGLIA B?</span>
                <div className="flex gap-2">
                  {[10, 20, 32].map((l) => (
                    <button
                      key={l}
                      onClick={() => setM12LitresB(l)}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                        m12LitresB === l
                          ? l === 20
                            ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200"
                            : "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {l} Litri
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULO 13: L'AREOGRAMMA (TORTA)                            */}
        {/* ========================================================= */}
        {activeModuleId === "mod13" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-wider">
                <span>13</span> L'Areogramma
              </div>
              <button
                onClick={() => speak("È un grafico a forma di torta. La torta intera è tutta la classe. Ogni fetta è un gruppo. La fetta più grande è il gruppo più grande. Si chiama areogramma. Esempio metà classe gioca a calcio: la fetta blu è metà torta.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Visual Pie Graphic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col items-center">
                <svg viewBox="0 0 160 160" className="w-40 h-40">
                  {/* Calcio: half circle (50%) */}
                  <path d="M 80 80 L 80 10 A 70 70 0 0 1 80 150 Z" fill="#2563EB" />
                  {/* Basket: quarter (25%) */}
                  <path d="M 80 80 L 80 150 A 70 70 0 0 1 10 80 Z" fill="#EA580C" />
                  {/* Nuoto: quarter (25%) */}
                  <path d="M 80 80 L 10 80 A 70 70 0 0 1 80 10 Z" fill="#10B981" />
                </svg>
                <div className="flex gap-3 mt-3 text-xs font-black">
                  <span className="text-blue-700">■ CALCIO</span>
                  <span className="text-orange-700">■ BASKET</span>
                  <span className="text-emerald-700">■ NUOTO</span>
                </div>
              </div>

              <div className="space-y-3 font-extrabold text-slate-800 text-sm md:text-base leading-relaxed uppercase">
                <p>È UN GRAFICO A FORMA DI TORTA.</p>
                <p>LA <strong>TORTA INTERA</strong> È TUTTA LA CLASSE. OGNI FETTA È UN GRUPPO.</p>
                <p>LA <strong>FETTA PIÙ GRANDE</strong> È IL GRUPPO PIÙ GRANDE!</p>
              </div>
            </div>

            {/* Esercizi */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">CERCHIA · LA FETTA PIÙ GRANDE È…</span>
                <div className="flex gap-2">
                  {["CALCIO", "BASKET", "NUOTO"].map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setM13Fetta(sport)}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                        m13Fetta === sport
                          ? sport === "CALCIO"
                            ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200"
                            : "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">V / F · LA TORTA INTERA È TUTTA LA CLASSE.</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setM13Vf(true)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m13Vf === true ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    V
                  </button>
                  <button
                    onClick={() => setM13Vf(false)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m13Vf === false ? "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    F
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULO 14: IL DIAGRAMMA CARTESIANO                        */}
        {/* ========================================================= */}
        {activeModuleId === "mod14" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-600 text-white font-black text-sm uppercase tracking-wider">
                <span>14</span> Il Diagramma Cartesiano
              </div>
              <button
                onClick={() => speak("Questo grafico mostra come cambia un numero, settimana dopo settimana. Sotto ci sono le settimane. A sinistra ci sono i chilogrammi. La linea sale? Il numero cresce! Si chiama diagramma cartesiano. Esempio Giulia pesa il suo cane ogni settimana.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Visual Cartesian Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col items-center">
                <svg viewBox="0 0 240 160" className="w-56 h-40">
                  <line x1="30" y1="130" x2="220" y2="130" stroke="#94A3B8" strokeWidth="2" />
                  <line x1="30" y1="20" x2="30" y2="130" stroke="#94A3B8" strokeWidth="2" />
                  <text x="25" y="130" textAnchor="end" className="text-[9px] fill-slate-500">1</text>
                  <text x="25" y="95" textAnchor="end" className="text-[9px] fill-slate-500">3</text>
                  <text x="25" y="60" textAnchor="end" className="text-[9px] fill-slate-500">5</text>
                  <text x="25" y="25" textAnchor="end" className="text-[9px] fill-slate-500 font-bold">7 kg</text>

                  {/* Weeks */}
                  <text x="60" y="145" textAnchor="middle" className="text-[9px] fill-slate-500">1ª</text>
                  <text x="90" y="145" textAnchor="middle" className="text-[9px] fill-slate-500">2ª</text>
                  <text x="120" y="145" textAnchor="middle" className="text-[9px] fill-slate-500">3ª</text>
                  <text x="150" y="145" textAnchor="middle" className="text-[9px] fill-slate-500">4ª</text>
                  <text x="180" y="145" textAnchor="middle" className="text-[9px] font-bold fill-amber-900">5ª</text>
                  <text x="210" y="145" textAnchor="middle" className="text-[9px] fill-slate-500">6ª</text>

                  {/* Line going up */}
                  <polyline
                    fill="none"
                    stroke="#EA580C"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points="60,95 90,80 120,80 150,60 180,25 210,25"
                  />
                  <circle cx="60" cy="95" r="4" fill="#2563EB" />
                  <circle cx="180" cy="25" r="5" fill="#16A34A" />
                </svg>
                <span className="text-[11px] font-black text-amber-900 mt-1">La linea SALE ➔ Il cane cresce!</span>
              </div>

              <div className="space-y-3 font-extrabold text-slate-800 text-sm md:text-base leading-relaxed uppercase">
                <p>QUESTO GRAFICO MOSTRA COME CAMBIA UN NUMERO, <strong>SETTIMANA DOPO SETTIMANA</strong>.</p>
                <p>LA LINEA SALE? ➔ IL NUMERO <strong>CRESCE</strong>!</p>
                <div className="p-3 bg-white rounded-2xl border border-amber-200 text-xs text-amber-950 font-semibold normal-case">
                  <strong>Esempio:</strong> Giulia pesa il suo cane: nella 1ª settimana pesa 3 kg, nella 5ª settimana pesa 7 kg!
                </div>
              </div>
            </div>

            {/* Esercizi */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">CERCHIA · NELLA 5ª SETTIMANA IL CANE PESA…</span>
                <div className="flex gap-2">
                  {["5 KG", "7 KG"].map((w) => (
                    <button
                      key={w}
                      onClick={() => setM14Weight5(w)}
                      className={`px-4 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                        m14Weight5 === w
                          ? w === "7 KG"
                            ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200"
                            : "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">CERCHIA · LA LINEA…</span>
                <div className="flex gap-2">
                  {["SALE", "SCENDE"].map((dir) => (
                    <button
                      key={dir}
                      onClick={() => setM14Direction(dir)}
                      className={`px-4 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                        m14Direction === dir
                          ? dir === "SALE"
                            ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200"
                            : "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-black text-xs uppercase text-slate-800">V / F · IL CANE STA CRESCENDO.</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setM14Vf(true)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m14Vf === true ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    V
                  </button>
                  <button
                    onClick={() => setM14Vf(false)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m14Vf === false ? "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    F
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULO 15: IL GRAFICO AL COMPUTER                         */}
        {/* ========================================================= */}
        {activeModuleId === "mod15" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-orange-200 pb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 text-white font-black text-sm uppercase tracking-wider">
                <span>15</span> Il Grafico al Computer
              </div>
              <button
                onClick={() => speak("Il computer può fare il grafico per me. Uso il foglio di calcolo. Uno: scrivo la tabella. Due: la coloro con il mouse. Tre: clicco Inserisci, Grafico. Esempio con la stessa tabella posso fare una torta o delle barre.")}
                className="text-slate-400 hover:text-amber-600 cursor-pointer"
                title="Leggi ad alta voce"
              >
                <Volume2 size={20} />
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-200 space-y-3 font-extrabold text-slate-800 text-sm md:text-base leading-relaxed uppercase">
              <p>IL COMPUTER PUÒ FARE IL GRAFICO PER ME! USO IL <strong>FOGLIO DI CALCOLO</strong>.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-white rounded-xl border border-indigo-200">
                  <span className="font-black text-indigo-700 block">1.</span>
                  SCRIVO LA TABELLA
                </div>
                <div className="p-3 bg-white rounded-xl border border-indigo-200">
                  <span className="font-black text-indigo-700 block">2.</span>
                  LA COLORO CON IL MOUSE
                </div>
                <div className="p-3 bg-white rounded-xl border border-indigo-200">
                  <span className="font-black text-indigo-700 block">3.</span>
                  CLICCO INSERISCI ➔ GRAFICO
                </div>
              </div>
              <p className="normal-case text-xs text-indigo-950 font-semibold pt-1">
                Con la stessa tabella posso fare una torta, delle barre o un cartesiano in pochi secondi!
              </p>
            </div>

            {/* Esercizi */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-white font-black text-xs uppercase">
                ORDINA · I 3 PASSAGGI AL COMPUTER (1, 2, 3)
              </div>

              <TapOrder
                steps={["SCRIVO LA TABELLA", "LA COLORO CON IL MOUSE", "CLICCO INSERISCI ➔ GRAFICO"]}
                display={[1, 2, 0]}
                accent="bg-indigo-600"
              />
              {/* V/F */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="font-black text-xs uppercase text-slate-800">
                  V / F · IL FOGLIO DI CALCOLO PUÒ FARE I GRAFICI.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setM15Vf(true)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m15Vf === true ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    V
                  </button>
                  <button
                    onClick={() => setM15Vf(false)}
                    className={`w-12 py-1.5 rounded-xl font-black text-xs border transition cursor-pointer ${
                      m15Vf === false ? "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200" : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    F
                  </button>
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
            Scheda {currentModIndex + 1} di {INCLUSION_GRAPH_MODULES.length}
          </span>

          <button
            onClick={goToNextModule}
            disabled={currentModIndex === INCLUSION_GRAPH_MODULES.length - 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
              currentModIndex === INCLUSION_GRAPH_MODULES.length - 1
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
                  <h3 className="text-lg font-black text-slate-900 mt-1">Obiettivi Personalizzati: Tabelle e Grafici</h3>
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
                  Raggruppare oggetti della vita quotidiana secondo una caratteristica e leggere una semplice tabella o un grafico a barre per rispondere a una domanda.
                </p>
              </div>

              {/* Micro-obiettivi */}
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <p className="font-bold text-slate-800 uppercase">Micro-obiettivo: Leggere una tabella semplice</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-black text-blue-700 block mb-1">INIZIALE</span>
                      <p className="text-[11px] text-slate-600">Accompagnato, indica una casella della tabella nominata dall'adulto.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-black text-emerald-700 block mb-1">BASE</span>
                      <p className="text-[11px] text-slate-600">Trova in tabella un dato cercando una sola riga (es. «quanti amano il calcio?»).</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-black text-amber-700 block mb-1">INTERMEDIO</span>
                      <p className="text-[11px] text-slate-600">Legge un dato incrociando riga e colonna con il dito.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-black text-purple-700 block mb-1">AVANZATO</span>
                      <p className="text-[11px] text-slate-600">Completa da solo una tabella con dati raccolti in classe.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-slate-800 uppercase">Micro-obiettivo: Trovare la barra più alta in un grafico</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-black text-blue-700 block mb-1">INIZIALE</span>
                      <p className="text-[11px] text-slate-600">Con guida, tocca la barra più alta tra due barre molto diverse.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-black text-emerald-700 block mb-1">BASE</span>
                      <p className="text-[11px] text-slate-600">Sceglie tra due barre la più alta e dice il nome.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-black text-amber-700 block mb-1">INTERMEDIO</span>
                      <p className="text-[11px] text-slate-600">Trova la barra più alta e la più bassa in un grafico con 3-5 barre.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-black text-purple-700 block mb-1">AVANZATO</span>
                      <p className="text-[11px] text-slate-600">Costruisce con i mattoncini o quadretti un grafico a barre dei dati della classe.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adattamenti */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1 text-xs">
                <p className="font-black text-blue-900 uppercase">Adattamenti Consigliati (D.I. 182/2020):</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>Motricità fine:</strong> pennarelli grossi, cartellini da toccare al posto della scrittura.</li>
                  <li><strong>Comunicazione:</strong> risposte indicando o con simboli della CAA.</li>
                  <li><strong>Vista:</strong> immagini ingrandite, colori a forte contrasto.</li>
                  <li><strong>Manipolazione:</strong> mattoncini impilati per visualizzare concretamente le altezze delle barre.</li>
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
