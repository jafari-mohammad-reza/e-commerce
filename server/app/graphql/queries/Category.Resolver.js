const {GraphQLList, GraphQLInt, GraphQLString} = require("graphql");
const {CategoryType} = require("../typeDefs/Category.type");
const {CategoryModel} = require("../../models/Category");
const {AnyType} = require("../typeDefs/Public.type");
const {ProductModel} = require("../../models/Product");
const {ProductType} = require("../typeDefs/Product.type");
const CategoryResolver = {
    type: new GraphQLList(CategoryType),
    args: {
        limit: {
            type: GraphQLInt,
            defaultValue: 10
        }

    },
    resolve: async (_, args) => {
        const {limit} = args;

        return await CategoryModel.find({parent: undefined}).limit(limit);
    }
}
const ChildrenCategoryResolver = {
    type: new GraphQLList(CategoryType),
    args: {
        parent: {type: GraphQLString},
        limit: {
            type: GraphQLInt,
            defaultValue: 10
        },

    },
    resolve: async (_, args) => {
        const {parent, limit} = args;
        return await CategoryModel.find({$and: [{parent: parent}, {parent: {$ne: undefined}}]}).limit(limit);
    }
}

const GetCategoryByTitleResolver = {
    type: new GraphQLList(AnyType),
    args: {
        title: {type: GraphQLString}
    },
    resolve: async (_, args) => {
        let {title} = args;
        title = title.replace("_", " ");
        return await CategoryModel.aggregate(
            [
                {
                    $match: {title: title}
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "category",
                        as: "products"
                    }
                },
                {
                    _id: 1,
                    title: 1,
                    products: {
                        title: 1,
                        price: 1,
                        _id: 1,
                        discount: 1,
                        discountedPrice: {$subtract: [{$multiples: [{$divide: ["$price", 100]}, {$divide: ["$discount", 100]}]}, "$price"]},
                    }
                },
                {
                    $unwind: "$products"
                },
                {
                    $group: {
                        _id: "$_id",
                        title: {$first: "$title"},
                        products: {$push: "$products"}
                    }
                }
            ]
        )
    }
}


module.exports = {
    CategoryResolver,
    ChildrenCategoryResolver, GetCategoryByTitleResolver
}
