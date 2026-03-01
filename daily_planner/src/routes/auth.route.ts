import { Router } from "express";

import * as authController from "../controllers/auth.controller";
import { catchAsync } from "../utils/catchAsync.util";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", catchAsync(authController.registerController));
router.post("/login", catchAsync(authController.loginController));
router.post(
  "/logout",
  authMiddleware,
  catchAsync(authController.logoutController),
);
router.post("/refresh", authController.refreshController);
router.get("/me", authMiddleware, authController.meController);

export default router;
