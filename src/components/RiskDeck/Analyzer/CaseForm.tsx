"use client";

import React, { FormEvent, useState } from "react";
import type { AnswersV2 } from "@/lib/riskdeckEngine";
import HelpTip from "@/components/RiskDeck/UI/HelpTip";

export default function CaseForm({ onAnalyze }: { onAnalyze: (data: AnswersV2) => void }) {
  const [form, setForm] = useState<AnswersV2>({
    game: "riftbound",
    product_type: "booster_box",
    sealed_status: "sealed",

    channel: "marketplace",
    platform: "cardmarket",

    payment_method: "paypal_gs",
    seller_rep: "established",

    proof_stock: "no",
    invoice: "no",
    red_flags: "none",

    delivery: "tracked_shipping",
    in_person_safe: "yes",

    price_vs_ref: "market",
    order_size: "small"
  });

  function set<K extends keyof AnswersV2>(key: K, value: AnswersV2[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onAnalyze(form);
  }

  const tip = {
    game: "Qué TCG es (Riftbound / One Piece / Pokémon).",
    product:
      "Qué estás comprando. ‘Master case’ = caja grande de booster boxes. ‘Case de blisters’ = lote grande de blisters.",
    sealed: "Si está sellado (menos variables) o abierto (más riesgo de estado/manipulación).",
    channel: "Dónde compras: tienda (más seguro), marketplace (intermedio), P2P (más riesgo).",
    platform: "Plataforma concreta (Cardmarket/eBay/Wallapop/Discord/otra).",
    pay: "Método de pago y protección: escrow/PayPal G&S/tarjeta suelen permitir disputa; transfer/bizum/crypto casi no.",
    seller: "Reputación del vendedor (verificado/historial/nuevo/desconocido).",
    proof: "Prueba de stock: foto/video con fecha y tu nombre/handle. Reduce estafas.",
    invoice: "Factura/recibo real ayuda a trazabilidad.",
    flags: "Red flags: prisa, presión, inconsistencias, cambios de versión, evasivas.",
    delivery: "Cómo llega: tracking = trazable, sin tracking = más no-entrega, en mano = depende de seguridad.",
    inperson: "En mano seguro = lugar público + abrir/verificar in situ.",
    price: "Precio vs referencia (sin BD): compáralo con listings actuales. Muy por encima suele ser hype/FOMO.",
    size: "Tamaño de compra: cuánto duele si sale mal (Impact)."
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <label>
            Juego <HelpTip text={tip.game} />
          </label>
          <select value={form.game} onChange={(e) => set("game", e.target.value as any)}>
            <option value="riftbound">Riftbound</option>
            <option value="one_piece">One Piece</option>
            <option value="pokemon">Pokémon</option>
          </select>
        </div>

        <div>
          <label>
            Producto <HelpTip text={tip.product} />
          </label>
          <select value={form.product_type} onChange={(e) => set("product_type", e.target.value as any)}>
            <option value="booster_box">Booster Box</option>
            <option value="case">Master case (caja de booster boxes)</option>
            <option value="case_blisters">Case de blisters (lote grande)</option>
            <option value="blister">Blister</option>
            <option value="starter_deck">Starter/Deck</option>
            <option value="single">Single</option>
          </select>
        </div>

        <div>
          <label>
            Sellado <HelpTip text={tip.sealed} />
          </label>
          <select value={form.sealed_status} onChange={(e) => set("sealed_status", e.target.value as any)}>
            <option value="sealed">Sellado</option>
            <option value="opened">Abierto</option>
          </select>
        </div>

        <hr style={{ opacity: 0.18 }} />

        <div>
          <label>
            Canal (dónde compras) <HelpTip text={tip.channel} />
          </label>
          <select value={form.channel} onChange={(e) => set("channel", e.target.value as any)}>
            <option value="store">Tienda</option>
            <option value="marketplace">Marketplace</option>
            <option value="p2p">P2P (Discord/Telegram/DM)</option>
          </select>
        </div>

        <div>
          <label>
            Plataforma <HelpTip text={tip.platform} />
          </label>
          <select value={form.platform} onChange={(e) => set("platform", e.target.value as any)}>
            <option value="cardmarket">Cardmarket</option>
            <option value="ebay">eBay</option>
            <option value="wallapop">Wallapop</option>
            <option value="discord">Discord/DM</option>
            <option value="other">Otra</option>
          </select>
        </div>

        <hr style={{ opacity: 0.18 }} />

        <div>
          <label>
            Método de pago (protección) <HelpTip text={tip.pay} />
          </label>
          <select value={form.payment_method} onChange={(e) => set("payment_method", e.target.value as any)}>
            <option value="paypal_gs">PayPal G&amp;S (disputa)</option>
            <option value="card_marketplace">Tarjeta dentro del marketplace</option>
            <option value="escrow">Escrow</option>
            <option value="paypal_ff">PayPal F&amp;F</option>
            <option value="bank_transfer">Transferencia</option>
            <option value="bizum">Bizum</option>
            <option value="cash">Efectivo</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>

        <div>
          <label>
            Reputación del vendedor <HelpTip text={tip.seller} />
          </label>
          <select value={form.seller_rep} onChange={(e) => set("seller_rep", e.target.value as any)}>
            <option value="verified">Verificado</option>
            <option value="established">Historial medio</option>
            <option value="new">Nuevo</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>

        <hr style={{ opacity: 0.18 }} />

        <div>
          <label>
            Prueba de stock (foto/video con fecha) <HelpTip text={tip.proof} />
          </label>
          <select value={form.proof_stock} onChange={(e) => set("proof_stock", e.target.value as any)}>
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label>
            Factura/recibo <HelpTip text={tip.invoice} />
          </label>
          <select value={form.invoice} onChange={(e) => set("invoice", e.target.value as any)}>
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label>
            Red flags <HelpTip text={tip.flags} />
          </label>
          <select value={form.red_flags} onChange={(e) => set("red_flags", e.target.value as any)}>
            <option value="none">Ninguna</option>
            <option value="mild">Leves</option>
            <option value="strong">Fuertes</option>
          </select>
        </div>

        <hr style={{ opacity: 0.18 }} />

        <div>
          <label>
            Entrega <HelpTip text={tip.delivery} />
          </label>
          <select value={form.delivery} onChange={(e) => set("delivery", e.target.value as any)}>
            <option value="tracked_shipping">Envío con tracking</option>
            <option value="untracked_shipping">Envío sin tracking</option>
            <option value="in_person">En mano</option>
          </select>
        </div>

        {form.delivery === "in_person" && (
          <div>
            <label>
              En mano: lugar público + verificación in situ <HelpTip text={tip.inperson} />
            </label>
            <select value={form.in_person_safe} onChange={(e) => set("in_person_safe", e.target.value as any)}>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        )}

        <hr style={{ opacity: 0.18 }} />

        <div>
          <label>
            Precio vs referencia <HelpTip text={tip.price} />
          </label>
          <select value={form.price_vs_ref} onChange={(e) => set("price_vs_ref", e.target.value as any)}>
            <option value="below">Por debajo</option>
            <option value="market">A mercado</option>
            <option value="above">Por encima</option>
            <option value="far_above">Muy por encima</option>
          </select>
        </div>

        <div>
          <label>
            Tamaño de compra <HelpTip text={tip.size} />
          </label>
          <select value={form.order_size} onChange={(e) => set("order_size", e.target.value as any)}>
            <option value="test">Test</option>
            <option value="small">Pequeño</option>
            <option value="medium">Medio</option>
            <option value="large">Grande</option>
          </select>
        </div>

        <button type="submit">Analizar</button>
      </div>
    </form>
  );
}