import { api } from "./api";

import type { ApiResponse } from "@/types";
import type { Comment, GetCommentResponse } from "@/types/comment";

export const commentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // create comment
    createComment: builder.mutation<
      ApiResponse<Comment>,
      {
        postId: string;
        content: string;
      }
    >({
      query: ({ postId, content }) => ({
        url: "/comments",
        method: "POST",
        body: {
          postId,
          content,
        },
      }),

      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Comments", id: postId },
        { type: "Posts", id: postId },
      ],
    }),

    // get comments by post
    getCommentsByPost: builder.query<
      GetCommentResponse,
      {
        postId: string;
        cursor?: string;
        limit?: number;
      }
    >({
      query: ({ postId, cursor, limit = 10 }) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
        });

        if (cursor) {
          params.set("cursor", cursor);
        }

        return {
          url: `/comments/post/${postId}?${params}`,
          method: "GET",
        };
      },

      providesTags: (_result, _error, { postId }) => [
        { type: "Comments", id: postId },
      ],
    }),

    // update comment
    updateComment: builder.mutation<
      ApiResponse<Comment>,
      {
        commentId: string;
        content: string;
        postId: string;
      }
    >({
      query: ({ commentId, content }) => ({
        url: `/comments/${commentId}`,
        method: "PATCH",
        body: { content },
      }),

      invalidatesTags: (_result, _error, arg) => [
        { type: "Comments", id: arg.postId },
      ],
    }),

    // delete comment
    deleteComment: builder.mutation<
      ApiResponse<null>,
      {
        commentId: string;
        postId: string;
      }
    >({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, arg) => [
        { type: "Comments", id: arg.postId },
        { type: "Posts", id: arg.postId },
      ],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsByPostQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
