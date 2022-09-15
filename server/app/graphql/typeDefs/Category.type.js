const {GraphQLObjectType, GraphQLString, GraphQLList} = require('graphql');
const {AnyType} = require('./Public.type');
const CategoryType = new GraphQLObjectType({
  name: 'categoryType',
  fields: {
    _id: {type: GraphQLString},
    title: {type: GraphQLString},
    children: {
      type: new GraphQLList(AnyType),
    },
    imageURL: {type: GraphQLString},
  },
});

module.exports = {
  CategoryType,
};
