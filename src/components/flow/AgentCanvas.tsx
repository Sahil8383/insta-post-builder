"use client";

import {
  Background,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect } from "react";
import {
  FeedPreviewNode,
  type FeedPreviewNodeType,
} from "@/components/flow/FeedPreviewNode";

const nodeTypes: NodeTypes = {
  feedPreview: FeedPreviewNode,
};

const initialEdges: Edge[] = [];

const COLS = 2;
const CELL_W = 440;
const CELL_H = 440;
const ORIGIN = { x: 40, y: 40 };

function layoutForIndex(i: number) {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return {
    x: ORIGIN.x + col * CELL_W,
    y: ORIGIN.y + row * CELL_H,
  };
}

export type AgentCanvasProps = {
  postIds: number[];
};

export function AgentCanvas({ postIds }: AgentCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FeedPreviewNodeType>([]);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const next: FeedPreviewNodeType[] = postIds.map((id, i) => ({
      id: `post-${id}`,
      type: "feedPreview",
      position: layoutForIndex(i),
      data: { postId: id },
    }));
    setNodes(next);
  }, [postIds, setNodes]);

  if (postIds.length === 0) {
    return (
      <div className="flex h-full min-h-[280px] w-full flex-1 items-center justify-center px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No posts yet. Send a message in chat to generate your first canvas preview.
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.25}
        maxZoom={1.5}
        className="h-full w-full"
      >
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
