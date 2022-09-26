import { Request, Response } from "express";
import validator from "validatorjs";
import Video, { VideoModel } from "../models/Video";
import User, { LikedVideos, UserModel } from "../models/User";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const videos: VideoModel[] = await Video.findAll({
    where: {
      published: true,
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password", "role", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
        as: "likedBy",
        attributes: {
          exclude: ["password", "role", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  return res.status(200).json(videos);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const validation = new validator(req.body, {
    title: "required",
    description: "required",
    url: "required|url",
    published: "required|boolean",
  });

  if (validation.fails()) {
    return res.status(422).send(validation.errors);
  }

  // Create a new video for the authenticated user
  const video: VideoModel = await Video.create({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
    published: req.body.published,
    user_id: req.body.user.id,
  });

  return res.status(201).json(video);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const video: VideoModel | null = await Video.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password", "role", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  return res.status(200).json(video);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const validation = new validator(req.body, {
    title: "required",
    description: "required",
    url: "required",
    published: "required|boolean",
  });

  if (validation.fails()) {
    return res.status(400).send(validation.errors);
  }

  const video: VideoModel | null = await Video.findOne({
    where: {
      id: req.params.id,
      user_id: req.body.user.id,
    },
  });

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  video.title = req.body.title;
  video.description = req.body.description;
  video.url = req.body.url;
  video.published = req.body.published;
  await video.save();

  return res.status(200).json(video);
};

export const likeVideo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const video: VideoModel | null = await Video.findByPk(req.params.id);

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  const user: UserModel | null = await User.findByPk(req.body.user.id, {
    include: [
      {
        model: Video,
        as: "likedVideos",
      },
    ],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const likedVideo = user.likedVideos?.find(
    (video) => video.id === parseInt(req.params.id)
  );

  if (likedVideo) {
    await LikedVideos.destroy({
      where: {
        user_id: req.body.user.id,
        video_id: req.params.id,
      },
    });
    return res.status(200).json({ message: "Video unliked" });
  } else {
    await LikedVideos.create({
      user_id: req.body.user.id,
      video_id: req.params.id,
    });
    return res.status(200).json({ message: "Video liked" });
  }
};
