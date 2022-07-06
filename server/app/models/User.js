const { default: mongoose } = require("mongoose");
const { OrderSchema, CartSchema } = require("./public.schemas");
const { RoleSchema } = require("./Role");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, uniq: true },
    mobileNumber: { type: String },
    email: { type: String, lowercase: true, uniq: true },
    password: { type: String },
    otp: {
      type: Object,
      default: {},
    },
    orders: { type: [OrderSchema], default: [] },
    cart: { type: [CartSchema], default: [] },
    wishList: { type: [CartSchema], default: [] },
    bookMarks: { type: [mongoose.Types.ObjectId], default: [] },
    discount: { type: Number, default: 0 },
    birthday: { type: Date },
    Role: { type: String, default: "USER" },
    isVerified: { type: Boolean, default: false },
    isPrime: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    accessToken: { type: String, default: "" },
    resetPasswordAttempt: { type: Number, default: 0 },
    verificationToken: { type: String, default: "" },
    verificationCode: { type: String, default: "" },
    resetPasswordToken: { type: String, default: "" },
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
  firstName: "text",
  lastMame: "text",
  username: "text",
  mobileNumber: "text",
  email: "text",
});
module.exports = {
  UserModel: mongoose.model("user", UserSchema),
};
