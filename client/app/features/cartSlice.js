import {createSlice} from "@reduxjs/toolkit";
import cart from "../../pages/cart";

const initialState = {
    cart: [],
    payment: {}
}
const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {

        addItemToBasket: (state, action) => {

            const existProduct = state.cart.find(
                (product) => product._id === action.payload._id,
            )

            if (!existProduct) {
                state.cart = [...state.cart, action.payload]
            } else {
                state.cart.find(item => item._id === action.payload._id).basketCount++;
                state.payment.ActualPaymentAmount += action.payload.price
                state.payment.DiscountedPaymentAmount += (action.payload.price - (action.payload.price * (action.payload.discount / 100)))
            }
        },
        removeItemFromBasket: (state, action) => {
            const existProduct = state.cart.find(
                (product) => product._id === action.payload._id,
            )
            console.log(existProduct)
            if (!existProduct) return;
            if (existProduct.basketCount > 1) {
                state.cart.find(item => item._id === action.payload._id).basketCount--;
                state.payment.ActualPaymentAmount -= action.payload.price
                state.payment.DiscountedPaymentAmount -= (action.payload.price - (action.payload.price * (action.payload.discount / 100)))
            } else {
                console.log("removes")
                state.cart = state.cart.filter(
                    (product) => product._id !== action.payload._id,
                )
            }
        },

        setCartStates: (state, action) => {
            state.cart = action.payload.productsDetail
            state.payment = action.payload.paymentDetail
        }
    },

})

export const selectCartItems = (state) => state.Cart.cart
export const selectCartPayments = (state) => state.Cart.payment
export const {removeItemFromBasket, setCartStates, addItemToBasket} = CartSlice.actions
export default CartSlice.reducer
