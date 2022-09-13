const {ResponseType} = require("../typeDefs/Public.type");
const {GraphQLString, GraphQLNonNull} = require("graphql/type");
const {GraphqlTokenAuth} = require("../../http/middleWares/TokenAuthorization");
const createHttpError = require("http-errors")
const {StatusCodes} = require("http-status-codes");
const {UserModel} = require("../../models/User");
const {SendAccountVerification, SendSms} = require("../../utils/Senders");
const {generateOneCode, generateOTP} = require("../../utils/Security");
const UpdateProfile = {
    type: ResponseType,
    args: {
        email: {type: GraphQLString},
        username: {type: GraphQLString},
        mobileNumber: {type: GraphQLString},
        birthday: {type: GraphQLString},
        address: {type: GraphQLString},
    },
    resolve: async (_, args, context) => {
        const {email, username, mobileNumber, birthday, address} = args
        const user = await GraphqlTokenAuth(context.headers)
        const existUser = await UserModel.findOne({$or: [{email}, {username}, {mobileNumber}]})
        if (existUser._id.toString() !== user._id.toString()) {
            throw createHttpError.BadRequest("you cannot user this credentials")
        }
        user.username = username || user.username
        user.address = address || user.address
        user.birthday = birthday || user.birthday
        if (email !== user.email) {
            user.isVerified = false
            user.email = email
            SendAccountVerification(email, generateOneCode(10))
        } else if (mobileNumber !== user.mobileNumber) {
            user.isVerified = false
            user.otp = generateOTP()
            SendSms(mobileNumber, `Please verify your account by this code ${user.otp}`)
        }
        await user.save()
        return {
            statusCode: StatusCodes.OK,
            data: {
                message: "Your account information has been updated successfully"
            }
        }
    }
}


module.exports = {
    UpdateProfile
}
