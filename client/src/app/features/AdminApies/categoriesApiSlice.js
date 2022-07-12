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
        createCategories: builder.query({
            query: (credentials) => ({
                url: '/admin/categories',
                headers: {authorization: `Bearer ${credentials}`},
                method: "post",
                body: {...credentials}
            }),
        }),
    })
})

export const {
    useGetCategoriesQuery
} = categoriesApiSlice