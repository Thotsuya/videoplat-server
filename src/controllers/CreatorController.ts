import { Request, Response } from "express";
import User from "../models/User";
import Video from "../models/Video";

export const show = async (req: Request, res: Response): Promise<Response> => {
  // Find user and return user with its videos
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: {
      exclude: ["password", "role", "createdAt", "updatedAt"],
    },
    include: [
      {
        model: Video,
        attributes: {
          exclude: ["user_id", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
};
