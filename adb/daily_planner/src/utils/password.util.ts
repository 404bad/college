import config from "../config/env.config";
import bcrypt from "bcryptjs";

export const signupPasswordMatcher = (
  password: string,
  confirmPassword: string,
) => {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
};

//Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = config.BCRYPT_SALT_ROUNDS;
  return await bcrypt.hash(password, saltRounds);
};

//Verify Password
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
