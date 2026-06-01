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
        const patches: Array<{ undo: () => void }> = [];

        const state = getState();

        // --------------------------
        // Profile page cache
        // --------------------------

        for (const username of userApi.util.selectCachedArgsForQuery(
          state,
          "getProfile",
        )) {
          patches.push(
            dispatch(
              userApi.util.updateQueryData("getProfile", username, (draft) => {
                const profileUser = draft.data?.user;

                if (!profileUser || profileUser._id !== userId) return;

                profileUser.isFollowing = !profileUser.isFollowing;

                profileUser.followersCount += profileUser.isFollowing ? 1 : -1;
              }),
            ),
          );
        }

        // --------------------------
        // All post feeds
        // --------------------------

        const updatePostAuthors = (draft: any) => {
          const posts = draft?.data?.posts;

          if (!posts) return;

          posts.forEach((post: any) => {
            if (post.author._id !== userId) return;

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

        // --------------------------
        // Search users cache
        // --------------------------

        for (const search of userApi.util.selectCachedArgsForQuery(
          state,
          "searchUsers",
        )) {
          patches.push(
            dispatch(
              userApi.util.updateQueryData("searchUsers", search, (draft) => {
                draft.data?.forEach((user) => {
                  if (user._id !== userId) return;

                  user.isFollowing = !user.isFollowing;
                });
              }),
            ),
          );
        }

        try {
          const { data } = await queryFulfilled;
          const isFollowing = data.data.isFollowing;
          // Sync with actual server response
          for (const username of userApi.util.selectCachedArgsForQuery(
            getState(),
            "getProfile",
          )) {
            dispatch(
              userApi.util.updateQueryData("getProfile", username, (draft) => {
                const profileUser = draft.data?.user;
                if (!profileUser || profileUser._id !== userId) return;
                if (profileUser.isFollowing !== isFollowing) {
                  profileUser.followersCount += isFollowing ? 1 : -1;
                  profileUser.isFollowing = isFollowing;
                }
              }),
            );
          }
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },

      invalidatesTags: ["Follow"],
    }),

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
