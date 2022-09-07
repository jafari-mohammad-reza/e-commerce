const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
} = require("graphql");
const getBlogsQuery = require("./queries/Blog.resolver");
const {BlogResolver} = require("./queries/Blog.resolver");
const {
    ProductResolver,
    DiscountedProductResolver,
    MostRatedProductResolver,
    GetProductDetailResolver, GetProductByCategoryResolver
} = require("./queries/Product.resolver");
const {
    CategoryResolver,
    ChildrenCategoryResolver, GetCategoryByTitleResolver
} = require("./queries/Category.Resolver");
const {
    CreateBlogComment,
    CreateProductComment,
} = require("./mutations/Comments.Resolver");
const {RateProduct} = require("./mutations/rating.resolver");
const {LikeBlog, DisLikeBlog} = require("./mutations/opinion.resolver");
const {
    BookMarkBlog,
    BookMarkProduct,
} = require("./mutations/bookmark.resolver");
const {
    GetMarkedBlogs,
    GetMarkedProducts,
    GetUserShoppingCart,
} = require("./queries/user-profile.resolver");
const {
    AddProductToCart,
    RemoveProductFromCart,
} = require("./mutations/cart.resolver");
const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        blog: BlogResolver,
        products: ProductResolver,
        category: CategoryResolver,
        childCategory: ChildrenCategoryResolver,
        GetMarkedBlogs,
        GetMarkedProducts,
        GetUserShoppingCart,
        GetDiscounts: DiscountedProductResolver,
        MostRatedProducts: MostRatedProductResolver,
        GetCategoryByTitle: GetCategoryByTitleResolver,
        GetProductDetail: GetProductDetailResolver,
        GetProductByCategory: GetProductByCategoryResolver,

    },
});

const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        CreateBlogComment,
        CreateProductComment,
        RateProduct,
        LikeBlog,
        DisLikeBlog,
        BookMarkBlog,
        BookMarkProduct,
        AddProductToCart,
        RemoveProductFromCart,
    },
});

const graphQlSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});

module.exports = {
    graphQlSchema,
};
