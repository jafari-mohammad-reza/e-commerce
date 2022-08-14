import 'swiper/css'
import 'swiper/css/navigation'
import React from 'react'
import {Link} from "react-router-dom";
import styled from "styled-components";

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

            {products?.map((product, index) => {
                return <MostRatedProductsItem key={index} product={product}/>
            })}

        </Container>
    );
};

const Container = styled.div`
  width: 100%;
  height: max-content;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 1.5rem 17rem 1.5rem 5rem;
  border-radius: 4rem;
  background-color: rgba(187, 151, 96, 0.85);

  &::-webkit-scrollbar {
  }
`

const ProductCard = styled(Link)`
  width: 25rem;
  height: 25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: 1.5rem 3rem;
  padding: 0.2rem;
  cursor: pointer;
  background-color: #f1f1f1;
  border-radius: 1.5rem;


  img {
    width: 18rem;
    height: 13rem;
    margin: 1rem 0;
    object-fit: contain;
  }

  h2 {
    font-size: 2rem;
    font-weight: bold;
    display: block;
    margin-bottom: .3rem;
  }

  div {
    width: 85%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h4 {
      font-size: 2.2rem;
    }

    p {
      font-size: 1.5rem;
      color: #ff0000;
    }
  }

  h3 {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 1.5rem 0;
  }



`


export default MostRatedProductsContainer;