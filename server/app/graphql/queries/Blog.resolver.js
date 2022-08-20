const {GraphQLList, GraphQLString, GraphQLInt} = require("graphql");
const {BlogType} = require("../typeDefs/Blog.type");
const {BlogModel} = require("../../models/Blog");

const BlogResolver = {
    type: new GraphQLList(BlogType),
    args: {
        limit: {
            type: GraphQLInt,
            defaultValue: 10,
        },
        category: {type: GraphQLString, default: ""},
    },
    resolve: async (_, args) => {
        const {category, limit} = args;
        let query = category ? {category: category} : {};
        return BlogModel.find(query).limit(limit);
    },
};

module.exports = {
    BlogResolver,
};
