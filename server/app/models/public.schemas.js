const {default: mongoose} = require("mongoose");
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
const OrderSchema = new mongoose.Schema({
    costumer: {type: mongoose.Types.ObjectId, required: true, ref: "user"},
    products: {type: [ProductSchema], default: []},
    totalPrice: {type: Number, required: false, default: 0},
    discount: {type: Number, default: 0, required: false},
    isCompleted: {type: Boolean, default: false},
    isCanceled: {type: Boolean, default: false},
});
const CartSchema = new mongoose.Schema({
    products: {type: [ProductSchema], default: []},
    totalPrice: {type: Number, required: false, default: 0},
    discount: {type: Number, default: 0, required: false},
});

const RatingSchema = new mongoose.Schema({
    stars: {type: Number, required: true, maximum: 5, minimum: 0},
    postBy: {type: mongoose.Types.ObjectId, ref: "user", required: true},
});

const PhysicalFeatureSchema = new mongoose.Schema({
    width: {type: Number, required: true},
    height: {type: Number, required: true},
    depth: {type: Number, required: true},
    weight: {type: Number, required: true},
    colors: {type: [String], required: true},
    materials: {type: [String], required: true},
    manufacturer: {type: String, required: true},
});

module.exports = {
    CommentSchema,
    ReplySchema,
    OrderSchema,
    CartSchema,
    RatingSchema,
    PhysicalFeatureSchema,
};
