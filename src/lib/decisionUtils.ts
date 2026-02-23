export type Snap = {
  risk?: { score?: number };
  negotiation?: { score?: number };
  accumulation?: { score?: number };
};

export function decideMode(s: Snap | null) {
  if (!s) return { mode: "—", why: "—" };

  const risk = s.risk?.score ?? 0;
  const nego = s.negotiation?.score ?? 0;
  const acc = s.accumulation?.score ?? 0;

  if (risk >= 75) return { mode: "Esperar", why: "Riesgo alto." };
  if (nego >= 70 && risk <= 65) return { mode: "Negociar", why: "Buen margen y riesgo controlado." };
  if (acc >= 70 && risk <= 60) return { mode: "Comprar", why: "Acumulación alta con riesgo controlado." };

  return { mode: "Entrada pequeña", why: "Caso mixto. Entra por tramos y re-evalúa." };
}

export function compareDecision(a: Snap | null, b: Snap | null) {
  const order: Record<string, number> = { Comprar: 4, Negociar: 3, "Entrada pequeña": 2, Esperar: 1, "—": 0 };

  const da = decideMode(a);
  const db = decideMode(b);

  const ra = order[da.mode] ?? 0;
  const rb = order[db.mode] ?? 0;

  if (ra === rb) return { best: "tie" as const, a: da, b: db };
  return ra > rb ? { best: "A" as const, a: da, b: db } : { best: "B" as const, a: da, b: db };
}