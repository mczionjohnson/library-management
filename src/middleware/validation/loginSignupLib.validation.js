import Joi from "joi";

export const registerLibSchema = Joi.object({
email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base":
        'Password must contain only letters, numbers, or "@" and be between 3 and 30 characters long.',
    }),
  // confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  libPass: Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9]{9,10}!@#$"))
  .required()
  .messages({
    "string.pattern.base":
      'library pass is a level 10.',
  }),
});

export const loginLibSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
