const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const redisClient = require('../conf/redisConfiguration');
const {UserModel} = require('../models/User');

/**
 * hash given password and return it
 * @param {password} password
 * @return {string}
 * */
function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/**
 * compare hashed password and orginal password and return a boolean
 * @param {password} password
 * @param {string} hashedPassword
 * @return {boolean}
 * */
function compareHashedPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

/**
 * generate a Jwt token by the entered payload and custom expiration time that is 1day y default
 * @param {{email: *}} payload
 * @param {string} expiresIn
 * @return {string}
 * */
function generateToken(payload, expiresIn = '1d') {
  return jwt.sign({payload}, process.env.JWT_TOKEN, {expiresIn});
}

/**
 * generate a random code
 * @param {number} length
 * @return {string}
 * */
function generateOneCode(length) {
  return Math.random().toString(16).substring(2, length);
}

/**
 * generate a Jwt access token by the entered payload and custom expiration time that is 30 days by default
 * @param {{email}} payload
 * @param {expiresIn} expiresIn
 * @return {string}
 * */
function generateAccessToken(payload, expiresIn = '30d') {
  return jwt.sign({payload}, process.env.JWT_TOKEN, {expiresIn: '30d'});
}

/**
 * generate a Jwt refresh token that will exist for 1 year and store in in redis for data caching
 * @param {userId} userId
 * @return {string}
 * */
async function generateRefreshToken(userId) {
  return await new Promise(async (resolve, reject) => {
    const user = await UserModel.findOne({_id: userId});
    const payload = {
      mobileNumber: user.mobileNumber,
      email: user.email,
    };
    jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: '1y',
    }, async (err, token) => {
      if (err) reject(createHttpError.InternalServerError('Server error'));
      await redisClient.SETEX(String(userId), (365 * 24 * 60 * 60), token);
      resolve(token);
    });
  });
}

/**
 * generate a one time password
 * @return {otp}
 * */
function generateOTP() {
  return {
    code: Math.floor(Math
        .random() * (999999 - 100000 + 1)) + 100000,
    expiresIn: new Date().getTime() + 120000,
  };
}
module.exports = {
  hashPassword,
  compareHashedPassword,
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  generateOneCode,
  generateOTP,
};
