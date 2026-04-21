import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function apiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return "";
  return base.replace(/\/$/, "");
}

/** Client-side: false when env is missing (list/detail queries are skipped). */
export function isPostsApiConfigured(): boolean {
  return apiBaseUrl().length > 0;
}

export type PostSummary = {
  id: number;
  post_name: string;
  user_query: string;
  session_summary: string;
  cost_to_build_post: number;
  status: string;
  created_at: string;
  parent_post_id?: number;
  error_message?: string;
};

export type PostFull = PostSummary & {
  html_content: string;
};

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl(),
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    listPosts: builder.query<
      PostSummary[],
      { limit?: number; order?: "asc" | "desc" }
    >({
      query: ({ limit = 50, order = "desc" }) => ({
        url: "/api/posts/",
        params: { limit, order },
      }),
      transformResponse: (response: { results: PostSummary[] }) =>
        response.results,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Post" as const, id })),
              { type: "Post" as const, id: "LIST" },
            ]
          : [{ type: "Post" as const, id: "LIST" }],
    }),
    getPost: builder.query<PostFull, number>({
      query: (id) => `/api/posts/${id}/`,
      providesTags: (_res, _err, id) => [{ type: "Post" as const, id }],
    }),
  }),
});

export const { useListPostsQuery, useGetPostQuery, usePrefetch } = postsApi;
