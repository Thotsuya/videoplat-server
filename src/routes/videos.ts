import express, { Request, Response } from "express";
import { index, store, update } from "../controllers/VideoController";

const router = express.Router();

router.get("", index);
router.post("", store);
router.put("/:id", update);

export default router;
