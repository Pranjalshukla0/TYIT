import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

// API response type definitions
interface RefreshResponse {
  accessToken: string;
  user: any;
}

interface LoadUserResponse {
  activationToken: string;
  user: any;
}

// Configure the base API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI, // Ensure this is set in .env
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");

      if (typeof window !== "undefined") {
        // Only access localStorage in the browser
        const token = localStorage.getItem("authToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
    credentials: "include", // Ensures cookies are sent with requests
  }),
  endpoints: (builder) => ({
    refreshToken: builder.query<RefreshResponse, void>({
      query: () => ({
        url: "refresh",
        method: "GET",
      }),
    }),
    loadUser: builder.query<LoadUserResponse, void>({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("User loaded successfully:", result.data);
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.error( error);
        }
      },
    }),
  }),
});

// Export hooks for usage in components
export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
