import { Router } from "express";

import { getGames, insertGame } from "./../controllers/gamesController.js";

import {
  validateGamesData,
  validateIfGameAlreadyExists,
} from "./../middlewares/gamesMiddlewares.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);

gamesRouter.post(
  "/games",
  validateGamesData,
  validateIfGameAlreadyExists,
  insertGame
);

export default gamesRouter;
