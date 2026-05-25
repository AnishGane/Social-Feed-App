import { Types } from "mongoose";
import { validateObjectId } from "../../utils/validate-object-id";

export const buildGetCommentsByPostPipeline = ({
  currentUserId,
}: {
  currentUserId?: string | Types.ObjectId;
}) => {
  return [
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },

    //The $unwind operation will fail if the author lookup returns an empty array (e.g., if the author account was deleted). This would cause the entire aggregation to throw an error.
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: "comments",
        let: {
          commentId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$parentComment", "$$commentId"],
              },
            },
          },

          {
            $count: "count",
          },
        ],
        as: "repliesCount",
      },
    },

    {
      $addFields: {
        repliesCount: {
          $ifNull: [
            {
              $arrayElemAt: ["$repliesCount.count", 0],
            },
            0,
          ],
        },

        isOwner: currentUserId
          ? {
              $eq: ["$author._id", validateObjectId(currentUserId, "User")],
            }
          : false,
      },
    },

    {
      $project: {
        content: 1,
        post: 1,
        parentComment: 1,
        createdAt: 1,
        updatedAt: 1,
        isEdited: 1,
        repliesCount: 1,
        isOwner: 1,

        "author._id": 1,
        "author.username": 1,
      },
    },
  ];
};
