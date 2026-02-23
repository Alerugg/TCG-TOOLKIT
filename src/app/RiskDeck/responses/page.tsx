"use client";

import styles from "../riskdeck.module.css";
import QuickReplyGenerator from "@/components/RiskDeck/Community/QuickReplyGenerator";

export default function RiskDeckResponses() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.scope}>
          <h1 className={styles.h1}>Respuestas Rápidas</h1>
          <p className={styles.subtitle}>Pega un comentario y genera una respuesta editable.</p>

          <div className={styles.card}>
            <QuickReplyGenerator />
          </div>
        </div>
      </div>
    </main>
  );
}