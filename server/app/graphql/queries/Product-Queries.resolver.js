const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require('graphql');
const {ProductType} = require('../typeDefs/Product.type');
const {ProductModel} = require('../../models/Product');

const {CategoryModel} = require('../../models/Category');
const {checkRedisKey} = require('../../utils/functions');
const redisClient = require('../../conf/redisConfiguration');
const ProductQueriesResolver = {
  type: new GraphQLList(ProductType),
  args: {
    limit: {type: GraphQLInt, defaultValue: 10},
    category: {type: GraphQLString},
    search: {type: GraphQLString},
    order: {type: GraphQLString, defaultValue: -1},
  },
  resolve: async (parent, args) => {
    const {limit, category, search, order} = args;
    let query = category ? {category: category} : {};
    search && (query = {
      $text: {$search: search},
    });
    return ProductModel.find(query).limit(limit).sort({_id: order});
  },
};
const DiscountedProductResolver = {
  type: new GraphQLList(ProductType),
  args: {
    limit: {type: GraphQLInt, defaultValue: 10},
    order: {type: GraphQLString, defaultValue: 'ascending'},
  },
  resolve: async (parent, args) => {
    const {limit} = args;
    return ProductModel.find({discount: {$gt: 0}}).limit(limit).sort({discount: -1});
  },
};

const MostRatedProductResolver = {
  type: new GraphQLList(ProductType),
  args: {
    limit: {type: GraphQLInt, defaultValue: 15},
  },
  resolve: async (parent, args) => {
    const {limit} = args;
    return ProductModel.find({ratings: {$ne: []}}).limit(limit).sort({ratings: -1});
  },


};

const GetProductDetailResolver = {
  type: ProductType,
  args: {
    id: {type: GraphQLString, default: undefined},
    title: {type: GraphQLString, default: undefined},
  },
  resolve: async (parent, args) => {
    let {id, title} = args;
    if (!id && !title) return null;
    if (id) {
      const cachedData = await checkRedisKey(id);
      if (cachedData) {
        return cachedData;
      }
      const data = await ProductModel.findById(id);
      await redisClient.setEx(id, 3600, JSON.stringify(data));
      return data;
    } else {
      title = title.replace('_', ' ');
      const cachedData = await checkRedisKey(title);
      if (cachedData) {
        return cachedData;
      }
      const data = await ProductModel.findOne({$text: {$search: title, $caseSensitive: false}});
      await redisClient.setEx(title, 3600, JSON.stringify(data));
      return data;
    }
  },
};

const GetProductByCategoryResolver = {
  type: new GraphQLList(ProductType),
  args: {
    title: {type: GraphQLString},
  },
  resolve: async (parent, args) => {
    let {title} = args;
    title = title.replace('_', ' ');
    let foundedCategory = undefined;
    const cachedCategory = await checkRedisKey(title);
    if (cachedCategory) {
      foundedCategory = cachedCategory;
    } else {
      const category = await CategoryModel.findOne({$text: {$search: title, $caseSensitive: false}});
      foundedCategory = category;
      await redisClient.setEx(title, 3600, JSON.stringify(category));
    }
    return ProductModel.find({category: foundedCategory});
  },
};


module.exports = {
  ProductResolver: ProductQueriesResolver,
  DiscountedProductResolver,
  MostRatedProductResolver,
  GetProductDetailResolver,
  GetProductByCategoryResolver,
};
