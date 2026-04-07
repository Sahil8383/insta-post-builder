"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { OptimizedFeedIframe } from "@/components/feed/OptimizedFeedIframe";

export type FeedPreviewData = {
  html: string | null;
  label?: string;
};

export type FeedPreviewNodeType = Node<FeedPreviewData, "feedPreview">;

function FeedPreviewNodeImpl(props: NodeProps<FeedPreviewNodeType>) {
  const { html, label } = props.data;
  return (
    <div
      className="rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
      style={{ width: 420 }}
    >
      <div className="border-b border-zinc-100 px-3 py-2 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        {label ?? "Feed canvas"}
      </div>
      <div className="flex justify-center bg-zinc-100 p-3 dark:bg-zinc-950">
        <OptimizedFeedIframe
          html={html}
          designWidth={1080}
          designHeight={1080}
          maxDisplaySize={392}
        />
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-violet-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-violet-500"
      />
    </div>
  );
}

export const FeedPreviewNode = memo(FeedPreviewNodeImpl);
