import type { ToolCallEntry } from "@/types/agent-stream";

export const dummyToolCallsForTimeline: ToolCallEntry[] = [
  {
    id: "call-00",
    name: "analyze_request",
    status: "done",
    argumentBuffer: '{"user_request":"Coffee shop reel for Gen Z"}',
    argsPreview: '{"user_request":"Coffee shop reel for Gen Z","media_mode":"auto"}',
    resultPreview: [
      "Intent: CREATE",
      "Web search: no",
      "Plan: write_caption → pick_hashtags → fetch_stock_media → build_feed_canvas_html → submit_post_package",
      "Note: Enough context to draft without search; stock visual per auto mode.",
    ].join("\n"),
  },
  // Still buffering args — shows “Preparing tool input…”
  {
    id: "call-01",
    name: "web_search",
    status: "running",
    argumentBuffer: "",
  },
  // Args streaming (invalid JSON until end) — header Running, body mostly empty
  {
    id: "call-02",
    name: "write_caption",
    status: "running",
    argumentBuffer:
      '{"topic":"Slow mornings in Lisbon","tone":"warm","length":"medium"',
  },
  // Finished tools (order matches a plausible pipeline)
  {
    id: "call-03",
    name: "web_search",
    status: "done",
    argumentBuffer: '{"query":"specialty coffee trends 2026"}',
    argsPreview: '{"query":"specialty coffee trends 2026"}',
    resultPreview: `Research notes:

- Third wave coffee and origin storytelling
Consumers still respond to transparent sourcing and micro-lot stories.
https://example.com/coffee-trends

- Morning rituals and “quiet luxury” cafés
Short captions about light, texture, and calm perform well on feeds.
https://example.com/morning-rituals`,
  },
  {
    id: "call-04",
    name: "write_caption",
    status: "done",
    argumentBuffer:
      '{"topic":"Local roastery flat lay","tone":"poetic","length":"short"}',
    argsPreview:
      '{"topic":"Local roastery flat lay","tone":"poetic","length":"short"}',
    resultPreview:
      "Golden hour on the bar. \n\nYour corner. Your cup. \n\n#coffee #morning",
  },
  {
    id: "call-05",
    name: "critique_caption",
    status: "done",
    argumentBuffer: "{}",
    argsPreview: "{}",
    resultPreview:
      "Strengths: clear sensory hook. \n\nTry: shorten the second line for mobile skimming; avoid repeating “your” twice in two lines.",
  },
  {
    id: "call-06",
    name: "pick_hashtags",
    status: "done",
    argumentBuffer:
      '{"topic":"specialty coffee","caption":"Golden hour on the bar…"}',
    argsPreview:
      '{"topic":"specialty coffee","caption":"Golden hour on the bar…"}',
    resultPreview:
      "#specialtycoffee #thirdwave #coffeeshopcorners #morninglight #baristadaily",
  },
  {
    id: "call-07",
    name: "fetch_stock_media",
    status: "done",
    argumentBuffer:
      '{"query":"espresso machine cafe warm light","media_type":"photo","orientation":"landscape"}',
    argsPreview:
      '{"query":"espresso machine cafe warm light","media_type":"photo","orientation":"landscape"}',
    resultPreview: JSON.stringify({
      image_url: "https://picsum.photos/seed/coffee-timeline/800/600",
      photographer: "Pexels Artist (dummy)",
      pexels_page_url: "https://www.pexels.com/",
      alt_text: "Warm light over an espresso machine",
      media_type: "photo",
    }),
  },
  {
    id: "call-08",
    name: "generate_image",
    status: "done",
    argumentBuffer: '{"prompt":"flat lay coffee magazine"}',
    argsPreview: '{"prompt":"flat lay coffee magazine"}',
    resultPreview: JSON.stringify({
      image_url: "https://picsum.photos/seed/generated-canvas/800/800",
      revised_prompt:
        "Flat lay of a ceramic cup, beans, and soft window light, editorial food photography.",
    }),
  },
  {
    id: "call-09",
    name: "build_feed_canvas_html",
    status: "done",
    argumentBuffer:
      '{"overlay_text":"Golden hour","image_url":"https://picsum.photos/seed/overlay/400/400"}',
    argsPreview:
      '{"overlay_text":"Golden hour","image_url":"https://picsum.photos/seed/overlay/400/400"}',
    resultPreview: JSON.stringify({
      html: "<!doctype html><html><body><div>…</div></body></html>",
      width_px: 1080,
      height_px: 1350,
      format_preset: "portrait_4_5",
    }),
  },
  {
    id: "call-10",
    name: "submit_post_package",
    status: "done",
    argumentBuffer: "{}",
    argsPreview: "{}",
    resultPreview: "{}",
  },
  {
    id: "call-11",
    name: "submit_insights",
    status: "done",
    argumentBuffer: "{}",
    argsPreview: "{}",
    resultPreview: "{}",
  },
  {
    id: "call-12",
    name: "some_future_tool",
    status: "done",
    argumentBuffer: '{"foo":true}',
    argsPreview: '{"foo":true}',
    resultPreview: '{"bar":[1,2,3]}',
  },
];
