const router = require("express").Router();
const {
    PaymentGateway,
    VerifyPayment,
} = require("../../http/controllers/Api/payment.controller");
const {
    VerifyAccessToken,
} = require("../../http/middleWares/TokenAuthorization");
router.post("payment", PaymentGateway);
router.post("verify", PaymentGateway);
module.exports = {
    PaymentRouter: router,
};
