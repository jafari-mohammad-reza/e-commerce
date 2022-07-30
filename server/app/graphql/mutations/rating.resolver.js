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
        stars: {type: GraphQLInt},
    },
    resolve: async (parent, args, context) => {
        const {headers} = context
        const user = await GraphqlTokenAuth(headers)
        const {productId, stars} = args;
        if (stars > 5 || stars < 1) throw new createHttpError(StatusCodes.BAD_REQUEST, "star must be between 1 and 5");
        if (!isValidObjectId(productId)) {
            throw new createHttpError.BadRequest("Invalid productId");
        }
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new createHttpError.BadRequest("Invalid productId");
        }
        let existRate = await ProductModel.findOne({_id: productId, "ratings.postBy": user._id});
        if (existRate) {
            await ProductModel.findByIdAndUpdate(productId, {
                $set: {
                    "ratings.$[].stars": stars,

                }
            })
            console.log("update rate")
        } else {
            console.log(stars)
            await ProductModel.findByIdAndUpdate(productId, {
                $push: {
                    ratings: {
                        postBy: user._id,
                        stars: stars
                    }
                }
            }, {new: true})
            console.log("create rate")
        }
        return {
            status: StatusCodes.OK,
            data: {
                message: "rate success"
            }
        }
    }
}

module.exports = {
    RateProduct
}