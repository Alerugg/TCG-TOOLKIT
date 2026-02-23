// src/lib/riskdeckEngine.ts

export type Channel = "store" | "marketplace" | "p2p";
export type Platform = "cardmarket" | "ebay" | "wallapop" | "discord" | "other";

export type PaymentMethod =
  | "paypal_gs"
  | "card_marketplace"
  | "escrow"
  | "paypal_ff"
  | "bank_transfer"
  | "bizum"
  | "cash"
  | "crypto";

export type SellerRep = "verified" | "established" | "new" | "unknown";
export type YesNo = "yes" | "no";
export type RedFlags = "none" | "mild" | "strong";
export type Delivery = "tracked_shipping" | "untracked_shipping" | "in_person";
export type PriceVsRef = "below" | "market" | "above" | "far_above";
export type OrderSize = "test" | "small" | "medium" | "large";

export type AnswersV2 = {
  game: "riftbound" | "one_piece" | "pokemon";

  // ✅ AÑADIDO case_blisters
  product_type: "booster_box" | "case" | "case_blisters" | "blister" | "starter_deck" | "single";

  sealed_status: "sealed" | "opened";

  channel: Channel;
  platform: Platform;

  payment_method: PaymentMethod;
  seller_rep: SellerRep;

  proof_stock: YesNo;
  invoice: YesNo;
  red_flags: RedFlags;

  delivery: Delivery;
  in_person_safe: YesNo;

  price_vs_ref: PriceVsRef;
  order_size: OrderSize;
};

type Reason = { points: number; label: string; note?: string };

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

