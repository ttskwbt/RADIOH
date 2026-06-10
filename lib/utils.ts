export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function countChars(text: string): number {
  return [...text].length;
}

/** 1行あたりの目安文字数（全角換算の簡易推定） */
export function estimateLines(text: string, charsPerLine = 28): number {
  if (!text) return 0;
  const lines = text.split("\n");
  return lines.reduce((sum, line) => {
    const len = countChars(line);
    return sum + Math.max(1, Math.ceil(len / charsPerLine));
  }, 0);
}
