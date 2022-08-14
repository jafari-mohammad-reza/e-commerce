import styled from "styled-components";
import {Link} from "react-router-dom";

export const Container = styled.div`
  width: 100%;
  height: max-content;
  position: relative;
  padding: 1.5rem 17rem 1.5rem 5rem;
  border-radius: 4rem;
  background-color: rgba(187, 151, 96, 0.85);

  &::-webkit-scrollbar {
  }
`

export const SeeMore = styled.div`
  width: max-content;
  height: max-content;
  padding: 2rem;
  position: absolute;
  bottom: 12rem;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  border-radius: 4rem;
  border: 2px solid #fff;
  margin: auto 3rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      color: white;
      font-size: 3.5rem;
    }

    span {
      color: white;
      font-size: 1.5rem;
    }
  }
`

export const DiscountProductCard = styled(Link)`
  width: 20rem;
  height: 25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0.2rem;
  cursor: pointer;
  background-color: #f1f1f1;
  margin: 0;
  border-radius: 1.5rem;
  @media (max-width: 768px) {
    margin-right: 10rem;
  }

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
    text-decoration: line-through;
    font-size: 1.7rem;
    place-self: start;
    margin: 0 1.6rem;
  }

`