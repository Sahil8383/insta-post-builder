export function tryParseJson(s: string | undefined): unknown {
  if (s == null || !String(s).trim()) return null;
  try {
    return JSON.parse(s) as unknown;
  } catch {
    return null;
  }
}

export function isRecord(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}
