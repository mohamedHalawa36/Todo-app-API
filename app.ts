import { Request, Response } from "express";

export {};
const express = require("express");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
const authenticationRouter = require("./MVC/Routes/userRouter");
const todoRouter = require("./MVC/Routes/todoRouter");
const cors = require("cors");
const authMW = require("./MVC/MiddleWares/authMW");
dotenv.config();
app.use(morgan(":method :url"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("app is listening");
});

app.use(cors());
app.use(express.json());

app.use(authenticationRouter);
app.use(authMW);
app.use(todoRouter);

//Not Found MW
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Page Not found" });
});
//Error handling MW
app.use((error: ServerError, req: Request, res: Response) => {
  res
    .status(error.status || 500)
    .json({ status: "error", message: error.message + "" });
});
