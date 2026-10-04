import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { ArrowLeft, HelpCircle, Heart, Trophy, RotateCcw, X, Check, Sparkles } from "lucide-react";
import {
  STAGES, LIVES, HAND_SIZE, PREDICTION_POINTS, MAX_COMBO, GUESS_POINTS, CARD_LEFT_BONUS,
  type Card, type Rule, type Stage,
} from "./data";

interface Props {
  onBack: () => void;
}

interface Option {
  text: string;
  correct: boolean;
}

interface Evidence {
  card: Card;
  inside: boolean;
}

interface Round {
  stage: Stage;
  /** Regola segreta (per "empty" la regola impossibile, per "capricious" non usata) */
  rule: Rule;
  options: Option[];
  deck: Card[];
  hand: Card[];
  evidence: Evidence[];
  wrongOptions: string[];
}

type Phase = "play" | "guess" | "reveal" | "over" | "finished";

const BEST_KEY = "didalab-buttafuori-record";

const shuffle = <T,>(list: T[]): T[] => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};

const saveBest = (score: number) => {
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // archiviazione non disponibile: il record vale solo per questa partita
  }
};

/** Prepara una serata: estrae la regola segreta, mescola carte e risposte */
const newRound = (stage: Stage): Round => {
  let rule: Rule;
  let options: Option[];
  if (stage.kind === "empty") {
    rule = stage.rules[0];
    options = [
      { text: stage.specialAnswer!, correct: true },
      ...stage.rules.slice(1).map(r => ({ text: r.option, correct: false })),
    ];
  } else if (stage.kind === "capricious") {
    rule = stage.rules[0];
    options = [
      { text: stage.specialAnswer!, correct: true },
      ...stage.rules.map(r => ({ text: r.option, correct: false })),
    ];
  } else {
    rule = shuffle(stage.rules)[0];
    const others = shuffle(stage.rules.filter(r => r.id !== rule.id)).slice(0, 3);
    options = [{ text: rule.option, correct: true }, ...others.map(r => ({ text: r.option, correct: false }))];
  }
  const cards = shuffle(stage.cards);
  return {
    stage,
    rule,
    options: shuffle(options),
    hand: cards.slice(0, HAND_SIZE),
    deck: cards.slice(HAND_SIZE),
    evidence: [],
    wrongOptions: [],
  };
};

/**
 * Decisione del buttafuori. Quello lunatico sceglie, carta dopo carta, la risposta
 * che smentisce più "regole" possibili: sembra a caso, e nessuna regola resta valida.
 */
const decide = (round: Round, card: Card): boolean => {
  const { stage, rule, evidence } = round;
  if (stage.kind !== "capricious") return rule.test(card);
  const stillValid = (inside: boolean) =>
    stage.rules.filter(r => [...evidence, { card, inside }].every(e => r.test(e.card) === e.inside)).length;
  const yes = stillValid(true);
  const no = stillValid(false);
  return yes === no ? Math.random() < 0.5 : yes < no;
};

const LINES = {
  in: ["Prego, entra!", "Sì, tu puoi entrare.", "Benvenuto nel locale!"],
  out: ["Tu no, mi spiace.", "Resta fuori, grazie.", "Niente da fare: fuori!"],
  moodyIn: ["Mi sei simpatico, entra!", "Oggi mi gira bene: dentro!", "Hai una bella faccia, vai."],
  moodyOut: ["Non mi piace la tua faccia.", "Oggi no, chissà domani.", "Mmh… no. Così, perché sì."],
};
const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

const RULES_TEXT = [
  { icon: "🕴️", text: "Il buttafuori fa entrare nel locale solo chi rispetta una regola segreta." },
  { icon: "👆", text: "Scegli una carta e scommetti: entra o resta fuori? Se indovini guadagni punti, e la combo li moltiplica. Se non vuoi rischiare, chiedi e basta." },
  { icon: "💡", text: "Quando pensi di aver capito, premi «Ho capito la regola!» e scegli la risposta. Prima indovini, più punti fai." },
  { icon: "❤️", text: `Hai ${LIVES} vite per tutta la partita: ogni risposta sbagliata sulla regola ne costa una.` },
  { icon: "🤔", text: "Attenzione: non tutti i buttafuori sono uguali. A volte la risposta giusta è una sorpresa!" },
];

