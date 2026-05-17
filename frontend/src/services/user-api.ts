import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base-api";
import type {
  ApiResponse,
  ProfileResponse,
  User,
} from "@/types";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: baseQueryWithReauth,

  tagTypes: ["Users"],

  endpoints: (builder) => ({
    // 1. Current User/logged-in user info
    getMe: builder.query<ApiResponse<ProfileResponse>, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),

      providesTags: [{ type: "Users", id: "ME" }],
    }),

    // 2. Public Profile
    getProfile: builder.query<ApiResponse<ProfileResponse>, string>({
      query: (username) => ({
        url: `/users/${username}`,
        method: "GET",
      }),

      providesTags: (_result, _error, username) => [
        { type: "Users", id: username },
      ],
    }),

    // 3. Update Profile
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
