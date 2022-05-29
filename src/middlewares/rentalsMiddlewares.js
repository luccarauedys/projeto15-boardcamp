import database from "./../database/database.js";
import rentalsSchema from "./../schemas/rentalsSchema.js";

export const validateRentalsData = (req, res, next) => {
  const rental = req.body;

  const { error } = rentalsSchema.validate(rental);
  if (error) return res.sendStatus(400);

  res.locals.rental = rental;
  next();
};
