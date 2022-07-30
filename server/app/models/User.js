const {default: mongoose} = require("mongoose");
const {OrderSchema, CartSchema} = require("./public.schemas");
const {RoleSchema} = require("./Role");

const UserSchema = new mongoose.Schema(
    {
        firstName: {type: String, default: "", required: false},
        lastName: {type: String, default: "", required: false},
        username: {type: String, uniq: true},
        mobileNumber: {type: String},
        email: {type: String, lowercase: true, uniq: true},
        password: {type: String},
        otp: {
            type: Object,
            default: {},
        },
        orders: {type: [OrderSchema], default: []},
        bookMarks: {type: [mongoose.Types.ObjectId], default: []},
        discount: {type: Number, default: 0},
        birthday: {type: Date},
        Role: {type: String, default: "USER"},
        isVerified: {type: Boolean, default: false},
        isPrime: {type: Boolean, default: false},
        isBanned: {type: Boolean, default: false},
        accessToken: {type: String, default: ""},
        resetPasswordAttempt: {type: Number, default: 0},
        verificationToken: {type: String, default: ""},
        verificationCode: {type: String, default: ""},
        resetPasswordToken: {type: String, default: ""},
        lastResetPassword: {type: Date, required: false},
        refreshToken: {type: String, default: ""},
        cart: {type: CartSchema},
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
