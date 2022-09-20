const Joi = require('joi');
const createError = require('http-errors');
const {MONGO_OBJECT_ID_PATTERN} = require('../../../conf/constant');
const createBlogValidator = Joi.object({
  title: Joi.string().required().max(50).messages({
    'any.required': 'the title cannot be empty.',
    'string.max': 'the title cannot be more than 50 words',
  }),
  overView: Joi.string().required().min(20).error(createError.BadRequest('the overView cannot be less than 20.')).max(60).error(createError.BadRequest('the overView cannot be empty.')),
  content: Joi.string().required().min(60).messages({
    'any.required': 'the content cannot be empty.',
    'string.min': 'the content cannot be less than 60 words',
  }),
  fileUploadPath: Joi.string().allow(),
  fileName: Joi.string().required(),
  tags: Joi.array().min(0).max(20).error(createError.BadRequest('cannot assign more than 20 tags to a blogs.')),
  category: Joi.string().required().pattern(MONGO_OBJECT_ID_PATTERN).error(createError.BadRequest('not a valid category')),
}).error((error) => createError.BadRequest(error.map((err) => err)));
module.exports = {
  createBlogValidator,
};
