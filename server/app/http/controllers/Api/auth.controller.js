const DefaultController = require("../default.controller");
const createError = require("http-errors");
const { StatusCodes, NOT_ACCEPTABLE } = require("http-status-codes");
const { UserModel } = require("../../../models/User");
const {
  emailRegisterValidator,
  emailLoginValidator,
  isEmailValid,
  loginByMobile,
  mobileNumber,
} = require("../../validators/Api/auth.validators");
const {
  generateAccessToken,
  hashPassword,
  compareHashedPassword,
  generateOTP,
  generateRefreshToken,
  generateToken,
  validateToken,
} = require("../../../utils/Security");
const { SendAccountVerification } = require("../../../utils/Senders");
module.exports = new (class AuthController extends DefaultController {
  //? Email Authentication
  async loginByEmail(req, res, next) {
    try {
      const bodyData = await emailLoginValidator.validateAsync(req.body);
      const { email, username, password, rememberme } = bodyData;
      const user =
        (await UserModel.findOne({ email })) ||
        (await UserModel.findOne({ username }));
      if (!user) {
        throw createError.NotFound("there is no user with this credentials.");
      }
      if (!compareHashedPassword(password, user.password)) {
        throw createError.NotFound("there is no user with this credentials.");
      }
      if (!user.isVerified) {
        user.verificationToken = generateToken(user.email, "1h");
        await user.save();
        await SendAccountVerification(user.email, user.verificationToken);
        throw createError.Unauthorized(
          "you have not verify your account yet,do it by the link we sent to your email."
        );
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
        throw createError.BadRequest(
          "there is already one user with this credentials,try to login into your account."
        );
      }
      await UserModel.create({
        email,
        username,
        password: hashPassword(password),
        verificationToken: generateToken(email, "1h"),
      });

      await SendAccountVerification(user.email, user.verificationToken);
      return res.status(StatusCodes.OK).json({
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
      const { verificationToken } = req.params;
      const tokenVerification = validateToken(verificationToken);
      if (tokenVerification.expiredAt < Date.now()) {
        throw createError.Unauthorized("your token is expired");
      }
      const user = await UserModel.findOne({ verificationToken });
      if (!user) {
        throw createError.NotFound("No user found.");
      }
      user.verificationToken = "";
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

  resendOTPToEmail(req, res, next) {
    try {
    } catch (error) {
      next(error);
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
      return res.json({
        message: "logged out",
      });
    } catch (e) {
      next(e);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { password, confirmPassword } = req.body;
      const { resetPasswordToken } = req.params;
      if (password !== confirmPassword) {
        throw createError.BAD_REQUEST(
          "password and confirmPassword must be same"
        );
      }
      const user = await UserModel.findOne({ resetPasswordToken });
      if (!user) {
        throw createError.Unauthorized("Invalid token");
      }
      if (compareHashedPassword(password, user.password)) {
        throw createError.BAD_REQUEST("new password cannot be same as old one");
      }
      user.password = hashPassword(password);
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
      const { mobileNumber } = bodyData;
      let otp = {
        code: generateOTP(),
        expiresIn: new Date().getTime() + 120000,
      };
      await UserModel.updateOne(
        { mobileNumber },
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
          throw createError.InternalServerErrror(err);
        });
    } catch (error) {
      next(createError.InternalServerErrror(error));
    }
  }

  async validateOTP(req, res, next) {
    try {
      const bodyData = await loginByMobile.validateAsync(req.body);
      const { mobileNumber, otp } = bodyData;
      const user = await UserModel.findOne({ mobileNumber }, { otp: 1 });
      if (!user) {
        throw createError.NotFound("there is no user  with this mobiel");
      } else if (+user.otp.expiresIn < +new Date().getTime()) {
        // TODO : sent otp to user mobile number
        throw createError.BAD_REQUEST(
          "the code is expired we have sent you a new one."
        );
      } else if (user.otp.code !== otp) {
        throw createError.BAD_REQUEST(
          "not a correct code ,make sure to use the exactly code we  have sent for you."
        );
      } else {
        user.isMobileVerified = true;
        user.accessToken = generateAccessToken(user.mobileNumber);
        user.refreshToken = generateRefreshToken(user._id);
        await user.save();
        return res
          .status(StatusCodes.OK)
          .cookie("access-token", user.accessToken)
          .cookie("refresh-token", user.refreshToken, { httpOnly: true })
          .json({
            success: true,
            message: "you've been logged in successfully.",
          });
      }
    } catch (e) {
      next(e);
    }
  }
})();
