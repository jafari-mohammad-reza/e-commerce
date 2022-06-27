const Joi = require("joi");
const createHttpError = require("http-errors");
const { MONGO_OBJECT_ID_PATTERN } = require("../../../conf/constant");
const createProductValidator = Joi.object({
  title: Joi.string().required().min(5).max(20).messages({
    "any.required": "Title cannot be empty",
    "string.min": "Title must be between 5 to 20 characters",
    "string.max": "Title must be between 5 to 20 characters",
  }),
  overView: Joi.string().required().min(15).max(100).messages({
    "any.required": "overView  cannot be empty",
    "string.min": "overView must be between 5 to 20 characters",
    "string.max": "overView must be between 5 to 20 characters",
  }),
  description: Joi.string().required().min(50).max(500).messages({
    "any.required": "description  cannot be empty",
    "string.min": "description must be between 5 to 20 characters",
    "string.max": "description must be between 5 to 20 characters",
  }),
  fileName: Joi.string().pattern(/(\.png|\.jpg|\.jpeg|\.webp)/),
  tags: Joi.array()
    .min(0)
    .max(10)
    .error(createHttpError.BadRequest("Tags cannot be more than 1")),
  category: Joi.string()
    .required()
    .pattern(MONGO_OBJECT_ID_PATTERN)
    .error(createHttpError.BadRequest("Please enter a valid category id")),
  price: Joi.number().required().min(0),
  discount: Joi.number()
    .min(0)
    .max(100)
    .error(
      createHttpError.BadRequest(
        "Discount percent must be between 0 to 100 percent"
      )
    ),
  stockCount: Joi.number().required().min(0),
  physicalFeatures: Joi.object({
    length: Joi.string().empty(),
    height: Joi.string().empty(),
    width: Joi.string().empty(),
    weight: Joi.string().empty(),
    colors: Joi.array().empty(),
  }).empty(),
  additionalFeatures: Joi.object().empty(),
});
module.exports = {
  createProductValidator,
};
