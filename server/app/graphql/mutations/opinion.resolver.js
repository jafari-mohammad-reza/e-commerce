const {ResponseType} = require("../typeDefs/Public.type");
const {GraphQLString, GraphQLNonNull} = require("graphql");
const {GraphqlTokenAuth} = require("../../http/middleWares/TokenAuthorization");
const {BlogModel} = require("../../models/Blog");
const {isValidObjectId} = require("mongoose");
const createHttpError = require("http-errors");
const {StatusCodes} = require("http-status-codes");
const LikeBlog = {

    type: ResponseType,
    args: {
        blogId: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: async (_, args, context) => {
        const {headers} = context
        const user = await GraphqlTokenAuth(headers)
        const {blogId} = args;
        const blog = await BlogModel.findById(blogId);
        if (!blog || !isValidObjectId(blogId)) {
            throw new createHttpError.NotFound("Blog not found");
        }
        const likedBlog = await BlogModel.findOne({_id: blogId, "likes": user._id});
        const updateQuery = likedBlog ? {$pull: {likes: user._id}} : {
            $push: {likes: user._id},
            $pull: {dislikes: user._id}
        };
        await BlogModel.updateOne({_id: blogId}, updateQuery);
        let message;
        if (likedBlog) {
            message = "Blog unliked successfully"
        } else {
            message = "Blog liked successfully"
        }
        return {
            StatusCode: StatusCodes.OK,
            data: {
                message
            }
        }
    }
}

const DisLikeBlog = {
    type: ResponseType,
    args: {
        blogId: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: async (_, args, context) => {
        const {headers} = context
        const user = await GraphqlTokenAuth(headers)
        const {blogId} = args;
        const blog = await BlogModel.findById(blogId);
        if (!blog || !isValidObjectId(blogId)) {
            throw new createHttpError.NotFound("Blog not found");
        }
        const dislikedBlog = await BlogModel.findOne({_id: blogId, "dislikes": user._id});
        const updateQuery = dislikedBlog ? {$pull: {dislikes: user._id}} : {
            $push: {dislikes: user._id},
            $pull: {likes: user._id}
        };
        await BlogModel.updateOne({_id: blogId}, updateQuery);
        let message;
        if (dislikedBlog) {
            message = "Blog unDisliked successfully"
        } else {
            message = "Blog disliked successfully"
        }
        return {
            StatusCode: StatusCodes.OK,
            data: {
                message
            }
        }
    }
}

module.exports = {
    LikeBlog,
    DisLikeBlog
}