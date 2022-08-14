const {
    GraphQLFloat,
    GraphQLList,
    GraphQLInt,
    GraphQLString,
} = require("graphql");
const {ProductType} = require("../typeDefs/Product.type");
const {ProductModel} = require("../../models/Product");
const {AnyType} = require("../typeDefs/Public.type");
const {any} = require("joi");
const {GraphQLScalarType} = require("graphql/type");
const {Kind} = require('graphql/language')

const {convertTOObject} = require("../../utils/functions");
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

const MostRatedProductResolver = {
    type: new GraphQLList(ProductType),
    args: {
        limit: {type: GraphQLInt, defaultValue: 15},
        order: {type: GraphQLString, defaultValue: "ascending"}
    },
    resolve: async (parent, args, context) => {
        const {limit, order} = args;
        console.log(
            await ProductModel.find({}).limit(limit).sort()
        )
        return ProductModel.find({}).limit(limit).sort();
    }


}


module.exports = {ProductResolver, DiscountedProductResolver, MostRatedProductResolver};
