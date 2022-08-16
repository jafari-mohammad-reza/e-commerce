import 'swiper/css'
import 'swiper/css/navigation'
import React from 'react'
import styled from "styled-components";
import {ProductCard} from "./HomePageComponents";
import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Navigation} from "swiper";

const MostRatedProductsContainer = ({products}) => {
    const MostRatedProductsItem = ({product}) => {
        return (
            <ProductCard to={`/products/${product.title}`}>
                <img src={product.imagesURL} alt="product"/>
                <h2>{product.title}</h2>
                <div>
                    <h4>{Math.floor(product.discountedPrice)} $</h4>
                    <p>{product.discount}% off</p>
                </div>
                <h3>
                    {product.averageRating} stars
                </h3>

            </ProductCard>
        )
    }
    return (
        <Container>
            <Swiper
                spaceBetween={20}
                slidesPerView={5}
                navigation
                modules={[A11y, Navigation]}
            >
                {products?.map((product, index) => {
                    return <SwiperSlide key={index}>
                        <MostRatedProductsItem key={index} product={product}/>
                    </SwiperSlide>
                })}
            </Swiper>


        </Container>
    );
};

const Container = styled.div`
  width: 100%;
  height: max-content;
  position: relative;

  padding: 1.5rem 17rem 1.5rem 5rem;
  border-radius: 4rem;
  background-color: rgba(193, 193, 193, 0.25);


  &::-webkit-scrollbar {
  }
`


export default MostRatedProductsContainer;