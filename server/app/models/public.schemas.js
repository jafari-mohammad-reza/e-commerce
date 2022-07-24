const { default: mongoose } = require("mongoose");
const { ProductSchema } = require("./Product");
const ReplySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true },
    isApproved: { type: Boolean, required: true, default: false },
    ReplyAble: { type: Boolean, default: false },
    parentComment: {
      type: mongoose.Types.ObjectId,
      ref: "comment",
      default: null,
    },
  },
  {
    timestamps: { createdAt: true },
  }
);
const CommentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true },
    isApproved: { type: Boolean, required: true, default: false },
    ReplyAble: { type: Boolean, default: true },
    Replies: { type: [ReplySchema], default: [] },
  },
  {
    timestamps: { createdAt: true },
  }
);
const OrderSchema = new mongoose.Schema({
  costumer: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
  items: { type: [ProductSchema], required: true },
  totalPrice: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
  isCanceled: { type: Boolean, default: false },
});
const CartSchema = new mongoose.Schema({
  costumer: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
  items: { type: [ProductSchema], default: [] },
  totalPrice: { type: Number, required: true },
  discount: { type: Number, default: "" },
});
module.exports = {
  CommentSchema,
  ReplySchema,
  OrderSchema,
  CartSchema,
};
