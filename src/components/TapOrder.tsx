import { useState } from "react";
import { RotateCcw } from "lucide-react";

interface Props {
  /** Passaggi nell'ordine corretto */
  steps: string[];
  /** Ordine in cui mostrarli (indici di steps), diverso da quello corretto */
  display: number[];
  /** Classe Tailwind del colore del numero assegnato, es. "bg-orange-500" */
  accent: string;
}

/**
 * Esercizio "Metti in ordine" accessibile: si toccano le schede una dopo l'altra
 * e ognuna riceve il numero successivo (niente trascinamento).
 */
export default function TapOrder({ steps, display, accent }: Props) {
  const [picked, setPicked] = useState<number[]>([]);
  const done = picked.length === steps.length;
  const correct = done && picked.every((stepIndex, position) => stepIndex === position);

  const toggle = (stepIndex: number) =>
    setPicked(prev => (prev.includes(stepIndex) ? prev.filter(i => i !== stepIndex) : [...prev, stepIndex]));

  return (
    <div className="space-y-3">
      <div className={`grid grid-cols-1 gap-3 ${display.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {display.map((stepIndex) => {
          const position = picked.indexOf(stepIndex);
          return (
            <button
              key={stepIndex}
              onClick={() => toggle(stepIndex)}
              className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:border-slate-400 transition text-left"
            >
              <span className="font-extrabold text-xs text-slate-800 uppercase">{steps[stepIndex]}</span>
              <span
                className={`w-8 h-8 shrink-0 rounded-xl font-black text-sm flex items-center justify-center ${
                  position >= 0 ? `${accent} text-white shadow-sm` : "border-2 border-dashed border-slate-300 text-slate-300"
                }`}
              >
                {position >= 0 ? position + 1 : "?"}
              </span>
            </button>
          );
        })}
      </div>
      {done && (
        <div className="flex items-center justify-between gap-3">
          <p className={`text-xs font-bold ${correct ? "text-emerald-700" : "text-rose-700"}`}>
            {correct ? "✓ Ordine giusto, bravo!" : "✗ L'ordine non è giusto: riprova."}
          </p>
          <button
            onClick={() => setPicked([])}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RotateCcw size={14} /> Ricomincia
          </button>
        </div>
      )}
      {!done && <p className="text-[11px] font-semibold text-slate-500">Tocca le schede nell'ordine giusto. Tocca di nuovo per togliere il numero.</p>}
    </div>
  );
}
