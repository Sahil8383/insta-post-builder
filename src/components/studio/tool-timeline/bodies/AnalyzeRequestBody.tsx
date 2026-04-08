import type { ToolBodyPresentation } from "../tool-body-presentation";
import { FieldBlock } from "../Shared";
import { isRecord, tryParseJson } from "../json";

type Props = {
  args: Record<string, unknown> | null;
  result: string | undefined;
  presentation?: ToolBodyPresentation;
};

/**
 * Backend streams a compact text plan (Intent / Web search / Plan) or JSON on failure.
 */
export function AnalyzeRequestBody({
  args,
  result,
  presentation = "rich",
}: Props) {
  const summary = typeof args?.user_request === "string" ? args.user_request : null;
  const text = (result ?? "").trim();

  const parsed = tryParseJson(text);
  const jsonError =
    isRecord(parsed) && parsed.error != null
      ? String(parsed.error)
      : null;

  if (jsonError) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        {jsonError}
      </div>
    );
  }

  if (presentation === "compact") {
    return (
      <div className="space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {summary ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Request:{" "}
            </span>
            {summary.length > 160 ? `${summary.slice(0, 160)}…` : summary}
          </p>
        ) : null}
        {text ? (
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
            {text}
          </pre>
        ) : (
          <p className="text-xs text-zinc-500">Waiting for plan…</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {summary ? (
        <FieldBlock label="User request">
          <p className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
            {summary}
          </p>
        </FieldBlock>
      ) : null}
      {text ? (
        <FieldBlock label="Plan">
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-violet-200/60 bg-violet-50/30 px-3 py-2.5 font-sans text-xs leading-relaxed text-zinc-800 dark:border-violet-900/40 dark:bg-violet-950/20 dark:text-zinc-100">
            {text}
          </pre>
        </FieldBlock>
      ) : (
        <p className="text-xs text-zinc-500">Waiting for plan…</p>
      )}
    </div>
  );
}
