import { Types } from "mongoose";
import { validateObjectId } from "../../utils/validate-object-id";

export const buildPostsPipeline = ({
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

    {
      $unwind: "$author",
    },

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

    {
      $lookup: {
        from: "votes",
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
        as: "voteDocs",
      },
    },

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

        currentUserVote: {
          $ifNull: [
            {
              $arrayElemAt: ["$voteDocs.type", 0],
            },
            null,
          ],
        },
      },
    },

    {
      $project: {
        bookmarkDocs: 0,
      },
    },
  ];
};

export const buildCountPipeline = (userId: string | Types.ObjectId) => {
  return [
    {
      $match: {
        user: validateObjectId(userId, "User"),
      },
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
      $match: {
        "post.isPublished": true,
      },
    },

    {
      $count: "total",
    },
  ];
};
