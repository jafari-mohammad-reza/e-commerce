import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    addItemToBasket,
    removeItemFromBasket,
    selectCart, selectCartItems, selectCartPayments,
    setCartStates
} from "../../app/features/cartSlice";
import Image from "next/image";
import {AiOutlineDelete, AiOutlineMinus ,AiOutlinePlus} from "react-icons/ai";
import {useMutation, useQuery} from "@apollo/client";
import {GetCategories_Query, GetUserShoppingCart_Query} from "../../graphql/Queries/GlobalQueries";
import client from "../../apollo-client";
import {GetDiscountedProducts_Query} from "../../graphql/Queries/HomePageQueries";
import {AddProductToCart, RemoveProductFromCart} from "../../graphql/Mutations/GlobalMutations";
import {Global_Error} from "../../conf/ConstantFunctions";

const Index = ({cartData}) => {
    const data = useSelector(selectCartItems)
    const payment = useSelector(selectCartPayments)
    const [addItemFunction  ] = useMutation(AddProductToCart)
    const [removeItemFunction ] = useMutation(RemoveProductFromCart)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setCartStates(cartData))
    } , [cartData])

    return (
        <div className={'w-full h-full  md:h-[87.5vh] overflow-hidden grid grid-cols-1 md:grid-cols-12  px-6 md:px-12 lg:px-24'}>
            <div className={'md:col-span-8 lg:col-span-9  h-full overflow-y-scroll '}>
                {
                    data ? (
                        data.map(product => (

                            <div key={product._id} className={'w-full md:w-3/4 flex items-center justify-between px-10 mb-5 py-7   border-b-2 border-b-blue-500'}>
                                <Image src={product.imagesURL[0]} alt={product.title} width={150} height={125}/>
                                <h2 className={'text-2xl md:text-3xl lg:text-4xl font-semibold'}>
                                    {product.title}
                                </h2>
                                <div className="flex flex-col text-2x space-y-4 items-center justify-center">
                                    <h3>Price: {product.price}$</h3>
                                    <h3>Count: {product.basketCount}</h3>
                                </div>
                                <AiOutlinePlus className={'w-12 h-12 bg-blue-500 text-white rounded-full '} onClick={() => {

                                    addItemFunction({
                                        variables : {
                                            productId :product._id
                                        }
                                    }).then((result) => {
                                        console.log(result)
                                        dispatch(addItemToBasket(product))
                                    }).catch(error => {
                                        return Global_Error(error.message)
                                    })
                                }
                                }/>
                            </div>
                        ))
                    ) : <h1>No Item yet</h1>
                }
            </div>
            <div className={'md:col-span-4 lg:col-span-3  h-full lg:h-[90%] overflow-y-scroll w-full rounded-3xl bg-blue-600 text-white px-12 py-8 '}>
                <div className={'w-full h-24 flex items-start justify-between '}>
                    <h3 className={'text-xl md:text-2xl font-semibold'}>Your cart items</h3>
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="font-semibold text-lg md:text-xl flex items-center space-x-3">
                            <h5>Totals price:</h5>
                            <span>{payment.ActualPaymentAmount}</span>
                        </div>
                        <div className="font-semibold text-lg md:text-xl flex items-center space-x-3">
                            <h5>Discounted price:</h5>
                            <span>{payment.DiscountedPaymentAmount}</span>

                        </div>
                    </div>
                </div>
                <div className={'flex items-start flex-col justify-center space-y-4'}>
                    {data &&  data.map(product =>  (
                        <div key={product._id} className={'w-full h-max flex items-center justify-around  pb-5 border-b-2 border-b-black'}>
                            <Image src={product.imagesURL[0]} alt={product.title} width={100} height={100} />
                            <div className="flex flex-col items-start justify-start space-y-1 5 text-2xl">
                                <h3>{product.title}</h3>
                                <h6>{product.price}$ * {product.basketCount} : {product.finalPrice}$</h6>
                            </div>
                            <button className={'font-bold text-5xl rounded-3xl bg-red-500 text-gray-50 w-max'} onClick={() => {
                                removeItemFunction({
                                    variables : {
                                        productId :product._id
                                    }
                                }).then(() => {

                                    dispatch(removeItemFromBasket(product))
                                }).catch(error => {
                                    return Global_Error(error.message)
                                })
                            }}>
                                {product.basketCount > 1 ? <AiOutlineMinus/> : <AiOutlineDelete/>}
                            </button>
                        </div>
                    ))}
                    <button className={'bg-white text-blue-500 font-bold text-2xl py-5 px-8 rounded-3xl absolute self-center fixed bottom-48 transition hover:scale-110  '}>Checkout</button>
                </div>
            </div>
        </div>
    );
};
export async function getServerSideProps(context){
    const {data : cartData, loading: discountedProductsDataLoading} = await client.query({
        query: GetUserShoppingCart_Query,
        fetchPolicy : "cache-first",
        context : {
            headers : {
                authorization : `Bearer ${context.req.cookies["access_token"]}`
            }
        }
    })
    return {
        props : {
            cartData  : cartData.GetUserShoppingCart
        }
    }
}
export default Index;
