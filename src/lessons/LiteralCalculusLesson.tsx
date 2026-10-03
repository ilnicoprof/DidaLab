import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Info, Box, Layers, Cuboid, Scissors, Check, X, 
  Grid2x2, PlusSquare, MinusSquare
} from "lucide-react";

interface Props {
  key?: string;
  onBack: () => void;
  subjectName: string;
  topicName: string;
  initialSubtopicId?: string;
  initialTab?: "impara" | "allena";
}

const SUBTOPICS = [
  { id: "literal-expressions-intro", title: "1. Le Espressioni Letterali", short: "1. Le Espressioni" },
  { id: "monomials-def-characteristics", title: "2. I Monomi (I Mattoncini)", short: "2. I Monomi" },
  { id: "monomials-operations-rules", title: "3. Operazioni con i Monomi", short: "3. Operazioni" },
  { id: "polynomials-def-operations", title: "4. I Polinomi (Le Somme)", short: "4. I Polinomi" },
  { id: "special-products-shortcuts", title: "5. I Prodotti Notevoli", short: "5. Prodotti Notevoli" },
];

export default function LiteralCalculusLesson({
  onBack,
  subjectName,
  topicName,
  initialSubtopicId,
  initialTab = "impara",
}: Props) {
  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const defaultSubtopic = initialSubtopicId && SUBTOPICS.find((s) => s.id === initialSubtopicId)
    ? initialSubtopicId
    : SUBTOPICS[0].id;
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>(defaultSubtopic);

  // Interattività
  const [varValue, setVarValue] = useState<number>(5);
  const [appleCount, setAppleCount] = useState<number>(3);
  const [pearCount, setPearCount] = useState<number>(2);
  const [squareA, setSquareA] = useState<number>(3);
  const [squareB, setSquareB] = useState<number>(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-6xl mx-auto space-y-6 pb-20 px-4"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-dida-blue hover:border-dida-blue/30 transition shadow-xs cursor-pointer"
            title="Torna indietro"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {subjectName}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {topicName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Il Calcolo Letterale
            </h1>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200">
          <button
            onClick={() => setActiveTab("impara")}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition cursor-pointer ${
              activeTab === "impara"
                ? "bg-white text-dida-blue shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Impara
          </button>
          <button
            onClick={() => setActiveTab("allena")}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition cursor-pointer ${
              activeTab === "allena"
                ? "bg-dida-orange text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Allena
          </button>
        </div>
      </div>

      {activeTab === "impara" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Menu laterale */}
          <div className="lg:col-span-3 space-y-2">
            {SUBTOPICS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubtopic(sub.id)}
                className={`w-full text-left p-4 rounded-2xl transition cursor-pointer border ${
                  selectedSubtopic === sub.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <div className="font-bold text-sm leading-tight">{sub.title}</div>
              </button>
            ))}
          </div>

          {/* Area Contenuto */}
          <div className="lg:col-span-9 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm min-h-[500px]">
            {selectedSubtopic === "literal-expressions-intro" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                    Scatole Magiche
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    Lettere al posto dei Numeri
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    In algebra usiamo le lettere (come x, a, b) come se fossero delle "scatole" che possono contenere qualsiasi numero.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center gap-4">
                    <p className="text-sm font-bold text-slate-700">Cambia il valore nella "scatola" <span className="font-serif italic font-black text-blue-600 text-lg">x</span>:</p>
                    
                    <div className="flex items-center gap-4">
                      <input type="range" min="1" max="10" value={varValue} onChange={(e) => setVarValue(Number(e.target.value))} className="w-32 accent-blue-600 cursor-pointer" />
                      <div className="w-12 h-12 bg-white rounded-xl border-4 border-blue-300 flex items-center justify-center font-black text-xl text-blue-600 shadow-sm">
                        {varValue}
                      </div>
                    </div>

                    <div className="w-full space-y-3 mt-4">
                      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="font-bold text-slate-700 text-sm">Il doppio (2x)</span>
                        <span className="font-mono font-black text-lg text-emerald-600">2 · {varValue} = {2 * varValue}</span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="font-bold text-slate-700 text-sm">Aumentato di 5 (x + 5)</span>
                        <span className="font-mono font-black text-lg text-emerald-600">{varValue} + 5 = {varValue + 5}</span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="font-bold text-slate-700 text-sm">Il quadrato (x²)</span>
                        <span className="font-mono font-black text-lg text-emerald-600">{varValue}² = {varValue * varValue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200">
                      <h4 className="font-black text-orange-900 text-sm mb-2 flex items-center gap-2">
                        <Info size={16} /> Le Regole Base
                      </h4>
                      <ul className="text-xs font-medium text-orange-800 space-y-2 list-disc list-inside">
                        <li>Il segno "per" (·) di solito <strong>non si scrive</strong>: <span className="font-mono bg-white px-1 rounded">3a</span> vuol dire <span className="font-mono bg-white px-1 rounded">3 · a</span></li>
                        <li>Le formule (come quella dell'area) sono espressioni letterali che valgono per <strong>qualsiasi</strong> misura!</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-5 rounded-2xl border border-purple-200">
                      <h4 className="font-black text-purple-900 text-sm mb-2">Valore Numerico</h4>
                      <p className="text-xs font-medium text-purple-800 leading-relaxed">
                        Per calcolare un'espressione letterale, <strong>sostituisci</strong> ogni lettera con il suo numero (mettilo tra parentesi!) e risolvi l'espressione con i numeri relativi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSubtopic === "monomials-def-characteristics" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200 shadow-xs">
                    I Mattoncini dell'Algebra
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    Cosa sono i Monomi?
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Un monomio è un'espressione che contiene <strong>solo moltiplicazioni e potenze</strong>. Niente addizioni o sottrazioni!
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  {/* Anatomia del Monomio */}
                  <div className="bg-slate-50 px-12 py-8 rounded-[40px] border-2 border-slate-200 flex flex-col items-center shadow-xs">
                    <div className="flex items-end font-serif">
                      <span className="text-6xl font-black text-blue-600 mr-2">-6</span>
                      <span className="text-6xl font-black text-orange-500 italic">a</span>
                      <span className="text-6xl font-black text-orange-500 italic relative">b<sup className="text-3xl text-slate-700 absolute -top-4 -right-4">2</sup></span>
                    </div>
                    
                    <div className="flex justify-between w-full mt-6 max-w-md">
                      <div className="text-center">
                        <div className="w-0.5 h-6 bg-slate-300 mx-auto mb-2"></div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-xl text-xs font-black uppercase border border-blue-200">Coefficiente</div>
                        <div className="text-[10px] font-bold text-slate-500 mt-1">Il numero col segno</div>
                      </div>
                      <div className="text-center">
                        <div className="w-0.5 h-6 bg-slate-300 mx-auto mb-2"></div>
                        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-xl text-xs font-black uppercase border border-orange-200">Parte Letterale</div>
                        <div className="text-[10px] font-bold text-slate-500 mt-1">Le lettere</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
                    <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
                      <h4 className="font-black text-slate-800 text-sm mb-2 border-b border-slate-100 pb-2">Le Famiglie di Monomi</h4>
                      <ul className="text-xs font-medium text-slate-600 space-y-3">
                        <li><strong className="text-blue-600">SIMILI:</strong> Hanno la <strong>stessa identica</strong> parte letterale. <br/><span className="font-mono bg-slate-50 px-1 rounded border border-slate-100 mt-1 inline-block">5ab² e -2ab²</span></li>
                        <li><strong className="text-emerald-600">OPPOSTI:</strong> Sono simili ma hanno coefficienti opposti. <br/><span className="font-mono bg-slate-50 px-1 rounded border border-slate-100 mt-1 inline-block">9ab e -9ab</span></li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
                      <h4 className="font-black text-slate-800 text-sm mb-2 border-b border-slate-100 pb-2">Grado del Monomio</h4>
                      <p className="text-xs font-medium text-slate-600 mb-2">
                        Per calcolare il grado complessivo, devi semplicemente <strong>sommare tutti gli esponenti</strong> delle lettere. Ricorda che se non c'è l'esponente, vale 1!
                      </p>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center font-mono font-bold text-sm text-slate-800">
                        8 a² b³ c <br/>
                        <span className="text-xs text-rose-500">2 + 3 + 1 = Grado 6</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSubtopic === "monomials-operations-rules" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 shadow-xs">
                    Mele con Mele
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    Le Operazioni con i Monomi
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Addizione e moltiplicazione hanno regole molto diverse! Con l'addizione conti quanti oggetti dello stesso tipo hai. Con la moltiplicazione calcoli aree e volumi!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Somma */}
                  <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-xs">
                    <h4 className="font-black text-slate-800 text-base mb-3 flex items-center gap-2">
                      <PlusSquare size={18} className="text-blue-500"/> Somma (Monomi Simili)
                    </h4>
                    <p className="text-xs font-medium text-slate-600 mb-4">
                      Puoi sommare <strong>solo i monomi simili</strong> (stessa parte letterale). Sommi i numeri e tieni le lettere uguali! Se non sono simili, resta indicato (es. <span className="font-mono">5a + 2b</span>).
                    </p>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center gap-3">
                      <div className="flex gap-4 items-center">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl mb-1">🍎</span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setAppleCount(Math.max(1, appleCount-1))} className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">-</button>
                            <span className="font-mono font-black">{appleCount}</span>
                            <button onClick={() => setAppleCount(appleCount+1)} className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">+</button>
                          </div>
                        </div>
                        <div className="font-black text-slate-400">+</div>
                        <div className="flex flex-col items-center">
                          <span className="text-2xl mb-1">🍐</span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setPearCount(Math.max(1, pearCount-1))} className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">-</button>
                            <span className="font-mono font-black">{pearCount}</span>
                            <button onClick={() => setPearCount(pearCount+1)} className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">+</button>
                          </div>
                        </div>
                        <div className="font-black text-slate-400">+</div>
                        <div className="flex flex-col items-center">
                          <span className="text-2xl mb-1">🍎</span>
                          <span className="font-mono font-black">2</span>
                        </div>
                      </div>
                      
                      <div className="w-full h-px bg-slate-300"></div>
                      
                      <div className="font-mono font-black text-emerald-600 text-lg">
                        {appleCount}m + {pearCount}p + 2m = {appleCount + 2}m + {pearCount}p
                      </div>
                    </div>
                  </div>

                  {/* Prodotto */}
                  <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-xs">
                    <h4 className="font-black text-slate-800 text-base mb-3 flex items-center gap-2">
                      <Grid2x2 size={18} className="text-orange-500"/> Prodotto (Aree e Volumi)
                    </h4>
                    <p className="text-xs font-medium text-slate-600 mb-4">
                      Numeri con numeri (regola dei segni!), lettere con lettere (somma gli esponenti!). Si può fare <strong>sempre</strong>.
                    </p>

                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 flex flex-col items-center">
                      <div className="font-mono font-black text-slate-800 mb-3 text-center">
                        (<span className="text-blue-600">-5</span><span className="text-orange-600">a²b</span>) · (<span className="text-blue-600">+4</span><span className="text-orange-600">ab³</span>)<br/>
                        = <span className="text-blue-600">-20</span><span className="text-orange-600">a³b⁴</span>
                      </div>

                      <div className="w-full bg-white p-3 rounded-lg border border-orange-200 text-xs font-bold text-orange-900 text-center flex flex-col gap-1">
                        <span>Moltiplico i numeri: (-5) · (+4) = -20</span>
                        <span>Sommo gli esponenti di 'a': 2 + 1 = 3</span>
                        <span>Sommo gli esponenti di 'b': 1 + 3 = 4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSubtopic === "polynomials-def-operations" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200 shadow-xs">
                    Composizioni Algebriche
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    I Polinomi
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Un polinomio è una somma algebrica di monomi <strong>NON simili</strong>. A seconda di quanti pezzi ha, si chiama binomio, trinomio o quadrinomio.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="font-black text-slate-800 mb-1">BINOMIO</div>
                    <div className="font-mono font-bold text-sm text-purple-600 bg-purple-50 py-1 rounded">5a - ab²</div>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">2 Termini</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="font-black text-slate-800 mb-1">TRINOMIO</div>
                    <div className="font-mono font-bold text-sm text-purple-600 bg-purple-50 py-1 rounded">a² - 7ab + c</div>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">3 Termini</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="font-black text-slate-800 mb-1">QUADRINOMIO</div>
                    <div className="font-mono font-bold text-sm text-purple-600 bg-purple-50 py-1 rounded">-4x² + y - xy + 3</div>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">4 Termini</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <h4 className="font-black text-slate-800 text-lg mb-4 text-center">Moltiplicare due Polinomi</h4>
                  <p className="text-sm font-medium text-slate-600 text-center mb-6">
                    Bisogna moltiplicare <strong>OGNUNO PER OGNUNO</strong>. Se fai un binomio (2) per un trinomio (3), otterrai 6 prodotti! (2 × 3 = 6).
                  </p>
                  
                  <div className="max-w-md mx-auto">
                    <div className="font-mono font-black text-center mb-4 text-lg">
                      (<span className="text-orange-600">6x</span> <span className="text-blue-600">- y</span>) · (<span className="text-emerald-600">2x</span> <span className="text-purple-600">+ 3y</span>)
                    </div>
                    
                    <div className="grid grid-cols-2 grid-rows-2 gap-1 rounded-xl overflow-hidden border-2 border-slate-300">
                      <div className="bg-orange-50 p-4 text-center border-b border-r border-slate-200">
                        <span className="text-xs font-bold text-slate-400 block mb-1">6x · 2x</span>
                        <span className="font-mono font-black text-slate-800">12x²</span>
                      </div>
                      <div className="bg-orange-100 p-4 text-center border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-400 block mb-1">6x · 3y</span>
                        <span className="font-mono font-black text-slate-800">18xy</span>
                      </div>
                      <div className="bg-blue-50 p-4 text-center border-r border-slate-200">
                        <span className="text-xs font-bold text-slate-400 block mb-1">-y · 2x</span>
                        <span className="font-mono font-black text-slate-800">-2xy</span>
                      </div>
                      <div className="bg-blue-100 p-4 text-center">
                        <span className="text-xs font-bold text-slate-400 block mb-1">-y · 3y</span>
                        <span className="font-mono font-black text-slate-800">-3y²</span>
                      </div>
                    </div>

                    <div className="mt-4 font-mono font-black text-center text-sm bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                      = 12x² <span className="text-rose-500">+ 18xy - 2xy</span> - 3y² <br/>
                      <span className="text-emerald-600 text-lg mt-1 inline-block">= 12x² + 16xy - 3y²</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSubtopic === "special-products-shortcuts" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 shadow-xs">
                    Scorciatoie da Campioni
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    I Prodotti Notevoli
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Alcune moltiplicazioni di polinomi seguono schemi ripetitivi. Imparando la regola a memoria salti tutti i passaggi intermedi!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Somma per Differenza */}
                  <div className="bg-blue-50 p-5 rounded-3xl border border-blue-200 flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-blue-900 text-lg mb-2">Somma per Differenza</h4>
                      <p className="text-xs font-medium text-blue-800 mb-4">I termini misti si cancellano a vicenda! Resta solo la <strong>differenza dei quadrati</strong>.</p>
                      
                      <div className="bg-white p-4 rounded-xl border border-blue-300 shadow-xs font-mono font-black text-center mb-4">
                        (a + b) (a - b) = a² - b²
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-blue-100 text-xs font-mono font-bold">
                        Es: (2x + 1)(2x - 1) = <br/>
                        <span className="text-blue-600 mt-1 inline-block text-sm">4x² - 1</span>
                      </div>
                    </div>
                  </div>

                  {/* Quadrato del Binomio */}
                  <div className="bg-orange-50 p-5 rounded-3xl border border-orange-200">
                    <h4 className="font-black text-orange-900 text-lg mb-2">Quadrato di Binomio</h4>
                    <p className="text-xs font-medium text-orange-800 mb-4">L'area di un quadrato di lato (a+b) si divide in 4 pezzi: quadrato rosso, quadrato blu e <strong>due</strong> rettangoli uguali misti!</p>
                    
                    <div className="bg-white p-4 rounded-xl border border-orange-300 shadow-xs font-mono font-black text-center mb-4 text-[13px] md:text-sm">
                      (a + b)² = a² + <span className="text-rose-500 underline decoration-2">2ab</span> + b²
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center justify-between w-full max-w-[200px]">
                        <span className="text-xs font-bold text-orange-900 w-4 text-center">a:</span>
                        <input type="range" min="2" max="6" value={squareA} onChange={(e) => setSquareA(Number(e.target.value))} className="w-24 accent-orange-500" />
                        <span className="text-xs font-mono font-black bg-white px-2 py-0.5 rounded border border-orange-200">{squareA}</span>
                      </div>
                      <div className="flex items-center justify-between w-full max-w-[200px]">
                        <span className="text-xs font-bold text-orange-900 w-4 text-center">b:</span>
                        <input type="range" min="2" max="6" value={squareB} onChange={(e) => setSquareB(Number(e.target.value))} className="w-24 accent-blue-500" />
                        <span className="text-xs font-mono font-black bg-white px-2 py-0.5 rounded border border-blue-200">{squareB}</span>
                      </div>

                      {/* Visualizzatore Quadrato */}
                      <div className="relative mt-2" style={{ width: (squareA+squareB)*15, height: (squareA+squareB)*15 }}>
                        <div className="absolute top-0 left-0 bg-rose-400 border border-rose-500 flex items-center justify-center font-mono font-bold text-white text-xs shadow-inner" style={{ width: squareA*15, height: squareA*15 }}>
                          a²
                        </div>
                        <div className="absolute top-0 right-0 bg-purple-400 border border-purple-500 flex items-center justify-center font-mono font-bold text-white text-xs shadow-inner" style={{ width: squareB*15, height: squareA*15, left: squareA*15 }}>
                          ab
                        </div>
                        <div className="absolute bottom-0 left-0 bg-purple-400 border border-purple-500 flex items-center justify-center font-mono font-bold text-white text-xs shadow-inner" style={{ width: squareA*15, height: squareB*15, top: squareA*15 }}>
                          ab
                        </div>
                        <div className="absolute bottom-0 right-0 bg-blue-400 border border-blue-500 flex items-center justify-center font-mono font-bold text-white text-xs shadow-inner" style={{ width: squareB*15, height: squareB*15, top: squareA*15, left: squareA*15 }}>
                          b²
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm min-h-[500px] flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-dida-orange mb-4">
            <Check size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Palestra di Allenamento in Arrivo</h2>
          <p className="text-sm font-medium text-slate-500 max-w-md">
            L'area di allenamento con i quesiti V/F, il calcolatore di espressioni e i test INVALSI è in costruzione. Usa la scheda <strong>Impara</strong> per esplorare i concetti interattivi.
          </p>
          <button
            onClick={() => setActiveTab("impara")}
            className="px-6 py-3 bg-dida-blue text-white rounded-xl font-black text-sm shadow-sm hover:bg-blue-700 transition cursor-pointer mt-4"
          >
            Torna alla Teoria
          </button>
        </div>
      )}
    </motion.div>
  );
}
