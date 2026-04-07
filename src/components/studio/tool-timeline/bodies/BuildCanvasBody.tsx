import type { ToolBodyPresentation } from "../tool-body-presentation";
import { FieldBlock } from "../Shared";
import { tryParseJson } from "../json";

type Props = {
  args: Record<string, unknown> | null;
  resultText: string | undefined;
  presentation?: ToolBodyPresentation;
};

export function BuildCanvasBody({
  args,
  resultText,
  presentation = "rich",
}: Props) {
  const parsed = tryParseJson(resultText) as Record<string, unknown> | null;
  const err = parsed && "error" in parsed ? String(parsed.error) : null;
  const html = parsed && typeof parsed.html === "string" ? parsed.html : null;
  const w = parsed?.width_px;
  const h = parsed?.height_px;
  const preset =
    typeof parsed?.format_preset === "string" ? parsed.format_preset : "";

  const overlay =
    typeof args?.overlay_text === "string" ? args.overlay_text : "";
  const imageUrl = typeof args?.image_url === "string" ? args.image_url : "";

  if (err) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200">
        {err}
      </div>
    );
  }

  if (presentation === "compact") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {overlay ? <p className="whitespace-pre-wrap">{overlay}</p> : null}
        {imageUrl ? (
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="max-h-32 w-full object-cover"
            />
          </div>
        ) : null}
        {html ? (
          <p className="text-xs text-emerald-800 dark:text-emerald-200/90">
            {preset ? `${preset} · ` : null}
            {typeof w === "number" && typeof h === "number"
              ? `${w}×${h}px · `
              : null}
            {html.length.toLocaleString()} characters of HTML — canvas ready for
            preview.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {(overlay || imageUrl) && (
        <FieldBlock label="Design input">
          {overlay ? (
            <p className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
              {overlay}
            </p>
          ) : null}
          {imageUrl ? (
            <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt=""
                className="max-h-32 w-full object-cover"
              />
            </div>
          ) : null}
        </FieldBlock>
      )}
      {html && (
        <FieldBlock label="Canvas output">
          <div className="space-y-2 rounded-lg border border-emerald-200/80 bg-emerald-50/50 px-2.5 py-2 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <div className="flex flex-wrap gap-2 text-emerald-900 dark:text-emerald-100">
              {preset ? (
                <span className="rounded bg-emerald-100/80 px-1.5 py-0.5 dark:bg-emerald-900/50">
                  {preset}
                </span>
              ) : null}
              {typeof w === "number" && typeof h === "number" ? (
                <span>
                  {w}×{h}px
                </span>
              ) : null}
              <span>{html.length.toLocaleString()} chars HTML</span>
            </div>
            <p className="text-emerald-800/90 dark:text-emerald-200/90">
              Canvas document ready for the preview iframe and export.
            </p>
          </div>
        </FieldBlock>
      )}
    </div>
  );
}