function uid() {
  return "RD-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export function runAnalysis(a: AnswersV2) {
  const reasons: Reason[] = [];

  // ---------- Likelihood ----------
  let L = 20;

  // Canal
  if (a.channel === "store") {
    L += 0; reasons.push({ points: 0, label: "Canal: tienda" });
  } else if (a.channel === "marketplace") {
    L += 10; reasons.push({ points: 10, label: "Canal: marketplace" });
  } else {
    L += 25; reasons.push({ points: 25, label: "Canal: P2P (más riesgo)" });
  }

  // Plataforma (ajuste fino)
  if (a.platform === "discord") {
    L += 8; reasons.push({ points: 8, label: "Plataforma: Discord/DM" });
  }
  if (a.platform === "wallapop") {
    L += 6; reasons.push({ points: 6, label: "Plataforma: Wallapop" });
  }

  // Pago / Protección
  switch (a.payment_method) {
    case "escrow":
      L -= 8; reasons.push({ points: -8, label: "Pago: Escrow (mitiga)" });
      break;
    case "paypal_gs":
      L -= 6; reasons.push({ points: -6, label: "Pago: PayPal G&S (disputa)" });
      break;
    case "card_marketplace":
      L -= 3; reasons.push({ points: -3, label: "Pago: Tarjeta en marketplace" });
      break;
    case "paypal_ff":
      L += 18; reasons.push({ points: 18, label: "Pago: PayPal F&F (baja protección)" });
      break;
    case "bank_transfer":
      L += 18; reasons.push({ points: 18, label: "Pago: Transferencia (difícil revertir)" });
      break;
    case "bizum":
      L += 20; reasons.push({ points: 20, label: "Pago: Bizum (difícil revertir)" });
      break;
    case "cash":
      L += 22; reasons.push({ points: 22, label: "Pago: Efectivo" });
      break;
    case "crypto":
      L += 25; reasons.push({ points: 25, label: "Pago: Crypto (irreversible)" });
      break;
  }

  // Reputación
  switch (a.seller_rep) {
    case "verified":
      L -= 8; reasons.push({ points: -8, label: "Vendedor: verificado" });
      break;
    case "established":
      L -= 4; reasons.push({ points: -4, label: "Vendedor: historial medio" });
      break;
    case "new":
      L += 8; reasons.push({ points: 8, label: "Vendedor: nuevo" });
      break;
    case "unknown":
      L += 16; reasons.push({ points: 16, label: "Vendedor: desconocido" });
      break;
  }

  // Evidencias
  if (a.proof_stock === "yes") {
    L -= 6; reasons.push({ points: -6, label: "Prueba de stock: sí" });
  } else {
    L += 10; reasons.push({ points: 10, label: "Prueba de stock: no" });
  }

  if (a.invoice === "yes") {
    L -= 3; reasons.push({ points: -3, label: "Factura/recibo: sí" });
  } else {
    L += 4; reasons.push({ points: 4, label: "Factura/recibo: no" });
  }

  if (a.red_flags === "mild") {
    L += 8; reasons.push({ points: 8, label: "Red flags: leves" });
  } else if (a.red_flags === "strong") {
    L += 18; reasons.push({ points: 18, label: "Red flags: fuertes", note: "Prisa / presión / incoherencias" });
  } else {
    reasons.push({ points: 0, label: "Red flags: ninguna" });
  }

  // Logística
  if (a.delivery === "tracked_shipping") {
    L -= 2; reasons.push({ points: -2, label: "Envío: con tracking" });
  } else if (a.delivery === "untracked_shipping") {
    L += 8; reasons.push({ points: 8, label: "Envío: sin tracking" });
  } else {
    if (a.in_person_safe === "yes") {
      L -= 3; reasons.push({ points: -3, label: "En mano: seguro" });
    } else {
      L += 10; reasons.push({ points: 10, label: "En mano: inseguro" });
    }
  }

  // Precio vs referencia
  switch (a.price_vs_ref) {
    case "below":
      L -= 2; reasons.push({ points: -2, label: "Precio: por debajo" });
      break;
    case "market":
      reasons.push({ points: 0, label: "Precio: a mercado" });
      break;
    case "above":
      L += 8; reasons.push({ points: 8, label: "Precio: por encima" });
      break;
    case "far_above":
      L += 16; reasons.push({ points: 16, label: "Precio: muy por encima", note: "Hype/FOMO o manipulación" });
      break;
  }

  L = clamp(Math.round(L));

  // ---------- Impact ----------
  let I = 25;

  // Tamaño compra
  switch (a.order_size) {
    case "test":
      I += 0;
      break;
    case "small":
      I += 8;
      break;
    case "medium":
      I += 16;
      break;
    case "large":
      I += 26;
      break;
  }

  // Producto
  if (a.product_type === "single") {
    I += 12; // autenticidad/estado
  }

  // ✅ Case suele ser compra grande (impacto)
  if (a.product_type === "case" || a.product_type === "case_blisters") {
    I += 10;
  }

  if (a.sealed_status === "sealed") {
    I -= 3;
  }

  // Recuperabilidad
  if (a.payment_method === "escrow" || a.payment_method === "paypal_gs" || a.payment_method === "card_marketplace") {
    I -= 8;
  } else {
    I += 4;
  }

  I = clamp(Math.round(I));

  // ---------- Total ----------
  const risk = clamp(Math.round(0.65 * L + 0.35 * I));

  // Exposición (position sizing)
  let exposure_pct = 0;
  let band: "NO" | "TEST" | "SMALL" | "MEDIUM" | "STRONG" = "NO";

  if (risk >= 80) { exposure_pct = 0; band = "NO"; }
  else if (risk >= 70) { exposure_pct = 5; band = "TEST"; }
  else if (risk >= 60) { exposure_pct = 10; band = "SMALL"; }
  else if (risk >= 45) { exposure_pct = 20; band = "MEDIUM"; }
  else { exposure_pct = 30; band = "STRONG"; }

  const reasonsSorted = [...reasons]
    .filter((r) => r.points !== 0)
    .sort((x, y) => Math.abs(y.points) - Math.abs(x.points))
    .slice(0, 10);

  return {
    case_id: uid(),
    ...a,
    likelihood: { score: L },
    impact: { score: I },
    risk: { score: risk },
    exposure: {
      recommended_pct: exposure_pct,
      band,
      why: `Exposición ${exposure_pct}% (banda ${band}) porque Riesgo=${risk} (Likelihood=${L}, Impact=${I}).`
    },
    reasons: reasonsSorted,
    created_at: new Date().toISOString()
  };
}