import database from "./../database/database.js";
import gamesSchema from "./../schemas/gamesSchema.js";

export const validateGamesData = (req, res, next) => {
  const game = req.body;

  const { error } = gamesSchema.validate(game);
  if (error) return res.sendStatus(400);

  res.locals.game = game;
  next();
};

export const validateIfGameAlreadyExists = async (req, res, next) => {
  const { name } = res.locals.game;

  const gameExists = await database.query(
    `SELECT * FROM games WHERE name = $1`,
    [name]
  );

  if (gameExists.rows[0]) return res.sendStatus(409);
  next();
};
