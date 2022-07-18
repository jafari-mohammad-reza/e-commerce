const {GraphQLList, GraphQLObjectType, GraphQLInt} = require("graphql");
const {BlogType} = require("../typeDefs/Blog.type");
const {BlogModel} = require("../../models/Blog");

const BlogResolver = {
    type: new GraphQLList(BlogType),
    args: {
        limit: {
            type: GraphQLInt,
            defaultValue: 10,
        },
    },
    resolve: async (_, args) => {
        return await BlogModel.find({}).limit(args.limit);
    }
}

module.exports = {
    BlogResolver
}