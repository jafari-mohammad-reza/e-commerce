const {GraphQLList, GraphQLInt, GraphQLString} = require("graphql");
const {CategoryType} = require("../typeDefs/Category.type");
const {CategoryModel} = require("../../models/Category");
const CategoryResolver = {
    type: new GraphQLList(CategoryType),
    args: {
        limit: {
            type: GraphQLInt,
            defaultValue: 10
        },

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

module.exports = {
    CategoryResolver,
    ChildrenCategoryResolver
}
