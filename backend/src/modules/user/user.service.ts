import { ApiError } from "../../utils/api-error";
import { validateObjectId } from "../../utils/validate-object-id";
import {
  countPostsByUserRepo,
  getPostsStatByUserRepo,
} from "../post/post.repository";
import {
  findUserByIdRepo,
  findUserByUsernameRepo,
  updateUserRepo,
} from "./user.repository";
import { UpdateProfileInput } from "./user.validation";

export const getProfileService = async (username: string) => {
  const user = await findUserByUsernameRepo(username);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const postsCount = await countPostsByUserRepo(user._id);

  const { upvotesReceived, downvotesReceived, totalScore } =
    await getPostsStatByUserRepo(user._id);

  return {
    user: {
      _id: user._id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      socialLinks: user.socialLinks,
      createdAt: user.createdAt,
    },
    stats: {
      postsCount,

      upvotesReceived,

      downvotesReceived,

      totalScore,
    },
  };
};

export const updateProfileService = async (
  userId: string,
  data: UpdateProfileInput,
) => {
  const userObjectId = validateObjectId(userId, "User");

  const updatedUser = await updateUserRepo(userObjectId, data);

  if (!updatedUser) {
    throw new ApiError("User not found", 404);
  }

  return {
    _id: updatedUser._id,
    username: updatedUser.username,
    name: updatedUser.name,
    bio: updatedUser.bio,
    avatar: updatedUser.avatar,
    socialLinks: updatedUser.socialLinks,
    createdAt: updatedUser.createdAt,
  };
};

export const getMeService = async (userId: string) => {
  const userObjectId = validateObjectId(userId, "User");

  const user = await findUserByIdRepo(userObjectId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const postsCount = await countPostsByUserRepo(user._id);

  const { upvotesReceived, downvotesReceived, totalScore } =
    await getPostsStatByUserRepo(user._id);

  return {
    user: {
      _id: user._id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      socialLinks: user.socialLinks,
      email: user.email, // Include email for own profile if needed
      createdAt: user.createdAt,
    },
    stats: {
      postsCount,

      upvotesReceived,

      downvotesReceived,

      totalScore,
    },
  };
};
