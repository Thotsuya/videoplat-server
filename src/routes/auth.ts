import express from "express";
import { register, login } from "../controllers/auth";
import { verifyToken } from "../middlewares/VerifyToken";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(verifyToken);

export default router;
