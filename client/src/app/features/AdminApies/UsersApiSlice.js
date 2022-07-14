import {apiSlice} from "../../api/apiSlice";

const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: ({token}) => ({
                url: "/admin/users",
                headers: {
                    authorization: `Bearer ${token}`
                },
                method: "get"
            })
        }),
        getUser: builder.query({
            query: ({token, id}) => ({
                url: `/admin/users/${id}`,
                headers: {
                    authorization: `Bearer ${token}`
                },
                method: "get"
            })
        }),
        updateUser: builder.mutation({
            query: ({token, id, body}) => ({
                url: `/admin/users/${id}`,

                headers: {
                    authorization: `Bearer ${token}`
                },
                method: "put",
                body: body
            })
        })
    })
})

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useUpdateUserMutation,
} = usersApiSlice