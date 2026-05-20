import { Types } from "mongoose";
import { validateObjectId } from "../../utils/validate-object-id";

export const buildPostsPipeline = ({
  currentUserId,
  matchStage,
  limit,
}: {
  currentUserId?: string | Types.ObjectId;
  matchStage: any;
  limit: number;
}) => {
  const pipeline: any[] = [
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
    /**
     * AUTHOR
     */
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: "$author",
    },
    /**
     * BOOKMARK LOOKUP
     */
    {
      $lookup: {
        from: "bookmarks",
        let: {
          postId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$post", "$$postId"],
                  },

                  {
                    $eq: [
                      "$user",
                      currentUserId
                        ? validateObjectId(currentUserId, "User")
                        : null,
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: "bookmarkDocs",
      },
    },
    /**
     * COMPUTED FIELDS
     */
    {
      $addFields: {
        isBookmarked: {
          $gt: [{ $size: "$bookmarkDocs" }, 0],
        },
        author: {
          _id: "$author._id",
          username: "$author.username",
          avatar: "$author.avatar",
          name: "$author.name",
        },
      },
    },

    /**
     * CLEANUP
     */
    {
      $project: {
        bookmarkDocs: 0,
      },
    },
  ];

  return pipeline;
};
