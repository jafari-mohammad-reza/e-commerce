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
    isVerified: { type: Boolean, default: false },
    isPrime: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    accessToken: { type: String, required: true, default: "" },
    resetpasswordAttempt: { type: Number, default: 0 },
    verificationToken: { type: String, required: true, default: "" },
    resetPassworToken: { type: String, required: false, default: "" },
    refreshToken: { type: String, default: "" },
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
