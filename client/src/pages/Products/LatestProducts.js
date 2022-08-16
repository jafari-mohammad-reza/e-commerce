import React from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Navigation} from "swiper";
import {Container, ProductCard} from "../../components/HomePageComponents/HomePageComponents";

const LatestProductsComponents = ({products}) => {
    return (
        <Container>

            <Swiper
                modules={[Navigation, A11y]}
                spaceBetween={10}
                slidesPerView={6}
                navigation
            >
                {products?.map((product, index) => {
                    return <SwiperSlide key={product._id}>
                        <ProductCard to={`/products/${product.title}`}>
                            <img src={product.imagesURL} alt="product"/>
                            <h2 style={{marginBottom: "2rem"}}>{product.title}</h2>
                            <div>
                                <h4>{product.price} $</h4>
                                <p>{product.discount}% off</p>
                            </div>


                        </ProductCard>
                    </SwiperSlide>
                })}
            </Swiper>


        </Container>
    );
};

export default LatestProductsComponents;