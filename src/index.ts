import express, { Request, Response, Express } from "express";
import sequelize from "./database";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

sequelize.authenticate().then(() => {
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
