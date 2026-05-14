import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Lightbulb, BookOpen, Plus, Trash2, Pencil, Check, X, Table
} from "lucide-react";

interface Props {
  onBack: () => void;
  subjectName: string;
  topicName: string;
}

/**
 * Sample data tables used for the interactive explorer.
 */
const sampleTables = [
  {
    id: "animals",
    title: "Animali preferiti della classe 1ªB",
    description: "Indagine sugli animali preferiti degli alunni",
    headers: ["Animale", "Numero di alunni"],
    rows: [
      ["Cane", "12"],
      ["Gatto", "8"],
      ["Coniglio", "4"],
      ["Pesce", "3"],
      ["Tartaruga", "2"],
    ],
  },
  {
    id: "sports",
    title: "Sport praticati nella scuola",
    description: "Sport praticati dagli alunni delle tre classi",
    headers: ["Sport", "1ª Media", "2ª Media", "3ª Media"],
    rows: [
      ["Calcio", "15", "12", "10"],
      ["Pallavolo", "8", "10", "14"],
      ["Nuoto", "6", "7", "5"],
      ["Tennis", "3", "4", "6"],
      ["Danza", "5", "6", "8"],
    ],
  },
  {
    id: "temperatures",
    title: "Temperature medie mensili (°C)",
    description: "Temperature a Roma nei primi sei mesi dell'anno",
    headers: ["Mese", "Temp. Min", "Temp. Max", "Temp. Media"],
    rows: [
      ["Gennaio", "3", "12", "7"],
      ["Febbraio", "4", "13", "8"],
      ["Marzo", "6", "16", "11"],
      ["Aprile", "9", "19", "14"],
      ["Maggio", "13", "24", "18"],
      ["Giugno", "17", "28", "22"],
    ],
  },
];

