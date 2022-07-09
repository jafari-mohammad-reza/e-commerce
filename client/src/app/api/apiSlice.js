import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {logout, setCredentials} from "../features/auth/authSlice";

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
    console.log(result)
    if (result?.error?.status === 401) {
        console.log("sending refresh token");
        const refreshResult = await baseQuery(
            {
                url: "/get-access-token",
                credentials: "same-origin"
            },
            api,
            extraOptions
        );
        if (refreshResult?.data) {
            console.log(refreshResult)
            const user = api.getState().auth.user;
            //store new token
            api.dispatch(setCredentials({...refreshResult.data, user}));
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
