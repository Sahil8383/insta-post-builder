import { tryParseJson } from "../json";

type Props = { resultText: string | undefined };

export function GenerateImageBody({ resultText }: Props) {
  const parsed = tryParseJson(resultText) as Record<string, unknown> | null;
  if (!parsed) {
    return (
      <pre className="max-h-32 overflow-auto whitespace-pre-wrap text-xs">
        {resultText}
      </pre>
    );
  }
  if ("error" in parsed && parsed.error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        {String(parsed.error)}
      </div>
    );
  }
  const url = typeof parsed.image_url === "string" ? parsed.image_url : "";
  const prompt =
    typeof parsed.revised_prompt === "string" ? parsed.revised_prompt : "";
  return (
    <div className="space-y-2">
      {url ? (
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Generated"
            className="max-h-48 w-full object-cover"
          />
        </div>
      ) : null}
      {prompt ? (
        <details className="text-xs">
          <summary className="cursor-pointer text-zinc-500">Prompt used</summary>
          <pre className="mt-2 max-h-24 overflow-auto whitespace-pre-wrap rounded bg-zinc-100 p-2 dark:bg-zinc-900">
            {prompt.slice(0, 1200)}
            {prompt.length > 1200 ? "…" : ""}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
