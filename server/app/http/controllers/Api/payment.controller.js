const DefaultController = require('../default.controller');
module.exports = new (class PaymentController extends DefaultController {
  /**
     * send user to payment gateway
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {next} next
     * */
  PaymentGateway(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }

  /**
     * verify  payment gateway
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {next} next
     * */
  VerifyPayment(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
})();
