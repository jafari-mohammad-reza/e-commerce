import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import styled from "styled-components";
import TodayDiscounts from "../components/HomePageComponents/TodayDiscounts";
import {Get_MostRated, Get_TodayDiscounts} from "../graphql/Queries/HomePageQueries";
import MostRatedProductsContainer from "../components/HomePageComponents/MostRatedProductsContainer";

export default function HomePage() {
    const [discountedProducts, setDiscountedProducts] = useState([])
    const [mostRatedProducts, setMostRatedProducts] = useState([])
    const {loading: discountLoading, data: todayDiscountedProducts} = useQuery(Get_TodayDiscounts, {
        variables: {
            limit: 15
        }
    })
    const {loading: mostRateLoading, data: MostRatedProducts} = useQuery(Get_MostRated, {
        variables: {
            limit: 15
        }
    })

    useEffect(() => {
        if (!discountLoading && !mostRateLoading) {
            setDiscountedProducts(todayDiscountedProducts.GetDiscounts)
            setMostRatedProducts(MostRatedProducts.MostRatedProducts)
        }

    }, [todayDiscountedProducts])

    return <Container>
        {
            discountLoading || mostRateLoading ? <h1>Loading...</h1> : <>
                <section>
                    <h1>
                        Today's Discounts
                    </h1>
                    {discountedProducts && <TodayDiscounts products={discountedProducts}/>}
                </section>
                <section>
                    <h1>
                        Most Rated Products
                    </h1>
                    {mostRatedProducts && <MostRatedProductsContainer products={mostRatedProducts}/>}
                </section>
            </>
        }
    </Container>
}

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  height: max-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 3rem 6rem;
  overflow-x: hidden;

  section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 3rem;

    h1 {
      font-size: 3.2rem;
      font-weight: bold;
      margin-bottom: 1rem;
      margin-left: 4.5rem;
    }
  }
`

