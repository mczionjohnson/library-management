import Joi from "joi";

export const registerLibSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{8,20}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain only letters, numbers and be between 3 and 30 characters long.",
    }),

  libPass: Joi.string()
    .pattern(new RegExp("^[A-Za-z0-9]+!@#$"))
    .required()
    .messages({
      "string.pattern.base": "library pass is a level 10.",
    }),
});

export const loginLibSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// export const postSchema = Joi.object({
//   title: Joi.string().email().required(),
//   author: Joi.string().email().required(),
//   ISBN: Joi.string().pattern(new RegExp("^[0-9]{10}$"))
//     .required()
//     .messages({
//       "string.pattern.base":
//         'ISBN is the unique 10 or 13 digits of the book.',
//     }),
// });
