import {gql} from "@apollo/client";

export const Get_Products = gql`
    query Latest_Products($limit : Int) {
        products(limit : $limit) {
            _id
            title
            price
            imagesURL
            discount

        }
    }
`

export const Get_ParentCategories = gql`
    query Get_ParentCategories($limit : Int) {
        category(limit : $limit) {
            _id
            title
        }
    }
`

export const Get_Categories = gql`
    query Get_ParentCategories($limit : Int) {
        category(limit : $limit) {
            _id
            title
            children
        }
    }
`
// export const Get_ChildCategories = gql``

export const GetProductDetail = gql`
    query GetProductDetail($id : String, $title : String) {
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
                length
                height
                width
                weight
                colors
                Manufacturer
            }
            category {
                title
                _id

            }

        }
    }
`