"use client";

import React, { forwardRef, useMemo } from "react";

type Pref = { aPct: number; bPct: number };

type CaseSnap = {
  case_id: string;
  game?: string;
  product_type?: string;
  risk?: { score?: number };
  negotiation?: { score?: number };
  accumulation?: { score?: number };
  exposure?: {
    recommended_pct?: number;
    plan?: { steps?: Array<{ step: string; trigger: string }> };
  };
  signals?: string[];
};

export type CompareShareCardProps = {
  a: CaseSnap;
  b: CaseSnap;
  pref: Pref | null;
  winnerLabel: string; // "A" | "B" | "Empate"
  profile: string;
  format?: "feed" | "story";
  watermark?: string;
};

function gameLabel(g?: string) {
  if (g === "one_piece") return "One Piece";
  if (g === "riftbound") return "Riftbound";
  if (g === "pokemon") return "Pokémon";
  return g || "—";
}

function productLabel(p?: string) {
  if (p === "booster_box") return "Booster Box";
  if (p === "case") return "Case";
  if (p === "blister") return "Blister";
  if (p === "starter_deck") return "Starter/Deck";
  if (p === "single") return "Single";
  if (p === "pack") return "Pack";
  return p || "—";
}

const CompareShareCard = forwardRef<HTMLDivElement, CompareShareCardProps>(function CompareShareCard(
  { a, b, pref, winnerLabel, profile, format = "feed", watermark = "Demo pública — v1" },
  ref
) {
  const isStory = format === "story";

  const winPct = useMemo(() => {
    if (!pref) return 0;
    return Math.max(pref.aPct, pref.bPct);
  }, [pref]);

  const trigger = useMemo(() => {
    if (!pref) return "";
    const winnerSnap =
      pref.aPct === pref.bPct ? null : pref.aPct > pref.bPct ? a : b;
    return winnerSnap?.exposure?.plan?.steps?.[0]?.trigger || "";
  }, [a, b, pref]);

  const cardStyle: React.CSSProperties = {
    position: "relative",
    width: 1080,
    height: isStory ? 1920 : 1350,
    padding: isStory ? 54 : 42,
    borderRadius: 36,
    color: "white",
    background:
      "radial-gradient(1200px 800px at 10% 10%, rgba(245,165,36,0.25), transparent 50%), radial-gradient(900px 700px at 90% 20%, rgba(255,255,255,0.12), transparent 55%), rgba(10,10,14,1)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 18
  };

  return (
    <div ref={ref} style={cardStyle}>
      <div
        style={{
          position: "absolute",
          top: 26,
          right: 26,
          padding: "10px 14px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(0,0,0,0.28)",
          fontSize: 16,
          fontWeight: 900,
          letterSpacing: 0.6,
          opacity: 0.92,
          textTransform: "uppercase"
        }}
      >
        {watermark}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: isStory ? 30 : 26, fontWeight: 1000, letterSpacing: 2, opacity: 0.95 }}>
          RISKDECK
        </div>
        <div style={{ fontSize: 18, opacity: 0.85 }}>Perfil: {profile}</div>
      </div>

      <div style={{ fontSize: isStory ? 52 : 44, fontWeight: 1000, letterSpacing: 0.5, marginTop: 6 }}>
        Comparativa A vs B
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 14 }}>
        <CaseCol label="A" snap={a} />
        <CaseCol label="B" snap={b} />
      </div>

      <div style={{ marginTop: 6, height: 1, background: "rgba(255,255,255,0.12)" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 18, marginTop: 10 }}>
        <div
          style={{
            padding: 22,
            borderRadius: 26,
            background: "rgba(245,165,36,0.10)",
            border: "1px solid rgba(245,165,36,0.25)"
          }}
        >
          <div style={{ fontSize: isStory ? 44 : 38, fontWeight: 1000, letterSpacing: 0.4 }}>
            {pref?.aPct === pref?.bPct ? "Empate" : `Gana ${winnerLabel}`}
          </div>
          <div style={{ marginTop: 8, fontSize: 20, opacity: 0.9 }}>
            {pref?.aPct === pref?.bPct ? "50% / 50%" : `Preferencia ${winPct}%`}
          </div>
        </div>

        <div
          style={{
            padding: 22,
            borderRadius: 26,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)"
          }}
        >
          <div style={{ fontSize: 16, opacity: 0.75, letterSpacing: 0.7, textTransform: "uppercase" }}>
            Trigger clave
          </div>
          <div style={{ marginTop: 10, fontSize: isStory ? 26 : 22, fontWeight: 900, lineHeight: 1.25, opacity: 0.95 }}>
            {trigger || "—"}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", opacity: 0.75 }}>
        <div style={{ fontSize: 16 }}>Gestión de riesgo, no consejo financiero.</div>
        <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: 0.5 }}>@riskdeck</div>
      </div>
    </div>
  );
});

function CaseCol({ label, snap }: { label: "A" | "B"; snap: CaseSnap }) {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 26,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 18, fontWeight: 900, opacity: 0.85, letterSpacing: 1 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 1000 }}>{snap.case_id}</div>
      </div>

      <div style={{ fontSize: 18, opacity: 0.85 }}>
        {gameLabel(snap.game)} · {productLabel(snap.product_type)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <ScoreBox label="Riesgo" value={snap.risk?.score} />
        <ScoreBox label="Negociación" value={snap.negotiation?.score} />
        <ScoreBox label="Acumulación" value={snap.accumulation?.score} />
      </div>

      <div style={{ fontSize: 18, opacity: 0.9 }}>
        Exposición: <b>{snap.exposure?.recommended_pct ?? "—"}%</b>
      </div>

      <div style={{ marginTop: 6, fontSize: 17, opacity: 0.9, lineHeight: 1.35 }}>
        {(snap.signals || []).slice(0, 3).map((s, i) => (
          <div key={i}>• {s}</div>
        ))}
        {(!snap.signals || snap.signals.length === 0) && <div>• —</div>}
      </div>
    </div>
  );
}

function ScoreBox({ label, value }: { label: string; value?: number }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 20,
        background: "rgba(0,0,0,0.22)",
        border: "1px solid rgba(255,255,255,0.10)"
      }}
    >
      <div style={{ fontSize: 14, opacity: 0.75, letterSpacing: 0.6, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 1000, marginTop: 6 }}>{value ?? "—"}</div>
    </div>
  );
}

export default CompareShareCard;