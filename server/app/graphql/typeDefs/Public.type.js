const {GraphQLInt, GraphQLObjectType, GraphQLString} = require("graphql");

const publicCategoryType = new GraphQLObjectType({
    name: "publicCategoryType",
    fields: {
        _id: {type: GraphQLInt},
        name: {type: GraphQLString},
        createdAt: {type: GraphQLString},
    },
})

const UserType = new GraphQLObjectType({
    name: "UserType",
    fields: {
        _id: {type: GraphQLString},
        username: {type: GraphQLString},
        email: {type: GraphQLString},
        mobileNumber: {type: GraphQLString},
    }
})

module.exports = {
    publicCategoryType,
    UserType
}

