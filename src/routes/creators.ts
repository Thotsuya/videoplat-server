import express, { Request, Response } from "express";
import { show, follow } from "../controllers/CreatorController";

const router = express.Router();

router.get("/:id", show);
router.post("/:id/follow", follow);

export default router;
