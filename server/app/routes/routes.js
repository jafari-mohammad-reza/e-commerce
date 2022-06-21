const {adminRoutes} = require("./Admin/admin.routes");
const {apiRoutes} = require("./Api/apiRouter");
const {clientRoutes} = require("./Client/client.routes");

const router = require("express").Router();
router.use("/admin/", adminRoutes);
router.use("/api/v1", apiRoutes);
router.use("/client/", clientRoutes);
module.exports = {
    mainRouter: router,
};
