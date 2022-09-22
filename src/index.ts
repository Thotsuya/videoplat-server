import express, { Request, Response, Express } from "express";
import sequelize from "./database";
import { config } from "dotenv";
import cors from "cors";
import * as bodyParser from "body-parser";
import { verifyToken } from "./middlewares/VerifyToken";

import "./models/Video";
import "./models/User";

import authRouter from "./routes/auth";
import videoRouter from "./routes/videos";
import creatorRouter from "./routes/creators";

config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", authRouter);

app.use(verifyToken);
app.use("/videos", videoRouter);
app.use("/creators", creatorRouter);

sequelize
  .sync({
    force: true,
  })
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
