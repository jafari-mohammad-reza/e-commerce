import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {logout, setToken} from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include",
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    const existToken = api.getState().auth.token
    if (result?.error?.status === 403 || !existToken) {
        const refreshResult = await baseQuery(
            "/api/v1/auth/get-access-token",
            api,
            extraOptions
        );

        if (refreshResult?.data) {
            const {token} = refreshResult.data
            api.dispatch(setToken(token));
            //retry
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({}),
});
