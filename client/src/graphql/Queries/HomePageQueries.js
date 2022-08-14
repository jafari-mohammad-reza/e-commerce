import {gql} from "@apollo/client";

export const Get_TodayDiscounts = gql`
    query Get_TodayDiscounts($limit : Int) {
        GetDiscounts(limit : $limit) {
            _id
            title
            imagesURL
            discount
            price
            discountedPrice
        }
    }
`

export const Get_MostRated = gql`
    query Get_MostRated($limit : Int) {
        MostRatedProducts(limit : $limit) {
            _id
            title
            averageRating
            discountedPrice
            discount
            imagesURL
        }
    }
`