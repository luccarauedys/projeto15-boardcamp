import { Router } from "express";

import {
  getRentals,
  insertRental,
  returnRental,
  deleteRental,
} from "./../controllers/rentalsController.js";

import { validateRentalsData } from "./../middlewares/rentalsMiddlewares.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRentalsData, insertRental);
rentalsRouter.post("/rentals/:id/return", returnRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
