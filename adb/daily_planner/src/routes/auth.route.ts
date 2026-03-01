import { Router } from "express";

import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", authController.registerController);

export default router;
