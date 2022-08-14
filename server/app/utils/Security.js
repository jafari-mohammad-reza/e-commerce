const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const redisClient = require("../conf/redisConfiguration");
const {UserModel} = require("../models/User");

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function compareHashedPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}

function generateToken(payload, expiresIn = "1d") {
    return jwt.sign({payload}, process.env.JWT_TOKEN, {expiresIn});
}

function generateOneCode(length) {
    return Math.random().toString(16).substr(2, length);
}

function generateAccessToken(payload) {
    return jwt.sign({payload}, process.env.JWT_TOKEN, {expiresIn: "30d"});
}

async function generateRefreshToken(userId) {
    const user = await UserModel.findOne({_id: userId});
    const payload = {
        mobileNumber: user.mobileNumber,
        email: user.email,
    };

    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
            expiresIn: "1y",
        }, async (err, token) => {
            if (err) reject(createHttpError.InternalServerError("Server error"));
            await redisClient.SETEX(String(userId), (365 * 24 * 60 * 60), token);
            resolve(token);
        })
    })

}

async function VerifyRefreshToken(token) {
    jwt.verify(token, process.env.JWT_REFRESH_TOKEN, async (err, payload) => {
        if (err) throw (createHttpError.Unauthorized("Please login first"))
        const {mobile} = payload || {};
        const user = await UserModel.findOne({mobile}, {password: 0, otp: 0})
        if (!user) throw (createHttpError.Unauthorized("User not found"))
        const refreshToken = await redisClient.get(String(user?._id));
        if (!refreshToken) throw (createHttpError.Unauthorized("Login failed"))
        if (token === refreshToken) return (mobile);
        throw (createHttpError.Unauthorized("Login failed"))
    })
}

function generateOTP() {

    return {
        code: Math.floor(Math
            .random() * (999999 - 100000 + 1)) + 100000,
        expiresIn: new Date().getTime() + 120000,
    };
}

function validateToken(token) {
    try {
        let tk;
        jwt.verify(token, process.env.JWT_TOKEN, {}, (err, verifiedToken) => {
            if (err) {
                console.log(process.env.JWT_TOKEN);
                throw createHttpError.InternalServerError(err);
            }
            // console.log(verifiedToken)
            tk = verifiedToken;
        });
        return tk;
    } catch (err) {
        createHttpError.InternalServerError(err);
    }
}

function validateRefreshToken(token) {
    try {
        return jwt.verify(
            token,
            process.env.Refresh_TOKEN,
            {algorithm: "sha256"},
            async (err, payload) => {
                if (err) console.log(err);
                else {
                    const user = await UserModel.findOne({payload});
                    if (!user)
                        throw createHttpError.NOT_FOUND("Not a valid refresh token");
                    const refreshToken = await redisClient.get(user._id);
                    if (token !== refreshToken) {
                        throw createHttpError.UNAUTHORIZED(
                            "there was an error while logging in."
                        );
                    }
                }
            }
        );
    } catch (err) {
        createHttpError.InternalServerError(err.message);
    }
}

module.exports = {
    hashPassword,
    compareHashedPassword,
    generateAccessToken,
    generateRefreshToken,
    generateToken,
    validateToken,
    validateRefreshToken,
    generateOneCode,
    generateOTP,
    VerifyRefreshToken
};
