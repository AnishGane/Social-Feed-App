// DB Queries all here

import { Types, isValidObjectId } from "mongoose";
import postModel, { IPost } from "./post.model";

export const createPostRepo = (data: Partial<IPost>) => postModel.create(data);

export const updatePostRepo = (
  id: string | Types.ObjectId,
  data: Partial<IPost>,
): Promise<IPost | null> =>
  postModel.findByIdAndUpdate(id, {
    $set: data,
  }, { new: true, runValidators: true });

export const deletePostRepo = (id: string | Types.ObjectId) =>
  postModel.findByIdAndDelete(id);

export const findPostByIdRepo = (id: string | Types.ObjectId) =>
  postModel.findById(id);

export const getPostsRepo = async (cursor?: string, limit = 10) => {
  const query: any = {
    isPublished: true,
  };

  if (cursor) {
    if (!isValidObjectId(cursor)) {
      throw new Error("Invalid cursor format");
    }
    query._id = {
      $lt: new Types.ObjectId(cursor),
    };
  }

  const posts = await postModel
    .find(query)
    .populate("author", "username avatar")
    .sort({ _id: -1 })
    .limit(limit);

  const nextCursor =
    posts.length === limit ? posts[posts.length - 1]._id : null;

  return {
    posts,
    nextCursor,
  };
};

export const getPostsByUserRepo = async (
  userId: string | Types.ObjectId,
  cursor?: string,
  limit = 10,
) => {
  const query: any = {
    author: userId,
    isPublished: true,
  };

  if (cursor) {
    if (!isValidObjectId(cursor)) {
      throw new Error("Invalid cursor format");
    }
    query._id = {
      $lt: new Types.ObjectId(cursor),
    };
  }

  const posts = await postModel
    .find(query)
    .populate("author", "username avatar")
    .sort({ _id: -1 })
    .limit(limit);

  const nextCursor =
    posts.length === limit ? posts[posts.length - 1]._id : null;

  return {
    posts,
    nextCursor,
  };
};

export const countPostsByUserRepo = (userId: string | Types.ObjectId) => {
  return postModel.countDocuments({ author: userId, isPublished: true });
};

export const getPostsStatByUserRepo = async (
  userId: string | Types.ObjectId,
) => {
  const stats = await postModel.aggregate([
    {
      $match: {
        author: new Types.ObjectId(userId),
        isPublished: true,
      },
    },

    {
      $group: {
        _id: null,

        upvotesReceived: {
          $sum: "$upvotesCount",
        },

        downvotesReceived: {
          $sum: "$downvotesCount",
        },

        totalScore: {
          $sum: "$score",
        },
      },
    },
  ]);

  return (
    stats[0] || {
      upvotesReceived: 0,
      downvotesReceived: 0,
      totalScore: 0,
    }
  );
};
