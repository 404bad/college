import config from "../config/env.config";
import bcrypt from "bcryptjs";
import { AppError } from "./AppError";

export const signupPasswordMatcher = (
  password: string,
  confirmPassword: string,
) => {
  if (!password || !confirmPassword) {
    throw new AppError("Password and confirm password are required.", 400);
  }
  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }
};

//Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = config.BCRYPT_SALT_ROUNDS;
  if (!saltRounds) {
    throw new AppError("BCRYPT_SALT_ROUNDS not configured", 500);
  }
  return await bcrypt.hash(password, saltRounds);
};

//Verify Password
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
