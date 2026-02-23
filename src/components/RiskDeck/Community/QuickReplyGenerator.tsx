"use client";

import React, { useEffect, useMemo, useState } from "react";
import { copyToClipboard } from "@/lib/shareText";

function detectFromComment(text: string) {
  const joined = text.toLowerCase();
  const idMatch = text.match(/\bRD-[A-Z0-9]+\b/i);
  const detectedCaseId = idMatch ? idMatch[0].toUpperCase() : "";
  return { detectedCaseId };
}

export default function QuickReplyGenerator() {
  const [commentInput, setCommentInput] = useState<string>("");
  const [generated, setGenerated] = useState<string>("");

  function generateReply() {
    const { detectedCaseId } = detectFromComment(commentInput);
    if (!detectedCaseId) {
      setGenerated("No detecté Case ID.");
      return;
    }
    setGenerated(`Respuesta para ${detectedCaseId}: Aquí va tu texto…`);
  }

  function handleCopy() {
    copyToClipboard(generated);
    alert("Copiado!");
  }

  return (
    <div className="quick-reply">
      <textarea
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        placeholder="Pega aquí el comentario"
      />

      <button onClick={generateReply}>Generar</button>

      <textarea readOnly value={generated} />

      <button onClick={handleCopy}>Copiar respuesta</button>
    </div>
  );
}