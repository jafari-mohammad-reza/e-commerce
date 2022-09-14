const {GraphQLNonNull, GraphQLString} = require("graphql");
const {GraphqlTokenAuth} = require("../../http/middleWares/TokenAuthorization");
const {BlogModel} = require("../../models/Blog");
const {isValidObjectId} = require("mongoose");
const {StatusCodes} = require("http-status-codes");
const {ResponseType} = require("../typeDefs/Public.type");
const {ProductModel} = require("../../models/Product");
const {copyObject} = require("../../utils/functions");
const createHttpError = require("http-errors");

async function getComment(model, id) {
    const foundedComment = await model.findOne({"$comments._id": id}, {"comments.$": 1}).catch(err => {
        console.log(err)
        throw new createHttpError.InternalServerError(err.message);
    });
    const comment = copyObject(foundedComment.comments)
    if (!comment) throw createHttpError.NotFound("the comment could not be found")
    return comment[0]
}

const CreateBlogComment = {
    type: ResponseType,
    args: {
        blogId: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)},
        parent: {type: GraphQLString},
    },
    resolve: async (_, args, context) => {
        const {headers} = context
        const author = await GraphqlTokenAuth(context.req.headers)
        const {blogId, content, parent} = args;

        const blog = await BlogModel.findById(blogId);
        if (!blog || !isValidObjectId(blogId)) {
            throw new createHttpError("Blog not found");
        }
        if (parent && isValidObjectId(parent)) {
            const commentDocument = await getComment(BlogModel, parent);
            console.log(commentDocument)
            if (commentDocument && !commentDocument?.ReplyAble) {
                throw new createHttpError("You can not reply to this comment");
            }
            const replyResult = await BlogModel.updateOne({
                "comments._id": parent
            }, {
                $push: {
                    "comments.$.Replies": {
                        content,
                        author,
                        isApproved: false,
                        ReplyAble: false,
                        parentComment: parent,
                    }
                }
            });
            if (!replyResult.modifiedCount) {
                throw new createHttpError("Parent comment not found");
            }
            return {
                StatusCode: StatusCodes.CREATED,
                data: {
                    message: "Comment added successfully"
                }
            }
        } else {
            await BlogModel.updateOne({_id: blogId}, {
                $push: {
                    comments: {
                        content,
                        author,
                        isApproved: false,
                        ReplyAble: true
                    }
                }
            })
        }

        return {
            statusCode: StatusCodes.CREATED,
            data: {
                message: "Comment added successfully it will be approved soon"
            }
        };
    }
}
const CreateProductComment = {
    type: ResponseType,
    args: {
        productId: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)},
        parent: {type: GraphQLString},
    },
    resolve: async (_, args, context) => {
        const {headers} = context
        const author = await GraphqlTokenAuth(context.req.headers)
        const {productId, content, parent} = args;

        const product = await ProductModel.findById(productId);
        if (!product || !isValidObjectId(productId)) {
            throw new createHttpError("product not found");
        }
        if (parent && isValidObjectId(parent)) {
            const commentDocument = await getComment(ProductModel, parent);
            if (commentDocument && !commentDocument?.ReplyAble) {
                throw new createHttpError("You can not reply to this comment");
            }
            const replyResult = await ProductModel.updateOne({
                "comments._id": parent
            }, {
                $push: {
                    "comments.$.Replies": {
                        content,
                        author,
                        isApproved: false,
                        ReplyAble: false,
                        parentComment: parent,
                    }
                }
            });
            if (!replyResult.modifiedCount) {
                throw new createHttpError("Parent comment not found");
            }
            return {
                StatusCode: StatusCodes.CREATED,
                data: {
                    message: "Comment added successfully"
                }
            }
        } else {
            await ProductModel.updateOne({_id: productId}, {
                $push: {
                    comments: {
                        content,
                        author,
                        isApproved: false,
                        ReplyAble: true
                    }
                }
            })
        }

        return {
            statusCode: StatusCodes.CREATED,
            data: {
                message: "Comment added successfully it will be approved soon"
            }
        };
    }
}

module.exports = {
    CreateBlogComment,
    CreateProductComment
}
