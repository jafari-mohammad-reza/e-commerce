const createError = require("http-errors")
const {validateToken} = require("../../utils/Security");

function VerifyAccessToken(req, res, next) {
    try {
        const {cookie, authorization} = req.headers;
        if (!cookie && !authorization) throw createError.BAD_REQUEST("Please login first.")
        const token = cookie.trim().split("=")[1] || authorization.trim().split("Bearer")[1]
        const verifiedToken = validateToken(token);
        console.log(verifiedToken)
        next()
    } catch (error) {
        next(createError.InternalError(error))
    }
}

function VerifyRefreshToken(req, res, next) {
    try {
    } catch (error) {
    }
}

function checkRole(role){
    try {
    }
    catch (err){

    }
}

module.exports = {
    VerifyRefreshToken,
    VerifyAccessToken,
    checkRole
}