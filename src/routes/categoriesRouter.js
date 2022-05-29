import { Router } from "express";

import {
  getCategories,
  insertCategory,
} from "../controllers/categoriesController.js";

import {
  validateCategoriesData,
  validateIfCategoryAlreadyExists,
} from "../middlewares/categoriesMiddlewares.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);

categoriesRouter.post(
  "/categories",
  validateCategoriesData,
  validateIfCategoryAlreadyExists,
  insertCategory
);

export default categoriesRouter;
