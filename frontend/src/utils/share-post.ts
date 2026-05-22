import { toast } from "sonner";

type SharePostOptions = {
  postId: string;
  title?: string;
};

export const sharePost = async ({ postId, title }: SharePostOptions) => {
  const postUrl = `${window.location.origin}/posts/${postId}`;
  try {
    // Native mobile/browser share
    if (navigator.share) {
      await navigator.share({
        title: title || "Check out this post",
        url: postUrl,
      });

      return;
    }

    // Fallback: copy link
    await navigator.clipboard.writeText(postUrl);

    toast.success("Post link copied to clipboard");
  } catch (error) {
    console.error("Share failed:", error);

    toast.error("Failed to share post");
  }
};
