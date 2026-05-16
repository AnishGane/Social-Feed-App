import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base-api";
import type { ApiResponse } from "@/types/api";
import type { PaginatedPosts, Post, VoteType } from "@/types";

type GetPostsResponse = ApiResponse<PaginatedPosts>;

type VoteResponse = ApiResponse<{
  upvotesCount: number;
  downvotesCount: number;
  score: number;
  currentUserVote: VoteType | null;
}>;

export const postApi = createApi({
  reducerPath: "postApi",

  baseQuery: baseQueryWithReauth,

  tagTypes: ["Posts"],

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

      providesTags: (_result, _error, arg) => [
        { type: "Posts", id: arg.userId },
        { type: "Posts", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useLazyGetPostsQuery,

  useGetPostByIdQuery,

  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,

  useVotePostMutation,

  useGetPostsByUserQuery,
  useLazyGetPostsByUserQuery,
} = postApi;
