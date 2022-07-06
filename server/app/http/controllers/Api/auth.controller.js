const DefaultController = require("../default.controller");
const createHttpError = require("http-errors");
const { StatusCodes, NOT_ACCEPTABLE } = require("http-status-codes");
const { UserModel } = require("../../../models/User");
const {
  emailRegisterValidator,
  emailLoginValidator,
  isEmailValid,
  loginByMobile,
  mobileNumber,
  validatePassword,
} = require("../../validators/Api/auth.validators");
const {
  generateAccessToken,
  hashPassword,
  compareHashedPassword,
  generateOTP,
  generateRefreshToken,
  generateToken,
  validateToken,
  generateOneTimeToken,
  generateOneCode,
} = require("../../../utils/Security");
const {
  SendAccountVerification,
  SendResetPasswordEmail,
} = require("../../../utils/Senders");
const { copyObject } = require("../../../utils/functions");
module.exports = new (class AuthController extends DefaultController {
  //? Email Authentication
  async loginByEmail(req, res, next) {
    try {
      const bodyData = await emailLoginValidator.validateAsync(req.body);
      const { email, password, rememberme } = bodyData;
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw createHttpError.NotFound(
          "there is no user with this credentials."
        );
      }
      if (!compareHashedPassword(password, user.password)) {
        throw createHttpError.NotFound(
          "there is no user with this credentials."
        );
      }
      if (!user.isVerified) {
        user.verificationToken = generateToken(user.email, "1h");
        await user.save();
        // await SendAccountVerification(user.email, user.verificationToken);
        throw createHttpError(
          401,
          "you have not verify your account yet,do it by the link we sent to your email."
        );
      }
      user.accessToken = generateAccessToken({ email: user.email });
      user.refreshToken = await generateRefreshToken({ userId: user._id });
      await user.save();
      return res
        .status(StatusCodes.OK)
        .cookie("access_token", user.accessToken, {
          expires: rememberme
            ? new Date(Date.now() + 2592000)
            : new Date(Date.now() + 86400),
        })
        .cookie("refresh_token", user.refreshToken, { httpOnly: true })
        .json({
          success: true,
          message: "logged in successfully.",
        });
    } catch (error) {
      next(error);
    }
  }

  async registerByEmail(req, res, next) {
    try {
      await emailRegisterValidator.validateAsync(req.body);
      const { email, username, password } = req.body;
      if (
        (await UserModel.findOne({ email })) ||
        (await UserModel.findOne({ username }))
      ) {
        throw createHttpError.BadRequest("User already exist.");
      }
      const user = await UserModel.create({
        email,
        username,
        password: hashPassword(password),
        verificationToken: generateToken({ email: email }),
        verificationCode: generateOneCode(10),
      });
      await SendAccountVerification(user.email, user.verificationCode);
      return res
        .status(StatusCodes.CREATED)
        .cookie("verificationToken", user.verificationToken)
        .json({
          success: true,
          message:
            "you've been registered successfully, make sure to verify your account by the link send to your email.",
        });
    } catch (error) {
      next(error);
    }
  }

  async verifyAccountByEmail(req, res, next) {
    try {
      const { code } = copyObject(req.body);
      if (!code || code.length < 7) {
        throw createHttpError.BadRequest("Pleas enter a valid code");
      }

      const user = await UserModel.findOne({ verificationCode: code });
      if (!user) {
        throw createHttpError.NotFound("No user found.");
      }

      user.verificationToken = "";
      user.verificationCode = "";
      user.isVerified = true;
      await user.save();
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "user has been verified successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async resendOTPToEmail(req, res, next) {
    try {
      const user = req?.user;
      console.log(user);
      user.verificationCode = generateOneCode(10);
      await user.save();
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "new code have sent to your email.",
      });
    } catch (error) {
      next(error);
    }
  }

  async getResetPasswordLink(req, res, next) {
    try {
      const requestBody = await isEmailValid.validateAsync(req.body);
      const { email } = requestBody;
      if (!email) {
        throw createHttpError.BadRequest("make sure to insert a valid email");
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw createHttpError.BadRequest("make sure to insert a valid email");
      }
      if (user.resetPasswordAttempt > 3) {
        throw createHttpError.NotAcceptable(
          `you have reached the maximum chance to changePassword, contact our support for more info`
        );
      }
      user.resetPasswordToken = generateToken(user.email, "1h");
      user.resetPasswordAttempt++;
      await user.save();
      await SendResetPasswordEmail(user.email, user.resetPasswordToken);
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "we sent you a email contains a link to reset your password",
      });
    } catch (error) {
      next(error);
    }
  }

  async logOut(req, res, next) {
    try {
      const { accessToken } = req.params;
      const verifiedAccessToken = validateToken(accessToken);
      if (!verifiedAccessToken)
        throw createHttpError.BadRequest("Not a valid token");
      if (verifiedAccessToken.exp > Date.now())
        throw createHttpError.BadRequest("Not a valid token");
      const user = await UserModel.findOne({ accessToken });
      if (!user) throw createHttpError.Unauthorized("Not a valid token");
      user.accessToken = "";
      user.refreshToken = "";
      await user.save();
      return res.json({
        success: true,
        message: "logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const bodyData = await validatePassword.validateAsync(req.body);
      const { password, confirmPassword } = bodyData;
      const { resetPasswordToken } = req.params;
      const user = await UserModel.findOne({ resetPasswordToken });
      if (!user) {
        throw createHttpError.Unauthorized("Invalid token");
      }
      if (user.resetPasswordAttempt > 3)
        throw createHttpError.NotAcceptable(
          "You have reached the maximum reset password attempt."
        );
      if (compareHashedPassword(password, user.password)) {
        throw createHttpError.BadRequest(
          "new password cannot be same as old one"
        );
      }
      user.password = hashPassword(password);
      // log of user after changing his/her password
      user.accessToken = "";
      user.refreshToken = "";
      user.resetPasswordToken = "";
      await user.save();
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "password has been changed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  //! Mobile Authentication
  async getOTP(req, res, next) {
    try {
      const bodyData = await mobileNumber.validateAsync(req.body);
      const { mobile } = bodyData;
      let otp = generateOTP();
      await UserModel.updateOne(
        { mobileNumber: mobile },
        { $set: { otp } },
        { upsert: true }
      )
        .then((result) => {
          return res.status(StatusCodes.OK).json({
            success: true,
            message:
              "we have sent you a message to your mobileNumber,use it to verify yourself.",
          });
        })
        .catch((err) => {
          throw createError.InternalServerError(err);
        });
    } catch (error) {
      next(error);
    }
  }

  async validateOTP(req, res, next) {
    try {
      const bodyData = await loginByMobile.validateAsync(req.body);
      const { mobile, otp } = bodyData;
      const user = await UserModel.findOne(
        { mobileNumber: mobile },
        { otp: 1, mobileNumber: 1 }
      );
      if (!user) {
        throw createHttpError.NotFound(
          "there is no user  with this mobile number"
        );
      }
      if (+user.otp.expiresIn < +new Date().getTime()) {
        // TODO : sent otp to user mobile number
        user.otp = generateOTP();
        await user.save();
        throw createHttpError.BadRequest(
          "the code is expired we have sent you a new one."
        );
      }
      if (user.otp.code !== +otp) {
        throw createHttpError.BadRequest(
          "not a correct code ,make sure to use the exactly code we  have sent for you."
        );
      }
      user.otp = {};
      user.isMobileVerified = true;
      user.isVerified = true;
      user.accessToken = generateAccessToken({
        mobileNumber: user?.mobileNumber,
      });
      user.refreshToken = await generateRefreshToken({ userId: user._id });
      await user.save();
      return res
        .status(StatusCodes.OK)
        .cookie("access_token", user.accessToken)
        .cookie("refresh_token", user.refreshToken, { httpOnly: true })
        .json({
          success: true,
          message: "you've been logged in successfully.",
        });
    } catch (e) {
      next(e);
    }
  }
})();
