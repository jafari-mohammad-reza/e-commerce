const {
    GraphQLFloat,
    GraphQLList,
    GraphQLInt,
    GraphQLString,
} = require("graphql");
const {ProductType} = require("../typeDefs/Product.type");
const {ProductModel} = require("../../models/Product");
const ProductResolver = {
    type: new GraphQLList(ProductType),
    args: {
        limit: {type: GraphQLInt, defaultValue: 10},
        category: {type: GraphQLString},
    },
    resolve: async (parent, args, context) => {
        const {limit, category} = args;
        let query = category ? {category: category} : {};
        return await ProductModel.find(query).limit(limit);
    },
};

module.exports = {ProductResolver};
