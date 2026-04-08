export const TOOL_META: Record<string, { label: string }> = {
  analyze_request: { label: "Analyze request" },
  web_search: { label: "Web search" },
  write_caption: { label: "Write caption" },
  critique_caption: { label: "Critique caption" },
  pick_hashtags: { label: "Pick hashtags" },
  fetch_stock_media: { label: "Stock media" },
  generate_image: { label: "Generate image" },
  build_feed_canvas_html: { label: "Build feed canvas" },
  submit_post_package: { label: "Submit post" },
  submit_insights: { label: "Submit insights" },
};

export function toolHeading(name: string): { label: string } {
  return (
    TOOL_META[name] ?? {
      label: name.replace(/_/g, " "),
    }
  );
}
