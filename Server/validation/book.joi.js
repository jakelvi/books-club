import Joi from "joi";

const baseSchema = {
  isAdmin: Joi.boolean().required(),
  username: Joi.string().required(),
};

const favoriteSchema = Joi.object({
  ...baseSchema,
  bookId: Joi.string().required(),
  userId: Joi.string().required(),
});

export const likeSchema = Joi.object({
  bookId: Joi.string().required(),
  userId: Joi.string().required(),
});

const critiqueSchema = Joi.object({
  ...baseSchema,
  bookId: Joi.string().required(),
  userId: Joi.string().required(),
  text: Joi.string().min(10).max(1000).required(),
});

const bookValidationSchema = Joi.object({
  _id: Joi.string().allow(""),
  likes: Joi.array().items(likeSchema),
  favorites: Joi.array().items(favoriteSchema),
  critiques: Joi.array().items(critiqueSchema),
});

export default bookValidationSchema;
