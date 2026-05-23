import { api } from "./api";

import type { ApiResponse } from "@/types/api";
import type { PaginatedPosts, Post, VoteType } from "@/types";

export type GetPostsResponse = ApiResponse<PaginatedPosts>;

export type ToggleBookmarkResponse = ApiResponse<{
  bookmarksCount: number;
  isBookmarked: boolean;
}>;

type VoteResponse = ApiResponse<{
  upvotesCount: number;
  downvotesCount: number;
  score: number;
  currentUserVote: VoteType | null;
}>;

export const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET POSTS (CURSOR PAGINATION)
    getPosts: builder.query<
      GetPostsResponse,
      { cursor?: string; limit?: number }
    >({
      query: ({ cursor, limit = 10 }) => {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (cursor) params.set("cursor", cursor);
        return {
          url: `/posts?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.posts
          ? [
              ...result.data.posts.map((post) => ({
                type: "Posts" as const,
                id: post._id,
              })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    // 2. GET SINGLE POST
    getPostById: builder.query<ApiResponse<Post>, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [{ type: "Posts", id }],
    }),

    // 3. CREATE POST
    createPost: builder.mutation<ApiResponse<Post>, FormData>({
      query: (data) => ({
        url: "/posts",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),

    // 4. DELETE POST
    deletePost: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, postId) => [
        { type: "Posts", id: postId },
        { type: "Posts", id: "LIST" },
      ],
    }),

    // 5. VOTE POST
    votePost: builder.mutation<
      VoteResponse,
      {
        postId: string;
        type: VoteType;
      }
    >({
      query: ({ postId, type }) => ({
        url: `/posts/vote`,
        method: "POST",
        body: { postId, type },
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // rollback later
        }
      },

      invalidatesTags: (_result, _error, arg) => [
        { type: "Posts", id: arg.postId },
      ],
    }),

    // 6. UPDATE POST
    updatePost: builder.mutation<
      ApiResponse<Post>,
      {
        id: string;
        data: FormData;
      }
    >({
      query: ({ id, data }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (_result, _error, arg) => [
        { type: "Posts", id: arg.id },
        { type: "Posts", id: "LIST" },
      ],
    }),

    // 7. GET POSTS BY USER
    getPostsByUser: builder.query<
      GetPostsResponse,
      {
        userId: string;
        cursor?: string;
        limit?: number;
      }
    >({
      query: ({ userId, cursor, limit = 10 }) => {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (cursor) params.set("cursor", cursor);
        return {
          url: `/posts/user/${userId}?${params.toString()}`,
          method: "GET",
        };
      },

      providesTags: (result) =>
        result?.data?.posts
          ? [
              ...result.data.posts.map((post) => ({
                type: "Posts" as const,
                id: post._id,
              })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    // 8. get voted post by user
    getVotedPostByUser: builder.query<
      GetPostsResponse,
      { cursor?: string; limit?: number }
    >({
      query: ({ cursor, limit = 10 }) => {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (cursor) params.set("cursor", cursor);
        return {
          url: `/posts/voted?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.posts
          ? [
              ...result.data.posts.map((post) => ({
                type: "Posts" as const,
                id: post._id,
              })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    // 9. Toggle bookmark of a post
    toggleBookmark: builder.mutation<
      ToggleBookmarkResponse,
      { postId: string }
    >({
      query: ({ postId }) => ({
        url: "/bookmarks",
        method: "POST",
        body: { postId },
      }),

      async onQueryStarted({ postId }, { dispatch, queryFulfilled, getState }) {
        // Find all getPosts cache entries and patch them
        const state = getState();
        const patches: Array<{ undo: () => void }> = [];

        for (const {
          endpointName,
          originalArgs,
        } of postApi.util.selectInvalidatedBy(state, [
          { type: "Posts", id: postId },
        ])) {
          if (
            endpointName === "getPosts" ||
            endpointName === "getPostsByUser" ||
            endpointName === "getVotedPostByUser"
          ) {
            const patch = dispatch(
              postApi.util.updateQueryData(
                endpointName as any,
                originalArgs,
                (draft: GetPostsResponse) => {
                  const post = draft.data?.posts?.find((p) => p._id === postId);
                  if (!post) return;
                  post.isBookmarked = !post.isBookmarked;
                  post.bookmarksCount += post.isBookmarked ? 1 : -1;
                },
              ),
            );
            patches.push(patch);
          }
        }

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },

      invalidatesTags: (_result, _error, arg) => [
        { type: "Posts", id: arg.postId },
      ],
    }),

    // 10. Get Posts Bookmarked by User
    getPostsBookmarkedByUser: builder.query<
      GetPostsResponse,
      { cursor?: string; limit?: number }
    >({
      query: ({ cursor, limit = 10 }) => {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (cursor) params.set("cursor", cursor);
        return {
          url: `/posts/bookmarked?${params.toString()}`,
          method: "GET",
        };
      },

      providesTags: (result) =>
        result?.data?.posts
          ? [
              ...result.data.posts.map((post) => ({
                type: "Posts" as const,
                id: post._id,
              })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useLazyGetPostsQuery,

  useGetPostByIdQuery,

  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,

  useVotePostMutation,

  useToggleBookmarkMutation,

  useGetPostsByUserQuery,
  useLazyGetPostsByUserQuery,

  useLazyGetVotedPostByUserQuery,

  useLazyGetPostsBookmarkedByUserQuery,
} = postApi;
