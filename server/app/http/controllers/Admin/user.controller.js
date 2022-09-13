const DefaultController = require("../default.controller")
const createHttpError = require("http-errors")
const {UserModel} = require("../../../models/User");
const {StatusCodes} = require("http-status-codes");
const {isValidObjectId} = require("mongoose");
const {deleteInvalidPropertyInObject, copyObject} = require("../../../utils/functions");
const {hashPassword} = require("../../../utils/Security");
const passwordGenerator = require("generate-password")
const {SendEmail, SendSms} = require("../../../utils/Senders");
module.exports = new (class UserController extends DefaultController {
    async getAll(req, res, next) {
        try {
            const search = req?.query?.search;
            const dataBaseQuery = {}
            if (search) {
                dataBaseQuery['$text'] = {$search: search.toString()}
            }

            const users = await UserModel.find({$and: [{dataBaseQuery}, {_id: {$ne: req.user._id}}]}, {
                username: 1,
                email: 1,
                mobileNumber: 1,
                accessToken: 1,
                Role: 1,
                isBanned: true

            })
            return res.status(StatusCodes.OK).json({
                success: true,
                users
            })
        } catch (e) {
            next(e)
        }
    }

    async getUser(req, res, next) {
        try {
            const {id} = req.params
            if (!isValidObjectId(id)) {
                throw createHttpError.BadRequest('not a valid id')
            }
            const user = await UserModel.findOne({_id: id}, {
                firstName: 1,
                lastName: 1,
                username: 1,
                mobileNumber: 1,
                email: 1,
                birthday: 1,
                Role: 1,
                isPrime: 1,
                isBanned: 1,
                orders: 1
            }).catch(err => {
                throw createHttpError.internalServerError(err)
            })
            return res.status(StatusCodes.OK).json({
                success: true,
                user: user
            })
        } catch (error) {
            next(error)
        }
    }

    async updateProfile(req, res, next) {
        try {
            const {id} = req.params
            const currentUser = req.user
            const existUser = await UserModel.findOne({_id: id}, {Role: 1, accessToken: 1, refreshToken: 1, _id: 1})
            if (existUser._id.equals(currentUser._id)) {
                throw createHttpError.BadRequest("You can't change your own credentials")
            }
            const body = req.body;
            if (body.Role) {
                if (existUser.Role !== "USER" && currentUser.Role !== "SUPERADMIN") {
                    throw createHttpError.BadRequest('you are not able to change the role of this user')
                }
            }

            await UserModel.updateOne({_id: id}, {$set: {...body, accessToken: "", refreshToken: ""}}).then(result => {
                if (result.modifiedCount > 0) {

                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: "user profile has been updated successfully."
                    })
                }
            }).catch((error) => {

                throw createHttpError.InternalServerError(error)
            })
        } catch (e) {

            next(e)
        }
    }

    async banUser(req,res,next){
        try{
            const {id} = req?.params
            if(!isValidObjectId || !id){
                throw  createHttpError.BadRequest("Please provide a valid user id")
            }
            await UserModel.findByIdAndUpdate(id, {$set : {isBanned :true}}).then(result => {
                    SendEmail(result.email , `Your account has been banned by our admins, contact our support for more information`)
                    return res.status(StatusCodes.OK).json({
                        message : "user has been banned successfully."
                    })
            }).catch(error => {
                throw  createHttpError.InternalServerError(`${error.message}`)
            })
        }catch (error) {
            next(error)
        }
    }


    async createUser(req, res, next) {
        try {
            const requestBody = copyObject(req.body)
            let {username, email, mobileNumber, Role, password} = requestBody
            Role = Role ? Role.toUpperCase() : "USER"
            if (await UserModel.findOne({$or: [{email}, {mobileNumber}, {username}]})) {
                throw createHttpError.BadRequest("There is already one user with this credentials")
            }
            if (!email && !mobileNumber) {
                throw createHttpError.BadRequest("Please provide an email or a mobileNumber.")
            }
            const generatedPassword = passwordGenerator.generate({
                length: 10,
                lowercase: true,
                uppercase: true,
                numbers: true
            })
            const hashedPassword = password || hashPassword(generatedPassword);


            await UserModel.create({email, username, mobileNumber, Role, password: hashedPassword , isVerified:true}).then((result) => {
                if (result) {
                    email ? SendEmail(email , "Your account information" , `our support has created a account for you, this is credentials of your account
                     \n your email : ${email} \n your password : ${password || generatedPassword}`) : SendSms(mobileNumber ,`our support has created a account for you, please login to your account by this mobile number we sent message to `)
                    return res.status(200).json({
                        status: 200,
                        userCredentials: {
                            password: password || generatedPassword,
                            username,
                            email,
                            mobileNumber,
                            Role
                        }
                    })
                }
            }).catch(err => {
                throw createHttpError.InternalServerError(err)
            })
        } catch (error) {
            next(error)
        }
    }

})()
