const { ref } = require("@hapi/joi/lib/compile");
const { default: mongoose } = require("mongoose");
const { OrderSchema, CartSchema } = require("./public.schemas");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, lowercase: true, uniq: true },
    mobileNumber: { type: String, required: true, uniq: true },
    email: { type: String, lowercase: true, uniq: true },
    password: { type: String },
    otp: {
      type: Object,
      default: {
        code: 0,
        expiresIn: 0,
      },
    },
    orders: { type: [OrderSchema], default: [] },
    cart: { type: [CartSchema], default: [] },
    wishList: { type: [CartSchema], default: [] },
    bookMarks: { type: [mongoose.Types.ObjectId], default: [] },
    discount: { type: Number, default: 0 },
    birthday: { type: Date },
    Role: { type: [String], default: "USER" },
    isPrime: { type: boolean, default: false },
    isBanned: { type: boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
UserSchema.index({
  first_name: "text",
  last_name: "text",
  username: "text",
  mobile: "text",
  email: "text",
});
module.exports = {
  UserModel: mongoose.model("user", UserSchema),
};
