import express, { Request, Response } from "express";
import { index, show, follow } from "../controllers/CreatorController";

const router = express.Router();

router.get("/", index);
router.get("/:id", show);
router.post("/:id/follow", follow);

export default router;
