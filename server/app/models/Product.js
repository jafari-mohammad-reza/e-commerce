const {default: mongoose, Types} = require("mongoose");
const {CommentSchema, RatingSchema, PhysicalFeatureSchema} = require("./public.schemas");
const ProductSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        overView: {type: String, required: true, maxLength: 50},
        description: {type: String, required: true},
        images: {type: [String], required: true},
        tags: {type: [String], default: []},
        category: {
            type: mongoose.Types.ObjectId,
            ref: "category",
            required: true,
        },
        comments: {type: [CommentSchema], default: []},
        ratings: {
            type: [RatingSchema],
            default: [],
            required: false
        },
        price: {type: Number, default: 0, required: true},
        discount: {type: Number, default: 0},
        stockCount: {type: Number, default: 0},
        supplier: {type: mongoose.Types.ObjectId, ref: "user", required: true},
        physicalFeatures: {type: [PhysicalFeatureSchema], required: false},
        isActive: {type: Boolean, default: true},
        isTrend: {type: Boolean, default: false},
        isPrime: {type: Boolean, default: false},
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);
ProductSchema.index({title: "text", overView: "text", description: "text"});
ProductSchema.virtual("imagesURL").get(function () {
    return this.images.map(
        (image) =>
            `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${image}`
    );
});
ProductSchema.virtual("categoryName", {
    ref: "category",
    localField: "category",
    foreignField: "_id",
    justOne: true,
});

function autoPopulate(next) {
    this.populate([
        {path: "categoryName", select: {__v: 0, id: 0, _id: 0, parent: 0}},
    ]);
    next();
}

ProductSchema.pre("findOne", autoPopulate).pre("find", autoPopulate);

module.exports = {
    ProductSchema,
    ProductModel: mongoose.model("product", ProductSchema),
};
