import { Types } from "mongoose";

export const buildFollowersPipeline = (currentUserId?: Types.ObjectId) => [
  {
    $lookup: {
      from: "users",
      localField: "follower",
      foreignField: "_id",
      pipeline: [
        {
          $project: {
            username: 1,
            name: 1,
            avatar: 1,
          },
        },
      ],
      as: "user",
    },
  },

  {
    $unwind: "$user",
  },

  {
    $lookup: {
      from: "follows",
      let: { profileId: "$user._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$follower", currentUserId] },
                { $eq: ["$following", "$$profileId"] },
              ],
            },
          },
        },
        { $limit: 1 },
      ],
      as: "viewerFollow",
    },
  },

  {
    $lookup: {
      from: "follows",
      let: { profileId: "$user._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$follower", "$$profileId"] },
                { $eq: ["$following", currentUserId] },
              ],
            },
          },
        },
        { $limit: 1 },
      ],
      as: "profileFollowsViewer",
    },
  },

  {
    $project: {
      cursor: "$_id", // follow doc id for pagination

      _id: "$user._id",
      username: "$user.username",
      name: "$user.name",
      avatar: "$user.avatar",

      isFollowing: {
        $gt: [{ $size: "$viewerFollow" }, 0],
      },

      isMutual: {
        $and: [
          { $gt: [{ $size: "$viewerFollow" }, 0] },
          { $gt: [{ $size: "$profileFollowsViewer" }, 0] },
        ],
      },
    },
  },
];

export const buildFollowingPipeline = (currentUserId?: Types.ObjectId) => [
  {
    $lookup: {
      from: "users",
      localField: "following",
      foreignField: "_id",
      pipeline: [
        {
          $project: {
            username: 1,
            name: 1,
            avatar: 1,
          },
        },
      ],
      as: "user",
    },
  },

  {
    $unwind: "$user",
  },

  {
    $lookup: {
      from: "follows",
      let: { profileId: "$user._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$follower", currentUserId] },
                { $eq: ["$following", "$$profileId"] },
              ],
            },
          },
        },
        { $limit: 1 },
      ],
      as: "viewerFollow",
    },
  },

  {
    $lookup: {
      from: "follows",
      let: { profileId: "$user._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$follower", "$$profileId"] },
                { $eq: ["$following", currentUserId] },
              ],
            },
          },
        },
        { $limit: 1 },
      ],
      as: "profileFollowsViewer",
    },
  },

  {
    $project: {
      cursor: "$_id",

      _id: "$user._id",
      username: "$user.username",
      name: "$user.name",
      avatar: "$user.avatar",

      isFollowing: {
        $gt: [{ $size: "$viewerFollow" }, 0],
      },

      isMutual: {
        $and: [
          { $gt: [{ $size: "$viewerFollow" }, 0] },
          { $gt: [{ $size: "$profileFollowsViewer" }, 0] },
        ],
      },
    },
  },
];
