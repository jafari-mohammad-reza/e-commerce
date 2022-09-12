const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
} = require("graphql");
const getBlogsQuery = require("./queries/Blog-Queries.resolver");
const {BlogResolver} = require("./queries/Blog-Queries.resolver");
const {
    ProductResolver,
    DiscountedProductResolver,
    MostRatedProductResolver,
    GetProductDetailResolver, GetProductByCategoryResolver
} = require("./queries/Product-Queries.resolver");
const {
    CategoryResolver,
    ChildrenCategoryResolver, GetCategoryByTitleResolver
} = require("./queries/Category-Querires.Resolver");
const {
    CreateBlogComment,
    CreateProductComment,
} = require("./mutations/Comments-Mutations.Resolver");
const {RateProduct} = require("./mutations/rating-Mutations.resolver");
const {LikeBlog, DisLikeBlog} = require("./mutations/opinion-Mutations.resolver");
const {
    BookMarkBlog,
    BookMarkProduct,
} = require("./mutations/bookmark-Mutations.resolver");
const {
    GetMarkedBlogs,
    GetMarkedProducts,
    GetUserShoppingCart, GetUserDashboard, GetUserDiscounts,
} = require("./queries/userProfile-Queries.resolver");
const {
    AddProductToCart,
    RemoveProductFromCart,
} = require("./mutations/cart-Mutations.resolver");
const {UpdateProfile} = require("./mutations/userProfile-Mutations.resolver");
const {GetUserOrders, GetUserOrderDetail} = require("./queries/Order-Queries.resolver");
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
        GetUserDashboard,
        GetUserOrders,
        GetUserOrderDetail,
        GetUserDiscounts
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
        UpdateProfile
    },
});

const graphQlSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});

module.exports = {
    graphQlSchema,
};
