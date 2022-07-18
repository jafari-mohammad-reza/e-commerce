const {GraphQLFloat, GraphQLList, GraphQLInt} = require("graphql");
const {ProductType} = require("../typeDefs/Product.type");
const {ProductModel} = require("../../models/Product");
const ProductResolver = {
    type: new GraphQLList(ProductType),
    args: {
        limit: {type: GraphQLInt, defaultValue: 10},
    },
    resolve: async (parent, args, context) => {
        const {limit} = args;
        return await ProductModel.find({}).limit(limit).populate("supplier");
    }
}


module.exports = {ProductResolver}