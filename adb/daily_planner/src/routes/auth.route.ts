import { Router } from "express";

import * as authController from "../controllers/auth.controller";
import { catchAsync } from "../utils/catchAsync.util";
import { AppError } from "src/utils/AppError";

const router = Router();

router.post("/register", catchAsync(authController.registerController));
router.get(
  "/test-error",
  catchAsync(async (_req, _res) => {
    throw new AppError("Something went wrong", 400);
  }),
);

export default router;
