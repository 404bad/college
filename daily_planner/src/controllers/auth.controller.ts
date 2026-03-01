import type { Request, Response } from "express";

import { signupPasswordMatcher, verifyPassword } from "../utils/password.util";
import {
  createUser,
  findUserByIdentifierWithPassword,
  findUserByUsernameOrEmail,
} from "../services/auth.service";
import {
  getOrCreateRefreshToken,
  deleteRefreshToken,
  findRefreshToken,
} from "../services/refreshToken.service";
import { AppError } from "../utils/AppError";
import { sanitizeUser } from "../utils/sanitizeUser.util";
import { generateAccessToken } from "../utils/jwt.util";
import {
  setAccessTokenCookie,
  clearAccessTokenCookie,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/cookie.util";
import User from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";

//Register controller
export const registerController = async (req: Request, res: Response) => {
  const {
    fullname,
    username,
    email,
    phone,
    gender,
    password,
    confirmPassword,
    avatar,
  } = req.body;

  signupPasswordMatcher(password, confirmPassword);

  const existingUser = await findUserByUsernameOrEmail(username, email);

  if (existingUser) {
    throw new AppError("Username or email already exists.", 400);
  }

  const user = await createUser({
    username,
    password,
    fullname,
    email,
    phone,
    gender,
    avatar,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = await getOrCreateRefreshToken(user);

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  return res.status(201).json({
    success: true,
    message: "User Registered Successful.",
    user: sanitizeUser(user),
  });
};

//Login Controller
export const loginController = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  const user = await findUserByIdentifierWithPassword(identifier);

  if (!user) throw new AppError("Invalid credentials.", 401);

  const isMatch = await verifyPassword(password, user.password);

  if (!isMatch) throw new AppError("Invalid credentials.", 401);

  const accessToken = generateAccessToken(user);
  const refreshToken = await getOrCreateRefreshToken(user);

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  return res.status(200).json({
    success: true,
    message: "User Logged in Successful.",
    user: sanitizeUser(user),
  });
};

// Logout Controller
export const logoutController = async (req: AuthRequest, res: Response) => {
  await deleteRefreshToken(req.userId!);
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// Refresh Controller
export const refreshController = async (req: Request, res: Response) => {
  const rawToken = req.cookies?.refreshToken; // ← from cookie, not body

  if (!rawToken) throw new AppError("No refresh token provided.", 401);

  const storedToken = await findRefreshToken(rawToken);
  if (!storedToken)
    throw new AppError("Invalid or expired refresh token.", 403);

  if (storedToken.expiresAt < new Date()) {
    await storedToken.deleteOne();
    throw new AppError("Refresh token expired. Please login again.", 403);
  }

  const user = await User.findById(storedToken.user_id);
  if (!user) throw new AppError("User not found.", 404);

  const newAccessToken = generateAccessToken(user);
  setAccessTokenCookie(res, newAccessToken);

  return res.status(200).json({
    success: true,
    message: "Access token refreshed.",
  });
};

// Me Controller
export const meController = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError("User not found.", 404);

  return res.status(200).json({
    success: true,
    user: sanitizeUser(user),
  });
};
