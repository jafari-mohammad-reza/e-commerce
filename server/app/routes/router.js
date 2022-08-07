const {adminRoutes} = require("./Admin/admin.routes");
const {apiRoutes} = require("./Api/api.routes");
const {clientRoutes} = require("./Client/client.routes");
const {VerifyAccessToken} = require("../http/middleWares/TokenAuthorization");
const {graphqlHTTP} = require("express-graphql");
const graphQlSchema = require("../graphql/index.graphql");
const {graphQlConfig} = require("../conf/graphql.config");
const { DeveloperRouter } = require("./Developer/loadTest");

const router = require("express").Router();
// router.all("*", (req, res, next) => {
//   console.log(req.headers);
// });
router.use("/admin", VerifyAccessToken, adminRoutes);
router.use("/api/v1", apiRoutes);
router.use("/client/", clientRoutes);
router.use("/graphql", graphqlHTTP(graphQlConfig))
router.use("/developer" , DeveloperRouter)
module.exports = {
    mainRouter: router,
};
