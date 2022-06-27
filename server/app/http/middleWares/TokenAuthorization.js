const createError = require("http-errors");
const { UserModel } = require("../../models/User");
const { validateToken } = require("../../utils/Security");

function getToken(headers) {
    const { cookie, authorization } = headers;
    if (!cookie["token"] && !authorization?.bearer) throw createError.Unauthorized("Please login first.")
    return cookie.trim().split("=")[1] || authorization.trim().split("Bearer")[1]
}

function VerifyAccessToken(req, res, next) {
    try {
        const token = getToken(req.headers);
        const { email } = validateToken(token);
        const user = UserModel.findOne({ email }, { password: 0, __v: 0, createdAt: 0, updatedAt: 0 });
        if (!user) throw createError.Unauthorized("Please login first.")
        req.user = user;
        next()
    } catch (error) {
        next(createError.InternalServerError(error))
    }
}

function VerifyRefreshToken(req, res, next) {
    try {
    } catch (error) {
    }
}

function checkRole(req, res, next) {
    return function (role) {

        try {
            const token = getToken(req.headers);
            const { email } = validateToken(token);
            const user = UserModel.findOne({ email }, { password: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            if (!user) throw createError.Unauthorized("Please login first.")
            if (!user.Role.includes(role)) throw createError.Unauthorized("You don't have permission to access this page.")
            req.user = user;
            next()
        }
        catch (err) {
            next(createError.InternalServerError(err))
        }
    }
}

module.exports = {
    VerifyRefreshToken,
    VerifyAccessToken,
    checkRole
}