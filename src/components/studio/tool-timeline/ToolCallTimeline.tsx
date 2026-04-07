"use client";

import type { ToolCallEntry } from "@/types/agent-stream";
import { ToolCallCard } from "./ToolCallCard";

type Props = { tools: ToolCallEntry[] };

export function ToolCallTimeline({ tools }: Props) {
  if (tools.length === 0) return null;
  return (
    <div className="flex w-full max-w-[95%] flex-col gap-4 self-start">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Agent steps
      </div>
      <ol className="flex flex-col gap-4">
        {tools.map((t) => (
          <li key={t.id}>
            <ToolCallCard tool={t} />
          </li>
        ))}
      </ol>
    </div>
  );
}
