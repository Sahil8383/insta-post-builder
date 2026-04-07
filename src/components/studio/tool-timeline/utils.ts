import { isRecord, tryParseJson } from "./json";

/** True when finished tool result JSON includes a non-empty `error` field. */
export function toolResultLooksFailed(resultPreview: string | undefined): boolean {
  if (resultPreview == null || !String(resultPreview).trim()) return false;
  const parsed = tryParseJson(resultPreview);
  if (!isRecord(parsed)) return false;
  const err = parsed.error;
  return err != null && String(err).length > 0;
}
