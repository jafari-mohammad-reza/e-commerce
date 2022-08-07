const authController = require("../../http/controllers/Api/auth.controller");
const limit = require("express-rate-limit");
const {StatusCodes} = require("http-status-codes");
const authLimiter = limit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 2,
    message: {
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
        message: "You can only register or login 2 times between 5 minutes",
    }
})

const otpLimiter = limit({
    windowMs: 60 * 1000, // 1 minute,
    max: 2,
    message: {
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
        message: "You can only send otp 2 times between 1 minute",
    }
})

const {
    VerifyAccessToken,
    VerifyVerificationToken, VerifyRefreshToken,
} = require("../../http/middleWares/TokenAuthorization");

const router = require("express").Router();


router.get("/get-access-token", VerifyRefreshToken, authController.getAccessToken);
//? Email Authentication Routes=
router.post("/email/login", authLimiter, authController.loginByEmail);
router.post("/email/register", authLimiter, authController.registerByEmail);
router.post("/email/verify-account/", authController.verifyAccountByEmail);
router.post(
    "/email/resend-code/",
    VerifyVerificationToken,
    authController.resendOTPToEmail
);
router.post("/email/forgot-password", authController.getResetPasswordLink);
router.post(
    "/email/reset-password/:resetPasswordToken",
    authController.resetPassword
);
router.post("/email/logout/:accessToken", authController.logOut);

//? Mobile Authentication
router.post("/mobile/get-otp", otpLimiter, authController.getOTP);
router.post("/mobile/validate-otp", authController.validateOTP);

module.exports = {
    AuthRouter: router,
};
