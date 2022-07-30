const DefaultController = require("../default.controller");
module.exports = new (class PaymentController extends DefaultController {
    PaymentGateway(req, res, next) {
        try {
        } catch (error) {
            next(error);
        }
    }

    VerifyPayment(req, res, next) {
        try {
        } catch (error) {
            next(error);
        }
    }
})();
