const { AdminCategoryRoutes } = require("./categoryRoutes");
const { VerifyAccessToken, checkRole } = require("../../http/middleWares/TokenAuthorization");
const { AdminBlogRoutes } = require("./blogRoute");
const { AdminProductRoutes } = require("./productRoute");
const router = require("express").Router();
router.all("*", VerifyAccessToken, checkRole("ADMIN"));
router.use("/category", AdminCategoryRoutes)
router.use("/blog", AdminBlogRoutes)
router.use("/product", AdminProductRoutes)
module.exports = { adminRoutes: router };
