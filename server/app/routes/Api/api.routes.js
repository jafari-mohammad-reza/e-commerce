const {
  VerifyAccessToken,
} = require('../../http/middleWares/TokenAuthorization');
const {AuthRouter} = require('./auth.routes');
const {DeveloperRouter} = require('./developer.routes');
const {PaymentRouter} = require('./payment.routes');

const router = require('express').Router();

router.use('/auth', AuthRouter);
router.use('/developer', DeveloperRouter);
router.use('/payment', VerifyAccessToken, PaymentRouter);
module.exports = {apiRoutes: router};
