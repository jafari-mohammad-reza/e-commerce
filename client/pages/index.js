import React, {useState} from 'react';
import client from "../apollo-client";
import {
    GetDiscountedProducts_Query,
    GetLatestProducts_Query,
    GetMostRatedProducts_Query
} from "../graphql/Queries/HomePageQueries";
import ProductSwiper from "../components/ProductSwiper";

const Home = ({discountedProducts, latestProducts, mostRateProducts, loading}) => {
    const [isLoading, setIsLoading] = useState(loading)


    return (
        <div className={'flex flex-col items-start justify-start px-20 '}>
            {isLoading ? <h1>Loading...</h1> : (
                <>
                    {discountedProducts && <ProductSwiper products={discountedProducts} title={"Today's Discounts"}/>}
                    {latestProducts && <ProductSwiper products={latestProducts} title={"Latest Products"}/>}
                    {mostRateProducts && <ProductSwiper products={mostRateProducts} title={"Most Rate Products"}/>}
                </>
            )}
        </div>
    );
};

export default Home;

export async function getServerSideProps() {
    const {data: discountedProductsData, loading: discountedProductsDataLoading} = await client.query({
        query: GetDiscountedProducts_Query,
        variables: {
            limit: 10
        }
    })
    const {data: latestProductsData, loading: latestProductsDataLoading} = await client.query({
        query: GetLatestProducts_Query,
        variables: {
            limit: 10
        }
    })
    const {data: mostRatedProductsData, loading: mostRatedProductsDataLoading} = await client.query({
        query: GetMostRatedProducts_Query,
        variables: {
            limit: 10
        }
    })
    return {
        props:
            {
                discountedProducts: discountedProductsData.GetDiscounts,
                latestProducts: latestProductsData.products,
                mostRateProducts: mostRatedProductsData.MostRatedProducts,
                loading: latestProductsDataLoading | discountedProductsDataLoading | mostRatedProductsDataLoading
            }

    }
}
