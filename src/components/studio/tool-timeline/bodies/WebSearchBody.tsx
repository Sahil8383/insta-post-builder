"use client";

import { useMemo } from "react";
import type { ToolBodyPresentation } from "../tool-body-presentation";
import { FieldBlock } from "../Shared";

type Props = {
  args: Record<string, unknown> | null;
  result: string | undefined;
  presentation?: ToolBodyPresentation;
};

export function WebSearchBody({
  args,
  result,
  presentation = "rich",
}: Props) {
  const query = typeof args?.query === "string" ? args.query : null;
  const notes = result ?? "";
  const blocks = useMemo(() => {
    const body = notes
      .replace(/^Research notes:\s*/i, "")
      .replace(/^Sources:\s*/i, "")
      .trim();
    const chunks = body.split(/\n(?=- )/).filter(Boolean);
    return chunks.map((chunk) => chunk.replace(/^\s*-\s*/, "").trim());
  }, [notes]);

  if (presentation === "compact") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {query ? (
          <p>
            <span className="text-zinc-500 dark:text-zinc-400">Query: </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {query}
            </span>
          </p>
        ) : null}
        {result ? (
          blocks.length > 0 ? (
            <div className="space-y-3">
              {blocks.map((block, i) => {
                const lines = block.split("\n").map((l) => l.trim());
                const title = lines[0] ?? block;
                const rest = lines.slice(1);
                const urlLine = rest.find((l) => /^https?:\/\//i.test(l));
                const snippet = rest.filter((l) => l !== urlLine).join("\n");
                return (
                  <div key={`${i}-${title.slice(0, 24)}`} className="space-y-1">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {title}
                    </p>
                    {snippet ? (
                      <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                        {snippet}
                      </p>
                    ) : null}
                    {urlLine ? (
                      <a
                        href={urlLine}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block max-w-full truncate text-violet-600 underline-offset-2 hover:underline dark:text-violet-400"
                      >
                        {urlLine}
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {notes}
            </p>
          )
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {query && (
        <FieldBlock label="Search query">
          <p className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2 font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
            {query}
          </p>
        </FieldBlock>
      )}
      {result && (
        <FieldBlock label="Results">
          <div className="space-y-2">
            {blocks.length > 0 ? (
              blocks.map((block, i) => {
                const lines = block.split("\n").map((l) => l.trim());
                const title = lines[0] ?? block;
                const rest = lines.slice(1);
                const urlLine = rest.find((l) => /^https?:\/\//i.test(l));
                const snippet = rest.filter((l) => l !== urlLine).join("\n");
                return (
                  <div
                    key={`${i}-${title.slice(0, 24)}`}
                    className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-2.5 text-xs dark:border-zinc-700 dark:bg-zinc-900/50"
                  >
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {title}
                    </div>
                    {snippet ? (
                      <p className="mt-1.5 leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {snippet}
                      </p>
                    ) : null}
                    {urlLine ? (
                      <a
                        href={urlLine}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block max-w-full truncate text-violet-600 underline-offset-2 hover:underline dark:text-violet-400"
                      >
                        {urlLine}
                      </a>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-2 text-xs dark:border-zinc-700 dark:bg-zinc-950">
                {notes}
              </pre>
            )}
          </div>
        </FieldBlock>
      )}
    </div>
  );
}
