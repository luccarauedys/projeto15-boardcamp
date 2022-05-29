import database from "./../database/database.js";

export const getRentals = async (req, res) => {
  const { customerId, gameId } = req.query;
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
    ${customerId && `WHERE customers.id = ${parseInt(customerId)}`}
    ${gameId && `WHERE games.id = ${parseInt(gameId)}`}
    `);
    res.status(200).send(rentals);

    // const finalResult = formatRentals(rentals.rows);
    // res.status(200).send(finalResult);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const insertRental = async (req, res) => {
  const {
    rental: { customerId, gameId, daysRented },
    game: { pricePerDay },
  } = res.locals;

  try {
    const rentDate = new Date()
      .toLocaleDateString("pt-BR")
      .split("/")
      .reverse()
      .join("-");
    const [returnDate, delayFee] = [null, null];
    const originalPrice = pricePerDay * daysRented;

    await database.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const returnRental = async (req, res) => {};

export const deleteRental = async (req, res) => {};

const formatRentals = (rentals) => {
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
};
