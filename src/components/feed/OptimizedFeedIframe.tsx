"use client";

import { memo, useEffect, useId, useMemo, useRef, useState } from "react";

const DEFAULT_DESIGN = { w: 1080, h: 1080 };

export type OptimizedFeedIframeProps = {
  html: string | null;
  designWidth?: number;
  designHeight?: number;
  maxDisplaySize?: number;
  className?: string;
};

function OptimizedFeedIframeInner({
  html,
  designWidth = DEFAULT_DESIGN.w,
  designHeight = DEFAULT_DESIGN.h,
  maxDisplaySize = 400,
  className = "",
}: OptimizedFeedIframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const titleId = useId();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { root: null, rootMargin: "80px", threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scale = useMemo(() => {
    const max = Math.max(designWidth, designHeight);
    return maxDisplaySize / max;
  }, [designWidth, designHeight, maxDisplaySize]);

  const blobUrl = useMemo(() => {
    if (!html) return null;
    return URL.createObjectURL(
      new Blob([html], { type: "text/html;charset=utf-8" }),
    );
  }, [html]);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-md bg-zinc-200/80 ${className}`}
      style={{
        width: designWidth * scale,
        height: designHeight * scale,
      }}
      aria-labelledby={titleId}
    >
      {!html ? (
        <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs text-zinc-500">
          No canvas HTML yet. Run a generation that includes feed canvas.
        </div>
      ) : !visible ? (
        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
          Preview loads when visible…
        </div>
      ) : (
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: designWidth,
            height: designHeight,
            transform: `scale(${scale})`,
          }}
        >
          {visible && blobUrl ? (
            <iframe
              title="Feed canvas"
              src={blobUrl}
              className="nodrag nopan block border-0"
              style={{
                width: designWidth,
                height: designHeight,
                pointerEvents: "auto",
              }}
              sandbox=""
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

function propsEqual(a: OptimizedFeedIframeProps, b: OptimizedFeedIframeProps) {
  return (
    a.html === b.html &&
    a.designWidth === b.designWidth &&
    a.designHeight === b.designHeight &&
    a.maxDisplaySize === b.maxDisplaySize &&
    a.className === b.className
  );
}

export const OptimizedFeedIframe = memo(OptimizedFeedIframeInner, propsEqual);
