import {apiSlice} from "../../api/apiSlice";

const PermissionsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPermissions: builder.query({
            query: ({token}) => ({
                url: "/admin/permissions",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }),
            keepUnusedDataFor: 5,
        }),
        createPermissions: builder.mutation({
            query: ({token, body}) => ({
                url: "/admin/permissions",
                method: "post",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: body
            })
        }),
        updatePermissions: builder.mutation({
            query: ({token, body, id}) => ({
                url: `/admin/permissions/${id}`,
                method: "put",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: body
            })
        }),
        deletePermissions: builder.mutation({
            query: ({token, id}) => ({
                url: `/admin/permissions/${id}`,
                method: "delete",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
        }),
    })
})


export const {
    useGetPermissionsQuery,
    useCreatePermissionsMutation,
    useUpdatePermissionsMutation,
    useDeletePermissionsMutation,
} = PermissionsApiSlice;