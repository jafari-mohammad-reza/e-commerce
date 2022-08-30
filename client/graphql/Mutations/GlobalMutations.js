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