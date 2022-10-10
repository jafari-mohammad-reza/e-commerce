const DefaultController = require('../default.controller');
const createHttpError = require('http-errors');
const {StatusCodes} = require('http-status-codes');
const {UserModel} = require('../../../models/User');
const {
  emailRegisterValidator,
  emailLoginValidator,
  isEmailValid,
  loginByMobile,
  validatePassword, mobileValidator,
} = require('../../validators/Api/auth.validators');
const {
  generateAccessToken,
  hashPassword,
  compareHashedPassword,
  generateOTP,
  generateRefreshToken,
  generateToken,
  generateOneCode,
} = require('../../../utils/Security');
const {
  SendAccountVerification,
  SendSms, SendEmail,
} = require('../../../utils/Senders');
const {copyObject} = require('../../../utils/functions');
module.exports = new (class AuthController extends DefaultController {
  /**
   * Login into user account with email
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async loginByEmail(req, res, next) {
    try {
      const bodyData = await emailLoginValidator.validateAsync(req.body);
      const {email, password, rememberme} = bodyData;
      const user = await UserModel.findOne({email}, {
        _id: 1,
        email: 1,
        username: 1,
        password: 1,
        accessToken: 1,
        isVerified: 1,
        Role: 1,
        isBanned: 1,
      });
      if (!user) {
        throw createHttpError.NotFound(
            'there is no user with this credentials.',
        );
      }
      if (!compareHashedPassword(password, user.password)) {
        throw createHttpError.NotFound(
            'there is no user with this credentials.',
        );
      }
      if (!user.isVerified) {
        user.verificationCode = generateOneCode(10);
        await user.save();
        SendAccountVerification(user.email, user.verificationCode);
        throw createHttpError(
            400,
            'you have not verify your account yet,do it by the link we sent to your email.',
        );
      }
      if (user.isBanned === true) {
        throw createHttpError(
            403,
            'you have been banned from the system, please contact our support for more info.',
        );
      }
      user.accessToken = generateAccessToken({email: user.email});
      user.refreshToken = await generateRefreshToken(user._id);
      await user.save();
      return res
          .status(StatusCodes.OK)
          .cookie('access_token', user.accessToken, {
            httpOnly: true,
            expires: rememberme ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) : new Date(Date.now() + 1000 * 60 * 60 * 24),
          })
          .cookie('refresh_token', user.refreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 356),
          })
          .json({
            success: true,
            credentials: {
              email: user.email,
              username: user.username,
              mobileNumber: user.mobileNumber,
              Role: user.Role,
            },
          });
    } catch (error) {
      next(error);
    }
  }

  /**
   * register new account with email
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async registerByEmail(req, res, next) {
    try {
      await emailRegisterValidator.validateAsync(req.body);
      const {email, username, password} = req.body;
      if (
        (await UserModel.findOne({email})) ||
          (await UserModel.findOne({username}))
      ) {
        // not allowed
        throw createHttpError(405, 'User already exist.');
      }
      const user = await UserModel.create({
        email,
        username,
        password: hashPassword(password),
        verificationToken: generateToken({email: email}),
        verificationCode: generateOneCode(10),
      });
      SendAccountVerification(user.email, user.verificationCode);
      return res
          .status(StatusCodes.CREATED)
          .cookie('verificationToken', user.verificationToken)
          .json({
            success: true,
            message:
                'you\'ve been registered successfully, make sure to verify your account by the link send to your email.',
          });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  /**
   * verify account with email that been sent to user email
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async verifyAccountByEmail(req, res, next) {
    try {
      const {code} = copyObject(req.body);
      if (!code || code.length < 7) {
        throw createHttpError.BadRequest('Pleas enter a valid code');
      }

      const user = await UserModel.findOne({verificationCode: code});
      if (!user) {
        throw createHttpError.NotFound('No user found.');
      }

      user.verificationToken = '';
      user.verificationCode = '';
      user.isVerified = true;
      await user.save();
      return res.status(StatusCodes.OK).clearCookie('verificationToken').json({
        success: true,
        message: 'user has been verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * resent verification code to user email by using verificationToken
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async resendOTPToEmail(req, res, next) {
    try {
      const user = req?.user;
      user.verificationCode = generateOneCode(10);
      SendAccountVerification(user.email, user.verificationCode);
      await user.save();
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'new code have sent to your email.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * send reset password link to user email
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async getResetPasswordLink(req, res, next) {
    try {
      const currentDate = new Date();
      const requestBody = await isEmailValid.validateAsync(req.body);
      const {email} = requestBody;
      if (!email) {
        throw createHttpError.BadRequest('make sure to insert a valid email');
      }
      const user = await UserModel.findOne({email});
      if (!user) {
        throw createHttpError.NotFound('make sure to insert a valid email');
      } else if (user.resetPasswordAttempt >= 3) {
        throw createHttpError.NotAcceptable(
            `you have reached the maximum chance to changePassword, contact our support for more info`,
        );
      } else if (user.lastResetPassword < currentDate.setDate(currentDate.getDate() - 30)) {
        throw createHttpError.NotAcceptable(
            `you cannot change your password between 30 days`,
        );
      }
      user.resetPasswordToken = generateToken(user.email, '1h');
      user.resetPasswordAttempt++;
      await user.save();
      await SendEmail(user.email, `Reset your password`, `
        <a href="http://localhost:3000/auth/reset_password/${user.resetPasswordToken}">
        Click to reset your password
</a>
      `);
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'we sent you a email contains a link to reset your password',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * remove accessToken and refreshToken from user browser cookies and remove user tokens from database
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async logOut(req, res, next) {
    try {
      const user = req?.user;
      user.accessToken = '';
      user.refreshToken = '';
      await user.save();
      return res
          .status(StatusCodes.OK)
          .clearCookie('access_token')
          .clearCookie('refresh_token')
          .json({
            success: true,
            message: 'logged out successfully',
          });
    } catch (error) {
      next(error);
    }
  }

  /**
   * reset user password by the link that been sent to user email and new password that should be different from old one
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async resetPassword(req, res, next) {
    try {
      const bodyData = await validatePassword.validateAsync(req.body);
      const {password, confirmPassword} = bodyData;
      const {resetPasswordToken} = req.params;
      if (password !== confirmPassword) {
        throw createHttpError.BadRequest(
            'both passwords must be same',
        );
      }
      const user = await UserModel.findOne({resetPasswordToken});
      if (!user) {
        throw createHttpError.Unauthorized('Invalid token');
      }
      if (user.resetPasswordAttempt > 3) {
        throw createHttpError.NotAcceptable(
            'You have reached the maximum reset password attempt.',
        );
      }
      if (compareHashedPassword(password, user.password)) {
        throw createHttpError.BadRequest(
            'new password cannot be same as old one',
        );
      }
      user.password = hashPassword(password);
      user.accessToken = '';
      user.refreshToken = '';
      user.resetPasswordToken = '';
      user.lastResetPassword = new Date();
      await user.save();
      return res
          .clearCookie('access_token')
          .clearCookie('refresh_token')
          .status(StatusCodes.OK).json({
            success: true,
            message: 'password has been changed successfully',
          });
    } catch (error) {
      next(error);
    }
  }

  /**
   * send one time password to user mobile number
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async getOTP(req, res, next) {
    try {
      const mobile = await mobileValidator.validateAsync(req.body.mobile);
      const otp = generateOTP();
      await UserModel.updateOne(
          {mobileNumber: mobile},
          {$set: {otp}},
          {upsert: true},
      )
          .then(() => {
            SendSms(`+${mobile}`, `Your verification code ${otp.code}, this code will expire in next 2 minutes`);
            return res.status(StatusCodes.OK).json({
              success: true,
              message:
                  'we have sent you a message to your mobileNumber,use it to verify yourself.',
            });
          })
          .catch((err) => {
            throw createHttpError.InternalServerError(err);
          });
    } catch (error) {
      next(error);
    }
  }

  /**
   * validate one time password that been sent to user mobile number
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async validateOTP(req, res, next) {
    try {
      const {mobile, otp} = await loginByMobile.validateAsync(req.body);
      const user = await UserModel.findOne(
          {mobileNumber: mobile},
          {otp: 1, mobileNumber: 1, Role: 1},
      );
      if (!user) {
        throw createHttpError.NotFound(
            'there is no user  with this mobile number',
        );
      }
      if (+user.otp.expiresIn < +new Date().getTime()) {
        // TODO : sent otp to user mobile number
        user.otp = generateOTP();
        await user.save();
        throw createHttpError.BadRequest(
            'the code is expired we have sent you a new one.',
        );
      }
      if (user.otp.code !== +otp) {
        throw createHttpError.NotFound(
            'Not a correct code ,make sure to use the exactly code we  have sent for you.',
        );
      }
      user.otp = {};
      user.isVerified = true;
      user.accessToken = generateAccessToken({
        mobileNumber: user?.mobileNumber,
      });
      user.refreshToken = await generateRefreshToken(user._id);
      await user.save();
      return res
          .status(StatusCodes.OK)
          .cookie('access_token', user.accessToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          })
          .cookie('refresh_token', user.refreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 356),
          })
          .json({
            success: true,
            credentials: {mobile: user.mobileNumber, Role: user.Role},
          });
    } catch (e) {
      next(e);
    }
  }

  /**
   * set a accessToken cookie for user by verifying refreshToken
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async getAccessToken(req, res, next) {
    try {
      const user = req.user;
      return res.status(StatusCodes.OK).cookie('access_token', user);
    } catch (error) {
      next(error);
    }
  }
})();
