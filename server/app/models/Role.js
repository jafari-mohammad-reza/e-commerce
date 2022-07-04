const {default: mongoose} = require("mongoose");

const RoleSchema = new mongoose.Schema(
    {
        title: {type: String, unique: true},
        permissions: {
            type: [mongoose.Types.ObjectId],
            ref: "permission",
            default: [],
        },
    },
    {
        versionKey: false,
        id: false,
        toJSON: {virtuals: true},
    }
);

module.exports = {
    RoleSchema,
    RoleModel: mongoose.model("role", RoleSchema),
};
