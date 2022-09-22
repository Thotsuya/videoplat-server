import express, { Request, Response, Express } from "express";
import User, { UserAttributes, UserModel } from "../models/User";

const router = express.Router();

router.get("", async (req: Request, res: Response): Promise<Response> => {
  const users: UserAttributes[] = await User.findAll();
  return res.json(users);
});

router.get("/:id", async (req: Request, res: Response): Promise<Response> => {
  const user: UserAttributes | null = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  return res.json(user);
});

export default router;
