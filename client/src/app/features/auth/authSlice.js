import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("userInfo")) || {
        email: null,
        username: null,
        mobile: null,
        Role: null,
    },
    token: null,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const {email, username, token, mobile, Role} = action.payload;
            console.log(action.payload)
            state.token = token;
            state.user.Role = Role;
            state.user.username = username ?? undefined;
            state.user.email = email ?? undefined;
            state.user.mobile = mobile ?? undefined;
            localStorage.setItem("userInfo", JSON.stringify(state.user))
        },
        logout: (state, action) => {
            state.user = {
                email: null,
                username: null,
                mobile: null,
                Role: null,
            }
            state.token = null;
        },
        setToken: (state, action) => {
            state.token = action.payload
        }
    },
});

export const {setCredentials, logout, setToken} = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
