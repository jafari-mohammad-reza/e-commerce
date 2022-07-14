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
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.9',

                },
                method: "post",
                body: formData,
            }),
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
} = productApiSlice;
