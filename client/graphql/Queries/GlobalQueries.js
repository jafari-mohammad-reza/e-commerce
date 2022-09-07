import {gql} from "@apollo/client";

export const GetProducts_Query = gql`
    query LatestProducts_Query($limit : Int) {
        products(limit : $limit) {
            _id
            title
            price
            imagesURL
            discount
            discountedPrice
        }
    }
`

export const GetParentCategories_Query = gql`
    query ParentCategories($limit : Int) {
        category(limit : $limit) {
            _id
            title
            children
        }
    }
`

export const GetCategories_Query = gql`
    query ParentCategories($limit : Int) {
        category(limit : $limit) {
            _id
            title
            children
        }
    }
`
export const GetCategoryProductsByTitle_Query = gql`
    query GetProductByCategory($title : String) {
        GetProductByCategory(title: $title) {
            _id
            title
            category {
                title
            }
            price
            tags
            imagesURL
            averageRating
            price
            discount
            discountedPrice
            stockCount


        }
    }
`

export const GetProductDetail_Query = gql`
    query ProductDetail($id : String, $title : String) {
        GetProductDetail(title: $title, id: $id) {
            title
            _id
            imagesURL
            price
            discount
            discountedPrice
            overView
            description
            comments
            {
                _id
                author {
                    _id
                    username
                    mobileNumber
                }
                content
                isApproved
                ReplyAble
                Replies {
                    _id
                    isApproved
                    author{
                        username
                        mobileNumber
                        _id
                    }
                    content
                }
            }
            tags
            stockCount
            averageRating

            physicalFeatures {
                name
                value
            }
            category {
                title
                _id
            }
        }
    }
`


export const GetUserShoppingCart_Query = gql`
    query GetUserShoppingCart {
        GetUserShoppingCart 
    }
`
