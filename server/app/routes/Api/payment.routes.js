const router = require('express').Router();
const {
  PaymentGateway,
  VerifyPayment,
} = require('../../http/controllers/Api/payment.controller');
router.post('payment', PaymentGateway);
router.post('verify', VerifyPayment);
module.exports = {
  PaymentRouter: router,
};
