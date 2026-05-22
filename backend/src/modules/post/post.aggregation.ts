import { Types } from "mongoose";
import { validateObjectId } from "../../utils/validate-object-id";

// type BuildPostsPipelineProps = {
//   currentUserId?: string | Types.ObjectId;

//   matchStage?: any;

//   limit?: number;

//   sortStage?: any;

//   prependStages?: any[];

//   appendStages?: any[];
// };

// export const buildPostsPipeline = ({
//   currentUserId,
//   matchStage = {},
//   limit,
//   sortStage = { _id: -1 },
//   prependStages = [],
//   appendStages = [],
// }: BuildPostsPipelineProps) => {
//   const pipeline: any[] = [
//     /**
//      * PRE-STAGES
//      */
//     ...prependStages,

//     /**
//      * MATCH
//      */
//     {
//       $match: matchStage,
//     },

//     /**
//      * SORT
//      */
//     {
//       $sort: sortStage,
//     },

//     /**
//      * LIMIT
//      */
//     ...(limit
//       ? [
//           {
//             $limit: limit,
//           },
//         ]
//       : []),

//     /**
//      * AUTHOR LOOKUP
//      */
//     {
//       $lookup: {
//         from: "users",
//         localField: "author",
//         foreignField: "_id",
//         as: "author",
//       },
//     },

//     {
//       $unwind: "$author",
//     },

//     /**
//      * BOOKMARK LOOKUP
//      */
//     {
//       $lookup: {
//         from: "bookmarks",
//         let: {
//           postId: "$_id",
//         },

//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $and: [
//                   {
//                     $eq: ["$post", "$$postId"],
//                   },

//                   {
//                     $eq: [
//                       "$user",
//                       currentUserId
//                         ? validateObjectId(currentUserId, "User")
//                         : null,
//                     ],
//                   },
//                 ],
//               },
//             },
//           },
//         ],

//         as: "bookmarkDocs",
//       },
//     },

//     /**
//      * COMPUTED FIELDS
//      */
//     {
//       $addFields: {
//         isBookmarked: {
//           $gt: [{ $size: "$bookmarkDocs" }, 0],
//         },

//         author: {
//           _id: "$author._id",
//           username: "$author.username",
//           avatar: "$author.avatar",
//           name: "$author.name",
//         },
//       },
//     },

//     /**
//      * CLEANUP
//      */
//     {
//       $project: {
//         bookmarkDocs: 0,
//       },
//     },

//     /**
//      * POST STAGES
//      */
//     ...appendStages,
//   ];

//   return pipeline;
// };

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

    {
      $project: {
        bookmarkDocs: 0,
      },
    },
  ];
};

export const buildCountPipeline = (userId: string | Types.ObjectId) => {
  const countPipeline = [
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

  return countPipeline;
};
