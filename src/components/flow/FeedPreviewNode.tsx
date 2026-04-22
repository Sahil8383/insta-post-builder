"use client";

import { type Node, type NodeProps } from "@xyflow/react";
import {
  Bookmark,
  Check,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
} from "lucide-react";
import { type CSSProperties, type ReactNode, memo, useMemo } from "react";
import { OptimizedFeedIframe } from "@/components/feed/OptimizedFeedIframe";
import {
  isPostsApiConfigured,
  useGetPostQuery,
} from "@/features/posts/postsApi";

export type FeedPreviewData = {
  postId: number;
};

export type FeedPreviewNodeType = Node<FeedPreviewData, "feedPreview">;

const IG = {
  bg: "#000000",
  text: "#FAFAFA",
  muted: "#8E8E8E",
  verify: "#0095F6",
} as const;

function formatRelativeTime(iso: string | undefined): string {
  if (!iso) return "now";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "now";
  const diff = Date.now() - t;
  const s = Math.floor(diff / 1000);
  if (s < 45) return "now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  if (w < 52) return `${w}w`;
  return "52w+";
}

function usernameFromPostName(name: string | undefined, id: number): string {
  if (name && name.trim().length > 0) {
    return (
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 30) || `post_${id}`
    );
  }
  return `post_${id}`;
}

function formatEngagement(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

type StatProps = { icon: ReactNode; count: string; label: string };
function ActionStat({ icon, count, label }: StatProps) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[13px] font-medium tabular-nums tracking-tight text-(--ig-text)">
        {count}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span
      className="inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: IG.verify }}
      aria-label="Verified"
    >
      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />
    </span>
  );
}

function FeedPreviewNodeImpl(props: NodeProps<FeedPreviewNodeType>) {
  const postId = props.data.postId;
  const { data, isFetching } = useGetPostQuery(postId, {
    skip: !isPostsApiConfigured() || !postId,
  });
  const html = data?.html_content?.trim() ? data.html_content : null;

  const handle = useMemo(
    () => usernameFromPostName(data?.post_name, postId),
    [data?.post_name, postId],
  );
  const when = formatRelativeTime(data?.created_at);
  const initial = (handle.charAt(0) || "P").toUpperCase();
  const caption =
    (data?.user_query || data?.session_summary || "").trim() ||
    (isFetching
      ? "Loading your feed canvas…"
      : "Run a generation that includes feed HTML to see it here.");
  const likesSeed = ((postId * 17) % 9_000) + 200;
  const cmtSeed = ((postId * 3) % 90) + 1;
  const repostSeed = ((postId * 5) % 200) + 1;

  return (
    <div
      className="w-[min(100%,400px)] min-w-[200px] overflow-hidden rounded-lg border border-zinc-800/90 shadow-2xl ring-1 ring-zinc-800/50"
      style={
        {
          backgroundColor: IG.bg,
          ["--ig-text" as string]: IG.text,
          ["--ig-muted" as string]: IG.muted,
        } as CSSProperties
      }
    >
      <header className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{
              background:
                "linear-gradient(135deg, rgb(244 114 182), rgb(251 113 133), rgb(251 191 36))",
            }}
            aria-hidden
          >
            {initial}
          </div>
          <div className="min-w-0 text-[13px] leading-tight text-(--ig-text)">
            <div className="flex min-w-0 flex-wrap items-center gap-1">
              <span className="truncate font-semibold">{handle}</span>
              <VerifiedBadge />
            </div>
            <div
              className="mt-0.5 text-[12px] font-normal"
              style={{ color: IG.muted }}
            >
              {when}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="nodrag -mr-1 rounded p-1 text-(--ig-text) opacity-90 hover:opacity-100"
          aria-label="Post options"
        >
          <MoreHorizontal className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </header>

      <div
        className="flex justify-center border-y border-zinc-900/80 bg-[#0a0a0a] px-1 py-0.5"
        style={{ minHeight: 120 }}
      >
        <div className="overflow-hidden rounded-md">
          <OptimizedFeedIframe
            html={html}
            designWidth={1080}
            designHeight={1080}
            maxDisplaySize={372}
            className="rounded-md! bg-[#0a0a0a]! ring-0"
            loadingTextClassName="text-zinc-500"
            emptyTextClassName="text-zinc-500"
          />
        </div>
      </div>

      <div className="px-2 pt-1.5">
        <div className="flex items-center justify-between gap-1 pb-1.5 text-(--ig-text)">
          <div className="flex flex-1 items-center gap-3.5">
            <ActionStat
              label="Likes"
              count={formatEngagement(likesSeed)}
              icon={<Heart className="h-[22px] w-[22px]" strokeWidth={1.4} />}
            />
            <ActionStat
              label="Comments"
              count={String(cmtSeed)}
              icon={
                <MessageCircle
                  className="h-[22px] w-[22px]"
                  strokeWidth={1.4}
                />
              }
            />
            <ActionStat
              label="Reposts"
              count={formatEngagement(repostSeed)}
              icon={<Repeat2 className="h-[22px] w-[22px]" strokeWidth={1.4} />}
            />
            <div className="flex items-center">
              <button
                type="button"
                className="nodrag rounded p-0.5"
                aria-label="Share"
              >
                <Send
                  className="h-[22px] w-[22px] -translate-y-px -rotate-12"
                  strokeWidth={1.4}
                />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="nodrag rounded p-0.5"
            aria-label="Save"
          >
            <Bookmark
              className="h-[22px] w-[22px] scale-x-90"
              strokeWidth={1.4}
            />
          </button>
        </div>

        <p
          className="pb-1.5 text-[12px] leading-snug"
          style={{ color: IG.muted }}
        >
          <span className="font-semibold" style={{ color: IG.text }}>
            Liked by{" "}
            <a
              className="cursor-default font-semibold"
              style={{ color: IG.text }}
              onClick={(e) => e.preventDefault()}
            >
              feed_builder
            </a>{" "}
            and{" "}
            <a
              className="font-semibold"
              style={{ color: IG.text }}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              {formatEngagement(Math.max(likesSeed - 1, 0))} others
            </a>
          </span>
        </p>

        <p className="text-[14px] leading-[1.35] text-(--ig-text)">
          <span className="inline-flex items-center gap-1 font-semibold">
            {handle}
            <VerifiedBadge />
          </span>{" "}
          <span className="wrap-break-word whitespace-pre-wrap font-normal">
            {caption}
          </span>
        </p>

        <button
          type="button"
          className="nodrag pt-1 text-left text-[12px] font-normal"
          style={{ color: IG.muted }}
        >
          See translation
        </button>
      </div>
    </div>
  );
}

export const FeedPreviewNode = memo(FeedPreviewNodeImpl);
