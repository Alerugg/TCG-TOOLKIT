"use client";

import React from "react";

export default function ResultPanel({ result }: { result: any }) {
  if (!result) {
    return <div style={{ opacity: 0.8 }}>Aún no hay análisis. Completa el formulario y pulsa “Analizar”.</div>;
  }

  const risk = result?.risk?.score ?? "—";
  const L = result?.likelihood?.score ?? "—";
  const I = result?.impact?.score ?? "—";
  const exp = result?.exposure?.recommended_pct ?? "—";
  const why = result?.exposure?.why ?? "";

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>{result.case_id}</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
        <Stat label="Riesgo" value={risk} />
        <Stat label="Likelihood" value={L} />
        <Stat label="Impact" value={I} />
        <Stat label="Exposición" value={`${exp}%`} />
      </div>

      <div style={{ height: 12 }} />

      <div style={{ opacity: 0.9, lineHeight: 1.45 }}>
        <b>¿Qué significa Exposición?</b> Es el tamaño recomendado de entrada para limitar daño si sale mal
        (a más riesgo, menos %). No es “probabilidad”.
      </div>

      <div style={{ height: 10 }} />
      <div style={{ opacity: 0.85 }}>{why}</div>

      <div style={{ height: 14 }} />
      <div style={{ fontWeight: 900, marginBottom: 8 }}>Razones principales</div>

      <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.95 }}>
        {(result.reasons || []).map((r: any, i: number) => (
          <li key={i}>
            <b>{r.points > 0 ? `+${r.points}` : r.points}</b> — {r.label}
            {r.note ? <span style={{ opacity: 0.8 }}> ({r.note})</span> : null}
          </li>
        ))}
      </ul>

      <div style={{ height: 14 }} />
      <div style={{ fontWeight: 900, marginBottom: 6 }}>Inputs del caso</div>

      <div style={{ opacity: 0.9, lineHeight: 1.55 }}>
        <Line k="Juego" v={result.game} />
        <Line k="Producto" v={`${result.product_type} (${result.sealed_status})`} />
        <Line k="Canal" v={`${result.channel} · ${result.platform}`} />
        <Line k="Pago" v={result.payment_method} />
        <Line k="Vendedor" v={result.seller_rep} />
        <Line k="Evidencias" v={`stock:${result.proof_stock} · factura:${result.invoice} · flags:${result.red_flags}`} />
        <Line k="Entrega" v={`${result.delivery}${result.delivery === "in_person" ? ` · safe:${result.in_person_safe}` : ""}`} />
        <Line k="Precio vs ref" v={result.price_vs_ref} />
        <Line k="Tamaño" v={result.order_size} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(0,0,0,0.22)"
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 900, letterSpacing: 0.6, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 1000, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function Line({ k, v }: { k: string; v: any }) {
  return (
    <div>
      <b>{k}:</b> {String(v ?? "—")}
    </div>
  );
}