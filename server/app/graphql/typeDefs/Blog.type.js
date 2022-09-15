const {CommentType} = require('./Comment.type');
const {CategoryType} = require('./Category.type');
const {GraphQLObjectType, GraphQLString, GraphQLList} = require('graphql/type');
const {UserType} = require('./Public.type');

const BlogType = new GraphQLObjectType({
  name: 'blogType',
  fields: {
    _id: {type: GraphQLString},
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    overView: {type: GraphQLString},
    category: {type: CategoryType},
    createdAt: {type: GraphQLString},
    author: {type: UserType},
    imageURL: {type: GraphQLString},
    tags: {type: new GraphQLList(GraphQLString)},
    comments: {type: new GraphQLList(CommentType)},
    bookmarks: {type: new GraphQLList(UserType)},
    likes: {type: new GraphQLList(UserType)},
    dislikes: {type: new GraphQLList(UserType)},

  },
});
module.exports = {
  BlogType,
};
