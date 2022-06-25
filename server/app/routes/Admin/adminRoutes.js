const {AdminCategoryRoutes} = require("./categoryRoutes");
const {VerifyAccessToken, checkRole} = require("../../http/middleWares/TokenAuthorization");
const {AdminBlogRoutes} = require("./blogRoute");
const router = require("express").Router();
router.all("*" ,VerifyAccessToken , checkRole("ADMIN"))
router.use("/category", AdminCategoryRoutes)
router.use("/blog", AdminBlogRoutes)
module.exports = {adminRoutes: router};
