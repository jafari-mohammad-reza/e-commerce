const {AdminCategoryRoutes} = require("./category.routes");
const {VerifyAccessToken} = require("../../http/middleWares/TokenAuthorization");
const permissionValidator = require("../../http/middleWares/permissionValidator");
const {AdminBlogRoutes} = require("./blog.routes");
const {AdminProductRoutes} = require("./product.routes");
const {AdminUserRoutes} = require("./user.routes");
const {AdminRoleRoutes} = require("./role.routes");
const {AdminPermissionRoutes} = require("./permission.routes");
const {PERMISSIONS} = require("../../conf/constant");
const router = require("express").Router();
router.use("/categories", permissionValidator([PERMISSIONS.CONTENT_MANAGER, PERMISSIONS.ADMIN]), AdminCategoryRoutes)
router.use("/blogs", permissionValidator([PERMISSIONS.CONTENT_MANAGER, PERMISSIONS.ADMIN]), AdminBlogRoutes)
router.use("/products", permissionValidator([PERMISSIONS.CONTENT_MANAGER, PERMISSIONS.SUPPLIER, PERMISSIONS.ADMIN]), AdminProductRoutes)
router.use("/users", permissionValidator([PERMISSIONS.COUNTER, PERMISSIONS.ADMIN]), AdminUserRoutes)
router.use("/roles", permissionValidator([PERMISSIONS.SUPERADMIN]), AdminRoleRoutes)
router.use("/permissions", permissionValidator([PERMISSIONS.SUPERADMIN]), AdminPermissionRoutes)
module.exports = {adminRoutes: router};
