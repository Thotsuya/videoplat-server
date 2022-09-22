import * as jwt from "jsonwebtoken";
import { RequestHandler, Response, Request, NextFunction } from "express";

export const verifyToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET as string);
    if (verified) {
      req.body.user = verified;
      next();
    }
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
