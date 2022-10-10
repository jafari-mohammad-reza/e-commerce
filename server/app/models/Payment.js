const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
    {
      invoiceNumber: {type: String},
      authority: {type: String},
      paymentDate: {type: Number},
      amount: {type: Number},
      description: {type: String, default: 'for products purchase'},
      verify: {type: Boolean, default: false},
      user: {type: mongoose.Types.ObjectId, ref: 'user'},
      cart: {type: Object, default: {}},
      refID: {type: String, default: undefined},
      cardHash: {type: String, default: undefined},
    },
    {
      toJSON: {virtuals: true},
    },
);

module.exports = {
  PaymentModel: mongoose.model('payments', PaymentSchema),
};
