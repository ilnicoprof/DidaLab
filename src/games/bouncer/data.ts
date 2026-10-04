/**
 * Dati del gioco "Il Buttafuori" (linguaggio degli insiemi).
 * Ogni serata ha un mazzo di carte e un elenco di regole: a ogni partita
 * se ne estrae una come regola segreta, le altre diventano le risposte sbagliate.
 */

export interface Card {
  id: string;
  label: string;
  emoji: string;
  /** Caratteristiche usate dalle regole */
  tags: string[];
  value?: number;
}

export interface Rule {
  id: string;
  /** Come compare tra le risposte: "I numeri pari" */
  option: string;
  /** Proprietà caratteristica: "x è un numero pari" */
  property: string;
  test: (card: Card) => boolean;
}

export type StageKind = "normal" | "empty" | "capricious" | "subset";

export interface Stage {
  id: string;
  title: string;
  /** Frase del buttafuori a inizio serata */
  intro: string;
  kind: StageKind;
  cards: Card[];
  rules: Rule[];
  /** Solo per "subset": la regola del locale, già nota a tutti */
  clubRule?: Rule;
  /** Solo per "empty" e "capricious": la risposta giusta */
  specialAnswer?: string;
}

const numberCards = (values: number[]): Card[] =>
  values.map(n => ({ id: `n${n}`, label: String(n), emoji: "", tags: [], value: n }));

const num = (card: Card) => card.value ?? 0;

const NUMBER_RULES: Rule[] = [
  { id: "even", option: "I numeri pari", property: "x è un numero pari", test: c => num(c) % 2 === 0 },
  { id: "odd", option: "I numeri dispari", property: "x è un numero dispari", test: c => num(c) % 2 === 1 },
  { id: "mult3", option: "I multipli di 3", property: "x è un multiplo di 3", test: c => num(c) % 3 === 0 },
  { id: "gt12", option: "I numeri maggiori di 12", property: "x è un numero maggiore di 12", test: c => num(c) > 12 },
  { id: "lt10", option: "I numeri minori di 10", property: "x è un numero minore di 10", test: c => num(c) < 10 },
  { id: "mult5", option: "I multipli di 5", property: "x è un multiplo di 5", test: c => num(c) % 5 === 0 },
];

const animal = (id: string, label: string, emoji: string, tags: string[]): Card => ({ id, label, emoji, tags });

const ANIMALS: Card[] = [
  animal("eagle", "Aquila", "🦅", ["vola", "uccello"]),
  animal("penguin", "Pinguino", "🐧", ["uccello", "acqua"]),
  animal("dolphin", "Delfino", "🐬", ["mammifero", "acqua"]),
  animal("dog", "Cane", "🐶", ["mammifero", "quattro"]),
  animal("cat", "Gatto", "🐱", ["mammifero", "quattro"]),
  animal("frog", "Rana", "🐸", ["acqua", "quattro"]),
  animal("bat", "Pipistrello", "🦇", ["mammifero", "vola"]),
  animal("snake", "Serpente", "🐍", []),
  animal("fish", "Pesce", "🐟", ["acqua"]),
  animal("bee", "Ape", "🐝", ["vola"]),
  animal("cow", "Mucca", "🐄", ["mammifero", "quattro"]),
  animal("duck", "Anatra", "🦆", ["vola", "uccello", "acqua"]),
  animal("spider", "Ragno", "🕷️", []),
  animal("turtle", "Tartaruga", "🐢", ["acqua", "quattro"]),
];

const has = (tag: string) => (card: Card) => card.tags.includes(tag);

const ANIMAL_RULES: Rule[] = [
  { id: "fly", option: "Gli animali che volano", property: "x è un animale che vola", test: has("vola") },
  { id: "water", option: "Gli animali che vivono in acqua (anche solo in parte)", property: "x è un animale che vive in acqua", test: has("acqua") },
  { id: "mammal", option: "I mammiferi", property: "x è un mammifero", test: has("mammifero") },
  { id: "four", option: "Gli animali con quattro zampe", property: "x è un animale con quattro zampe", test: has("quattro") },
  { id: "bird", option: "Gli uccelli", property: "x è un uccello", test: has("uccello") },
];

const person = (id: string, label: string, emoji: string, tags: string[]): Card => ({ id, label, emoji, tags });

