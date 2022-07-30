const {
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString,
    GraphQLScalarType,
} = require("graphql");
const {convertTOObject, parseLiteral} = require("../../utils/functions.js");

const UserType = new GraphQLObjectType({
    name: "UserType",
    fields: {
        _id: {type: GraphQLString},
        username: {type: GraphQLString},
        email: {type: GraphQLString},
        mobileNumber: {type: GraphQLString},
    },
});

const AnyType = new GraphQLScalarType({
    name: "anyType",
    parseValue: convertTOObject,
    serialize: convertTOObject,
    parseLiteral: parseLiteral,
});

const ResponseType = new GraphQLObjectType({
    name: "responseType",
    fields: {
        statusCode: {type: GraphQLString},
        data: {type: AnyType}
    }
})

const RatingType = new GraphQLObjectType({
    name: "ratingType",
    fields: {
        postBy: {type: UserType},
        stars: {type: GraphQLInt},
    }
})

module.exports = {
    UserType,
    AnyType,
    ResponseType,
    RatingType
};
