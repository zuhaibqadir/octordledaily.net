import { SOLUTIONS } from '../data/solutions';

/** Mulberry32 seeded PRNG */
export function createRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Pick `count` unique solution words using a seeded RNG */
export function pickWords(seed: number | string, count: number): string[] {
  const numericSeed = typeof seed === 'string' ? hashString(seed) : seed;
  const rng = createRng(numericSeed);
  const pool = [...SOLUTIONS];
  const picked: string[] = [];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    picked.push(pool[idx].toUpperCase());
    pool.splice(idx, 1);
  }

  return picked;
}

/** UTC calendar date as YYYY-MM-DD (shared worldwide) */
export function getDateString(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse a YYYY-MM-DD puzzle date as UTC noon */
export function parsePuzzleDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00Z`);
}

/** Days since a fixed UTC epoch — used as daily puzzle number */
export function getDailyPuzzleNumber(date: Date = new Date()): number {
  const epoch = Date.UTC(2024, 0, 1);
  const today = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  return Math.floor((today - epoch) / 86400000) + 1;
}

/** Milliseconds until next UTC midnight */
export function msUntilMidnight(date: Date = new Date()): number {
  const next = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() + 1,
  );
  return next - date.getTime();
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
