const {GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat, GraphQLInt, GraphQLBoolean} = require("graphql");
const {UserType} = require("./Public.type");
const {CommentType} = require("./Comment.type");
const {CategoryType} = require("./Category.type");
const PhysicalFeaturesType = new GraphQLObjectType({
    name: "features",
    fields: {
        length: {type: GraphQLString},
        height: {type: GraphQLString},
        width: {type: GraphQLString},
        weight: {type: GraphQLString},
        colors: {type: new GraphQLList(GraphQLString)},
        Manufacturer: {type: GraphQLString}
    }
})
const ProductType = new GraphQLObjectType({
    name: "productType",
    fields: {
        _id: {type: GraphQLString},
        title: {type: GraphQLString},
        overView: {type: GraphQLString},
        description: {type: GraphQLString},
        category: {type: CategoryType},
        tags: {type: new GraphQLList(GraphQLString)},
        price: {type: GraphQLFloat},
        discount: {type: GraphQLInt},
        stockCount: {type: GraphQLInt},
        imagesURL: {type: new GraphQLList(GraphQLString)},
        supplier: {type: UserType},
        comments: {type: new GraphQLList(CommentType)},
        ratings: {type: new GraphQLList(UserType)},
        bookmarks: {type: new GraphQLList(UserType)},
        physicalFeatures: {type: PhysicalFeaturesType},
        isActive: {type: GraphQLBoolean, default: true},
        isTrend: {type: GraphQLBoolean, default: false},
        isPrime: {type: GraphQLBoolean, default: false},
        rate: {type: GraphQLFloat, default: 0},


    }
})

module.exports = {
    ProductType
}