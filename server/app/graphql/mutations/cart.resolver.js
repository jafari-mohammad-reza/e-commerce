const {GraphQLNonNull, GraphQLString} = require("graphql");
const {ResponseType} = require("../typeDefs/Public.type");
const {
    GraphqlTokenAuth,
} = require("../../http/middleWares/TokenAuthorization");
const {isValidObjectId} = require("mongoose");
const createHttpError = require("http-errors");
const {UserModel} = require("../../models/User");
const {copyObject} = require("../../utils/functions");
const {StatusCodes} = require("http-status-codes");
const AddProductToCart = {
    type: ResponseType,
    args: {
        productId: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: async (_, args, context) => {
        const {headers} = context
        const user = await GraphqlTokenAuth(headers)
        const {productId} = args;
        const existProductInBasket = await findProductInBasket(productId, user._id);
        let message;
        if (!existProductInBasket) {
            await UserModel.updateOne(
                {
                    _id: user._id,
                },
                {
                    $push: {
                        "cart.products": {
                            productId,
                            count: 1,
                        },
                    },
                }
            );
            message = "product added to cart successfully";
        } else {
            await UserModel.updateOne(
                {
                    _id: user._id,
                    "cart.products.productId": productId,
                },
                {
                    $inc: {
                        "cart.products.$.count": 1,
                    },
                }
            );
            message = "product count has been increased successfully";
        }
        return {
            status: StatusCodes.OK,
            data: {
                message,
            },
        };
    },
};

const RemoveProductFromCart = {
    type: ResponseType,
    args: {
        productId: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: async (_, args, context) => {
        const {headers} = context
        const user = await GraphqlTokenAuth(headers)
        const {productId} = args;
        const existProductInBasket = await findProductInBasket(productId, user._id);
        if (!existProductInBasket) {
            throw new createHttpError.NotFound(
                "there is no product in cart with this id"
            );
        }
        let message;
        if (existProductInBasket.count > 1) {
            await UserModel.updateOne(
                {
                    _id: user._id,
                    "cart.products.productId": productId,
                },
                {
                    $inc: {
                        "cart.products.$.count": -1,
                    },
                }
            );
            message = "product in cart has been decresed successfully.";
        } else {
            await UserModel.updateOne(
                {_id: user._id, "cart.products.productId": productId},
                {
                    $pull: {
                        "cart.products": {
                            productId,
                        },
                    },
                }
            );
            message = "product in cart has been removed successfully.";
        }
        return {
            status: StatusCodes.OK,
            data: {
                message,
            },
        };
    },
};

const findProductInBasket = async (productId, userId) => {
    const findResult = await UserModel.findOne(
        {_id: userId, "cart.products.productId": productId},
        {"cart.products.$": 1}
    );
    const userDetail = copyObject(findResult);
    console.log(userDetail?.cart?.products?.[0]);
    return userDetail?.cart?.products?.[0];
};
module.exports = {
    AddProductToCart,
    RemoveProductFromCart,
};
