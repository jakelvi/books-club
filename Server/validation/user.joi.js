// userValidation.js
import Joi from "joi";
import passwordRegex from "./regex.js";

const registerValidationSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  password: Joi.string().pattern(passwordRegex).required(),
  email: Joi.string().email().required(),
  isAdmin: Joi.boolean(),
});

const loginValidateSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  password: Joi.string().pattern(passwordRegex).required(),
});

const updateValidationSchema = Joi.object({
  username: Joi.string().min(3).max(20),
  password: Joi.string().pattern(passwordRegex),
  email: Joi.string().email(),
  isAdmin: Joi.boolean(),
});

export {
  registerValidationSchema,
  loginValidateSchema,
  updateValidationSchema,
};
