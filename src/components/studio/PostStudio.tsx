"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { streamPostGeneration } from "@/lib/streamPostGeneration";

const AgentCanvas = dynamic(
  () =>
    import("@/components/flow/AgentCanvas").then((m) => ({
      default: m.AgentCanvas,
    })),
  { ssr: false, loading: () => <CanvasPlaceholder /> },
);

function CanvasPlaceholder() {
  return (
    <div className="flex min-h-[480px] w-full items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
      Loading canvas…
    </div>
  );
}

export function PostStudio() {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const feedCanvasHtml = useAppSelector((s) => s.agent.feedCanvasHtml);
  const phase = useAppSelector((s) => s.agent.phase);
  const reasoningText = useAppSelector((s) => s.agent.reasoningText);
  const sessionSummary = useAppSelector((s) => s.agent.sessionSummary);
  const errorMessage = useAppSelector((s) => s.agent.errorMessage);
  const postId = useAppSelector((s) => s.agent.postId);
  const toolCalls = useAppSelector((s) => s.agent.toolCallsById);

  const [query, setQuery] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const onGenerate = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    void streamPostGeneration(
      dispatch,
      () => store.getState(),
      { query: q },
      ac.signal,
    );
  }, [dispatch, query, store]);

  const onAbort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
      <section className="flex min-w-0 flex-1 flex-col gap-3 md:max-w-md">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Agent stream
        </h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Query</span>
          <textarea
            className="min-h-[100px] rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the post you want…"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={phase === "streaming" || !query.trim()}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {phase === "streaming" ? "Generating…" : "Generate (stream)"}
          </button>
          <button
            type="button"
            onClick={onAbort}
            disabled={phase !== "streaming"}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600"
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          Set{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            NEXT_PUBLIC_API_BASE_URL
          </code>{" "}
          in{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            .env.local
          </code>{" "}
          (e.g. http://localhost:8000).
        </p>
        {postId != null && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Post id: <strong>{postId}</strong>
          </p>
        )}
        {sessionSummary && (
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="font-medium text-zinc-700 dark:text-zinc-300">
              Summary
            </div>
            <p className="mt-1 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
              {sessionSummary}
            </p>
          </div>
        )}
        {errorMessage && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Tool activity
          </div>
          <ul className="max-h-40 overflow-auto rounded-md border border-zinc-200 text-xs dark:border-zinc-700">
            {Object.values(toolCalls).length === 0 ? (
              <li className="px-2 py-2 text-zinc-400">No tools yet</li>
            ) : (
              Object.values(toolCalls).map((t) => (
                <li
                  key={t.id}
                  className="border-b border-zinc-100 px-2 py-1 last:border-0 dark:border-zinc-800"
                >
                  <span className="font-mono text-violet-700 dark:text-violet-400">
                    {t.name}
                  </span>{" "}
                  <span className="text-zinc-500">({t.status})</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Reasoning stream
          </div>
          <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-md border border-zinc-200 bg-white p-2 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
            {reasoningText || "—"}
          </pre>
        </div>
      </section>
      <section className="min-h-[480px] min-w-0 flex-[1.2]">
        <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Canvas
        </h2>
        <AgentCanvas feedCanvasHtml={feedCanvasHtml} />
      </section>
    </div>
  );
}
