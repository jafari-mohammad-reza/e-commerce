const {default: mongoose, Types} = require("mongoose");
const ProductSchema = new mongoose.Schema({
    productId: {type: mongoose.Types.ObjectId, ref: "product"},
    count: {type: Number, default: 1},
});
const ReplySchema = new mongoose.Schema(
    {
        author: {type: mongoose.Types.ObjectId, ref: "user", required: true},
        content: {type: String, required: true},
        isApproved: {type: Boolean, required: true, default: false},
        ReplyAble: {type: Boolean, default: false},
        parentComment: {
            type: mongoose.Types.ObjectId,
            ref: "comment",
            default: null,
        },
    },
    {
        timestamps: {createdAt: true},
    }
);
const CommentSchema = new mongoose.Schema(
    {
        author: {type: mongoose.Types.ObjectId, ref: "user", required: true},
        content: {type: String, required: true},
        isApproved: {type: Boolean, required: true, default: false},
        ReplyAble: {type: Boolean, default: true},
        Replies: {type: [ReplySchema], default: []},
    },
    {
        timestamps: {createdAt: true},
    }
);

const CartSchema = new mongoose.Schema({
    products: {type: [ProductSchema], default: []},
    totalPrice: {type: Number, required: false, default: 0},
    discount: {type: Number, default: 0, required: false},
});

const RatingSchema = new mongoose.Schema({
    stars: {type: Number, required: true, maximum: 5, minimum: 0},
    postBy: {type: mongoose.Types.ObjectId, ref: "user", required: true},
});


module.exports = {
    CommentSchema,
    ReplySchema,
    CartSchema,
    RatingSchema,
};
