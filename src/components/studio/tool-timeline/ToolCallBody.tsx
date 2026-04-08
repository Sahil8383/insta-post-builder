import type { ToolCallEntry } from "@/types/agent-stream";
import { isRecord, tryParseJson } from "./json";
import type { ToolBodyPresentation } from "./tool-body-presentation";
import {
  AnalyzeRequestBody,
  BuildCanvasBody,
  CritiqueCaptionBody,
  GenerateImageBody,
  GenericJsonBody,
  PickHashtagsBody,
  StockMediaBody,
  SubmitToolsBody,
  WebSearchBody,
  WriteCaptionBody,
} from "./bodies";

export type { ToolBodyPresentation } from "./tool-body-presentation";

function parseArgs(tool: ToolCallEntry): Record<string, unknown> | null {
  const rawArgs =
    tool.argsPreview ??
    (tool.argumentBuffer.trim() ? tool.argumentBuffer : undefined);
  const argsParsed = tryParseJson(rawArgs);
  return isRecord(argsParsed) ? argsParsed : null;
}

type Props = {
  tool: ToolCallEntry;
  presentation?: ToolBodyPresentation;
};

export function ToolCallBody({ tool, presentation = "rich" }: Props) {
  const args = parseArgs(tool);
  const result = tool.resultPreview;

  switch (tool.name) {
    case "analyze_request":
      return (
        <AnalyzeRequestBody
          args={args}
          result={result}
          presentation={presentation}
        />
      );
    case "web_search":
      return (
        <WebSearchBody
          args={args}
          result={result}
          presentation={presentation}
        />
      );
    case "write_caption":
      return (
        <WriteCaptionBody
          args={args}
          result={result}
          presentation={presentation}
        />
      );
    case "pick_hashtags":
      return (
        <PickHashtagsBody
          args={args}
          result={result}
          presentation={presentation}
        />
      );
    case "critique_caption":
      return (
        <CritiqueCaptionBody result={result} presentation={presentation} />
      );
    case "fetch_stock_media":
      return (
        <StockMediaBody
          args={args}
          resultText={result}
          presentation={presentation}
        />
      );
    case "build_feed_canvas_html":
      return (
        <BuildCanvasBody
          args={args}
          resultText={result}
          presentation={presentation}
        />
      );
    case "generate_image":
      return <GenerateImageBody resultText={result} />;
    case "submit_post_package":
      return <SubmitToolsBody kind="post" presentation={presentation} />;
    case "submit_insights":
      return <SubmitToolsBody kind="insights" presentation={presentation} />;
    default:
      return (
        <GenericJsonBody
          args={args}
          result={result}
          presentation={presentation}
        />
      );
  }
}
