import {createSlice} from "@reduxjs/toolkit";
import axios from "../../axios";
import Swal from "sweetalert2";

const initialState = {
    user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user_info")) : {}

}
const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredits: (state, action) => {
            state.user = action.payload
        },
        logout: async (state, action) => {
            await axios.post(`/api/v1/auth/email/logout/`, {}, {withCredentials: true}).then(result => {
                if (result.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Logged out",
                        timer: 800
                    })
                    localStorage.removeItem("user_info")
                    state.user = {}
                }
            })

        }
    },

})

export const selectCurrentUser = (state) => state.Auth.user
export const {logout, setCredits} = AuthSlice.actions
export default AuthSlice.reducer