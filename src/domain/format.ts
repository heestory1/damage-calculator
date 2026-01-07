// Helper to format numbers like the HTML does
export function fmt(n: number, digits = 3): string {
  if (isNaN(n) || !isFinite(n)) return "-";
  return n.toFixed(digits);
}

export function parseNum(s: string): number {
  const v = parseFloat(s);
  return isNaN(v) ? 0 : v;
}
