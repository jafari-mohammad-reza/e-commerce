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
                if (err) throw createHttpError.InternalServerError(err)
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
        JWT.verify(token, process.env.JWT_REFRESH_TOKEN, async (err, encoded) => {
            try {
                if (err) throw createHttpError.InternalServerError(err)
                const {userId} = encoded.userId || {};
                const user = await UserModel.findOne({_id: userId}, {accessToken: 1})
                if (!user) throw (createHttpError.Unauthorized("Please Login"))
                req.user = user;
                return next()
                throw (createHttpError.Unauthorized("Login again"))
            } catch (e) {
                next(e);
            }
        })
    } catch (error) {
        next(error);
    }

}

const GraphqlTokenAuth = async (token) => {
    try {

        if (!token) {
            console.log("no token")
            throw  new createHttpError.Unauthorized("Please login first");
        }

        const encoded = JWT.verify(token, process.env.JWT_TOKEN);
        const {email, mobileNumber} = encoded.payload || {};
        const user = await UserModel.findOne(
            {mobileNumber, email},
            {mobileNumber: 1, email: 1, username: 1, Role: 1}
        );
        if (!user) {
            console.log("no user")
            throw new createHttpError.Unauthorized("no account");
        }
        return user;

    } catch (error) {
        throw new createHttpError.Unauthorized()
    }
}

module.exports = {
    VerifyAccessToken,
    VerifyVerificationToken,
    VerifyRefreshToken,
    GraphqlTokenAuth
};
