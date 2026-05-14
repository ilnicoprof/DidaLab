/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Rocket, Search, Settings, GraduationCap, School, ArrowLeft,
  Calculator, Triangle, Beaker, BookText, History, Globe,
  Languages, Music, Palette, Monitor, Dumbbell, Sparkles, DollarSign,
  BookOpen, Zap, Gamepad
} from "lucide-react";
import NumberLineLesson from "./lessons/NumberLineLesson";
import NumberLineLessonInclusion from "./lessons/NumberLineLessonInclusion";
import TablesLesson from "./lessons/TablesLesson";
import TablesLessonInclusion from "./lessons/TablesLessonInclusion";

/**
 * Animated Background Illustrations
 */
const BackgroundIllustrations = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-gradient-to-br from-blue-50/50 via-white to-orange-50/30">
      {/* Gears (Top Left) */}
      <motion.div
        className="absolute -top-10 -left-10 text-blue-200/40"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Settings size={280} strokeWidth={0.5} />
      </motion.div>
      <motion.div
        className="absolute top-20 left-40 text-blue-300/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <Settings size={140} strokeWidth={0.5} />
      </motion.div>

      {/* Lightbulb (Left) */}
      <motion.div
        className="absolute top-1/2 left-20 -translate-y-1/2"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative w-20 h-24">
          {/* Simple custom SVG lightbulb based on image */}
          <svg viewBox="0 0 100 120" className="w-full h-full fill-orange-100/50 stroke-orange-300/40" strokeWidth="2">
            <path d="M50 10 C30 10 15 25 15 45 C15 60 25 70 30 80 L35 100 L65 100 L70 80 C75 70 85 60 85 45 C85 25 70 10 50 10 Z" />
            <path d="M35 100 L65 100 L65 110 L35 110 Z" />
            <path d="M40 110 L60 110 L50 120 Z" />
          </svg>
          {/* Glow effect */}
          <motion.div
            className="absolute top-2 left-2 w-16 h-16 bg-orange-200/20 blur-xl rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Magnifying Glass (Bottom Left) */}
      <motion.div
        className="absolute bottom-20 left-40 rotate-[15deg] opacity-20 text-blue-400"
        animate={{ rotate: [15, 20, 15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Search size={180} strokeWidth={1} />
      </motion.div>

      {/* Books (Right Side) */}
      <motion.div
        className="absolute top-40 -right-20 rotate-[-15deg] opacity-20"
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 150" className="w-80 h-auto fill-blue-100 stroke-blue-200" strokeWidth="2">
          <path d="M20 130 C20 130 50 120 100 120 C150 120 180 130 180 130 L180 30 C180 30 150 20 100 20 C50 20 20 30 20 30 Z" />
          <path d="M100 20 L100 120" />
          <path d="M30 40 L90 40 M30 60 L90 60 M30 80 L90 80 M110 40 L170 40 M110 60 L170 60" />
        </svg>
      </motion.div>

      {/* Middle/Bottom Large Book */}
      <motion.div
        className="absolute bottom-10 -right-10 rotate-[-5deg] opacity-30"
        animate={{ rotate: [-5, -2, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 150" className="w-[32rem] h-auto fill-blue-50 stroke-blue-200" strokeWidth="1.5">
          <path d="M10 140 C10 140 50 125 100 125 C150 125 190 140 190 140 L190 20 C190 20 150 5 100 5 C50 5 10 20 10 20 Z" />
          <path d="M100 5 L100 125" />
          <path d="M25 35 L85 35 M25 55 L85 55 M25 75 L85 75 M25 95 L85 95 M115 35 L175 35 M115 55 L175 55 M115 75 L175 75" />
        </svg>
      </motion.div>

      {/* Lightbulb (Bottom Right) */}
      <motion.div
        className="absolute bottom-1/4 right-32"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative w-16 h-20">
          <svg viewBox="0 0 100 120" className="w-full h-full fill-orange-50/50 stroke-orange-300/40" strokeWidth="2">
            <path d="M50 10 C30 10 15 25 15 45 C15 60 25 70 30 80 L35 100 L65 100 L70 80 C75 70 85 60 85 45 C85 25 70 10 50 10 Z" />
            <path d="M35 100 L65 100 L65 110 L35 110 Z" />
          </svg>
          <motion.div
            className="absolute top-2 left-2 w-12 h-12 bg-orange-200/10 blur-lg rounded-full"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Logo DidaLab Component
 */
const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const containerClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-24 h-24"
  };
  const textClasses = {
    sm: "text-2xl",
    md: "text-5xl",
    lg: "text-6xl"
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`relative ${containerClasses[size]} drop-shadow-sm`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0070B8" />
              <stop offset="100%" stopColor="#29ABE2" />
            </linearGradient>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF7D00" />
              <stop offset="100%" stopColor="#FBB03B" />
            </linearGradient>
          </defs>

          {/* Left Side (D) */}
          <path
            d="M50 90 L18 80 L18 20 C18 20 40 10 50 15"
            fill="none"
            stroke="url(#blueGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 35 C28 35 45 35 45 45 C45 55 28 65 28 65"
            fill="none"
            stroke="url(#blueGradient)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <motion.circle
            cx="28" cy="35" r="4"
            fill="url(#blueGradient)"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="28" cy="65" r="4"
            fill="url(#blueGradient)"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />

          {/* Right Side (L) */}
          <path
            d="M50 15 C60 10 82 20 82 20 L82 80 L50 90"
            fill="none"
            stroke="url(#orangeGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M58 25 C58 25 75 45 60 70 L75 70"
            fill="none"
            stroke="url(#orangeGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.circle
            cx="58" cy="25" r="4"
            fill="url(#orangeGradient)"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <motion.circle
            cx="75" cy="70" r="4"
            fill="url(#orangeGradient)"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          />

          {/* Spine */}
          <line x1="50" y1="15" x2="50" y2="90" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="2 4" />
        </svg>
      </div>
      <h1 className={`${textClasses[size]} font-extrabold tracking-tighter`}>
        <span className="text-dida-blue">Dida</span>
        <span className="text-dida-orange">Lab</span>
      </h1>
    </div>
  );
};

interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  active: boolean;
}

interface Topic {
  id: string;
  name: string;
  grade: 1 | 2 | 3; // 1: prima media, 2: seconda, 3: terza
}

interface Subtopic {
  id: string;
  name: string;
  active: boolean;
  linkToTopicId?: string;
}

const subjects: Subject[] = [
  { id: 'math-arithmetic', name: 'Aritmetica', icon: Calculator, color: 'text-blue-500', active: true },
  { id: 'math-algebra', name: 'Algebra', icon: Calculator, color: 'text-purple-500', active: true },
  { id: 'math-geometry', name: 'Geometria', icon: Triangle, color: 'text-dida-blue', active: true },
  { id: 'science', name: 'Scienze', icon: Beaker, color: 'text-green-500', active: true },
  { id: 'italian', name: 'Italiano', icon: BookText, color: 'text-orange-500', active: false },
  { id: 'history', name: 'Storia', icon: History, color: 'text-amber-700', active: false },
  { id: 'geography', name: 'Geografia', icon: Globe, color: 'text-emerald-600', active: false },
  { id: 'english', name: 'Inglese', icon: Languages, color: 'text-indigo-600', active: false },
  { id: 'french', name: 'Francese', icon: Languages, color: 'text-blue-700', active: false },
  { id: 'music', name: 'Musica', icon: Music, color: 'text-purple-500', active: false },
  { id: 'art', name: 'Arte', icon: Palette, color: 'text-pink-500', active: false },
  { id: 'technology', name: 'Tecnologia', icon: Monitor, color: 'text-slate-600', active: false },
  { id: 'pe', name: 'Motoria', icon: Dumbbell, color: 'text-red-500', active: false },
  { id: 'financial-education', name: 'Educazione Finanziaria', icon: DollarSign, color: 'text-green-600', active: false },
];

const topics: Record<string, Topic[]> = {
  'math-arithmetic': [
    { id: 'graphic-representations', name: 'Le rappresentazioni grafiche', grade: 1 },
    { id: 'set-language', name: 'Il linguaggio degli insiemi', grade: 1 },
    { id: 'numeration-systems', name: 'I sistemi di numerazione', grade: 1 },
    { id: 'operations-natural-numbers', name: 'Operazioni e numeri naturali', grade: 1 },
    { id: 'problem-solving', name: 'La risoluzione dei problemi', grade: 1 },
    { id: 'exponentiation', name: 'L\'elevamento a potenza', grade: 1 },
    { id: 'divisibility', name: 'La divisibilità', grade: 1 },
    { id: 'fractions', name: 'Le frazioni', grade: 1 },
    { id: 'fraction-operations', name: 'Le operazioni con le frazioni', grade: 1 },
    { id: 'absolute-rational-numbers', name: 'I numeri razionali assoluti', grade: 2 },
    { id: 'square-root', name: 'La radice', grade: 2 },
    { id: 'ratios-proportions-percentages', name: 'Rapporti proporzioni e percentuali', grade: 2 },
    { id: 'direct-inverse-proportionality', name: 'Grandezze direttamente o inversamente proporzionali', grade: 2 },
    { id: 'statistical-surveys', name: 'Le indagini statistiche', grade: 2 },
  ],
  'math-algebra': [
    { id: 'relative-numbers', name: 'I numeri relativi', grade: 3 },
    { id: 'literal-calculus', name: 'Il calcolo letterale', grade: 3 },
    { id: 'equations', name: 'Le equazioni', grade: 3 },
    { id: 'functions', name: 'Le funzioni', grade: 3 },
    { id: 'cartesian-plane', name: 'Il piano cartesiano', grade: 3 },
    { id: 'probability', name: 'La probabilità', grade: 3 },
    { id: 'logic', name: 'La logica', grade: 3 },
  ],
  'math-geometry': [
    { id: 'measurement-of-quantities', name: 'La misura delle grandezze', grade: 1 },
    { id: 'geometry-fundamentals', name: 'I fondamenti della geometria', grade: 1 },
    { id: 'segments', name: 'I segmenti', grade: 1 },
    { id: 'angles', name: 'Gli angoli', grade: 1 },
    { id: 'lines', name: 'Le rette', grade: 1 },
    { id: 'triangles', name: 'I triangoli', grade: 1 },
    { id: 'quadrilaterals', name: 'I quadrilateri', grade: 1 },
    { id: 'polygons', name: 'I poligoni con più lati', grade: 1 },
    { id: 'areas', name: 'Le aree', grade: 2 },
    { id: 'pythagorean-theorem', name: 'Il teorema di Pitagora', grade: 2 },
    { id: 'circle-circumference', name: 'Il cerchio e la circonferenza', grade: 2 },
    { id: 'inscribed-circumscribed-polygons', name: 'I poligoni inscritti e circoscritti', grade: 2 },
    { id: 'isometries', name: 'Le isometrie', grade: 2 },
    { id: 'geometric-transformations', name: 'Le trasformazioni geometriche', grade: 2 },
    { id: 'circle-measure-area', name: 'La misura della circonferenza e l\'area del cerchio', grade: 3 },
    { id: 'solid-geometry', name: 'La geometria nello spazio', grade: 3 },
    { id: 'polyhedra', name: 'I poliedri', grade: 3 },
    { id: 'solids-of-revolution', name: 'I solidi di rotazione', grade: 3 },
  ],
  'financial-education': [
    { id: 'finance-interest', name: 'L\'interesse', grade: 3 },
  ],
  // Altri possono essere aggiunti dopo
};

const subtopics: Record<string, Subtopic[]> = {
  'graphic-representations': [
    { id: 'tables', name: 'Le tabelle', active: true },
    { id: 'ideogram', name: 'L\'ideogramma', active: true },
    { id: 'cartesian-diagram', name: 'Il diagramma cartesiano', active: true },
    { id: 'ortogram', name: 'L\'ortogramma', active: true },
    { id: 'aerogram', name: 'L\'aerogramma', active: false, linkToTopicId: 'angles' },
  ],
  'set-language': [
    { id: 'sets', name: 'Gli insiemi', active: true },
    { id: 'particular-sets', name: 'Insiemi particolari', active: true },
    { id: 'subsets', name: 'I sottoinsiemi', active: true },
    { id: 'intersection-sets', name: 'L\'intersezione di insiemi', active: true },
    { id: 'union-sets', name: 'L\'unione di insiemi', active: true },
  ],
  'numeration-systems': [
    { id: 'our-numeration-system', name: 'Il nostro sistema di numerazione', active: true },
    { id: 'natural-numbers', name: 'I numeri naturali', active: true },
    { id: 'roman-numeration-system', name: 'Il sistema di numerazione romano', active: true },
  ],
  'operations-natural-numbers': [
    { id: 'addition-properties', name: 'L\'addizione e le sue proprietà', active: true },
    { id: 'subtraction-properties', name: 'La sottrazione e le sue proprietà', active: true },
    { id: 'multiplication-properties', name: 'La moltiplicazione e le sue proprietà', active: true },
    { id: 'division-properties', name: 'La divisione e le sue proprietà', active: true },
  ],
  'problem-solving': [
    { id: 'resolution-phases', name: 'Le fasi di risoluzione', active: true },
    { id: 'situation-schematization', name: 'La schematizzazione della situazione', active: true },
  ],
  'exponentiation': [
    { id: 'power', name: 'La potenza', active: true },
    { id: 'power-properties-same-base', name: 'Le proprietà delle potenze con la stessa base', active: true },
    { id: 'power-properties-same-exponent', name: 'Le proprietà delle potenze con lo stesso esponente', active: true },
    { id: 'scientific-notation', name: 'La notazione scientifica', active: true },
  ],
  'divisibility': [
    { id: 'divisors-multiples', name: 'Divisori e multipli di un numero', active: true },
    { id: 'divisibility-criteria', name: 'I criteri di divisibilità', active: true },
    { id: 'prime-composite-numbers', name: 'Numeri primi e composti', active: true },
    { id: 'prime-factorization', name: 'La scomposizione in fattori primi', active: true },
    { id: 'gcd', name: 'Massimo Comune Divisore (MCD)', active: true },
    { id: 'lcm', name: 'minimo comune multiplo\n(mcm)', active: true },
  ],
  'fractions': [
    { id: 'fraction', name: 'La frazione', active: true },
    { id: 'proper-improper-apparent-fractions', name: 'Frazioni proprie improprie ed apparenti', active: true },
    { id: 'equivalent-fractions', name: 'Frazioni equivalenti', active: true },
    { id: 'reduction-minimum-terms', name: 'Riduzione ai minimi termini', active: true },
    { id: 'fraction-comparison', name: 'Il confronto tra frazioni', active: true },
  ],
  'fraction-operations': [
    { id: 'fraction-as-number', name: 'La frazione come numero', active: true },
    { id: 'fraction-addition', name: 'L\'addizione tra frazioni', active: true },
    { id: 'fraction-subtraction', name: 'La sottrazione tra frazioni', active: true },
    { id: 'fraction-multiplication', name: 'La moltiplicazione tra frazioni', active: true },
    { id: 'fraction-division', name: 'La divisione tra frazioni', active: true },
    { id: 'fraction-power', name: 'L\'elevamento a potenza di frazioni', active: true },
  ],
  'absolute-rational-numbers': [
    { id: 'rational-number-set', name: 'L\'insieme dei numeri razionali', active: false, linkToTopicId: 'set-language' },
    { id: 'addition-subtraction', name: 'L\'addizione e la sottrazione dei numeri razionali assoluti', active: true },
    { id: 'multiplication-power', name: 'La moltiplicazione e l\'elevamento a potenza dei numeri razionali assoluti', active: true },
    { id: 'division', name: 'La divisione nei numeri razionali assoluti', active: true },
    { id: 'decimal-fractions-limited', name: 'Le frazioni decimali ed i numeri decimali limitati', active: true },
    { id: 'periodic-decimals', name: 'I numeri decimali illimitati periodici', active: true },
    { id: 'generating-fractions', name: 'Le frazioni generatrici', active: true },
    { id: 'approximations', name: 'Le approssimazioni', active: true },
  ],
  'square-root': [
    { id: 'square-root-intro', name: 'La radice quadrata', active: true },
    { id: 'cubic-root', name: 'La radice cubica', active: true },
    { id: 'perfect-square-root', name: 'La radice quadrata di un quadrato perfetto', active: true },
    { id: 'non-perfect-square-root', name: 'La radice quadrata di un numero che non è un quadrato perfetto', active: true },
    { id: 'any-number-square-root', name: 'La radice quadrata di un numero qualsiasi', active: true },
    { id: 'absolute-real-numbers', name: 'I numeri reali assoluti', active: true },
  ],
  'ratios-proportions-percentages': [
    { id: 'ratios', name: 'I rapporti', active: true },
    { id: 'homogeneous-ratios', name: 'Rapporto tra grandezze omogenee', active: true },
    { id: 'non-homogeneous-ratios', name: 'Rapporto tra grandezze non omogenee', active: true },
    { id: 'proportions', name: 'Le proporzioni', active: true },
    { id: 'unknown-term-calculation', name: 'Il calcolo del termine incognito in una proporzione', active: true },
    { id: 'proportions-properties', name: 'Le proprietà delle proporzioni', active: true },
    { id: 'enlargements-reductions', name: 'Ingrandimenti e riduzioni', active: true },
    { id: 'percentages', name: 'Le percentuali', active: true },
    { id: 'finance-interest-link', name: 'L\'interesse in finanza', active: false, linkToTopicId: 'finance-interest' },
  ],
  'direct-inverse-proportionality': [
    { id: 'direct-proportionality', name: 'Grandezze direttamente proporzionali', active: true },
    { id: 'inverse-proportionality', name: 'Grandezze inversamente proporzionali', active: true },
    { id: 'direct-prop-problems', name: 'I problemi con le grandezze direttamente proporzionali', active: true },
    { id: 'partition-problems', name: 'I problemi di ripartizione', active: true },
  ],
  'statistical-surveys': [
    { id: 'qualitative-surveys', name: 'Le indagini qualitative', active: true },
    { id: 'statistics-representation', name: 'Le rappresentazioni delle statistiche', active: false, linkToTopicId: 'graphic-representations' },
    { id: 'quantitative-surveys', name: 'Le indagini quantitative', active: true },
    { id: 'statistical-indices', name: 'Gli indici statistici: media moda e mediana', active: true },
    { id: 'information-collection', name: 'La raccolta delle informazioni', active: true },
  ],
  'relative-numbers': [
    { id: 'set-z', name: 'L\'insieme $\\mathbb{Z}$: numeri interi, segno e valore assoluto', active: true },
    { id: 'operations-z', name: 'Le quattro operazioni fondamentali e le loro proprietà in $\\mathbb{Z}$', active: true },
    { id: 'powers-roots-z', name: 'Potenze e radici quadrate in $\\mathbb{Z}$', active: true },
    { id: 'set-q', name: 'L\'insieme $\\mathbb{Q}$: i numeri razionali e le relative operazioni', active: true },
    { id: 'negative-exponent-scientific', name: 'Potenze con esponente negativo e notazione scientifica', active: true },
    { id: 'set-r', name: 'L\'insieme $\\mathbb{R}$: introduzione ai numeri reali relativi', active: true },
  ],
  'literal-calculus': [
    { id: 'intro-literal-calculus', name: 'Introduzione al calcolo letterale: lettere al posto dei numeri', active: true },
    { id: 'monomials-def', name: 'I monomi: definizioni e caratteristiche principali', active: true },
    { id: 'monomials-operations', name: 'Le operazioni con i monomi (addizione, moltiplicazione, divisione, potenza)', active: true },
    { id: 'polynomials-def', name: 'I polinomi: definizioni e caratteristiche principali', active: true },
    { id: 'polynomials-operations', name: 'Le operazioni con i polinomi (addizione e moltiplicazione)', active: true },
    { id: 'special-products', name: 'I prodotti notevoli', active: true },
  ],
  'equations': [
    { id: 'equations-def', name: 'Definizione e caratteristiche delle equazioni', active: true },
    { id: 'first-equivalence-principle', name: 'Il primo principio di equivalenza e le sue applicazioni', active: true },
    { id: 'second-equivalence-principle', name: 'Il secondo principio di equivalenza', active: true },
    { id: 'equations-classification', name: 'Classificazione: equazioni determinate, indeterminate e impossibili', active: true },
    { id: 'first-degree-equations-resolution', name: 'Risoluzione di un\'equazione di primo grado', active: true },
    { id: 'problem-solving-equations', name: 'Risoluzione di problemi tramite le equazioni', active: true },
  ],
  'functions': [
    { id: 'relations-functions', name: 'Le relazioni e le funzioni', active: true },
    { id: 'inverse-relations', name: 'Relazioni inverse e corrispondenze biunivoche', active: true },
    { id: 'empirical-mathematical-functions', name: 'Le funzioni empiriche e matematiche', active: true },
    { id: 'direct-proportionality-function', name: 'La funzione di proporzionalità diretta', active: true },
    { id: 'inverse-proportionality-function', name: 'La funzione di proporzionalità inversa', active: true },
    { id: 'quadratic-function', name: 'La funzione quadratica', active: true },
  ],
  'cartesian-plane': [
    { id: 'cartesian-reference', name: 'Il riferimento cartesiano, distanza tra punti e punto medio', active: true },
    { id: 'line-equation', name: 'L\'equazione della retta: casi particolari e forma generale', active: true },
    { id: 'lines-in-plane', name: 'Rette nel piano: parallelismo, perpendicolarità e intersezione', active: true },
    { id: 'hyperbola', name: 'L\'iperbole nel piano cartesiano', active: true },
    { id: 'parabola', name: 'La parabola nel piano cartesiano', active: true },
    { id: 'half-planes', name: 'I semipiani nel riferimento cartesiano', active: true },
  ],
  'probability': [
    { id: 'aleatory-events', name: 'Gli eventi aleatori e la probabilità matematica', active: true },
    { id: 'event-types', name: 'Tipologie di eventi: incompatibili, complementari, compatibili', active: true },
    { id: 'total-probability', name: 'La probabilità totale', active: true },
    { id: 'compound-conditional-probability', name: 'La probabilità composta e condizionata', active: true },
    { id: 'statistical-probability', name: 'La probabilità statistica', active: true },
    { id: 'subjective-probability', name: 'La probabilità soggettiva', active: true },
  ],
  'logic': [
    { id: 'simple-propositions', name: 'Le proposizioni logiche semplici', active: true },
    { id: 'logical-connectives-and-or', name: 'I connettivi logici "e" ed "o"', active: true },
    { id: 'logical-negation', name: 'La negazione "non"', active: true },
    { id: 'connectives-set-operations', name: 'I connettivi logici e le operazioni tra insiemi', active: true },
    { id: 'electrical-circuits', name: 'I circuiti elettrici', active: true },
    { id: 'quantifiers', name: 'I quantificatori', active: true },
  ],
  'measurement-of-quantities': [
    { id: 'measure-errors', name: 'La misura di una grandezza e gli errori nelle misure', active: true },
    { id: 'length-units', name: 'Le unità di misura delle lunghezze', active: true },
    { id: 'surface-units', name: 'Le unità di misura delle superfici', active: true },
    { id: 'volume-units', name: 'Le unità di misura degli spazi', active: true },
    { id: 'mass-units', name: 'Le unità di misura delle masse', active: true },
    { id: 'time-units', name: 'Le unità di misura del tempo', active: true },
  ],
  'geometry-fundamentals': [
    { id: 'geometry-objects', name: 'Gli oggetti nella geometria', active: true },
    { id: 'geometric-figures', name: 'Le figure geometriche', active: true },
    { id: 'point-line-plane', name: 'Il punto, la retta, il piano', active: true },
    { id: 'lines-rays-halfplanes', name: 'Rette, semirette, semipiani', active: true },
  ],
  'segments': [
    { id: 'segments-def', name: 'Definizione e caratteristiche dei segmenti', active: true },
    { id: 'segments-comparison-operations', name: 'Il confronto e le operazioni tra segmenti', active: true },
    { id: 'segment-measure-midpoint', name: 'La misura e il punto medio di un segmento', active: true },
    { id: 'segments-problem-solving', name: 'Risoluzione di problemi con i segmenti', active: true },
  ],
  'angles': [
    { id: 'angle-def', name: 'Che cos\'è un angolo', active: true },
    { id: 'angles-comparison-vertical', name: 'Confronto di angoli e angoli opposti al vertice', active: true },
    { id: 'angles-consecutive-adjacent-operations', name: 'Angoli consecutivi, adiacenti e operazioni', active: true },
    { id: 'bisector-angle-types', name: 'Bisettrice e tipi di angoli (retti, acuti, ottusi)', active: true },
    { id: 'angle-measure', name: 'La misura dell\'ampiezza di un angolo', active: true },
    { id: 'complementary-supplementary-explementary', name: 'Angoli complementari, supplementari ed esplementari', active: true },
  ],
  'lines': [
    { id: 'lines-positions-plane', name: 'Le posizioni di due rette nel piano', active: true },
    { id: 'perpendicular-lines', name: 'Le rette perpendicolari', active: true },
    { id: 'distance-point-line-segment-bisector', name: 'Distanza di un punto da una retta e asse di un segmento', active: true },
    { id: 'cartesian-reference-perpendicular-rays', name: 'Il riferimento cartesiano con semirette perpendicolari', active: true },
    { id: 'parallel-lines', name: 'Le rette parallele', active: true },
    { id: 'transversal-lines', name: 'Rette tagliate da una trasversale', active: true },
  ],
  'triangles': [
    { id: 'triangles-general-characteristics', name: 'Caratteristiche generali: angoli e lati', active: true },
    { id: 'triangles-classification', name: 'Classificazione dei triangoli (scaleni, isosceli, equilateri)', active: true },
    { id: 'altitudes-medians-orthocenter-centroid', name: 'Altezze e mediane: ortocentro e baricentro', active: true },
    { id: 'bisectors-axes-incenter-circumcenter', name: 'Bisettrici e assi: incentro e circocentro', active: true },
    { id: 'notable-points-isosceles-equilateral', name: 'I punti notevoli nei triangoli isosceli ed equilateri', active: true },
    { id: 'congruence-criteria', name: 'I criteri di congruenza', active: true },
  ],
  'quadrilaterals': [
    { id: 'quadrilateral-sides-angles', name: 'Lati e angoli di un quadrilatero', active: true },
    { id: 'trapezoids', name: 'I trapezi', active: true },
    { id: 'parallelograms', name: 'I parallelogrammi', active: true },
    { id: 'rectangles', name: 'I rettangoli', active: true },
    { id: 'rhombuses', name: 'I rombi', active: true },
    { id: 'squares', name: 'I quadrati', active: true },
  ],
  'polygons': [
    { id: 'polygon-characteristics', name: 'Le caratteristiche di un poligono', active: true },
    { id: 'congruent-polygons', name: 'I poligoni congruenti', active: true },
    { id: 'polygon-diagonals', name: 'Le diagonali di un poligono', active: true },
    { id: 'polygon-angles-sum', name: 'La somma degli angoli di un poligono', active: true },
    { id: 'regular-polygons-properties', name: 'Le proprietà dei poligoni regolari', active: true },
  ],
  'areas': [
    { id: 'area-concept-equivalent-figures', name: 'Il concetto di area e le figure equivalenti', active: true },
    { id: 'rectangles-squares-area', name: 'L\'area dei rettangoli e dei quadrati', active: true },
    { id: 'parallelograms-triangles-area', name: 'L\'area dei parallelogrammi e dei triangoli', active: true },
    { id: 'rhombuses-trapezoids-area', name: 'L\'area dei rombi e dei trapezi', active: true },
    { id: 'regular-polygons-area-apothem', name: 'L\'area dei poligoni regolari e l\'apotema', active: true },
    { id: 'areas-problem-solving', name: 'Risoluzione di problemi sulle aree', active: true },
  ],
  'pythagorean-theorem': [
    { id: 'theorem-statement-proof', name: 'Enunciato del teorema e dimostrazione geometrica', active: true },
    { id: 'direct-inverse-formulas-right-triangle', name: 'Formule dirette e inverse nel triangolo rettangolo', active: true },
    { id: 'pythagorean-triples', name: 'Le terne pitagoriche', active: true },
    { id: 'applications-polygons', name: 'Applicazioni ai poligoni (quadrilateri e triangoli)', active: true },
    { id: 'applications-regular-polygons', name: 'Applicazioni ai poligoni regolari', active: true },
    { id: 'application-cartesian-plane', name: 'Applicazione nel piano cartesiano (distanza tra due punti)', active: true },
  ],
  'circle-circumference': [
    { id: 'definitions-main-elements', name: 'Definizioni ed elementi principali (raggio, corda, diametro)', active: true },
    { id: 'relative-positions', name: 'Posizioni reciproche (retta-circonferenza e tra due circonferenze)', active: true },
    { id: 'central-inscribed-angles-arcs', name: 'Angoli al centro, angoli alla circonferenza e archi', active: true },
    { id: 'circumference-arcs-measure-pi', name: 'La misura della circonferenza e degli archi (il Pi greco)', active: true },
    { id: 'circle-sector-annulus-area', name: 'L\'area del cerchio, del settore e della corona circolare', active: true },
    { id: 'circumference-circle-problem-solving', name: 'Risoluzione di problemi su circonferenza e cerchio', active: true },
  ],
  'inscribed-circumscribed-polygons': [
    { id: 'general-definitions-inscriptible-circumscriptible', name: 'Definizioni generali: poligoni inscrittibili e circoscrittibili', active: true },
    { id: 'inscribed-circumscribed-triangles', name: 'Triangoli inscritti e circoscritti', active: true },
    { id: 'inscribed-circumscribed-quadrilaterals', name: 'Quadrilateri inscritti e circoscritti', active: true },
    { id: 'regular-polygons-circumference', name: 'I poligoni regolari e la circonferenza', active: true },
    { id: 'side-apothem-radius-relation', name: 'Relazione tra lato, apotema e raggio', active: true },
    { id: 'areas-perimeters-calculation', name: 'Calcolo di aree e perimetri', active: true },
  ],
  'isometries': [
    { id: 'isometry-general-concept', name: 'Il concetto generale di isometria', active: true },
    { id: 'translation-vectors-properties', name: 'La traslazione: vettori e proprietà', active: true },
    { id: 'rotation-center-angle-direction', name: 'La rotazione: centro, angolo e verso', active: true },
    { id: 'central-symmetry', name: 'La simmetria centrale (rispetto a un punto)', active: true },
    { id: 'axial-symmetry', name: 'La simmetria assiale (rispetto a una retta)', active: true },
    { id: 'isometries-composition-symmetrical-figures', name: 'Composizione di isometrie e figure dotate di simmetria', active: true },
  ],
  'geometric-transformations': [
    { id: 'non-isometric-transformations-intro', name: 'Introduzione alle trasformazioni non isometriche', active: true },
    { id: 'homothety-center-ratio-properties', name: 'L\'omotetia: centro, rapporto e proprietà', active: true },
    { id: 'similarities-geometric-plane', name: 'Le similitudini nel piano geometrico', active: true },
    { id: 'triangles-similarity-criteria', name: 'I tre criteri di similitudine dei triangoli', active: true },
    { id: 'similar-polygons-properties', name: 'Proprietà dei poligoni simili', active: true },
    { id: 'similar-figures-perimeters-areas-ratios', name: 'Rapporti tra perimetri e aree di figure simili', active: true },
  ],
  'circle-measure-area': [
    { id: 'circumference-rectification', name: 'La rettificazione della circonferenza', active: true },
    { id: 'circumference-measure', name: 'La misura della circonferenza', active: true },
    { id: 'arc-measure', name: 'La misura di un arco di circonferenza', active: true },
    { id: 'circle-area', name: 'L\'area del cerchio', active: true },
    { id: 'circular-sector-area', name: 'L\'area di un settore circolare', active: true },
    { id: 'circle-parts-area', name: 'L\'area di alcune parti del cerchio', active: true },
  ],
  'solid-geometry': [
    { id: 'space-intro-coordinates', name: 'Introduzione allo spazio: da due a tre dimensioni e coordinate', active: true },
    { id: 'lines-planes-relative-positions', name: 'Posizioni reciproche di rette e piani', active: true },
    { id: 'perpendicularity-distances-dihedral-angles', name: 'Perpendicolarità, distanze e angoli diedri', active: true },
    { id: 'solids-equivalent-solids', name: 'I solidi (poliedri e rotondi) e i solidi equivalenti', active: true },
    { id: 'spaces-capacities-measure', name: 'La misura degli spazi e delle capacità', active: true },
    { id: 'density', name: 'La densità', active: true },
  ],
  'polyhedra': [
    { id: 'rectangular-parallelepiped', name: 'Il parallelepipedo rettangolo: aree, volume e diagonale', active: true },
    { id: 'sections-symmetry-planes-cube', name: 'Sezioni, piani di simmetria e il cubo', active: true },
    { id: 'right-prism', name: 'Il prisma retto: area e volume', active: true },
    { id: 'pyramid', name: 'La piramide: caratteristiche, area e volume', active: true },
    { id: 'composite-hollow-polyhedra', name: 'I poliedri composti e i poliedri cavi', active: true },
    { id: 'regular-polyhedra', name: 'I poliedri regolari', active: true },
  ],
  'solids-of-revolution': [
    { id: 'solids-of-revolution-intro-cylinder', name: 'Introduzione ai solidi di rotazione e il cilindro (aree e volume)', active: true },
    { id: 'cone', name: 'Il cono: area laterale, area totale e volume', active: true },
    { id: 'composite-solids-of-revolution', name: 'I solidi di rotazione composti', active: true },
    { id: 'sphere-plane-positions', name: 'La sfera e le posizioni di un piano rispetto ad essa', active: true },
    { id: 'sphere-area-volume', name: 'L\'area e il volume della sfera', active: true },
    { id: 'earth-meridians-parallels', name: 'La Terra: i meridiani e i paralleli', active: true },
  ],
};

export default function App() {
  const [view, setView] = useState<'landing' | 'disciplines' | 'subject-detail' | 'quiz-selection' | 'topic-detail' | 'learn-lesson' | 'learn-lesson-inclusion'>('landing');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedQuizItems, setSelectedQuizItems] = useState<string[]>([]);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [flippedSubtopics, setFlippedSubtopics] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedSubtopics(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const [modalTopic, setModalTopic] = useState<Topic | null>(null);
  const [modalAction, setModalAction] = useState<'impara' | 'allena' | 'gioca' | null>(null);

  const openActionModal = (topic: Topic, action: 'impara' | 'allena' | 'gioca', e: React.MouseEvent) => {
    e.stopPropagation();
    setModalTopic(topic);
    setModalAction(action);
  };
  const closeModal = () => { setModalTopic(null); setModalAction(null); };

  const openTopicDetail = (topic: Topic) => {
    setSelectedTopic(topic);
    setView('topic-detail');
  };

  const openLinkedTopic = (topicId: string) => {
    let targetSubject: Subject | undefined;
    let targetTopic: Topic | undefined;
    
    for (const [subjId, subjTopics] of Object.entries(topics)) {
      const foundTopic = subjTopics.find(t => t.id === topicId);
      if (foundTopic) {
        targetSubject = subjects.find(s => s.id === subjId);
        targetTopic = foundTopic;
        break;
      }
    }
    
    if (targetSubject && targetTopic) {
      setSelectedSubject(targetSubject);
      setSelectedTopic(targetTopic);
      setView('topic-detail');
    }
  };

  const openQuizSelection = () => {
    setSelectedQuizItems([]);
    setView('quiz-selection');
  };

  const toggleQuizItem = (id: string) => {
    setSelectedQuizItems((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const startQuickQuiz = () => {
    if (!selectedSubject) return;
    setView('subject-detail');
  };

  const currentSubjectTopics = selectedSubject ? topics[selectedSubject.id] ?? [] : [];
  const quizSelectionItems = selectedSubject
    ? currentSubjectTopics.flatMap((topic) => [
      { id: topic.id, name: topic.name, type: 'topic' as const, parent: topic.name, active: true },
      ...(subtopics[topic.id] ?? []).map((subtopic) => ({
        id: `${topic.id}::${subtopic.id}`,
        name: subtopic.name,
        type: 'subtopic' as const,
        parent: topic.name,
        active: subtopic.active,
        linkToTopicId: subtopic.linkToTopicId,
      })),
    ])
    : [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <BackgroundIllustrations />

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="space-y-12 w-full max-w-2xl flex flex-col items-center"
          >
            <Logo />

            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="text-slate-800">Benvenuti in </span>
                <span className="text-dida-blue">Dida</span>
                <span className="text-dida-orange">Lab</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-lg mx-auto">
                La tua piattaforma per un apprendimento innovativo, coinvolgente e su misura.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-md">
              <button
                onClick={() => setView('disciplines')}
                className="bg-dida-teal hover:bg-[#1f8c82] text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-dida-teal/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-xl cursor-pointer"
                id="start-button"
              >
                <Rocket className="w-6 h-6 fill-white" />
                Inizia Ora
              </button>

              <button
                disabled
                className="bg-white text-slate-400 font-bold py-4 px-8 rounded-xl border border-slate-200 shadow-md flex items-center justify-center gap-4 text-xl opacity-60 cursor-not-allowed relative"
                id="google-login"
              >
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Accedi con Google</span>
                </div>
              </button>
            </div>

            <p className="text-slate-500 font-medium">
              Hai bisogno di aiuto?{" "}
              <a href="#" className="text-slate-800 underline decoration-slate-300 hover:decoration-slate-800 transition-all underline-offset-4">
                Contattaci
              </a>
            </p>
          </motion.div>
        )}

        {view === 'disciplines' && (
          <motion.div
            key="disciplines"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl space-y-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-4">
                <Logo size="sm" />
                <div className="h-8 w-px bg-slate-200 hidden md:block" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-wrap max-w-[120px]">Scuola Secondaria di Primo Grado</p>
                </div>
              </div>
              <button
                onClick={() => setView('landing')}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Torna indietro
              </button>
            </div>

            <div className="space-y-4 px-4">
              <h2 className="text-4xl font-bold text-slate-800 tracking-tight">
                Le tue <span className="text-dida-orange">discipline</span>
              </h2>
              <p className="text-slate-500 font-medium text-lg">Seleziona una disciplina per iniziare il tuo percorso formativo.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 pb-12">
              {subjects.map((subject, index) => {
                const Icon = subject.icon;
                return (
                  <motion.button
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={subject.active ? { y: -8, scale: 1.02 } : {}}
                    whileTap={subject.active ? { scale: 0.98 } : {}}
                    disabled={!subject.active}
                    onClick={subject.active ? () => { setSelectedSubject(subject); setView('subject-detail'); } : undefined}
                    className={`
                       group relative flex flex-col items-center gap-6 p-8 rounded-[2rem] border-2 transition-all text-center
                       ${subject.active
                        ? "bg-white border-slate-50 shadow-lg hover:shadow-2xl hover:border-dida-blue/20 cursor-pointer"
                        : "bg-slate-50/50 border-transparent grayscale opacity-80 cursor-not-allowed"}
                     `}
                  >
                    {!subject.active && (
                      <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1">
                        <Sparkles size={10} />
                        Soon
                      </div>
                    )}

                    <div className={`
                       w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
                       ${subject.active
                        ? `bg-slate-50 group-hover:bg-dida-blue group-hover:text-white ${subject.color}`
                        : "bg-slate-100 text-slate-400"}
                     `}>
                      <Icon size={40} strokeWidth={1.5} />
                    </div>

                    <div className="space-y-1">
                      <h3 className={`text-xl font-extrabold ${subject.active ? "text-slate-800" : "text-slate-400"}`}>
                        {subject.name}
                      </h3>
                      {subject.active && (
                        <div className="h-1 w-8 bg-dida-orange rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {view === 'subject-detail' && selectedSubject && (
          <motion.div
            key="subject-detail"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl space-y-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-4">
                <Logo size="sm" />
                <div className="h-8 w-px bg-slate-200 hidden md:block" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Disciplina</p>
                  <p className="text-lg font-bold text-slate-700">{selectedSubject.name}</p>
                </div>
              </div>
              <button
                onClick={() => { setView('disciplines'); setSelectedSubject(null); setSearchTerm(''); }}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Torna alle discipline
              </button>
            </div>

            <div className="space-y-6 px-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Argomenti di <span className="text-dida-orange">{selectedSubject.name.toLowerCase()}</span>
                </h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Cerca argomenti..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dida-blue/20 focus:border-dida-blue"
                  />
                </div>
                <button onClick={openQuizSelection} className="bg-dida-teal hover:bg-[#1f8c82] text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all">
                  Quiz Rapido
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics[selectedSubject.id]?.filter(topic => {
                  const term = searchTerm.toLowerCase();
                  const matchesTopic = topic.name.toLowerCase().includes(term);
                  const matchesSubtopic = (subtopics[topic.id] ?? []).some((subtopic) =>
                    subtopic.name.toLowerCase().includes(term)
                  );
                  return matchesTopic || matchesSubtopic;
                }).map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => openTopicDetail(topic)}
                    className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${topic.grade === 1 ? 'bg-blue-100 text-blue-700' :
                        topic.grade === 2 ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                        {topic.grade}ª Media
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{topic.name}</h3>
                    <p className="text-slate-500 text-sm mb-4">Esercizi e lezioni interattive</p>
                    <div className="grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
                      <button id={`impara-${topic.id}`} onClick={() => { setModalTopic(topic); setModalAction('impara'); }} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-dida-blue hover:bg-blue-50 hover:border-dida-blue/30 transition cursor-pointer">
                        <BookOpen size={16} />
                        Impara
                      </button>
                      <button id={`allena-${topic.id}`} onClick={() => { setModalTopic(topic); setModalAction('allena'); }} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50 hover:border-amber-300 transition cursor-pointer">
                        <Zap size={16} />
                        Allena
                      </button>
                      <button id={`gioca-${topic.id}`} onClick={() => { setModalTopic(topic); setModalAction('gioca'); }} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition cursor-pointer">
                        <Gamepad size={16} />
                        Gioca
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'quiz-selection' && selectedSubject && (
          <motion.div
            key="quiz-selection"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl space-y-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-4">
                <Logo size="sm" />
                <div className="h-8 w-px bg-slate-200 hidden md:block" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quiz rapido</p>
                  <p className="text-lg font-bold text-slate-700">Materia: {selectedSubject.name}</p>
                </div>
              </div>
              <button
                onClick={() => setView('subject-detail')}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Torna all'argomento
              </button>
            </div>

            <div className="space-y-6 px-4">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Scegli argomenti e sottoargomenti</h3>
                <p className="text-slate-500 mb-6">Seleziona tutti gli elementi che vuoi includere nel quiz rapido. Più selezioni, più varia sarà la batteria di domande.</p>
                <div className="grid grid-cols-1 gap-4">
                  {quizSelectionItems.map((item) => {
                    const isSelected = selectedQuizItems.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => item.active && toggleQuizItem(item.id)}
                        className={`w-full rounded-[1.75rem] border p-5 text-left transition-all ${item.active
                          ? `border-slate-200 bg-slate-50 hover:border-dida-blue/30 hover:bg-white ${isSelected ? 'ring-2 ring-dida-blue/30' : ''}`
                          : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-xs uppercase tracking-[0.26em] text-slate-500 mb-2">
                              {item.type === 'topic' ? 'Argomento' : 'Sottoargomento'}
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">{item.name}</h4>
                            <p className="text-sm text-slate-500 mt-1">Categoria: {item.parent}</p>
                          </div>
                          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${isSelected ? 'bg-dida-blue text-white' : item.active ? 'bg-slate-100 text-slate-600' : 'bg-slate-200 text-slate-500'
                            }`}>
                            {isSelected ? 'Selezionato' : item.active ? 'Seleziona' : 'Disattivato'}
                          </div>
                        </div>
                        {!item.active && item.linkToTopicId ? (
                          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-dida-teal text-white px-4 py-2 text-sm font-semibold">
                            Vai a {Object.values(topics).flat().find(t => t.id === item.linkToTopicId)?.name || 'collegamento'}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <p className="text-slate-600">{selectedQuizItems.length} elementi selezionati</p>
                  <button
                    type="button"
                    onClick={startQuickQuiz}
                    disabled={selectedQuizItems.length === 0}
                    className="rounded-2xl bg-dida-teal px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1f8c82] disabled:bg-slate-300 disabled:text-slate-500"
                  >
                    Avvia quiz rapido
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'topic-detail' && selectedSubject && selectedTopic && (
          <motion.div
            key="topic-detail"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl space-y-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-4">
                <Logo size="sm" />
                <div className="h-8 w-px bg-slate-200 hidden md:block" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Argomento</p>
                  <p className="text-lg font-bold text-slate-700">{selectedTopic.name}</p>
                  <p className="text-sm text-slate-500">Materia: {selectedSubject.name}</p>
                </div>
              </div>
              <button
                onClick={() => { setView('subject-detail'); setSelectedTopic(null); }}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Torna all'argomento
              </button>
            </div>

            <div className="space-y-6 px-4">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Sottoargomenti</h3>
                <p className="text-slate-500 mb-6">Scegli se imparare, allenarti o giocare con i contenuti disponibili.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subtopics[selectedTopic.id]?.map((subtopic) => {
                    const isFlipped = flippedSubtopics[subtopic.id] || false;
                    
                    const renderCardContent = (isBack: boolean) => (
                      <div className={`rounded-3xl border p-5 w-full h-full flex flex-col transition-colors ${subtopic.active ? (isBack ? 'border-dida-orange/30 bg-orange-50/50 hover:bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-dida-blue/30 hover:bg-white cursor-pointer') : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-sm font-semibold uppercase tracking-[0.2em] ${isBack ? 'text-dida-orange' : 'text-slate-500'}`}>
                            {subtopic.active ? (isBack ? 'Inclusione' : 'Attivo') : 'Disattivato'}
                          </span>
                          {subtopic.active && (
                            <button
                              onClick={(e) => toggleFlip(subtopic.id, e)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition shadow-sm z-10 relative ${isBack ? 'text-white bg-dida-orange hover:bg-orange-600' : 'text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-dida-orange'}`}
                            >
                              {isBack ? 'Indietro' : 'Inclusione'}
                            </button>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{subtopic.name}</h4>
                        {!subtopic.active && subtopic.linkToTopicId ? (
                          <button
                            onClick={() => openLinkedTopic(subtopic.linkToTopicId!)}
                            className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-400 via-cyan-400 via-teal-400 via-indigo-400 via-purple-400 to-blue-500 text-white px-4 py-2 text-sm font-semibold transition hover:opacity-90 z-10 relative w-fit"
                          >
                            collegamento con {Object.values(topics).flat().find(t => t.id === subtopic.linkToTopicId)?.name || 'Argomento'}
                          </button>
                        ) : subtopic.active ? (
                          <div className="mt-4 grid grid-cols-3 gap-2 z-10 relative">
                            <button
                              onClick={() => {
                                const hasLesson = ['natural-numbers', 'tables'].includes(subtopic.id);
                                if (hasLesson) {
                                  setSelectedSubtopicId(subtopic.id);
                                  setView(isBack ? 'learn-lesson-inclusion' : 'learn-lesson');
                                }
                              }}
                              className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${['natural-numbers', 'tables'].includes(subtopic.id) ? (isBack ? 'text-dida-orange hover:bg-orange-50 hover:border-dida-orange/30 cursor-pointer bg-white border-dida-orange/20' : 'text-dida-blue hover:bg-blue-50 hover:border-dida-blue/30 cursor-pointer bg-white border-slate-200') : 'text-slate-400 cursor-not-allowed bg-white/50 border-slate-200'}`}
                            >
                              <BookOpen size={16} />
                              Impara
                            </button>
                            <button className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer bg-white ${isBack ? 'border-dida-orange/20 text-slate-700' : 'border-slate-200 text-slate-700'}`}>
                              <Zap size={16} />
                              Allena
                            </button>
                            <button className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer bg-white ${isBack ? 'border-dida-orange/20 text-slate-700' : 'border-slate-200 text-slate-700'}`}>
                              <Gamepad size={16} />
                              Gioca
                            </button>
                          </div>
                        ) : (
                          <p className="text-slate-500 text-sm">Contenuto in arrivo</p>
                        )}
                      </div>
                    );

                    return (
                      <div key={subtopic.id} style={{ perspective: 1000 }} className="relative h-[220px]">
                        <motion.div
                          animate={{ rotateY: isFlipped ? 180 : 0 }}
                          transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                          style={{ transformStyle: "preserve-3d" }}
                          className="w-full h-full relative"
                        >
                          {/* Front Side */}
                          <div style={{ backfaceVisibility: "hidden", pointerEvents: isFlipped ? "none" : "auto" }} className="absolute inset-0 w-full h-full">
                            {renderCardContent(false)}
                          </div>

                          {/* Back Side */}
                          <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", pointerEvents: isFlipped ? "auto" : "none" }} className="absolute inset-0 w-full h-full">
                            {renderCardContent(true)}
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'learn-lesson' && selectedSubtopicId === 'natural-numbers' && selectedSubject && selectedTopic && (
          <NumberLineLesson
            key="learn-lesson"
            onBack={() => { setView('topic-detail'); setSelectedSubtopicId(null); }}
            subjectName={selectedSubject.name}
            topicName={selectedTopic.name}
          />
        )}

        {view === 'learn-lesson-inclusion' && selectedSubtopicId === 'natural-numbers' && selectedSubject && selectedTopic && (
          <NumberLineLessonInclusion
            key="learn-lesson-inclusion"
            onBack={() => { setView('topic-detail'); setSelectedSubtopicId(null); }}
            subjectName={selectedSubject.name}
            topicName={selectedTopic.name}
          />
        )}

        {view === 'learn-lesson' && selectedSubtopicId === 'tables' && selectedSubject && selectedTopic && (
          <TablesLesson
            key="learn-tables"
            onBack={() => { setView('topic-detail'); setSelectedSubtopicId(null); }}
            subjectName={selectedSubject.name}
            topicName={selectedTopic.name}
          />
        )}

        {view === 'learn-lesson-inclusion' && selectedSubtopicId === 'tables' && selectedSubject && selectedTopic && (
          <TablesLessonInclusion
            key="learn-tables-inclusion"
            onBack={() => { setView('topic-detail'); setSelectedSubtopicId(null); }}
            subjectName={selectedSubject.name}
            topicName={selectedTopic.name}
          />
        )}
      </AnimatePresence>

      {/* Action Modal */}
      <AnimatePresence>
        {modalTopic && modalAction && (
          <motion.div
            key="action-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className={`relative p-8 pb-6 border-b border-slate-100 ${
                modalAction === 'impara' ? 'bg-gradient-to-br from-blue-50 to-white' :
                modalAction === 'allena' ? 'bg-gradient-to-br from-amber-50 to-white' :
                'bg-gradient-to-br from-emerald-50 to-white'
              }`}>
                <button onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition cursor-pointer shadow-sm">
                  ✕
                </button>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-4 ${
                    modalAction === 'impara' ? 'bg-dida-blue text-white shadow-blue-200' :
                    modalAction === 'allena' ? 'bg-amber-500 text-white shadow-amber-200' :
                    'bg-emerald-500 text-white shadow-emerald-200'
                  }`}>
                    {modalAction === 'impara' ? <BookOpen size={28} /> : modalAction === 'allena' ? <Zap size={28} /> : <Gamepad size={28} />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">
                    {modalAction === 'impara' ? 'Impara' : modalAction === 'allena' ? 'Allenati' : 'Gioca'}
                  </h3>
                  <p className="text-base font-medium text-slate-500 mt-1">{modalTopic.name}</p>
                </div>
                <p className="text-sm text-slate-500 mt-4 text-center">
                  {modalAction === 'impara' ? 'Scegli un sottoargomento per imparare in modo interattivo.' :
                   modalAction === 'allena' ? 'Scegli un sottoargomento per allenarti con gli esercizi.' :
                   'Scegli un sottoargomento per imparare giocando.'}
                </p>
              </div>

              {/* Subtopics List */}
              <div className="p-6 overflow-y-auto space-y-3 flex-1">
                {(subtopics[modalTopic.id] ?? []).map((sub, i) => (
                  <motion.button
                    key={sub.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    disabled={!sub.active}
                    onClick={() => {
                      const hasLesson = ['natural-numbers', 'tables'].includes(sub.id);
                      if (modalAction === 'impara' && sub.active && hasLesson) {
                        setSelectedTopic(modalTopic);
                        setSelectedSubtopicId(sub.id);
                        setView('learn-lesson');
                        closeModal();
                      } else {
                        alert(`La sezione "${modalAction}" per "${sub.name}" è ancora in fase di sviluppo!`);
                        closeModal();
                      }
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      sub.active
                        ? 'border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md hover:border-slate-300 cursor-pointer'
                        : 'border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold truncate ${sub.active ? 'text-slate-800' : 'text-slate-400'}`}>{sub.name}</h4>
                      {!sub.active && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Sparkles size={10} /> Prossimamente
                        </p>
                      )}
                    </div>
                    {sub.active && (
                      <div className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-white ${
                        modalAction === 'impara' ? 'bg-dida-blue' :
                        modalAction === 'allena' ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}>
                        {modalAction === 'impara' ? 'Impara' : modalAction === 'allena' ? 'Allena' : 'Gioca'}
                      </div>
                    )}
                  </motion.button>
                ))}
                {(subtopics[modalTopic.id] ?? []).length === 0 && (
                  <p className="text-slate-400 text-center py-8">Nessun sottoargomento disponibile.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Powered by ilnicoprof badge */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-full pl-1.5 pr-4 py-1.5 shadow-md transition-all opacity-80 hover:opacity-100 hover:shadow-lg hover:bg-white/90">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-slate-100 shrink-0">
            <img
              src="/ilnicoprof-logo.png"
              alt="ilnicoprof logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-medium text-slate-500">
            Powered by <strong className="font-extrabold text-slate-800">ilnicoprof</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
