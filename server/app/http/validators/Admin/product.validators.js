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
        .error(
            createHttpError.BadRequest(
                "Discount percent must be between 0 to 100 percent"
            )
        ),
    stockCount: Joi.number().required().min(0),
    fileUploadPath: Joi.string().empty(),
    physicalFeatures: Joi.object({
        length: Joi.string().empty(),
        height: Joi.string().empty(),
        width: Joi.string().empty(),
        weight: Joi.string().empty(),
        colors: Joi.object().keys({
            type: Joi.object().valid({
                blue: {title: "blue", hex: "#0055FF"},
                violet: {title: "violet", hex: "#aaaaff"},
                green: {title: "violet", hex: "#00FF00"},
                black: {title: "violet", hex: "#000"}
            })
        })
    }).empty(),
    additionalFeatured: Joi.object().empty()
});
module.exports = {
    createProductValidator,
};
