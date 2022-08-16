import React, {useEffect} from 'react';
import styled from "styled-components";
import {Get_TodayDiscounts} from "../../graphql/Queries/HomePageQueries";
import {useQuery} from "@apollo/client";
import {ProductCard} from "../../components/HomePageComponents/HomePageComponents";

const DiscountsPage = () => {
    const [products, setProducts] = React.useState([]);
    const {loading, error, data} = useQuery(Get_TodayDiscounts)
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


export default DiscountsPage;