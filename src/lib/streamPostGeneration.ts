import type { AppDispatch, RootState } from "@/lib/store";
import { parseSseStream } from "@/lib/sse";
import type { AgentStreamEvent } from "@/types/agent-stream";
import {
  appendReasoningDelta,
  resetAgent,
  setDone,
  setFeedCanvasHtml,
  setIteration,
  setMessageId,
  setPhase,
  setStreamError,
  toolCallDelta,
  toolCallEnd,
  toolCallStart,
} from "@/features/agent/agentSlice";

function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return "";
  return base.replace(/\/$/, "");
}

function dispatchEvent(dispatch: AppDispatch, ev: AgentStreamEvent) {
  switch (ev.type) {
    case "assistant-message-id":
      dispatch(setMessageId(ev.messageId));
      break;
    case "iteration":
      dispatch(setIteration(ev.index));
      break;
    case "heartbeat":
      break;
    case "reasoning-delta":
      dispatch(appendReasoningDelta(ev.delta));
      break;
    case "tool-call-start":
      dispatch(
        toolCallStart({ toolCallId: ev.toolCallId, toolName: ev.toolName }),
      );
      break;
    case "tool-call-delta":
      dispatch(
        toolCallDelta({
          toolCallId: ev.toolCallId,
          fragment: ev.arguments,
        }),
      );
      break;
    case "tool-call-end":
      dispatch(
        toolCallEnd({
          toolCallId: ev.toolCallId,
          toolName: ev.toolName,
          arguments: ev.arguments,
          result: ev.result,
        }),
      );
      break;
    case "done":
      dispatch(
        setDone({
          postId: ev.post_id,
          resultKind: ev.result_kind,
          sessionSummary: ev.session_summary,
        }),
      );
      break;
    case "error":
      dispatch(setStreamError(ev.message));
      break;
    default:
      break;
  }
}

export type StreamGenerateBody = {
  query?: string;
  topic?: string;
  tone?: string;
  target_audience?: string;
  media_mode?: "auto" | "stock" | "generate";
  post_id?: number;
};

/**
 * POST /api/posts/generate/stream and dispatch Redux updates until `done` or `error`.
 * After `done`, loads lean post and sets `feedCanvasHtml` when the API returns it.
 */
export async function streamPostGeneration(
  dispatch: AppDispatch,
  getState: () => RootState,
  body: StreamGenerateBody,
  signal: AbortSignal,
): Promise<void> {
  const base = getApiBase();
  if (!base) {
    dispatch(
      setStreamError(
        "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local (e.g. http://localhost:8000).",
      ),
    );
    return;
  }

  dispatch(resetAgent());
  dispatch(setPhase("streaming"));

  const res = await fetch(`${base}/api/posts/generate/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) {
    dispatch(
      setStreamError(
        `Stream request failed: ${res.status} ${res.statusText || ""}`.trim(),
      ),
    );
    return;
  }

  try {
    for await (const ev of parseSseStream(res.body)) {
      if (ev.type === "parse-error") continue;
      dispatchEvent(dispatch, ev);
      if (ev.type === "done" || ev.type === "error") break;
    }

    const { phase, postId } = getState().agent;
    if (phase === "success" && postId != null) {
      await fetchLeanPostAndCanvas(dispatch, postId, signal);
    }
  } catch (e) {
    if (signal.aborted) {
      dispatch(setPhase("idle"));
      return;
    }
    dispatch(
      setStreamError(
        e instanceof Error ? e.message : "Stream failed unexpectedly.",
      ),
    );
  }
}

/** GET /api/posts/{id}/ — sets feed_canvas_html in Redux when present. */
export async function fetchLeanPostAndCanvas(
  dispatch: AppDispatch,
  postId: number,
  signal?: AbortSignal,
): Promise<void> {
  const base = getApiBase();
  if (!base) return;

  const res = await fetch(`${base}/api/posts/${postId}/`, { signal });
  if (!res.ok) return;
  const data = (await res.json()) as {
    engagement_package?: { feed_canvas_html?: string | null };
  };
  const html = data.engagement_package?.feed_canvas_html ?? null;
  dispatch(setFeedCanvasHtml(html));
}
