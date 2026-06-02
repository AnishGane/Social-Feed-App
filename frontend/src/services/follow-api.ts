import type {
  ApiResponse,
  FollowListResponse,
  ToggleFollowResponse,
} from "@/types";

import { api } from "./api";
import { userApi } from "./user-api";
import { postApi } from "./post-api";

export const followApi = api.injectEndpoints({
  endpoints: (builder) => ({
    toggleFollow: builder.mutation<ApiResponse<ToggleFollowResponse>, string>({
      query: (userId) => ({
        url: `/follow/${userId}`,
        method: "POST",
      }),

      async onQueryStarted(userId, { dispatch, queryFulfilled, getState }) {
        const state = getState();
        const patches: Array<{ undo: () => void }> = [];

        // ---------------- PROFILE CACHE ----------------
        for (const username of userApi.util.selectCachedArgsForQuery(
          state,
          "getProfile",
        )) {
          patches.push(
            dispatch(
              userApi.util.updateQueryData("getProfile", username, (draft) => {
                const user = draft.data?.user;
                if (!user || user._id !== userId) return;

                user.isFollowing = !user.isFollowing;
                user.followersCount += user.isFollowing ? 1 : -1;
              }),
            ),
          );
        }

        // ---------------- POSTS ----------------
        const updatePostAuthors = (draft: any) => {
          const posts = draft?.data?.posts;
          if (!Array.isArray(posts)) return;

          posts.forEach((post: any) => {
            if (post.author?._id !== userId) return;
            post.author.isFollowing = !post.author.isFollowing;
          });
        };

        const postEndpoints = [
          "getPosts",
          "getPostsByUser",
          "getVotedPostByUser",
          "getPostsBookmarkedByUser",
        ] as const;

        for (const endpoint of postEndpoints) {
          for (const args of postApi.util.selectCachedArgsForQuery(
            state,
            endpoint,
          )) {
            patches.push(
              dispatch(
                postApi.util.updateQueryData(endpoint, args, updatePostAuthors),
              ),
            );
          }
        }

        // ---------------- SEARCH USERS ----------------
        for (const search of userApi.util.selectCachedArgsForQuery(
          state,
          "searchUsers",
        )) {
          patches.push(
            dispatch(
              userApi.util.updateQueryData("searchUsers", search, (draft) => {
                draft.data?.forEach((u) => {
                  if (u._id === userId) {
                    u.isFollowing = !u.isFollowing;
                  }
                });
              }),
            ),
          );
        }

        // ---------------- FOLLOW LISTS ----------------
        const followEndpoints = ["getFollowers", "getFollowing"] as const;

        for (const endpoint of followEndpoints) {
          for (const args of followApi.util.selectCachedArgsForQuery(
            state,
            endpoint,
          )) {
            patches.push(
              dispatch(
                followApi.util.updateQueryData(endpoint, args, (draft) => {
                  draft.data?.follows?.forEach((u) => {
                    if (u._id === userId) {
                      u.isFollowing = !u.isFollowing;
                    }
                  });
                }),
              ),
            );
          }
        }

        try {
          const { data } = await queryFulfilled;
          const isFollowing = data.data.isFollowing;

          for (const username of userApi.util.selectCachedArgsForQuery(
            getState(),
            "getProfile",
          )) {
            dispatch(
              userApi.util.updateQueryData("getProfile", username, (draft) => {
                const user = draft.data?.user;
                if (!user || user._id !== userId) return;

                if (user.isFollowing !== isFollowing) {
                  user.followersCount += isFollowing ? 1 : -1;
                  user.isFollowing = isFollowing;
                }
              }),
            );
          }
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),

    // GET FOLLOWERS
    getFollowers: builder.query<
      ApiResponse<FollowListResponse>,
      {
        userId: string;
        cursor?: string;
        limit?: number;
      }
    >({
      query: ({ userId, cursor, limit = 20 }) => ({
        url: `/follow/${userId}/followers`,
        params: {
          cursor,
          limit,
        },
      }),

      providesTags: ["Follow"],
    }),

    // GET FOLLOWING
    getFollowing: builder.query<
      ApiResponse<FollowListResponse>,
      {
        userId: string;
        cursor?: string;
        limit?: number;
      }
    >({
      query: ({ userId, cursor, limit = 20 }) => ({
        url: `/follow/${userId}/following`,
        params: {
          cursor,
          limit,
        },
      }),

      providesTags: ["Follow"],
    }),
  }),
});

export const {
  useToggleFollowMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
} = followApi;
