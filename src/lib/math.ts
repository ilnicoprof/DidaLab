/**
 * Funzioni matematiche condivise dalle lezioni.
 * Ogni laboratorio che mostra un risultato deve calcolarlo da qui,
 * non scriverlo a mano nel testo.
 */

export const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
};

export const lcm = (a: number, b: number): number =>
  a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b);

export const divisors = (n: number): number[] => {
  const m = Math.abs(n);
  const list: number[] = [];
  for (let i = 1; i <= m; i++) if (m % i === 0) list.push(i);
  return list;
};

/** Passaggi della scomposizione "in colonna": [dividendo, divisore primo] */
export const factorSteps = (n: number): [number, number][] => {
  const steps: [number, number][] = [];
  let rest = Math.abs(n);
  for (let p = 2; rest > 1; ) {
    if (rest % p === 0) {
      steps.push([rest, p]);
      rest /= p;
    } else {
      p++;
    }
  }
  return steps;
};

/** Fattori primi con esponente, in ordine crescente: 60 → [[2,2],[3,1],[5,1]] */
export const factorize = (n: number): [number, number][] => {
  const map = new Map<number, number>();
  for (const [, p] of factorSteps(n)) map.set(p, (map.get(p) ?? 0) + 1);
  return [...map.entries()];
};

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";
export const superscript = (n: number) =>
  String(n).split("").map(d => SUPERSCRIPT[Number(d)]).join("");

/** [[2,2],[3,1]] → "2² × 3" */
export const formatFactors = (factors: [number, number][]): string =>
  factors.length === 0
    ? "1"
    : factors.map(([p, e]) => (e > 1 ? `${p}${superscript(e)}` : `${p}`)).join(" × ");

/** Fattori comuni con esponente minore (M.C.D.) */
export const commonFactors = (a: [number, number][], b: [number, number][]): [number, number][] =>
  a.flatMap(([p, e]) => {
    const other = b.find(([q]) => q === p);
    return other ? [[p, Math.min(e, other[1])] as [number, number]] : [];
  });

/** Fattori comuni e non comuni con esponente maggiore (m.c.m.) */
export const allFactors = (a: [number, number][], b: [number, number][]): [number, number][] => {
  const map = new Map<number, number>(a);
  for (const [p, e] of b) map.set(p, Math.max(map.get(p) ?? 0, e));
  return [...map.entries()].sort(([p], [q]) => p - q);
};