export default function TablesLesson({ onBack, subjectName, topicName }: Props) {
  const [activeTab, setActiveTab] = useState<"explorer" | "builder">("explorer");
  const [selectedTableId, setSelectedTableId] = useState(sampleTables[0].id);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [highlightRow, setHighlightRow] = useState<number | null>(null);
  const [highlightCol, setHighlightCol] = useState<number | null>(null);

  // Builder state
  const [builderHeaders, setBuilderHeaders] = useState<string[]>(["Colonna 1", "Colonna 2"]);
  const [builderRows, setBuilderRows] = useState<string[][]>([["", ""]]);
  const [editingHeader, setEditingHeader] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [tempValue, setTempValue] = useState("");

  const selectedTable = sampleTables.find((t) => t.id === selectedTableId)!;

  // --- Builder helpers ---
  const addColumn = () => {
    setBuilderHeaders([...builderHeaders, `Colonna ${builderHeaders.length + 1}`]);
    setBuilderRows(builderRows.map((row) => [...row, ""]));
  };
  const removeColumn = (idx: number) => {
    if (builderHeaders.length <= 1) return;
    setBuilderHeaders(builderHeaders.filter((_, i) => i !== idx));
    setBuilderRows(builderRows.map((row) => row.filter((_, i) => i !== idx)));
  };
  const addRow = () => {
    setBuilderRows([...builderRows, Array(builderHeaders.length).fill("")]);
  };
  const removeRow = (idx: number) => {
    if (builderRows.length <= 1) return;
    setBuilderRows(builderRows.filter((_, i) => i !== idx));
  };
  const startEditHeader = (idx: number) => {
    setEditingHeader(idx);
    setTempValue(builderHeaders[idx]);
  };
  const confirmEditHeader = () => {
    if (editingHeader === null) return;
    const newHeaders = [...builderHeaders];
    newHeaders[editingHeader] = tempValue || `Colonna ${editingHeader + 1}`;
    setBuilderHeaders(newHeaders);
    setEditingHeader(null);
    setTempValue("");
  };
  const startEditCell = (row: number, col: number) => {
    setEditingCell({ row, col });
    setTempValue(builderRows[row][col]);
  };
  const confirmEditCell = () => {
    if (!editingCell) return;
    const newRows = builderRows.map((r) => [...r]);
    newRows[editingCell.row][editingCell.col] = tempValue;
    setBuilderRows(newRows);
    setEditingCell(null);
    setTempValue("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-6xl space-y-8 mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <BookOpen className="text-dida-blue" size={28} />
          <div className="text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Impara</p>
            <p className="text-lg font-bold text-slate-700">Le tabelle</p>
            <p className="text-sm text-slate-500">{subjectName} &gt; {topicName}</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Torna indietro
        </button>
      </div>

      {/* Intro */}
      <div className="px-4">
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-orange-50 border border-slate-100 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-dida-orange shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Cosa sono le tabelle?</h3>
              <p className="text-slate-600 leading-relaxed">
                Una <strong>tabella</strong> è uno strumento che organizza le informazioni in <strong>righe</strong> e <strong>colonne</strong>.
                Le righe vanno da sinistra a destra, le colonne dall'alto in basso.
                La prima riga contiene le <strong>intestazioni</strong>, che ci dicono cosa rappresenta ogni colonna.
                Esplora le tabelle qui sotto e prova a costruirne una tua!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="px-4">
        <div className="flex gap-2 bg-slate-100 rounded-2xl p-1.5 w-fit">
          <button
            onClick={() => setActiveTab("explorer")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "explorer"
                ? "bg-white text-dida-blue shadow-md"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            📊 Esplora tabelle
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "builder"
                ? "bg-white text-dida-blue shadow-md"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🛠️ Costruisci la tua
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "explorer" && (
          <motion.div
            key="explorer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 px-4"
          >
            {/* Table Selector */}
            <div className="flex flex-wrap gap-3">
              {sampleTables.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTableId(t.id);
                    setSelectedCell(null);
                    setHighlightRow(null);
                    setHighlightCol(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    selectedTableId === t.id
                      ? "bg-dida-blue text-white shadow-md shadow-blue-200"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>

            {/* Interactive Table */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedTable.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedTable.description}</p>
              </div>

              <p className="text-sm text-dida-blue font-semibold">
                💡 Clicca su una cella per evidenziarla. Passa il mouse su una riga o colonna per evidenziarla.
              </p>

              <div className="overflow-x-auto rounded-xl border-2 border-slate-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {selectedTable.headers.map((header, ci) => (
                        <th
                          key={ci}
                          onMouseEnter={() => setHighlightCol(ci)}
                          onMouseLeave={() => setHighlightCol(null)}
                          className={`px-5 py-3.5 text-left text-sm font-extrabold uppercase tracking-wider border-b-2 transition-colors duration-200 ${
                            ci < selectedTable.headers.length - 1 ? "border-r border-r-slate-200" : ""
                          } ${
                            highlightCol === ci
                              ? "bg-blue-100 text-dida-blue border-b-dida-blue"
                              : "bg-slate-100 text-slate-600 border-b-slate-300"
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTable.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        onMouseEnter={() => setHighlightRow(ri)}
                        onMouseLeave={() => setHighlightRow(null)}
                      >
                        {row.map((cell, ci) => {
                          const isSelected = selectedCell?.row === ri && selectedCell?.col === ci;
                          const isHighlighted = highlightRow === ri || highlightCol === ci;
                          return (
                            <td
                              key={ci}
                              onClick={() => setSelectedCell({ row: ri, col: ci })}
                              className={`px-5 py-3.5 border-b text-sm font-medium cursor-pointer transition-all duration-200 ${
                                ci < row.length - 1 ? "border-r border-r-slate-200" : ""
                              } ${
                                isSelected
                                  ? "bg-dida-blue text-white font-bold ring-2 ring-dida-blue ring-inset"
                                  : isHighlighted
                                    ? "bg-blue-50 text-slate-800"
                                    : ri % 2 === 0
                                      ? "bg-white text-slate-700"
                                      : "bg-slate-50/70 text-slate-700"
                              } ${ci === 0 ? "font-semibold" : ""} border-b-slate-200 hover:bg-blue-50`}
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
                    key={`cell-${selectedCell.row}-${selectedCell.col}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-xl bg-gradient-to-r from-blue-50 to-slate-50 border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dida-blue text-white text-xs font-bold">
                        Riga {selectedCell.row + 1}, Colonna {selectedCell.col + 1}
                      </span>
                      <span className="text-slate-500 text-sm">
                        <strong className="text-slate-800">{selectedTable.headers[selectedCell.col]}</strong>
                        {" "}di{" "}
                        <strong className="text-slate-800">{selectedTable.rows[selectedCell.row][0]}</strong>
                        {" "}={" "}
                        <strong className="text-dida-blue text-lg">{selectedTable.rows[selectedCell.row][selectedCell.col]}</strong>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Table stats */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Righe</span>
                  <span className="block text-lg font-black text-slate-800">{selectedTable.rows.length}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Colonne</span>
                  <span className="block text-lg font-black text-slate-800">{selectedTable.headers.length}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Celle totali</span>
                  <span className="block text-lg font-black text-slate-800">{selectedTable.rows.length * selectedTable.headers.length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "builder" && (
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 px-4"
          >
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Table className="text-dida-blue" size={22} />
                    Costruisci la tua tabella
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Clicca sulle intestazioni o celle per modificarle.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addColumn}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dida-blue text-white text-sm font-bold hover:bg-blue-700 transition cursor-pointer shadow-sm"
                  >
                    <Plus size={14} /> Colonna
                  </button>
                  <button
                    onClick={addRow}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dida-teal text-white text-sm font-bold hover:bg-[#1f8c82] transition cursor-pointer shadow-sm"
                  >
                    <Plus size={14} /> Riga
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border-2 border-slate-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {builderHeaders.map((header, ci) => (
                        <th key={ci} className={`relative px-4 py-3 bg-slate-100 border-b-2 border-b-slate-300 ${ci < builderHeaders.length - 1 ? "border-r border-r-slate-200" : ""}`}>
                          {editingHeader === ci ? (
                            <div className="flex items-center gap-1">
                              <input
                                autoFocus
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && confirmEditHeader()}
                                className="w-full px-2 py-1 border border-dida-blue rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-dida-blue/30"
                              />
                              <button onClick={confirmEditHeader} className="p-1 text-green-600 hover:bg-green-50 rounded-lg cursor-pointer">
                                <Check size={14} />
                              </button>
                              <button onClick={() => setEditingHeader(null)} className="p-1 text-red-400 hover:bg-red-50 rounded-lg cursor-pointer">
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <span
                                onClick={() => startEditHeader(ci)}
                                className="text-sm font-extrabold uppercase tracking-wider text-slate-600 cursor-pointer hover:text-dida-blue transition flex items-center gap-1"
                              >
                                {header}
                                <Pencil size={11} className="opacity-0 group-hover:opacity-100" />
                              </span>
                              {builderHeaders.length > 1 && (
                                <button
                                  onClick={() => removeColumn(ci)}
                                  className="p-1 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                      <th className="w-10 bg-slate-100 border-b-2 border-b-slate-300 border-l border-l-slate-200" />
                    </tr>
                  </thead>
                  <tbody>
                    {builderRows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => {
                          const isEditing = editingCell?.row === ri && editingCell?.col === ci;
                          return (
                            <td key={ci} className={`border-b border-b-slate-200 px-4 py-3 ${ci < row.length - 1 ? "border-r border-r-slate-200" : ""}`}>
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    autoFocus
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && confirmEditCell()}
                                    className="w-full px-2 py-1 border border-dida-blue rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dida-blue/30"
                                  />
                                  <button onClick={confirmEditCell} className="p-1 text-green-600 hover:bg-green-50 rounded-lg cursor-pointer">
                                    <Check size={14} />
                                  </button>
                                  <button onClick={() => setEditingCell(null)} className="p-1 text-red-400 hover:bg-red-50 rounded-lg cursor-pointer">
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() => startEditCell(ri, ci)}
                                  className={`block text-sm cursor-pointer hover:text-dida-blue transition min-h-[1.5rem] ${
                                    cell ? "text-slate-700 font-medium" : "text-slate-300 italic"
                                  }`}
                                >
                                  {cell || "Clicca per scrivere..."}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="border-b border-b-slate-200 border-l border-l-slate-200 w-10 text-center">
                          {builderRows.length > 1 && (
                            <button
                              onClick={() => removeRow(ri)}
                              className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Builder stats */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100">
                  <span className="text-xs font-bold text-blue-400 uppercase">Colonne</span>
                  <span className="block text-lg font-black text-dida-blue">{builderHeaders.length}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-teal-50 border border-teal-100">
                  <span className="text-xs font-bold text-teal-400 uppercase">Righe</span>
                  <span className="block text-lg font-black text-dida-teal">{builderRows.length}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-100">
                  <span className="text-xs font-bold text-orange-400 uppercase">Celle compilate</span>
                  <span className="block text-lg font-black text-dida-orange">
                    {builderRows.flat().filter((c) => c.trim() !== "").length} / {builderRows.length * builderHeaders.length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Concepts */}
      <div className="px-4 pb-12">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-lg">
          <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Lightbulb className="text-dida-orange" size={20} />
            Concetti chiave
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Cos'è una tabella",
                desc: "Una tabella è uno schema formato da righe (orizzontali) e colonne (verticali) che organizza dati in modo chiaro e ordinato.",
              },
              {
                title: "Le intestazioni",
                desc: "La prima riga della tabella contiene le intestazioni: ci dicono cosa rappresenta ogni colonna (es. \"Nome\", \"Età\", \"Città\").",
              },
              {
                title: "Le celle",
                desc: "Ogni incrocio tra una riga e una colonna si chiama cella. Ogni cella contiene un singolo dato o valore.",
              },
              {
                title: "A cosa servono",
                desc: "Le tabelle ci aiutano a raccogliere, organizzare e confrontare informazioni in modo veloce e preciso. Sono usate in statistica, scienze e nella vita quotidiana.",
              },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <h5 className="font-bold text-dida-blue mb-1">{c.title}</h5>
                <p className="text-slate-600 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
