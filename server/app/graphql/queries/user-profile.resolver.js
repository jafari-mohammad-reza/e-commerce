const {BlogType} = require("../typeDefs/Blog.type");
const {GraphQLList, GraphQLInt} = require("graphql");
const {
    GraphqlTokenAuth,
} = require("../../http/middleWares/TokenAuthorization");
const {BlogModel} = require("../../models/Blog");
const {ProductModel} = require("../../models/Product");
const {ProductType} = require("../typeDefs/Product.type");
const {AnyType, ResponseType} = require("../typeDefs/Public.type");
const {getUserCart} = require("../../utils/functions");
const GetMarkedBlogs = {
    type: new GraphQLList(BlogType),
    args: {
        limit: {
            type: GraphQLInt,
            defaultValue: 10,
        },
    },
    resolve: async (_, args, context) => {
        const {headers} = context
        const user = await GraphqlTokenAuth(headers)
        const {limit} = args;
        return await BlogModel.find({bookmarks: user._id}).limit(limit);
    },
};

const GetMarkedProducts = {
    type: new GraphQLList(ProductType),
    args: {
        limit: {
            type: GraphQLInt,
            defaultValue: 10,
        },
    },
    resolve: async (_, args, context) => {
        const {headers} = context
        const user = await GraphqlTokenAuth(headers)
        const {limit} = args;
        return await ProductModel.find({bookmarks: user._id}).limit(limit);
    },
};

const GetUserShoppingCart = {
    type: AnyType,
    resolve: async (_, args, context) => {
        const {headers} = context
        const user = await GraphqlTokenAuth(headers)
        return await getUserCart(user._id);

    },
};

module.exports = {
    GetMarkedBlogs,
    GetMarkedProducts,
    GetUserShoppingCart,
};
