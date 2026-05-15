import { authApi } from "@/services/auth-api";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/auth-slice";
import { postApi } from "@/services/post-api";
import { userApi } from "@/services/user-api";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    [authApi.reducerPath]: authApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      postApi.middleware,
      userApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
