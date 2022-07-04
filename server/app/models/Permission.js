const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
    {
        title: {type: String, unique: true},
    },
    {
        versionKey: false,
        id: false,
        toJSON: {virtuals: true},
    }
);

module.exports = {
    PermissionsModel: mongoose.model("permission", PermissionSchema),
};
