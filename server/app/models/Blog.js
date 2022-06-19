const { default: mongoose } = require("mongoose");
const { CommentSchema } = require("./public.schemas");
const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  overView: { type: String, required: true, maxLength: 50 },
  content: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
  imageUrl: { type: String, required: true },
  tags: { type: [String], default: [] },
  category: { type: mongoose.Types.ObjectId, ref: "category", required: true },
  comments: { type: [CommentSchema], default: [] },
  like: { type: [mongoose.Types.ObjectId], ref: "users", default: [] },
  dislikes: { type: [mongoose.Types.ObjectId], ref: "users", default: [] },
  bookmarks: { type: [mongoose.Types.ObjectId], ref: "users", default: [] },
});

BlogSchema.virtual("user", {
  ref: "user",
  localField: "_id",
  foreignField: "author",
});
BlogSchema.virtual("category_detail", {
  ref: "category",
  localField: "_id",
  foreignField: "category",
});
BlogSchema.virtual("imageURL").get(function () {
  return `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.image}`;
});
module.exports = {
  BlogModel: mongoose.model("blog", BlogSchema),
};
