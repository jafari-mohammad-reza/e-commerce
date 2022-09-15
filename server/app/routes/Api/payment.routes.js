const router = require('express').Router();
const {
  PaymentGateway,
} = require('../../http/controllers/Api/payment.controller');
const {} = require('../../http/middleWares/TokenAuthorization');
router.post('payment', PaymentGateway);
router.post('verify', PaymentGateway);
module.exports = {
  PaymentRouter: router,
};
