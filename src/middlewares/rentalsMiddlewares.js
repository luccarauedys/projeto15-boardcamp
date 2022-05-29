import database from "./../database/database.js";
import rentalsSchema from "./../schemas/rentalsSchema.js";

export const validateRentalsData = (req, res, next) => {
  const rental = req.body;

  const { error } = rentalsSchema.validate(rental);
  if (error) return res.sendStatus(400);

  res.locals.rental = rental;
  next();
};

export const verifyIfCustomerExists = async (req, res, next) => {
  const { customerId } = res.locals.rental;
  try {
    const customer = await database.query(
      `SELECT * FROM customers WHERE id = $1`,
      [customerId]
    ).rows[0];

    if (!customer) return res.sendStatus(400);
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const verifyIfGameExists = async (req, res, next) => {
  const { gameId } = res.locals.rental;
  try {
    const game = await database.query(`SELECT * FROM games WHERE id = $1`, [
      gameId,
    ]).rows[0];

    if (!game) return res.sendStatus(400);

    res.locals.game = game;
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const verifyIfGameIsAvailable = async (req, res, next) => {
  const { gameId } = res.locals.rental;
  const { stockTotal } = res.locals.game;
  try {
    const gameRentals = database.query(
      `SELECT rentals."returnDate" FROM rentals WHERE "gameId" = $1`,
      [gameId]
    ).rows;

    const rentedGames = gameRentals.filter(
      (rental) => (rental.returnDate = null)
    ).length;

    if (stockTotal <= rentedGames) return res.sendStatus(400);
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const validateIfRentalExists = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rental = await database.query(
      `SELECT r."rentDate", r."returnDate", g."pricePerDay" 
      FROM rentals r JOIN games g 
      ON r."gameId" = g.id
      WHERE r.id = $1`,
      [id]
    ).rows[0];

    if (!rental) return res.sendStatus(400);

    res.locals.rental = rental;
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const validateIfRentalIsOnGoing = async (req, res, next) => {
  const { returnDate } = res.locals.rental;
  if (returnDate) return res.sendStatus(400);
  next();
};
