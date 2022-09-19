const Joi = require('joi');
const {MONGO_OBJECT_ID_PATTERN} = require('../../../conf/constant');
const createHttpError = require('http-errors');
const createRoleValidator = Joi.object({
  title: Joi.string().required().max(20),
  permissions: Joi.array().min(1).max(5).items(Joi.string().pattern(MONGO_OBJECT_ID_PATTERN)),
}).error(createHttpError.BadRequest('Not a valid input'));


module.exports = {
  createRoleValidator,
};
