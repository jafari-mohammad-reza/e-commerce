const Joi = require("joi");
const createHttpError = require("http-errors");
const {MONGO_OBJECT_ID_PATTERN} = require("../../../conf/constant");
const createProductValidator = Joi.object({
    title: Joi.string().required().min(5).messages({
        "any.required": "Title cannot be empty",
        "string.min": "Title must be between 5 to 20 characters"
    }),
    overView: Joi.string().required().min(15).messages({
        "any.required": "overView  cannot be empty",
        "string.min": "overView must be between 15 to 100 characters",
    }),
    description: Joi.string().required().min(50).messages({
        "any.required": "description  cannot be empty",
        "string.min": "description must be between 20 to 500 characters",
    }),
    fileName: Joi.string().pattern(/(\.png|\.jpg|\.jpeg|\.webp)/),
    tags: Joi.array()

        .max(10)
        .error(createHttpError.BadRequest("Tags cannot be more than 10")),
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
    fileUploadPath: Joi.string().empty(),
    physicalFeatures: Joi.array().items(Joi.object({
        title: Joi.string().required(),
        value: Joi.string().required()
    })).empty(),
    colors: Joi.array().items(Joi.string()).allow(),
    additionalFeatures: Joi.array().items(Joi.object({
        title: Joi.string().required(),
        value: Joi.string().required()
    })).empty(),
});
module.exports = {
    createProductValidator,
};
