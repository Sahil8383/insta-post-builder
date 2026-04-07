import type { ToolBodyPresentation } from "../tool-body-presentation";
import { FieldBlock } from "../Shared";
import { tryParseJson } from "../json";

type Props = {
  args: Record<string, unknown> | null;
  resultText: string | undefined;
  presentation?: ToolBodyPresentation;
};

export function StockMediaBody({
  args,
  resultText,
  presentation = "rich",
}: Props) {
  const parsed = tryParseJson(resultText) as Record<string, unknown> | null;
  const q =
    typeof args?.query === "string"
      ? args.query
      : typeof args?.q === "string"
        ? args.q
        : null;
  const mediaType = typeof args?.media_type === "string" ? args.media_type : "";
  const orientation =
    typeof args?.orientation === "string" ? args.orientation : "";

  if (!parsed && !resultText) {
    return <p className="text-xs text-zinc-500">Waiting for media result…</p>;
  }

  if (!parsed && resultText) {
    return (
      <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-2 text-xs dark:border-zinc-700 dark:bg-zinc-950">
        {resultText}
      </pre>
    );
  }

  if (parsed && "error" in parsed && parsed.error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        {String(parsed.error)}
      </div>
    );
  }

  const imageUrl =
    typeof parsed?.image_url === "string" ? parsed.image_url : "";
  const videoUrl =
    typeof parsed?.video_url === "string" ? parsed.video_url : "";
  const photographer =
    typeof parsed?.photographer === "string" ? parsed.photographer : "";
  const pageUrl =
    typeof parsed?.pexels_page_url === "string" ? parsed.pexels_page_url : "";
  const alt = typeof parsed?.alt_text === "string" ? parsed.alt_text : "";
  const mt =
    typeof parsed?.media_type === "string" ? parsed.media_type : mediaType;

  if (presentation === "compact") {
    return (
      <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
        {(q || mt || orientation) && (
          <p className="leading-relaxed">
            {[q, mt, orientation].filter(Boolean).join(" · ")}
          </p>
        )}
        {imageUrl ? (
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={alt || "Stock media"}
              className="max-h-48 w-full object-cover"
            />
          </div>
        ) : null}
        {(photographer || pageUrl || videoUrl) && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {photographer ? <span>{photographer}. </span> : null}
            {pageUrl ? (
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 hover:underline dark:text-violet-400"
              >
                View on Pexels
              </a>
            ) : null}
            {videoUrl ? (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block truncate text-violet-600 hover:underline dark:text-violet-400"
              >
                Open video file
              </a>
            ) : null}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {(q || mediaType || orientation) && (
        <FieldBlock label="Request">
          <div className="flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            {q ? (
              <span className="rounded-md bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                {q}
              </span>
            ) : null}
            {mt ? (
              <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-600">
                {mt}
              </span>
            ) : null}
            {orientation ? (
              <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-600">
                {orientation}
              </span>
            ) : null}
          </div>
        </FieldBlock>
      )}
      {imageUrl ? (
        <FieldBlock label="Preview">
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={alt || "Stock media"}
              className="max-h-48 w-full object-cover"
            />
          </div>
        </FieldBlock>
      ) : null}
      {(photographer || pageUrl) && (
        <FieldBlock label="Attribution">
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            {photographer ? <div>{photographer}</div> : null}
            {pageUrl ? (
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-violet-600 hover:underline dark:text-violet-400"
              >
                View on Pexels
              </a>
            ) : null}
            {videoUrl ? (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block truncate text-violet-600 hover:underline dark:text-violet-400"
              >
                Open video file
              </a>
            ) : null}
          </div>
        </FieldBlock>
      )}
    </div>
  );
}
