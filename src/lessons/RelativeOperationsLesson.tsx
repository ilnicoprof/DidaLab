import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Info, Calculator, Rocket, Check, ArrowRight, X, Play, Repeat, Target
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
  { id: "relative-addition", title: "1. L'Addizione (Sali e Scendi)", short: "1. Addizione" },
  { id: "relative-subtraction-expressions", title: "2. Sottrazione ed Espressioni", short: "2. Sottrazione" },
  { id: "relative-multiplication-division", title: "3. Moltiplicazione e Divisione", short: "3. Molt & Div" },
  { id: "relative-four-operations", title: "4. Le 4 Operazioni e Precedenze", short: "4. Espressioni" },
  { id: "relative-powers-roots", title: "5. Potenze e Radici (Notazione Scientifica)", short: "5. Potenze" },
];

export default function RelativeOperationsLesson({
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

  // Stati interattivi
  const [add1, setAdd1] = useState<number>(2);
  const [add2, setAdd2] = useState<number>(5);
  const [mult1, setMult1] = useState<number>(3);
  const [mult2, setMult2] = useState<number>(-2);
  const [powBase, setPowBase] = useState<number>(-2);
  const [powExp, setPowExp] = useState<number>(3);

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
              Le Operazioni con i Numeri Relativi
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
            {selectedSubtopic === "relative-addition" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                    Pipeline Additiva
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    L'Addizione: Concordi e Discordi
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Seleziona due numeri per vedere come si sommano sulla retta. Se i segni sono uguali "unisci le forze", se sono diversi "vince il più forte".
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center gap-6">
                  {/* Calcolatore Addizione */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-2">
                      <input type="range" min="-10" max="10" value={add1} onChange={(e) => setAdd1(Number(e.target.value))} className="w-24 accent-blue-600 cursor-pointer" />
                      <div className={`text-2xl font-black font-mono w-16 text-center py-2 rounded-xl border-2 shadow-xs ${add1 >= 0 ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-blue-50 border-blue-200 text-blue-600"}`}>
                        {add1 >= 0 ? `+${add1}` : add1}
                      </div>
                    </div>
                    
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-sm">+</div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <input type="range" min="-10" max="10" value={add2} onChange={(e) => setAdd2(Number(e.target.value))} className="w-24 accent-blue-600 cursor-pointer" />
                      <div className={`text-2xl font-black font-mono w-16 text-center py-2 rounded-xl border-2 shadow-xs ${add2 >= 0 ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-blue-50 border-blue-200 text-blue-600"}`}>
                        {add2 >= 0 ? `+${add2}` : add2}
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-800 font-black text-2xl">=</div>

                    <div className={`text-3xl font-black font-mono w-24 text-center py-3 rounded-2xl border-4 shadow-sm ${add1 + add2 >= 0 ? "bg-orange-500 border-orange-600 text-white" : "bg-blue-500 border-blue-600 text-white"}`}>
                      {add1 + add2 >= 0 ? `+${add1 + add2}` : add1 + add2}
                    </div>
                  </div>

                  {/* Spiegazione Automatica */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs w-full max-w-md text-center">
                    <p className="text-sm font-bold text-slate-700">
                      {Math.sign(add1) === Math.sign(add2) && add1 !== 0 && add2 !== 0 ? (
                        <span><strong className="text-emerald-600">CONCORDI:</strong> Hanno lo stesso segno. Somma i valori assoluti ({Math.abs(add1)} + {Math.abs(add2)} = {Math.abs(add1) + Math.abs(add2)}) e metti il loro segno comune!</span>
                      ) : add1 === 0 || add2 === 0 ? (
                        <span><strong className="text-slate-600">ZERO:</strong> Lo zero è l'elemento neutro. Il numero non cambia!</span>
                      ) : add1 === -add2 ? (
                        <span><strong className="text-emerald-600">OPPOSTI:</strong> Si annullano a vicenda! La somma di due opposti è sempre zero.</span>
                      ) : (
                        <span><strong className="text-rose-600">DISCORDI:</strong> Hanno segni diversi. Sottrai i valori assoluti ({Math.max(Math.abs(add1), Math.abs(add2))} - {Math.min(Math.abs(add1), Math.abs(add2))} = {Math.abs(Math.abs(add1) - Math.abs(add2))}) e metti il segno del "più forte" (quello col valore assoluto maggiore: {Math.abs(add1) > Math.abs(add2) ? add1 : add2})!</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedSubtopic === "relative-subtraction-expressions" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200 shadow-xs">
                    Conversione
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    Sottrazione: Togliere = Aggiungere l'Opposto
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    In algebra, la sottrazione NON esiste come operazione separata: si trasforma sempre in un'addizione con l'opposto!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200">
                    <h4 className="font-black text-rose-900 text-lg mb-3">La Regola Magica</h4>
                    <p className="text-sm font-medium text-rose-800 leading-relaxed mb-4">
                      Il primo numero resta <strong>uguale</strong>. <br/>
                      Il segno <strong className="text-lg">-</strong> in mezzo diventa un <strong className="text-lg">+</strong>.<br/>
                      Il secondo numero cambia nel suo <strong>opposto</strong>.
                    </p>
                    <div className="bg-white p-3 rounded-xl border border-rose-300 font-mono font-black text-center text-rose-900 text-lg shadow-xs">
                      a - b = a + (-b)
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="font-mono font-black text-lg text-slate-700">(+9) - (+2)</div>
                      <ArrowRight size={20} className="text-slate-400" />
                      <div className="font-mono font-black text-lg text-emerald-600">(+9) + (-2) = +7</div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="font-mono font-black text-lg text-slate-700">(-7) - (-4)</div>
                      <ArrowRight size={20} className="text-slate-400" />
                      <div className="font-mono font-black text-lg text-emerald-600">(-7) + (+4) = -3</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-xs shrink-0"><Calculator className="text-dida-blue" size={24}/></div>
                  <div>
                    <h4 className="font-black text-dida-blue text-base">Scrittura Semplificata: via le parentesi!</h4>
                    <p className="text-sm text-slate-700 mt-1">
                      Per fare prima, possiamo togliere tutte le parentesi. Se davanti c'è un <strong className="text-orange-600 text-lg">+</strong>, i segni <strong>restano uguali</strong>. Se davanti c'è un <strong className="text-blue-600 text-lg">-</strong>, tutti i segni <strong>cambiano</strong>!
                    </p>
                    <div className="mt-3 bg-white p-3 rounded-xl border border-blue-200 font-mono font-bold text-sm text-slate-800">
                      (+10) + (-2) + (-12) &rarr; 10 - 2 - 12 = -4
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSubtopic === "relative-multiplication-division" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200 shadow-xs">
                    Matrice Prodotti
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    Moltiplicazione e Divisione
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Per moltiplicare (o dividere) due numeri relativi, si moltiplicano (o dividono) i loro valori assoluti. E il segno? Segue la famosissima <strong>Regola dei Segni</strong>!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                    <h4 className="font-black text-slate-800 text-center mb-6">La Regola dei Segni</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-100 p-4 rounded-xl border border-orange-200 text-center flex flex-col items-center">
                        <div className="font-black text-xl text-orange-600 mb-1">+ · + = +</div>
                        <span className="text-[10px] font-bold text-orange-800 uppercase">Più per più fa più</span>
                      </div>
                      <div className="bg-blue-100 p-4 rounded-xl border border-blue-200 text-center flex flex-col items-center">
                        <div className="font-black text-xl text-blue-600 mb-1">- · - = +</div>
                        <span className="text-[10px] font-bold text-blue-800 uppercase">Meno per meno fa più</span>
                      </div>
                      <div className="bg-rose-100 p-4 rounded-xl border border-rose-200 text-center flex flex-col items-center">
                        <div className="font-black text-xl text-rose-600 mb-1">+ · - = -</div>
                        <span className="text-[10px] font-bold text-rose-800 uppercase">Più per meno fa meno</span>
                      </div>
                      <div className="bg-rose-100 p-4 rounded-xl border border-rose-200 text-center flex flex-col items-center">
                        <div className="font-black text-xl text-rose-600 mb-1">- · + = -</div>
                        <span className="text-[10px] font-bold text-rose-800 uppercase">Meno per più fa meno</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Calcolatore Moltiplicazione */}
                    <div className="flex items-center gap-2 justify-center bg-white p-5 rounded-2xl border-2 border-purple-200 shadow-sm">
                      <div className="flex flex-col items-center gap-2">
                        <input type="range" min="-5" max="5" value={mult1} onChange={(e) => setMult1(Number(e.target.value))} className="w-20 accent-purple-600 cursor-pointer" />
                        <div className={`text-xl font-black font-mono w-14 text-center py-1 rounded-xl border-2 ${mult1 > 0 ? "text-orange-500 border-orange-200" : mult1 < 0 ? "text-blue-500 border-blue-200" : "text-slate-500 border-slate-200"}`}>
                          {mult1 > 0 ? `+${mult1}` : mult1}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-xl">·</div>
                      <div className="flex flex-col items-center gap-2">
                        <input type="range" min="-5" max="5" value={mult2} onChange={(e) => setMult2(Number(e.target.value))} className="w-20 accent-purple-600 cursor-pointer" />
                        <div className={`text-xl font-black font-mono w-14 text-center py-1 rounded-xl border-2 ${mult2 > 0 ? "text-orange-500 border-orange-200" : mult2 < 0 ? "text-blue-500 border-blue-200" : "text-slate-500 border-slate-200"}`}>
                          {mult2 > 0 ? `+${mult2}` : mult2}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-800 font-black text-xl">=</div>
                      <div className={`text-2xl font-black font-mono w-20 text-center py-2 rounded-2xl border-4 ${
                        mult1 * mult2 > 0 ? "bg-orange-500 border-orange-600 text-white" : 
                        mult1 * mult2 < 0 ? "bg-blue-500 border-blue-600 text-white" : 
                        "bg-slate-300 border-slate-400 text-slate-800"
                      }`}>
                        {mult1 * mult2 > 0 ? `+${mult1 * mult2}` : mult1 * mult2}
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                      <h5 className="font-black text-emerald-900 text-sm mb-1">Tanti fattori (più di due)</h5>
                      <p className="text-xs text-emerald-800">
                        Conta i segni <strong>Meno</strong>! Se sono in numero <strong className="underline">Pari</strong> (2, 4, 6...) il risultato è <strong>Positivo</strong> (+). Se sono in numero <strong className="underline">Dispari</strong> (1, 3, 5...) il risultato è <strong>Negativo</strong> (-).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSubtopic === "relative-powers-roots" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 shadow-xs">
                    Motore Esponenziale
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    Le Potenze con Base Negativa
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Seleziona una base e un esponente. Osserva come il segno cambia se l'esponente è pari o dispari!
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-slate-50 p-8 rounded-3xl border border-slate-200">
                  <div className="flex flex-col items-end gap-2">
                    {/* Esponente */}
                    <div className="flex items-center gap-2 mb-[-10px] mr-[-20px] z-10">
                      <input type="range" min="0" max="4" value={powExp} onChange={(e) => setPowExp(Number(e.target.value))} className="w-20 accent-amber-600 cursor-pointer" />
                      <div className="text-xl font-black font-mono bg-white border-2 border-amber-300 text-amber-700 px-3 py-1 rounded-lg shadow-sm">
                        {powExp}
                      </div>
                    </div>
                    {/* Base */}
                    <div className="flex items-center gap-2">
                      <input type="range" min="-4" max="4" value={powBase} onChange={(e) => setPowBase(Number(e.target.value))} className="w-24 accent-blue-600 cursor-pointer" />
                      <div className={`text-4xl font-black font-mono px-4 py-3 rounded-2xl border-4 shadow-md ${powBase >= 0 ? "bg-orange-50 border-orange-300 text-orange-600" : "bg-blue-50 border-blue-300 text-blue-600"}`}>
                        ({powBase > 0 ? `+${powBase}` : powBase})
                      </div>
                    </div>
                  </div>

                  <div className="text-4xl font-black text-slate-400">=</div>

                  <div className={`text-5xl font-black font-mono px-6 py-4 rounded-3xl border-4 shadow-lg ${
                    Math.pow(powBase, powExp) > 0 ? "bg-orange-500 border-orange-600 text-white" : 
                    Math.pow(powBase, powExp) < 0 ? "bg-blue-500 border-blue-600 text-white" : 
                    "bg-slate-300 border-slate-400 text-slate-800"
                  }`}>
                    {Math.pow(powBase, powExp) > 0 ? `+${Math.pow(powBase, powExp)}` : Math.pow(powBase, powExp)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
                    <h4 className="font-black text-emerald-900 text-base mb-2">Regola dell'Esponente</h4>
                    <ul className="text-sm font-medium text-emerald-800 space-y-2">
                      <li>Base POSITIVA &rarr; sempre <strong>Positivo</strong></li>
                      <li>Base NEGATIVA, esponente PARI (2,4...) &rarr; <strong>Positivo</strong> <br/><span className="text-xs font-mono text-emerald-600">(-2) · (-2) = +4</span></li>
                      <li>Base NEGATIVA, esponente DISPARI (1,3...) &rarr; <strong>Negativo</strong><br/><span className="text-xs font-mono text-emerald-600">(-2) · (-2) · (-2) = -8</span></li>
                    </ul>
                  </div>

                  <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200">
                    <h4 className="font-black text-rose-900 text-base mb-2">Occhio alla Trappola!</h4>
                    <p className="text-sm font-medium text-rose-800">
                      Le parentesi cambiano TUTTO!
                    </p>
                    <div className="flex gap-4 mt-3">
                      <div className="flex-1 bg-white p-3 rounded-xl border border-rose-300 text-center font-mono font-black text-sm text-slate-800">
                        (-6)²<br/>
                        <span className="text-emerald-600 text-base mt-1 block">= +36</span>
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-xl border border-rose-300 text-center font-mono font-black text-sm text-slate-800">
                        -6²<br/>
                        <span className="text-rose-600 text-base mt-1 block">= -36</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Fallback for "relative-four-operations" or anything else */}
            {selectedSubtopic === "relative-four-operations" && (
              <div className="flex flex-col items-center justify-center text-center space-y-4 h-full">
                <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
                  <Calculator size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-800">Le 4 Operazioni e Precedenze</h3>
                <p className="text-slate-500 max-w-md font-medium">
                  Le regole di precedenza sono identiche a quelle che conosci già: prima le potenze, poi moltiplicazioni e divisioni, infine addizioni e sottrazioni algebriche. Unisci con un archetto le operazioni da fare prima!
                </p>
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
            L'area di allenamento con i quesiti V/F e i test INVALSI per le operazioni relative è in costruzione. Usa la scheda <strong>Impara</strong> per esplorare i concetti interattivi.
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
