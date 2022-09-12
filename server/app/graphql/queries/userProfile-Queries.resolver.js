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
const {GraphQLNonNull, GraphQLString} = require("graphql/type");
const {UserModel} = require("../../models/User");
const {StatusCodes} = require("http-status-codes");

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

const GetUserDashboard = {
    type: ResponseType,
    resolve: async (_, args, context) => {
        const {headers} = context
        const user = await GraphqlTokenAuth(headers)
        const data  = await UserModel.aggregate([
            {
                $match: {
                    _id: user._id,
                }
            },
            {
                $project : {
                    email :true,
                    username:true,
                    mobileNumber:true,
                    orders:true,
                    walletCredit:true,
                    address:true,
                    birthday:true
                }
            },

        ]);

        return {
            statusCode :StatusCodes.OK,
            data : data[0]
        }

    },
};

const GetUserDiscounts = {
    type: ResponseType,
    resolve: async (_, args, context) => {
        const {headers} = context
        const user = await GraphqlTokenAuth(headers)
        const data = await UserModel.findById(user._id , {discounts: 1})

        return {
            statusCode :StatusCodes.OK,
            data :data.discounts
        }
    },
}

module.exports = {
    GetMarkedBlogs,
    GetMarkedProducts,
    GetUserShoppingCart,
    GetUserDashboard,
    GetUserDiscounts
};
