const {ResponseType} = require('../typeDefs/Public.type');
const {GraphQLString} = require('graphql/type');
const {GraphqlTokenAuth} = require('../../http/middleWares/TokenAuthorization');
const createHttpError = require('http-errors');
const {StatusCodes} = require('http-status-codes');
const {UserModel} = require('../../models/User');
const {SendAccountVerification, SendSms} = require('../../utils/Senders');
const {generateOneCode, generateOTP, generateToken} = require('../../utils/Security');
const UpdateProfile = {
  type: ResponseType,
  args: {
    email: {type: GraphQLString},
    username: {type: GraphQLString},
    mobileNumber: {type: GraphQLString},
    birthdate: {type: GraphQLString},
    address: {type: GraphQLString},
  },
  resolve: async (_, args, context) => {
    const {email, username, mobileNumber, birthdate, address} = args;
    const user = await GraphqlTokenAuth(context.req.headers);
    const existUser = await UserModel.findOne({$or: [{email: email ? email : null}, {username: username ? username : null}, {mobileNumber: mobileNumber ? mobileNumber : null}]});
    if (existUser) {
      if (existUser._id.toString() !== user._id.toString()) {
        throw createHttpError.BadRequest('you cannot user this credentials');
      }
    }
    user.username = username || user.username;
    user.address = address || user.address;
    user.birthdate = user.birthdate ? user.birthdate : birthdate;
    if (email !== user.email) {
      user.isVerified = false;
      user.verificationCode = generateOneCode(10);
      user.verificationToken = generateToken(email, '30 minutes');
      user.accessToken = undefined;
      user.refreshToken = undefined;
      user.email = email;
      if (mobileNumber) {
        user.mobileNumber = mobileNumber;
      }
      SendAccountVerification(email, user.verificationCode);
      context.res.cookie('verificationToken', user.verificationToken);
    } else if (mobileNumber !== user.mobileNumber) {
      user.isVerified = false;
      const otp = generateOTP();
      user.otp = otp;
      SendSms(mobileNumber, `Please verify your account by this code ${otp}`);
    }
    context.res
        .clearCookie('access_token')
        .clearCookie('refresh_token');
    await user.save();
    return {
      statusCode: StatusCodes.OK,
      data: {
        message: 'Your account information has been updated successfully',
      },
    };
  },
};


module.exports = {
  UpdateProfile,
};
