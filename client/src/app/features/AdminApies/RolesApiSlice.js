import {apiSlice} from "../../api/apiSlice";

const RolesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRoles: builder.query({
            query: ({token}) => ({
                url: "/admin/roles",
                headers: {
                    authorization: `Bearer ${token}`
                },
                method: "get"
            })
        }),
        createRole: builder.mutation({
            query: ({token, body}) => ({
                url: "/admin/roles",
                headers: {
                    authorization: `Bearer ${token}`
                },
                method: "post",
                body: body
            })
        }),
        updateRole: builder.mutation({
            query: ({token, id, body}) => ({
                url: `/admin/roles/${id}`,
                headers: {
                    authorization: `Bearer ${token}`
                },
                method: "put",
                body: body,
            })
        }),
        removeRole: builder.mutation({
            query: ({token, id}) => ({
                url: `/admin/roles/${id}`,
                headers: {
                    authorization: `Bearer ${token}`
                },
                method: "delete",
            })
        })
    })
})

export const {
    useGetRolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useRemoveRoleMutation
} = RolesApiSlice;