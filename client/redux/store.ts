"use client";

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// call the load user token function on every page load
if (typeof window !== "undefined") {
  const initializeApp = async () => {
    await store.dispatch(
      apiSlice.endpoints.loadUser.initiate(undefined, { forceRefetch: true })
    );
  };

  initializeApp();
}
