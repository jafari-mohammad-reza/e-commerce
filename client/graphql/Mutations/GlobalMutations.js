import {gql} from "@apollo/client";

export const ProductParentComment = gql`
    mutation CreateProductComment($productId : String! ,$content: String!) {
        CreateProductComment(
            productId: $productId,
            content: $content
        ) {
            statusCode
            data
        }
    }

`

export const ProductReplyComment = gql`
    mutation CreateProductComment($productId : String! ,$content: String!, $parent:String!) {
        CreateProductComment(
            productId: $productId,
            content: $content
            parent:$parent
        ) {
            
            data
        }
    }

`

export const AddProductToCart = gql`
    mutation AddProductToCart($productId:String!){
        AddProductToCart(productId : $productId){
            data
        }
    }
`

export const RemoveProductFromCart = gql`
    mutation AddProductToCart($productId:String!){
        AddProductToCart(productId : $productId){
            data
        }
    }
`
