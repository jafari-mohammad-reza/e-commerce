const {adminRoutes} = require('./Admin/admin.routes');
const {apiRoutes} = require('./Api/api.routes');
const {VerifyAccessToken} = require('../http/middleWares/TokenAuthorization');
const {GraphQlRoutes} = require('./Api/graphql.routes');
const router = require('express').Router();
router.use('/admin', VerifyAccessToken, adminRoutes);
router.use('/api/v1', apiRoutes);
router.use(GraphQlRoutes);

module.exports = {
  mainRouter: router,
};
