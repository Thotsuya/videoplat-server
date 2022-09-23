import { Request, Response } from "express";
import User, { Followers, UserAttributes } from "../models/User";
import Video from "../models/Video";

export const show = async (req: Request, res: Response): Promise<Response> => {
  // Find user and return user with its videos
  try {
    const user: UserAttributes | null = await User.findByPk(req.params.id, {
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
        {
          model: Video,
          as: "likedVideos",
          attributes: {
            exclude: ["user_id", "createdAt", "updatedAt"],
          },
        },
        {
          model: User,
          as: "followers",
          attributes: {
            exclude: ["password", "role", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const follow = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user: UserAttributes | null = await User.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: "followers",
      },
    ],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isFollowing = user.followers?.find((follower) => {
    console.log(follower);
    return follower.id === parseInt(req.body.user.id);
  });

  try {
    if (isFollowing) {
      await Followers.destroy({
        where: {
          user_id: user.id,
          follower_id: req.body.user.id,
        },
      });

      return res
        .status(200)
        .json({ message: `Unfollowing user: ${user.name}` });
    } else {
      await Followers.create({
        user_id: user.id,
        follower_id: req.body.user.id,
      });
      return res.status(200).json({ message: `Following user: ${user.name}` });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error following user" });
  }
};
