const {AdminCategoryRoutes} = require("./category.routes");
const {VerifyAccessToken, checkRole} = require("../../http/middleWares/TokenAuthorization");
const {AdminBlogRoutes} = require("./blog.routes");
const {AdminProductRoutes} = require("./product.routes");
const {AdminUserRoutes} = require("./user.routes");
const router = require("express").Router();
// router.all("*", VerifyAccessToken, checkRole("ADMIN"));
router.use("/categories", AdminCategoryRoutes)
router.use("/blogs", AdminBlogRoutes)
router.use("/products", AdminProductRoutes)
router.use("/users", AdminUserRoutes)
module.exports = {adminRoutes: router};
