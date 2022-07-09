const createHttpError = require("http-errors");
const {UserModel} = require("../../models/User");
const JWT = require("jsonwebtoken");
const redisClient = require("../../conf/redisConfiguration")

function getToken(headers, tokenName = "") {
    const {authorization, cookie} = headers;

    if (!authorization && !cookie) {
        throw createHttpError.Unauthorized("Please login first");
    }
    if (authorization) {

        const [bearer, token] = authorization?.split(" ") || [];
        if (token && ["Bearer", "bearer"].includes(bearer)) return token;
        throw createHttpError.Unauthorized("Please login first");
    } else if (cookie) {

        const token = cookie.split(`${tokenName}=`)[1];
        if (token) return token;
        throw createHttpError.Unauthorized("Please login first");
    }
    throw createHttpError.Unauthorized("Please login first");
}

function VerifyAccessToken(req, res, next) {
    try {
        const token = getToken(req.headers, "access_token");
        JWT.verify(token, process.env.JWT_TOKEN, async (err, encoded) => {
            try {
                if (err) throw createHttpError.Forbidden("Please login first");
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

function VerifyVerificationToken(req, res, next) {
    try {
        const token = getToken(req.headers, "verificationToken");
        JWT.verify(token, process.env.JWT_TOKEN, async (err, encoded) => {
            try {
                console.log(err);
                if (err) throw createHttpError.Unauthorized("Please login first");
                const {email} = encoded.payload || {};
                const user = await UserModel.findOne({email}, {email: 1});
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


function VerifyRefreshToken(req, res, next) {
    try {
        const token = getToken(req.headers, "refresh_token");
        console.log(token)
        JWT.verify(token, process.env.JWT_REFRESH_TOKEN, async (err, encoded) => {
            console.log(encoded)
            if (err) throw createHttpError.InternalServerError(err)
            const {userId} = encoded.userId || {};
            const user = await UserModel.findOne({_id: userId}, {accessToken: 1})
            if (!user) throw (createHttpError.Unauthorized("Please Login"))
            const refreshToken = await redisClient.get(String(userId));
            console.log(refreshToken);
            console.log(token);
            if (!refreshToken) throw (createHttpError.Unauthorized("Login into your account"))
            if (token === refreshToken) return req.user = user;
            throw (createHttpError.Unauthorized("Login again"))
        })
    } catch (error) {
        next(error);
    }

}


module.exports = {
    VerifyAccessToken,
    VerifyVerificationToken,
    VerifyRefreshToken
};
