const DefaultController = require("../default.contoller");
const createError = require("http-errors");
const { StatusCodes, NOT_ACCEPTABLE } = require("http-status-codes");
const { UserModel } = require("../../../models/User");
const {
  emailRegisterValidator,
  emailLoginValidator,
  isEmailValid,
} = require("../../validators/Api/auth.validators");
const {
  generateAccessToken,
  hashPassword,
  compareHashedPassword,
} = require("../../../utils/Security");
module.exports = new (class AuthController extends DefaultController {
  //? Email Authentication
  async loginByEmail(req, res, next) {
    try {
      const bodyData = await emailLoginValidator.validateAsync(req.body);
      const { email, username, password, rememberme } = bodyData;
      const user =
        (await UserModel.findOne({ email })) ||
        (await UserModel.findOne({ username: username }));
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "there is no user with this credentials.",
        });
      }
      if (!compareHashedPassword(password, user.password)) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "there is no user with this credentials.",
        });
      }
      if (!user.isVerified) {
        user.verificationToken = generateToken(user.email, "1h");
        //Todo : send verification email
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message:
            "you have not verify your account yet,do it by the link we sent to your email.",
        });
      }
      user.accessToken = generateAccessToken(user.email);
      user.refreshToken = generateAccessToken(user._id);
      await user.save();
      return res
        .status(StatusCodes.OK)
        .cookie("access-token", user.accessToken, {
          expires: rememberme
            ? new Date(Date.now() + 2592000)
            : new Date(Date.now() + 86400),
        })
        .cookie("refresh-token", user.refreshToken, { httpOnly: true })
        .json({
          success: true,
          message: "logged in successfully.",
        });
    } catch (error) {
      next(createError.InternalServerError(error));
    }
  }
  async registerByEmail(req, res, next) {
    try {
      const bodyData = await emailRegisterValidator.validateAsync(req.body);
      const { email, userName: username, password } = bodyData;
      if (
        (await UserModel.findOne({ email })) ||
        (await UserModel.findOne({ username: username }))
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message:
            "there is already one user with this credentials,try to login into your account.",
        });
      }
      const user = await UserModel.create(
        {
          email,
          username,
          password: hashPassword(password),
          verificationToken: generateToken(user.email, "1h"),
        },
        { validateBeforeSave: true }
      );

      // Todo : send verification token
      return res.status(StatusCodes.OK).json({
        success: true,
        message:
          "you'v been registered successfully, make sure to verify your account by the link send to your email.",
      });
    } catch (error) {
      next(createError.InternalServerError(error));
    }
  }
  async activeAccountByEmail(req, res, next) {
    try {
      const { verificationToken } = req.params;
      const user = await UserModel.findOne({ verificationToken });
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "there is no user with this token",
        });
      }
      user.verificationToken = "";
      user.isVerified = true;
      await user.save();
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "user has been verified successfully",
      });
    } catch (error) {
      next(createError.InternalServerError(error));
    }
  }
  resendOTPToEmail(req, res, next) {
    try {
    } catch (error) {
      next(createError.InternalServerError(error));
    }
  }
  async getResetPasswordLink(req, res, next) {
    try {
      const { email } = req.body;
      if (!email || !isEmailValid(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "make sure to insert a valid email",
        });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "make sure to insert a valid email",
        });
      }
      if (user.resetPasswordAttempt > 3) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          success: false,
          message: `you have reached the maximum chance to changePassword, contact our support for more info`,
        });
      }
      user.resetPasswordToken = generateToken(user.email, "1h");
      user.resetPasswordAttempt++;
      await user.save();
      // TODO : send reset password link
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "we sent you a email contains a link to reset your password",
      });
    } catch (error) {
      next(createError.InternalServerError(error));
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { password, confirmPassword } = req.body;
      const { resetPasswordToken } = req.params;
      if (password !== confirmPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "password and confirmPassword must be same",
        });
      }
      const user = await UserModel.findOne({ resetPasswordToken });
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "unvalid reset password token",
        });
      }
      if (compareHashedPassword(password, user.password)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "new password cannot be same as old one",
        });
      }
      user.password = hashPassword(password);
      user.resetPasswordToken = "";
      await user.save();
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "password has been changed successfully",
      });
    } catch (error) {
      next(errors);
    }
  }
  //! Mobile Authentication
  loginByMobile(req, res, next) {
    try {
    } catch (error) {
      next(createError.InternalServerError(error));
    }
  }
  registerByMobile(req, res, next) {
    try {
    } catch (error) {
      next(createError.InternalServerError(error));
    }
  }
  sendOTPToMobile(req, res, next) {
    try {
    } catch (error) {
      next(createError.InternalServerError(error));
    }
  }
})();
