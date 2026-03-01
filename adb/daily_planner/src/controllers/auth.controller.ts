import type { Request, Response } from "express";

import { signupPasswordMatcher } from "../utils/password.util";
import {
  createUser,
  findUserByUsernameOrEmail,
} from "../services/auth.service";
import { AppError } from "src/utils/AppError";
import { sanitizeUser } from "src/utils/sanitizeUser.util";
import { generateAccessToken, generateRefreshToken } from "src/utils/jwt.util";

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

  const safeUser = sanitizeUser(user);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: "User Registered Successful.",
    accessToken,
    user: safeUser,
  });
};
