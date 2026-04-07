import { Check } from "lucide-react";
import type { ToolBodyPresentation } from "../tool-body-presentation";

type Props = {
  kind: "post" | "insights";
  presentation?: ToolBodyPresentation;
};

export function SubmitToolsBody({
  kind,
  presentation = "rich",
}: Props) {
  const text =
    kind === "insights"
      ? "Insights package recorded."
      : "Post package submitted to the app.";

  if (presentation === "compact") {
    return (
      <p className="flex items-start gap-2 text-sm leading-relaxed text-emerald-900 dark:text-emerald-100">
        <Check
          className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
          aria-hidden
        />
        <span>{text}</span>
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-emerald-200/80 bg-emerald-50/60 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/35 dark:text-emerald-100">
      <Check
        className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
        aria-hidden
      />
      <span>{text}</span>
    </div>
  );
}
