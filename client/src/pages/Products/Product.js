import React, {Fragment, useEffect} from 'react';
import {GetProductDetail} from "../../graphql/Queries/GlobalQueries";
import {useQuery} from "@apollo/client";
import {useParams} from "react-router-dom";
import styled from "styled-components";

const Product = () => {
    const [product, setProduct] = React.useState(null);
    const {title} = useParams();
    const {data, loading, error} = useQuery(GetProductDetail, {
        variables: {
            title: "Play",
        }
    });
    const [isLoading, setIsLoading] = React.useState(true);
    useEffect(() => {

        if (data && !loading) {
            setProduct(data.GetProductDetail);
            setIsLoading(false);
        }
    }, [data, title])
    return (
        <Fragment>
            {isLoading ? <div>Loading...</div> : <>
                <Wrapper>
                    <div className="images">
                        {product.imagesURL.map((image, index) => {
                            return <img key={index} src={image} alt={product.title}/>
                        })}
                    </div>
                    <h2>{product.title}</h2>
                    <h4>{product.overView}</h4>
                    <p>
                        {product.description}
                    </p>
                    <div className={'.infoContainer'}>
                        <p>{product.price}</p>
                        <p>{product.discount}</p>
                        <p>{product.discountedPrice}</p>
                        <p>{product.stockCount}</p>
                        <p>{product.averageRating}</p>
                    </div>
                    <div className="comments">
                        {product.comments.map((comment, index) => {
                            return <div key={index}>
                                <p>{comment.author.username}</p>
                                <p>{comment.content}</p>
                            </div>
                        })}
                    </div>
                </Wrapper>
            </>}
        </Fragment>
    );
};
const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem 4rem;
  background-color: #f5f5f5;
  position: relative;

  .images {
    width: 100%;
    height: auto;
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;


    img {
      width: 100%;
      height: auto;
      max-height: 500px;
      max-width: 500px;
      object-fit: cover;
      place-self: end;
    }
  }

  h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;

  }

  h4 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;

  }

  .infoContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 1rem;

    p {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 1rem;

    }
  }

  .comments {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    p {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 1rem;

    }


  }

`

export default Product;