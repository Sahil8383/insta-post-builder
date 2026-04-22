"use client";

import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type NodeTypes,
  type OnInit,
  SelectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
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

const fitViewOptions = {
  padding: { top: 0.2, bottom: 0.2, left: 0.2, right: 0.2 } as const,
  duration: 0,
};

const proOptions = { hideAttribution: true } as const;

const defaultViewport = { x: 0, y: 0, zoom: 1 } as const;

const reactFlowStyle = { backgroundColor: "transparent" } as const;

const backgroundLineColor: Record<"light" | "dark", string> = {
  light: "#e2e8f0",
  dark: "#27272a",
};

function layoutNodes(postIds: number[]): FeedPreviewNodeType[] {
  return postIds.map((id, i) => ({
    id: `post-${id}`,
    type: "feedPreview" as const,
    position: layoutForIndex(i),
    data: { postId: id },
  }));
}

type AgentFlowInnerProps = { postIds: number[] };

function AgentFlowInner({ postIds }: AgentFlowInnerProps) {
  const { theme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState<FeedPreviewNodeType>(
    [],
  );
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();

  const postIdsKey = postIds.join("\0");

  useEffect(() => {
    setNodes(layoutNodes(postIds));
    const t = window.setTimeout(() => {
      void fitView(fitViewOptions);
    }, 100);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- postIds matches postIdsKey for this render
  }, [postIdsKey, setNodes, fitView]);

  const onInit: OnInit<FeedPreviewNodeType, Edge> = useCallback((instance) => {
    if (instance.getNodes().length > 0) {
      void instance.fitView({ ...fitViewOptions });
    }
  }, []);

  return (
    <ReactFlow<FeedPreviewNodeType>
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView={false}
      onInit={onInit}
      fitViewOptions={fitViewOptions}
      onlyRenderVisibleElements={false}
      minZoom={0.05}
      maxZoom={3}
      defaultViewport={defaultViewport}
      style={reactFlowStyle}
      zoomOnScroll
      zoomOnPinch
      zoomOnDoubleClick
      panOnScroll
      panOnScrollSpeed={0.8}
      preventScrolling
      zoomActivationKeyCode={["Meta", "Control"]}
      panActivationKeyCode={null}
      noDragClassName="nodrag"
      multiSelectionKeyCode={null}
      deleteKeyCode={null}
      selectionKeyCode={null}
      proOptions={proOptions}
      attributionPosition="bottom-left"
      nodesConnectable={false}
      selectNodesOnDrag={false}
      elementsSelectable
      selectionMode={SelectionMode.Partial}
      panOnDrag
      onNodesDelete={() => {}}
      onEdgesDelete={() => {}}
      className="h-full w-full"
    >
      <Background
        variant={BackgroundVariant.Lines}
        gap={50}
        size={0.08}
        color={backgroundLineColor[theme]}
      />
    </ReactFlow>
  );
}

export type AgentCanvasProps = {
  postIds: number[];
};

export function AgentCanvas({ postIds }: AgentCanvasProps) {
  if (postIds.length === 0) {
    return (
      <div className="flex h-full min-h-[280px] w-full flex-1 items-center justify-center px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No posts yet. Send a message in chat to generate your first canvas
        preview.
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <AgentFlowInner postIds={postIds} />
      </ReactFlowProvider>
    </div>
  );
}
