import React from 'react';
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({product}) => {
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
    console.log(stockCount)
    return (
        <div
            className={'flex flex-col items-start justify-start space-y-4 w-max h-[50rem] bg-sky-600 rounded-xl text-cyan-50 py-10   '}>
            <div className={'w-full h-max transition-transform transform duration-300  hover:scale-105 cursor-pointer'}>
                <Link href={`/products/${title}`}>
                    <Image src={imagesURL[0]} alt={title} width={300} height={200} objectFit={'contain'}/>
                </Link>
            </div>
            <h3 className={'text-3xl md:text-4xl lg:text-6xl font-bold place-self-center py-3'}>{title}</h3>
            <h4 className={'text-lg md:text-2xl lg:text-4xl cursor-pointer place-self-center'}>
                In <Link href={`/category/${category?.title}`}>
                {category?.title}
            </Link>
            </h4>

            <div className="flex items-start justify-between w-full py-3 px-12 text-xl md:text-3xl lg:text-4xl">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <h4>{discountedPrice}$</h4>
                    <h5 className={'line-through'}>{price}$</h5>
                </div>
                <h6 className={'text-red-600'}>{discount}% off</h6>

            </div>
            {ratings?.length > 0 && <div className="flex  items-center justify-center space-x-2">
                <h4>{averageRating}</h4>
                <h5>{ratings?.length} ratings</h5>
            </div>}
            {
                stockCount <= 30 && <h6 className={'text-xl px-10'}>
                    only {stockCount} Left in Stock
                </h6>
            }
            <button
                className={'bg-sky-200 outline-0 border-0 rounded-lg px-6 py-3.5  text:xl md:text-3xl font-semibold text-blue-500 place-self-center '}>
                Add to cart
            </button>


        </div>
    );
};

export default ProductCard;
