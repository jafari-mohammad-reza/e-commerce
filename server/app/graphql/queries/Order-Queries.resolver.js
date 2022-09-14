const {ResponseType} = require("../typeDefs/Public.type");
const {GraphqlTokenAuth} = require("../../http/middleWares/TokenAuthorization");
const {OrderModel} = require("../../models/Order")
const createHttpError = require("http-errors")
const {GraphQLNonNull, GraphQLString} = require("graphql/type");
const {isValidObjectId} = require("mongoose");
const GetUserOrders = {
    type: ResponseType,
    resolve: async (_, args, context) => {
        const user = await GraphqlTokenAuth(context.req.headers)
        return OrderModel.find({costumer: user._id})
    }
}

const GetUserOrderDetail = {
    type: ResponseType,
    args: {
        orderId: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve: async (_, args, context) => {
        const user = await GraphqlTokenAuth(context.req.headers)
        const {orderId} = args
        if (!isValidObjectId(orderId)) {
            throw createHttpError.BadRequest("Not a valid order id")
        }
        return OrderModel.findOne({$and: [{costumer: user._id}, {_id: orderId}]})
    }
}


module.exports = {
    GetUserOrders,
    GetUserOrderDetail
}
