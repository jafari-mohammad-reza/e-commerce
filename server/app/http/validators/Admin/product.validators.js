const Joi = require('joi');
const createHttpError = require('http-errors');

const createProductValidator = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    overView: Joi.string().required(),
    category: Joi.string().required(),
    tags: Joi.array().required(),
})
module.exports = {
    createProductValidator
}