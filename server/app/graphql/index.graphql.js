const {GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString} = require("graphql");
const getBlogsQuery = require("./queries/Blog.resolver");
const {BlogResolver} = require("./queries/Blog.resolver");
const {ProductResolver} = require("./queries/Product.resolver");

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        blog: BlogResolver,
        products: ProductResolver,
    }
})

const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        // ...
    }
})

const graphQlSchema = new GraphQLSchema({
    query: RootQuery,
    // mutation: RootMutation,
})

module.exports = {
    graphQlSchema
}