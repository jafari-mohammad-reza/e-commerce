const {default: mongoose} = require("mongoose");
const {OrderSchema, CartSchema, DiscountSchema} = require("./public.schemas");
const {RoleSchema} = require("./Role");

const UserSchema = new mongoose.Schema(
    {
        firstName: {type: String, default: "", required: false},
        lastName: {type: String, default: "", required: false},
        username: {type: String, uniq: true, required: false, default: ""},
        mobileNumber: {type: String, required: false, default: "", uniq: true},
        email: {type: String, lowercase: true, uniq: true, required: false, default: ""},
        password: {type: String, required: true},
        otp: {
            type: Object,
            default: {},
        },
        orders: {type: [mongoose.Types.objectId], ref: "order", default: []},
        bookMarks: {type: [mongoose.Types.ObjectId], default: []},
        birthday: {type: Date, required: false},
        Role: {type: String, default: "USER"},
        isVerified: {type: Boolean, default: false},
        isPrime: {type: Boolean, default: false},
        address: {type: String, required: false},
        isBanned: {type: Boolean, default: false},
        accessToken: {type: String, default: ""},
        resetPasswordAttempt: {type: Number, default: 0},
        verificationToken: {type: String, default: ""},
        verificationCode: {type: String, default: ""},
        resetPasswordToken: {type: String, default: ""},
        lastResetPassword: {type: Date, required: false},
        refreshToken: {type: String, default: ""},
        cart: {type: CartSchema, default: {"products": []}},
        walletCredit: {type: Number, default: 0},
        discounts: {type: [DiscountSchema], default: [], required: false}
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);
UserSchema.index({

    username: "text",
    mobileNumber: "text",
    email: "text",
});
module.exports = {
    UserModel: mongoose.model("user", UserSchema),
};
