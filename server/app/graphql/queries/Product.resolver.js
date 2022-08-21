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
const {CategoryModel} = require("../../models/Category");
const ProductResolver = {
    type: new GraphQLList(ProductType),
    args: {
        limit: {type: GraphQLInt, defaultValue: 10},
        category: {type: GraphQLString},
        search: {type: GraphQLString},
        order: {type: GraphQLString, defaultValue: -1},
    },
    resolve: async (parent, args, context) => {
        const {limit, category, search, order} = args;
        let query = category ? {category: category} : {};
        search && (query = {
            $text: {$search: search},
        });
        return ProductModel.find(query).limit(limit).sort({_id: order});
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
        return ProductModel.find({discount: {$gt: 0}}).limit(limit).sort({discount: -1});
    }
}

const MostRatedProductResolver = {
    type: new GraphQLList(ProductType),
    args: {
        limit: {type: GraphQLInt, defaultValue: 15},
    },
    resolve: async (parent, args, context) => {
        const {limit} = args;
        return ProductModel.find({ratings: {$ne: []}}).limit(limit).sort({ratings: -1});
    }


}

const GetProductDetailResolver = {
    type: ProductType,
    args: {
        id: {type: GraphQLString, default: ""},
        title: {type: GraphQLString, default: ""}
    },
    resolve: async (parent, args, context) => {
        let {id, title} = args;
        title = title.replace("_", " ");
        if (!id && !title) return null;
        console.log(title)
        if (id) {
            return await ProductModel.findById(id);
        } else {
            return ProductModel.findOne({$text: {$search: title, $caseSensitive: false}});
        }
    }
}

const GetProductByCategoryResolver = {
    type: new GraphQLList(ProductType),
    args: {
        title: {type: GraphQLString},
    },
    resolve: async (parent, args, context) => {
        let {title} = args;
        title = title.replace("_", " ");
        const category = await CategoryModel.findOne({$text: {$search: title, $caseSensitive: false}});
        console.log(category)
        return ProductModel.find({category: category});
    }
}


module.exports = {
    ProductResolver,
    DiscountedProductResolver,
    MostRatedProductResolver,
    GetProductDetailResolver,
    GetProductByCategoryResolver
};
