import Joi from "joi";

const gamesSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().pattern(new RegExp("^http(s?)://")).required(),
  stockTotal: Joi.number().integer().greater(0).required(),
  categoryId: Joi.number().integer().required(),
  pricePerDay: Joi.number().integer().greater(0).required(),
});

export default gamesSchema;
