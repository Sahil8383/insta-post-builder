import type { ReactNode } from "react";

export function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function KeyValueGrid({ data }: { data: Record<string, unknown> }) {
  const keys = Object.keys(data).filter((k) => data[k] !== undefined);
  if (keys.length === 0) return null;
  return (
    <dl className="grid gap-2 text-xs">
      {keys.map((k) => {
        const v = data[k];
        const str =
          typeof v === "string"
            ? v
            : v === null
              ? "null"
              : JSON.stringify(v, null, 0);
        const long = str.length > 280;
        return (
          <div
            key={k}
            className="rounded-lg border border-zinc-100 bg-white/60 p-2 dark:border-zinc-800 dark:bg-zinc-950/40"
          >
            <dt className="font-mono text-[10px] text-violet-600 dark:text-violet-400">
              {k}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap wrap-break-word text-zinc-700 dark:text-zinc-300">
              {long ? (
                <details className="group">
                  <summary className="cursor-pointer list-none text-zinc-500 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="text-violet-600 underline decoration-violet-400/50 group-open:hidden dark:text-violet-400">
                      Show {str.length.toLocaleString()} characters
                    </span>
                    <span className="hidden group-open:inline text-zinc-500">
                      Hide
                    </span>
                  </summary>
                  <div className="mt-2 max-h-48 overflow-auto border-t border-zinc-100 pt-2 dark:border-zinc-800">
                    {str}
                  </div>
                </details>
              ) : (
                str
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function HashtagRow({ text }: { text: string }) {
  const tags = text
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.startsWith("#"));
  if (tags.length === 0) {
    return (
      <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
        {text}
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex rounded-full bg-violet-500/15 px-2 py-0.5 text-xs font-medium text-violet-800 dark:text-violet-200"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
