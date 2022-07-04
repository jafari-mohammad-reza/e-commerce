const {AdminCategoryRoutes} = require("./category.routes");
const {VerifyAccessToken} = require("../../http/middleWares/TokenAuthorization");
const permissionVaidator = require("../../http/middleWares/permissionVaidator");
const {AdminBlogRoutes} = require("./blog.routes");
const {AdminProductRoutes} = require("./product.routes");
const {AdminUserRoutes} = require("./user.routes");
const {AdminRoleRoutes} = require("./role.routes");
const {AdminPermissionRoutes} = require("./permission.routes");
const {PERMISSIONS} = require("../../conf/constant");
const router = require("express").Router();
router.use("/categories", permissionVaidator([PERMISSIONS.CONTENT_MANAGER]), AdminCategoryRoutes)
router.use("/blogs", permissionVaidator([PERMISSIONS.CONTENT_MANAGER]), AdminBlogRoutes)
router.use("/products", permissionVaidator([PERMISSIONS.CONTENT_MANAGER, PERMISSIONS.SUPPLIER]), AdminProductRoutes)
router.use("/users", permissionVaidator([PERMISSIONS.COUNTER]), AdminUserRoutes)
router.use("/roles", permissionVaidator([]), AdminRoleRoutes)
router.use("/permissions", permissionVaidator([]), AdminPermissionRoutes)
module.exports = {adminRoutes: router};
