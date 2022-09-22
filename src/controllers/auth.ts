import { Request, Response } from "express";
import validator from "validatorjs";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import User, { UserAttributes, UserModel } from "../models/User";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const validation = new validator(req.body, {
    name: "required",
    email: "required|email",
    password: "required|min:6",
    password_confirmation: "required|same:password",
    role: "required",
  });

  if (validation.fails()) {
    return res.status(400).send(validation.errors);
  }

  const user: UserAttributes | null = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (user) {
    return res.status(400).send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const newUser: UserModel = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
  });
  return res.status(201).json(newUser);
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const validation = new validator(req.body, {
    email: "required|email",
    password: "required|min:6",
    remember: "required|boolean",
  });

  if (validation.fails()) {
    return res.status(400).send(validation.errors);
  }

  const user: UserAttributes | null = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).send("Invalid password");
  }

  const token: string = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.TOKEN_SECRET as string,
    {
      expiresIn: req.body.remember ? "7d" : "1d",
    }
  );

  return res.header("Authorization", `Bearer ${token}`).send({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
};
