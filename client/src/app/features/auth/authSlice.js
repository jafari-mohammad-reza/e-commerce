import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: {
        email: null,
        username: null,
        mobile: null,
    },
    token: null,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const {email, username, token, mobile} = action.payload?.credentials;
            state.token = token;
            state.user.username = username ?? undefined;
            state.user.email = email ?? undefined;
            state.user.mobile = mobile ?? undefined;
        },
        logout: (state, action) => {
            state.user.email = null;
            state.user.username = null;
            state.user.mobile = null;
            state.token = null;
        },
    },
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
