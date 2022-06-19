const Joi = require("joi");

const emailLoginValidator = Joi.object({
  username: Joi.string()
    .empty()
    .trim()
    .lowercase()
    .min(5)
    .max(10)
    .error(new Error("userName must been between 5 to 10 words")),
  email: Joi.string()
    .empty()
    .email()
    .error(new Error("Not a valid email address"))
    .trim()
    .lowercase()
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
    }),
  password: Joi.string()
    .required()
    .error(new Error("password cannot is necessary"))
    .min(8)
    .max(16)
    .error(new Error("password must be between 8 to 16 characters"))
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$/),
  rememberme: Joi.boolean().default(false),
});

const emailRegisterValidator = Joi.object({
  username: Joi.string()
    .required()
    .error(new Error("username cannot be empty"))
    .min(5)
    .max(10)
    .error(new Error("username must be between 5 to 10 words")),
  email: Joi.string()
    .email()
    .error(new Error("Not a valid email address"))
    .required()
    .error(new Error("email cannot is necessary"))
    .trim()
    .lowercase()
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
    }),
  password: Joi.string()
    .required()
    .error(new Error("password cannot is necessary"))
    .min(8)
    .max(16)
    .error(new Error("password must be between 8 to 16 characters"))
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$/),
  confirmPassword: Joi.string()
    .required()
    .error(new Error("confirmPassword cannot is necessary"))
    .min(8)
    .max(16)
    .error(new Error("confirmPassword must be between 8 to 16 characters"))
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$/)
    .equal(Joi.ref("password"))
    .error(new Error("confirmPassword should exactly be same as password")),
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

module.exports = {
  emailLoginValidator,
  emailRegisterValidator,
  isEmailValid,
};
