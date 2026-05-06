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
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

let refreshPromise: Promise<any> | null = null;

// wrapper for refresh logic
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // if access token expired
  if (result.error && [401, 403].includes(result.error.status as number)) {
    // try refresh
    if (!refreshPromise) {
      refreshPromise = Promise.resolve(
        baseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions),
      ).finally(() => {
        refreshPromise = null;
      });
    }

    const refreshResult: any = await refreshPromise;

    if (refreshResult.data) {
      // save new token
      api.dispatch(
        setCredentials({
          user: (api.getState() as any).auth.user,
          accessToken: refreshResult.data.accessToken,
        }),
      );

      // retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
