// DB Queries all here

import { Types, isValidObjectId } from "mongoose";
import postModel, { IPost } from "./post.model";
import voteModel from "../vote/vote.model";
import { validateObjectId } from "../../utils/validate-object-id";
import { buildCountPipeline, buildPostsPipeline } from "./post.aggregation";
import bookmarkModel from "../bookmark/bookmark.model";

export const createPostRepo = (data: Partial<IPost>) => postModel.create(data);

export const updatePostRepo = (
  id: string | Types.ObjectId,
  data: Partial<IPost>,
): Promise<IPost | null> =>
  postModel.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    { new: true, runValidators: true },
  );

export const deletePostRepo = (id: string | Types.ObjectId) =>
  postModel.findByIdAndDelete(id);

export const findPostByIdRepo = (id: string | Types.ObjectId) =>
  postModel.findById(id);

export const getPostsRepo = async (
  currentUserId?: string | Types.ObjectId,
  cursor?: string,
  limit = 10,
) => {
  const matchStage: any = {
    isPublished: true,
  };

  if (cursor) {
    if (!isValidObjectId(cursor)) {
      throw new Error("Invalid cursor format");
    }

    matchStage._id = {
      $lt: validateObjectId(cursor, "Cursor"),
    };
  }

  const pipeline = buildPostsPipeline({
    currentUserId,
    matchStage,
    limit,
  });

  const posts = await postModel.aggregate(pipeline);

  const nextCursor =
    posts.length === limit ? posts[posts.length - 1]._id.toString() : null;

  return {
    posts,
    nextCursor,
  };
};

export const getPostsByUserRepo = async (
  currentUserId: string | Types.ObjectId | undefined,
  userId: string | Types.ObjectId,
  cursor?: string,
  limit = 10,
) => {
  const matchStage: any = {
    author: userId,
    isPublished: true,
  };

  if (cursor) {
    if (!isValidObjectId(cursor)) {
      throw new Error("Invalid cursor format");
    }

    matchStage._id = {
      $lt: validateObjectId(cursor, "Cursor"),
    };
  }

  const pipeline = buildPostsPipeline({
    currentUserId,
    matchStage,
    limit,
  });

  const posts = await postModel.aggregate(pipeline);

  const nextCursor =
    posts.length === limit ? posts[posts.length - 1]._id.toString() : null;

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

// get the post that is voted by the user
export const getVotedPostByUserRepo = async (
  userId: string | Types.ObjectId,
  cursor?: string,
  limit = 10,
) => {
  const matchStage: any = {
    user: validateObjectId(userId, "User"),
  };

  if (cursor) {
    if (!isValidObjectId(cursor)) {
      throw new Error("Invalid cursor format");
    }

    matchStage._id = {
      $lt: validateObjectId(cursor, "Cursor"),
    };
  }

  const pipeline = buildPostsPipeline({
    currentUserId: userId,

    prependStages: [
      {
        $lookup: {
          from: "posts",
          localField: "post",
          foreignField: "_id",
          as: "post",
        },
      },

      {
        $unwind: "$post",
      },

      {
        $replaceRoot: {
          newRoot: "$post",
        },
      },
    ],

    matchStage: {
      isPublished: true,
    },

    limit,
  });

  const countPipeline = buildCountPipeline(userId);

  const [posts, countResult] = await Promise.all([
    voteModel.aggregate([
      {
        $match: matchStage,
      },

      ...pipeline,
    ]),
    voteModel.aggregate(countPipeline),
  ]);

  const nextCursor =
    posts.length === limit ? posts[posts.length - 1]._id.toString() : null;

  return {
    posts,
    nextCursor,
    totalCount: countResult[0]?.total || 0,
  };
};

// get the post that is bookmarked by the user
export const getBookmarkedPostsByUserRepo = async (
  userId: string | Types.ObjectId,
  cursor?: string,
  limit = 10,
) => {
  const userObjectId = validateObjectId(userId, "User");

  const matchStage: any = {
    user: userObjectId,
  };

  if (cursor) {
    if (!isValidObjectId(cursor)) {
      throw new Error("Invalid cursor format");
    }

    matchStage._id = {
      $lt: validateObjectId(cursor, "Cursor"),
    };
  }

  const pipeline = buildPostsPipeline({
    currentUserId: userId,
    prependStages: [
      {
        $lookup: {
          from: "posts",
          localField: "post",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: "$post",
      },
      {
        $replaceRoot: {
          newRoot: "$post",
        },
      },
    ],
    matchStage: {
      isPublished: true,
    },
    limit,
  });

  const countPipeline = buildCountPipeline(userObjectId);

  const [posts, countResult] = await Promise.all([
    bookmarkModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $sort: { _id: -1 },
      },
      ...pipeline,
    ]),
    bookmarkModel.aggregate(countPipeline),
  ]);

  const nextCursor =
    posts.length === limit ? posts[posts.length - 1]._id.toString() : null;

  return {
    posts,
    nextCursor,
    totalCount: countResult[0]?.total || 0,
  };
};
