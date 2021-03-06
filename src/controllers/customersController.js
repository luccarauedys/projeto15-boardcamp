import database from "./../database/database.js";

export const getCustomers = async (req, res) => {
  const cpf = parseInt(req.query.cpf);
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);

  try {
    const customers = await database.query(
      `
    SELECT * FROM customers
    ${cpf ? `WHERE cpf LIKE '${cpf + "%"}'` : ""}
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
    `
    );
    res.status(200).send(customers.rows);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await database.query(
      `SELECT * FROM customers
      WHERE id=$1`,
      [id]
    );

    if (!customer.rows[0]) return res.sendStatus(404);
    res.status(200).send(customer.rows[0]);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const insertCustomer = async (req, res) => {
  const { name, phone, cpf, birthday } = res.locals.customer;
  try {
    await database.query(
      `INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = res.locals.customer;
  try {
    await database.query(
      `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 
      WHERE id = $5`,
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
};
