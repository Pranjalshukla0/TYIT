import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

// Define types for request and response
type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {
  email: string;
  password: string;
  username: string;
};

type ActivationData = {
  activation_token: string;
  activation_code: string;
};

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true, // Allows overriding existing endpoints
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "registration", // Ensure this matches the backend endpoint
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("Registration successful:", result.data);
          dispatch(
            userRegistration({
              token: result.data.activationToken, // Ensure this field exists in the response
            })
          );
        } catch (error: any) {
          console.error(error);
        }
      },
    }),
    activation: builder.mutation<void, ActivationData>({
      query: (data) => ({
        url: "activate-user", // Ensure this matches the backend endpoint
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: {
          email,
          password,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("Registration successful:", result.data);
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken, // Ensure this field exists in the response
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.error(error);
        }
      },
    }),
    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: "social-auth",
        method: "POST",
        body: {
          email,
          name,
          avatar,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("Registration successful:", result.data);
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken, // Ensure this field exists in the response
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.error(error);
        }
      },
    }),
    logout: builder.query({
      query: () => ({
        url: "logout",
        method: "GET",

        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(
            userLoggedOut()
          );
        } catch (error: any) {
          console.error(error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogoutQuery
} = authApi;
