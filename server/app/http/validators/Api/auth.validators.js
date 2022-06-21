const Joi = require("joi");
const createError = require("http-errors");
const emailValidator = Joi.string()
    .empty()
    .email()
    .trim()
    .lowercase()
    .custom((value, helper) => {
        const ending = value.trim().split("@")[1].split(".")[0];
        if (ending === "gmail" || ending === "email" || ending === "yahoo") {
            return value;
        } else {
            return helper.message("Not a valid domain");
        }
    });
const userNameValidator = Joi.string()
    .empty()
    .min(3)
    .max(10)
    .messages({
        "any.required": "username cannot be empty",
        "string.max": "username must be between 5 to 10 characters",
        "string.min": "username must be between 5 to 10 characters",
    })
    .custom((value, helper) => {
        const specialCharactersRegex = /[!@#$&*]/;
        if (specialCharactersRegex.test(value)) {
            return helper.message("username cannot contains any special character");
        } else return value;
    });
const passwordValidator = Joi.string()
    .required()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .error(
        createError.BadRequest(
            "password must contains at least 1 uppercase letter,1 lowercase letter and 1 number"
        )
    );
const emailLoginValidator = Joi.object({
    username: userNameValidator,
    email: emailValidator,
    password: passwordValidator,
    rememberme: Joi.boolean().default(false),
});

const emailRegisterValidator = Joi.object({
    username: userNameValidator,
    email: emailValidator,
    password: passwordValidator,
    confirmPassword: passwordValidator
        .equal(Joi.ref("password"))
        .error(
            createError.BadRequest("confirmPassword must be exactly qual to password")
        ),
});

const isEmailValid = Joi.string()
    .required()
    .error(new Error("Email cannot be empty"))
    .email()
  .error(new Error("not a valid email address"))
  .lowercase()
  .trim()
  .custom((value, helper) => {
    if (
      !value.endsWith("@gmail.com") ||
        value.endsWith("@email.com") ||
        value.endsWith("@yahoo.com")
    ) {
        return helper.error(
            "only @gmail.com , @email.com and @yahoo.com are allowed"
        );
    } else {
        return true;
    }
  });
const mobileNumber = Joi.string()
    .required()
    .error(new Error("mobile number is required"))
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .trim();
const loginByMobile = Joi.object({
    mobileNumber,
    otp: Joi.string().required().error(new Error("otp is required")).length(6),
});

module.exports = {
    emailLoginValidator,
    emailRegisterValidator,
    isEmailValid,
    mobileNumber,
    loginByMobile,
};
