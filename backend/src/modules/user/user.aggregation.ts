import { Types } from "mongoose";

export const buildUserProfilePipeline = (currentUserId?: Types.ObjectId) => [
  {
    $lookup: {
      from: "follows",
      let: {
        profileId: "$_id",
        viewerId: currentUserId ?? null,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$follower", "$$viewerId"] },
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
    $addFields: {
      isFollowing: {
        $gt: [{ $size: "$viewerFollow" }, 0],
      },
    },
  },

  {
    $project: {
      viewerFollow: 0,
    },
  },
];
