"use client";

import { type Node, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import {
  isPostsApiConfigured,
  useGetPostQuery,
} from "@/features/posts/postsApi";
import { OptimizedFeedIframe } from "@/components/feed/OptimizedFeedIframe";

export type FeedPreviewData = {
  postId: number;
};

export type FeedPreviewNodeType = Node<FeedPreviewData, "feedPreview">;

function FeedPreviewNodeImpl(props: NodeProps<FeedPreviewNodeType>) {
  const postId = props.data.postId;
  const { data, isFetching } = useGetPostQuery(postId, {
    skip: !isPostsApiConfigured() || !postId,
  });
  const html = data?.html_content?.trim() ? data.html_content : null;

  return (
    <div className="h-full w-full min-w-[200px] rounded-lg border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-1 truncate px-1 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
        #{postId}
        {isFetching && !html ? (
          <span className="ml-1 text-zinc-400">Loading…</span>
        ) : null}
      </div>
      <OptimizedFeedIframe
        html={html}
        designWidth={1080}
        designHeight={1080}
        maxDisplaySize={392}
      />
    </div>
  );
}

export const FeedPreviewNode = memo(FeedPreviewNodeImpl);
