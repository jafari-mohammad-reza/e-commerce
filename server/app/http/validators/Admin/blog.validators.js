const Joi = require("joi");
const createError = require("http-errors")
const { MONGO_OBJECT_ID_PATTERN } = require("../../../conf/constant");
const createBlogValidator = Joi.object({
    title: Joi.string().required().max(50).messages({
        "any.required": "the title cannot be empty.",
        "string.max": "the title cannot be more than 50 words"
    }),
    overView: Joi.string().required().min(20).max(60).messages({
        "any.required": "the overView cannot be empty.",
        "string.max": "the overView cannot be more than 50 words",
        "string.min": "the overView cannot be more than 50 words",
    }),
    content: Joi.string().required().min(60).max(500).messages({
        "any.required": "the content cannot be empty.",
        "string.max": "the content cannot be more than 500 words",
        "string.min": "the content cannot be more than 60 words",
    }),
    fileUploadPath: Joi.string().allow(),
    image: Joi.string().required().pattern(/(\.png|\.jepg|\.jpg|\.webp)/).error(createError.BadRequest("not a valid file")),
    tags: Joi.array().min(0).max(20).error(createError.BadRequest("cannot assign more than 20 tags to a blog.")),
    category: Joi.string().required().pattern(MONGO_OBJECT_ID_PATTERN).error(createError.BadRequest("not a valid category"))
})
module.exports = {
    createBlogValidator
}