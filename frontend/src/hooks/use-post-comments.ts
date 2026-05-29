import {
  useCreateCommentMutation,
  useGetCommentsByPostQuery,
} from "@/services/comment-api";

export const usePostComments = (postId: string, enabled = true) => {
  const { data, isLoading, isFetching, isError, error } =
    useGetCommentsByPostQuery(
      {
        postId,
      },
      {
        skip: !enabled || !postId,
      },
    );
  const [createComment, createCommentState] = useCreateCommentMutation();

  const comments = data?.data.comments || [];

  const handleCreateComment = async (
    content: string,
    parentComment?: string,
  ): Promise<void> => {
    try {
      await createComment({
        postId,
        content,
        parentComment,
      }).unwrap();
    } catch (error) {
      // Re-throw to allow caller to handle, or handle here with toast/logging
      throw error;
    }
  };

  return {
    comments,

    isLoading,
    isFetching,
    isError,
    error,

    createComment: handleCreateComment,
    isCreatingComment: createCommentState.isLoading,

    totalComments: comments.length,
  };
};
