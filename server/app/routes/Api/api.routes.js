const {AuthRouter} = require("./auth.routes");
const {DeveloperRouter} = require("./developer.routes");

const router = require("express").Router();
router.use("/auth", AuthRouter);
router.use("/developer", DeveloperRouter);
module.exports = {apiRoutes: router};
