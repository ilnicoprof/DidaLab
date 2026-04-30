import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, ChevronRight,
  RotateCcw, Play, Pause, Lightbulb, BookOpen, ArrowRight
} from "lucide-react";

interface Props {
  onBack: () => void;
  subjectName: string;
  topicName: string;
}

export default function NumberLineLesson({ onBack, subjectName, topicName }: Props) {
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(15);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showEvenOdd, setShowEvenOdd] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState<number | null>(null);
  const [compareB, setCompareB] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  const [countFrom, setCountFrom] = useState(0);
  const [countTo, setCountTo] = useState(10);
  const [countCurrent, setCountCurrent] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ x: 0, rs: 0, re: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const SVG_W = 1000;
  const PAD = 60;
  const LINE_Y = 80;
  const rangeSize = rangeEnd - rangeStart;
  const spacing = rangeSize > 0 ? (SVG_W - 2 * PAD) / rangeSize : SVG_W - 2 * PAD;
  const getX = (n: number) => PAD + (n - rangeStart) * spacing;

  // Zoom
  const zoomIn = () => {
    if (rangeSize <= 5) return;
    const mid = (rangeStart + rangeEnd) / 2;
    const h = Math.floor(rangeSize / 4);
    setRangeStart(Math.max(0, Math.round(mid - h)));
    setRangeEnd(Math.round(mid + h));
  };
  const zoomOut = () => {
    if (rangeSize >= 50) return;
    const h = rangeSize;
    const mid = (rangeStart + rangeEnd) / 2;
    setRangeStart(Math.max(0, Math.round(mid - h)));
    setRangeEnd(Math.round(mid + h));
  };

  // Pan
  const panLeft = () => {
    const s = Math.max(1, Math.floor(rangeSize / 4));
    const ns = Math.max(0, rangeStart - s);
    setRangeEnd(rangeEnd - (rangeStart - ns));
    setRangeStart(ns);
  };
  const panRight = () => {
    const s = Math.max(1, Math.floor(rangeSize / 4));
    setRangeStart(rangeStart + s);
    setRangeEnd(rangeEnd + s);
  };

  // Drag
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { x: e.clientX, rs: rangeStart, re: rangeEnd };
  }, [rangeStart, rangeEnd]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const w = containerRef.current.getBoundingClientRect().width;
      const dx = e.clientX - dragRef.current.x;
      const shift = Math.round(-dx / (w / rangeSize));
      const ns = Math.max(0, dragRef.current.rs + shift);
      setRangeStart(ns);
      setRangeEnd(ns + (dragRef.current.re - dragRef.current.rs));
    };
    const onUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, rangeSize]);

  // Number click
  const handleClick = (n: number) => {
    if (compareMode) {
      if (compareA === null) setCompareA(n);
      else if (compareB === null) setCompareB(n);
      else { setCompareA(n); setCompareB(null); }
    } else {
      setSelectedNumber(selectedNumber === n ? null : n);
    }
  };

  // Counting animation
  const startCounting = () => {
    stopCounting();
    const from = Math.min(countFrom, countTo);
    const to = Math.max(countFrom, countTo);
    setCountCurrent(from);
    setIsCounting(true);
    // Adjust range to show the counting
    if (from < rangeStart || to > rangeEnd) {
      setRangeStart(Math.max(0, from - 1));
      setRangeEnd(to + 1);
    }
    let cur = from;
    countRef.current = setInterval(() => {
      cur++;
      if (cur > to) {
        stopCounting();
        return;
      }
      setCountCurrent(cur);
    }, 600);
  };
  const stopCounting = () => {
    if (countRef.current) clearInterval(countRef.current);
    countRef.current = null;
    setIsCounting(false);
    setCountCurrent(null);
  };
  useEffect(() => () => { if (countRef.current) clearInterval(countRef.current); }, []);

  const reset = () => {
    setRangeStart(0); setRangeEnd(15);
    setSelectedNumber(null); setShowEvenOdd(false);
    setCompareMode(false); setCompareA(null); setCompareB(null);
    stopCounting();
  };

  // Build numbers array
  const numbers: number[] = [];
  for (let i = rangeStart; i <= rangeEnd; i++) numbers.push(i);

  const getColor = (n: number) => {
    if (countCurrent === n) return { fill: "#EF7D00", text: "#fff", ring: true };
    if (compareMode && compareA === n) return { fill: "#0070B8", text: "#fff", ring: true };
    if (compareMode && compareB === n) return { fill: "#EF7D00", text: "#fff", ring: true };
    if (selectedNumber === n) return { fill: "#0070B8", text: "#fff", ring: true };
    if (showEvenOdd && n % 2 === 0) return { fill: "#DBEAFE", text: "#1E40AF", ring: false };
    if (showEvenOdd && n % 2 !== 0) return { fill: "#FFEDD5", text: "#C2410C", ring: false };
    return { fill: "#F1F5F9", text: "#334155", ring: false };
  };

  const isEven = (n: number) => n % 2 === 0;

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
            <p className="text-lg font-bold text-slate-700">I numeri naturali</p>
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
              <h3 className="text-xl font-bold text-slate-800 mb-2">Cosa sono i numeri naturali?</h3>
              <p className="text-slate-600 leading-relaxed">
                I <strong>numeri naturali</strong> sono i numeri che usiamo per contare: <strong>0, 1, 2, 3, 4, 5, ...</strong>{" "}
                L'insieme dei numeri naturali si indica con la lettera <strong className="text-dida-blue text-lg">ℕ</strong>.
                Esplora la retta dei numeri qui sotto per scoprire le loro proprietà!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Number Line Card */}
      <div className="px-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-800">La Retta dei Numeri</h3>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={panLeft} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition" title="Scorri a sinistra">
                <ChevronLeft size={18} />
              </button>
              <button onClick={panRight} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition" title="Scorri a destra">
                <ChevronRight size={18} />
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1" />
              <button onClick={zoomIn} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition" title="Zoom in">
                <ZoomIn size={18} />
              </button>
              <button onClick={zoomOut} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition" title="Zoom out">
                <ZoomOut size={18} />
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1" />
              <button
                onClick={() => setShowEvenOdd(!showEvenOdd)}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition ${showEvenOdd ? "bg-dida-blue text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
              >
                Pari / Dispari
              </button>
              <button
                onClick={() => { setCompareMode(!compareMode); setCompareA(null); setCompareB(null); }}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition ${compareMode ? "bg-dida-orange text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
              >
                Confronta
              </button>
              <button onClick={reset} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition" title="Reset">
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {compareMode && (
            <p className="text-sm text-dida-orange font-semibold">
              Modalità confronto: clicca su due numeri sulla retta per confrontarli.
              {compareA !== null && ` Primo: ${compareA}.`}
              {compareB !== null && ` Secondo: ${compareB}.`}
            </p>
          )}

          {/* SVG Number Line */}
          <div
            ref={containerRef}
            className={`w-full overflow-hidden select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            onMouseDown={onMouseDown}
          >
            <svg viewBox={`0 0 ${SVG_W} 160`} className="w-full h-auto" style={{ minHeight: 120 }}>
              {/* Main line */}
              <line x1={PAD - 20} y1={LINE_Y} x2={SVG_W - PAD + 20} y2={LINE_Y} stroke="#CBD5E1" strokeWidth={3} strokeLinecap="round" />
              {/* Arrow left */}
              <polygon points={`${PAD - 30},${LINE_Y} ${PAD - 15},${LINE_Y - 8} ${PAD - 15},${LINE_Y + 8}`} fill="#CBD5E1" />
              {/* Arrow right */}
              <polygon points={`${SVG_W - PAD + 30},${LINE_Y} ${SVG_W - PAD + 15},${LINE_Y - 8} ${SVG_W - PAD + 15},${LINE_Y + 8}`} fill="#CBD5E1" />

              {numbers.map((n) => {
                const x = getX(n);
                const col = getColor(n);
                const showLabel = rangeSize <= 30 || n % Math.ceil(rangeSize / 20) === 0;
                const tickH = n % 5 === 0 ? 16 : 10;
                return (
                  <g key={n} onClick={() => handleClick(n)} className="cursor-pointer">
                    {/* Tick */}
                    <line x1={x} y1={LINE_Y - tickH} x2={x} y2={LINE_Y + tickH} stroke={col.ring ? col.fill : "#94A3B8"} strokeWidth={col.ring ? 3 : 1.5} />
                    {/* Circle marker */}
                    {(col.ring || showEvenOdd) && (
                      <>
                        {col.ring && (
                          <circle cx={x} cy={LINE_Y - tickH - 22} r={18} fill={col.fill} opacity={0.15}>
                            <animate attributeName="r" values="18;22;18" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <circle cx={x} cy={LINE_Y - tickH - 22} r={15} fill={col.fill} />
                        <text x={x} y={LINE_Y - tickH - 17} textAnchor="middle" fill={col.text} fontSize={12} fontWeight={700}>
                          {n}
                        </text>
                      </>
                    )}
                    {/* Number label */}
                    {showLabel && (
                      <text x={x} y={LINE_Y + tickH + 22} textAnchor="middle" fill={col.ring ? col.fill : "#64748B"} fontSize={rangeSize > 25 ? 11 : 14} fontWeight={col.ring ? 800 : 500}>
                        {n}
                      </text>
                    )}
                    {/* Invisible hit area */}
                    <rect x={x - spacing / 2} y={LINE_Y - 50} width={spacing} height={100} fill="transparent" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Even/Odd legend */}
          {showEvenOdd && (
            <div className="flex items-center gap-4 text-sm font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-200 inline-block" /> Pari</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-200 inline-block" /> Dispari</span>
            </div>
          )}
        </div>
      </div>

      {/* Info panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {/* Selected Number Info */}
        <AnimatePresence mode="wait">
          {selectedNumber !== null && !compareMode && (
            <motion.div
              key={`info-${selectedNumber}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
            >
              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-dida-blue text-white flex items-center justify-center text-sm font-black">{selectedNumber}</span>
                Proprietà del numero
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-500 font-medium">Precedente</span>
                  <span className="font-bold text-slate-800">
                    {selectedNumber > 0 ? selectedNumber - 1 : <span className="text-red-400 text-sm">Non esiste (0 è il primo!)</span>}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-500 font-medium">Successivo</span>
                  <span className="font-bold text-slate-800">{selectedNumber + 1}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-500 font-medium">Tipo</span>
                  <span className={`font-bold px-3 py-1 rounded-full text-sm ${isEven(selectedNumber) ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                    {isEven(selectedNumber) ? "Pari" : "Dispari"}
                  </span>
                </div>
                {selectedNumber > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-500 font-medium text-sm block mb-2">Rappresentazione</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from({ length: Math.min(selectedNumber, 50) }, (_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className={`w-4 h-4 rounded-full ${isEven(selectedNumber) ? "bg-blue-300" : "bg-orange-300"}`}
                        />
                      ))}
                      {selectedNumber > 50 && <span className="text-slate-400 text-xs self-center ml-1">...+{selectedNumber - 50}</span>}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare Result */}
        <AnimatePresence mode="wait">
          {compareMode && compareA !== null && compareB !== null && (
            <motion.div
              key={`compare-${compareA}-${compareB}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
            >
              <h4 className="text-lg font-bold text-slate-800 mb-4">Confronto</h4>
              <div className="flex items-center justify-center gap-4 text-4xl font-black py-4">
                <span className="text-dida-blue">{compareA}</span>
                <span className="text-dida-orange">
                  {compareA < compareB ? "<" : compareA > compareB ? ">" : "="}
                </span>
                <span className="text-dida-orange">{compareB}</span>
              </div>
              <p className="text-center text-slate-600 mt-2">
                {compareA < compareB
                  ? `${compareA} è minore di ${compareB} perché si trova più a sinistra sulla retta.`
                  : compareA > compareB
                    ? `${compareA} è maggiore di ${compareB} perché si trova più a destra sulla retta.`
                    : `I due numeri sono uguali!`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Counting Tool */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ArrowRight className="text-dida-teal" size={20} />
            Conta!
          </h4>
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Da</label>
              <input
                type="number"
                min={0}
                value={countFrom}
                onChange={(e) => setCountFrom(Math.max(0, +e.target.value))}
                className="block w-20 mt-1 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-dida-teal/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">A</label>
              <input
                type="number"
                min={0}
                value={countTo}
                onChange={(e) => setCountTo(Math.max(0, +e.target.value))}
                className="block w-20 mt-1 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-dida-teal/30"
              />
            </div>
            <button
              onClick={isCounting ? stopCounting : startCounting}
              className={`px-5 py-2 rounded-xl font-bold text-white transition flex items-center gap-2 ${isCounting ? "bg-red-400 hover:bg-red-500" : "bg-dida-teal hover:bg-[#1f8c82]"}`}
            >
              {isCounting ? <><Pause size={16} /> Stop</> : <><Play size={16} /> Avvia</>}
            </button>
          </div>
          {countCurrent !== null && (
            <motion.div
              key={countCurrent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 text-center"
            >
              <span className="text-5xl font-black text-dida-orange">{countCurrent}</span>
            </motion.div>
          )}
        </div>

        {/* Predecessor/Successor Explorer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h4 className="text-lg font-bold text-slate-800 mb-3">Precedente e Successivo</h4>
          <p className="text-slate-500 text-sm mb-4">
            Ogni numero naturale ha un <strong>successivo</strong> (il numero dopo).
            Tutti tranne lo <strong>0</strong> hanno un <strong>precedente</strong> (il numero prima).
          </p>
          <div className="flex items-center justify-center gap-2">
            {selectedNumber !== null ? (
              <div className="flex items-center gap-3 text-2xl font-black">
                <span className="text-slate-300">{selectedNumber > 0 ? selectedNumber - 1 : "—"}</span>
                <span className="text-slate-300">←</span>
                <span className="text-dida-blue bg-blue-50 px-4 py-2 rounded-xl">{selectedNumber}</span>
                <span className="text-slate-300">→</span>
                <span className="text-slate-300">{selectedNumber + 1}</span>
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic">Clicca un numero sulla retta per vedere precedente e successivo.</p>
            )}
          </div>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="px-4 pb-12">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-lg">
          <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Lightbulb className="text-dida-orange" size={20} />
            Concetti chiave
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "L'insieme ℕ", desc: "I numeri naturali formano l'insieme ℕ = {0, 1, 2, 3, 4, ...}. È un insieme infinito: non esiste un numero naturale più grande di tutti." },
              { title: "Successivo", desc: "Ogni numero naturale n ha un successivo n + 1. Ad esempio, il successivo di 7 è 8." },
              { title: "Precedente", desc: "Ogni numero naturale n (tranne 0) ha un precedente n − 1. Lo 0 è il più piccolo numero naturale." },
              { title: "Pari e Dispari", desc: "Un numero è pari se è divisibile per 2 (0, 2, 4, 6, ...), dispari altrimenti (1, 3, 5, 7, ...)." },
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
