const createHttpError = require("http-errors");
const {UserModel} = require("../../models/User");
const JWT = require("jsonwebtoken");

function getToken(headers) {
    const {authorization, cookie} = headers;
    if (!authorization || !cookie) {
        throw createHttpError.Unauthorized(
            "Please login first"
        )
    }
    if (authorization) {
        const [bearer, token] = authorization?.split(" ") || [];
        if (token && ["Bearer", "bearer"].includes(bearer)) return token;
        throw createHttpError.Unauthorized(
            "Please login first"
        );
    }
    if (cookie) {
        const token = cookie["access_token"].split("=")[1]
        if (token) return token;
        throw createHttpError.Unauthorized(
            "Please login first"
        );
    }
    throw createHttpError.Unauthorized(
        "Please login first"
    );
}

function VerifyAccessToken(req, res, next) {
    try {
        const token = getToken(req.headers);
        JWT.verify(token, process.env.JWT_TOKEN, async (err, encoded) => {
            try {
                if (err) throw createHttpError.Unauthorized("Please login first");
                const {email, mobileNumber} = encoded.payload || {};
                const user = await UserModel.findOne(
                    {mobileNumber, email},
                    {mobileNumber: 1, email: 1, username: 1, Role: 1}
                );
                if (!user) throw createHttpError.Unauthorized("no account");
                req.user = user;
                return next();
            } catch (error) {
                next(error);
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    VerifyAccessToken,

}