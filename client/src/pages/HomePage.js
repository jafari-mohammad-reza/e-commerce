import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import styled from "styled-components";
import TodayDiscounts from "../components/HomePageComponents/TodayDiscounts";
import {Get_TodayDiscounts} from "../graphql/Queries/HomePageQueries";

export default function HomePage() {
    const [products, setProducts] = useState([])
    const {loading, error, data} = useQuery(Get_TodayDiscounts, {
        variables: {
            limit: 15
        }
    })
    useEffect(() => {
        if (!loading) {

            setProducts(data.GetDiscounts)
        }

    }, [data])

    return <Container>
        <SectionTitle>
            Today's Discounts
        </SectionTitle>
        {products && <TodayDiscounts products={products}/>}
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
`

const SectionTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-left: 4.5rem;
  margin-bottom: 2.5rem;

`
