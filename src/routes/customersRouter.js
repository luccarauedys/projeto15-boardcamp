import { Router } from "express";

import {
  getCustomers,
  getCustomerById,
  insertCustomer,
  updateCustomer,
} from "./../controllers/customersController.js";

import {
  validateCustomerData,
  validateIfCustomerAlreadyExists,
} from "./../middlewares/customersMiddlewares.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);

customersRouter.get("/customers/:id", getCustomerById);

customersRouter.post(
  "/customers",
  validateCustomerData,
  validateIfCustomerAlreadyExists,
  insertCustomer
);

customersRouter.put("/customers/:id", validateCustomerData, updateCustomer);

export default customersRouter;
