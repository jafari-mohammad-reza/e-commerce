import {apiSlice} from "../../api/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (credentials) => ({
                url: "/admin/products",
                headers: {authorization: `Bearer ${credentials}`},
            }),
            keepUnusedDataFor: 10,
        }),
        createProduct: builder.mutation({
            query: ({formData, token}) => ({
                url: "/admin/products",
                headers: {
                    authorization: `Bearer ${token}`,
                    accept: 'application/json',
                },
                method: "post",
                body: formData,
            }),
        }),
        updateProduct: builder.mutation({
            query: ({id, formData, token}) => ({
                url: `/admin/products/${id}`,
                headers: {
                    authorization: `Bearer ${token}`,
                    accept: 'application/json',
                },
                method: "put",
                body: formData,
            })
        }),
        deleteProduct: builder.mutation({
            query: (credentials) => ({
                url: `/admin/products/${credentials.id}`,
                headers: {authorization: `Bearer ${credentials.token}`},
                method: "delete",
            }),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
    useUpdateProductMutation,
} = productApiSlice;
