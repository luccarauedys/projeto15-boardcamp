import database from "./../database/database.js";

export const getCategories = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);

  try {
    const categories = await database.query(
      `
    SELECT * FROM categories 
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
    `
    );
    res.status(200).send(categories.rows);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const insertCategory = async (req, res) => {
  const { name } = res.locals.category;

  try {
    await database.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
};
