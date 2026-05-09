import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base-api";

export type User = {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
};

type AuthApisResponse = {
  success: boolean;
  message: string;
  data: {
    user?: User;
    accessToken?: string;
  } | null;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    //1. register
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    // 2. login
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    // 3. LogoutAPI
    logoutApi: builder.mutation<AuthApisResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    // 4. refresh
    refresh: builder.mutation<AuthApisResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    // 5. me(user's own data)
    me: builder.query<AuthApisResponse, void>({
      query: () => "/auth/me",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutApiMutation,
  useRefreshMutation,
  useMeQuery,
  useLazyMeQuery,
} = authApi;
