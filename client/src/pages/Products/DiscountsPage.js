import React, {useEffect} from 'react';
import styled from "styled-components";
import {Get_TodayDiscounts} from "../../graphql/Queries/HomePageQueries";
import {useQuery} from "@apollo/client";
import {Link} from "react-router-dom";

const DiscountsPage = () => {
    const [products, setProducts] = React.useState([]);
    const {loading, error, data} = useQuery(Get_TodayDiscounts)
    const TodayDiscountsItem = ({product}) => {
        return (
            <DiscountProductCard to={`/products/${product._id}`}>
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
    useEffect(() => {
        if (!loading) {
            setProducts(data.GetDiscounts)
        }
        if (error) {
            console.log(error)

        }
    }, [data])
    return (
        <Wrapper>
            {products && products.map((product, index) => {
                return <div key={index}>
                    <TodayDiscountsItem product={product}/>
                </div>
            })}
        </Wrapper>
    );
};

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  height: max-content;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 3rem 6rem;

`

export const DiscountProductCard = styled(Link)`
  width: 30rem;
  height: 35rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0.2rem;
  cursor: pointer;
  background-color: #c8a267;
  margin: 2.5rem 5rem;
  border-radius: 1.5rem;


  img {
    width: 30rem;
    height: 20rem;
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
    text-decoration: line-through;
    font-size: 1.7rem;
    place-self: start;
    margin: 0 1.6rem;
  }

`


export default DiscountsPage;