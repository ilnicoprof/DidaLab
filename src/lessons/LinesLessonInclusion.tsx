import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Volume2, VolumeX, Sparkles, ChevronRight, ChevronLeft, Award, RotateCcw,
  BookOpen, Zap, Check, X, Train, Scissors
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
  { id: "mod1", title: "1. Le Pieghe & Le Posizioni", short: "1. Posizioni nel Piano" },
  { id: "mod2", title: "2. Rette Perpendicolari", short: "2. Angoli Retti (90°)" },
  { id: "mod3", title: "3. Distanza, Ombre & Asse", short: "3. La Strada più Corta" },
  { id: "mod4", title: "4. I Binari Paralleli", short: "4. Non si toccano mai" },
  { id: "mod5", title: "5. Gli 8 Angoli della Trasversale", short: "5. Solo due misure!" },
];

// Sottoargomento scelto nell'indice → scheda da aprire
const SUBTOPIC_TO_MODULE: Record<string, string> = {
  "lines-positions-plane": "mod1",
  "perpendicular-lines": "mod2",
  "distance-point-line-segment-bisector": "mod3",
  "parallel-lines": "mod4",
  "transversal-lines": "mod5",
};

export default function LinesLessonInclusion({
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

  // Stati interattivi
  const [foldedPaper, setFoldedPaper] = useState<boolean>(false);
  const [sliderAngle, setSliderAngle] = useState<number>(50);

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
                Modalità Inclusiva · Geometria Facile
              </span>
              <span className="text-xs font-bold text-slate-400">
                {subjectName} · {topicName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Le Rette nel Piano Facilitate
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

          {/* Module 1: Le Pieghe & Le Posizioni */}
          {activeModuleId === "mod1" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                      Esperienza Pratica · Origami
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Cosa c'entra un origami con la geometria?
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() =>
                        speak(
                          "Piegare un foglio di carta produce sempre una linea dritta: una retta! Due rette sullo stesso foglio possono essere incidenti, parallele o coincidenti."
                        )
                      }
                      className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <p className="text-base text-slate-700 leading-relaxed font-medium">
                  In giapponese <strong>origami</strong> significa "piegare la carta". Quando apri un foglio piegato, vedi tante linee dritte: le <strong>pieghe sono rette</strong>!
                </p>

                {/* 3 Possibilità Visive */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-orange-50/70 border-2 border-orange-200 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-xl mb-3 shadow-xs">
                      ✕
                    </div>
                    <h3 className="font-black text-slate-900 text-lg">INCIDENTI</h3>
                    <p className="text-xs font-bold text-orange-700 mt-1">Hanno UN SOLO punto in comune</p>
                    <p className="text-xs text-slate-600 mt-2">Come i nastri stradali che si incrociano a X.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/70 border-2 border-blue-200 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl mb-3 shadow-xs">
                      ═
                    </div>
                    <h3 className="font-black text-slate-900 text-lg">PARALLELE</h3>
                    <p className="text-xs font-bold text-blue-700 mt-1">NESSUN punto in comune (r // s)</p>
                    <p className="text-xs text-slate-600 mt-2">Come le strisce pedonali o i binari del treno.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl mb-3 shadow-xs">
                      ≡
                    </div>
                    <h3 className="font-black text-slate-900 text-lg">COINCIDENTI</h3>
                    <p className="text-xs font-bold text-emerald-700 mt-1">TUTTI i punti in comune (r ≡ s)</p>
                    <p className="text-xs text-slate-600 mt-2">Sono esattamente la stessa retta sovrapposta.</p>
                  </div>
                </div>

                {/* Simulatore di Piega del Foglio */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-3">
                  <p className="text-sm font-bold text-slate-700">Simula la piega del foglio:</p>
                  <button
                    onClick={() => setFoldedPaper(!foldedPaper)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center gap-2 hover:bg-blue-700 transition cursor-pointer shadow-xs"
                  >
                    <Scissors size={16} />
                    {foldedPaper ? "Riapri il foglio piegato" : "Piega il foglio in due"}
                  </button>

                  <div className="w-64 h-36 bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl relative overflow-hidden flex items-center justify-center transition-all duration-500">
                    {foldedPaper ? (
                      <div className="w-full h-full flex">
                        <div className="w-1/2 h-full bg-amber-100 border-r-2 border-red-500 flex items-center justify-center text-xs font-black text-red-600">
                          Piega (Retta r)
                        </div>
                        <div className="w-1/2 h-full bg-amber-200 opacity-60 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          Lembo piegato
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-xs font-bold text-slate-500">
                        Foglio steso piano
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 2: Rette Perpendicolari */}
          {activeModuleId === "mod2" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-orange-600 tracking-wider">
                      Angolo Retto · Simbolo ⊥
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Rette Perpendicolari: 4 Angoli da 90°
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() =>
                        speak(
                          "Due rette sono perpendicolari quando si incrociano dividendo il piano in quattro angoli retti, tutti esattamente di 90 gradi. Si scrive r perpendicolare a s con il simbolo di T rovesciata."
                        )
                      }
                      className="p-2 rounded-xl bg-orange-50 text-dida-orange hover:bg-orange-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <p className="text-base text-slate-700 leading-relaxed font-medium">
                  Le rette perpendicolari sono un caso speciale di rette incidenti: quando si incontrano, formano <strong>quattro angoli retti di 90°</strong> perfetti, come la croce di una farmacia o gli spigoli di una finestra!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Visual Cross */}
                  <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200 flex flex-col items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-48 h-48">
                      {/* Grid */}
                      <line x1="20" y1="100" x2="180" y2="100" stroke="#0070B8" strokeWidth="4" />
                      <line x1="100" y1="20" x2="100" y2="180" stroke="#EF7D00" strokeWidth="4" />
                      {/* 90 deg square */}
                      <rect x="100" y="70" width="30" height="30" fill="#EF7D00" fillOpacity="0.2" stroke="#EF7D00" strokeWidth="2" />
                      <circle cx="115" cy="85" r="3" fill="#EF7D00" />
                      <text x="110" y="60" fontSize="12" fontWeight="bold" fill="#EF7D00">90°</text>
                      <text x="70" y="60" fontSize="12" fontWeight="bold" fill="#0070B8">90°</text>
                      <text x="70" y="125" fontSize="12" fontWeight="bold" fill="#0070B8">90°</text>
                      <text x="110" y="125" fontSize="12" fontWeight="bold" fill="#0070B8">90°</text>
                      <text x="185" y="105" fontSize="14" fontWeight="bold" fill="#0070B8">r</text>
                      <text x="105" y="20" fontSize="14" fontWeight="bold" fill="#EF7D00">s</text>
                    </svg>
                    <span className="text-sm font-black text-slate-800 mt-2 font-mono">
                      r ⊥ s (r è perpendicolare a s)
                    </span>
                  </div>

                  {/* Regola d'oro */}
                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 flex flex-col justify-center space-y-3">
                    <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <Sparkles size={18} className="text-dida-orange" />
                      Come si traccia con riga e squadra:
                    </h3>
                    <ol className="text-xs text-slate-700 font-medium space-y-2 list-decimal list-inside">
                      <li>Appoggia un lato della squadra sulla retta <strong>r</strong>.</li>
                      <li>Fai scorrere la squadra fino a toccare il punto desiderato.</li>
                      <li>Traccia la linea lungo l'altro cateto: l'angolo sarà esattamente di 90°!</li>
                      <li>Il punto d'incontro si chiama <strong>Piede della perpendicolare</strong>.</li>
                    </ol>
                    <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs font-bold text-blue-900">
                      💡 <strong>Da ricordare:</strong> Per un punto passa UNA e UNA SOLA perpendicolare a una retta data.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 3: Distanza, Ombre & Asse */}
          {activeModuleId === "mod3" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">
                      Distanza & Proiezioni
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      La Strada più Breve & L'Asse
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() =>
                        speak(
                          "La distanza tra un punto e una retta è sempre il segmento perpendicolare, perché è il tragitto più breve possibile. L'asse di un segmento è la retta che passa per il punto medio ad angolo retto."
                        )
                      }
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Distanza di un punto */}
                  <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                    <h3 className="font-black text-slate-900 text-base">
                      🐶 Il Cagnolino e la Ciotola
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Se un cagnolino in punto P vuole raggiungere il muro (la retta r) nel minor tempo possibile, deve andare <strong>dritto a 90°</strong> (perpendicolare). Qualsiasi percorso obliquo è più lungo!
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900">
                      <strong>Distanza:</strong> lunghezza del segmento perpendicolare condotto dal punto alla retta.
                    </div>
                  </div>

                  {/* L'Asse di un segmento */}
                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                    <h3 className="font-black text-slate-900 text-base">
                      ✂️ L'Asse con una Piega
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Disegna un segmento AB. Piega il foglio facendo combaciare l'estremo A con l'estremo B: la piega è <strong>l'asse</strong>!
                    </p>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside font-medium">
                      <li>Passa per il <strong>punto medio M</strong> (lo taglia a metà).</li>
                      <li>È <strong>perpendicolare</strong> al segmento.</li>
                      <li>Tutti i suoi punti sono <strong>equidistanti</strong> da A e da B!</li>
                    </ul>
                  </div>
                </div>

                {/* Proiezione / Ombra */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col md:flex-row items-center gap-4">
                  <div className="text-3xl">☀️</div>
                  <div className="text-xs text-slate-700 font-medium leading-relaxed">
                    <strong>La Proiezione (L'Ombra col sole a picco):</strong><br />
                    • Se un segmento è <strong>parallelo</strong> al suolo, l'ombra è <strong>uguale</strong> al segmento.<br />
                    • Se un segmento è <strong>obliquo</strong>, l'ombra è <strong>più corta</strong>.<br />
                    • Se un segmento è <strong>in piedi a 90°</strong> (perpendicolare), la sua ombra è solo <strong>un punto</strong>!
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 4: I Binari Paralleli */}
          {activeModuleId === "mod4" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                      Simbolo // · Sempre alla Stessa Distanza
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Rette Parallele: Come i Binari del Treno
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() =>
                        speak(
                          "Due rette parallele nello stesso piano non si incontrano mai e mantengono sempre la stessa identica distanza tra loro, proprio come le rotaie di un treno."
                        )
                      }
                      className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <p className="text-base text-slate-700 leading-relaxed font-medium">
                  Due rette parallele mantengono sempre la stessa distanza reciproca. Se i binari si avvicinassero anche di un solo millimetro, il treno deraglierebbe!
                </p>

                <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200 flex flex-col items-center">
                  <div className="flex items-center gap-2 text-dida-blue font-black mb-2">
                    <Train size={24} />
                    <span>Binari del treno</span>
                  </div>
                  <svg viewBox="0 0 400 90" className="w-full max-w-md h-24">
                    {/* Rails */}
                    <line x1="20" y1="25" x2="380" y2="25" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                    <line x1="20" y1="65" x2="380" y2="65" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                    {/* Sleepers */}
                    {[50, 90, 130, 170, 210, 250, 290, 330, 370].map((x) => (
                      <line key={x} x1={x} y1="15" x2={x} y2="75" stroke="#92400E" strokeWidth="7" strokeLinecap="round" />
                    ))}
                    <text x="390" y="30" fontSize="12" fontWeight="bold" fill="#0070B8">r</text>
                    <text x="390" y="70" fontSize="12" fontWeight="bold" fill="#0070B8">s</text>
                  </svg>
                  <span className="text-xs font-mono font-bold text-slate-600 mt-1">
                    Distanza costante in ogni punto: AH = BK = CL
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                  👑 <strong>Postulato di Euclide:</strong> Per un punto esterno a una retta passa <strong>una e una sola</strong> retta parallela a quella data!
                </div>
              </div>
            </motion.div>
          )}

          {/* Module 5: La Trasversale & Gli 8 Angoli */}
          {activeModuleId === "mod5" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-purple-600 tracking-wider">
                      Tre Rette, Otto Angoli · La Magia
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Rette Parallele Tagliate da una Trasversale
                    </h2>
                  </div>
                  {ttsEnabled && (
                    <button
                      onClick={() =>
                        speak(
                          "Quando una retta trasversale taglia due rette parallele forma otto angoli. Ma ci sono solo due ampiezze diverse! Tutti gli angoli acuti sono uguali tra loro, e la somma tra un acuto e un ottuso fa sempre centottanta gradi."
                        )
                      }
                      className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition cursor-pointer"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>

                <p className="text-base text-slate-700 leading-relaxed font-medium">
                  Il segreto più bello della geometria: anche se ci sono <strong>8 angoli</strong>, ci sono solo <strong>DUE MISURE</strong>!
                </p>

                {/* Slider Interattivo per vedere i 2 angoli */}
                <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 flex flex-col items-center gap-4">
                  <div className="flex items-center justify-between w-full max-w-sm">
                    <span className="text-xs font-bold text-slate-700">Modifica l'angolo acuto:</span>
                    <span className="text-sm font-black text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200 font-mono">
                      {sliderAngle}° e {180 - sliderAngle}°
                    </span>
                  </div>

                  <input
                    type="range"
                    min={25}
                    max={80}
                    value={sliderAngle}
                    onChange={(e) => setSliderAngle(Number(e.target.value))}
                    className="w-full max-w-sm accent-purple-600 cursor-pointer"
                  />

                  <div className="grid grid-cols-2 gap-4 w-full max-w-md text-center pt-2">
                    <div className="p-3 bg-blue-100 rounded-xl border border-blue-300">
                      <span className="text-xs font-bold text-blue-800 block">4 Angoli Acuti Congruenti</span>
                      <span className="text-xl font-black text-blue-900">{sliderAngle}°</span>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-xl border border-orange-300">
                      <span className="text-xs font-bold text-orange-800 block">4 Angoli Ottusi Congruenti</span>
                      <span className="text-xl font-black text-orange-900">{180 - sliderAngle}°</span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-600">
                    💡 Somma: {sliderAngle}° + {180 - sliderAngle}° = <strong>180° (Supplementari!)</strong>
                  </p>
                </div>

                {/* Mini Guida Nomi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-black text-slate-800 block">Alterni Interni / Esterni:</span>
                    <span className="text-slate-600 font-medium">Stanno da parti opposte della trasversale (a forma di Z). Sono sempre <strong>uguali (congruenti)</strong>.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-black text-slate-800 block">Coniugati Interni / Esterni:</span>
                    <span className="text-slate-600 font-medium">Stanno dalla stessa parte della trasversale. Sono <strong>supplementari (somma = 180°)</strong>.</span>
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
              Modulo Precedente
            </button>

            {currentModIndex < INCLUSION_MODULES.length - 1 ? (
              <button
                onClick={goToNextModule}
                className="px-5 py-2.5 rounded-xl font-black text-sm bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Modulo Successivo
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setActiveTab("allena")}
                className="px-5 py-2.5 rounded-xl font-black text-sm bg-dida-orange text-white hover:bg-orange-600 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Vai alla Palestra Allena
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
                  Mettiti alla Prova sulle Rette!
                </h2>
              </div>
              <button
                onClick={() => {
                  setQ1(null);
                  setQ2(null);
                  setQ3(null);
                  setQ4(null);
                }}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Ricomincia quiz"
              >
                <RotateCcw size={16} />
                Ricomincia
              </button>
            </div>

            {/* Domanda 1 */}
            <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200 space-y-3">
              <span className="text-xs font-black text-dida-orange">Domanda 1</span>
              <p className="font-bold text-slate-900 text-sm">
                Due rette che non si incontrano mai e hanno sempre la stessa distanza si chiamano:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "A", text: "Incidenti" },
                  { id: "B", text: "Parallele", correct: true },
                  { id: "C", text: "Perpendicolari" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setQ1(opt.id)}
                    className={`p-3 rounded-xl font-bold text-xs text-left border transition cursor-pointer flex items-center justify-between ${
                      q1 === opt.id
                        ? opt.correct
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                          : "bg-rose-500 text-white border-rose-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-orange-300"
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
                Quanti angoli retti da 90° si formano quando due rette sono perpendicolari (r ⊥ s)?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "A", text: "1 angolo retto" },
                  { id: "B", text: "2 angoli retti" },
                  { id: "C", text: "4 angoli retti", correct: true },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setQ2(opt.id)}
                    className={`p-3 rounded-xl font-bold text-xs text-left border transition cursor-pointer flex items-center justify-between ${
                      q2 === opt.id
                        ? opt.correct
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                          : "bg-rose-500 text-white border-rose-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
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
                Qual è la distanza tra un punto P e una retta r?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "A", text: "Qualsiasi linea obliqua" },
                  { id: "B", text: "Il segmento perpendicolare (la via più breve)", correct: true },
                  { id: "C", text: "Il doppio del raggio" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setQ3(opt.id)}
                    className={`p-3 rounded-xl font-bold text-xs text-left border transition cursor-pointer flex items-center justify-between ${
                      q3 === opt.id
                        ? opt.correct
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                          : "bg-rose-500 text-white border-rose-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
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
                Due rette parallele tagliate da una trasversale formano un angolo acuto di 50°. Quanto misurano gli angoli ottusi?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "A", text: "130° (180° - 50°)", correct: true },
                  { id: "B", text: "90°" },
                  { id: "C", text: "50°" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setQ4(opt.id)}
                    className={`p-3 rounded-xl font-bold text-xs text-left border transition cursor-pointer flex items-center justify-between ${
                      q4 === opt.id
                        ? opt.correct
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                          : "bg-rose-500 text-white border-rose-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-purple-300"
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center space-y-2 shadow-sm"
              >
                <div className="inline-block p-3 rounded-full bg-white/20 backdrop-blur-xs">
                  <Award size={28} />
                </div>
                <h3 className="text-xl font-black">Ottimo Lavoro con le Rette!</h3>
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
