const {CategoryRoutes} = require("./categoryRoutes");
const router = require("express").Router();
router.use("/category", CategoryRoutes)
module.exports = {adminRoutes: router};
