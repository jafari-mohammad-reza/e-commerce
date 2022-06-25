const {AuthRouter} = require("./authRouter");

const router = require("express").Router();
router.use("/auth", AuthRouter);
module.exports = {apiRoutes: router};
