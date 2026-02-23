"use client";

import { useState } from "react";
import styles from "../riskdeck.module.css";

import CaseForm from "@/components/RiskDeck/Analyzer/CaseForm";
import ResultPanel from "@/components/RiskDeck/Analyzer/ResultPanel";
import { runAnalysis } from "@/lib/riskdeckEngine";

export default function RiskDeckAnalyze() {
  const [result, setResult] = useState<any>(null);

  function handleAnalyze(data: any) {
    const r = runAnalysis(data);
    setResult(r);
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.scope}>
          <h1 className={styles.h1}>Analizar Caso</h1>
          <p className={styles.subtitle}>Genera un caso y revisa riesgo / acumulación / plan.</p>

          <div className={styles.card}>
            <CaseForm onAnalyze={handleAnalyze} />
          </div>

          <div className={styles.spacer} />

          <div className={styles.card}>
            <ResultPanel result={result} />
          </div>
        </div>
      </div>
    </main>
  );
}