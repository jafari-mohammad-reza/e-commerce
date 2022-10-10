const {default: mongoose} = require('mongoose');

const OrderSchema = new mongoose.Schema({
  costumer: {type: mongoose.Types.ObjectId, required: true, ref: 'user'},
  products: {type: [mongoose.Types.objectId], ref: 'product', default: []},
  totalPrice: {type: Number, required: false, default: 0},
  isCompleted: {type: Boolean, default: false},
  isPayed: {type: Boolean, default: false},
}, {
  timestamps: true,
});
const OrderModel = mongoose.model('order', OrderSchema);
module.exports = {OrderModel};
