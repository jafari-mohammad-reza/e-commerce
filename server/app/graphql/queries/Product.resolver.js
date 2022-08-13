const {
    GraphQLFloat,
    GraphQLList,
    GraphQLInt,
    GraphQLString,
} = require("graphql");
const {ProductType} = require("../typeDefs/Product.type");
const {ProductModel} = require("../../models/Product");
const {AnyType} = require("../typeDefs/Public.type");
const ProductResolver = {
    type: new GraphQLList(ProductType),
    args: {
        limit: {type: GraphQLInt, defaultValue: 10},
        category: {type: GraphQLString},
        search: {type: GraphQLString},
    },
    resolve: async (parent, args, context) => {
        const {limit, category, search} = args;
        let query = category ? {category: category} : {};
        search && (query = {
            $text: {$search: search},
        });
        return await ProductModel.find(query).limit(limit);
    },
};
const DiscountedProductResolver = {
    type: new GraphQLList(ProductType),
    args: {
        limit: {type: GraphQLInt, defaultValue: 10},
        order: {type: GraphQLString, defaultValue: "ascending"}
    },
    resolve: async (parent, args, context) => {
        const {limit, order} = args;
        return await ProductModel.find({$gt: {discount: 0}}).limit(limit).sort({discount: order});
    }

}

module.exports = {ProductResolver, DiscountedProductResolver};
