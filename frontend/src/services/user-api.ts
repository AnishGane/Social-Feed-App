import { api } from "./api";

import type { ApiResponse, ProfileResponse, User } from "@/types";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // me
    getMe: builder.query<ApiResponse<ProfileResponse>, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),

      providesTags: [{ type: "Users", id: "ME" }],
    }),

    // profile
    getProfile: builder.query<ApiResponse<ProfileResponse>, string>({
      query: (username) => ({
        url: `/users/${username}`,
        method: "GET",
      }),

      providesTags: (_result, _error, username) => [
        { type: "Users", id: username },
      ],
    }),

    // update profile
    updateProfile: builder.mutation<ApiResponse<User>, FormData>({
      query: (data) => ({
        url: "/users/me",
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: [{ type: "Users", id: "ME" }, "Users"],
    }),
  }),
});

export const { useGetMeQuery, useGetProfileQuery, useUpdateProfileMutation } =
  userApi;
