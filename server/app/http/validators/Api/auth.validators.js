const Joi = require('joi');
require('http-errors');
const emailValidator = Joi.string()
    .empty()
    .email()
    .trim()
    .lowercase()
    .custom((value, helper) => {
      const ending = value.trim().split('@')[1].split('.')[0];
      if (ending === 'gmail' || ending === 'email' || ending === 'yahoo') {
        return value;
      } else {
        return helper.message('Not a valid domain');
      }
    });
const userNameValidator = Joi.string()
    .empty()
    .min(3)
    .max(12)
    .messages({
      'any.required': 'username cannot be empty',
      'string.max': 'username must be between 5 to 12 characters',
      'string.min': 'username must be between 5 to 12 characters',
    })
    .custom((value, helper) => {
      const specialCharactersRegex = /[!@#$&*]/;
      if (specialCharactersRegex.test(value)) {
        return helper.message('username cannot contains any special character');
      } else return value;
    });
const passwordValidator = Joi.string()
    .required()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .messages({
      'any.required': 'password cannot be empty',
      'string.max': 'password must be between 8 to 16 characters',
      'string.min': 'password must be between 8 to 16 characters',
      'string.pattern': 'password must contains at least on uppercase and lowercase character and one number.',
      'string.equal': 'confirmPassword must be exactly equal to password',
    });
const emailLoginValidator = Joi.object({
  email: emailValidator,
  password: passwordValidator,
  rememberme: Joi.boolean().default(false),
});

const emailRegisterValidator = Joi.object({
  username: userNameValidator.required(),
  email: emailValidator.required(),
  password: passwordValidator,
  confirmPassword: passwordValidator
      .equal(Joi.ref('password')),

});
const validatePassword = Joi.object({
  password: passwordValidator,
  confirmPassword: passwordValidator
      .equal(Joi.ref('password')),

});
const isEmailValid = Joi.object({
  email: Joi.string()
      .required()
      .email()
      .lowercase()
      .trim()
      .custom((value, helper) => {
        const ending = value.trim().split('@')[1].split('.')[0];
        if (ending === 'gmail' || ending === 'email' || ending === 'yahoo') {
          return value;
        } else {
          return helper.message('Not a valid domain');
        }
      })
      .messages({
        'any.required': 'the email is required',
        'string.email': 'make sure to enter a valid email address',
      }),
});
const mobileValidator = Joi.string()
    .required().pattern(/(0|0098|98)9(0[1-5]|[1 3]\d|2[0-2]|9[0-4]|98)\d{7}$/)
    .trim().messages({
      'any.required': 'Mobile cannot be empty',
      'any.pattern': 'Not a valid mobile number  ',
    });

const loginByMobile = Joi.object({
  mobile: mobileValidator,
  otp: Joi.string().required().length(6).messages({
    'any.required': 'OTP cannot be empty',
    'string.length': 'OTP should bbe 6 numbers',
  }),
});

module.exports = {
  emailLoginValidator,
  emailRegisterValidator,
  isEmailValid,
  mobileValidator,
  loginByMobile,
  validatePassword,
};
