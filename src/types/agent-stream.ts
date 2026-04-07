/** SSE payloads from POST /api/posts/generate/stream — see docs/agentic-streaming-frontend.md */

export type StreamPhase = "idle" | "streaming" | "success" | "error";

export type AgentStreamEvent =
  | { type: "assistant-message-id"; messageId: string }
  | { type: "iteration"; index: number }
  | { type: "heartbeat" }
  | { type: "reasoning-delta"; delta: string }
  | {
      type: "tool-call-start";
      toolCallId: string;
      toolName: string;
    }
  | {
      type: "tool-call-delta";
      toolCallId: string;
      toolName: string;
      arguments: string;
    }
  | {
      type: "tool-call-end";
      toolCallId: string;
      toolName: string;
      arguments?: string;
      result?: string;
    }
  | {
      type: "done";
      post_id: number;
      result_kind: "post" | "insights";
      session_summary: string;
    }
  | { type: "error"; message: string };

export type ToolCallEntry = {
  id: string;
  name: string;
  status: "running" | "done";
  argsPreview?: string;
  resultPreview?: string;
  argumentBuffer: string;
};
