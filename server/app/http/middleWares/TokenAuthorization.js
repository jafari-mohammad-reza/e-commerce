const createHttpError = require("http-errors");
const { UserModel } = require("../../models/User");
const JWT = require("jsonwebtoken");

function getToken(headers, tokenName) {
  const { authorization, cookie } = headers;
  //   console.log(headers);
  if (!authorization && !cookie) {
    throw createHttpError.Unauthorized("Please login first");
  }
  if (authorization) {
    console.log(authorization);
    const [bearer, token] = authorization?.split(" ") || [];
    if (token && ["Bearer", "bearer"].includes(bearer)) return token;
    throw createHttpError.Unauthorized("Please login first");
  }
  if (cookie) {
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
        if (err) throw createHttpError.Unauthorized("Please login first");
        const { email, mobileNumber } = encoded.payload || {};
        const user = await UserModel.findOne(
          { mobileNumber, email },
          { mobileNumber: 1, email: 1, username: 1, Role: 1 }
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
        const { email } = encoded.payload || {};
        const user = await UserModel.findOne({ email }, { email });
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
  VerifyVerificationToken,
};
