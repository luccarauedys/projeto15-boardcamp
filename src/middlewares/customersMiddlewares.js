import database from "../database/database.js";
import customersSchema from "./../schemas/customersSchema.js";

export const validateCustomerData = (req, res, next) => {
  const customer = req.body;

  const { error } = customersSchema.validate(customer);
  if (error) return res.sendStatus(400);

  res.locals.customer = customer;
  next();
};

export const validateIfCustomerAlreadyExists = async (req, res, next) => {
  const { cpf } = res.locals.customer;

  const customerExists = await database.query(
    `SELECT * FROM customers WHERE cpf = $1`,
    [cpf]
  );

  if (customerExists.rows[0]) return res.sendStatus(409);
  next();
};
