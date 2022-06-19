const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function hashPassword(password) {}
function compareHashedPassword(password, hashedPassword) {}
function generateToken(payload, expiresIn) {}
function generateAccessToken(payload) {}
function generateRefreshToken(payload) {}
function validateToken(token) {}

module.exports = {
  hashPassword,
  compareHashedPassword,
  generateAccessToken,
  generateRefreshToken,
  validateToken,
};
