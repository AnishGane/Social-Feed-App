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
        parentComment?: string;
      }
    >({
      query: ({ postId, content, parentComment }) => ({
        url: "/comments",
        method: "POST",
        body: {
          postId,
          content,
          parentComment,
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

    // get replies by comment
    getRepliesByComment: builder.query<
      GetCommentResponse,
      {
        commentId: string;
        cursor?: string;
        limit?: number;
      }
    >({
      query: ({ commentId, cursor, limit = 10 }) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
        });

        if (cursor) {
          params.set("cursor", cursor);
        }

        return {
          url: `/comments/replies/${commentId}?${params}`,
          method: "GET",
        };
      },

      providesTags: (_result, _error, { commentId }) => [
        { type: "Comments", id: `REPLIES-${commentId}` },
      ],
    }),

    // toggle like in comment
    toggleCommentLike: builder.mutation<
      ApiResponse<{
        liked: boolean;
      }>,
      {
        commentId: string;
        postId: string;
      }
    >({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}/like`,
        method: "POST",
      }),

      async onQueryStarted(
        { commentId, postId },
        { dispatch, queryFulfilled, getState },
      ) {
        const toggleLikeInDraft = (draft: GetCommentResponse) => {
          const comment = draft.data?.comments.find((c) => c._id === commentId);

          if (!comment) return;

          comment.isLiked = !comment.isLiked;
          comment.likesCount += comment.isLiked ? 1 : -1;
        };

        const syncLikedInDraft = (
          draft: GetCommentResponse,
          liked: boolean,
        ) => {
          const comment = draft.data?.comments.find((c) => c._id === commentId);

          if (!comment) return;

          comment.isLiked = liked;
        };

        const patches: Array<{ undo: () => void }> = [];

        for (const args of commentApi.util.selectCachedArgsForQuery(
          getState(),
          "getCommentsByPost",
        )) {
          if (args.postId !== postId) continue;

          patches.push(
            dispatch(
              commentApi.util.updateQueryData(
                "getCommentsByPost",
                args,
                toggleLikeInDraft,
              ),
            ),
          );
        }

        for (const args of commentApi.util.selectCachedArgsForQuery(
          getState(),
          "getRepliesByComment",
        )) {
          patches.push(
            dispatch(
              commentApi.util.updateQueryData(
                "getRepliesByComment",
                args,
                toggleLikeInDraft,
              ),
            ),
          );
        }

        try {
          const { data } = await queryFulfilled;
          const liked = data.data.liked;

          for (const args of commentApi.util.selectCachedArgsForQuery(
            getState(),
            "getCommentsByPost",
          )) {
            if (args.postId !== postId) continue;

            dispatch(
              commentApi.util.updateQueryData(
                "getCommentsByPost",
                args,
                (draft) => syncLikedInDraft(draft, liked),
              ),
            );
          }

          for (const args of commentApi.util.selectCachedArgsForQuery(
            getState(),
            "getRepliesByComment",
          )) {
            dispatch(
              commentApi.util.updateQueryData(
                "getRepliesByComment",
                args,
                (draft) => syncLikedInDraft(draft, liked),
              ),
            );
          }
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsByPostQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetRepliesByCommentQuery,
  useToggleCommentLikeMutation,
} = commentApi;
