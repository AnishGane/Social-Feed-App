import { api } from "./api";

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

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // register
    register: builder.mutation<AuthResponse, SignupSchemaType>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    // login
    login: builder.mutation<AuthResponse, LoginSchemaType>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // logout
    logoutApi: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // refresh
    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),

    // me
    me: builder.query<MeResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
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
