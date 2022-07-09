import {apiSlice} from "../../api/apiSlice";

export const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCategories: builder.query({
            query: (credentials) => ({
                url: '/admin/categories',
                headers: {authorization: `Bearer ${credentials}`}
            }),
            keepUnusedDataFor: 5,
        })
    })
})

export const {
    useGetCategoriesQuery
} = categoriesApiSlice