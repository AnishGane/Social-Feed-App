import { PipelineStage, Types } from "mongoose";
import { validateObjectId } from "../../utils/validate-object-id";

export const buildGetCommentsByPostPipeline = ({
  currentUserId,
}: {
  currentUserId?: string | Types.ObjectId;
}) => {
  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },

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
  ];

  if (currentUserId) {
    pipeline.push({
      $lookup: {
        from: "commentlikes",
        let: {
          commentId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$comment", "$$commentId"],
                  },
                  {
                    $eq: ["$user", validateObjectId(currentUserId, "User")],
                  },
                ],
              },
            },
          },
          {
            $limit: 1,
          },
        ],
        as: "liked",
      },
    });
  }

  pipeline.push(
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

        isLiked: currentUserId
          ? {
              $gt: [
                {
                  $size: {
                    $ifNull: ["$liked", []],
                  },
                },
                0,
              ],
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

        likesCount: 1,
        repliesCount: 1,

        isOwner: 1,
        isLiked: 1,

        "author._id": 1,
        "author.username": 1,
      },
    },
  );

  return pipeline;
};
