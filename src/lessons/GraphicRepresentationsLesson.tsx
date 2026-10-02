import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, BookOpen, Zap, CheckCircle2, XCircle, Sparkles,
  BarChart3, PieChart, LineChart, Table as TableIcon, Smile,
  RotateCcw, Info, Award, HelpCircle, ChevronRight,
  Plus, Trash2, Pencil, Check, X, LayoutGrid
} from "lucide-react";

interface Props {
  key?: string;
  onBack: () => void;
  subjectName: string;
  topicName: string;
  initialSubtopicId?: string;
  initialTab?: "impara" | "allena";
}

const GRAPH_SUBTOPICS = [
  { id: "tables", title: "Tabelle & Frequenza", desc: "Righe, colonne, celle e la costruzione interattiva della tabella" },
  { id: "ideogram", title: "L'Ideogramma", desc: "Legenda, icone a tema e calcolo delle quantità" },
  { id: "ortogram", title: "Diagramma a Colonne", desc: "Confronto immediato delle grandezze con le altezze" },
  { id: "aerogram", title: "Grafico a Torta", desc: "La totalità del 100% ripartita in spicchi proporzionali" },
  { id: "cartesian-diagram", title: "Diagramma Cartesiano", desc: "Monitorare l'andamento di una misura nel corso del tempo" },
];

