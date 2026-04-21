"use client";

import { Check, CircleAlert, Loader2 } from "lucide-react";
import type { ToolCallEntry } from "@/types/agent-stream";
import { toolHeading } from "./meta";
import {
  describeNonWebTool,
  extractUrlsFromText,
} from "./simpleToolDescriptions";
import { toolResultLooksFailed } from "./utils";

const NO_DESCRIPTION_TOOLS = new Set(["submit_post_package", "submit_insights"]);

type Props = { tools: ToolCallEntry[] };

export function SimpleToolList({ tools }: Props) {
  if (tools.length === 0) return null;
  return (
    <ul className="flex w-full max-w-[95%] flex-col gap-2 self-start">
      {tools.map((t) => (
        <SimpleToolRow key={t.id} tool={t} />
      ))}
    </ul>
  );
}

function SimpleToolRow({ tool }: { tool: ToolCallEntry }) {
  const { label } = toolHeading(tool.name);
  const running = tool.status === "running";
  const result = tool.resultPreview ?? "";
  const failed = !running && toolResultLooksFailed(result);
  const skipDesc = NO_DESCRIPTION_TOOLS.has(tool.name);

  return (
    <li className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-900/50">
      <div className="flex min-w-0 items-center gap-2">
        {running ? (
          <Loader2
            className="size-4 shrink-0 animate-spin text-violet-600 dark:text-violet-400"
            aria-hidden
          />
        ) : failed ? (
          <CircleAlert
            className="size-4 shrink-0 text-red-600 dark:text-red-400"
            aria-hidden
          />
        ) : (
          <Check
            className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
        )}
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </span>
        <span className="shrink-0 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
          {running ? "Loading" : failed ? "Failed" : "Complete"}
        </span>
      </div>
      {!running && !skipDesc ? (
        <ToolDescription tool={tool} failed={failed} />
      ) : null}
    </li>
  );
}

function ToolDescription({
  tool,
  failed,
}: {
  tool: ToolCallEntry;
  failed: boolean;
}) {
  if (failed) {
    return (
      <p className="mt-2 text-xs text-red-700 dark:text-red-300">
        Tool returned an error. Try again or adjust your request.
      </p>
    );
  }

  if (tool.name === "web_search") {
    const raw = (tool.resultPreview ?? "").trim();
    const urls = extractUrlsFromText(raw);
    if (urls.length > 0) {
      return (
        <ul className="mt-2 space-y-1 border-t border-zinc-100 pt-2 dark:border-zinc-800">
          {urls.map((u) => (
            <li key={u} className="min-w-0">
              <a
                href={u}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-xs text-violet-600 underline-offset-2 hover:underline dark:text-violet-400"
              >
                {u}
              </a>
            </li>
          ))}
        </ul>
      );
    }
    if (!raw) return null;
    const line = raw.replace(/\s+/g, " ");
    return (
      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
        {line.length > 140 ? `${line.slice(0, 137)}…` : line}
      </p>
    );
  }

  const desc = describeNonWebTool(tool);
  if (!desc) return null;
  return (
    <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
      {desc}
    </p>
  );
}
