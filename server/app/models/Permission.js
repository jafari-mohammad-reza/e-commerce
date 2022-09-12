const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
    {
        title: {type: String, unique: true, required: true},
        description: {type: String, unique: false, required: false},
    },
    {

        toJSON: {virtuals: true},
    }
);

module.exports = {
    PermissionsModel: mongoose.model("permission", PermissionSchema),
};
