import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, ChevronLeft, ChevronRight,
  BookOpen, Volume2, VolumeX, Hand, Plus, Trash2
} from "lucide-react";

interface Props {
  onBack: () => void;
  subjectName: string;
  topicName: string;
}

const slides = [
  {
    title: "Cos'è una tabella?",
    body: "Una tabella è come uno scaffale ordinato.\nCi aiuta a mettere le informazioni al posto giusto,\ncosì troviamo tutto facilmente!",
    emoji: "🗂️",
  },
  {
    title: "Righe e colonne",
    body: "Le righe vanno da sinistra a destra →\nLe colonne vanno dall'alto in basso ↓\nInsieme formano delle caselle!",
    emoji: "📊",
  },
  {
    title: "Le intestazioni",
    body: "La prima riga è speciale:\nci dice COSA c'è in ogni colonna.\nPer esempio: \"Nome\", \"Età\", \"Colore preferito\".",
    emoji: "🏷️",
  },
  {
    title: "Le celle",
    body: "Ogni casella si chiama CELLA.\nDentro ogni cella c'è un'informazione.\nPer esempio: \"Marco\" oppure \"12 anni\".",
    emoji: "📝",
  },
  {
    title: "A cosa servono?",
    body: "Le tabelle servono per organizzare le cose!\nPer esempio i voti, gli animali preferiti,\no le cose da comprare al supermercato.",
    emoji: "✅",
  },
  {
    title: "Bravo! Ora prova tu!",
    body: "Tocca le caselle della tabella qui sotto\nper vedere cosa contengono.\nÈ facilissimo!",
    emoji: "⭐",
  },
];

/** Simple sample table for the interactive section */
const sampleTable = {
  headers: ["Animale", "Quanti"],
  rows: [
    ["🐶 Cane", "5"],
    ["🐱 Gatto", "3"],
    ["🐰 Coniglio", "2"],
    ["🐟 Pesce", "1"],
  ],
};

