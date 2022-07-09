import {apiSlice} from "../../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/auth/email/login",
                method: "post",
                body: {...credentials},
            }),
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/auth/email/register",
                method: "post",
                body: {...credentials},
            }),
        }),
        getOtp: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/auth/mobile/get-otp",
                method: "post",
                body: {...credentials},
            }),
        }),
        verifyOtp: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/auth/mobile/validate-otp",
                method: "post",
                body: {...credentials},
            }),
        }),
        getResetPassword: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/auth/email/forgot-password",
                method: "post",
                body: {...credentials},
            }),
        }),
        resetPassword: builder.mutation({
            query: (credentials) => ({
                url: `/api/v1/auth/email/reset-password/${credentials.resetPasswordToken}`,
                method: "post",
                body: {password: credentials.password, confirmPassword: credentials.confirmPassword}
            }),
        }),
        verifyAccount: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/auth/email/verify-account",
                method: "post",
                body: {...credentials},
            }),
        }),


    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetOtpMutation,
    useVerifyOtpMutation,
    useGetResetPasswordMutation,
    useResetPasswordMutation,
    useVerifyAccountMutation,
} = authApiSlice;
