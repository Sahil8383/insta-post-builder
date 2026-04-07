import type { AgentStreamEvent } from "@/types/agent-stream";

/**
 * Incremental SSE parser for fetch() ReadableStream.
 * Yields parsed JSON payloads from `data:` lines; ignores comment heartbeats (`: ...`).
 */
export async function* parseSseStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<AgentStreamEvent | { type: "parse-error"; raw: string }> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const block = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        const lines = block.split("\n");
        let dataJoined = "";
        for (const line of lines) {
          if (line.startsWith(":")) continue;
          if (line.startsWith("data:")) {
            dataJoined += line.slice(5).trimStart();
          }
        }
        if (!dataJoined) continue;
        try {
          const payload = JSON.parse(dataJoined) as AgentStreamEvent;
          yield payload;
        } catch {
          yield { type: "parse-error", raw: dataJoined };
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
