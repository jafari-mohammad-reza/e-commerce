const {ResponseType} = require("../typeDefs/Public.type");
const {GraphQLInt, GraphQLString} = require("graphql");
const {isValidObjectId} = require("mongoose");
const createHttpError = require("http-errors");
const {StatusCodes} = require("http-status-codes");
const {ProductModel} = require("../../models/Product");
const {GraphqlTokenAuth} = require("../../http/middleWares/TokenAuthorization");
const {loginByMobile} = require("../../http/validators/Api/auth.validators");
const RateProduct = {
    name: "rateProduct",
    type: ResponseType,
    args: {
        productId: {type: GraphQLString},
        star: {type: GraphQLInt},
    },
    resolve: async (parent, args, context) => {
        const user = await GraphqlTokenAuth(context.rawHeaders[1]);
        const {productId, star} = args;
        if (star > 5 || star < 1) throw new createHttpError(StatusCodes.BAD_REQUEST, "star must be between 1 and 5");
        if (!isValidObjectId(productId)) {
            throw new createHttpError.BadRequest("Invalid productId");
        }
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new createHttpError.BadRequest("Invalid productId");
        }
        let existRatings = await ProductModel.findOne({_id: productId, "ratings.postedBy": user._id});
        console.log(existRatings)
        if (!existRatings) {
            const addedRating = await ProductModel.updateOne({_id: productId}, {
                $push: {
                    ratings: {
                        postedBy: user._id,
                        star: star,
                    }
                }
            }, {new: true});

        } else {
            const updatedRating = await ProductModel.updateOne({_id: productId, "ratings.postedBy": user._id}, {
                $set: {

                    "ratings.$.star": star,
                }
            }, {new: true});
            console.log("updatedRating : ", updatedRating)
        }
        return {
            statusCode: StatusCodes.OK,
            data: {
                message: "Rate added successfully"
            }
        }
    }
}

module.exports = {
    RateProduct
}