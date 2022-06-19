const { AuthRouter } = require("./auth.router");

const router = require("express").Router();
router.use("/auth", AuthRouter);
module.exports = { apiRoutes: router };
