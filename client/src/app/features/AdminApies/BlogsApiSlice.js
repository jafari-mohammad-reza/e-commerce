import {apiSlice} from "../../api/apiSlice";

const BlogsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBlogs: builder.query({
            query: ({token}) => ({
                url: "/admin/blogs",
                headers: {
                    authorization: `Bearer ${token}`
                },
                method: "GET"
            }),
            keepUnusedDataFor: 10
        }),
        getBlog: builder.query({
            query: ({token, id}) => ({
                url: `/admin/blogs/${id}`,
                headers: {
                    authorization: `Bearer ${token}`
                },
                method: "GET",
            })
        }),
        createBlog: builder.mutation({
            query: ({token, formData}) => ({
                url: "/admin/blogs",
                headers: {
                    authorization: `Bearer ${token}`,
                    "accept": "application/json",
                },
                method: "POST",
                body: formData
            })
        }),
        updateBlog: builder.mutation({
            query: ({token, id, formData}) => ({
                url: `/admin/blogs/${id}`,
                headers: {
                    authorization: `Bearer ${token}`,
                    "accept": "application/json",
                },
                method: "PUT",
                body: formData
            })
        }),
        deleteBlog: builder.mutation({
            query: ({token, id}) => ({
                url: `/admin/blogs/${id}`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
                method: "DELETE",
            })
        })
    })
})

export const {
    useGetBlogsQuery,
    useGetBlogQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = BlogsApiSlice