import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Info, ArrowRightLeft, Check
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
  { id: "relative-intro-signs", title: "1. Sopra e Sotto lo Zero (+ e -)", short: "1. Che Freddo!" },
  { id: "relative-sets-n-z-q-r", title: "2. Le Scatole dei Numeri (N, Z, Q, R)", short: "2. L'Insieme R" },
  { id: "relative-number-line", title: "3. La Retta Graduata e l'Ascensore", short: "3. La Retta" },
  { id: "relative-concord-discord-opposite", title: "4. Concordi, Discordi e Valore Assoluto", short: "4. Concordi & Opposti" },
  { id: "relative-comparison", title: "5. Chi è più grande? Il Confronto", short: "5. Il Confronto" },
];

export default function RelativeNumbersLesson({
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
  const [thermometerValue, setThermometerValue] = useState<number>(15);
  const [elevatorFloor, setElevatorFloor] = useState<number>(0);
  const [point1, setPoint1] = useState<number>(-3);
  const [point2, setPoint2] = useState<number>(5);

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
              I Numeri Relativi
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
            {selectedSubtopic === "relative-intro-signs" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-dida-blue bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
                    Grandezze Orientate
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    Sopra e Sotto lo Zero
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    I numeri relativi servono a indicare grandezze che possono andare in due sensi opposti rispetto a un punto di riferimento centrale (lo Zero).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Pensa al termometro: quando fa molto freddo in inverno, la temperatura può scendere sotto lo zero. Diciamo che ci sono <strong>-5 °C</strong>. In estate, sale sopra lo zero: diciamo che ci sono <strong>+30 °C</strong>.
                    </p>
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
                      <h4 className="font-black text-dida-orange text-sm mb-2 flex items-center gap-2">
                        <Info size={16} /> Regola d'Oro
                      </h4>
                      <p className="text-xs font-medium text-orange-900 leading-relaxed">
                        I numeri preceduti dal segno <strong className="text-xl mx-1 align-bottom">+</strong> sono detti POSITIVI.<br />
                        I numeri preceduti dal segno <strong className="text-xl mx-1 align-bottom">-</strong> sono detti NEGATIVI.<br />
                        Lo <strong className="mx-1">0</strong> non ha segno, non è né positivo né negativo!
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-32 bg-slate-100 p-4 rounded-full border-4 border-slate-200 flex flex-col items-center relative">
                      <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 flex flex-col gap-8 text-right">
                        <span>+30°</span>
                        <span>+20°</span>
                        <span>+10°</span>
                        <span className="text-blue-600 font-black">0°</span>
                        <span>-10°</span>
                        <span>-20°</span>
                      </div>
                      
                      <div className="w-8 h-64 bg-white rounded-full border border-slate-300 relative overflow-hidden flex flex-col justify-end">
                        <motion.div 
                          className={`w-full transition-all duration-300 ${thermometerValue > 0 ? 'bg-orange-500' : thermometerValue === 0 ? 'bg-slate-400' : 'bg-blue-500'}`}
                          style={{ height: `${(thermometerValue + 20) * 1.5}%` }}
                          layout
                        />
                      </div>
                      <div className={`w-14 h-14 rounded-full mt-[-10px] z-10 flex items-center justify-center text-white font-black border-4 border-white shadow-sm ${thermometerValue > 0 ? 'bg-orange-500' : thermometerValue === 0 ? 'bg-slate-500' : 'bg-blue-600'}`}>
                        {thermometerValue > 0 ? `+${thermometerValue}` : thermometerValue}°
                      </div>

                      <input 
                        type="range" 
                        min="-20" 
                        max="30" 
                        value={thermometerValue} 
                        onChange={(e) => setThermometerValue(Number(e.target.value))}
                        className="absolute w-64 -rotate-90 top-32 -right-24 accent-dida-blue cursor-pointer opacity-0 z-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSubtopic === "relative-sets-n-z-q-r" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200 shadow-xs">
                    Teoria degli Insiemi
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    Le Scatole Cinesi dei Numeri
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    I numeri si dividono in grandi "famiglie" o insiemi, uno contenuto nell'altro.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="relative w-full aspect-square max-w-sm mx-auto flex items-center justify-center">
                    {/* R Set */}
                    <div className="absolute inset-0 bg-blue-50 rounded-[40px] border-2 border-blue-200 flex items-start p-4">
                      <span className="font-serif font-black text-2xl text-blue-800">ℝ</span>
                      <span className="ml-2 mt-1 text-[10px] font-bold text-blue-600 uppercase">Reali</span>
                    </div>
                    
                    {/* Q Set */}
                    <div className="absolute inset-8 bg-orange-100 rounded-full border-2 border-orange-300 flex items-start p-4 shadow-sm">
                      <span className="font-serif font-black text-xl text-orange-800">ℚ</span>
                      <span className="ml-1 mt-1 text-[10px] font-bold text-orange-600 uppercase">Razionali</span>
                    </div>

                    {/* Z Set */}
                    <div className="absolute inset-16 bg-yellow-100 rounded-full border-2 border-yellow-300 flex items-start p-4 shadow-sm">
                      <span className="font-serif font-black text-lg text-yellow-800">ℤ</span>
                      <span className="ml-1 mt-1 text-[10px] font-bold text-yellow-700 uppercase">Interi</span>
                    </div>

                    {/* N Set */}
                    <div className="absolute inset-24 bg-green-100 rounded-full border-2 border-green-300 flex items-center justify-center flex-col shadow-sm">
                      <div className="flex items-center">
                        <span className="font-serif font-black text-base text-green-800 mr-1">ℕ</span>
                        <span className="text-[10px] font-bold text-green-700 uppercase">Naturali</span>
                      </div>
                      <div className="text-xs font-bold text-green-900 mt-2">0, 1, 2, 3...</div>
                    </div>

                    {/* Floating examples */}
                    <div className="absolute top-20 right-20 text-xs font-black text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded-full">-3, -5, +7</div>
                    <div className="absolute bottom-20 left-16 text-xs font-black text-orange-900 bg-orange-200 px-2 py-0.5 rounded-full">+1/2, -0.6</div>
                    <div className="absolute top-10 right-10 text-xs font-black text-blue-900 bg-blue-200 px-2 py-0.5 rounded-full">√2, π</div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <h4 className="font-black text-green-700 text-sm flex items-center gap-2">
                        <span className="font-serif text-lg">ℕ</span> Naturali
                      </h4>
                      <p className="text-xs font-medium text-slate-600 mt-1">I numeri per contare: 0, 1, 2, 3...</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                      <h4 className="font-black text-yellow-700 text-sm flex items-center gap-2">
                        <span className="font-serif text-lg">ℤ</span> Interi Relativi
                      </h4>
                      <p className="text-xs font-medium text-slate-600 mt-1">Naturali + i loro negativi: ... -2, -1, 0, +1, +2 ...</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                      <h4 className="font-black text-orange-700 text-sm flex items-center gap-2">
                        <span className="font-serif text-lg">ℚ</span> Razionali
                      </h4>
                      <p className="text-xs font-medium text-slate-600 mt-1">Tutte le frazioni e i decimali periodici/finiti.</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-black text-blue-700 text-sm flex items-center gap-2">
                        <span className="font-serif text-lg">ℝ</span> Reali
                      </h4>
                      <p className="text-xs font-medium text-slate-600 mt-1">L'unione di tutti i razionali con gli irrazionali (come √2 o Pi greco).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSubtopic === "relative-number-line" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 shadow-xs">
                    Modello Geometrico
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    La Retta Graduata e l'Ascensore
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Ogni numero relativo occupa un posto esatto su una retta infinita: la pulsantiera di un ascensore è una retta graduata messa in verticale!
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
                  <div className="w-full max-w-xs flex flex-col items-center">
                    <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">Usa l'ascensore</p>
                    <div className="bg-slate-800 p-3 rounded-3xl shadow-lg border-4 border-slate-700 relative">
                      {/* Elevator building visual */}
                      <div className="w-16 flex flex-col gap-1">
                        {[4, 3, 2, 1, 0, -1, -2, -3].map((floor) => (
                          <button
                            key={floor}
                            onClick={() => setElevatorFloor(floor)}
                            className={`h-10 w-full rounded-lg font-mono font-black transition cursor-pointer flex items-center justify-center text-sm ${
                              elevatorFloor === floor
                                ? "bg-emerald-400 text-slate-900 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                                : floor === 0
                                  ? "bg-slate-600 text-white border border-slate-500 hover:bg-slate-500"
                                  : floor > 0
                                    ? "bg-slate-700 text-orange-400 hover:bg-slate-600"
                                    : "bg-slate-700 text-blue-400 hover:bg-slate-600"
                            }`}
                          >
                            {floor > 0 ? `+${floor}` : floor === 0 ? "T" : floor}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-md space-y-6">
                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
                      <h4 className="font-black text-dida-blue text-sm mb-2">Come si costruisce?</h4>
                      <ul className="text-xs font-medium text-slate-700 space-y-2 list-disc list-inside">
                        <li>Fissiamo un punto di origine <strong>O</strong>, a cui diamo valore <strong>0</strong>.</li>
                        <li>Scegliamo un <strong>verso di percorrenza</strong> (di solito verso destra per i positivi).</li>
                        <li>Scegliamo un'<strong>unità di misura</strong> (la distanza tra due tacche).</li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden py-12">
                      {/* Horizontal Number Line */}
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-slate-300"></div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 -mt-0.5">
                        <div className="w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-slate-400"></div>
                      </div>
                      
                      <div className="flex justify-between items-center relative z-10 px-4">
                        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((num) => (
                          <div key={num} className="flex flex-col items-center">
                            <div className={`w-1 h-3 mb-1 ${num === 0 ? 'bg-slate-800 w-1.5 h-4' : 'bg-slate-400'}`}></div>
                            <span className={`text-[10px] font-black ${
                              elevatorFloor === num 
                                ? 'text-emerald-500 scale-150 transform transition-all' 
                                : num === 0 ? 'text-slate-800' : num > 0 ? 'text-orange-500' : 'text-blue-500'
                            }`}>
                              {num > 0 ? `+${num}` : num}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <motion.div 
                        className="absolute w-4 h-4 bg-emerald-400 border-2 border-white rounded-full top-1/2 -translate-y-1/2 z-20 shadow-sm"
                        initial={false}
                        animate={{ left: `calc(${((elevatorFloor + 4) / 8) * 100}% - 8px)` }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSubtopic === "relative-concord-discord-opposite" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200 shadow-xs">
                    Caratteristiche
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    Concordi, Discordi e Valore Assoluto
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Come si comportano due numeri relativi messi a confronto? E cos'è il misterioso "valore assoluto"?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200 text-center flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-black text-orange-500 border border-orange-200 shadow-xs">
                      + +
                    </div>
                    <h4 className="font-black text-orange-900">CONCORDI</h4>
                    <p className="text-xs font-medium text-orange-800">
                      Hanno lo <strong>stesso segno</strong>.<br/>
                      Es: <span className="font-mono bg-white px-1 py-0.5 rounded border border-orange-200">+3 e +7</span> oppure <span className="font-mono bg-white px-1 py-0.5 rounded border border-orange-200">-2 e -5</span>
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 text-center flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-black text-blue-500 border border-blue-200 shadow-xs">
                      + -
                    </div>
                    <h4 className="font-black text-blue-900">DISCORDI</h4>
                    <p className="text-xs font-medium text-blue-800">
                      Hanno <strong>segno diverso</strong>.<br/>
                      Es: <span className="font-mono bg-white px-1 py-0.5 rounded border border-blue-200">+5 e -8</span>
                    </p>
                  </div>

                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 text-center flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-black text-emerald-500 border border-emerald-200 shadow-xs">
                      -3 +3
                    </div>
                    <h4 className="font-black text-emerald-900">OPPOSTI</h4>
                    <p className="text-xs font-medium text-emerald-800">
                      Segno diverso, ma <strong>stesso numero</strong>.<br/>
                      Es: <span className="font-mono bg-white px-1 py-0.5 rounded border border-emerald-200">+4 e -4</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 relative overflow-hidden">
                  <h4 className="font-black text-slate-800 text-base mb-2 flex items-center gap-2">
                    <ArrowRightLeft size={18} className="text-dida-blue" /> Il Valore Assoluto
                  </h4>
                  <p className="text-sm font-medium text-slate-600 mb-6 max-w-xl">
                    Il <strong>valore assoluto</strong> di un numero è la sua distanza dallo zero. Poiché le distanze sono sempre positive (o nulle), il valore assoluto si ottiene "togliendo" il segno. Si indica con due sbarrette verticali: <strong>|x|</strong>.
                  </p>

                  <div className="flex flex-col items-center gap-4 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="text-2xl font-black font-mono text-slate-800 bg-white px-4 py-2 rounded-xl border-2 border-slate-300 shadow-xs">
                        |-5| = 5
                      </div>
                      <div className="text-2xl font-black font-mono text-slate-800 bg-white px-4 py-2 rounded-xl border-2 border-slate-300 shadow-xs">
                        |+3| = 3
                      </div>
                    </div>
                    
                    {/* Visualizzazione distanza */}
                    <div className="w-full max-w-lg h-16 relative mt-4">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-slate-300"></div>
                      <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-slate-800"></div>
                      <span className="absolute left-[50%] -top-5 -translate-x-1/2 text-xs font-black text-slate-800">0</span>
                      
                      {/* Distanza -5 */}
                      <div className="absolute left-[0%] top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white z-10"></div>
                      <span className="absolute left-[0%] -top-5 -translate-x-1/2 text-xs font-black text-blue-600">-5</span>
                      <div className="absolute left-[0%] right-[50%] top-[70%] h-2 border-b-2 border-l-2 border-r-2 border-blue-400 rounded-b-lg"></div>
                      <span className="absolute left-[25%] top-[100%] mt-1 -translate-x-1/2 text-[10px] font-bold text-blue-500 uppercase tracking-wider">Distanza 5</span>

                      {/* Distanza +3 */}
                      <div className="absolute left-[80%] top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white z-10"></div>
                      <span className="absolute left-[80%] -top-5 -translate-x-1/2 text-xs font-black text-orange-600">+3</span>
                      <div className="absolute left-[50%] right-[20%] top-[70%] h-2 border-b-2 border-l-2 border-r-2 border-orange-400 rounded-b-lg"></div>
                      <span className="absolute left-[65%] top-[100%] mt-1 -translate-x-1/2 text-[10px] font-bold text-orange-500 uppercase tracking-wider">Distanza 3</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSubtopic === "relative-comparison" && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 border-b border-slate-200 pb-5 mb-2 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 shadow-xs">
                    Disuguaglianze
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                    Chi è più grande?
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Sulla retta graduata, i numeri crescono man mano che si va verso destra. <strong>Chi sta più a destra vince!</strong>
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center">
                  {/* Slider interattivo di confronto */}
                  <div className="w-full max-w-lg mb-8 relative">
                    <div className="h-2 bg-slate-300 rounded-full w-full relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 -mt-2 -mb-2"></div>
                      <span className="absolute left-1/2 top-4 -translate-x-1/2 text-xs font-black text-slate-800">0</span>
                    </div>
                    
                    <input 
                      type="range" min="-10" max="10" value={point1} onChange={(e) => setPoint1(Number(e.target.value))}
                      className="absolute top-0 left-0 w-full opacity-0 cursor-pointer z-20"
                    />
                    <input 
                      type="range" min="-10" max="10" value={point2} onChange={(e) => setPoint2(Number(e.target.value))}
                      className="absolute top-0 left-0 w-full opacity-0 cursor-pointer z-30"
                    />
                    
                    <motion.div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-black z-10 pointer-events-none"
                      animate={{ left: `calc(${((point1 + 10) / 20) * 100}% - 12px)` }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >A</motion.div>
                    <motion.div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-black z-10 pointer-events-none"
                      animate={{ left: `calc(${((point2 + 10) / 20) * 100}% - 12px)` }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >B</motion.div>
                  </div>

                  <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border-2 border-amber-200 shadow-sm">
                    <div className="text-xl font-black text-blue-600 w-12 text-center">{point1 > 0 ? `+${point1}` : point1}</div>
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-2xl border border-amber-300">
                      {point1 === point2 ? "=" : point1 > point2 ? ">" : "<"}
                    </div>
                    <div className="text-xl font-black text-orange-600 w-12 text-center">{point2 > 0 ? `+${point2}` : point2}</div>
                  </div>

                  <p className="text-xs font-bold text-slate-500 mt-4">
                    Sposta i punti A e B cliccando sulla barra!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <h5 className="font-black text-sm text-slate-800 mb-1">0 e i Negativi</h5>
                    <p className="text-xs text-slate-600">Lo zero è sempre maggiore di qualsiasi numero negativo. <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">0 &gt; -4</span></p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <h5 className="font-black text-sm text-slate-800 mb-1">Due Negativi</h5>
                    <p className="text-xs text-slate-600">È maggiore quello con valore assoluto minore (il più vicino a zero). <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">-3 &gt; -7</span></p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <h5 className="font-black text-sm text-slate-800 mb-1">Positivo e Negativo</h5>
                    <p className="text-xs text-slate-600">Un numero positivo è sempre maggiore di un numero negativo. <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">+2 &gt; -3,5</span></p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <h5 className="font-black text-sm text-slate-800 mb-1">Due Positivi</h5>
                    <p className="text-xs text-slate-600">Vince chi ha il valore assoluto più grande (come hai sempre fatto). <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">+9 &gt; +5</span></p>
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
            L'area di allenamento con i quesiti V/F, la retta umana e i test INVALSI è in costruzione. Usa la scheda <strong>Impara</strong> per esplorare i concetti interattivi.
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
