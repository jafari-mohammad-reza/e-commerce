import React from 'react';
import Image from "next/image";
import Link from "next/link";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay} from "swiper";
import {addItemToBasket} from "../app/features/cartSlice";
import {useDispatch} from "react-redux";
import {useMutation} from "@apollo/client";
import {AddProductToCart} from "../graphql/Mutations/GlobalMutations";
import {Global_Error} from "../conf/ConstantFunctions";
import Swal from "sweetalert2";

const ProductCard = ({product}) => {
    const dispatch = useDispatch()
    const {
        title,
        price,
        discount,
        category,
        stockCount,
        discountedPrice,
        tags,
        _id,
        imagesURL,
        averageRating,
        ratings
    } = product
    const [mutateFunction, {data, error}] = useMutation(AddProductToCart)

    return (
        <div
            className={'flex flex-col items-start justify-start space-y-4 w-max h-[50rem] bg-sky-600 rounded-xl text-cyan-50 py-10   '}>
            <Link href={`/products/${title}`}>
                <div className={'w-[320px] h-[200px] place-self-center'}>
                    <Swiper modules={[Autoplay]} slidesPerView={1} autoplay={true}>
                        {imagesURL.map((image, index) => {
                            return <SwiperSlide>
                                <Image src={image} alt={title} width={300} height={200} objectFit={'contain'}/>
                            </SwiperSlide>
                        })}
                    </Swiper>
                </div>
            </Link>
            <h3 className={'text-3xl md:text-4xl lg:text-5xl font-bold place-self-center py-3'}>{title}</h3>
            <h4 className={'text-lg md:text-2xl lg:text-4xl cursor-pointer place-self-center'}>
                In <Link href={`/categories/${category?.title}`}>
                {category?.title}
            </Link>
            </h4>

            <div className="flex items-start justify-between w-full py-3 px-12 text-xl md:text-3xl lg:text-4xl">
                {discountedPrice > 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <h4>{discountedPrice > 1000 ? String(discountedPrice).substring(0, 3) + 'K' : discountedPrice} $</h4>
                            <h5 className={'line-through'}>{price > 1000 ? String(price).substring(0, 3) + 'K' : price} $</h5>
                        </div>
                    ) :
                    <h4>{price > 1000 ? String(price).substring(0, 3) + 'K' : price} $</h4>}
                <h6 className={'text-red-600'}>{discount}% off</h6>

            </div>

            <button
                className={'bg-sky-200 outline-0 border-0 rounded-lg px-6 py-3.5  text:xl md:text-3xl font-semibold text-blue-500 place-self-center '}
                onClick={() => {
                    mutateFunction({
                        variables: {
                            productId: product._id
                        }
                    }).then(() => {
                        Swal.fire({
                            icon: "success",
                            text: "Product added successfully.",
                            timer: 700,
                            position: "bottom-right",
                            showConfirmButton: false
                        }).then(() => {
                            dispatch(addItemToBasket(product))
                        })

                    }).catch(error => {
                        return Global_Error(error.message)
                    })
                }}
            >
                Add to cart
            </button>


        </div>
    );
};

export default ProductCard;
