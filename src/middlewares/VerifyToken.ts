import * as jwt from "jsonwebtoken";
import { RequestHandler } from "express";

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET as string);
    if (verified) {
      next();
    }
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
