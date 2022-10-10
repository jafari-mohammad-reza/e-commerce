const DefaultController = require('../default.controller');
const {getUserCart, invoiceNumberGenerator} = require('../../../utils/functions');
const axios = require('axios');
const {PaymentModel} = require('../../../models/Payment');
const moment = require('moment');
const {StatusCodes} = require('http-status-codes');
const createHttpError = require('http-errors');
const {UserModel} = require('../../../models/User');
const {OrderModel} = require('../../../models/Order');
module.exports = new (class PaymentController extends DefaultController {
  /**
   * send user to payment gateway
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async PaymentGateway(req, res, next) {
    try {
      const user = req.user;
      if (user.cart.products.length === 0) throw new createHttpError.BadRequest('Your shopping cart is empty');
      const cart = await getUserCart(user._id);
      if (!cart?.paymentDetail) throw new createHttpError.BadRequest('Payment detail was not founds');
      const zarinPalRequestUrl = 'https://api.zarinpal.com/pg/v4/payment/request.json';
      const zarinPalGatewayURL = 'https://www.zarinpal.com/pg/StartPay';
      const description = 'for product  purchase';
      const amount = cart?.paymentDetail?.DiscountedPaymentAmount;
      const zarinPalOptions = {
        merchant_id: process.env.ZARINPAL_MERCHANTID,
        amount,
        description,
        metadata: {
          email: user?.email || 'example@domain.com',
          mobile: user.mobile,
        },
        callback_url: 'http://localhost:5000/api/v1/payment/verify',
      };
      const RequestResult = await axios.post(zarinPalRequestUrl, zarinPalOptions).then((result) => result.data);
      const {authority, code} = RequestResult.data;
      await PaymentModel.create({
        invoiceNumber: invoiceNumberGenerator(),
        paymentDate: moment().format('jYYYYjMMjDDHHmmss'),
        amount,
        user: user._id,
        description,
        authority,
        verify: false,
        cart,

      });
      if (code == 100 && authority) {
        return res.status(StatusCodes.OK).json({
          statusCode: StatusCodes.OK,
          data: {
            code,
            cart,
            gatewayURL: `${zarinPalGatewayURL}/${authority}`,
          },
        });
      }
      throw createHttpError.BadRequest('connection failed');
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
  async VerifyPayment(req, res, next) {
    try {
      const {Authority: authority} = req.query;
      const verifyURL = 'https://api.zarinpal.com/pg/v4/payment/verify.json';
      const payment = await PaymentModel.findOne({authority});
      if (!payment) throw createHttpError.NotFound('transaction not found');
      if (payment.verify) throw createHttpError.BadRequest('transactions already payed');
      const verifyBody = JSON.stringify({
        authority,
        amount: payment.amount,
        merchant_id: process.env.ZARINPAL_MERCHANTID,
      });
      const verifyResult = await fetch(verifyURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: verifyBody,
      }).then((result) => result.json());
      if (verifyResult.data.code == 100) {
        await PaymentModel.updateOne({authority}, {
          $set: {
            refID: verifyResult.data.ref_id,
            cardHash: verifyResult.data.card_hash,
            verify: true,
          },
        });
        const user = await UserModel.findById(payment.user);
        await UserModel.updateOne({_id: payment.user}, {
          $set: {
            orders: [...payment?.cart || [], ...user.orders],
            cart: {
              products: [],
              totalPrice: 0,
              discount: 0,
            },
          },
        });
        await OrderModel.create({
          costumer: payment.user,
          products: payment?.cart.products,
          totalPrice: payment.cart.paymentDetail?.DiscountedPaymentAmount,
          isCompleted: false,
          isPayed: true,
        });
        return res.status(StatusCodes.OK).json({
          statusCode: StatusCodes.OK,
          data: {
            message: 'your purchase done successfully.',
          },
        });
      }
      throw createHttpError.BadRequest('purchase failed, your money will be return by 72 hours');
    } catch (error) {
      next(error);
    }
  }
})();
