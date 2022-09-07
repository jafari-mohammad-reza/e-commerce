import {configureStore} from '@reduxjs/toolkit'
import authSlice from "./features/authSlice";
import cartSlice from "./features/cartSlice";

export const store = configureStore({
    reducer: {
        Auth: authSlice,
        Cart : cartSlice
    },
})
