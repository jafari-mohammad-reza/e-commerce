import 'swiper/css'
import 'swiper/css/navigation'
import React from 'react'
import {Link} from "react-router-dom";
import {RiArrowRightFill} from "react-icons/ri";
import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Navigation} from "swiper";
import {Container, DiscountProductCard, SeeMore} from "./HomePageComponents";

function TodayDiscounts({products}) {
    const TodayDiscountsItem = ({product}) => {
        return (
            <DiscountProductCard to={`/products/${product.title}`}>
                <img src={product.imagesURL} alt="product"/>
                <h2>{product.title}</h2>
                <div>
                    <h4>{Math.floor(product.discountedPrice)} $</h4>
                    <p>{product.discount}% off</p>
                </div>
                <h3>
                    {product.price} $
                </h3>
            </DiscountProductCard>
        )
    }
    return (
        <Container>

            <Swiper
                modules={[Navigation, A11y]}
                spaceBetween={30}
                slidesPerView={7}
                navigation
            >
                {products?.map((product, index) => {
                    return <SwiperSlide key={product._id}>
                        <TodayDiscountsItem key={product._id} product={product}/>
                    </SwiperSlide>
                })}
            </Swiper>

            <SeeMore>
                <Link to="/today-discounts">
                           <span>
                        See more
                    </span>
                    <RiArrowRightFill/>
                </Link>
            </SeeMore>
        </Container>
    )
}


export default TodayDiscounts