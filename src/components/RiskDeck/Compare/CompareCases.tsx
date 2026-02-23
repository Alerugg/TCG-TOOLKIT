"use client";

import React, { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import CompareShareCard from "./CompareShareCard";
import { copyToClipboard } from "@/lib/shareText";
import { preference, verdict, type Profile } from "@/lib/compareUtils";
import { compareDecision, decideMode } from "@/lib/decisionUtils";

type CaseSnap = {
  case_id: string;
  game?: string;
  product_type?: string;
  risk?: { score?: number };
  negotiation?: { score?: number };
  accumulation?: { score?: number };
  confidence?: { score?: number };
  phase_applied?: string;
  phase_adjusted?: boolean;
  signals?: string[];
  exposure?: {
    recommended_pct?: number;
    plan?: { summary?: string; steps?: Array<{ step: string; trigger: string }> };
  };
};

export default function CompareCases() {
  // Si aún no estás cargando casos reales, puedes dejarlo vacío.
  // Luego lo conectamos con tus casos recientes.
  const [caseList] = useState<CaseSnap[]>([]);

  const [aId, setAId] = useState<string>(caseList[0]?.case_id ?? "");
  const [bId, setBId] = useState<string>(caseList[1]?.case_id ?? "");
  const [profile, setProfile] = useState<Profile>("equilibrado");
  const [scriptStyle, setScriptStyle] = useState<"educador" | "analista" | "debate">("educador");

  const shareFeedRef = useRef<HTMLDivElement>(null);
  const shareStoryRef = useRef<HTMLDivElement>(null);

  const snapA = useMemo(() => caseList.find((c) => c.case_id === aId) ?? null, [caseList, aId]);
  const snapB = useMemo(() => caseList.find((c) => c.case_id === bId) ?? null, [caseList, bId]);

  const pref = useMemo(() => (snapA && snapB ? preference(snapA, snapB, profile) : null), [snapA, snapB, profile]);
  const ver = useMemo(() => (snapA && snapB ? verdict(snapA, snapB, profile) : null), [snapA, snapB, profile]);
  const dec = useMemo(() => (snapA && snapB ? compareDecision(snapA, snapB) : null), [snapA, snapB]);

  const winnerLabel = useMemo(() => {
    if (!pref) return "";
    if (pref.aPct === pref.bPct) return "Empate";
    return pref.aPct > pref.bPct ? "A" : "B";
  }, [pref]);

  const shortScript = useMemo(() => {
    if (!snapA || !snapB || !pref) return "";

    const winner = pref.aPct === pref.bPct ? "Empate" : pref.aPct > pref.bPct ? "Caso A" : "Caso B";
    const winPct = Math.max(pref.aPct, pref.bPct);

    if (scriptStyle === "analista") {
      return [
        "Hook:",
        `Comparativa técnica (perfil ${profile}).`,
        "",
        `A: Riesgo ${snapA.risk?.score ?? "—"}, Neg ${snapA.negotiation?.score ?? "—"}, Acc ${snapA.accumulation?.score ?? "—"}`,
        `B: Riesgo ${snapB.risk?.score ?? "—"}, Neg ${snapB.negotiation?.score ?? "—"}, Acc ${snapB.accumulation?.score ?? "—"}`,
        "",
        "Resultado:",
        `Preferencia: ${winner} con ${winPct}%.`,
        "",
        "Cierre: Deja tu Case ID."
      ].join("\n");
    }

    if (scriptStyle === "debate") {
      return [
        "Hook: La mayoría suele elegir mal.",
        `Sistema prefiere ${winner} (${winPct}%).`,
        "",
        "Pregunta: ¿Tú cuál eliges?"
      ].join("\n");
    }

    return [
      "Hook: ¿Qué elegir?",
      `Sistema prefiere ${winner} con ${winPct}%.`,
      "",
      "Datos clave:",
      `A: Riesgo ${snapA.risk?.score ?? "—"}, Acc ${snapA.accumulation?.score ?? "—"}`,
      `B: Riesgo ${snapB.risk?.score ?? "—"}, Acc ${snapB.accumulation?.score ?? "—"}`,
      "",
      "Cierre: Deja tu Case ID."
    ].join("\n");
  }, [snapA, snapB, pref, profile, scriptStyle]);

  async function doCopy(text: string) {
    const r = await copyToClipboard(text);
    if (!r.ok) alert("No se pudo copiar");
  }

  async function exportPng(which: "feed" | "story") {
    const ref = which === "feed" ? shareFeedRef.current : shareStoryRef.current;
    if (!ref) return;

    // html-to-image genera PNG desde un nodo DOM (HTMLElement). :contentReference[oaicite:1]{index=1}
    const dataUrl = await toPng(ref, { cacheBust: true, pixelRatio: 2 });
    const a = document.createElement("a");
    a.download = which === "feed" ? "compare-feed.png" : "compare-story.png";
    a.href = dataUrl;
    a.click();
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <div>
          <label>Perfil</label>
          <select value={profile} onChange={(e) => setProfile(e.target.value as Profile)}>
            <option value="equilibrado">Equilibrado</option>
            <option value="conservador">Conservador</option>
            <option value="flipper">Flipper</option>
          </select>
        </div>

        <div>
          <label>Estilo guion</label>
          <select value={scriptStyle} onChange={(e) => setScriptStyle(e.target.value as any)}>
            <option value="educador">Educador</option>
            <option value="analista">Analista</option>
            <option value="debate">Debate</option>
          </select>
        </div>

        <div>
          <label>Caso A</label>
          <select value={aId} onChange={(e) => setAId(e.target.value)}>
            <option value="" disabled>Selecciona…</option>
            {caseList.map((c) => (
              <option key={c.case_id} value={c.case_id}>
                {c.case_id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Caso B</label>
          <select value={bId} onChange={(e) => setBId(e.target.value)}>
            <option value="" disabled>Selecciona…</option>
            {caseList.map((c) => (
              <option key={c.case_id} value={c.case_id}>
                {c.case_id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!snapA || !snapB ? (
        <div style={{ opacity: 0.8 }}>Crea/inyecta casos para comparar (A y B).</div>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <div><b>Preferencia:</b> A {pref?.aPct}% · B {pref?.bPct}%</div>
            {ver && <div><b>Veredicto:</b> {ver.winner === "tie" ? "Empate" : `Gana ${ver.winner}`} — {ver.text}</div>}
            {dec && (
              <div>
                <b>Acción:</b> {dec.best === "tie" ? "Parejos" : `Mejor ${dec.best}`} · A: {decideMode(snapA).mode} / B: {decideMode(snapB).mode}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <button onClick={() => doCopy(shortScript)}>Copiar guion</button>
            <button onClick={() => exportPng("feed")}>Imagen Feed</button>
            <button onClick={() => exportPng("story")}>Imagen Story</button>
          </div>

          {/* Hidden export nodes */}
          <div style={{ position: "absolute", left: -99999, top: -99999 }}>
            <CompareShareCard
              ref={shareFeedRef}
              a={snapA}
              b={snapB}
              pref={pref}
              winnerLabel={winnerLabel}
              profile={profile}
              format="feed"
            />
            <CompareShareCard
              ref={shareStoryRef}
              a={snapA}
              b={snapB}
              pref={pref}
              winnerLabel={winnerLabel}
              profile={profile}
              format="story"
            />
          </div>
        </>
      )}
    </div>
  );
}