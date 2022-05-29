import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import categoriesRouter from "./routes/categoriesRouter.js";

const app = express().use(cors()).use(express.json());

app.use(categoriesRouter);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
