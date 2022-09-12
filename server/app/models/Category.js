const {default: mongoose} = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        parent: {
            type: mongoose.Types.ObjectId,
            ref: "category",
            default: undefined,
            required: false
        },
        image: {type: String, required: false},
    },
    {
        id: true,
        toJSON: {
            virtuals: true,
        },
    }
);
CategorySchema.index({title: "text"});
CategorySchema.virtual("children", {
    ref: "category",
    localField: "_id",
    foreignField: "parent",
    justOne: false,
    projection: {_id: 1, title: 1},
});
CategorySchema.virtual("imageURL").get(function () {
    return this.image
        ? `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.image}`
        : undefined;
});

function autoPopulate(next) {
    this.populate([{path: "children", select: {__v: 0, id: 0}}]);
    next();
}

CategorySchema.pre("findOne", autoPopulate).pre("find", autoPopulate);
module.exports = {
    CategoryModel: mongoose.model("category", CategorySchema),
};
