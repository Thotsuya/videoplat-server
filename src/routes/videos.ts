import express, { Request, Response } from "express";
import {
  index,
  store,
  show,
  update,
  likeVideo,
} from "../controllers/VideoController";

const router = express.Router();

router.get("", index);
router.get("/:id", show);
router.post("", store);
router.put("/:id", update);
router.post("/:id/like", likeVideo);

export default router;