// Spicchi di un areogramma calcolati dai dati: ogni settore è proporzionale al valore
// (si parte dall'alto e si procede in senso orario)
const pieSlices = (values: number[], cx: number, cy: number, r: number) => {
  const total = values.reduce((acc, v) => acc + v, 0);
  const point = (frac: number, radius: number) => {
    const angle = frac * 2 * Math.PI;
    return [cx + radius * Math.sin(angle), cy - radius * Math.cos(angle)];
  };
  let start = 0;
  return values.map((value) => {
    const frac = value / total;
    const end = start + frac;
    const [x1, y1] = point(start, r);
    const [x2, y2] = point(end, r);
    const [lx, ly] = point(start + frac / 2, r * 0.6);
    const largeArc = frac > 0.5 ? 1 : 0;
    const path = frac >= 1
      ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`
      : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    start = end;
    return { path, labelX: lx, labelY: ly, percent: Math.round(frac * 100) };
  });
};

const PET_PIE = [
  { label: "Cani", value: 40, color: "#2563EB" },
  { label: "Gatti", value: 30, color: "#EA580C" },
  { label: "Pesci", value: 20, color: "#10B981" },
  { label: "Uccelli", value: 10, color: "#F59E0B" },
];

export default function GraphicRepresentationsLesson({
  onBack,
  subjectName,
  topicName,
  initialSubtopicId,
  initialTab = "impara",
}: Props) {
  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>(
    initialSubtopicId && GRAPH_SUBTOPICS.some(s => s.id === initialSubtopicId)
      ? initialSubtopicId
      : "tables"
  );

  // --- SUBTOPIC 1: TABELLE STATES (EXPLORER & BUILDER) ---
  const [tableSubTab, setTableSubTab] = useState<"explore" | "builder">("explore");
  
  // Sample tables for structural exploration (Righe, Colonne, Celle)
  const sampleTables = [
    {
      id: "animals",
      title: "🐾 Animali da compagnia della classe",
      description: "Indagine sugli animali che vivono a casa con gli allievi di 1ªB",
      headers: ["Animale", "Numero di alunni"],
      rows: [
        ["Cane", "12"],
        ["Gatto", "9"],
        ["Coniglio", "4"],
        ["Tartaruga", "3"],
        ["Pesce rosso", "2"],
      ],
    },
    {
      id: "sports",
      title: "🏅 Sport pomeridiani a scuola",
      description: "Studenti iscritti ai tornei pomeridiani suddivisi per classe",
      headers: ["Sport", "Classe 1ªA", "Classe 1ªB"],
      rows: [
        ["Calcio a 5", "14", "12"],
        ["Pallavolo", "8", "10"],
        ["Nuoto", "6", "7"],
        ["Basket", "5", "6"],
      ],
    },
    {
      id: "meteo",
      title: "☀️ Rilevazione meteo settimanale",
      description: "Condizioni del tempo e temperatura registrate a mezzogiorno",
      headers: ["Giorno", "Condizione", "Temperatura (°C)"],
      rows: [
        ["Lunedì", "Soleggiato", "18"],
        ["Martedì", "Poco nuvoloso", "16"],
        ["Mercoledì", "Pioggia", "13"],
        ["Giovedì", "Coperto", "15"],
        ["Venerdì", "Soleggiato", "19"],
      ],
    },
  ];

  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [highlightRow, setHighlightRow] = useState<number | null>(null);
  const [highlightCol, setHighlightCol] = useState<number | null>(null);

  // Table Builder states
  const [builderHeaders, setBuilderHeaders] = useState<string[]>(["Materia", "Ore settimanali", "Aula"]);
  const [builderRows, setBuilderRows] = useState<string[][]>([
    ["Matematica", "4", "Aula 12"],
    ["Scienze", "2", "Laboratorio"],
    ["Arte", "2", "Atelier"],
  ]);
  const [editingHeader, setEditingHeader] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  // Builder actions
  const addColumn = () => {
    setBuilderHeaders(prev => [...prev, `Colonna ${prev.length + 1}`]);
    setBuilderRows(prev => prev.map(row => [...row, ""]));
  };

  const removeColumn = (ci: number) => {
    if (builderHeaders.length <= 1) return;
    setBuilderHeaders(prev => prev.filter((_, i) => i !== ci));
    setBuilderRows(prev => prev.map(row => row.filter((_, i) => i !== ci)));
  };

  const addRow = () => {
    setBuilderRows(prev => [...prev, Array(builderHeaders.length).fill("")]);
  };

  const removeRow = (ri: number) => {
    if (builderRows.length <= 1) return;
    setBuilderRows(prev => prev.filter((_, i) => i !== ri));
  };

  const startEditHeader = (ci: number) => {
    setEditingHeader(ci);
    setTempValue(builderHeaders[ci]);
  };

  const confirmEditHeader = () => {
    if (editingHeader === null) return;
    setBuilderHeaders(prev => {
      const copy = [...prev];
      copy[editingHeader] = tempValue.trim() || `Colonna ${editingHeader + 1}`;
      return copy;
    });
    setEditingHeader(null);
    setTempValue("");
  };

  const startEditCell = (ri: number, ci: number) => {
    setEditingCell({ row: ri, col: ci });
    setTempValue(builderRows[ri][ci]);
  };

  const confirmEditCell = () => {
    if (!editingCell) return;
    setBuilderRows(prev => {
      const copy = prev.map(r => [...r]);
      copy[editingCell.row][editingCell.col] = tempValue;
      return copy;
    });
    setEditingCell(null);
    setTempValue("");
  };

  // --- INTERACTIVE LAB (MULTI-GRAFICO) STATES ---
  const [labDataset, setLabDataset] = useState<"libri" | "sport" | "merenda">("libri");
  const [labGraphicType, setLabGraphicType] = useState<"table" | "ideogram" | "bar" | "pie" | "cartesian">("ideogram");
  const [ideogramUnit, setIdeogramUnit] = useState<number>(4);

  // Fresh datasets suited for 1st-year middle school students
  const datasets = {
    libri: {
      title: "Libri presi in prestito dalla biblioteca scolastica per genere",
      unitLabel: "volumi",
      icon: "📚",
      data: [
        { label: "Avventura", value: 24, iconCount: 6, color: "#3B82F6" },
        { label: "Fumetti & Manga", value: 32, iconCount: 8, color: "#F97316" },
        { label: "Fantasy", value: 16, iconCount: 4, color: "#8B5CF6" },
        { label: "Gialli & Mistero", value: 8, iconCount: 2, color: "#10B981" },
      ],
    },
    sport: {
      title: "Attività sportive praticate nel pomeriggio dalla classe",
      unitLabel: "studenti",
      icon: "🏅",
      data: [
        { label: "Calcio", value: 18, iconCount: 4.5, color: "#2563EB" },
        { label: "Nuoto", value: 14, iconCount: 3.5, color: "#06B6D4" },
        { label: "Pallavolo", value: 12, iconCount: 3, color: "#EC4899" },
        { label: "Atletica", value: 6, iconCount: 1.5, color: "#F59E0B" },
      ],
    },
    merenda: {
      title: "Scelte per la merenda durante l'intervallo scolastico",
      unitLabel: "alunni",
      icon: "🥪",
      data: [
        { label: "Panino imbottito", value: 20, iconCount: 5, color: "#EA580C" },
        { label: "Focaccia ligure", value: 15, iconCount: 3.75, color: "#EAB308" },
        { label: "Frutta fresca", value: 10, iconCount: 2.5, color: "#10B981" },
        { label: "Yogurt & Cereali", value: 5, iconCount: 1.25, color: "#6366F1" },
      ],
    },
  };

  const activeData = datasets[labDataset];
  const totalValue = activeData.data.reduce((acc, d) => acc + d.value, 0);
  const maxValue = Math.max(...activeData.data.map((d) => d.value));

  // --- ALLENA EXERCISES STATES ---
  const [ex1Answers, setEx1Answers] = useState<Record<string, string>>({});
  const [ex2Answers, setEx2Answers] = useState<Record<string, string>>({});
  const [ex3Matches, setEx3Matches] = useState<Record<number, string>>({});
  const [ex4Matches, setEx4Matches] = useState<Record<number, string>>({});
  const [invalsiChoice, setInvalsiChoice] = useState<string | null>(null);

  const storyOptions = [
    { id: "borraccia", text: "Il livello d'acqua nella borraccia durante una camminata in montagna (diminuisce sorso dopo sorso ↘)" },
    { id: "piantina", text: "Il numero di pagine lette di un libro giorno dopo giorno (cresce regolarmente in avanti ↗)" },
    { id: "cioccolata", text: "La temperatura di una tazza di cioccolata calda riscaldata sul fornello e poi lasciata sul tavolo a raffreddarsi ↗↘" },
  ];

  const graphChoices = [
    { id: 1, text: "La temperatura corporea di una persona con la febbre misurata ogni 2 ore", correct: "Cartesiano", explain: "Il diagramma cartesiano è imbattibile per mostrare l'evoluzione continua nel tempo." },
    { id: 2, text: "I canestri segnati dai cinque giocatori titolari di una squadra di basket", correct: "Barre", explain: "Le colonne separate consentono di paragonare le grandezze tra categorie distinte con immediatezza." },
    { id: 3, text: "La suddivisione delle 24 ore di una giornata tra sonno, scuola, compiti e svago", correct: "Torta", explain: "L'intera circonferenza rappresenta la giornata completa (100%), divisa in porzioni." },
    { id: 4, text: "La crescita in centimetri di un albero piantato nel cortile dal 2021 a oggi", correct: "Cartesiano", explain: "La linea spezzata evidenzia il tasso di sviluppo anno dopo anno lungo l'asse del tempo." },
    { id: 5, text: "La percentuale di maschi e femmine iscritti all'istituto scolastico", correct: "Torta", explain: "L'intera popolazione studentesca forma la totalità suddivisa in due settori complementari." },
    { id: 6, text: "I voti raccolti dai tre candidati alle elezioni del rappresentante di classe", correct: "Barre", explain: "I rettangoli verticali rendono evidente chi ha conquistato il numero più alto di preferenze." },
  ];

  const activeSample = sampleTables[selectedSampleIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-6xl mx-auto space-y-8 pb-16"
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-dida-blue hover:border-dida-blue/30 transition shadow-sm cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Classe 1ª · Matematica
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {subjectName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Rappresentazioni Grafiche: Far Parlare i Dati
            </h1>
          </div>
        </div>

        {/* Mode Toggle: Impara / Allena */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab("impara")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
              activeTab === "impara"
                ? "bg-white text-dida-blue shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen size={18} />
            Laboratorio & Teoria
          </button>
          <button
            onClick={() => setActiveTab("allena")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
              activeTab === "allena"
                ? "bg-white text-dida-orange shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Zap size={18} />
            Palestra di Esercizi
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "impara" ? (
          <motion.div
            key="impara-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 px-4"
          >
            {/* Subtopic Pills - Centered */}
            <div className="flex justify-center flex-wrap gap-2 pb-1">
              {GRAPH_SUBTOPICS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubtopic(sub.id)}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition cursor-pointer border ${
                    selectedSubtopic === sub.id
                      ? "bg-dida-blue text-white border-dida-blue shadow-lg shadow-blue-500/20 scale-[1.02]"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {sub.title}
                </button>
              ))}
            </div>

            {/* SUBTOPIC 1: LE TABELLE, RIGHE, COLONNE, CELLE & COSTRUTTORE */}
            {selectedSubtopic === "tables" && (
              <div className="space-y-8">
                {/* Main Heading Box */}
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      Anatomia della Tabella
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                      Come sono Fatte le Tabelle: Righe, Colonne e Celle
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Una tabella è una griglia ordinata progettata per catalogare informazioni. Ogni casella nasce dall'incrocio perfetto tra un asse orizzontale e uno verticale.
                    </p>
                  </div>

                  {/* 3 Pillars: Righe, Colonne, Celle */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 rounded-3xl bg-blue-50/60 border border-blue-200/80 text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-dida-blue text-white flex items-center justify-center font-black text-lg shadow-sm">
                        ↔️
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">Le Righe (Orizzontali)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Scorrono da sinistra verso destra. Ogni riga raggruppa le caratteristiche relative a un singolo elemento osservato.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-indigo-50/60 border border-indigo-200/80 text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                        ↕️
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">Le Colonne (Verticali)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Scendono dall'alto in basso. In cima troviamo le <strong>Intestazioni</strong>, che danno il nome alla grandezza misurata.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200/80 text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
                        ⏹️
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">Le Celle (Incrocio)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Ogni singola casella è l'incrocio di una riga con una colonna e custodisce un <strong>singolo dato specifico</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Toggle between Explorer and Builder */}
                  <div className="flex justify-center pt-2">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-1">
                      <button
                        onClick={() => setTableSubTab("explore")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer ${
                          tableSubTab === "explore"
                            ? "bg-white text-dida-blue shadow-md"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <LayoutGrid size={16} />
                        Esplora Righe, Colonne e Coordinate
                      </button>
                      <button
                        onClick={() => setTableSubTab("builder")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer ${
                          tableSubTab === "builder"
                            ? "bg-white text-dida-orange shadow-md"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <TableIcon size={16} />
                        Costruisci la tua Tabella Interattiva
                      </button>
                    </div>
                  </div>

                  {/* VISTA 1: ESPLORATORE RIGHE/COLONNE/CELLE */}
                  {tableSubTab === "explore" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 pt-2"
                    >
                      {/* Table Picker Buttons */}
                      <div className="flex justify-center flex-wrap gap-2">
                        {sampleTables.map((t, idx) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              setSelectedSampleIndex(idx);
                              setSelectedCell(null);
                              setHighlightRow(null);
                              setHighlightCol(null);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                              selectedSampleIndex === idx
                                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {t.title}
                          </button>
                        ))}
                      </div>

                      <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 max-w-4xl mx-auto shadow-sm">
                        <div className="text-center space-y-1">
                          <h3 className="text-lg font-black text-slate-800">{activeSample.title}</h3>
                          <p className="text-xs text-slate-500">{activeSample.description}</p>
                          <p className="text-xs text-dida-blue font-bold pt-1">
                            💡 Passa il mouse su una riga o colonna per vederla colorata. Clicca su qualsiasi cella per scoprire le sue coordinate esatte!
                          </p>
                        </div>

                        {/* Interactive Table with Hover and Click Highlighting */}
                        <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                {activeSample.headers.map((header, ci) => (
                                  <th
                                    key={ci}
                                    onMouseEnter={() => setHighlightCol(ci)}
                                    onMouseLeave={() => setHighlightCol(null)}
                                    className={`px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider border-b-2 transition-colors duration-150 ${
                                      ci < activeSample.headers.length - 1 ? "border-r border-r-slate-200" : ""
                                    } ${
                                      highlightCol === ci
                                        ? "bg-blue-100 text-dida-blue border-b-dida-blue"
                                        : "bg-slate-100 text-slate-700 border-b-slate-300"
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      {header}
                                      {highlightCol === ci && <span className="text-[10px] text-dida-blue font-normal">(Colonna {ci + 1})</span>}
                                    </span>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {activeSample.rows.map((row, ri) => (
                                <tr
                                  key={ri}
                                  onMouseEnter={() => setHighlightRow(ri)}
                                  onMouseLeave={() => setHighlightRow(null)}
                                  className="transition-colors"
                                >
                                  {row.map((cell, ci) => {
                                    const isSelected = selectedCell?.row === ri && selectedCell?.col === ci;
                                    const isHighlighted = highlightRow === ri || highlightCol === ci;

                                    return (
                                      <td
                                        key={ci}
                                        onClick={() => setSelectedCell({ row: ri, col: ci })}
                                        className={`px-5 py-3.5 border-b text-xs font-medium cursor-pointer transition-all duration-150 ${
                                          ci < row.length - 1 ? "border-r border-r-slate-200" : ""
                                        } ${
                                          isSelected
                                            ? "bg-dida-blue text-white font-black ring-2 ring-dida-blue ring-inset shadow-inner"
                                            : isHighlighted
                                            ? "bg-blue-50/90 text-slate-900 font-bold"
                                            : ri % 2 === 0
                                            ? "bg-white text-slate-700"
                                            : "bg-slate-50/70 text-slate-700"
                                        } ${ci === 0 ? "font-bold" : ""} border-b-slate-200 hover:bg-blue-100/60`}
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

                        {/* Selected cell coordinate readout */}
                        <AnimatePresence mode="wait">
                          {selectedCell ? (
                            <motion.div
                              key={`cell-${selectedCell.row}-${selectedCell.col}`}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 text-center space-y-1 shadow-sm"
                            >
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dida-blue text-white text-xs font-black">
                                Cella Selezionata: Riga {selectedCell.row + 1} ✕ Colonna {selectedCell.col + 1}
                              </div>
                              <p className="text-slate-700 text-sm font-semibold pt-1">
                                All'incrocio tra la categoria <strong className="text-slate-900">«{activeSample.rows[selectedCell.row][0]}»</strong> e l'intestazione <strong className="text-slate-900">«{activeSample.headers[selectedCell.col]}»</strong> troviamo il dato:{" "}
                                <strong className="text-dida-blue text-lg underline decoration-2">{activeSample.rows[selectedCell.row][selectedCell.col]}</strong>
                              </p>
                            </motion.div>
                          ) : (
                            <div className="p-3 text-center text-xs text-slate-400 italic">
                              Clicca su una casella qualsiasi per osservarne l'incrocio tra riga e colonna.
                            </div>
                          )}
                        </AnimatePresence>

                        {/* Table Statistics Counter */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center">
                            <span className="text-[10px] font-black uppercase text-slate-400">Numero di Righe</span>
                            <span className="block text-xl font-black text-slate-800">{activeSample.rows.length}</span>
                          </div>
                          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center">
                            <span className="text-[10px] font-black uppercase text-slate-400">Numero di Colonne</span>
                            <span className="block text-xl font-black text-slate-800">{activeSample.headers.length}</span>
                          </div>
                          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center">
                            <span className="text-[10px] font-black uppercase text-dida-blue">Celle Totali (Righe × Colonne)</span>
                            <span className="block text-xl font-black text-dida-blue">
                              {activeSample.rows.length * activeSample.headers.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* VISTA 2: COSTRUTTORE INTERATTIVO DI TABELLE */}
                  {tableSubTab === "builder" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 pt-2"
                    >
                      <div className="p-6 md:p-8 rounded-3xl bg-orange-50/40 border-2 border-orange-200 space-y-5 max-w-4xl mx-auto shadow-sm">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-orange-200 pb-4">
                          <div className="text-center sm:text-left">
                            <h3 className="text-lg font-black text-slate-800 flex items-center justify-center sm:justify-start gap-2">
                              <TableIcon className="text-dida-orange" size={20} />
                              Laboratorio: Crea la tua Tabella
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Aggiungi o rimuovi righe e colonne, clicca su intestazioni o celle per digitare il tuo testo!
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={addColumn}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dida-blue text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-sm"
                            >
                              <Plus size={14} /> Aggiungi Colonna
                            </button>
                            <button
                              onClick={addRow}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dida-orange text-white text-xs font-bold hover:bg-orange-600 transition cursor-pointer shadow-sm"
                            >
                              <Plus size={14} /> Aggiungi Riga
                            </button>
                          </div>
                        </div>

                        {/* Interactive Editable Table */}
                        <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                {builderHeaders.map((header, ci) => (
                                  <th
                                    key={ci}
                                    className={`relative p-3 bg-slate-100 border-b-2 border-b-slate-300 ${
                                      ci < builderHeaders.length - 1 ? "border-r border-r-slate-200" : ""
                                    }`}
                                  >
                                    {editingHeader === ci ? (
                                      <div className="flex items-center gap-1">
                                        <input
                                          autoFocus
                                          value={tempValue}
                                          onChange={(e) => setTempValue(e.target.value)}
                                          onKeyDown={(e) => e.key === "Enter" && confirmEditHeader()}
                                          className="w-full px-2 py-1 border border-dida-blue rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-dida-blue/30 bg-white"
                                        />
                                        <button onClick={confirmEditHeader} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer">
                                          <Check size={14} />
                                        </button>
                                        <button onClick={() => setEditingHeader(null)} className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer">
                                          <X size={14} />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between gap-2">
                                        <span
                                          onClick={() => startEditHeader(ci)}
                                          className="text-xs font-black uppercase tracking-wider text-slate-700 cursor-pointer hover:text-dida-blue transition flex items-center gap-1.5"
                                          title="Clicca per rinominare"
                                        >
                                          {header}
                                          <Pencil size={11} className="text-slate-400" />
                                        </span>
                                        {builderHeaders.length > 1 && (
                                          <button
                                            onClick={() => removeColumn(ci)}
                                            className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                            title="Elimina colonna"
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </th>
                                ))}
                                <th className="w-12 bg-slate-100 border-b-2 border-b-slate-300 border-l border-l-slate-200 text-center text-[10px] font-bold text-slate-400">
                                  Azioni
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {builderRows.map((row, ri) => (
                                <tr key={ri} className="hover:bg-slate-50/60 transition-colors">
                                  {row.map((cell, ci) => {
                                    const isEditing = editingCell?.row === ri && editingCell?.col === ci;
                                    return (
                                      <td
                                        key={ci}
                                        className={`border-b border-b-slate-200 p-3 text-xs ${
                                          ci < row.length - 1 ? "border-r border-r-slate-200" : ""
                                        }`}
                                      >
                                        {isEditing ? (
                                          <div className="flex items-center gap-1">
                                            <input
                                              autoFocus
                                              value={tempValue}
                                              onChange={(e) => setTempValue(e.target.value)}
                                              onKeyDown={(e) => e.key === "Enter" && confirmEditCell()}
                                              className="w-full px-2 py-1 border border-dida-orange rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-dida-orange/30 bg-white"
                                            />
                                            <button onClick={confirmEditCell} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer">
                                              <Check size={14} />
                                            </button>
                                            <button onClick={() => setEditingCell(null)} className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer">
                                              <X size={14} />
                                            </button>
                                          </div>
                                        ) : (
                                          <span
                                            onClick={() => startEditCell(ri, ci)}
                                            className={`block cursor-pointer hover:text-dida-orange transition min-h-[1.5rem] py-1 px-1.5 rounded-lg hover:bg-orange-50/50 ${
                                              cell ? "text-slate-800 font-medium" : "text-slate-300 italic"
                                            }`}
                                            title="Clicca per modificare o inserire testo"
                                          >
                                            {cell || "Scrivi qui..."}
                                          </span>
                                        )}
                                      </td>
                                    );
                                  })}
                                  <td className="border-b border-b-slate-200 border-l border-l-slate-200 text-center p-2">
                                    {builderRows.length > 1 && (
                                      <button
                                        onClick={() => removeRow(ri)}
                                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                        title="Elimina riga"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Reset and stats banner */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 pt-1">
                          <p>
                            La tua tabella personalizzata ha <strong className="text-slate-800">{builderRows.length} righe</strong>, <strong className="text-slate-800">{builderHeaders.length} colonne</strong> e <strong className="text-dida-orange">{builderRows.length * builderHeaders.length} celle</strong> compilabili.
                          </p>
                          <button
                            onClick={() => {
                              setBuilderHeaders(["Materia", "Ore settimanali", "Aula"]);
                              setBuilderRows([
                                ["Matematica", "4", "Aula 12"],
                                ["Scienze", "2", "Laboratorio"],
                                ["Arte", "2", "Atelier"],
                              ]);
                            }}
                            className="text-xs font-bold text-slate-400 hover:text-slate-700 underline cursor-pointer"
                          >
                            Ripristina tabella iniziale
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* SECONDA PARTE: L'INDAGINE STATISTICA E LA FREQUENZA */}
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      Dalle Domande alla Tabella
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                      Come Nasce una Ricerca Statistica
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Prima di riempire una tabella con numeri veri, dobbiamo svolgere una rilevazione ordinata seguendo un metodo collaudato.
                    </p>
                  </div>

                  {/* 5 Steps Process - Centered */}
                  <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-center space-y-4">
                    <p className="text-xs font-black uppercase tracking-wider text-dida-blue">
                      Il Percorso di un'Indagine Statistica in Cinque Passi:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 font-bold text-sm md:text-base text-slate-800">
                      <span className="px-3.5 py-2 bg-white rounded-xl shadow-sm border border-blue-200">1. Scegliere la domanda</span>
                      <span className="text-blue-400 font-black">➔</span>
                      <span className="px-3.5 py-2 bg-white rounded-xl shadow-sm border border-blue-200">2. Raccogliere le risposte</span>
                      <span className="text-blue-400 font-black">➔</span>
                      <span className="px-3.5 py-2 bg-white rounded-xl shadow-sm border border-blue-200">3. Spoglio dei dati</span>
                      <span className="text-blue-400 font-black">➔</span>
                      <span className="px-3.5 py-2 bg-white rounded-xl shadow-sm border border-blue-200">4. Disegnare la tabella</span>
                      <span className="text-blue-400 font-black">➔</span>
                      <span className="px-4 py-2 bg-dida-blue text-white rounded-xl shadow-sm">5. Trarre conclusioni</span>
                    </div>
                  </div>

                  {/* Conteggio e Frequenza */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-center md:text-left">
                      <div className="inline-block text-xs font-bold uppercase tracking-wider text-dida-blue bg-white px-3 py-1 rounded-full border border-blue-200">
                        Il Trucco dei Mazzetti da 5
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">Spoglio Rapido con le Stanghette</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Mentre si ascoltano le risposte dei compagni, si tracciano quattro barrette verticali e la quinta le unisce in diagonale per formare un blocco chiuso da <strong>5</strong>. Così si conta alla svelta senza perdersi!
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xl font-bold text-dida-blue text-center">
                        <s>||||</s> <s>||||</s> || = 12 risposte
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 space-y-3 text-center md:text-left">
                      <div className="inline-block text-xs font-bold uppercase tracking-wider text-amber-800 bg-white px-3 py-1 rounded-full border border-amber-200">
                        Parola Chiave
                      </div>
                      <h4 className="font-bold text-amber-900 text-base">La Frequenza Assoluta</h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        La <strong>frequenza</strong> indica quante volte compare una determinata risposta nell'indagine.
                        Se sommiamo insieme tutte le frequenze, dobbiamo riottenere esattamente il <strong>numero totale dei ragazzi intervistati</strong>!
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs font-semibold text-amber-900 text-center">
                        Esempio merenda: 10 panini + 5 frutti + 7 focacce + 3 barrette = 25 alunni totali
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTOPIC 2: L'IDEOGRAMMA */}
            {selectedSubtopic === "ideogram" && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Figure al posto dei numeri
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                    L'Ideogramma: Disegni che Valgono una Quantità
                  </h2>
                  <p className="text-slate-500 text-sm">
                    È un tipo di grafico vivace e colorato che impiega piccole icone a tema per dare forma concreta ai numeri raccolti.
                  </p>
                </div>

                <div className="rounded-3xl bg-amber-50 border-2 border-amber-200 p-6 md:p-8 space-y-2 text-center max-w-3xl mx-auto shadow-sm">
                  <div className="inline-flex items-center gap-2 text-amber-900 font-black text-sm uppercase bg-white px-3 py-1 rounded-full border border-amber-200">
                    <Sparkles size={16} className="text-amber-600" />
                    La Regola della Legenda
                  </div>
                  <p className="text-slate-800 font-extrabold text-xl pt-1">
                    Ciascun disegno possiede un valore fisso spiegato chiaramente nella legenda.
                  </p>
                  <p className="text-slate-600 text-xs max-w-xl mx-auto">
                    Attenzione alle mezze icone: se un simbolo intero 📚 vale 4 libri, un disegno a metà 📖 rappresenta la metà esatta del valore, cioè 2 libri!
                  </p>
                </div>

                {/* Esempio Pratico: Libri letti */}
                <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 max-w-3xl mx-auto">
                  <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 pb-3 gap-2">
                    <span className="font-bold text-sm text-slate-800">Esempio: Libri letti dalle classi prime nel trimestre</span>
                    <span className="font-black text-xs text-dida-orange bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                      Legenda: 1 📚 = 4 libri
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white rounded-2xl border border-slate-200 text-center sm:text-left">
                      <span className="font-bold text-sm text-slate-800 sm:w-28">Classe 1ª A</span>
                      <div className="text-xl tracking-widest flex-1">📚📚📚📚 (4 icone)</div>
                      <span className="font-mono font-black text-sm text-blue-600">4 × 4 = 16 libri</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white rounded-2xl border border-slate-200 text-center sm:text-left">
                      <span className="font-bold text-sm text-slate-800 sm:w-28">Classe 1ª B</span>
                      <div className="text-xl tracking-widest flex-1">📚📚📚📚📚📚 (6 icone)</div>
                      <span className="font-mono font-black text-sm text-blue-600">6 × 4 = 24 libri (record!)</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white rounded-2xl border border-slate-200 text-center sm:text-left">
                      <span className="font-bold text-sm text-slate-800 sm:w-28">Classe 1ª C</span>
                      <div className="text-xl tracking-widest flex-1">📚📚📚 (3 icone)</div>
                      <span className="font-mono font-black text-sm text-blue-600">3 × 4 = 12 libri</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white rounded-2xl border border-slate-200 text-center sm:text-left">
                      <span className="font-bold text-sm text-slate-800 sm:w-28">Classe 1ª D</span>
                      <div className="text-xl tracking-widest flex-1">📚📚 📖 (2 icone + mezza)</div>
                      <span className="font-mono font-black text-sm text-blue-600">(2 × 4) + 2 = 10 libri</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTOPIC 3: IL DIAGRAMMA A BARRE */}
            {selectedSubtopic === "ortogram" && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Confronto visivo immediato
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                    Il Diagramma a Colonne (o Ortogramma)
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Più è alta la colonna, maggiore è il valore misurato. Una scala graduata a fianco ci permette di leggere subito il numero corrispondente.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Ogni categoria ha una colonna rettangolare con la stessa larghezza di base. L'asse verticale funge da <strong>righello graduato</strong> con tacche equidistanti.
                    </p>
                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                      <p className="text-xs font-bold text-dida-blue uppercase tracking-wider">Esempio: Mezzo di trasporto per venire a scuola</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-semibold">
                        <div className="p-2 bg-white rounded-lg">A piedi: 12 ragazzi</div>
                        <div className="p-2 bg-white rounded-lg">Bicicletta: 8 ragazzi</div>
                        <div className="p-2 bg-white rounded-lg font-bold text-orange-600">Autobus: 14 ragazzi (picco)</div>
                        <div className="p-2 bg-white rounded-lg">In auto: 6 ragazzi (minimo)</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      <strong>Domanda di lettura:</strong> Quanti studenti scelgono un mezzo ecologico o attivo (a piedi oppure in bicicletta)? Basta sommare 12 + 8 = <strong>20 studenti</strong>!
                    </div>
                  </div>

                  {/* SVG Bar Chart Demonstration */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
                    <svg viewBox="0 0 320 220" className="w-full h-52">
                      <line x1="40" y1="20" x2="300" y2="20" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="40" y1="65" x2="300" y2="65" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="40" y1="110" x2="300" y2="110" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="40" y1="155" x2="300" y2="155" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="40" y1="190" x2="300" y2="190" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="40" y1="10" x2="40" y2="190" stroke="#94A3B8" strokeWidth="2" />

                      <text x="32" y="24" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">16</text>
                      <text x="32" y="69" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">12</text>
                      <text x="32" y="114" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">8</text>
                      <text x="32" y="159" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">4</text>
                      <text x="32" y="194" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">0</text>

                      {/* A piedi: 12 */}
                      <rect x="65" y="65" width="40" height="125" fill="#2563EB" rx="4" />
                      <text x="85" y="57" textAnchor="middle" className="text-[11px] font-bold fill-blue-900">12</text>
                      <text x="85" y="206" textAnchor="middle" className="text-[11px] font-extrabold fill-slate-700">Piedi</text>

                      {/* Bici: 8 */}
                      <rect x="125" y="110" width="40" height="80" fill="#06B6D4" rx="4" />
                      <text x="145" y="102" textAnchor="middle" className="text-[11px] font-bold fill-cyan-900">8</text>
                      <text x="145" y="206" textAnchor="middle" className="text-[11px] font-extrabold fill-slate-700">Bici</text>

                      {/* Bus: 14 */}
                      <rect x="185" y="42" width="40" height="148" fill="#EA580C" rx="4" />
                      <text x="205" y="34" textAnchor="middle" className="text-[11px] font-black fill-orange-700">14</text>
                      <text x="205" y="206" textAnchor="middle" className="text-[11px] font-extrabold fill-slate-700">Bus</text>

                      {/* Auto: 6 */}
                      <rect x="245" y="132" width="40" height="58" fill="#8B5CF6" rx="4" />
                      <text x="265" y="124" textAnchor="middle" className="text-[11px] font-bold fill-purple-900">6</text>
                      <text x="265" y="206" textAnchor="middle" className="text-[11px] font-extrabold fill-slate-700">Auto</text>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTOPIC 4: L'AREOGRAMMA / TORTA */}
            {selectedSubtopic === "aerogram" && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Spicchi e Percentuali
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                    L'Areogramma Circolare (Grafico a Torta)
                  </h2>
                  <p className="text-slate-500 text-sm">
                    L'intero cerchio rappresenta il 100% dell'indagine. Ciascuna fetta corrisponde alla quota percentuale conquistata da una categoria.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                      <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Regola Chiave</p>
                      <p className="text-sm text-slate-800 font-bold mt-1">
                        Più voti raccoglie una risposta, più largo sarà il suo spicchio (settore circolare). Se raccoglie la metà esatta dei consensi, occuperà mezzo cerchio (50%)!
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <p className="font-bold text-xs text-slate-700 uppercase">Esempio: Animali domestici degli studenti (Campione: 100 animali)</p>
                      <div className="space-y-1.5 text-xs">
                        <p className="flex justify-between font-semibold"><span className="text-blue-600">■ Cani:</span> <span>40 animali (40% · fetta maggiore)</span></p>
                        <p className="flex justify-between font-semibold"><span className="text-orange-600">■ Gatti:</span> <span>30 animali (30%)</span></p>
                        <p className="flex justify-between font-semibold"><span className="text-emerald-600">■ Pesci & Tartarughe:</span> <span>20 animali (20%)</span></p>
                        <p className="flex justify-between font-semibold"><span className="text-amber-500">■ Uccellini & Canarini:</span> <span>10 animali (10%)</span></p>
                        <p className="flex justify-between font-black pt-1.5 border-t border-slate-300"><span>TOTALE INTERO:</span> <span>100 animali (100%)</span></p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 text-center">
                      💡 <em>Poiché il campione è di 100 animali, ogni singolo animale corrisponde esattamente all'1% della superficie della torta!</em>
                    </div>
                  </div>

                  {/* Pie Visualization */}
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-md">
                      {pieSlices(PET_PIE.map(d => d.value), 100, 100, 90).map((slice, i) => (
                        <g key={PET_PIE[i].label}>
                          <path d={slice.path} fill={PET_PIE[i].color} stroke="#FFFFFF" strokeWidth="1.5" />
                          <text x={slice.labelX} y={slice.labelY} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-black fill-white">
                            {PET_PIE[i].label}: {slice.percent}%
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTOPIC 5: IL DIAGRAMMA CARTESIANO */}
            {selectedSubtopic === "cartesian-diagram" && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Come evolve nel tempo
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                    Il Diagramma Cartesiano e le Linee Spezzate
                  </h2>
                  <p className="text-slate-500 text-sm">
                    È lo strumento perfetto per seguire l'andamento continuo di una grandezza lungo una linea temporale di ore, giorni o settimane.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-center">
                        <p className="font-black text-dida-blue uppercase">ASSE X (ORIZZONTALE)</p>
                        <p className="text-slate-600 mt-1">Ospita solitamente la linea del tempo (settimane, mesi, ore).</p>
                      </div>
                      <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
                        <p className="font-black text-indigo-700 uppercase">ASSE Y (VERTICALE)</p>
                        <p className="text-slate-600 mt-1">Misura la quantità osservata (altezza in cm, peso in kg, gradi °C).</p>
                      </div>
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-center">
                        <p className="font-black text-amber-800 uppercase">ORIGINE DEGLI ASSI (O)</p>
                        <p className="text-slate-600 mt-1">Il punto d'incrocio iniziale (0, 0) da cui partono le due rette.</p>
                      </div>
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                        <p className="font-black text-emerald-800 uppercase">LA LINEA SPEZZATA</p>
                        <p className="text-slate-600 mt-1">Unisce i puntini di misurazione: se sale c'è crescita, se è piatta c'è stabilità!</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 text-center">
                      <strong>Esempio: Altezza di una piantina di girasole:</strong> 1ª sett (3 cm) ➔ 2ª sett (6 cm) ➔ 3ª sett (9 cm) ➔ 4ª sett (9 cm, altezza ferma) ➔ 5ª sett (14 cm) ➔ 6ª sett (18 cm).
                    </div>
                  </div>

                  {/* SVG Cartesian Line Chart */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
                    <svg viewBox="0 0 320 200" className="w-full h-48">
                      {[30, 60, 90, 120, 150].map((y) => (
                        <line key={y} x1="40" y1={y} x2="300" y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                      ))}
                      <line x1="40" y1="170" x2="300" y2="170" stroke="#64748B" strokeWidth="2" />
                      <line x1="40" y1="10" x2="40" y2="170" stroke="#64748B" strokeWidth="2" />
                      <text x="30" y="175" className="text-[10px] fill-slate-400 font-mono">0</text>
                      <text x="30" y="35" className="text-[10px] fill-slate-400 font-mono">20</text>

                      <polyline
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="75,150 115,130 155,110 195,110 235,75 275,45"
                      />

                      {[
                        { x: 75, y: 150, label: "3 cm", sem: "1ª" },
                        { x: 115, y: 130, label: "6 cm", sem: "2ª" },
                        { x: 155, y: 110, label: "9 cm", sem: "3ª" },
                        { x: 195, y: 110, label: "9 cm", sem: "4ª" },
                        { x: 235, y: 75, label: "14 cm", sem: "5ª" },
                        { x: 275, y: 45, label: "18 cm", sem: "6ª" },
                      ].map((pt, i) => (
                        <g key={i}>
                          <circle cx={pt.x} cy={pt.y} r="5" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2" />
                          <text x={pt.x} y={pt.y - 8} textAnchor="middle" className="text-[10px] font-black fill-slate-800">
                            {pt.label}
                          </text>
                          <text x={pt.x} y="185" textAnchor="middle" className="text-[11px] font-bold fill-slate-500">
                            {pt.sem}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* LABORATORIO INTERATTIVO MULTI-GRAFICO */}
            <div className="rounded-[2rem] border-2 border-dida-blue/30 bg-white p-6 md:p-10 shadow-md space-y-6">
              {/* Centered Heading */}
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Laboratorio Interattivo
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-800">
                  Generatore Dinamico di Rappresentazioni
                </h3>
                <p className="text-xs text-slate-500">
                  Seleziona un'indagine a piacere ed esplora come gli stessi dati si trasformano tra tabella, ideogramma, barre, torta e cartesiano!
                </p>
              </div>

              {/* Centered choose dataset */}
              <div className="flex justify-center flex-wrap gap-2 pt-2">
                {(["libri", "sport", "merenda"] as const).map((ds) => (
                  <button
                    key={ds}
                    onClick={() => setLabDataset(ds)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      labDataset === ds
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {ds === "libri" ? "📚 Libri in Biblioteca" : ds === "sport" ? "🏅 Discipline Sportive" : "🥪 Merenda a Scuola"}
                  </button>
                ))}
              </div>

              {/* Graphic Type Toggle - Centered */}
              <div className="flex justify-center flex-wrap gap-2">
                {[
                  { id: "ideogram", label: "Ideogramma", icon: Smile },
                  { id: "bar", label: "Barre", icon: BarChart3 },
                  { id: "pie", label: "Torta", icon: PieChart },
                  { id: "cartesian", label: "Cartesiano", icon: LineChart },
                  { id: "table", label: "Tabella", icon: TableIcon },
                ].map((gt) => {
                  const Icon = gt.icon;
                  return (
                    <button
                      key={gt.id}
                      onClick={() => setLabGraphicType(gt.id as any)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        labGraphicType === gt.id
                          ? "bg-dida-blue text-white border-dida-blue shadow-md"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={14} />
                      {gt.label}
                    </button>
                  );
                })}
              </div>

              {/* Visualized Component */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-3xl mx-auto">
                <p className="text-xs font-bold text-slate-400 uppercase mb-4 text-center">{activeData.title}</p>

                {/* Table View */}
                {labGraphicType === "table" && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-extrabold">
                          <th className="p-3">Categoria</th>
                          <th className="p-3">Frequenza ({activeData.unitLabel})</th>
                          <th className="p-3">Percentuale (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeData.data.map((row, i) => (
                          <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }} />
                              {row.label}
                            </td>
                            <td className="p-3 font-mono font-bold text-blue-700">{row.value}</td>
                            <td className="p-3 font-mono text-slate-600">{((row.value / totalValue) * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-black text-slate-900">
                          <td className="p-3">TOTALE INTERVISTATI</td>
                          <td className="p-3 font-mono">{totalValue}</td>
                          <td className="p-3 font-mono">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Ideogram View */}
                {labGraphicType === "ideogram" && (
                  <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-dida-orange bg-orange-50 p-2.5 rounded-lg border border-orange-200 gap-2">
                      <span>Legenda: 1 icona = {ideogramUnit} {activeData.unitLabel}</span>
                      <div className="flex items-center gap-2">
                        <span>Scala icona:</span>
                        {[2, 4, 5].map((u) => (
                          <button
                            key={u}
                            onClick={() => setIdeogramUnit(u)}
                            className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                              ideogramUnit === u ? "bg-dida-orange text-white" : "bg-white border text-slate-600"
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {activeData.data.map((d, i) => {
                        const count = Math.round((d.value / ideogramUnit) * 10) / 10;
                        const fullIcons = Math.floor(count);
                        const hasHalf = count - fullIcons >= 0.3;

                        return (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 border-b border-slate-100">
                            <span className="font-bold text-sm text-slate-800 w-36">{d.label}</span>
                            <div className="text-xl tracking-widest flex-1 flex flex-wrap gap-1">
                              {Array.from({ length: fullIcons }).map((_, idx) => (
                                <span key={idx}>{activeData.icon}</span>
                              ))}
                              {hasHalf && <span className="opacity-50">🌗</span>}
                            </div>
                            <span className="font-mono font-bold text-sm text-blue-700">{d.value} {activeData.unitLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bar Chart View */}
                {labGraphicType === "bar" && (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
                    {activeData.data.map((d, i) => {
                      const pct = (d.value / maxValue) * 100;
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>{d.label}</span>
                            <span>{d.value} {activeData.unitLabel}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden p-0.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full rounded-lg"
                              style={{ backgroundColor: d.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pie Chart View */}
                {labGraphicType === "pie" && (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-around gap-6">
                    <div className="space-y-2 text-xs">
                      {activeData.data.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="font-bold text-slate-700">{d.label}:</span>
                          <span className="font-mono text-slate-500">{d.value} ({((d.value / totalValue) * 100).toFixed(0)}%)</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-md">
                        {pieSlices(activeData.data.map(d => d.value), 100, 100, 95).map((slice, i) => (
                          <g key={activeData.data[i].label}>
                            <path d={slice.path} fill={activeData.data[i].color} stroke="#FFFFFF" strokeWidth="2" />
                            <text x={slice.labelX} y={slice.labelY} textAnchor="middle" dominantBaseline="middle" className="text-[13px] font-black fill-white">
                              {slice.percent}%
                            </text>
                          </g>
                        ))}
                      </svg>
                      <span className="text-xs font-bold text-slate-500">Totale: {totalValue} {activeData.unitLabel}</span>
                    </div>
                  </div>
                )}

                {/* Cartesian Line View */}
                {labGraphicType === "cartesian" && (
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <svg viewBox="0 0 400 180" className="w-full h-44">
                      <line x1="40" y1="150" x2="380" y2="150" stroke="#CBD5E1" strokeWidth="2" />
                      <line x1="40" y1="20" x2="40" y2="150" stroke="#CBD5E1" strokeWidth="2" />
                      {activeData.data.map((d, i) => {
                        const stepX = 320 / (activeData.data.length - 1 || 1);
                        const posX = 40 + i * stepX;
                        const posY = 150 - (d.value / maxValue) * 110;
                        return (
                          <g key={i}>
                            <circle cx={posX} cy={posY} r="5" fill="#EF4444" stroke="#FFF" strokeWidth="2" />
                            <text x={posX} y={posY - 8} textAnchor="middle" className="text-[10px] font-bold fill-slate-800">
                              {d.value}
                            </text>
                            <text x={posX} y="165" textAnchor="middle" className="text-[10px] font-semibold fill-slate-500">
                              {d.label.slice(0, 8)}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* TAB ALLENA */
          <motion.div
            key="allena-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 px-4"
          >
            {/* Centered Intro Banner */}
            <div className="rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 shadow-lg text-center space-y-2">
              <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-amber-200 bg-white/10 px-3 py-1 rounded-full">
                Palestra di Statistica & Grafica
              </span>
              <h2 className="text-2xl md:text-3xl font-black">
                Mettiti alla Prova con le Rappresentazioni
              </h2>
              <p className="text-amber-100 text-sm max-w-xl mx-auto">
                Risolvi i quiz interattivi: riceverai subito la correzione con la spiegazione chiara di ogni passaggio!
              </p>
            </div>

            {/* ESERCIZIO 1: CALCOLO CON L'IDEOGRAMMA */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-1 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">Attività 1 · Decodifica Simbolica</span>
                <h3 className="text-xl font-black text-slate-800">Calcolare le Quantità con l'Ideogramma</h3>
                <p className="text-slate-500 text-xs max-w-lg mx-auto">
                  Ricorda la regola della biblioteca: 1 icona 📚 = 4 libri. Mezza icona 📖 vale la metà esatta, cioè 2 libri!
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => setEx1Answers({})}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Azzera Risposte
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[
                  { id: "avventura", label: "Libri di Avventura (5 icone intere 📚)", correct: "20", mult: "5 × 4" },
                  { id: "fumetti", label: "Fumetti e Manga (7 icone intere 📚)", correct: "28", mult: "7 × 4" },
                  { id: "mezza", label: "Mezza icona singola (½ icona 📖)", correct: "2", mult: "4 : 2" },
                ].map((item) => {
                  const val = ex1Answers[item.id] || "";
                  const isChecked = val.trim() !== "";
                  const isCorrect = isChecked && val.trim() === item.correct;

                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border space-y-3 text-center ${
                        !isChecked ? "bg-slate-50 border-slate-200" : isCorrect ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"
                      }`}
                    >
                      <p className="font-bold text-xs text-slate-800">{item.label}</p>
                      <div className="flex justify-center">
                        <input
                          type="number"
                          placeholder="n° volumi?"
                          value={val}
                          onChange={(e) => setEx1Answers(prev => ({ ...prev, [item.id]: e.target.value }))}
                          className="w-32 bg-white px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 text-center focus:outline-dida-blue"
                        />
                      </div>
                      {isChecked && (
                        <p className={`text-xs font-semibold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          {isCorrect ? `Esatto! (${item.mult} = ${item.correct} libri)` : `Riprova: calcola ${item.mult}`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ESERCIZIO 2: LE PEDALATE DI LUCA */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-1 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">Attività 2 · Analisi di una Serie Temporale</span>
                <h3 className="text-xl font-black text-slate-800">I Chilometri Percorsi in Bicicletta da Luca</h3>
                <p className="text-slate-500 text-xs max-w-lg mx-auto">
                  Luca ha annotato ogni sera sul diario i chilometri pedalati durante la settimana. Consulta la tabella per rispondere.
                </p>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs max-w-3xl mx-auto">
                {[
                  { g: "Lun", v: "10 km" },
                  { g: "Mar", v: "20 km" },
                  { g: "Mer", v: "15 km" },
                  { g: "Gio", v: "25 km" },
                  { g: "Ven", v: "30 km" },
                  { g: "Sab", v: "5 km" },
                  { g: "Dom", v: "35 km" },
                ].map((item, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                    <p className="font-extrabold text-slate-500 uppercase">{item.g}</p>
                    <p className="font-mono font-black text-sm text-dida-blue mt-1">{item.v}</p>
                  </div>
                ))}
              </div>

              {/* Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {[
                  { id: "totale", prompt: "Quanti chilometri ha pedalato complessivamente in tutta la settimana?", correct: "140", hint: "Somma i 7 giorni: 10 + 20 + 15 + 25 + 30 + 5 + 35" },
                  { id: "max", prompt: "In quale giorno ha percorso la distanza più lunga (record)?", correct: "domenica", hint: "Scrivi il nome del giorno corrispondente a 35 km" },
                  { id: "min", prompt: "In quale giorno ha percorso il tragitto più breve (minimo)?", correct: "sabato", hint: "Scrivi il nome del giorno corrispondente a 5 km" },
                  { id: "media", prompt: "Media giornaliera di chilometri (140 diviso 7 giorni):", correct: "20", hint: "Calcola 140 : 7" },
                ].map((q) => {
                  const val = ex2Answers[q.id] || "";
                  const isChecked = val.trim() !== "";
                  const isCorrect = isChecked && val.trim().toLowerCase() === q.correct;

                  return (
                    <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                      <p className="text-xs font-bold text-slate-800">{q.prompt}</p>
                      <input
                        type="text"
                        placeholder="Inserisci la risposta..."
                        value={val}
                        onChange={(e) => setEx2Answers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        className="w-full bg-white px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                      />
                      {isChecked && (
                        <p className={`text-xs font-semibold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          {isCorrect ? "Risposta esatta!" : `Aiuto: ${q.hint}`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ESERCIZIO 3: IL GRAFICO RACCONTA UNA STORIA */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-1 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">Attività 3 · Interpretazione delle Curve</span>
                <h3 className="text-xl font-black text-slate-800">Il Grafico Racconta una Storia</h3>
                <p className="text-slate-500 text-xs max-w-lg mx-auto">
                  Osserva la traiettoria della linea e collegala alla situazione reale che descrive meglio quel fenomeno.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 1, title: "Tracciato A", desc: "La curva scende continuamente verso il basso ↘", correct: "borraccia" },
                  { id: 2, title: "Tracciato B", desc: "La curva sale fino a un massimo e poi scende ↗↘", correct: "cioccolata" },
                  { id: 3, title: "Tracciato C", desc: "La curva sale in avanti senza mai scendere ↗", correct: "piantina" },
                ].map((g) => {
                  const match = ex3Matches[g.id];
                  const isChecked = Boolean(match);
                  const isCorrect = isChecked && match === g.correct;

                  return (
                    <div key={g.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-center">
                      <div className="space-y-1">
                        <span className="font-black text-base text-slate-800">{g.title}</span>
                        <p className="text-xs text-slate-500">{g.desc}</p>
                      </div>

                      <div className="space-y-2 pt-2">
                        {storyOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setEx3Matches(prev => ({ ...prev, [g.id]: opt.id }))}
                            className={`w-full text-left p-3 rounded-xl text-xs font-medium transition cursor-pointer border ${
                              match === opt.id
                                ? "bg-dida-blue text-white border-blue-600 font-bold"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {opt.text}
                          </button>
                        ))}
                      </div>

                      {isChecked && (
                        <p className={`text-xs font-semibold mt-2 ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          {isCorrect ? "Ottima intuizione! Abbinamento corretto." : "Attenzione: rifletti su quale fenomeno scende, sale sempre o ha un picco."}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ESERCIZIO 4: QUALE GRAFICO SCEGLIERE? */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-1 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">Attività 4 · Scelta dello Strumento Idoneo</span>
                <h3 className="text-xl font-black text-slate-800">Quale tipologia di grafico è più indicata?</h3>
                <p className="text-slate-500 text-xs max-w-lg mx-auto">
                  Scegli se per rappresentare questi dati è più opportuno usare un grafico a Barre, a Torta o Cartesiano.
                </p>
              </div>

              <div className="space-y-3 max-w-4xl mx-auto">
                {graphChoices.map((c) => {
                  const chosen = ex4Matches[c.id];
                  const isChecked = Boolean(chosen);
                  const isCorrect = isChecked && chosen === c.correct;

                  return (
                    <div
                      key={c.id}
                      className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        !isChecked ? "bg-slate-50 border-slate-200" : isCorrect ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"
                      }`}
                    >
                      <span className="font-semibold text-xs text-slate-800">{c.text}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {["Barre", "Torta", "Cartesiano"].map((btn) => (
                          <button
                            key={btn}
                            onClick={() => setEx4Matches(prev => ({ ...prev, [c.id]: btn }))}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                              chosen === btn
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                      {isChecked && (
                        <p className={`text-xs md:w-full mt-1 ${isCorrect ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}`}>
                          {isCorrect ? "Esatto! " : "Riflessione: "} {c.explain}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ESERCIZIO 5: PROVE INVALSI */}
            <div className="rounded-[2rem] border-2 border-indigo-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-1 border-b border-slate-100 pb-4">
                <span className="inline-block text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Simulazione Prove Nazionali INVALSI
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Stima Visiva dell'Areogramma Circolare</h3>
                <p className="text-slate-500 text-xs max-w-lg mx-auto">
                  Osserva con attenzione la dimensione degli spicchi per individuare la risposta numerica corretta.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                <div className="flex flex-col items-center p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <svg viewBox="0 0 160 160" className="w-40 h-40">
                    <path d="M 80 80 L 80 10 A 70 70 0 0 1 150 80 Z" fill="#F59E0B" />
                    <path d="M 80 80 L 150 80 A 70 70 0 0 1 130 130 Z" fill="#EF4444" />
                    <path d="M 80 80 L 130 130 A 70 70 0 1 1 80 10 Z" fill="#2563EB" />
                  </svg>
                  <div className="flex gap-4 mt-3 text-xs font-bold">
                    <span className="text-blue-600">■ Pianoforte</span>
                    <span className="text-amber-500">■ Chitarra</span>
                    <span className="text-red-500">■ Batteria</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Un gruppo di <strong>300 studenti di prima media</strong> è stato intervistato sullo strumento musicale preferito.<br />
                    Come si vede chiaramente nell'areogramma, lo spicchio blu del <strong>Pianoforte</strong> supera abbondantemente la metà della torta (più del 50%).<br />
                    <strong>Quanti ragazzi hanno scelto il pianoforte?</strong>
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { opt: "A", val: "60 studenti" },
                      { opt: "B", val: "100 studenti" },
                      { opt: "C", val: "180 studenti", correct: true },
                      { opt: "D", val: "290 studenti" },
                    ].map((btn) => (
                      <button
                        key={btn.opt}
                        onClick={() => setInvalsiChoice(btn.opt)}
                        className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                          invalsiChoice === btn.opt
                            ? btn.correct
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                              : "bg-rose-600 text-white border-rose-600 shadow-sm"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{btn.opt}. {btn.val}</span>
                        {invalsiChoice === btn.opt && (btn.correct ? "✓" : "✗")}
                      </button>
                    ))}
                  </div>

                  {invalsiChoice && (
                    <p className={`text-xs font-bold ${invalsiChoice === "C" ? "text-emerald-700" : "text-rose-700"}`}>
                      {invalsiChoice === "C"
                        ? "Esatto! La metà esatta di 300 studenti è 150: il settore del pianoforte è l'unico superiore a 150 (cioè 180 studenti). 290 sarebbe stato quasi l'intero cerchio."
                        : "Attenzione: la metà esatta di 300 corrisponde a 150. Lo spicchio blu supera chiaramente il semicerchio, quindi il valore deve essere maggiore di 150!"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
