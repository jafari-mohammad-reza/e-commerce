const DefaultController = require("../default.controller")
const createHttpError = require("http-errors")
const {UserModel} = require("../../../models/User");
const {StatusCodes} = require("http-status-codes");
const {isValidObjectId} = require("mongoose");
const {deleteInvalidPropertyInObject, copyObject} = require("../../../utils/functions");
const {hashPassword} = require("../../../utils/Security");
const passwordGenerator = require("generate-password")
module.exports = new (class UserController extends DefaultController {
    async getAll(req, res, next) {
        try {
            const {search} = req.query;
            const dataBaseQuery = {}
            if (search) {
                dataBaseQuery['$text'] = {$search: search.toString()}
            }
            const users = await UserModel.find({$and : [{dataBaseQuery} , {_id : {$ne : req.user._id}}]}, {
                username: 1,
                email: 1,
                mobileNumber: 1,
                accessToken: 1,
                Role: 1,
                isBanned:true

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
            const currentUser =req.user
            const existUser = await UserModel.findOne({_id: id}, {Role: 1, accessToken: 1, refreshToken: 1,_id:1})
            if(existUser._id.equals(currentUser._id)){
                throw createHttpError.BadRequest("You can't change your own credentials")
            }
            const body = req.body;
            if (body.Role) {
                if (existUser.Role !== "USER" && currentUser.Role !== "SUPERADMIN") {
                    throw createHttpError.BadRequest('you are not able to change the role of this user')
                }
            }

            await UserModel.updateOne({_id : id}, {$set: {...body , accessToken:"",refreshToken:""}}).then(result => {
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
            console.log(e)
            next(e)
        }
    }
    async createUser(req,res,next){
        try{
            const requestBody =copyObject(req.body)
            const {username,email,mobileNumber,Role , password} = requestBody
            if(await UserModel.findOne({$or : [{email: email} , {mobileNumber: mobileNumber}, {username: username}]})){
                throw createHttpError.BadRequest("There is already one user with this credentials")
            }
            if(!email && !mobileNumber){
                throw createHttpError.BadRequest("Please email or mobileNumber.")
            }
            const generatedPassword =passwordGenerator.generate({length:10,lowercase:true,uppercase:true,numbers:true})
            const hashedPassword  =password || hashPassword(generatedPassword);
            console.log(password)
            //todo : send password and other crdentials to user email or mobile
            await UserModel.create({email,username,mobileNumber,Role,password :hashedPassword}).then((result) => {
                if(result){
                    return res.status(200).json({
                        status:200,
                        userCredentials : {
                            password:password || generatedPassword,
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
        }catch (error) {
            next(error)
        }
    }

})()