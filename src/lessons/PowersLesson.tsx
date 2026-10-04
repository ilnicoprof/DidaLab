import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, BookOpen, Zap, AlertCircle, Box, Grid, Trophy
} from "lucide-react";
import { superscript } from "../lib/math";

interface Props {
  key?: string;
  onBack: () => void;
  subjectName: string;
  topicName: string;
  initialSubtopicId?: string;
  initialTab?: "impara" | "allena";
}

const SUBTOPICS = [
  { id: "power", title: "Cos'è una Potenza e Casi Speciali", short: "1. La Potenza" },
  { id: "geometric-powers", title: "Quadrato, Cubo e Potenze di 10", short: "2. Quadrato e Cubo" },
  { id: "power-properties-same-base", title: "Proprietà con la Stessa Base", short: "3. Stessa Base" },
  { id: "power-properties-same-exponent", title: "Proprietà con lo Stesso Esponente", short: "4. Stesso Esponente" },
  { id: "scientific-notation", title: "Notazione Scientifica e Ordine di Grandezza", short: "5. Numeri Giganti" },
];

export default function PowersLesson({
  onBack,
  subjectName,
  initialSubtopicId,
  initialTab = "impara",
}: Props) {
  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>(() => {
    if (initialSubtopicId && SUBTOPICS.some(s => s.id === initialSubtopicId)) {
      return initialSubtopicId;
    }
    return "power";
  });

  // ==========================================
  // --- STATI LABORATORI INTERATTIVI (IMPARA) ---
  // ==========================================

  // Modulo 1: Simulatore Piegatura Foglio
  const [pieghe, setPieghe] = useState<number>(3); // 2^3 = 8 strati

  // Modulo 2: Quadrato e Cubo geometrico
  const [geoLato, setGeoLato] = useState<number>(3);

  // Modulo 3 & 4: Laboratorio Proprietà
  const [propA, setPropA] = useState<number>(4);
  const [propM, setPropM] = useState<number>(3);
  const [propN, setPropN] = useState<number>(2);

  // Modulo 4: Laboratorio Stesso Esponente
  const [expBaseA, setExpBaseA] = useState<number>(12);
  const [expBaseB, setExpBaseB] = useState<number>(3);
  const [expN, setExpN] = useState<number>(3);

  // Modulo 5: Notazione Scientifica
  const [giantNumber, setGiantNumber] = useState<number>(85000000000);

  // ==========================================
  // --- STATI ESERCIZI (ALLENA) ---
  // ==========================================
  const [exBaseAnswers, setExBaseAnswers] = useState<Record<number, string | null>>({});
  const [exPropAnswers, setExPropAnswers] = useState<Record<number, string | null>>({});
  const [invalsiAnswers, setInvalsiAnswers] = useState<Record<string, any>>({});
  const [vfAnswers, setVfAnswers] = useState<Record<number, boolean | null>>({});

  // Calcolo notazione scientifica di giantNumber
  const sciInfo = useMemo(() => {
    if (giantNumber <= 0) return { k: 0, exp: 0, orderExp: 0 };
    const exp = Math.floor(Math.log10(giantNumber));
    const k = giantNumber / Math.pow(10, exp);
    // Ordine di grandezza (regola dei libri di testo): k < 5 → 10^n, k ≥ 5 → 10^(n+1)
    const orderExp = k < 5 ? exp : exp + 1;

    return {
      k: Math.round(k * 100) / 100,
      exp,
      orderExp,
    };
  }, [giantNumber]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-7xl mx-auto space-y-8 pb-16"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-dida-blue hover:border-dida-blue/30 transition shadow-sm cursor-pointer"
            title="Torna agli argomenti"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Classe 1ª · Aritmetica
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {subjectName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Le Potenze: Numeri che Crescono in Fretta
            </h1>
          </div>
        </div>

        {/* Toggle Modalità: Impara / Allena */}
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

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "impara" ? (
          <motion.div
            key="tab-impara-powers"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4"
          >
            {/* Menu Laterale Sottoargomenti */}
            <div className="lg:col-span-3 space-y-2">
              {SUBTOPICS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubtopic(sub.id)}
                  className={`w-full text-left p-4 rounded-2xl transition cursor-pointer border ${
                    selectedSubtopic === sub.id
                      ? "bg-dida-blue text-white border-dida-blue shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="font-bold text-sm leading-tight">{sub.title}</div>
                </button>
              ))}
            </div>

            {/* Area Contenuto */}
            <div className="lg:col-span-9 min-w-0 space-y-8">

            {/* ======================================================== */}
            {/* MODULO 1: COS'È UNA POTENZA E CASI SPECIALI */}
            {/* ======================================================== */}
            {selectedSubtopic === "power" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dida-blue bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                      Lezione 1 · Moltiplicazione Ripetuta
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Cos'è una Potenza? Base, Esponente e Valore
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      La potenza è la scrittura sintetica di una <strong>moltiplicazione avente tutti i fattori uguali tra loro</strong>.
                    </p>
                  </div>

                  {/* Schema Base ed Esponente */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 text-center space-y-2">
                      <span className="text-xs font-bold text-dida-blue uppercase">Fattori Ripetuti</span>
                      <div className="font-mono text-2xl font-black text-slate-800">
                        3 × 3 × 3 × 3 = 81
                      </div>
                      <p className="text-xs text-slate-500">Il fattore 3 compare moltiplicato per se stesso 4 volte.</p>
                    </div>

                    <span className="text-2xl font-black text-slate-400">corrisponde a</span>

                    <div className="p-6 rounded-3xl bg-amber-50/80 border-2 border-amber-300 text-center space-y-2 shadow-sm">
                      <div className="inline-flex items-baseline font-mono font-black text-slate-900">
                        <span className="text-5xl text-dida-blue">3</span>
                        <span className="text-3xl text-amber-600 -translate-y-4">⁴</span>
                        <span className="text-4xl text-slate-400 mx-2">=</span>
                        <span className="text-5xl text-emerald-600">81</span>
                      </div>
                      <div className="flex justify-center gap-4 text-xs font-bold pt-1">
                        <span className="text-dida-blue">Base = 3</span>
                        <span className="text-amber-600">Esponente = 4</span>
                        <span className="text-emerald-700">Valore = 81</span>
                      </div>
                    </div>
                  </div>

                  {/* Attenzione all'errore tipico */}
                  <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-xs font-black uppercase text-rose-800 tracking-wider inline-flex items-center gap-1.5">
                      <AlertCircle size={15} /> Attenzione al Trabocchetto Più Comune!
                    </span>
                    <div className="font-mono text-xl font-black text-rose-950">
                      6³ NON è 6 × 3 !
                    </div>
                    <p className="text-xs text-rose-900">
                      <span className="font-bold">6³ = 6 × 6 × 6 = 216</span>, mentre <span className="font-bold">6 × 3 = 18</span>. <br />
                      L'esponente NON moltiplica la base: dice quante volte la base deve moltiplicarsi per se stessa!
                    </p>
                  </div>

                  {/* Casi Particolari */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Esponente 1</span>
                      <span className="text-2xl font-mono font-black text-slate-800 block">15¹ = 15</span>
                      <p className="text-[11px] text-slate-500">Resta il numero stesso</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Base 1</span>
                      <span className="text-2xl font-mono font-black text-slate-800 block">1⁷ = 1</span>
                      <p className="text-[11px] text-slate-500">1 moltiplicato dà sempre 1</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Base 0</span>
                      <span className="text-2xl font-mono font-black text-slate-800 block">0³ = 0</span>
                      <p className="text-[11px] text-slate-500">0 per se stesso dà sempre 0</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-center space-y-1">
                      <span className="text-xs font-bold text-amber-800 uppercase">Esponente 0 ⭐</span>
                      <span className="text-2xl font-mono font-black text-amber-900 block">4⁰ = 1</span>
                      <p className="text-[11px] text-amber-800">Qualsiasi base ≠ 0 elevata a 0 fa 1!</p>
                    </div>
                  </div>

                  {/* WIDGET INTERATTIVO: La Piegatura del Foglio */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Esperimento Scientifico · La Crescita Esponenziale
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Quante Volte Puoi Piegare un Foglio?
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        Ad ogni piegatura a metà, il numero di strati <strong>raddoppia</strong>: scopri come un semplice foglio cresce a dismisura con le potenze di 2!
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                      <div className="space-y-3 text-center bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
                        <label className="text-xs text-slate-500 font-bold block uppercase tracking-wider">
                          Numero di pieghe: <strong className="text-xl text-dida-orange font-mono">{pieghe}</strong>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={pieghe}
                          onChange={(e) => setPieghe(parseInt(e.target.value))}
                          className="w-56 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 w-56 mx-auto">
                          <span>0 pieghe</span>
                          <span>5 pieghe</span>
                          <span>10 pieghe</span>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-white border-2 border-orange-200 text-center space-y-2 w-72 shadow-sm">
                        <span className="text-xs text-dida-orange uppercase font-bold tracking-wider block">
                          Formula Potenza di 2:
                        </span>
                        <div className="font-mono text-3xl font-black text-slate-800">
                          2^{pieghe} = <span className="text-dida-blue">{Math.pow(2, pieghe)}</span>
                        </div>
                        <span className="text-xs text-slate-600 block font-bold">
                          strati di carta sovrapposti!
                        </span>
                        <p className="text-[11px] text-slate-500 pt-1">
                          {pieghe === 0 && "Foglio intero: 1 strato iniziale."}
                          {pieghe >= 1 && pieghe <= 3 && "Piegatura facile: strati sottili."}
                          {pieghe >= 4 && pieghe <= 6 && "Inizia a diventare rigido come un cartoncino!"}
                          {pieghe >= 7 && "Spessore pari a un grosso libro! Nella realtà è quasi impossibile piegarlo più di 7 volte!"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: QUADRATO, CUBO E POTENZE DI 10 */}
            {/* ======================================================== */}
            {selectedSubtopic === "geometric-powers" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
                      Lezione 2 · Geometria delle Potenze
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Perché si Chiamano «Quadrato» e «Cubo»?
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      La potenza con esponente <strong>2</strong> calcola l'area di un quadrato di lato fissato. La potenza con esponente <strong>3</strong> calcola il volume di un cubo!
                    </p>
                  </div>

                  {/* Quadrato e Cubo Visivo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 text-center space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-blue-200 text-xs font-bold text-dida-blue">
                        <Grid size={14} /> Esponente 2 · Al Quadrato
                      </div>
                      <div className="font-mono text-3xl font-black text-slate-800">
                        {geoLato}² = {geoLato * geoLato}
                      </div>
                      <p className="text-xs text-slate-600">
                        Una griglia quadrata di lato {geoLato} contiene esattamente <strong>{geoLato * geoLato} piastrelle</strong> quadrate.
                      </p>
                      {/* Griglia grafica */}
                      <div className="flex justify-center py-2">
                        <div
                          className="grid gap-1 bg-white p-2 rounded-xl border border-blue-300 shadow-sm"
                          style={{
                            gridTemplateColumns: `repeat(${geoLato}, minmax(0, 1fr))`,
                            width: `${geoLato * 28 + 16}px`,
                          }}
                        >
                          {Array.from({ length: geoLato * geoLato }).map((_, idx) => (
                            <div key={idx} className="w-6 h-6 bg-dida-blue rounded-md" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-purple-50/70 border-2 border-purple-200 text-center space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-purple-200 text-xs font-bold text-purple-700">
                        <Box size={14} /> Esponente 3 · Al Cubo
                      </div>
                      <div className="font-mono text-3xl font-black text-slate-800">
                        {geoLato}³ = {geoLato * geoLato * geoLato}
                      </div>
                      <p className="text-xs text-slate-600">
                        Un cubo solido di lato {geoLato} è formato da <strong>{geoLato * geoLato * geoLato} cubetti</strong> (come il Cubo di Rubik: 3³ = 27 cubetti!).
                      </p>
                      <div className="p-4 bg-white rounded-2xl border border-purple-200 text-xs font-bold text-purple-900 inline-block shadow-sm">
                        {geoLato} strati da {geoLato * geoLato} cubetti ciascuno = {geoLato * geoLato * geoLato} cubetti totali!
                      </div>
                    </div>
                  </div>

                  {/* Selettore lato interattivo */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Cambia la misura del lato:</span>
                    {[2, 3, 4, 5].map((l) => (
                      <button
                        key={l}
                        onClick={() => setGeoLato(l)}
                        className={`w-9 h-9 rounded-xl font-bold font-mono text-sm transition cursor-pointer border ${
                          geoLato === l
                            ? "bg-dida-blue text-white border-blue-600 shadow-md scale-105"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  {/* Le Potenze di 10 */}
                  <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black uppercase text-amber-700">
                        La Magia della Base 10
                      </span>
                      <h3 className="text-xl font-black text-slate-900">L'Esponente Conta il Numero di Zeri!</h3>
                      <p className="text-xs text-slate-600 max-w-lg mx-auto">
                        Nelle potenze con base 10, il valore è dato dalla cifra 1 seguita da tanti zeri quanti ne indica l'esponente:
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center font-mono">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-sm font-black text-dida-blue block">10¹ = 10</span>
                        <span className="text-[10px] text-slate-400 font-sans">1 zero (dieci)</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-sm font-black text-dida-blue block">10² = 100</span>
                        <span className="text-[10px] text-slate-400 font-sans">2 zeri (cento)</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-sm font-black text-dida-blue block">10³ = 1000</span>
                        <span className="text-[10px] text-slate-400 font-sans">3 zeri (mille = 1 km)</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-sm font-black text-dida-blue block">10⁶ = 1.000.000</span>
                        <span className="text-[10px] text-slate-400 font-sans">6 zeri (un milione)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: PROPRIETÀ CON LA STESSA BASE */}
            {/* ======================================================== */}
            {selectedSubtopic === "power-properties-same-base" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200/80 shadow-xs">
                      Lezione 3 · Scorciatoie di Calcolo
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Le Proprietà delle Potenze: Stessa Base
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Quando due potenze hanno la <strong>stessa base</strong>, non serve calcolare i valori enormi: basta operare sugli esponenti!
                    </p>
                  </div>

                  {/* Le 3 Regole Stessa Base */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-dida-blue">1. Prodotto: Somma Esponenti</span>
                      <div className="font-mono text-xl font-black text-slate-800">
                        aᵐ × aⁿ = aᵐ⁺ⁿ
                      </div>
                      <p className="text-xs text-slate-600">
                        4³ × 4² = (4 × 4 × 4) × (4 × 4) = <strong>4⁵</strong>
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700">2. Quoziente: Sottrai Esponenti</span>
                      <div className="font-mono text-xl font-black text-slate-800">
                        aᵐ : aⁿ = aᵐ⁻ⁿ
                      </div>
                      <p className="text-xs text-slate-600">
                        6⁵ : 6³ = 6⁵⁻³ = <strong>6²</strong>
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-purple-50 border-2 border-purple-200 space-y-2 text-center">
                      <span className="text-xs font-black uppercase text-purple-700">3. Potenza di Potenza: Moltiplica</span>
                      <div className="font-mono text-xl font-black text-slate-800">
                        (aᵐ)ⁿ = aᵐˣⁿ
                      </div>
                      <p className="text-xs text-slate-600">
                        (4²)³ = 4² × 4² × 4² = 4²ˣ³ = <strong>4⁶</strong>
                      </p>
                    </div>
                  </div>

                  {/* Avvertimento Cruciale */}
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center font-bold text-xs text-amber-950">
                    ⚠️ Ricorda: Le proprietà valgono <strong>ESCLUSIVAMENTE per la moltiplicazione (×) e la divisione (:)</strong>! <br />
                    Con l'addizione non funzionano: <span className="font-mono text-sm">2² + 2³ = 4 + 8 = 12 ≠ 2⁵</span>!
                  </div>

                  {/* WIDGET INTERATTIVO: Calcolatore Guidato Stessa Base */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio Interattivo · Verifica le Regole
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Costruisci e Verifica la Scorciatoia
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        Scegli la base e gli esponenti per visualizzare lo svolgimento:
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-center">
                      <div className="bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Base comune (a)</span>
                        <input
                          type="number"
                          value={propA}
                          onChange={(e) => setPropA(Math.max(2, parseInt(e.target.value) || 2))}
                          className="w-20 text-center text-lg font-mono font-bold bg-orange-50/40 border-2 border-orange-200 rounded-xl py-1.5 text-slate-800 focus:outline-none focus:border-dida-orange"
                        />
                      </div>
                      <div className="bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Esponente m</span>
                        <input
                          type="number"
                          value={propM}
                          onChange={(e) => setPropM(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center text-lg font-mono font-bold bg-blue-50/40 border-2 border-blue-200 rounded-xl py-1.5 text-slate-800 focus:outline-none focus:border-dida-blue"
                        />
                      </div>
                      <div className="bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Esponente n</span>
                        <input
                          type="number"
                          value={propN}
                          onChange={(e) => setPropN(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center text-lg font-mono font-bold bg-blue-50/40 border-2 border-blue-200 rounded-xl py-1.5 text-slate-800 focus:outline-none focus:border-dida-blue"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-center font-mono">
                      <div className="p-5 bg-white rounded-2xl border-2 border-slate-200 space-y-1 shadow-xs">
                        <span className="text-xs text-dida-blue font-sans font-bold block uppercase tracking-wider">Prodotto:</span>
                        <div className="text-xl font-black text-slate-800">
                          {propA}^{propM} × {propA}^{propN} = <span className="text-dida-orange">{propA}^{propM + propN}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-sans">
                          Somma esponenti: {propM} + {propN} = {propM + propN}
                        </span>
                      </div>

                      <div className="p-5 bg-white rounded-2xl border-2 border-slate-200 space-y-1 shadow-xs">
                        <span className="text-xs text-emerald-700 font-sans font-bold block uppercase tracking-wider">Quoziente:</span>
                        <div className="text-xl font-black text-slate-800">
                          {propA}^{propM} : {propA}^{propN} = <span className="text-emerald-700">{propM >= propN ? `${propA}^${propM - propN}` : "m deve essere ≥ n"}</span>
                        </div>
                        {propM >= propN && (
                          <span className="text-[11px] text-slate-500 font-sans">
                            Sottrazione: {propM} − {propN} = {propM - propN}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: PROPRIETÀ CON LO STESSO ESPONENTE */}
            {/* ======================================================== */}
            {selectedSubtopic === "power-properties-same-exponent" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200/80 shadow-xs">
                      Lezione 4 · Basi Diverse, Stesso Esponente
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Le Proprietà delle Potenze: Stesso Esponente
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      Se l'esponente è identico, possiamo moltiplicare o dividere direttamente le basi tra loro, mantenendo l'esponente comune!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-3 text-center">
                      <span className="text-xs font-black uppercase text-dida-blue">
                        Prodotto con Stesso Esponente
                      </span>
                      <div className="font-mono text-2xl font-black text-slate-900">
                        aⁿ × bⁿ = (a × b)ⁿ
                      </div>
                      <p className="text-xs text-slate-600">
                        Esempio: <span className="font-mono font-bold text-slate-800">4³ × 5³ = (4 × 5)³ = 20³ = 8000</span>!
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs text-slate-500 font-medium">
                        Molto più veloce che calcolare prima 64 × 125!
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-3 text-center">
                      <span className="text-xs font-black uppercase text-emerald-700">
                        Quoziente con Stesso Esponente
                      </span>
                      <div className="font-mono text-2xl font-black text-slate-900">
                        aⁿ : bⁿ = (a : b)ⁿ
                      </div>
                      <p className="text-xs text-slate-600">
                        Esempio: <span className="font-mono font-bold text-slate-800">12³ : 3³ = (12 : 3)³ = 4³ = 64</span>!
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-500 font-medium">
                        Molto più rapido di 1728 : 27!
                      </div>
                    </div>
                  </div>

                  {/* Laboratorio: prova tu con basi ed esponente a scelta */}
                  <div className="p-6 rounded-3xl bg-purple-50/60 border-2 border-purple-200 space-y-4">
                    <p className="text-xs font-black uppercase text-purple-700 text-center">Laboratorio · Prova con i tuoi numeri</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {[
                        { label: "Base a", value: expBaseA, set: setExpBaseA, min: 1, max: 20 },
                        { label: "Base b", value: expBaseB, set: setExpBaseB, min: 1, max: 20 },
                        { label: "Esponente n", value: expN, set: setExpN, min: 0, max: 4 },
                      ].map((f) => (
                        <label key={f.label} className="flex flex-col items-center gap-1 text-[11px] font-bold uppercase text-slate-500">
                          {f.label}
                          <input
                            type="number"
                            min={f.min}
                            max={f.max}
                            value={f.value}
                            onChange={(e) => f.set(Math.min(f.max, Math.max(f.min, parseInt(e.target.value) || f.min)))}
                            className="w-20 text-center text-xl font-mono font-black bg-white border-2 border-purple-300 rounded-xl py-1 text-slate-800 focus:outline-none focus:border-purple-600"
                          />
                        </label>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-sm font-bold text-center">
                      <div className="p-3 bg-white rounded-xl border border-blue-200 text-slate-800">
                        {expBaseA}{superscript(expN)} × {expBaseB}{superscript(expN)} = ({expBaseA} × {expBaseB}){superscript(expN)} = {expBaseA * expBaseB}{superscript(expN)} ={" "}
                        <span className="text-dida-blue">{Math.pow(expBaseA * expBaseB, expN).toLocaleString("it-IT")}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-emerald-200 text-slate-800">
                        {expBaseA % expBaseB === 0 ? (
                          <>
                            {expBaseA}{superscript(expN)} : {expBaseB}{superscript(expN)} = ({expBaseA} : {expBaseB}){superscript(expN)} = {expBaseA / expBaseB}{superscript(expN)} ={" "}
                            <span className="text-emerald-700">{Math.pow(expBaseA / expBaseB, expN).toLocaleString("it-IT")}</span>
                          </>
                        ) : (
                          <span className="text-xs font-sans text-slate-500">Per il quoziente scegli a divisibile per b (es. 12 e 3).</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Problema Pratico */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-black text-slate-800 text-center">
                      Un Caso Reale: I Bouquet di Fiori
                    </h4>
                    <p className="text-xs text-slate-600 text-center max-w-xl mx-auto">
                      Un fioraio ha a disposizione <span className="font-mono font-bold">15³ = 3375</span> rose e prepara <span className="font-mono font-bold">5³ = 125</span> bouquet identici. Quante rose ci sono in ciascun bouquet?
                    </p>
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center font-mono font-black text-base text-dida-blue max-w-md mx-auto">
                      15³ : 5³ = (15 : 5)³ = 3³ = 27 rose a bouquet!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: NOTAZIONE SCIENTIFICA E ORDINE DI GRANDEZZA */}
            {/* ======================================================== */}
            {selectedSubtopic === "scientific-notation" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5 md:gap-4 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-4 py-1.5 rounded-full border border-sky-200/80 shadow-xs">
                      Lezione 5 · Numeri Giganti
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      Notazione Scientifica e Ordine di Grandezza
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      In astronomia, biologia e fisica i numeri hanno decine di zeri. La notazione scientifica permette di scriverli e confrontarli in modo compatto ed elegante!
                    </p>
                  </div>

                  {/* Regola della Notazione Scientifica */}
                  <div className="p-6 rounded-3xl bg-sky-50/80 border-2 border-sky-300 text-center space-y-3">
                    <span className="text-xs font-black uppercase text-sky-900 tracking-wider">
                      La Regola Aurea
                    </span>
                    <div className="text-2xl font-mono font-black text-sky-950">
                      k × 10ⁿ &nbsp; con &nbsp; 1 ≤ k &lt; 10
                    </div>
                    <p className="text-xs text-sky-900 max-w-lg mx-auto">
                      Una <strong>sola cifra diversa da zero prima della virgola</strong>, moltiplicata per un'opportuna potenza di 10.
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-sky-200 inline-block font-mono text-sm font-bold text-slate-800">
                      85.000.000.000 = 8,5 × 10¹⁰ &nbsp; (10 posti dopo l'8!)
                    </div>
                  </div>

                  {/* Cos'è l'Ordine di Grandezza */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-center">
                    <h3 className="text-lg font-black text-slate-800">Cos'è l'Ordine di Grandezza?</h3>
                    <p className="text-xs text-slate-600 max-w-xl mx-auto">
                      È la <strong>potenza di 10 a cui il numero si avvicina di più</strong>. Si scrive il numero in notazione scientifica k × 10ⁿ: se <strong>k &lt; 5</strong> l'ordine di grandezza è 10ⁿ, se <strong>k ≥ 5</strong> è 10ⁿ⁺¹. Serve per capire subito "quanto è grande" una quantità (migliaia? milioni? miliardi?):
                    </p>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block text-xs font-mono text-slate-700">
                      8500 = 8,5 × 10³ → k = 8,5 ≥ 5 → <strong>Ordine di grandezza = 10⁴</strong>
                    </div>
                  </div>

                  {/* WIDGET INTERATTIVO: Scanner Numeri Giganti */}
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
                    <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-orange bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-xs">
                        Laboratorio Astronomico · Notazione Scientifica
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Scanner di Numeri Giganti
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        Scegli una grandezza reale o digita un numero per calcolarne notazione e ordine di grandezza:
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        { label: "Distanza Terra-Luna (km)", val: 384000 },
                        { label: "Popolazione Mondiale", val: 8000000000 },
                        { label: "Distanza Terra-Sole (km)", val: 150000000 },
                        { label: "Secondi in un Giorno", val: 86400 },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => setGiantNumber(item.val)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            giantNumber === item.val
                              ? "bg-dida-orange text-white border-orange-600 font-black shadow-md scale-105"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-orange-50 hover:border-orange-200"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 max-w-lg mx-auto text-center space-y-4 shadow-sm">
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Numero in forma normale:</div>
                      <div className="font-mono text-2xl font-black text-slate-800">
                        {giantNumber.toLocaleString("it-IT")}
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <span className="text-[10px] text-dida-blue font-bold uppercase tracking-wider block">Notazione Scientifica</span>
                          <span className="font-mono text-lg font-black text-slate-800">
                            {sciInfo.k} × 10^{sciInfo.exp}
                          </span>
                        </div>
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                          <span className="text-[10px] text-dida-orange font-bold uppercase tracking-wider block">Ordine di Grandezza</span>
                          <span className="font-mono text-lg font-black text-slate-800">
                            10^{sciInfo.orderExp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </motion.div>
        ) : (
          /* ======================================================== */
          /* TAB ALLENA (PALESTRA DI ESERCIZI) */
          /* ======================================================== */
          <motion.div
            key="tab-allena-powers"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 px-4"
          >
            {/* Banner Palestra */}
            <div className="rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 shadow-lg text-center flex flex-col items-center gap-3.5">
              <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-amber-950 bg-white/30 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/40 shadow-xs">
                Palestra di Aritmetica · Livello 1ª Media
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Mettiti alla Prova con Potenze, Proprietà e INVALSI
              </h2>
              <p className="text-amber-100 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Esercitati sulle proprietà delle potenze, la notazione scientifica e risolvi i quesiti logici delle prove nazionali!
              </p>
            </div>

            {/* SEZIONE 1: Base ed Esponente */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">
                  Attività 1 · Base ed Esponente
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Calcola o Riconosci la Potenza</h3>
                <p className="text-xs text-slate-500">Seleziona la risposta esatta.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 1,
                    q: "A quale scrittura corrisponde 4 × 4 × 4 × 4 × 4?",
                    options: [
                      { id: "a", label: "4⁵", correct: true },
                      { id: "b", label: "5⁴", correct: false },
                      { id: "c", label: "4 × 5 = 20", correct: false },
                    ],
                    explain: "La base è 4 e compare moltiplicata per se stessa 5 volte, quindi 4⁵!"
                  },
                  {
                    id: 2,
                    q: "Quanto vale la potenza 4⁰?",
                    options: [
                      { id: "a", label: "0", correct: false },
                      { id: "b", label: "1", correct: true },
                      { id: "c", label: "4", correct: false },
                    ],
                    explain: "Per definizione, qualsiasi numero (diverso da zero) elevato a zero vale sempre 1!"
                  },
                  {
                    id: 3,
                    q: "Quanto vale 2⁶?",
                    options: [
                      { id: "a", label: "12 (2 × 6)", correct: false },
                      { id: "b", label: "64", correct: true },
                      { id: "c", label: "32", correct: false },
                    ],
                    explain: "2 × 2 × 2 × 2 × 2 × 2 = 64 (non 2 × 6 = 12!)"
                  },
                  {
                    id: 4,
                    q: "A quale numero corrisponde 10⁵?",
                    options: [
                      { id: "a", label: "50", correct: false },
                      { id: "b", label: "10.000 (4 zeri)", correct: false },
                      { id: "c", label: "100.000 (5 zeri)", correct: true },
                    ],
                    explain: "10⁵ ha l'1 seguito da esattamente 5 zeri: centomila!"
                  },
                ].map((item) => {
                  const ans = exBaseAnswers[item.id];
                  return (
                    <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <p className="text-sm font-bold text-slate-800">{item.q}</p>
                      <div className="flex gap-2">
                        {item.options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setExBaseAnswers(prev => ({ ...prev, [item.id]: opt.id }))}
                            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              ans === opt.id
                                ? opt.correct
                                  ? "bg-emerald-500 text-white border-emerald-600"
                                  : "bg-rose-500 text-white border-rose-600"
                                : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {ans && (
                        <p className="text-xs font-semibold text-slate-600">
                          {ans === item.options.find(o => o.correct)?.id
                            ? `✅ ${item.explain}`
                            : "❌ Riprova, ricorda la definizione di potenza!"}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE 2: Le Proprietà delle Potenze */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 text-center md:text-left">
                <span className="text-xs font-bold text-dida-blue uppercase tracking-wider">
                  Attività 2 · Scorciatoie con le Proprietà
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Scrivi come Un'Unica Potenza</h3>
                <p className="text-xs text-slate-500">Applica la proprietà corretta.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 1, expr: "2³ × 2⁵ = ?", opt: ["2⁸", "2¹⁵", "4⁸"], correct: "2⁸", note: "Stessa base, prodotto: 3+5=8." },
                  { id: 2, expr: "7⁶ : 7² = ?", opt: ["7⁴", "7³", "1⁴"], correct: "7⁴", note: "Stessa base, quoziente: 6−2=4." },
                  { id: 3, expr: "(4²)³ = ?", opt: ["4⁵", "4⁶", "16³"], correct: "4⁶", note: "Potenza di potenza: 2×3=6." },
                  { id: 4, expr: "6⁵ × 2⁵ = ?", opt: ["12⁵", "12¹⁰", "8⁵"], correct: "12⁵", note: "Stesso esponente: (6×2)⁵ = 12⁵." },
                  { id: 5, expr: "36⁵ : 9⁵ = ?", opt: ["4⁵", "4¹", "27⁵"], correct: "4⁵", note: "Stesso esponente: (36:9)⁵ = 4⁵." },
                  { id: 6, expr: "5⁸ : 5⁸ = ?", opt: ["5⁰ = 1", "5¹⁶", "0"], correct: "5⁰ = 1", note: "8−8=0, 5⁰ = 1." },
                ].map((item) => {
                  const ans = exPropAnswers[item.id];
                  return (
                    <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                      <div className="font-mono font-black text-base text-slate-900 bg-white p-2.5 rounded-xl border border-slate-200">
                        {item.expr}
                      </div>
                      <div className="flex justify-center gap-1.5">
                        {item.opt.map((o) => (
                          <button
                            key={o}
                            onClick={() => setExPropAnswers(prev => ({ ...prev, [item.id]: o }))}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition cursor-pointer ${
                              ans === o
                                ? o === item.correct
                                  ? "bg-emerald-500 text-white border-emerald-600"
                                  : "bg-rose-500 text-white border-rose-600"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE 3: PROVE INVALSI (Tratte direttamente dalle slide!) */}
            <div className="rounded-[2rem] border-2 border-dida-blue/30 bg-white p-6 md:p-8 shadow-md space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-dida-blue text-white flex items-center justify-center font-black shadow-md">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100">
                      Preparazione Prove Nazionali
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                      Come alle Prove INVALSI: Potenze e Logica
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-semibold">Quesiti autentici di ragionamento</span>
              </div>

              {/* Quesito INVALSI 1: Il Torneo di Tennis */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Quesito 1 · Il Torneo di Tennis (16 Giocatori)
                </span>
                <p className="text-sm font-bold text-slate-800">
                  Un torneo di tennis a eliminazione diretta conta <strong>16 giocatori</strong> (<span className="font-mono">16 = 2⁴</span>). Chi perde viene eliminato subito. <br />
                  Quante partite complessive si devono giocare in tutto il torneo per decretare il vincitore?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "8 partite", correct: false },
                    { id: "B", val: "15 partite", correct: true },
                    { id: "C", val: "16 partite", correct: false },
                    { id: "D", val: "32 partite", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, q1: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                        invalsiAnswers.q1 === opt.id
                          ? opt.correct
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : "bg-rose-500 text-white border-rose-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt.id}. {opt.val}
                    </button>
                  ))}
                </div>
                {invalsiAnswers.q1 && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.q1 === "B"
                      ? "✅ Ragionamento geniale: per avere 1 solo vincitore tra 16 partecipanti, devono essere eliminati esattamente 15 giocatori. Poiché ogni partita elimina 1 giocatore, servono esattamente 15 partite (8 ottavi + 4 quarti + 2 semifinali + 1 finale = 15)!"
                      : "❌ Attento: a ogni partita viene eliminato esattamente 1 giocatore. Per eliminare 15 giocatori quanti incontri servono?"}
                  </p>
                )}
              </div>

              {/* Quesito INVALSI 2: La Decima Parte */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-dida-blue bg-blue-100 px-3 py-1 rounded-full">
                  Quesito 2 · La Decima Parte
                </span>
                <p className="text-sm font-bold text-slate-800">
                  La decima parte di <span className="font-mono text-base font-extrabold text-dida-blue">10²⁰</span> è:
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "10¹⁰", correct: false },
                    { id: "B", val: "100", correct: false },
                    { id: "C", val: "1²⁰", correct: false },
                    { id: "D", val: "10¹⁹", correct: true },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, q2: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-mono font-bold transition cursor-pointer ${
                        invalsiAnswers.q2 === opt.id
                          ? opt.correct
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : "bg-rose-500 text-white border-rose-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt.id}. {opt.val}
                    </button>
                  ))}
                </div>
                {invalsiAnswers.q2 && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.q2 === "D"
                      ? "✅ Esatto: fare la decima parte significa dividere per 10 (cioè 10¹). Per la proprietà delle potenze con stessa base: 10²⁰ : 10¹ = 10²⁰⁻¹ = 10¹⁹!"
                      : "❌ Dividere per 10 non dimezza l'esponente! La regola dice di sottrarre 1: 20 − 1 = 19."}
                  </p>
                )}
              </div>

              {/* Quesito INVALSI 3: a^b = b^a */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  Quesito 3 · Chi Ha Ragione?
                </span>
                <p className="text-sm text-slate-700">
                  L'insegnante chiede: <strong className="text-slate-900">«Trovate due numeri diversi a ≠ b tali che aᵇ = bᵃ»</strong>. <br />
                  • <strong>Elisa</strong> propone: <span className="font-mono">a = 1, b = 2</span> (perché 1² = 2¹). <br />
                  • <strong>Paolo</strong> propone: <span className="font-mono">a = 2, b = 4</span> (perché 2⁴ = 4²). <br />
                  Chi ha ragione?
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "A", val: "Solo Elisa", correct: false },
                    { id: "B", val: "Solo Paolo", correct: true },
                    { id: "C", val: "Entrambi", correct: false },
                    { id: "D", val: "Nessuno", correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setInvalsiAnswers(prev => ({ ...prev, q3: opt.id }))}
                      className={`p-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                        invalsiAnswers.q3 === opt.id
                          ? opt.correct
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : "bg-rose-500 text-white border-rose-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt.val}
                    </button>
                  ))}
                </div>
                {invalsiAnswers.q3 && (
                  <p className="text-xs text-slate-600 pt-1">
                    {invalsiAnswers.q3 === "B"
                      ? "✅ Paolo ha ragione: 2⁴ = 16 e 4² = 16, quindi 2⁴ = 4² = 16! Invece Elisa sbaglia: 1² = 1 mentre 2¹ = 2, che sono diversi!"
                      : "❌ Verifica i calcoli di Elisa: 1² fa 1, mentre 2¹ fa 2! Solo Paolo ha trovato una coppia corretta."}
                  </p>
                )}
              </div>

              {/* SEZIONE 4: Sfida Finale Vero o Falso */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Sfida Finale · Vero o Falso
                </span>
                <p className="text-xs text-slate-500">Metti alla prova la tua padronanza globale sulle potenze:</p>

                <div className="space-y-3">
                  {[
                    { id: 1, text: "2⁵ è uguale a 10.", correct: false, note: "Falso: 2⁵ = 32 (non 2 × 5!)." },
                    { id: 2, text: "5⁰ = 1.", correct: true, note: "Vero: qualsiasi numero diverso da 0 elevato a 0 vale 1." },
                    { id: 3, text: "3² × 3⁴ = 3⁶.", correct: true, note: "Vero: per la proprietà con stessa base 2 + 4 = 6." },
                    { id: 4, text: "2² + 2³ = 2⁵.", correct: false, note: "Falso: le proprietà NON valgono per la somma! 4 + 8 = 12 ≠ 32." },
                    { id: 5, text: "10⁶ equivale a un milione.", correct: true, note: "Vero: 1 seguito da 6 zeri fa 1.000.000." },
                    { id: 6, text: "4,5 × 10³ = 4500.", correct: true, note: "Vero: la virgola si sposta di 3 posti a destra." },
                  ].map((q) => {
                    const ans = vfAnswers[q.id];
                    return (
                      <div key={q.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <span className="text-xs font-bold text-slate-800 flex-1">{q.text}</span>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => setVfAnswers(prev => ({ ...prev, [q.id]: true }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                              ans === true
                                ? q.correct === true ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                            }`}
                          >
                            Vero
                          </button>
                          <button
                            onClick={() => setVfAnswers(prev => ({ ...prev, [q.id]: false }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                              ans === false
                                ? q.correct === false ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                            }`}
                          >
                            Falso
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
