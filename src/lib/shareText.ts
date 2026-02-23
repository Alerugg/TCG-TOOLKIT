export async function copyToClipboard(text: string): Promise<{ ok: boolean }> {
  try {
    await navigator.clipboard.writeText(String(text ?? ""));
    return { ok: true };
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = String(text ?? "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return { ok: Boolean(ok) };
    } catch {
      return { ok: false };
    }
  }
}