const Joi = require("joi")
const modifyCategory = Joi.object({
    title: Joi.string().required().min(3).max(20).messages({
        "any.require": "Title is required",
        "string.min": "Title cannot be less than 3 words",
        "string.max": "Title cannot be more than 20 words"
    }),
    parent: Joi.string().empty().pattern(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).error("Not a valid parent id")
})
module.exports = {
    modifyCategory
}