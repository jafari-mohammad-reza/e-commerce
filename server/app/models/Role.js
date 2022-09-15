const {default: mongoose} = require('mongoose');

const RoleSchema = new mongoose.Schema(
    {
      title: {type: String, unique: true, required: true},
      permissions: {
        type: [mongoose.Types.ObjectId],
        ref: 'permission',
        required: true,
      },
    },
    {

      toJSON: {virtuals: true},
    },
);


module.exports = {
  RoleSchema,
  RoleModel: mongoose.model('role', RoleSchema),
};
