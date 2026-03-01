import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env.config";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync.util";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) throw new AppError("No token provided.", 401);

    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as {
      userId: string;
    };

    (req as AuthRequest).userId = decoded.userId;

    next();
  },
);
