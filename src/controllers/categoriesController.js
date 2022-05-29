import database from "./../database/database.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await database.query(`SELECT * FROM categories`);
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
