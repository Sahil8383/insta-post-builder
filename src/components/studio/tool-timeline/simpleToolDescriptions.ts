import type { ToolCallEntry } from "@/types/agent-stream";

const URL_RE = /https?:\/\/[^\s)<>"']+/gi;

/** Unique URLs from streamed search result (Sources: … lines, etc.). */
export function extractUrlsFromText(text: string): string[] {
  const seen = new Set<string>();
  for (const m of text.matchAll(URL_RE)) {
    let u = m[0];
    u = u.replace(/[.,;]+$/, "");
    if (u.length > 0) seen.add(u);
  }
  return [...seen];
}

/** One short line for non–web_search tools when complete. */
export function describeNonWebTool(tool: ToolCallEntry): string | null {
  if (tool.status !== "done") return null;
  const name = tool.name;
  if (name === "submit_post_package" || name === "submit_insights") return null;
  if (name === "web_search") return null;

  const r = (tool.resultPreview ?? "").trim();
  if (!r || r === "completed") return null;

  if (name === "build_feed_canvas_html") {
    return "Canvas HTML ready.";
  }

  const oneLine = r.replace(/\s+/g, " ").trim();
  if (!oneLine) return null;
  return oneLine.length > 160 ? `${oneLine.slice(0, 157)}…` : oneLine;
}
