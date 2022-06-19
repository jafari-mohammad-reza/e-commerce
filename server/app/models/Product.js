const { default: mongoose } = require("mongoose");
const { CommentSchema } = require("./public.schema");
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    overView: { type: String, required: true, maxLength: 50 },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    tags: { type: [String], default: [] },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    comments: { type: [CommentSchema], default: [] },
    rate: { type: Number, default: 0 },
    likes: { type: [mongoose.Types.ObjectId], default: [] },
    dislikes: { type: [mongoose.Types.ObjectId], default: [] },
    price: { type: Number, default: 0, required: true },
    discount: { type: Number, default: 0 },
    stockCount: { type: Number, default: 0 },
    supplier: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    physicalFeatures: {
      type: Object,
      default: {
        length: "",
        height: "",
        width: "",
        weight: "",
        colors: [],
      },
    },
    additionalFeatures: {
      type: Object,
      default: {},
    },
    isActive: { type: boolean, default: true },
    isTrend: { type: boolean, default: false },
    isPrime: { type: boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);
ProductSchema.index({ title: "text", short_text: "text", text: "text" });
ProductSchema.virtual("imagesURL").get(function () {
  return this.images.map(
    (image) =>
      `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${image}`
  );
});
module.exports = {
  ProductSchema,
  ProductModel: mongoose.model("product", ProductSchema),
};
