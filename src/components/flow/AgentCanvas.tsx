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

const defaultNode: FeedPreviewNodeType = {
  id: "feed-preview",
  type: "feedPreview",
  position: { x: 40, y: 40 },
  data: {
    html: null,
  },
};

export type AgentCanvasProps = {
  feedCanvasHtml: string | null;
};

export function AgentCanvas({ feedCanvasHtml }: AgentCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FeedPreviewNodeType>([
    defaultNode,
  ]);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === "feed-preview"
          ? {
              ...n,
              data: { ...n.data, html: feedCanvasHtml },
            }
          : n,
      ),
    );
  }, [feedCanvasHtml, setNodes]);

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
