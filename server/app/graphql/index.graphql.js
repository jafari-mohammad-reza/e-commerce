const {GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString} = require("graphql");
const getBlogsQuery = require("./queries/Blog.resolver");
const {BlogResolver} = require("./queries/Blog.resolver");
const {ProductResolver} = require("./queries/Product.resolver");
const {CategoryResolver, CategoryChildResolver} = require("./queries/Category.Resolver");
const {CreateBlogComment, CreateProductComment} = require("./mutations/Comments.Resolver");
const {RateProduct} = require("./mutations/rating.resolver");
const {LikeBlog, DisLikeBlog} = require("./mutations/opinion.resolver");
const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        blog: BlogResolver,
        products: ProductResolver,
        category: CategoryResolver,
        categoryChild: CategoryChildResolver
    }
})

const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        CreateBlogComment,
        CreateProductComment,
        RateProduct,
        LikeBlog,
        DisLikeBlog

    }
})

const graphQlSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
})

module.exports = {
    graphQlSchema
}