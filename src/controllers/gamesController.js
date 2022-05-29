import database from "./../database/database.js";

export const getGames = async (req, res) => {
  try {
    const games =
      await database.query(`SELECT games.*, categories.name as "categoryName" 
    FROM games JOIN categories ON games."categoryId" = categories.id`);
    res.status(200).send(games.rows);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const insertGame = async (req, res) => {
  const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.game;
  try {
    await database.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
      VALUES ($1, $2, $3, $4, $5)`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
};
