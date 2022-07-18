const {GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLList} = require("graphql");
const {publicCategoryType, UserType} = require("./Public.type");

const BlogType = new GraphQLObjectType({
    name: 'blogType',
    fields: {
        _id: {type: GraphQLInt},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        overView: {type: GraphQLString},
        category: {type: publicCategoryType},
        createdAt: {type: GraphQLString},
        author: {type: UserType},
        imageURL: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},

    }
})
module.exports = {
    BlogType
}