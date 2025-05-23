import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: (avatar: string) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),
    }),
    editProfile: builder.mutation({
      query: ({ name }) => ({
        url: "update-user-Info",
        method: "PUT",
        body: { name },
        credentials: "include" as const,
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "update-user-password",
        method: "PUT",
        body: { oldPassword, newPassword },
        credentials: "include" as const,
      }),
    }),

    
    getAllUsers: builder.query({
      query: () => ({
        url: "get-users",
        method: "GET",
        credentials: "include" as const,
       
      }),
    }),

    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `update-user/${userId}`,
        method: "PUT",
        body: { role },
        credentials: "include" as const,
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId: string) => ({
        url: `delete-user/${userId}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),

});
export const {
  useUpdateAvatarMutation,
  useEditProfileMutation,
  useUpdatePasswordMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
 useDeleteUserMutation
} = userApi;
