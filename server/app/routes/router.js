const {adminRoutes} = require("./Admin/admin.routes");
const {apiRoutes} = require("./Api/api.routes");
const {VerifyAccessToken} = require("../http/middleWares/TokenAuthorization");
const {graphqlHTTP} = require("express-graphql");
const graphQlSchema = require("../graphql/index.graphql");
const {graphQlConfig} = require("../conf/graphql.config");
const {StatusCodes} = require("http-status-codes");
const path = require("path")
const limit = require("express-rate-limit");
const router = require("express").Router();
// router.all("*", (req, res, next) => {
//   console.log(req.headers);
// });
router.use("/admin", VerifyAccessToken, adminRoutes);
router.use("/api/v1", apiRoutes);
const graphqlLimit = limit({
    windowMs: 3000000, // 5 minutes
    max: 25,
    message: {
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
        message: "Too many requests from this IP, please try again later.",
    },
    skipFailedRequests: true,
})
router.use("/graphql",
    graphqlLimit,
    graphqlHTTP(graphQlConfig))
router.get("/graphql-doc" , (req,res,next) =>{

    return res.render("swagger-doc/index.html" )
})

module.exports = {
    mainRouter: router,
};
