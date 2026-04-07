"use client";

import { type Node, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { OptimizedFeedIframe } from "@/components/feed/OptimizedFeedIframe";

export type FeedPreviewData = {
  html: string | null;
};

export type FeedPreviewNodeType = Node<FeedPreviewData, "feedPreview">;

function FeedPreviewNodeImpl(props: NodeProps<FeedPreviewNodeType>) {
  const { html } = props.data;
  return (
    <div className="w-full h-full">
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
