"use client";

import styles from "../riskdeck.module.css";
import CompareCases from "@/components/RiskDeck/Compare/CompareCases";

export default function RiskDeckCompare() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.scope}>
          <h1 className={styles.h1}>Comparar Casos</h1>
          <p className={styles.subtitle}>
            Selecciona Caso A y Caso B, elige perfil y exporta el card.
          </p>

          <div className={styles.card}>
            <CompareCases />
          </div>
        </div>
      </div>
    </main>
  );
}