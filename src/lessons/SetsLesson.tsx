import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, BookOpen, Zap, CheckCircle2, XCircle, Sparkles,
  Layers, HelpCircle, ChevronRight, RotateCcw, AlertCircle, Info, Award
} from "lucide-react";

interface Props {
  key?: string;
  onBack: () => void;
  subjectName: string;
  topicName: string;
  initialSubtopicId?: string;
  initialTab?: "impara" | "allena";
}

// Subtopic categories with natural, pedagogical wording
const SET_SUBTOPICS = [
  { id: "sets", title: "Criteri e Simboli", desc: "Regola oggettiva, elementi e notazione ∈ / ∉" },
  { id: "particular-sets", title: "Finito, Infinito, Vuoto", desc: "La quantità di componenti e il simbolo ∅" },
  { id: "representations", title: "I Tre Linguaggi", desc: "Elenco tra graffe, proprietà comune e diagramma grafico" },
  { id: "subsets", title: "Sottoinsiemi e Combinazioni", desc: "La relazione ⊂ e il laboratorio della gelateria" },
  { id: "intersection-union", title: "Intersezione e Unione", desc: "Elementi in comune (∩), unione complessiva (∪) e insiemi disgiunti" },
];

export default function SetsLesson({ onBack, subjectName, topicName, initialSubtopicId, initialTab = "impara" }: Props) {
  const [activeTab, setActiveTab] = useState<"impara" | "allena">(initialTab);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>(
    initialSubtopicId && SET_SUBTOPICS.some(s => s.id === initialSubtopicId)
      ? initialSubtopicId
      : "sets"
  );

  // --- INTERACTIVE LAB STATES ---
  const [vennMode, setVennMode] = useState<"both" | "intersect" | "union" | "disjoint">("both");
  const [selectedNamePair, setSelectedNamePair] = useState<"marco-sofia" | "chitarra-disegno">("marco-sofia");
  
  // Gelateria builder (instead of sandwich!)
  const [gelatoFlavors, setGelatoFlavors] = useState<string[]>(["cioccolato"]);

  // --- TRAINING / ALLENA EXERCISES STATES ---
  const [isSetAnswers, setIsSetAnswers] = useState<Record<number, boolean | null>>({});
  const [fivAnswers, setFivAnswers] = useState<Record<number, "F" | "I" | "V" | null>>({});
  const [invalsiAnswers, setInvalsiAnswers] = useState<Record<number, boolean | null>>({});
  const [vfAnswers, setVfAnswers] = useState<Record<number, boolean | null>>({});

  const toggleFlavor = (fl: string) => {
    setGelatoFlavors(prev =>
      prev.includes(fl) ? prev.filter(i => i !== fl) : [...prev, fl]
    );
  };

  // Fresh questions suited for middle schoolers
  const isSetQuestions = [
    { id: 1, text: "I giorni della settimana che iniziano con la lettera «M»", isSet: true, reason: "Regola oggettiva e verificabile: martedì e mercoledì, senza alcun dubbio!" },
    { id: 2, text: "I cantanti più bravi e famosi d'Italia", isSet: false, reason: "Parere personale: chi è bravo per te potrebbe non piacere a un compagno." },
    { id: 3, text: "I numeri naturali pari più piccoli di 15", isSet: true, reason: "Criterio matematico rigoroso: {0, 2, 4, 6, 8, 10, 12, 14}." },
    { id: 4, text: "I film di animazione più commoventi di sempre", isSet: false, reason: "L'emozione è soggettiva e non misurabile in modo scientifico." },
    { id: 5, text: "I caratteri alfabetici che compongono la parola «STELLA»", isSet: true, reason: "Lettere chiare ed evidenti: {s, t, e, l, a} (senza doppioni)." },
    { id: 6, text: "I videogiochi più appassionanti da giocare online", isSet: false, reason: "Il livello di divertimento dipende dai gusti di ciascun giocatore." },
    { id: 7, text: "I pianeti del nostro Sistema Solare che possiedono anelli", isSet: true, reason: "Fatto astronomico oggettivo accertato dalla scienza (Saturno, Giove, Urano, Nettuno)." },
    { id: 8, text: "I compiti di matematica particolarmente faticosi", isSet: false, reason: "La difficoltà percepita è personale e varia da studente a studente." },
  ];

  // Questions for Finito / Infinito / Vuoto
  const fivQuestions = [
    { id: 1, text: "I tasti presenti su una normale calcolatrice tascabile", correct: "F", note: "Insieme Finito: si possono contare uno ad uno in pochi secondi." },
    { id: 2, text: "La serie di tutti i numeri dispari {1, 3, 5, 7, 9, ...}", correct: "I", note: "Insieme Infinito: dopo ogni numero dispari ne esiste sempre uno successivo!" },
    { id: 3, text: "I mesi dell'anno solare che contano 40 giorni", correct: "V", note: "Insieme Vuoto (∅): nessun mese dura così a lungo, non esiste alcun elemento." },
    { id: 4, text: "I gatti domestici provvisti naturalmente di branchie da pesce", correct: "V", note: "Insieme Vuoto (∅): non esiste nessun animale vivente con questa anatomia." },
    { id: 5, text: "Le rette geometriche che possono passare per un singolo punto", correct: "I", note: "Insieme Infinito: per un punto passano infinite rette (fascio di rette)." },
    { id: 6, text: "I banchi disposti nell'aula della nostra classe", correct: "F", note: "Insieme Finito: il conteggio ha un inizio e una fine precisa." },
    { id: 7, text: "I numeri interi compresi tra il 5 e il 6", correct: "V", note: "Insieme Vuoto (∅): tra 5 e 6 ci sono numeri con la virgola (decimali), ma nessun intero!" },
  ];

  // Questions for INVALSI Venn (Fresh 24 students scenario)
  const invalsiQuestions = [
    { id: 1, prompt: "La classe è formata in tutto da 24 studenti.", correct: true, explain: "Esatto: sommando 11 (solo nuoto) + 6 (entrambi gli sport) + 5 (solo basket) + 2 (nessuno sport) si ottiene 24." },
    { id: 2, prompt: "Gli studenti che praticano il nuoto sono complessivamente 17.", correct: true, explain: "Esatto: chi fa nuoto comprende sia chi fa solo nuoto (11) sia chi fa anche basket (6): 11 + 6 = 17." },
    { id: 3, prompt: "6 studenti svolgono entrambe le discipline sportive.", correct: true, explain: "Corretto: il 6 occupa proprio lo spazio centrale di intersezione tra i due cerchi." },
    { id: 4, prompt: "Chi pratica esclusivamente il basket sono 11 allievi.", correct: false, explain: "Falso: chi pratica SOLO il basket sono 5 allievi (11 è chi fa solo nuoto!)." },
  ];

  // Questions for Vero/Falso Finale
  const vfQuestions = [
    { id: 1, text: "L'espressione «I libri interessanti» definisce un insieme matematico.", correct: false, explain: "Falso: l'interesse è soggettivo, ciò che è interessante per te può non esserlo per altri." },
    { id: 2, text: "Dato l'insieme P delle vocali della parola «barca», allora a ∈ P.", correct: true, explain: "Vero: la vocale 'a' fa indubbiamente parte dell'insieme considerato." },
    { id: 3, text: "L'insieme dei numeri pari divisibili per 2 è un insieme vuoto.", correct: false, explain: "Falso: è un insieme infinito, tutti i numeri pari sono divisibili per 2!" },
    { id: 4, text: "L'insieme dei giorni della settimana ha cardinalità pari a 7.", correct: true, explain: "Vero: lunedì, martedì, mercoledì, giovedì, venerdì, sabato e domenica sono 7 elementi." },
    { id: 5, text: "Se tutti gli elementi di B si trovano anche in A, allora B ⊂ A.", correct: true, explain: "Vero: questa è esattamente la definizione matematica di sottoinsieme (inclusione)." },
    { id: 6, text: "Quando calcoliamo l'unione (A ∪ B), gli elementi in comune si contano due volte.", correct: false, explain: "Falso: negli insiemi ogni elemento viene registrato una sola volta, senza doppioni." },
    { id: 7, text: "L'intersezione tra l'insieme dei cani e l'insieme dei pesci è vuota (disgiunti).", correct: true, explain: "Vero: non esiste alcun animale che sia contemporaneamente un cane e un pesce!" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-7xl mx-auto space-y-8 pb-16"
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
              Il Mondo degli Insiemi
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

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "impara" ? (
          <motion.div
            key="tab-impara"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4"
          >
            {/* Menu Laterale Sottoargomenti */}
            <div className="lg:col-span-3 space-y-2">
              {SET_SUBTOPICS.map((sub) => (
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

            {/* SUBTOPIC 1: CRITERI E SIMBOLI */}
            {selectedSubtopic === "sets" && (
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Centered Heading */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      Che cos'è un insieme?
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                      Regole Chiare per Stare nel Gruppo
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Nel linguaggio di tutti i giorni usiamo parole come «gruppo» o «mucchio». Ma per i matematici, un insieme ha una caratteristica speciale: non lascia spazio ai dubbi!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50/60 border border-blue-200/60 space-y-3 text-center md:text-left">
                      <div className="inline-block text-xs font-bold uppercase tracking-wider text-dida-blue bg-white px-3 py-1 rounded-full border border-blue-200">
                        Proprietà Oggettiva ✅
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Gli iscritti al laboratorio di robotica della scuola</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        C'è una lista ufficiale in segreteria: se prendiamo un qualunque studente della scuola, possiamo dire subito con <strong>sicurezza</strong> se è iscritto oppure no.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-50/60 border border-orange-200/60 space-y-3 text-center md:text-left">
                      <div className="inline-block text-xs font-bold uppercase tracking-wider text-dida-orange bg-white px-3 py-1 rounded-full border border-orange-200">
                        Opinione Soggettiva ❌
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">I compagni di classe più simpatici e divertenti</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Ognuno ha i propri gusti e le proprie amicizie: non esiste uno strumento scientifico per misurare la simpatia, quindi <strong>non</strong> è un insieme matematico.
                      </p>
                    </div>
                  </div>

                  {/* Centered Da Ricordare Box */}
                  <div className="rounded-3xl bg-amber-50 border-2 border-amber-200 p-6 md:p-8 text-center space-y-2 max-w-3xl mx-auto shadow-sm">
                    <div className="inline-flex items-center gap-2 text-amber-900 font-black text-sm uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-amber-200">
                      <Sparkles size={16} className="text-amber-600" />
                      Definizione Importante
                    </div>
                    <p className="text-slate-800 font-extrabold text-xl pt-1">
                      Un insieme è una raccolta di elementi scelti con un criterio oggettivo, uguale e verificabile per tutti.
                    </p>
                    <p className="text-slate-600 text-sm max-w-xl mx-auto">
                      Gli insiemi si battezzano con <strong>lettere MAIUSCOLE</strong> (<span className="font-mono font-bold text-blue-600">A, B, C...</span>), mentre i singoli oggetti contenuti al loro interno si scrivono in <strong>lettere minuscole</strong> (<span className="font-mono font-bold text-blue-600">a, b, x...</span>).
                    </p>
                  </div>

                  {/* Simboli di appartenenza */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="text-center max-w-xl mx-auto">
                      <h3 className="text-xl font-bold text-slate-800">I Simboli di Appartenenza</h3>
                      <p className="text-xs text-slate-500 mt-1">Esempio: consideriamo l'insieme V formato dalle lettere della parola «stella» = &#123;s, t, e, l, a&#125;</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-dida-blue text-white flex items-center justify-center text-4xl font-serif font-black shadow-md shrink-0">
                          ∈
                        </div>
                        <div>
                          <p className="text-xs font-bold text-dida-blue uppercase tracking-wider">Appartiene a</p>
                          <p className="text-lg font-mono font-black text-slate-800">s ∈ V</p>
                          <p className="text-xs text-slate-500 mt-0.5">La lettera 's' si trova all'interno del nostro insieme V</p>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-dida-orange text-white flex items-center justify-center text-4xl font-serif font-black shadow-md shrink-0">
                          ∉
                        </div>
                        <div>
                          <p className="text-xs font-bold text-dida-orange uppercase tracking-wider">Non appartiene a</p>
                          <p className="text-lg font-mono font-black text-slate-800">m ∉ V</p>
                          <p className="text-xs text-slate-500 mt-0.5">La lettera 'm' non c'entra nulla e rimane all'esterno dell'insieme V</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTOPIC 2: FINITO, INFINITO, VUOTO */}
            {selectedSubtopic === "particular-sets" && (
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Centered Heading */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      Quanti elementi ci sono?
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                      Insiemi Finiti, Infiniti e Insieme Vuoto
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Se proviamo a contare uno per uno gli elementi che compongono un insieme, possiamo incontrare tre situazioni sorprendenti.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Finito */}
                    <div className="rounded-3xl border-2 border-blue-200 bg-blue-50/40 p-6 flex flex-col justify-between text-center space-y-4">
                      <div>
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-blue-200 mb-3">
                          🗓️
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Insieme Finito</h3>
                        <p className="text-xs text-slate-600 mt-1">Il conteggio dei suoi membri si può concludere con un numero esatto.</p>
                        <p className="text-xs font-semibold text-slate-500 mt-3 italic">Es. i giorni della settimana</p>
                      </div>
                      <div className="py-2.5 px-4 rounded-xl bg-dida-blue text-white font-bold text-sm">
                        7 elementi (ha un termine)
                      </div>
                    </div>

                    {/* Infinito */}
                    <div className="rounded-3xl border-2 border-indigo-200 bg-indigo-50/40 p-6 flex flex-col justify-between text-center space-y-4">
                      <div>
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-200 mb-3">
                          ∞
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Insieme Infinito</h3>
                        <p className="text-xs text-slate-600 mt-1">Gli elementi non finiscono mai: possiamo contarli per sempre senza mai fermarci.</p>
                        <p className="text-xs font-semibold text-slate-500 mt-3 italic">Es. i numeri dispari &#123;1, 3, 5, 7, ...&#125;</p>
                      </div>
                      <div className="py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-mono font-bold text-sm">
                        Prosegue all'infinito
                      </div>
                    </div>

                    {/* Vuoto */}
                    <div className="rounded-3xl border-2 border-orange-200 bg-orange-50/40 p-6 flex flex-col justify-between text-center space-y-4">
                      <div>
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-dida-orange text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-orange-200 mb-3">
                          🦕
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Insieme Vuoto</h3>
                        <p className="text-xs text-slate-600 mt-1">Non contiene alcun elemento perché nessuno al mondo rispetta quel criterio.</p>
                        <p className="text-xs font-semibold text-slate-500 mt-3 italic">Es. i dinosauri vivi a scuola</p>
                      </div>
                      <div className="py-2.5 px-4 rounded-xl bg-dida-orange text-white font-serif font-black text-lg">
                        Simbolo: ∅ (zero elementi)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTOPIC 3: I TRE LINGUAGGI */}
            {selectedSubtopic === "representations" && (
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Centered Heading */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      Come comunicare un insieme
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                      Tre Strade per Rappresentare gli Insiemi
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Prendiamo come esempio l'insieme delle quattro stagioni dell'anno (<span className="font-mono font-bold text-blue-600">S</span>) e scopriamo come descriverlo in 3 modi differenti.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Per Elencazione */}
                    <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-3 text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Metodo dell'Elenco</div>
                      <h3 className="text-lg font-bold text-slate-900">Per Elencazione</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">Scriviamo tutti i nomi uno dopo l'altro dentro due parentesi graffe, separati da virgole:</p>
                      <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono text-xs font-bold text-blue-700 break-words">
                        S = &#123;primavera, estate, autunno, inverno&#125;
                      </div>
                    </div>

                    {/* Per Caratteristica */}
                    <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-3 text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">2. Metodo della Regola</div>
                      <h3 className="text-lg font-bold text-slate-900">Proprietà Caratteristica</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">Invece della lista, enunciamo la proprietà comune che condividono solo loro:</p>
                      <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono text-xs font-bold text-blue-700 break-words">
                        S = &#123;x | x è una stagione dell'anno&#125;
                      </div>
                    </div>

                    {/* Eulero-Venn */}
                    <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-3 text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">3. Metodo del Disegno</div>
                      <h3 className="text-lg font-bold text-slate-900">Diagramma di Eulero-Venn</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">Tracciamo una linea chiusa che fa da confine e posizioniamo i punti con gli elementi all'interno:</p>
                      <div className="relative rounded-2xl bg-blue-50/60 border border-blue-200 p-2 flex flex-col items-center justify-center">
                        <svg viewBox="0 0 260 130" className="w-full h-28">
                          {/* Nome dell'insieme S ALL'ESTERNO in alto a sinistra */}
                          <text x="18" y="24" className="font-black text-xl fill-blue-700">S</text>

                          {/* Linea chiusa */}
                          <ellipse cx="130" cy="72" rx="85" ry="46" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2.5" />

                          {/* Elementi sparsi naturalmente dentro l'insieme */}
                          <text x="75" y="65" className="font-bold text-xs fill-slate-800">• primavera</text>
                          <text x="145" y="60" className="font-bold text-xs fill-slate-800">• estate</text>
                          <text x="80" y="98" className="font-bold text-xs fill-slate-800">• autunno</text>
                          <text x="140" y="96" className="font-bold text-xs fill-slate-800">• inverno</text>

                          {/* Elemento all'esterno */}
                          <text x="218" y="115" className="font-bold text-[10px] fill-rose-600">• Capodanno (fuori!)</text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTOPIC 4: SOTTOINSIEMI E COMBINAZIONI */}
            {selectedSubtopic === "subsets" && (
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Centered Heading */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      Un gruppo nel gruppo
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                      I Sottoinsiemi e il Simbolo di Inclusione (⊂)
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Quando tutti i membri di una collezione più piccola appartengono anche a una collezione più ampia, siamo di fronte a un sottoinsieme.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Pensa a tutti gli <strong>animali del parco naturale (insieme A)</strong> e prendi in considerazione solo <strong>gli scoiattoli del parco (insieme B)</strong>. Poiché ogni scoiattolo è a tutti gli effetti un animale del parco:
                      </p>
                      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                        <p className="text-2xl font-mono font-black text-blue-900">B ⊂ A</p>
                        <p className="text-xs text-blue-700 mt-1 font-semibold">Si legge: «B è un sottoinsieme di A» (B è incluso in A)</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                        <p className="font-bold text-amber-900 text-xs uppercase tracking-wider">Concetto Chiave</p>
                        <p className="text-slate-700 text-sm mt-1 font-semibold">
                          Ogni singolo elemento presente in B deve trovarsi obbligatoriamente anche dentro A.
                        </p>
                      </div>
                    </div>

                    {/* Interactive Gelato Lab */}
                    <div className="rounded-3xl border-2 border-orange-200 bg-orange-50/50 p-6 space-y-4 text-center">
                      <div className="inline-block text-xs font-bold bg-white px-3 py-1 rounded-full text-dida-orange border border-orange-200">
                        Laboratorio della Gelateria
                      </div>
                      <h4 className="font-black text-slate-800 text-lg">Quante coppe diverse puoi ordinare?</h4>
                      <p className="text-xs text-slate-600 max-w-sm mx-auto">
                        In gelateria hai a disposizione l'insieme dei gusti: <strong>G = &#123;cioccolato, vaniglia, fragola&#125;</strong>. Ogni coppa che componi è un sottoinsieme di G!
                      </p>

                      <div className="flex justify-center flex-wrap gap-2 pt-1">
                        {[
                          { id: "cioccolato", label: "🍫 Cioccolato" },
                          { id: "vaniglia", label: "🍦 Vaniglia" },
                          { id: "fragola", label: "🍓 Fragola" },
                        ].map((fl) => (
                          <button
                            key={fl.id}
                            onClick={() => toggleFlavor(fl.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                              gelatoFlavors.includes(fl.id)
                                ? "bg-dida-orange text-white border-orange-600 shadow-sm"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {gelatoFlavors.includes(fl.id) ? "✓ " : "+ "}
                            {fl.label}
                          </button>
                        ))}
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-orange-200 space-y-1 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase">La tua coppa gelato (Sottoinsieme):</p>
                        <p className="font-mono text-base font-black text-dida-orange">
                          {gelatoFlavors.length === 0
                            ? "∅ (Coppetta vuota: nessun gusto scelto!)"
                            : `{ ${gelatoFlavors.join(", ")} }`}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          💡 <em>Con 3 gusti a disposizione le combinazioni totali possibili sono 2³ = 8 (inclusa la coppetta vuota ∅!). Se i gusti fossero 4, diventerebbero 2⁴ = 16!</em>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTOPIC 5: INTERSEZIONE E UNIONE */}
            {selectedSubtopic === "intersection-union" && (
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm space-y-8">
                  {/* Centered Heading */}
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-dida-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      Operare tra Insiemi
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                      Cosa Hanno in Comune e Come si Uniscono
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Quando due insiemi si incontrano, possiamo cercare gli elementi condivisi da entrambi oppure metterli tutti insieme in una grande famiglia.
                    </p>
                  </div>

                  {/* Centered Venn Mode Buttons */}
                  <div className="flex justify-center flex-wrap gap-2">
                    <button
                      onClick={() => setVennMode("intersect")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        vennMode === "intersect" ? "bg-amber-500 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      ∩ Intersezione (Gli Elementi Comuni)
                    </button>
                    <button
                      onClick={() => setVennMode("union")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        vennMode === "union" ? "bg-dida-blue text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      ∪ Unione (Tutti, Senza Ripetizioni)
                    </button>
                    <button
                      onClick={() => setVennMode("disjoint")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        vennMode === "disjoint" ? "bg-slate-800 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Insiemi Disgiunti (A ∩ B = ∅)
                    </button>
                    <button
                      onClick={() => setVennMode("both")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        vennMode === "both" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Panoramica Completa
                    </button>
                  </div>

                  {/* Interactive Diagram */}
                  <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center justify-center space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 uppercase">Scegli la situazione:</span>
                      <button
                        onClick={() => setSelectedNamePair("marco-sofia")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                          selectedNamePair === "marco-sofia" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"
                        }`}
                      >
                        Lettere nei Nomi (MARCO & SOFIA)
                      </button>
                      <button
                        onClick={() => setSelectedNamePair("chitarra-disegno")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                          selectedNamePair === "chitarra-disegno" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"
                        }`}
                      >
                        Attività del Pomeriggio (Chitarra & Disegno)
                      </button>
                    </div>

                    {/* SVG Venn Visualizer */}
                    <div className="relative w-full max-w-lg h-56 flex items-center justify-center">
                      <svg viewBox="0 0 460 220" className="w-full h-full drop-shadow-sm">
                        {vennMode !== "disjoint" ? (
                          <>
                            {/* Nomi insiemi ALL'ESTERNO in alto */}
                            <text x="110" y="28" className="font-black text-xl fill-blue-700">A</text>
                            <text x="340" y="28" className="font-black text-xl fill-orange-700">B</text>

                            {/* Circle A */}
                            <circle
                              cx="180"
                              cy="118"
                              r="80"
                              className={`transition-colors duration-300 ${
                                vennMode === "union"
                                  ? "fill-blue-200/90 stroke-blue-500"
                                  : vennMode === "intersect"
                                  ? "fill-blue-50 stroke-blue-300"
                                  : "fill-blue-100/70 stroke-blue-500"
                              }`}
                              strokeWidth="3"
                            />
                            {/* Circle B */}
                            <circle
                              cx="280"
                              cy="118"
                              r="80"
                              className={`transition-colors duration-300 ${
                                vennMode === "union"
                                  ? "fill-blue-200/90 stroke-orange-500"
                                  : vennMode === "intersect"
                                  ? "fill-orange-50 stroke-orange-300"
                                  : "fill-orange-100/70 stroke-orange-500"
                              }`}
                              strokeWidth="3"
                            />
                            {/* Intersection clip overlay if intersect mode */}
                            {vennMode === "intersect" && (
                              <g>
                                <defs>
                                  <clipPath id="circleA">
                                    <circle cx="180" cy="118" r="80" />
                                  </clipPath>
                                </defs>
                                <circle
                                  cx="280"
                                  cy="118"
                                  r="80"
                                  clipPath="url(#circleA)"
                                  fill="#FDE68A"
                                  stroke="#D97706"
                                  strokeWidth="3"
                                />
                              </g>
                            )}

                            {/* Elementi dentro A (sparsi) */}
                            {selectedNamePair === "marco-sofia" ? (
                              <>
                                <text x="135" y="95" className="font-mono text-sm font-black fill-slate-800">• m</text>
                                <text x="160" y="145" className="font-mono text-sm font-black fill-slate-800">• r</text>
                                <text x="120" y="148" className="font-mono text-sm font-black fill-slate-800">• c</text>
                              </>
                            ) : (
                              <>
                                <text x="130" y="105" className="font-mono text-xs font-black fill-slate-800">• Davide</text>
                                <text x="140" y="145" className="font-mono text-xs font-black fill-slate-800">• Giulia</text>
                              </>
                            )}

                            {/* Elementi nell'Intersezione */}
                            {selectedNamePair === "marco-sofia" ? (
                              <>
                                <text x="230" y="102" textAnchor="middle" className="font-mono text-sm font-black fill-amber-950">• a</text>
                                <text x="230" y="145" textAnchor="middle" className="font-mono text-sm font-black fill-amber-950">• o</text>
                              </>
                            ) : (
                              <>
                                <text x="230" y="102" textAnchor="middle" className="font-mono text-xs font-black fill-amber-950">• Emma</text>
                                <text x="230" y="145" textAnchor="middle" className="font-mono text-xs font-black fill-amber-950">• Pietro</text>
                              </>
                            )}

                            {/* Elementi dentro B (sparsi) */}
                            {selectedNamePair === "marco-sofia" ? (
                              <>
                                <text x="295" y="95" className="font-mono text-sm font-black fill-slate-800">• s</text>
                                <text x="330" y="130" className="font-mono text-sm font-black fill-slate-800">• f</text>
                                <text x="290" y="155" className="font-mono text-sm font-black fill-slate-800">• i</text>
                              </>
                            ) : (
                              <>
                                <text x="315" y="105" className="font-mono text-xs font-black fill-slate-800">• Luca</text>
                                <text x="325" y="145" className="font-mono text-xs font-black fill-slate-800">• Chiara</text>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {/* Nomi insiemi ALL'ESTERNO in alto */}
                            <text x="130" y="28" textAnchor="middle" className="font-black text-sm fill-blue-700">A (Mammiferi marini)</text>
                            <text x="330" y="28" textAnchor="middle" className="font-black text-sm fill-orange-700">B (Uccelli volatili)</text>

                            {/* Disjoint circles */}
                            <circle cx="130" cy="118" r="72" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="3" />
                            <circle cx="330" cy="118" r="72" fill="#FFEDD5" stroke="#F97316" strokeWidth="3" />

                            <text x="105" y="105" className="font-mono text-xs font-black fill-slate-800">• balena</text>
                            <text x="125" y="145" className="font-mono text-xs font-black fill-slate-800">• delfino</text>

                            <text x="305" y="105" className="font-mono text-xs font-black fill-slate-800">• aquila</text>
                            <text x="325" y="145" className="font-mono text-xs font-black fill-slate-800">• rondine</text>
                          </>
                        )}
                      </svg>
                    </div>

                    {/* Explanatory summary */}
                    <div className="w-full max-w-lg p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
                      {vennMode === "intersect" && (
                        <>
                          <p className="font-black text-amber-600 text-lg">A ∩ B (Intersezione)</p>
                          <p className="text-slate-700 font-mono text-sm font-bold">
                            = &#123;{selectedNamePair === "marco-sofia" ? "a, o" : "Emma, Pietro"}&#125;
                          </p>
                          <p className="text-xs text-slate-500">I soli elementi che appartengono contemporaneamente sia al gruppo A <strong>E</strong> sia al gruppo B.</p>
                        </>
                      )}
                      {vennMode === "union" && (
                        <>
                          <p className="font-black text-dida-blue text-lg">A ∪ B (Unione)</p>
                          <p className="text-slate-700 font-mono text-sm font-bold">
                            = &#123;{selectedNamePair === "marco-sofia" ? "m, r, c, a, o, s, f, i" : "Davide, Giulia, Emma, Pietro, Luca, Chiara"}&#125;
                          </p>
                          <p className="text-xs text-slate-500">Tutti quanti gli elementi riuniti insieme, registrati ciascuno una sola volta senza duplicati!</p>
                        </>
                      )}
                      {vennMode === "disjoint" && (
                        <>
                          <p className="font-black text-slate-800 text-lg">Insiemi Disgiunti</p>
                          <p className="text-slate-700 font-mono text-sm font-bold">A ∩ B = ∅</p>
                          <p className="text-xs text-slate-500">Nessun elemento condiviso: lo spazio comune è vuoto perché nessun animale appartiene a entrambi i gruppi.</p>
                        </>
                      )}
                      {vennMode === "both" && (
                        <>
                          <p className="font-bold text-slate-700 text-sm">Visualizzazione Generale di Eulero-Venn</p>
                          <p className="text-xs text-slate-500">Usa i pulsanti in alto per evidenziare le zone logiche di intersezione o unione.</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </motion.div>
        ) : (
          /* TAB ALLENA */
          <motion.div
            key="tab-allena"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 px-4"
          >
            {/* Centered Intro Banner */}
            <div className="rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 shadow-lg text-center space-y-2">
              <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-amber-200 bg-white/10 px-3 py-1 rounded-full">
                Palestra di Matematica
              </span>
              <h2 className="text-2xl md:text-3xl font-black">
                Mettiti alla Prova con gli Esercizi
              </h2>
              <p className="text-amber-100 text-sm max-w-xl mx-auto">
                Risolvi i quesiti interattivi: otterrai immediatamente la risposta corretta con la spiegazione dettagliata del ragionamento!
              </p>
            </div>

            {/* ESERCIZIO 1: CRITERI */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-1 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">Attività 1 · Criteri di Appartenenza</span>
                <h3 className="text-xl font-black text-slate-800">È un insieme matematico ben definito?</h3>
                <p className="text-slate-500 text-xs max-w-lg mx-auto">
                  Valuta se ciascun raggruppamento si basa su una proprietà oggettiva e verificabile da chiunque.
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => setIsSetAnswers({})}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Azzera Risposte
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isSetQuestions.map((q) => {
                  const userAnswer = isSetAnswers[q.id];
                  const isChecked = userAnswer !== undefined && userAnswer !== null;
                  const isCorrect = isChecked && userAnswer === q.isSet;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        !isChecked
                          ? "bg-slate-50 border-slate-200"
                          : isCorrect
                          ? "bg-emerald-50/70 border-emerald-300"
                          : "bg-rose-50/70 border-rose-300"
                      }`}
                    >
                      <p className="font-bold text-slate-800 text-sm mb-3 text-center">«{q.text}»</p>
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => setIsSetAnswers(prev => ({ ...prev, [q.id]: true }))}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                            userAnswer === true
                              ? "bg-dida-blue text-white shadow-sm"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          È un insieme ✅
                        </button>
                        <button
                          onClick={() => setIsSetAnswers(prev => ({ ...prev, [q.id]: false }))}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                            userAnswer === false
                              ? "bg-dida-orange text-white shadow-sm"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          NON è un insieme ❌
                        </button>
                      </div>

                      {isChecked && (
                        <p className={`text-xs mt-2 font-medium text-center ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          {isCorrect ? "Ottima risposta! " : "Rifletti: "} {q.reason}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ESERCIZIO 2: FINITO, INFINITO O VUOTO */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-1 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">Attività 2 · Valutazione della Quantità</span>
                <h3 className="text-xl font-black text-slate-800">Finito (F), Infinito (I) o Vuoto (V)?</h3>
                <p className="text-slate-500 text-xs max-w-lg mx-auto">
                  Identifica il tipo di cardinalità corrispondente a ciascuna descrizione.
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => setFivAnswers({})}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Azzera Risposte
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-w-3xl mx-auto">
                {fivQuestions.map((q) => {
                  const userChoice = fivAnswers[q.id];
                  const isChecked = userChoice !== undefined && userChoice !== null;
                  const isCorrect = isChecked && userChoice === q.correct;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        !isChecked ? "bg-slate-50 border-slate-200" : isCorrect ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"
                      }`}
                    >
                      <span className="font-bold text-slate-800 text-sm">{q.text}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {(["F", "I", "V"] as const).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setFivAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className={`w-10 h-10 rounded-xl font-black text-sm transition cursor-pointer ${
                              userChoice === opt
                                ? "bg-slate-900 text-white shadow-md"
                                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {isChecked && (
                        <p className={`text-xs font-semibold md:w-full mt-1 ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          {isCorrect ? "Corretto! " : "Attenzione: "}{q.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ESERCIZIO 3: INVALSI - IL VENN DELLA CLASSE */}
            <div className="rounded-[2rem] border-2 border-indigo-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-1 border-b border-slate-100 pb-4">
                <span className="inline-block text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Simulazione Prove Nazionali INVALSI
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Interpretazione del Diagramma di Eulero-Venn</h3>
                <p className="text-slate-500 text-xs max-w-lg mx-auto">
                  Analizza le sezioni del grafico per verificare la veridicità delle affermazioni.
                </p>
              </div>

              {/* Graphic Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 flex flex-col items-center">
                  <svg viewBox="0 0 380 205" className="w-full max-w-sm h-48">
                    {/* Nomi insiemi ALL'ESTERNO in alto */}
                    <text x="75" y="24" className="font-bold text-xs fill-blue-800">
                      <tspan className="font-black text-base fill-blue-700">A</tspan> · Nuoto
                    </text>
                    <text x="245" y="24" className="font-bold text-xs fill-orange-800">
                      <tspan className="font-black text-base fill-orange-700">B</tspan> · Basket
                    </text>

                    {/* Cerchi */}
                    <circle cx="140" cy="110" r="70" fill="#DBEAFE" fillOpacity="0.8" stroke="#3B82F6" strokeWidth="2.5" />
                    <circle cx="240" cy="110" r="70" fill="#FFEDD5" fillOpacity="0.8" stroke="#F97316" strokeWidth="2.5" />

                    {/* Dati numerici */}
                    <text x="95" y="116" textAnchor="middle" className="font-black text-3xl fill-blue-800">11</text>
                    <text x="190" y="116" textAnchor="middle" className="font-black text-3xl fill-amber-700">6</text>
                    <text x="285" y="116" textAnchor="middle" className="font-black text-3xl fill-orange-800">5</text>
                    
                    <text x="190" y="196" textAnchor="middle" className="font-bold text-xs fill-slate-500">Nessuna delle due discipline: 2 studenti</text>
                  </svg>
                </div>

                <div className="space-y-3">
                  {invalsiQuestions.map((q) => {
                    const ans = invalsiAnswers[q.id];
                    const isChecked = ans !== undefined && ans !== null;
                    const isCorrect = isChecked && ans === q.correct;

                    return (
                      <div key={q.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800">{q.prompt}</span>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => setInvalsiAnswers(prev => ({ ...prev, [q.id]: true }))}
                              className={`w-8 h-8 rounded-lg font-bold text-xs cursor-pointer ${
                                ans === true ? "bg-emerald-600 text-white" : "bg-white border text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              V
                            </button>
                            <button
                              onClick={() => setInvalsiAnswers(prev => ({ ...prev, [q.id]: false }))}
                              className={`w-8 h-8 rounded-lg font-bold text-xs cursor-pointer ${
                                ans === false ? "bg-rose-600 text-white" : "bg-white border text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              F
                            </button>
                          </div>
                        </div>
                        {isChecked && (
                          <p className={`text-xs ${isCorrect ? "text-emerald-700 font-semibold" : "text-rose-700 font-semibold"}`}>
                            {q.explain}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ESERCIZIO 4: VERO O FALSO FINALE */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-1 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-dida-orange uppercase tracking-wider">Sfida Riepilogativa</span>
                <h3 className="text-xl font-black text-slate-800">Vero o Falso di Consolidamento</h3>
                <p className="text-slate-500 text-xs max-w-lg mx-auto">
                  Verifica di aver compreso a fondo le nozioni teoriche prima di procedere.
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => setVfAnswers({})}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Azzera Risposte
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-w-3xl mx-auto">
                {vfQuestions.map((q) => {
                  const ans = vfAnswers[q.id];
                  const isChecked = ans !== undefined && ans !== null;
                  const isCorrect = isChecked && ans === q.correct;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        !isChecked ? "bg-slate-50 border-slate-200" : isCorrect ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"
                      }`}
                    >
                      <span className="font-semibold text-slate-800 text-sm">{q.text}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setVfAnswers(prev => ({ ...prev, [q.id]: true }))}
                          className={`px-4 py-1.5 rounded-xl font-black text-xs cursor-pointer ${
                            ans === true ? "bg-emerald-600 text-white" : "bg-white border text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          Vero
                        </button>
                        <button
                          onClick={() => setVfAnswers(prev => ({ ...prev, [q.id]: false }))}
                          className={`px-4 py-1.5 rounded-xl font-black text-xs cursor-pointer ${
                            ans === false ? "bg-rose-600 text-white" : "bg-white border text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          Falso
                        </button>
                      </div>
                      {isChecked && (
                        <p className={`text-xs sm:w-full mt-1 ${isCorrect ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}`}>
                          {q.explain}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
