import { isFollowingRepo } from "../follow/follow.repository";
import {
  countPostsByUserRepo,
  getPostsStatByUserRepo,
} from "../post/post.repository";

export const buildProfileResponse = async (user: any, currentUserId?: string) => {
  const postsCount = await countPostsByUserRepo(user._id);

  const { upvotesReceived, downvotesReceived, totalScore } =
    await getPostsStatByUserRepo(user._id);

  const isFollowing = currentUserId
    ? await isFollowingRepo(currentUserId, user._id)
    : false;

  return {
    user: {
      _id: user._id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      socialLinks: user.socialLinks,
      email: user.email,
      createdAt: user.createdAt,
      bannerImage: user.bannerImage,
      isFollowing,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
    },

    stats: {
      postsCount,
      upvotesReceived,
      downvotesReceived,
      totalScore,
    },
  };
};
