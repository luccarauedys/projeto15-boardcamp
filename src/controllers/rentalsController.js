import database from "./../database/database.js";

export const getRentals = async (req, res) => {
  const customerId = parseInt(req.query.customerId);
  const gameId = parseInt(req.query.gameId);
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);

  try {
    const rentals = await database.query(`
    SELECT 
    rentals.*, 
    customers.name AS "customerName", 
    games.name AS "gameName",
    categories.id AS "categoryId", categories.name AS "categoryName" 
    FROM rentals 
    JOIN customers ON rentals."customerId" = customers.id 
    JOIN games ON rentals."gameId" = games.id
    JOIN categories ON games."categoryId" = categories.id
    ${customerId ? `WHERE customers.id = ${customerId}` : ""}
    ${gameId ? `WHERE games.id = ${gameId}` : ""}
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
    `);

    const finalResult = formatRentals(rentals.rows);
    res.status(200).send(finalResult);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const insertRental = async (req, res) => {
  const { customerId, gameId, daysRented } = res.locals.rental;
  const { pricePerDay } = res.locals.game;
  try {
    const rentDate = generateDate();
    const [returnDate, delayFee] = [null, null];
    const originalPrice = Number(pricePerDay) * parseInt(daysRented);

    await database.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        parseInt(customerId),
        parseInt(gameId),
        rentDate,
        parseInt(daysRented),
        returnDate,
        Number(originalPrice),
        delayFee,
      ]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const returnRental = async (req, res) => {
  const { id } = req.params;
  const { rentDate, pricePerDay } = res.locals.rental;
  try {
    const returnDate = generateDate();
    const delayFee = calcDelayFee(rentDate, returnDate, pricePerDay);

    await database.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
      [returnDate, delayFee, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteRental = async (req, res) => {
  const { id } = req.params;
  try {
    await database.query(`DELETE FROM rentals WHERE id = $1`, [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

function formatRentals(rentals) {
  const formated = rentals.map((rental) => {
    const rentalModel = {
      ...rental,
      customer: {
        id: rental.customerId,
        name: rental.customerName,
      },
      game: {
        id: rental.gameId,
        name: rental.gameName,
        categoryId: rental.categoryId,
        categoryName: rental.categoryName,
      },
    };

    delete rentalModel.customerName;
    delete rentalModel.gameName;
    delete rentalModel.categoryId;
    delete rentalModel.categoryName;

    return rentalModel;
  });

  return formated;
}

function calcDelayFee(rentD, returnD, pricePerDay) {
  const rentDate = new Date(`${rentD}`);
  const returnDate = new Date(`${returnD}`);
  const diff = Math.abs(returnDate - rentDate);
  const numDays = Math.floor(diff / (1000 * 3600 * 24));
  return numDays * pricePerDay;
}

function generateDate() {
  return new Date().toLocaleDateString("pt-BR").split("/").reverse().join("-");
}