const PEOPLE: Card[] = [
  person("marta", "Marta", "👩", ["occhiali", "finiscea"]),
  person("luca", "Luca", "👦", ["cappello", "finiscea"]),
  person("sofia", "Sofia", "👧", ["cappello", "finiscea"]),
  person("pietro", "Pietro", "🧑", ["occhiali"]),
  person("giulia", "Giulia", "👩‍🦰", ["finiscea"]),
  person("omar", "Omar", "👨", ["cappello", "occhiali"]),
  person("chen", "Chen", "🧒", []),
  person("anna", "Anna", "👱‍♀️", ["occhiali", "cappello", "finiscea"]),
  person("davide", "Davide", "🧔", ["occhiali"]),
  person("elena", "Elena", "👩‍🦱", ["cappello", "finiscea"]),
  person("samuel", "Samuel", "👨‍🦲", []),
  person("irene", "Irene", "👵", ["occhiali"]),
];

export const STAGES: Stage[] = [
  {
    id: "numbers",
    title: "Serata 1 · I numeri",
    intro: "Stasera faccio entrare solo certi numeri. Riesci a capire quali?",
    kind: "normal",
    cards: numberCards([2, 7, 10, 13, 4, 15, 8, 21, 6, 9, 12, 3, 18, 5, 20, 11]),
    rules: NUMBER_RULES,
  },
  {
    id: "animals",
    title: "Serata 2 · Lo zoo",
    intro: "Festa per animali! Ma io ne faccio entrare solo alcuni…",
    kind: "normal",
    cards: ANIMALS,
    rules: ANIMAL_RULES,
  },
  {
    id: "moody",
    title: "Serata 3 · Il buttafuori lunatico",
    intro: "Stasera decido io chi entra. Fidati di me!",
    kind: "capricious",
    cards: PEOPLE,
    rules: [
      { id: "glasses", option: "Chi porta gli occhiali", property: "x porta gli occhiali", test: has("occhiali") },
      { id: "hat", option: "Chi porta il cappello", property: "x porta il cappello", test: has("cappello") },
      { id: "endsA", option: "Chi ha il nome che finisce per A", property: "il nome di x finisce per A", test: has("finiscea") },
    ],
    specialAnswer: "Non c'è una regola oggettiva: decide il suo umore",
  },
  {
    id: "empty",
    title: "Serata 4 · Il locale deserto",
    intro: "Ho una regola precisissima. Vediamo chi la rispetta…",
    kind: "empty",
    cards: numberCards([3, 16, 8, 19, 1, 12, 7, 20, 14, 5, 10, 17]),
    rules: [
      { id: "between", option: "", property: "x è un numero naturale compreso tra 7 e 8", test: () => false },
      { id: "gt15", option: "I numeri maggiori di 15", property: "x è un numero maggiore di 15", test: c => num(c) > 15 },
      { id: "odd", option: "I numeri dispari", property: "x è un numero dispari", test: c => num(c) % 2 === 1 },
      { id: "mult4", option: "I multipli di 4", property: "x è un multiplo di 4", test: c => num(c) % 4 === 0 },
    ],
    specialAnswer: "Nessuno può entrare: è l'insieme vuoto ∅",
  },
  {
    id: "vip",
    title: "Serata 5 · Il privé",
    intro: "Nel locale entrano i numeri pari. Ma nel privé solo alcuni di loro!",
    kind: "subset",
    cards: numberCards([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]),
    clubRule: { id: "even", option: "I numeri pari", property: "x è un numero pari", test: c => num(c) % 2 === 0 },
    rules: [
      { id: "mult4", option: "I multipli di 4", property: "x è un multiplo di 4", test: c => num(c) % 4 === 0 },
      { id: "mult6", option: "I multipli di 6", property: "x è un multiplo di 6", test: c => num(c) % 6 === 0 },
      { id: "gt14", option: "I numeri maggiori di 14", property: "x è un numero maggiore di 14", test: c => num(c) > 14 },
      { id: "mult10", option: "I multipli di 10", property: "x è un multiplo di 10", test: c => num(c) % 10 === 0 },
    ],
  },
];

export const LIVES = 3;
export const HAND_SIZE = 6;
/** Punti per una previsione giusta, moltiplicati per la combo */
export const PREDICTION_POINTS = 10;
export const MAX_COMBO = 5;
/** Punti per la regola indovinata, più un bonus per ogni carta non ancora usata */
export const GUESS_POINTS = 50;
export const CARD_LEFT_BONUS = 15;