function CardFace({ card, size = "md" }: { card: Card; size?: "sm" | "md" }) {
  const isNumber = card.value !== undefined;
  if (size === "sm") {
    return (
      <span className="inline-flex items-center gap-1 font-bold">
        {isNumber ? <span className="font-mono">{card.label}</span> : <><span>{card.emoji}</span><span className="text-[11px]">{card.label}</span></>}
      </span>
    );
  }
  return isNumber ? (
    <span className="font-mono text-3xl font-black">{card.label}</span>
  ) : (
    <span className="flex flex-col items-center gap-0.5">
      <span className="text-3xl">{card.emoji}</span>
      <span className="text-xs font-bold">{card.label}</span>
    </span>
  );
}

function RulesModal({ onClose, first }: { onClose: () => void; first: boolean }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-label="Regole del gioco"
        className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-6 md:p-8 space-y-5 text-left"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <button onClick={onClose} aria-label="Chiudi le regole" className="absolute top-4 right-4 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer">
          <X size={16} />
        </button>
        <div className="text-center space-y-1">
          <div className="text-5xl">🕴️</div>
          <h2 className="text-2xl font-black text-slate-900">Come si gioca</h2>
          <p className="text-sm text-slate-500">Il Buttafuori · 5 serate, 5 regole segrete</p>
        </div>
        <ol className="space-y-3">
          {RULES_TEXT.map((r, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="text-2xl leading-none shrink-0">{r.icon}</span>
              <span className="text-sm text-slate-700 font-medium">{r.text}</span>
            </li>
          ))}
        </ol>
        <button onClick={onClose} className="w-full py-3 rounded-2xl bg-dida-teal hover:bg-[#1f8c82] text-white font-black cursor-pointer">
          {first ? "Ho capito, si gioca!" : "Torna al gioco"}
        </button>
      </motion.div>
    </motion.div>
  );
}

