const authController = require("../../http/controllers/Api/auth.controller");

const router = require("express").Router();
//? Email Authentication Routes

router.post("/email/login", authController.loginByEmail);
router.post("/email/register", authController.registerByEmail);
router.post(
  "/email/active-account/:token",
  authController.activeAccountByEmail
);
router.post("/email/resend/:token", authController.resendOTPToEmail);
router.post("/email/get-reset-passwprd" , authController.getResetPasswordLink)
router.post("/email/reset-passwprd/:resetPasswordToken" , authController.resetPassword)
//! Mobile Authentication Routes
//* router.post("/mobile/login");
//* router.post("/mobile/register");
//* router.post("/mobile/validate/:token");
//* router.post("/mobile/resend/:token");
module.exports = {
  AuthRouter: router,
};
