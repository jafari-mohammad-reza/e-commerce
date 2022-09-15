const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');
const {UserType, RatingType} = require('./Public.type');
const {CommentType} = require('./Comment.type');
const {CategoryType} = require('./Category.type');

const ProductType = new GraphQLObjectType({
  name: 'productType',
  fields: {
    _id: {type: GraphQLString},
    title: {type: GraphQLString},
    overView: {type: GraphQLString},
    description: {type: GraphQLString},
    tags: {type: new GraphQLList(GraphQLString)},
    price: {type: GraphQLFloat},
    discount: {type: GraphQLInt},
    stockCount: {type: GraphQLInt},
    imagesURL: {type: new GraphQLList(GraphQLString)},
    supplier: {type: UserType},
    comments: {type: new GraphQLList(CommentType)},
    ratings: {type: new GraphQLList(RatingType)},
    bookmarks: {type: new GraphQLList(UserType)},
    physicalFeatures: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'physicalFeatures',
        fields: {
          name: {type: GraphQLString},
          value: {type: GraphQLString},
        },
      })),
    },
    isActive: {type: GraphQLBoolean, default: true},
    isTrend: {type: GraphQLBoolean, default: false},
    isPrime: {type: GraphQLBoolean, default: false},
    discountedPrice: {type: GraphQLFloat, default: 0},
    averageRating: {type: GraphQLFloat, default: 0},
    category: {type: CategoryType},
  },
});

module.exports = {
  ProductType,
};
