import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StreamPhase, ToolCallEntry } from "@/types/agent-stream";

export type AgentState = {
  phase: StreamPhase;
  messageId: string | null;
  iteration: number | null;
  reasoningText: string;
  toolCallsById: Record<string, ToolCallEntry>;
  postId: number | null;
  resultKind: "post" | "insights" | null;
  sessionSummary: string | null;
  errorMessage: string | null;
  /** Loaded after `done` from GET /api/posts/{id}/ — engagement_package.feed_canvas_html */
  feedCanvasHtml: string | null;
};

const initialState: AgentState = {
  phase: "idle",
  messageId: null,
  iteration: null,
  reasoningText: "",
  toolCallsById: {},
  postId: null,
  resultKind: null,
  sessionSummary: null,
  errorMessage: null,
  feedCanvasHtml: null,
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    resetAgent(state) {
      Object.assign(state, initialState);
    },
    setPhase(state, action: PayloadAction<StreamPhase>) {
      state.phase = action.payload;
    },
    setMessageId(state, action: PayloadAction<string>) {
      state.messageId = action.payload;
    },
    setIteration(state, action: PayloadAction<number>) {
      state.iteration = action.payload;
    },
    appendReasoningDelta(state, action: PayloadAction<string>) {
      state.reasoningText += action.payload;
    },
    toolCallStart(
      state,
      action: PayloadAction<{ toolCallId: string; toolName: string }>,
    ) {
      const { toolCallId, toolName } = action.payload;
      state.toolCallsById[toolCallId] = {
        id: toolCallId,
        name: toolName,
        status: "running",
        argumentBuffer: "",
      };
    },
    toolCallDelta(
      state,
      action: PayloadAction<{ toolCallId: string; fragment: string }>,
    ) {
      const row = state.toolCallsById[action.payload.toolCallId];
      if (row) row.argumentBuffer += action.payload.fragment;
    },
    toolCallEnd(
      state,
      action: PayloadAction<{
        toolCallId: string;
        toolName: string;
        arguments?: string;
        result?: string;
      }>,
    ) {
      const { toolCallId, toolName, arguments: argsJson, result } =
        action.payload;
      let row = state.toolCallsById[toolCallId];
      if (!row) {
        row = {
          id: toolCallId,
          name: toolName,
          status: "done",
          argumentBuffer: "",
        };
        state.toolCallsById[toolCallId] = row;
      }
      row.status = "done";
      row.name = toolName;
      if (argsJson !== undefined) row.argsPreview = argsJson;
      if (result !== undefined) row.resultPreview = result;
    },
    setDone(
      state,
      action: PayloadAction<{
        postId: number;
        resultKind: "post" | "insights";
        sessionSummary: string;
      }>,
    ) {
      state.phase = "success";
      state.postId = action.payload.postId;
      state.resultKind = action.payload.resultKind;
      state.sessionSummary = action.payload.sessionSummary;
      state.errorMessage = null;
    },
    setStreamError(state, action: PayloadAction<string>) {
      state.phase = "error";
      state.errorMessage = action.payload;
    },
    setFeedCanvasHtml(state, action: PayloadAction<string | null>) {
      state.feedCanvasHtml = action.payload;
    },
  },
});

export const {
  resetAgent,
  setPhase,
  setMessageId,
  setIteration,
  appendReasoningDelta,
  toolCallStart,
  toolCallDelta,
  toolCallEnd,
  setDone,
  setStreamError,
  setFeedCanvasHtml,
} = agentSlice.actions;

export const agentReducer = agentSlice.reducer;
