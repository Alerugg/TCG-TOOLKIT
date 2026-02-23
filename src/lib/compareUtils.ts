// src/lib/compareUtils.ts

export type Profile = "equilibrado" | "conservador" | "flipper";

export type Snap = {
  accumulation?: { score?: number };
  negotiation?: { score?: number };
  risk?: { score?: number };
};

export type Winner = "A" | "B" | "tie";

const PROFILE_WEIGHTS: Record<Profile, { acc: number; nego: number; risk: number }> = {
  equilibrado: { acc: 1.0, nego: 0.25, risk: -0.75 },
  conservador: { acc: 0.9, nego: 0.2, risk: -1.1 },
  flipper: { acc: 0.6, nego: 1.0, risk: -0.6 }
};

export function compositeScore(snap: Snap | null, profile: Profile = "equilibrado"): number {
  if (!snap) return 0;

  const w = PROFILE_WEIGHTS[profile] ?? PROFILE_WEIGHTS.equilibrado;

  const acc = snap.accumulation?.score ?? 0;
  const nego = snap.negotiation?.score ?? 0;
  const risk = snap.risk?.score ?? 0;

  return acc * w.acc + nego * w.nego + risk * w.risk;
}

/**
 * Convierte score compuesto en una preferencia A/B en %
 * k controla “lo agresiva” que es la curva (más alto = más suave).
 */
export function preference(a: Snap, b: Snap, profile: Profile = "equilibrado", k = 12) {
  const sA = compositeScore(a, profile);
  const sB = compositeScore(b, profile);

  const d = sA - sB;
  const pA = 1 / (1 + Math.exp(-d / k));

  const aPct = Math.round(pA * 100);
  const bPct = 100 - aPct;

  return {
    aPct,
    bPct,
    scoreA: Math.round(sA * 10) / 10,
    scoreB: Math.round(sB * 10) / 10,
    delta: Math.round(d * 10) / 10
  };
}

/**
 * Veredicto simple: empate si están muy cerca; si no, gana A o B.
 */
export function verdict(a: Snap, b: Snap, profile: Profile = "equilibrado") {
  const sA = compositeScore(a, profile);
  const sB = compositeScore(b, profile);

  let winner: Winner;
  let text: string;

  if (Math.abs(sA - sB) < 3) {
    winner = "tie";
    text = "Muy parejos. Decide por disponibilidad real y método de pago.";
  } else {
    winner = sA > sB ? "A" : "B";
    text = "Mejor perfil compuesto para entrada equilibrada.";
  }

  return { winner, text };
}