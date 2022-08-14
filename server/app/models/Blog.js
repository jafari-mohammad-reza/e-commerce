const {default: mongoose} = require("mongoose");
const {CommentSchema} = require("./public.schemas");
const BlogSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        overView: {type: String, required: true, maxLength: 50},
        content: {type: String, required: true},
        author: {type: mongoose.Types.ObjectId, ref: "user", required: true},
        image: {type: String, required: true},
        tags: {type: [String], default: []},
        category: {
            type: mongoose.Types.ObjectId,
            ref: "category",
            required: true,
        },
        comments: {type: [CommentSchema], default: []},
        likes: {type: [mongoose.Types.ObjectId], ref: "user", default: []},
        dislikes: {type: [mongoose.Types.ObjectId], ref: "user", default: []},
        bookmarks: {type: [mongoose.Types.ObjectId], ref: "user", default: []},
    },
    {
        id: false,
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
    }
);


BlogSchema.virtual("imageURL").get(function () {
    return `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.image}`;
});

function autoPopulate(next) {
    this.populate([
        {path: "author", select: {username: 1, email: 1}},
        {
            path: "category",
            select: {title: 1, children: 0},
        },
        {path: "comments.author", select: {username: 1, email: 1}},
        {path: "comments.Replies.author", select: {username: 1, email: 1}},
        {path: "likes", select: {username: 1, email: 1}},
        {path: "dislikes", select: {username: 1, email: 1}},
        {path: "bookmarks", select: {username: 1, email: 1}},
    ]);
    next();
}

BlogSchema.pre("findOne", autoPopulate).pre("find", autoPopulate);

module.exports = {
    BlogModel: mongoose.model("blog", BlogSchema),
};
