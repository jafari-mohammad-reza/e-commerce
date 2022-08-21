import {gql} from "@apollo/client";

export const GetDiscountedProducts_Query = gql`
    query DiscountedProducts($limit : Int) {
        GetDiscounts(limit : $limit) {
            _id
            title
            imagesURL
            discount
            price
            stockCount
            category {
                title
            }
            tags
            averageRating
            ratings {
                stars

            }
            discountedPrice
        }
    }
`

export const GetMostRatedProducts_Query = gql`
    query MostRateProducts($limit : Int) {
        MostRatedProducts(limit : $limit) {
            _id
            title
            averageRating
            discountedPrice
            discount
            imagesURL
            price
            category {
                title
            }
        }
    }
`

export const GetLatestProducts_Query = gql`
    query LatestProducts($limit : Int) {
        products(limit : $limit) {
            _id
            title
            price
            discountedPrice
            imagesURL
            discount
            category {
                title
            }
        }
    }
`