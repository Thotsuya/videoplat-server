import { Request, Response } from "express";
import validator from "validatorjs";
import Video, { VideoModel } from "../models/Video";
import User from "../models/User";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const videos: VideoModel[] = await Video.findAll({
    include: [
      {
        model: User,
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
    url: "required",
    published: "required|boolean",
  });

  if (validation.fails()) {
    return res.status(400).send(validation.errors);
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
