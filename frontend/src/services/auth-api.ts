import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base-api";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types";
import type { LoginSchemaType, SignupSchemaType } from "@/schema/auth-schema";

export type AuthResponse = ApiResponse<{
  user: User;
  accessToken: string;
}>;

export type RefreshResponse = ApiResponse<{
  accessToken: string;
}>;

export type LogoutResponse = ApiResponse<null>;

export type MeResponse = ApiResponse<User>;

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    //1. register
    register: builder.mutation<AuthResponse, SignupSchemaType>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    // 2. login
    login: builder.mutation<AuthResponse, LoginSchemaType>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    // 3. LogoutAPI
    logoutApi: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    // 4. refresh
    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    // 5. me(user's own data)
    me: builder.query<MeResponse, void>({
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
