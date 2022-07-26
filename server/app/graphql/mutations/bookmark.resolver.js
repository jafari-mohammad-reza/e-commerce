const { ResponseType } = require("../typeDefs/Public.type");
const { GraphQLNonNull, GraphQLString } = require("graphql");
const {
  GraphqlTokenAuth,
} = require("../../http/middleWares/TokenAuthorization");
const { isValidObjectId } = require("mongoose");
const { BlogModel } = require("../../models/Blog");
const createHttpError = require("http-errors");
const { ProductModel } = require("../../models/Product");
const { StatusCodes } = require("http-status-codes");
const BookMarkBlog = {
  type: ResponseType,
  args: {
    blogId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    const user = await GraphqlTokenAuth(context.rawHeaders[1]);
    const { blogId } = args;
    const blog = await BlogModel.findById(blogId);
    if (!blog || !isValidObjectId(blogId)) {
      throw new createHttpError.BadRequest("not a valid blogId");
    }
    const bookMarkedBlog = await BlogModel.findOne({
      _id: blogId,
      bookmarks: user._id,
    });
    const updateQuery = bookMarkedBlog
      ? { $pull: { bookmarks: user._id } }
      : { $push: { bookmarks: user._id } };
    await BlogModel.updateOne({ _id: blogId }, updateQuery);
    let message;
    if (bookMarkedBlog) {
      message = "Blog unbookmarked successfully";
    } else {
      message = "Blog bookmarked successfully";
    }
    return {
      StatusCode: StatusCodes.OK,
      data: {
        message,
      },
    };
  },
};
const BookMarkProduct = {
  type: ResponseType,
  args: {
    productId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    const user = await GraphqlTokenAuth(context.rawHeaders[1]);
    const { productId } = args;
    const product = await ProductModel.findById(productId);
    if (!product || !isValidObjectId(productId)) {
      throw new createHttpError.BadRequest("not a valid productId");
    }
    const bookMarkedProduct = await ProductModel.findOne({
      _id: productId,
      bookmarks: user._id,
    });
    const updateQuery = bookMarkedProduct
      ? { $pull: { bookmarks: user._id } }
      : { $push: { bookmarks: user._id } };
    await ProductModel.updateOne({ _id: productId }, updateQuery);
    let message;
    if (bookMarkedProduct) {
      message = "Product unbookmarked successfully";
    } else {
      message = "Product bookmarked successfully";
    }
    return {
      StatusCode: StatusCodes.OK,
      data: {
        message,
      },
    };
  },
};

module.exports = {
  BookMarkBlog,
  BookMarkProduct,
};