export default function TablesLessonInclusion({ onBack, subjectName, topicName }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // Simplified builder state
  const [myHeaders, setMyHeaders] = useState<string[]>(["Nome", "Valore"]);
  const [myRows, setMyRows] = useState<string[][]>([["", ""]]);
  const [editingPos, setEditingPos] = useState<{ type: "header" | "cell"; row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  const addMyRow = () => {
    if (myRows.length >= 8) return;
    setMyRows([...myRows, Array(myHeaders.length).fill("")]);
    if (ttsEnabled) speak("Nuova riga aggiunta!");
  };
  const removeMyRow = (idx: number) => {
    if (myRows.length <= 1) return;
    setMyRows(myRows.filter((_, i) => i !== idx));
  };
  const addMyColumn = () => {
    if (myHeaders.length >= 4) return;
    setMyHeaders([...myHeaders, `Col ${myHeaders.length + 1}`]);
    setMyRows(myRows.map(r => [...r, ""]));
    if (ttsEnabled) speak("Nuova colonna aggiunta!");
  };
  const removeMyColumn = (idx: number) => {
    if (myHeaders.length <= 1) return;
    setMyHeaders(myHeaders.filter((_, i) => i !== idx));
    setMyRows(myRows.map(r => r.filter((_, i) => i !== idx)));
  };
  const startEdit = (type: "header" | "cell", row: number, col: number) => {
    setEditingPos({ type, row, col });
    setEditValue(type === "header" ? myHeaders[col] : myRows[row][col]);
  };
  const confirmEdit = () => {
    if (!editingPos) return;
    if (editingPos.type === "header") {
      const h = [...myHeaders];
      h[editingPos.col] = editValue || `Col ${editingPos.col + 1}`;
      setMyHeaders(h);
    } else {
      const r = myRows.map(row => [...row]);
      r[editingPos.row][editingPos.col] = editValue;
      setMyRows(r);
    }
    setEditingPos(null);
    setEditValue("");
  };

  // Load available voices
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const getBestVoice = useCallback((): SpeechSynthesisVoice | null => {
    const italianVoices = voices.filter(v => v.lang.startsWith("it"));
    if (italianVoices.length === 0) return null;
    const priority = [
      (v: SpeechSynthesisVoice) => /google/i.test(v.name),
      (v: SpeechSynthesisVoice) => /natural/i.test(v.name),
      (v: SpeechSynthesisVoice) => /online/i.test(v.name),
      (v: SpeechSynthesisVoice) => /microsoft.*elsa/i.test(v.name),
      (v: SpeechSynthesisVoice) => /microsoft.*cosimo/i.test(v.name),
      (v: SpeechSynthesisVoice) => /microsoft/i.test(v.name),
    ];
    for (const test of priority) {
      const match = italianVoices.find(test);
      if (match) return match;
    }
    return italianVoices[0];
  }, [voices]);

  const speak = useCallback((text: string) => {
    if (!ttsEnabled) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "it-IT";
    const bestVoice = getBestVoice();
    if (bestVoice) utt.voice = bestVoice;
    utt.rate = 0.9;
    utt.pitch = 1.05;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [ttsEnabled, getBestVoice]);

  useEffect(() => {
    if (ttsEnabled && !showTable) {
      const slide = slides[currentSlide];
      speak(`${slide.title}. ${slide.body}`);
    }
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [currentSlide, ttsEnabled, showTable, speak]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowTable(true);
    }
  };
  const prevSlide = () => {
    if (showTable) {
      setShowTable(false);
    } else if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    if (ttsEnabled) {
      const header = sampleTable.headers[col];
      const value = sampleTable.rows[row][col];
      speak(`${header}: ${value}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl space-y-6 mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dida-orange text-white flex items-center justify-center">
            <BookOpen size={22} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-dida-orange uppercase tracking-widest">Impara · Inclusione</p>
            <p className="text-lg font-bold text-slate-700">Le tabelle</p>
            <p className="text-sm text-slate-500">{subjectName} &gt; {topicName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (ttsEnabled) window.speechSynthesis.cancel();
              setTtsEnabled(!ttsEnabled);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm cursor-pointer ${
              ttsEnabled
                ? "bg-dida-orange text-white shadow-orange-200"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {ttsEnabled ? "Audio ON" : "Audio OFF"}
          </button>
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Indietro
          </button>
        </div>
      </div>

      {/* Carousel or Interactive Table */}
      <AnimatePresence mode="wait">
        {!showTable ? (
          <motion.div
            key={`slide-${currentSlide}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
            className="px-4"
          >
            <div className="rounded-[2rem] border-2 border-dida-orange/20 bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8 md:p-12 shadow-xl text-center space-y-6 min-h-[340px] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Slide progress dots */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === currentSlide ? "bg-dida-orange scale-125" : i < currentSlide ? "bg-dida-orange/40" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-7xl md:text-8xl"
              >
                {slides[currentSlide].emoji}
              </motion.div>

              <h3 className="text-2xl md:text-3xl font-black text-slate-800">
                {slides[currentSlide].title}
              </h3>

              <p className="text-lg md:text-xl text-slate-600 leading-relaxed whitespace-pre-line max-w-lg font-medium">
                {slides[currentSlide].body}
              </p>

              {isSpeaking && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="flex items-center gap-2 text-dida-orange font-bold text-sm"
                >
                  <Volume2 size={18} />
                  Sto leggendo...
                </motion.div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg transition cursor-pointer ${
                  currentSlide === 0
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                    : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                }`}
              >
                <ChevronLeft size={22} />
                Indietro
              </button>

              <span className="text-sm font-bold text-slate-400">
                {currentSlide + 1} / {slides.length}
              </span>

              <button
                onClick={nextSlide}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg bg-dida-orange text-white hover:bg-orange-600 transition shadow-lg shadow-orange-200 cursor-pointer"
              >
                {currentSlide === slides.length - 1 ? "Prova la tabella!" : "Avanti"}
                <ChevronRight size={22} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="table-interactive"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="px-4 space-y-6 max-w-4xl mx-auto w-full"
          >
            {/* Instruction */}
            <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-blue-50 border border-dida-orange/20 p-5 shadow-sm text-center">
              <Hand className="text-dida-orange mx-auto mb-2" size={28} />
              <h3 className="text-xl font-bold text-slate-800 mb-1">Tocca una casella!</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Tocca una casella della tabella per vedere cosa contiene.
              </p>
            </div>

            {/* Simple Interactive Table */}
            <div className="rounded-[2rem] border-2 border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
                🐾 Animali preferiti della classe
              </h3>
              <p className="text-slate-500 text-center text-base mb-5">
                Quanti bambini preferiscono ogni animale?
              </p>

              <div className="overflow-x-auto rounded-xl border-2 border-slate-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {sampleTable.headers.map((header, ci) => (
                        <th
                          key={ci}
                          className={`px-6 py-4 text-center text-lg font-extrabold uppercase tracking-wider bg-dida-orange/10 text-dida-orange border-b-2 border-b-dida-orange/30 ${
                            ci < sampleTable.headers.length - 1 ? "border-r-2 border-r-slate-200" : ""
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleTable.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => {
                          const isSelected = selectedCell?.row === ri && selectedCell?.col === ci;
                          return (
                            <td
                              key={ci}
                              onClick={() => handleCellClick(ri, ci)}
                              className={`px-6 py-4 text-center text-lg font-semibold cursor-pointer transition-all duration-200 border-b-2 ${
                                ci < row.length - 1 ? "border-r-2 border-r-slate-200" : ""
                              } ${
                                isSelected
                                  ? "bg-dida-orange text-white font-bold scale-[1.02] shadow-inner"
                                  : ri % 2 === 0
                                    ? "bg-white text-slate-700 hover:bg-orange-50"
                                    : "bg-slate-50 text-slate-700 hover:bg-orange-50"
                              } border-b-slate-200`}
                            >
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Selected cell info */}
              <AnimatePresence mode="wait">
                {selectedCell && (
                  <motion.div
                    key={`cell-info-${selectedCell.row}-${selectedCell.col}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-5 rounded-2xl border-2 border-dida-orange/20 bg-gradient-to-br from-orange-50 to-white p-6 text-center space-y-3"
                  >
                    <motion.div
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="text-4xl font-black text-dida-orange"
                    >
                      {sampleTable.rows[selectedCell.row][selectedCell.col]}
                    </motion.div>

                    <div className="space-y-1">
                      <p className="text-lg font-bold text-slate-700">
                        <span className="text-dida-orange">{sampleTable.headers[selectedCell.col]}</span>
                        {" "}di riga {selectedCell.row + 1}
                      </p>
                      <p className="text-base text-slate-500">
                        Riga <strong>{selectedCell.row + 1}</strong>, Colonna <strong>{selectedCell.col + 1}</strong>
                      </p>

                      {/* Visual representation for the "Quanti" column */}
                      {selectedCell.col === 1 && (
                        <div className="pt-3">
                          <p className="text-sm font-bold text-slate-400 uppercase mb-2">
                            {sampleTable.rows[selectedCell.row][selectedCell.col]} bambini
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {Array.from({ length: parseInt(sampleTable.rows[selectedCell.row][selectedCell.col]) || 0 }, (_, i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.08 }}
                                className="text-3xl"
                              >
                                🧒
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Simplified Builder */}
            <div className="rounded-[2rem] border-2 border-dida-blue/20 bg-white p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
                🛠️ Crea la tua tabella!
              </h3>
              <p className="text-slate-500 text-center text-base mb-5">
                Tocca le caselle per scrivere. Usa i pulsanti per aggiungere righe e colonne.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-5">
                <button
                  onClick={addMyRow}
                  disabled={myRows.length >= 8}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-base font-bold transition shadow-sm cursor-pointer ${
                    myRows.length >= 8
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-dida-teal text-white hover:bg-[#1f8c82] shadow-teal-200"
                  }`}
                >
                  <Plus size={20} /> Aggiungi riga
                </button>
                <button
                  onClick={addMyColumn}
                  disabled={myHeaders.length >= 4}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-base font-bold transition shadow-sm cursor-pointer ${
                    myHeaders.length >= 4
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-dida-blue text-white hover:bg-blue-700 shadow-blue-200"
                  }`}
                >
                  <Plus size={20} /> Aggiungi colonna
                </button>
              </div>

              {/* Builder Table */}
              <div className="overflow-x-auto rounded-xl border-2 border-dida-blue/20">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {myHeaders.map((header, ci) => {
                        const isEditing = editingPos?.type === "header" && editingPos.col === ci;
                        return (
                          <th
                            key={ci}
                            className={`px-4 py-3.5 text-center text-base font-extrabold uppercase tracking-wider bg-dida-blue/10 text-dida-blue border-b-2 border-b-dida-blue/30 ${
                              ci < myHeaders.length - 1 ? "border-r-2 border-r-slate-200" : ""
                            }`}
                          >
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <input
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                                  className="w-full px-2 py-1.5 border-2 border-dida-blue rounded-xl text-base font-bold text-center focus:outline-none focus:ring-2 focus:ring-dida-blue/30"
                                />
                                <button onClick={confirmEdit} className="p-1.5 text-white bg-green-500 hover:bg-green-600 rounded-xl cursor-pointer text-lg">✓</button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                <span
                                  onClick={() => startEdit("header", 0, ci)}
                                  className="cursor-pointer hover:text-blue-800 transition"
                                >
                                  {header}
                                </span>
                                {myHeaders.length > 1 && (
                                  <button
                                    onClick={() => removeMyColumn(ci)}
                                    className="p-1 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {myRows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => {
                          const isEditing = editingPos?.type === "cell" && editingPos.row === ri && editingPos.col === ci;
                          return (
                            <td
                              key={ci}
                              className={`px-4 py-3.5 text-center text-base border-b-2 border-b-slate-200 ${
                                ci < row.length - 1 ? "border-r-2 border-r-slate-200" : ""
                              } ${ri % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                            >
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    autoFocus
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                                    className="w-full px-2 py-1.5 border-2 border-dida-blue rounded-xl text-base text-center focus:outline-none focus:ring-2 focus:ring-dida-blue/30"
                                  />
                                  <button onClick={confirmEdit} className="p-1.5 text-white bg-green-500 hover:bg-green-600 rounded-xl cursor-pointer text-lg">✓</button>
                                </div>
                              ) : (
                                <span
                                  onClick={() => startEdit("cell", ri, ci)}
                                  className={`block cursor-pointer hover:text-dida-blue transition min-h-[1.8rem] text-base ${
                                    cell ? "text-slate-700 font-semibold" : "text-slate-300 italic"
                                  }`}
                                >
                                  {cell || "Tocca per scrivere..."}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        {/* Delete row button */}
                        <td className="border-b-2 border-b-slate-200 border-l-2 border-l-slate-200 w-12 text-center bg-slate-50/50">
                          {myRows.length > 1 && (
                            <button
                              onClick={() => removeMyRow(ri)}
                              className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Builder stats */}
              <div className="flex flex-wrap justify-center gap-4 mt-5">
                <div className="px-5 py-2.5 rounded-2xl bg-blue-50 border-2 border-blue-100 text-center">
                  <span className="text-xs font-bold text-blue-400 uppercase block">Colonne</span>
                  <span className="text-2xl font-black text-dida-blue">{myHeaders.length}</span>
                </div>
                <div className="px-5 py-2.5 rounded-2xl bg-teal-50 border-2 border-teal-100 text-center">
                  <span className="text-xs font-bold text-teal-400 uppercase block">Righe</span>
                  <span className="text-2xl font-black text-dida-teal">{myRows.length}</span>
                </div>
                <div className="px-5 py-2.5 rounded-2xl bg-orange-50 border-2 border-orange-100 text-center">
                  <span className="text-xs font-bold text-orange-400 uppercase block">Compilate</span>
                  <span className="text-2xl font-black text-dida-orange">
                    {myRows.flat().filter(c => c.trim() !== "").length} / {myRows.length * myHeaders.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Back to slides button */}
            <div className="flex justify-center pb-8">
              <button
                onClick={prevSlide}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm cursor-pointer"
              >
                <ChevronLeft size={22} />
                Torna alla lezione
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
