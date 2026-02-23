"use client";

import React, { useId, useState } from "react";

export default function HelpTip({ text }: { text: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span style={{ position: "relative", display: "inline-flex", marginLeft: 8 }}>
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.25)",
          background: "rgba(0,0,0,0.25)",
          color: "rgba(255,255,255,0.85)",
          fontWeight: 900,
          fontSize: 12,
          lineHeight: "18px",
          cursor: "pointer"
        }}
      >
        ?
      </button>

      {open && (
        <div
          id={id}
          role="tooltip"
          style={{
            position: "absolute",
            top: "125%",
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: 240,
            maxWidth: 320,
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(15,18,30,0.98)",
            color: "rgba(255,255,255,0.92)",
            fontSize: 12,
            lineHeight: 1.35,
            boxShadow: "0 12px 34px rgba(0,0,0,0.45)",
            zIndex: 50
          }}
        >
          {text}
        </div>
      )}
    </span>
  );
}