/** Alla fine della serata: l'insieme scritto nei tre linguaggi */
function SetReveal({ round }: { round: Round }) {
  const { stage, rule } = round;

  if (stage.kind === "capricious") {
    return (
      <div className="space-y-3 text-sm text-slate-700">
        <p className="font-black text-lg text-rose-700">Questo NON è un insieme!</p>
        <p>
          Il buttafuori sceglieva in base ai suoi gusti: con le stesse persone, un altro giorno avrebbe deciso diversamente.
          Senza una regola <strong>oggettiva</strong>, uguale per tutti e verificabile, non possiamo dire con sicurezza chi sta dentro e chi fuori.
        </p>
        <p className="font-semibold">È come «i compagni più simpatici»: ognuno avrebbe la sua lista.</p>
      </div>
    );
  }

  const members = stage.cards.filter(c => rule.test(c));
  const others = stage.cards.filter(c => !rule.test(c));
  const list = (cards: Card[]) => (cards.length ? `{ ${cards.map(c => c.label).join(", ")} }` : "{ } = ∅");

  if (stage.kind === "subset") {
    const club = stage.clubRule!;
    return (
      <div className="space-y-4 text-sm text-slate-700">
        <div className="grid gap-2 font-mono text-xs md:text-sm">
          <p><strong className="font-sans">Proprietà:</strong> A = {"{"} x | {club.property} {"}"}, B = {"{"} x | x ∈ A e {rule.property.replace(/^x è /, "è ")} {"}"}</p>
          <p><strong className="font-sans">Elenco:</strong> B = {list(members)}</p>
        </div>
        <div className="relative mx-auto max-w-md rounded-[50%] border-4 border-blue-400 bg-blue-50 px-6 py-8 text-center">
          <span className="absolute -top-3 left-6 bg-white px-2 text-xs font-black text-blue-700">A · locale</span>
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            {others.map(c => <span key={c.id} className="px-2 py-0.5 rounded-lg bg-white border border-blue-200 text-xs"><CardFace card={c} size="sm" /></span>)}
          </div>
          <div className="relative rounded-[50%] border-4 border-amber-400 bg-amber-50 px-4 py-4">
            <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-black text-amber-700">B · privé</span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {members.map(c => <span key={c.id} className="px-2 py-0.5 rounded-lg bg-white border border-amber-300 text-xs"><CardFace card={c} size="sm" /></span>)}
            </div>
          </div>
        </div>
        <p className="text-center font-black text-amber-800 text-base">B ⊂ A: ogni numero del privé sta anche nel locale. B è un sottoinsieme di A!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm text-slate-700">
      <div className="grid gap-2 font-mono text-xs md:text-sm">
        <p><strong className="font-sans">Proprietà caratteristica:</strong> A = {"{"} x | {rule.property} {"}"}</p>
        <p><strong className="font-sans">Elenco</strong> <span className="font-sans text-slate-500">(tra le carte di stasera)</span>: A = {list(members)}</p>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full rounded-[50%] border-4 border-emerald-400 bg-emerald-50 px-6 py-7 min-h-28 flex flex-wrap justify-center items-center gap-1.5">
          <span className="absolute -top-3 left-6 bg-white px-2 text-xs font-black text-emerald-700">A</span>
          {members.length === 0
            ? <span className="text-4xl font-black text-emerald-700">∅</span>
            : members.map(c => <span key={c.id} className="px-2 py-0.5 rounded-lg bg-white border border-emerald-300 text-xs"><CardFace card={c} size="sm" /></span>)}
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 md:max-w-[40%]">
          {others.map(c => <span key={c.id} className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-500"><CardFace card={c} size="sm" /></span>)}
        </div>
      </div>
      {stage.kind === "empty" && (
        <p className="text-center font-black text-emerald-800 text-base">Nessun numero naturale sta tra 7 e 8: la regola è chiarissima, ma non la rispetta nessuno. È l'insieme vuoto ∅!</p>
      )}
    </div>
  );
}

export default function BouncerGame({ onBack }: Props) {
  const [stageIndex, setStageIndex] = useState(0);
  const [round, setRound] = useState<Round>(() => newRound(STAGES[0]));
  const [phase, setPhase] = useState<Phase>("play");
  const [showRules, setShowRules] = useState(true);
  const [firstRules, setFirstRules] = useState(true);
  const [lives, setLives] = useState(LIVES);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [best, setBest] = useState(readBest);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bubble, setBubble] = useState(STAGES[0].intro);
  const [feedback, setFeedback] = useState<{ text: string; good: boolean } | null>(null);
  const [earned, setEarned] = useState(0);

  const { stage, hand, deck, evidence } = round;
  const isSubset = stage.kind === "subset";
  const insideLabel = isSubset ? "Nel privé" : "Dentro";
  const outsideLabel = isSubset ? "In sala" : "Fuori";
  const selected = hand.find(c => c.id === selectedId) ?? null;
  const cardsLeft = hand.length + deck.length;

  const finishGame = (finalScore: number) => {
    if (finalScore > best) {
      setBest(finalScore);
      saveBest(finalScore);
    }
  };

  const play = (prediction: boolean | null) => {
    if (!selected) return;
    const inside = decide(round, selected);
    const moody = stage.kind === "capricious";
    setBubble(pick(inside ? (moody ? LINES.moodyIn : LINES.in) : (moody ? LINES.moodyOut : LINES.out)));
    if (prediction === null) {
      setFeedback(null);
    } else if (prediction === inside) {
      const points = PREDICTION_POINTS * combo;
      setScore(s => s + points);
      setCombo(c => Math.min(MAX_COMBO, c + 1));
      setFeedback({ text: `Previsione giusta! +${points}`, good: true });
    } else {
      setCombo(1);
      setFeedback({ text: "Previsione sbagliata: la combo riparte da ×1", good: false });
    }
    const [next, ...rest] = deck;
    setRound(r => ({
      ...r,
      evidence: [...r.evidence, { card: selected, inside }],
      hand: next ? r.hand.map(c => (c.id === selected.id ? next : c)) : r.hand.filter(c => c.id !== selected.id),
      deck: rest,
    }));
    setSelectedId(null);
  };

  const guess = (option: Option) => {
    if (option.correct) {
      const points = GUESS_POINTS + CARD_LEFT_BONUS * cardsLeft;
      setEarned(points);
      setScore(s => s + points);
      setBubble(stage.kind === "capricious" ? "Mi hai scoperto… sceglievo a simpatia!" : "Bravo, hai scoperto la mia regola!");
      setPhase("reveal");
      if (stageIndex === STAGES.length - 1) finishGame(score + points);
      return;
    }
    const left = lives - 1;
    setLives(left);
    setRound(r => ({ ...r, wrongOptions: [...r.wrongOptions, option.text] }));
    setBubble("Eh no, non è questa la mia regola!");
    if (left === 0) {
      setPhase("over");
      finishGame(score);
    }
  };

  const goToStage = (index: number) => {
    setStageIndex(index);
    setRound(newRound(STAGES[index]));
    setPhase("play");
    setSelectedId(null);
    setFeedback(null);
    setBubble(STAGES[index].intro);
  };

  const restart = () => {
    setLives(LIVES);
    setScore(0);
    setCombo(1);
    goToStage(0);
  };

  const nextStage = () => {
    if (stageIndex === STAGES.length - 1) setPhase("finished");
    else goToStage(stageIndex + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-5xl mx-auto space-y-5 pb-20 px-3 text-left"
    >
      {/* Barra in alto */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} aria-label="Esci dal gioco" className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-dida-blue transition shadow-sm cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-emerald-700">Gioca · Il linguaggio degli insiemi</p>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Il Buttafuori 🕴️</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-0.5 px-3 py-2 rounded-xl bg-white border border-slate-200" aria-label={`Vite rimaste: ${lives}`}>
            {Array.from({ length: LIVES }, (_, i) => (
              <Heart key={i} size={18} className={i < lives ? "fill-rose-500 text-rose-500" : "text-slate-300"} />
            ))}
          </div>
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-black text-slate-800 text-sm">
            ⭐ {score}
          </div>
          {combo > 1 && <div className="px-3 py-2 rounded-xl bg-amber-100 border border-amber-300 font-black text-amber-800 text-sm">Combo ×{combo}</div>}
          <button
            onClick={() => { setFirstRules(false); setShowRules(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dida-blue text-white font-bold text-sm cursor-pointer hover:bg-blue-700"
          >
            <HelpCircle size={16} /> Regole
          </button>
        </div>
      </div>

      {/* Avanzamento serate */}
      <div className="flex gap-1.5">
        {STAGES.map((s, i) => (
          <div key={s.id} className={`h-2 flex-1 rounded-full ${i < stageIndex ? "bg-emerald-500" : i === stageIndex ? "bg-dida-orange" : "bg-slate-200"}`} />
        ))}
      </div>

      {(phase === "play" || phase === "guess") && (
        <LayoutGroup>
          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm p-5 md:p-7 space-y-5">
            {/* Il buttafuori */}
            <div className="flex items-center gap-4">
              <motion.div key={bubble} initial={{ rotate: -8 }} animate={{ rotate: 0 }} className="text-6xl shrink-0" aria-hidden>🕴️</motion.div>
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">{stage.title}</p>
                <motion.div key={bubble} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-1 inline-block px-4 py-2.5 rounded-2xl rounded-tl-sm bg-slate-900 text-white font-bold text-sm">
                  {bubble}
                </motion.div>
                {isSubset && (
                  <p className="mt-2 text-xs font-semibold text-blue-700">Tutte le carte sono già nel locale (numeri pari). Scopri chi va nel privé!</p>
                )}
              </div>
            </div>

            {/* Dentro / Fuori */}
            <div className="grid grid-cols-2 gap-3">
              {[true, false].map((inside) => (
                <div key={String(inside)} className={`rounded-2xl border-2 border-dashed p-3 min-h-24 ${inside ? "border-emerald-300 bg-emerald-50/60" : "border-rose-200 bg-rose-50/50"}`}>
                  <p className={`text-xs font-black uppercase mb-2 ${inside ? "text-emerald-700" : "text-rose-600"}`}>
                    {inside ? `✅ ${insideLabel}` : `❌ ${outsideLabel}`}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {evidence.filter(e => e.inside === inside).map(e => (
                      <motion.span layoutId={e.card.id} key={e.card.id} className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-sm shadow-xs">
                        <CardFace card={e.card} size="sm" />
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {feedback && (
              <p className={`text-sm font-bold text-center ${feedback.good ? "text-emerald-700" : "text-rose-600"}`}>{feedback.text}</p>
            )}

            {phase === "play" ? (
              <>
                {/* Le carte in mano */}
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2">
                    Scegli una carta da presentare al buttafuori · carte rimaste: {cardsLeft}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {hand.map(card => (
                      <motion.button
                        layoutId={card.id}
                        key={card.id}
                        onClick={() => setSelectedId(card.id === selectedId ? null : card.id)}
                        whileTap={{ scale: 0.95 }}
                        className={`h-24 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-colors ${
                          card.id === selectedId ? "border-dida-orange bg-orange-50 ring-4 ring-orange-200" : "border-slate-200 bg-white hover:border-slate-400"
                        }`}
                        aria-pressed={card.id === selectedId}
                      >
                        <CardFace card={card} />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Scommessa sulla carta scelta */}
                {selected ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <span className="text-sm font-bold text-slate-600">Secondo te {selected.label} {isSubset ? "va nel privé" : "entra"}?</span>
                    <button onClick={() => play(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-sm cursor-pointer hover:bg-emerald-700">✅ Sì, {isSubset ? "nel privé" : "entra"}</button>
                    <button onClick={() => play(false)} className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-black text-sm cursor-pointer hover:bg-rose-700">❌ No, {isSubset ? "resta in sala" : "fuori"}</button>
                    <button onClick={() => play(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-sm cursor-pointer hover:bg-slate-50">🤷 Non so, chiedi</button>
                  </div>
                ) : (
                  cardsLeft === 0 && <p className="text-center text-sm font-bold text-dida-orange">Carte finite: è il momento di indovinare la regola!</p>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={() => setPhase("guess")}
                    disabled={evidence.length === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-white shadow-md ${
                      evidence.length === 0 ? "bg-slate-300 cursor-not-allowed" : `bg-dida-orange hover:bg-orange-600 cursor-pointer ${cardsLeft === 0 ? "animate-pulse" : ""}`
                    }`}
                  >
                    <Sparkles size={18} /> Ho capito la regola!
                  </button>
                </div>
              </>
            ) : (
              /* Scelta della regola */
              <div className="space-y-3">
                <p className="text-center font-black text-slate-800">
                  {isSubset ? "Chi va nel privé?" : "Qual è la regola del buttafuori?"}
                  <span className="block text-xs font-semibold text-slate-500">Prima indovini, più punti: ora valgono {GUESS_POINTS + CARD_LEFT_BONUS * cardsLeft}. Una risposta sbagliata costa una vita.</span>
                </p>
                <div className="grid gap-2 max-w-xl mx-auto">
                  {round.options.map(option => {
                    const wrong = round.wrongOptions.includes(option.text);
                    return (
                      <button
                        key={option.text}
                        onClick={() => guess(option)}
                        disabled={wrong}
                        className={`px-4 py-3 rounded-2xl border-2 text-sm font-bold text-left transition ${
                          wrong ? "border-rose-200 bg-rose-50 text-rose-400 line-through cursor-not-allowed" : "border-slate-200 bg-white hover:border-dida-orange hover:bg-orange-50 cursor-pointer text-slate-800"
                        }`}
                      >
                        {option.text}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-center">
                  <button onClick={() => setPhase("play")} className="text-sm font-bold text-slate-500 hover:text-slate-800 cursor-pointer">← Voglio provare ancora qualche carta</button>
                </div>
              </div>
            )}
          </div>
        </LayoutGroup>
      )}

      {phase === "reveal" && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[2rem] bg-white border-2 border-emerald-300 shadow-sm p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center"><Check size={28} /></div>
            <div>
              <p className="text-xs font-black uppercase text-emerald-700">{stage.title} · superata!</p>
              <p className="text-lg font-black text-slate-900">+{earned} punti</p>
            </div>
          </div>
          <SetReveal round={round} />
          <div className="flex justify-end">
            <button onClick={nextStage} className="px-6 py-3 rounded-2xl bg-dida-teal hover:bg-[#1f8c82] text-white font-black cursor-pointer">
              {stageIndex === STAGES.length - 1 ? "Vedi il risultato →" : "Prossima serata →"}
            </button>
          </div>
        </motion.div>
      )}

      {(phase === "over" || phase === "finished") && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[2rem] bg-white border border-slate-200 shadow-sm p-8 text-center space-y-4">
          <div className="text-6xl">{phase === "finished" ? "🏆" : "🚪"}</div>
          <h2 className="text-2xl font-black text-slate-900">
            {phase === "finished" ? "Hai battuto tutti i buttafuori!" : "Vite finite: il buttafuori ti ha chiuso fuori!"}
          </h2>
          <p className="text-slate-600 font-semibold">
            Punteggio: <span className="font-black text-slate-900">{score}</span> · Serate superate: {phase === "finished" ? STAGES.length : stageIndex} su {STAGES.length}
          </p>
          <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-amber-700"><Trophy size={16} /> Record su questo dispositivo: {Math.max(best, score)}</p>
          <div className="flex justify-center gap-3">
            <button onClick={restart} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-dida-orange hover:bg-orange-600 text-white font-black cursor-pointer">
              <RotateCcw size={18} /> Gioca ancora
            </button>
            <button onClick={onBack} className="px-6 py-3 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold cursor-pointer hover:bg-slate-50">Esci</button>
          </div>
          <p className="text-xs text-slate-400">Ogni partita estrae regole e carte diverse.</p>
        </motion.div>
      )}

      <AnimatePresence>
        {showRules && <RulesModal first={firstRules} onClose={() => setShowRules(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
