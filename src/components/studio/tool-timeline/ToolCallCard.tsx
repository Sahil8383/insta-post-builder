"use client";

import { useState } from "react";
import {
  CircleAlert,
  CircleCheck,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import type { ToolCallEntry } from "@/types/agent-stream";
import { toolHeading } from "./meta";
import { ToolCallBody } from "./ToolCallBody";
import { toolResultLooksFailed } from "./utils";

const RAW_HIDDEN_TOOLS = new Set(["submit_post_package", "submit_insights"]);

type Props = { tool: ToolCallEntry };

function ToolStateIcon({
  running,
  failed,
}: {
  running: boolean;
  failed: boolean;
}) {
  if (running) {
    return (
      <Loader2
        className="size-4 shrink-0 animate-spin text-amber-600 dark:text-amber-400"
        aria-hidden
      />
    );
  }
  if (failed) {
    return (
      <CircleAlert
        className="size-4 shrink-0 text-red-600 dark:text-red-400"
        aria-hidden
      />
    );
  }
  return (
    <CircleCheck
      className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
      aria-hidden
    />
  );
}

function RawPayloadSection({
  rawOpen,
  setRawOpen,
  rawArgs,
  rawResult,
}: {
  rawOpen: boolean;
  setRawOpen: (v: boolean | ((b: boolean) => boolean)) => void;
  rawArgs: string;
  rawResult: string;
}) {
  if (!rawArgs && !rawResult) return null;
  return (
    <div className="border-t border-zinc-100 pt-2 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setRawOpen((o) => !o)}
        className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        {rawOpen ? "Hide raw payloads" : "Raw JSON / text"}
      </button>
      {rawOpen ? (
        <div className="mt-2 space-y-2">
          {rawArgs ? (
            <pre className="max-h-36 overflow-auto rounded-lg bg-zinc-100 p-2 text-[10px] leading-snug text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              {rawArgs}
            </pre>
          ) : null}
          {rawResult ? (
            <pre className="max-h-36 overflow-auto rounded-lg bg-zinc-100 p-2 text-[10px] leading-snug text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              {rawResult.length > 6000
                ? `${rawResult.slice(0, 6000)}…`
                : rawResult}
            </pre>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function ToolCallCard({ tool }: Props) {
  const [rawOpen, setRawOpen] = useState(false);
  const { label } = toolHeading(tool.name);
  const running = tool.status === "running";
  const rawArgs =
    tool.argsPreview ?? (tool.argumentBuffer.trim() ? tool.argumentBuffer : "");
  const rawResult = tool.resultPreview ?? "";
  const showRawToggle = !RAW_HIDDEN_TOOLS.has(tool.name);
  const failed = !running && toolResultLooksFailed(rawResult);

  const bodyIdle =
    running && !rawArgs && !rawResult && tool.name !== "generate_image";

  if (tool.name === "generate_image") {
    return (
      <article
        className="overflow-hidden rounded-xl border border-zinc-200/90 bg-linear-to-b from-zinc-50/90 to-white shadow-sm dark:border-zinc-700/90 dark:from-zinc-900/80 dark:to-zinc-950/90"
        aria-label={`${label} tool`}
      >
        <div className="flex items-start gap-2 border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-800/80">
          <ImageIcon
            className="mt-0.5 size-5 shrink-0 text-zinc-600 dark:text-zinc-300"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {label}
              </h3>
              <ToolStateIcon running={running} failed={failed} />
            </div>
            <p className="mt-0.5 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
              {tool.name}
            </p>
          </div>
        </div>
        <div className="space-y-3 px-3 py-3">
          {running && !rawArgs && !rawResult ? (
            <p className="text-xs text-zinc-500">Preparing tool input…</p>
          ) : (
            <ToolCallBody tool={tool} />
          )}
          {(rawArgs || rawResult) && showRawToggle ? (
            <RawPayloadSection
              rawOpen={rawOpen}
              setRawOpen={setRawOpen}
              rawArgs={rawArgs}
              rawResult={rawResult}
            />
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article
      className="rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-3 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-950/60"
      aria-label={`${label} tool`}
    >
      <div className="flex w-full min-w-0 items-start gap-2">
        <span
          className="shrink-0 pt-0.5 text-zinc-400 dark:text-zinc-500"
          aria-hidden
        >
          →
        </span>
        <ToolStateIcon running={running} failed={failed} />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
            {label}
          </h3>
          <p className="mt-0.5 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
            {tool.name}
          </p>
        </div>
      </div>
      <div className="mt-3 pl-7">
        {bodyIdle ? (
          <p className="text-xs text-zinc-500">Preparing tool input…</p>
        ) : (
          <ToolCallBody tool={tool} presentation="compact" />
        )}
        {(rawArgs || rawResult) && showRawToggle ? (
          <RawPayloadSection
            rawOpen={rawOpen}
            setRawOpen={setRawOpen}
            rawArgs={rawArgs}
            rawResult={rawResult}
          />
        ) : null}
      </div>
    </article>
  );
}
