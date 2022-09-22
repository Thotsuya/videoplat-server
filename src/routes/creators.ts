import express, { Request, Response } from "express";
import { show } from "../controllers/CreatorController";

const router = express.Router();

router.get("/:id", show);

export default router;
