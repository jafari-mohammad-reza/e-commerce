const Joi = require('joi');
const {MONGO_OBJECT_ID_PATTERN} = require('../../../conf/constant');
const createHttpError = require('http-errors');
const modifyCategory = Joi.object({
  title: Joi.string().required().min(3).max(20).messages({
    'any.require': 'Title is required',
    'string.min': 'Title cannot be less than 3 words',
    'string.max': 'Title cannot be more than 20 words',
  }),
  parent: Joi.string().allow('').empty().pattern(MONGO_OBJECT_ID_PATTERN).error(createHttpError.BadRequest('not a valid parent id')),
  fileUploadPath: Joi.string().empty(), fileName: Joi.string().pattern(/(\.png|\.jpg|\.jpeg|\.webp)/),
  image: Joi.allow().empty(),
},
);
module.exports = {
  modifyCategory,
};
