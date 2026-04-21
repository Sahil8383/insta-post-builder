import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StreamPhase, ToolCallEntry } from "@/types/agent-stream";

export type AgentState = {
  phase: StreamPhase;
  toolCallsById: Record<string, ToolCallEntry>;
  postId: number | null;
  resultKind: "post" | "insights" | null;
  sessionSummary: string | null;
  errorMessage: string | null;
  /** Loaded after `done` from GET /api/posts/{id}/ — `html_content` */
  feedCanvasHtml: string | null;
};

const initialState: AgentState = {
  phase: "idle",
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
    toolCallStart(
      state,
      action: PayloadAction<{ toolCallId: string; toolName: string }>,
    ) {
      const { toolCallId, toolName } = action.payload;
      state.toolCallsById[toolCallId] = {
        id: toolCallId,
        name: toolName,
        status: "running",
      };
    },
    toolCallEnd(
      state,
      action: PayloadAction<{
        toolCallId: string;
        toolName: string;
        result?: string;
      }>,
    ) {
      const { toolCallId, toolName, result } = action.payload;
      let row = state.toolCallsById[toolCallId];
      if (!row) {
        row = {
          id: toolCallId,
          name: toolName,
          status: "done",
        };
        state.toolCallsById[toolCallId] = row;
      }
      row.status = "done";
      row.name = toolName;
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
  toolCallStart,
  toolCallEnd,
  setDone,
  setStreamError,
  setFeedCanvasHtml,
} = agentSlice.actions;

export const agentReducer = agentSlice.reducer;
