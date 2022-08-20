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
    },
    {
        id: false,
        toJSON: {
            virtuals: true,
        },
    }
);
CategorySchema.virtual("children", {
    ref: "category",
    localField: "_id",
    foreignField: "parent",
    justOne: false,
    projection: {_id: 1, title: 1},
});

function autoPopulate(next) {
    this.populate([{path: "children", select: {__v: 0, id: 0}}]);
    next();
}

CategorySchema.pre("findOne", autoPopulate).pre("find", autoPopulate);
module.exports = {
    CategoryModel: mongoose.model("category", CategorySchema),
};
