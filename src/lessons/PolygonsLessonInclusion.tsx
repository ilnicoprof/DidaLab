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
  { id: "mod1", title: "1. Che cos'è un Poligono?", short: "1. Cos'è" },
  { id: "mod2", title: "2. Convesso o Concavo?", short: "2. Convesso o Concavo" },
  { id: "mod3", title: "3. Il Perimetro con lo Spago", short: "3. Il Perimetro" },
  { id: "mod4", title: "4. I Nomi delle Figure", short: "4. Come si Chiamano" },
  { id: "mod5", title: "5. L'Esagono delle Api", short: "5. Le Api & Esagoni" },
];

// Sottoargomento scelto nell'indice → scheda da aprire
const SUBTOPIC_TO_MODULE: Record<string, string> = {
  "polygon-characteristics": "mod1",
  "polygon-perimeter": "mod3",
  "regular-polygons-properties": "mod5",
};

export default function PolygonsLessonInclusion({
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

  // Stati Interattivi
  const [isConvexShape, setIsConvexShape] = useState<boolean>(true);
  const [selectedPolyName, setSelectedPolyName] = useState<number>(3);

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
              I Poligoni Facilitati
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
                    mod1: "Un poligono è una figura chiusa con lati tutti dritti. Non può avere lati curvi e non può essere aperto. I segmenti si chiamano lati e i punti in cui si uniscono si chiamano vertici!",
                    mod2: "Un poligono è convesso se è bello gonfio e nessun lato rientra all'interno. È concavo se ha una punta rientrante verso l'interno!",
                    mod3: "Il perimetro è il giro completo intorno al poligono. Si calcola sommando le lunghezze di tutti i suoi lati, come uno spago che recinta una stanza!",
                    mod4: "I poligoni prendono il nome dal numero di lati o di angoli: triangolo con tre lati, quadrilatero con quattro lati, pentagono con cinque lati, esagono con sei lati!",
                    mod5: "Le api costruiscono le cellette del favo a forma di esagono regolare perché gli esagoni si incastrano alla perfezione a trecentosessanta gradi senza lasciare nessun buco vuoto!",
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
                  <h4 className="font-bold text-blue-900 text-lg">Le 3 Regole per Essere un Poligono:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>✅ <strong>Tutto dritto:</strong> i lati devono essere tutti segmenti retti (niente curve, il cerchio NON è un poligono!).</li>
                    <li>✅ <strong>Tutto chiuso:</strong> il recinto deve essere completamente chiuso senza aperture.</li>
                    <li>✅ <strong>Nessun incrocio:</strong> i lati non devono attraversarsi a X.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* MODULO 2 */}
            {activeModuleId === "mod2" && (
              <div className="space-y-6">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setIsConvexShape(true)}
                    className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                      isConvexShape ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    🟢 Poligono Convesso (Senza Rientranze)
                  </button>
                  <button
                    onClick={() => setIsConvexShape(false)}
                    className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition cursor-pointer ${
                      !isConvexShape ? "bg-dida-orange text-white border-dida-orange" : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    🟠 Poligono Concavo (Con Punta Rientrante)
                  </button>
                </div>

                <div className="h-44 bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-center p-4">
                  {isConvexShape ? (
                    <div className="text-center space-y-2">
                      <div className="w-28 h-28 mx-auto bg-emerald-100 border-2 border-emerald-400 rounded-xl flex items-center justify-center font-bold text-emerald-800 text-xs shadow-xs">
                        Tutto gonfio verso l'esterno
                      </div>
                      <span className="text-xs font-bold text-emerald-700">CONVESSO: nessun lato rientra dentro</span>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-28 h-28 mx-auto bg-orange-100 border-2 border-orange-400 [clip-path:polygon(0%_0%,100%_0%,60%_50%,100%_100%,0%_100%)] flex items-center justify-center font-bold text-orange-900 text-xs shadow-xs">
                        Rientra
                      </div>
                      <span className="text-xs font-bold text-orange-700">CONCAVO: ha una punta che rientra nell'interno</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODULO 3 */}
            {activeModuleId === "mod3" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 text-slate-700 space-y-3">
                  <h4 className="font-bold text-blue-900 text-lg">Il Perimetro: il giro completo</h4>
                  <p className="text-sm">
                    Immagina di camminare lungo tutto il bordo di un campo da calcio o di una piscina:
                    sommi tutti i lati e ottieni il <strong>perimetro</strong>!
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-blue-200 font-mono text-center font-bold text-dida-blue">
                    Perimetro = Lato 1 + Lato 2 + Lato 3 + Lato 4...
                  </div>
                </div>
              </div>
            )}

            {/* MODULO 4 */}
            {activeModuleId === "mod4" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {[
                    { sides: 3, name: "Triangolo" },
                    { sides: 4, name: "Quadrilatero" },
                    { sides: 5, name: "Pentagono" },
                    { sides: 6, name: "Esagono" },
                  ].map((p) => (
                    <button
                      key={p.sides}
                      onClick={() => setSelectedPolyName(p.sides)}
                      className={`p-4 rounded-2xl border transition cursor-pointer ${
                        selectedPolyName === p.sides
                          ? "bg-dida-orange text-white border-dida-orange shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-2xl font-black block font-mono">{p.sides}</span>
                      <span className="text-xs font-bold">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MODULO 5 */}
            {activeModuleId === "mod5" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 text-slate-700 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">🐝</span>
                    <h4 className="font-bold text-amber-950 text-lg">Perché le api costruiscono esagoni?</h4>
                  </div>
                  <p className="text-sm leading-relaxed">
                    Gli esagoni regolari hanno angoli di <strong>120°</strong>. Tre esagoni insieme fanno:
                    <br />
                    <strong>120° + 120° + 120° = 360°</strong> (un cerchio perfetto!).
                    In questo modo le api possono affiancare le cellette senza sprecare neanche una goccia di cera e senza lasciare buchi vuoti!
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
                4 Piccole Sfide sui Poligoni
              </h2>
            </div>

            {/* Domanda 1 */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                1. Il cerchio è un poligono?
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
                  🟢 NO, perché è curvo e non ha lati dritti
                </button>
                <button
                  onClick={() => setQ1("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q1 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 SÌ, ha un solo lato
                </button>
              </div>
              {q1 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Bravissimo! I poligoni devono avere solo lati a segmenti dritti!
                </p>
              )}
            </div>

            {/* Domanda 2 */}
            <div className="p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                2. Quante diagonali ha un triangolo?
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
                  🟢 ZERO diagonali (i 3 vertici sono tutti vicini)
                </button>
                <button
                  onClick={() => setQ2("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q2 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 3 diagonali
                </button>
              </div>
              {q2 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Esatto! Il triangolo non ha vertici opposti, quindi ha zero diagonali!
                </p>
              )}
            </div>

            {/* Domanda 3 */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                3. Come si calcola il perimetro di un poligono?
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
                  🟢 Si sommano le misure di tutti i lati
                </button>
                <button
                  onClick={() => setQ3("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q3 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 Si moltiplicano i lati tra loro
                </button>
              </div>
              {q3 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Super! Il perimetro è la somma di tutti i lati del contorno!
                </p>
              )}
            </div>

            {/* Domanda 4 */}
            <div className="p-5 rounded-3xl bg-orange-50/70 border-2 border-orange-200 space-y-3">
              <p className="font-bold text-slate-800 text-base">
                4. Un poligono con 5 lati si chiama:
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
                  🟢 Pentagono
                </button>
                <button
                  onClick={() => setQ4("wrong")}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition cursor-pointer ${
                    q4 === "wrong"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  🔴 Esagono
                </button>
              </div>
              {q4 === "correct" && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl">
                  Fantastico! Penta significa 5, come il Pentagono!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
