const {default: mongoose} = require("mongoose");
const {ProductSchema} = require("./Product");
const AnswerSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Types.ObjectId, ref: "user", required: true},
        comment: {type: String, required: true},
        show: {type: Boolean, required: true, default: false},
        openToComment: {type: Boolean, default: false},
    },
    {
        timestamps: {createdAt: true},
    }
);
const CommentSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Types.ObjectId, ref: "user", required: true},
        comment: {type: String, required: true},
        show: {type: Boolean, required: true, default: false},
        openToComment: {type: Boolean, default: true},
        answers: {type: [AnswerSchema], default: []},
    },
    {
        timestamps: {createdAt: true},
    }
);
const OrderSchema = new mongoose.Schema({
    costumer: {type: mongoose.Types.ObjectId, required: true, ref: "user"},
    items: {type: [ProductSchema], required: true},
    totalPrice: {type: Number, required: true},
    isCompleted: {type: Boolean, default: false},
    isCanceled: {type: Boolean, default: false},
});
const CartSchema = new mongoose.Schema({
    costumer: {type: mongoose.Types.ObjectId, required: true, ref: "user"},
    items: {type: [ProductSchema], default: []},
    totalPrice: {type: Number, required: true},
    discount: {type: Number, default: ""},
});
module.exports = {
    CommentSchema,
    AnswerSchema,
    OrderSchema,
    CartSchema,
};
