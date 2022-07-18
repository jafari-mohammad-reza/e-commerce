const {GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat, GraphQLInt} = require("graphql");
const {publicCategoryType, UserType} = require("./Public.type");
const ProductType = new GraphQLObjectType({
    name: "productType",
    fields: {
        _id: {type: GraphQLString},
        title: {type: GraphQLString},
        overView: {type: GraphQLString},
        description: {type: GraphQLString},
        category: {type: publicCategoryType},
        tags: {type: new GraphQLList(GraphQLString)},
        price: {type: GraphQLFloat},
        discount: {type: GraphQLInt},
        stockCount: {type: GraphQLInt},
        imagesURL: {type: new GraphQLList(GraphQLString)},
        supplier: {type: UserType},
    }
})

module.exports = {
    ProductType
}