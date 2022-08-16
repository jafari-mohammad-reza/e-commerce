import 'swiper/css'
import 'swiper/css/navigation'
import React from 'react'
import {Link} from "react-router-dom";
import {RiArrowRightFill} from "react-icons/ri";
import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Navigation} from "swiper";
import {ProductCard, SeeMore} from "./HomePageComponents";
import styled from "styled-components";


function TodayDiscounts({products}) {
    const TodayDiscountsItem = ({product}) => {
        return (
            <ProductCard to={`/products/${product.title}`}>
                <img src={product.imagesURL} alt="product"/>
                <h2>{product.title}</h2>
                <div>
                    <h4>{Math.floor(product.discountedPrice)} $</h4>
                    <p>{product.discount}% off</p>
                </div>
                <h3>
                    {product.price} $
                </h3>
            </ProductCard>
        )
    }
    return (
        <Container>

            <Swiper
                modules={[Navigation, A11y]}
                spaceBetween={0}
                slidesPerView={5}
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

const Container = styled.div`
  width: 100%;
  height: max-content;
  position: relative;
  padding: 1.5rem 16rem 5rem 1.5rem;
  border-radius: 4rem;
  background-color: rgba(193, 193, 193, 0.25);
`

export default TodayDiscounts