import { PostStudio } from "@/components/studio/PostStudio";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-100 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Insta Post Builder
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Streaming agent UI — React Flow canvas + optimized feed iframe preview.
        </p>
      </header>
      <PostStudio />
    </div>
  );
}
