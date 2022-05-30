import database from "./../database/database.js";
import rentalsSchema from "./../schemas/rentalsSchema.js";

export const validateRentalsData = (req, res, next) => {
  const { customerId, gameId, daysRented } = req.body;
  const rental = new Object();
  rental.customerId = customerId;
  rental.gameId = gameId;
  rental.daysRented = parseInt(daysRented);

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
    );

    if (!customer.rows[0]) return res.sendStatus(400);
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
    ]);

    if (!game.rows[0]) return res.sendStatus(400);
    res.locals.game = game.rows[0];
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const verifyIfGameIsAvailable = async (req, res, next) => {
  const { gameId } = res.locals.rental;
  const { stockTotal } = res.locals.game;
  try {
    const gameRentals = await database.query(
      `SELECT rentals."returnDate" FROM rentals WHERE "gameId" = $1`,
      [gameId]
    );

    const rentedGames = gameRentals.rows.filter(
      ({ returnDate }) => returnDate == null
    );

    if (stockTotal <= rentedGames.length) return res.sendStatus(400);
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
    );

    if (!rental.rows[0]) return res.sendStatus(404);
    res.locals.rental = rental.rows[0];
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const validateIfRentalIsOnGoing = async (req, res, next) => {
  const { returnDate } = res.locals.rental;
  if (returnDate != null) return res.sendStatus(400);
  next();
};
