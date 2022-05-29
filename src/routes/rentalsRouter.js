import { Router } from "express";

import {
  getRentals,
  insertRental,
  returnRental,
  deleteRental,
} from "./../controllers/rentalsController.js";

import {
  validateRentalsData,
  verifyIfCustomerExists,
  verifyIfGameExists,
  verifyIfGameIsAvailable,
  validateIfRentalExists,
  validateIfRentalIsOnGoing,
} from "./../middlewares/rentalsMiddlewares.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);

rentalsRouter.post(
  "/rentals",
  validateRentalsData,
  verifyIfCustomerExists,
  verifyIfGameExists,
  verifyIfGameIsAvailable,
  insertRental
);

rentalsRouter.post(
  "/rentals/:id/return",
  validateIfRentalExists,
  validateIfRentalIsOnGoing,
  returnRental
);

rentalsRouter.delete(
  "/rentals/:id",
  validateIfRentalExists,
  validateIfRentalIsOnGoing,
  deleteRental
);

export default rentalsRouter;
