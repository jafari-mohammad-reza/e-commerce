import {apiSlice} from "../../api/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query({
            query: (credentials) => ({
                url: '/admin/products',
                headers: {authorization: `Bearer ${credentials}`},
            }),
            keepUnusedDataFor: 10,
        }),
        createProduct: builder.query({
            query: (credentials) => ({
                url: '/admin/products',
                headers: {authorization: `Bearer ${credentials}`},
                method: "post",
                body: {...credentials}
            }),
        }),
        deleteProduct: builder.query({
            query: (credentials) => ({
                url: `/admin/products/${credentials.id}`,
                headers: {authorization: `Bearer ${credentials.token}`},
                method: "delete",
            }),
        })
    })
})

export const {
    useGetProductsQuery,
    useCreateProductQuery,
    useDeleteProductQuery
} = productApiSlice