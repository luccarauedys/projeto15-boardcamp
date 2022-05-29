import database from "./../database/database.js";
import categoriesSchema from "./../schemas/categoriesSchema.js";

export const validateCategoriesData = (req, res, next) => {
  const category = req.body;

  const { error } = categoriesSchema.validate(category);
  if (error) return res.sendStatus(400);

  res.locals.category = category;
  next();
};

export const validateIfCategoryAlreadyExists = async (req, res, next) => {
  const { name } = res.locals.category;

  const categoryExists = await database.query(
    `SELECT * FROM categories WHERE name = $1`,
    [name]
  ).rows;

  if (categoryExists.length) return res.sendStatus(409);
  next();
};
