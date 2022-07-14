import {apiSlice} from "../../api/apiSlice";

export const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCategories: builder.query({
            query: (credentials) => ({
                url: '/admin/categories',
                headers: {authorization: `Bearer ${credentials}`},
            }),
            keepUnusedDataFor: 5,
        }),
        getCategory: builder.query({
            query: ({token, id}) => ({
                url: `/admin/categories/${id}`,
                headers: {authorization: `Bearer ${token}`},
                method: "get"
            })
        }),
        createCategory: builder.mutation({
            query: ({token, body}) => ({
                url: '/admin/categories',
                headers: {authorization: `Bearer ${token}`},
                method: "post",
                body: body
            }),
        }),
        deleteCategory: builder.mutation({
            query: ({token, id}) => ({
                url: `/admin/categories/${id}`,
                header: {authorization: `Bearer ${token}`},
                method: "delete",
            })
        }),
        editCategory: builder.mutation({
            query: ({token, id, body}) => ({
                url: `/admin/categories/${id}`,
                header: {authorization: `Bearer ${token}`},
                method: "put",
                body: body,
            })
        }),
    })
})

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useDeleteCategoryMutation,
    useEditCategoryMutation,
    useCreateCategoryMutation,
} = categoriesApiSlice