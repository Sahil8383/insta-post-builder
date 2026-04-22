"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { streamPostGeneration } from "@/lib/streamPostGeneration";
import {
  isPostsApiConfigured,
  useListPostsQuery,
} from "@/features/posts/postsApi";
import { StudioThemeToggle } from "@/components/studio/StudioThemeToggle";
import { ToolCallTimeline } from "@/components/studio/tool-timeline";

const AgentCanvas = dynamic(
  () =>
    import("@/components/flow/AgentCanvas").then((m) => ({
      default: m.AgentCanvas,
    })),
  { ssr: false, loading: () => <CanvasPlaceholder /> },
);

function CanvasPlaceholder() {
  return (
    <div className="flex min-h-[320px] w-full flex-1 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
      Loading canvas…
    </div>
  );
}

export function PostStudio() {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const phase = useAppSelector((s) => s.agent.phase);
  const sessionSummary = useAppSelector((s) => s.agent.sessionSummary);
  const errorMessage = useAppSelector((s) => s.agent.errorMessage);
  const postId = useAppSelector((s) => s.agent.postId);
  const toolCalls = useAppSelector((s) => s.agent.toolCallsById);

  const { data: posts = [] } = useListPostsQuery(
    { limit: 50, order: "asc" },
    { skip: !isPostsApiConfigured() },
  );

  const [query, setQuery] = useState("");
  const [lastSubmittedQuery, setLastSubmittedQuery] = useState<string | null>(
    null,
  );
  const abortRef = useRef<AbortController | null>(null);

  const onGenerate = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    setLastSubmittedQuery(q);
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

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onGenerate();
      }
    },
    [onGenerate],
  );

  const toolList = Object.values(toolCalls);
  const canvasIds = posts.map((p) => p.id);

  const showEphemeralSummary =
    Boolean(sessionSummary) &&
    !(
      phase === "success" &&
      postId != null &&
      posts.some((p) => p.id === postId)
    );

  return (
    <div className="flex min-h-0 flex-1 flex-col md:h-dvh md:max-h-dvh md:flex-row">
      {/* Left: canvas */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 md:border-b-0 md:border-r">
        <div className="shrink-0 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Canvas
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            One preview per saved post (HTML loads when visible)
          </p>
        </div>
        <div className="flex h-full flex-1 flex-col">
          <AgentCanvas postIds={canvasIds} />
        </div>
      </section>

      {/* Right: chat */}
      <section className="flex min-h-0 w-full flex-col border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:w-[min(100%,420px)] md:max-w-[440px] md:shrink-0 md:border-l">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Chat
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              History from saved runs
            </p>
          </div>
          <StudioThemeToggle />
        </header>

        <div className="min-h-[240px] flex-1 overflow-y-auto px-3 py-3 md:min-h-0">
          <div className="flex flex-col gap-3">
            {!isPostsApiConfigured() && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-100">
                Set <span className="font-mono">NEXT_PUBLIC_API_BASE_URL</span>{" "}
                to load history and canvas.
              </div>
            )}

            {posts.map((p) => (
              <div key={p.id} className="flex flex-col gap-2">
                <div className="flex justify-end">
                  <div className="max-w-[92%] rounded-2xl rounded-br-md bg-violet-600 px-3 py-2.5 text-sm leading-relaxed text-white shadow-sm">
                    {(p.user_query || "").trim() ||
                      p.post_name ||
                      "(no prompt stored)"}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-zinc-200 bg-zinc-100 px-3 py-2.5 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200">
                    {(p.session_summary || "").trim() ? (
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {p.session_summary}
                      </p>
                    ) : p.status === "failed" ? (
                      <p className="text-red-700 dark:text-red-300">
                        {(p.error_message || "").trim() || "Generation failed."}
                      </p>
                    ) : (
                      <p className="text-zinc-500 dark:text-zinc-400">
                        No summary stored for this run.
                      </p>
                    )}
                    <div className="mt-2 border-t border-zinc-200/80 pt-1.5 text-[10px] text-zinc-500 dark:border-zinc-600 dark:text-zinc-500">
                      Post #{p.id} · {p.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {phase === "streaming" && lastSubmittedQuery && (
              <>
                <div className="flex justify-end">
                  <div className="max-w-[92%] rounded-2xl rounded-br-md bg-violet-600 px-3 py-2.5 text-sm leading-relaxed text-white shadow-sm">
                    {lastSubmittedQuery}
                  </div>
                </div>
                {toolList.length === 0 && (
                  <div className="flex justify-start">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      <span
                        className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-violet-500 align-middle"
                        aria-hidden
                      />
                      Working…
                    </p>
                  </div>
                )}
                {toolList.length > 0 && (
                  <div className="flex w-full justify-start">
                    <ToolCallTimeline tools={toolList} />
                  </div>
                )}
              </>
            )}

            {phase === "streaming" &&
              !lastSubmittedQuery &&
              toolList.length > 0 && (
                <div className="flex w-full justify-start">
                  <ToolCallTimeline tools={toolList} />
                </div>
              )}

            {showEphemeralSummary && (
              <div className="flex justify-start">
                <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-zinc-200 bg-zinc-100 px-3 py-2.5 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Summary
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {sessionSummary}
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="flex justify-start">
                <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:border-red-900/80 dark:bg-red-950/60 dark:text-red-200">
                  {errorMessage}
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="shrink-0 border-t border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <label className="sr-only" htmlFor="chat-query">
            Message
          </label>
          <textarea
            id="chat-query"
            rows={3}
            className="mb-2 w-full resize-none rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Describe the post you want…"
          />
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onGenerate}
              disabled={phase === "streaming" || !query.trim()}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
            >
              {phase === "streaming" ? "Generating…" : "Send"}
            </button>
            <button
              type="button"
              onClick={onAbort}
              disabled={phase !== "streaming"}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
