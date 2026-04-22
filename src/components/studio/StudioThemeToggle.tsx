"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function StudioThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex shrink-0 items-center justify-center rounded-lg border border-zinc-200 p-1.5 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
      title={theme === "dark" ? "Use light mode" : "Use dark mode"}
      aria-pressed={theme === "dark"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="size-4" strokeWidth={1.5} />
      ) : (
        <Moon className="size-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
