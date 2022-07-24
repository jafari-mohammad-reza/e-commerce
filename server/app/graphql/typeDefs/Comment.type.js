const {GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList} = require("graphql");
const {UserType} = require("./Public.type");

const CommentReplyType = new GraphQLObjectType({
    name: "CommentAnswerType",
    fields: {
        _id: {type: GraphQLString},
        author: {type: UserType},
        content: {type: GraphQLString},
        createdAt: {type: GraphQLString},
        isApproved: {type: GraphQLBoolean}
    }
})
const CommentType = new GraphQLObjectType({
    name: "commentType",
    fields: {
        _id: {type: GraphQLString},
        author: {type: UserType},
        content: {type: GraphQLString},
        Replies: {type: new GraphQLList(CommentReplyType)},
        isApproved: {type: GraphQLBoolean},
        ReplyAble: {type: GraphQLBoolean},
        createdAt: {type: GraphQLString}
    }
})

module.exports = {
    CommentType
}