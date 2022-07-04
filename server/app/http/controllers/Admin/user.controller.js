const DefaultController = require("../default.controller")
const createHttpError = require("http-errors")
const {UserModel} = require("../../../models/User");
const {StatusCodes} = require("http-status-codes");
module.exports = new (class UserController extends DefaultController {
    async getAll(req, res, next) {
        try {
            const {search} = req.query;
            const dataBaseQuery = {}
            if (search) {
                dataBaseQuery['$text'] = {$search: search.toString()}
            }
            const users = await UserModel.find(dataBaseQuery, {username: 1, email: 1, mobileNumber: 1, accessToken: 1})
            return res.status(StatusCodes.OK).json({
                success: true,
                users
            })
        } catch (e) {
            next(createHttpError.InternalServerError(e))
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.user._id
            // console.log(userId)
            const data = {firstName, lastName, username, birthday} = req.body;
            await UserModel.updateOne({_id: userId}, {$set: {data}}).then(result => {
                if (result.modifiedCount > 0) {
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: "user profile has been updated successfully."
                    })
                }
                throw createHttpError.BadRequest("user has not been updated successfully.")
            }).catch((error) => {
                throw createHttpError.InternalServerError(error)
            })
        } catch (e) {
            next(createHttpError.InternalServerError(e))
        }
    }


})()