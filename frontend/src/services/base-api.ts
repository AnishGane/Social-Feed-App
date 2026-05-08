import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { logout, setCredentials } from "@/features/auth/auth-slice";
import { env } from "@/lib/env";

const baseQuery = fetchBaseQuery({
  baseUrl: `${env.BACKEND_URL}/api/v1`,
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.accessToken;

    // console.log("REDUX TOKEN:", token);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

let refreshPromise: Promise<any> | null = null;

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && [401, 403].includes(result.error.status as number)) {
    if (!refreshPromise) {
      refreshPromise = Promise.resolve(
        baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
          },
          api,
          extraOptions,
        ),
      ).finally(() => {
        refreshPromise = null;
      });
    }

    const refreshResult: any = await refreshPromise;

    if (refreshResult.data) {
      const newToken = refreshResult.data.data.accessToken;

      api.dispatch(
        setCredentials({
          user: (api.getState() as any).auth.user,
          accessToken: newToken,
        }),
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
