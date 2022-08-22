import {gql} from "@apollo/client";

const AddComment_Mutation = gql`
    mutation AddComment($comment: CommentInput!){
        addComment(comment: $comment){
            id
        }
    }
`