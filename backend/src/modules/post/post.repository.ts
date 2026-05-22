import { PipelineStage, Types, isValidObjectId } from "mongoose";
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

export const findPostByIdRepo = async (
  currentUserId: string | Types.ObjectId | undefined,
  id: string | Types.ObjectId,
) => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        _id: validateObjectId(id, "Post"),
        isPublished: true,
      },
    },

    ...buildPostsPipeline({
      currentUserId,
    }),
  ];

  const posts = await postModel.aggregate(pipeline);

  return posts[0] || null;
};

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

  const posts = await postModel.aggregate([
    {
      $match: matchStage,
    },
    {
      $sort: {
        _id: -1,
      },
    },

    {
      $limit: limit,
    },

    ...buildPostsPipeline({
      currentUserId,
    }),
  ]);

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

  const posts = await postModel.aggregate([
    {
      $match: matchStage,
    },

    {
      $sort: {
        _id: -1,
      },
    },

    {
      $limit: limit,
    },

    ...buildPostsPipeline({
      currentUserId,
    }),
  ]);

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

  const countPipeline = buildCountPipeline(userId);

  const [posts, countResult] = await Promise.all([
    voteModel.aggregate([
      {
        $match: matchStage,
      },

      {
        $sort: {
          _id: -1,
        },
      },

      {
        $limit: limit,
      },

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

      {
        $match: {
          isPublished: true,
        },
      },

      ...buildPostsPipeline({
        currentUserId: userId,
      }),
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

  const countPipeline = buildCountPipeline(userObjectId);

  const [posts, countResult] = await Promise.all([
    bookmarkModel.aggregate([
      {
        $match: matchStage,
      },

      {
        $sort: {
          _id: -1,
        },
      },

      {
        $limit: limit,
      },

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

      {
        $match: {
          isPublished: true,
        },
      },

      ...buildPostsPipeline({
        currentUserId: userId,
      }),
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
