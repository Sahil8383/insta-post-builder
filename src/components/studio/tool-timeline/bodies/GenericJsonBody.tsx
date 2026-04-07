import type { ToolBodyPresentation } from "../tool-body-presentation";
import { FieldBlock, KeyValueGrid } from "../Shared";
import { tryParseJson } from "../json";

type Props = {
  args: Record<string, unknown> | null;
  result: string | undefined;
  presentation?: ToolBodyPresentation;
};

export function GenericJsonBody({
  args,
  result,
  presentation = "rich",
}: Props) {
  const resultParsed = tryParseJson(result);

  if (presentation === "compact") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {args && Object.keys(args).length > 0 ? (
          <p className="whitespace-pre-wrap font-mono text-xs">
            {JSON.stringify(args, null, 2)}
          </p>
        ) : null}
        {result ? (
          Array.isArray(resultParsed) || typeof resultParsed === "object" ? (
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-2 text-xs dark:border-zinc-700 dark:bg-zinc-950">
              {JSON.stringify(resultParsed, null, 2)}
            </pre>
          ) : (
            <p className="whitespace-pre-wrap">{result}</p>
          )
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {args && Object.keys(args).length > 0 && (
        <FieldBlock label="Input">
          <KeyValueGrid data={args} />
        </FieldBlock>
      )}
      {result && (
        <FieldBlock label="Output">
          {Array.isArray(resultParsed) ? (
            <pre className="max-h-48 overflow-auto rounded-lg border border-zinc-200 bg-white p-2 text-xs dark:border-zinc-700 dark:bg-zinc-950">
              {JSON.stringify(resultParsed, null, 2)}
            </pre>
          ) : typeof resultParsed === "object" && resultParsed !== null ? (
            <KeyValueGrid data={resultParsed as Record<string, unknown>} />
          ) : (
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-2 text-xs dark:border-zinc-700 dark:bg-zinc-950">
              {result}
            </pre>
          )}
        </FieldBlock>
      )}
    </div>
  );
}
