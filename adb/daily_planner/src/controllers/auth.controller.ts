import type { Request, Response } from "express";

import { signupPasswordMatcher, verifyPassword } from "../utils/password.util";
import {
  createUser,
  findUserByIdentifierWithPassword,
  findUserByUsernameOrEmail,
} from "../services/auth.service";
import { AppError } from "src/utils/AppError";
import { sanitizeUser } from "src/utils/sanitizeUser.util";
import { generateAccessToken, generateRefreshToken } from "src/utils/jwt.util";
import { setRefreshTokenCookie } from "src/utils/cookie.util";

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

  setRefreshTokenCookie(res, refreshToken);

  return res.status(201).json({
    success: true,
    message: "User Registered Successful.",
    accessToken,
    user: safeUser,
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
  const refreshToken = generateRefreshToken(user);

  const safeUser = sanitizeUser(user);

  setRefreshTokenCookie(res, refreshToken);

  return res.status(200).json({
    success: true,
    message: "User Logged in Successful.",
    accessToken,
    user: safeUser,
  });
};
