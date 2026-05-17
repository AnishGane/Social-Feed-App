import { ApiError } from "../../utils/api-error";
import uploadImageToCloudinary from "../../utils/upload-image";
import { validateImageFile } from "../../utils/validate-image";
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
      bannerImage: user.bannerImage,
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
  file: Express.Multer.File | undefined,
) => {
  const userObjectId = validateObjectId(userId, "User");

  let bannerImageUrl: string | undefined;

  if (file) {
    try {
      await validateImageFile(file);

      bannerImageUrl = await uploadImageToCloudinary(file, "social-feed-users");
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Image upload failed", 500);
    }
  }

  const updatePayload: Partial<UpdateProfileInput> = {
    ...data,
  };

  if (bannerImageUrl) {
    updatePayload.bannerImage = bannerImageUrl;
  }

  const updatedUser = await updateUserRepo(userObjectId, updatePayload);

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
    bannerImage: updatedUser.bannerImage,
    email: updatedUser.email,
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
      email: user.email,
      createdAt: user.createdAt,
      bannerImage: user.bannerImage,
    },
    stats: {
      postsCount,

      upvotesReceived,

      downvotesReceived,

      totalScore,
    },
  };
};
