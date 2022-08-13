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