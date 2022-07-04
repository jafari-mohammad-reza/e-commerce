const Joi = require("joi")
const {MONGO_OBJECT_ID_PATTERN} = require("../../../conf/constant");
const createRoleValidator = Joi.object({
    title: Joi.string().required().max(20),
    permissions: Joi.array().items(Joi.string().pattern(MONGO_OBJECT_ID_PATTERN))
})


module.exports = {
    createRoleValidator
}