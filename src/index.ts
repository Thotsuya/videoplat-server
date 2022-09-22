import express, { Request, Response, Express } from "express";
import sequelize from "./database";
import { config } from "dotenv";
import cors from "cors";
import * as bodyParser from "body-parser";

import "./models/User";

import userRouter from "./routes/user";
import authRouter from "./routes/auth";

config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/users", userRouter);
app.use("/", authRouter);

sequelize
  .sync({
    alter: true,
  })
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
