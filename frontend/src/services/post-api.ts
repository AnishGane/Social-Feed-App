import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base-api";
import type { ApiResponse } from "@/types/api";
import type { CreatePostInput, Post, VoteType } from "@/types";

type GetPostsResponse = ApiResponse<Post[]>;

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
    // 1. get posts with infinite scroll
    getPosts: builder.query<
      GetPostsResponse,
      { skip?: number; limit?: number }
    >({
      query: ({ skip = 0, limit = 10 }) => ({
        url: `/posts?skip=${skip}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    // 2. get single post
    getPostById: builder.query<ApiResponse<Post>, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "GET",
      }),
    }),

    // 3. create post
    createPost: builder.mutation<ApiResponse<Post>, CreatePostInput>({
      query: (data) => ({
        url: "/posts",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Posts"],
    }),

    // 4. delete post
    deletePost: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Posts"],
    }),

    // 5. vote post
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

      invalidatesTags: ["Posts"],
    }),

    // 6. update post
    updatePost: builder.mutation<
      ApiResponse<Post>,
      {
        id: string;
        data: Partial<CreatePostInput>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: ["Posts"],
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
} = postApi;
