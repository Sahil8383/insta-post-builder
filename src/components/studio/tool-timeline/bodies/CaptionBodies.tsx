import type { ToolBodyPresentation } from "../tool-body-presentation";
import { FieldBlock, HashtagRow, KeyValueGrid } from "../Shared";

type Args = Record<string, unknown> | null;

export function WriteCaptionBody({
  args,
  result,
  presentation = "rich",
}: {
  args: Args;
  result: string | undefined;
  presentation?: ToolBodyPresentation;
}) {
  if (presentation === "compact") {
    const slim =
      args &&
      ({
        topic: args.topic,
        tone: args.tone,
        target_audience: args.target_audience,
      } as Record<string, unknown>);
    const slimKeys = slim ? Object.keys(slim).filter((k) => slim[k] != null) : [];
    return (
      <div className="space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {slimKeys.length > 0 ? (
          <p className="whitespace-pre-wrap font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {JSON.stringify(
              Object.fromEntries(slimKeys.map((k) => [k, slim![k]])),
              null,
              2,
            )}
          </p>
        ) : null}
        {result ? (
          <p className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-100">
            {result}
          </p>
        ) : null}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {args && <KeyValueGrid data={args} />}
      {result && (
        <FieldBlock label="Caption">
          <div className="rounded-lg border border-violet-200/60 bg-violet-50/40 px-3 py-2.5 text-sm leading-relaxed text-zinc-800 dark:border-violet-900/40 dark:bg-violet-950/20 dark:text-zinc-100">
            <p className="whitespace-pre-wrap">{result}</p>
          </div>
        </FieldBlock>
      )}
    </div>
  );
}

export function PickHashtagsBody({
  args,
  result,
  presentation = "rich",
}: {
  args: Args;
  result: string | undefined;
  presentation?: ToolBodyPresentation;
}) {
  if (presentation === "compact") {
    return result ? <HashtagRow text={result} /> : null;
  }
  const pickFields =
    args &&
    (Object.fromEntries(
      Object.entries(args).filter(([k]) =>
        ["topic", "caption"].includes(k),
      ),
    ) as Record<string, unknown>);
  const showArgs =
    pickFields && Object.keys(pickFields).length > 0 ? pickFields : args;

  return (
    <div className="space-y-3">
      {showArgs && Object.keys(showArgs).length > 0 && (
        <FieldBlock label="Based on">
          <KeyValueGrid data={showArgs} />
        </FieldBlock>
      )}
      {result && (
        <FieldBlock label="Hashtags">
          <HashtagRow text={result} />
        </FieldBlock>
      )}
    </div>
  );
}

export function CritiqueCaptionBody({
  result,
  presentation = "rich",
}: {
  result: string | undefined;
  presentation?: ToolBodyPresentation;
}) {
  if (presentation === "compact") {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {result ?? "—"}
      </p>
    );
  }
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950">
      <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        {result ?? "—"}
      </pre>
    </div>
  );
}
