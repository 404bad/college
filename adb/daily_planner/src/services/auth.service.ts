import { hashPassword } from "../utils/password.util";
import User from "../models/user.model";

interface CreateUserInput {
  username: string;
  password: string;
  fullname: string;
  email: string;
  phone?: string;
  gender?: string;
  avatar?: string;
}

/**
 * Finds a user by username or email.
 */
export const findUserByUsernameOrEmail = async (
  username: string,
  email: string,
) => {
  return await User.findOne({ $or: [{ username }, { email }] });
};

/**
 * Creates a new user in the database after hashing their password.
 */
export const createUser = async (data: CreateUserInput) => {
  const hashedPassword = await hashPassword(data.password);
  return await User.create({ ...data, password: hashedPassword });
};

/**
 * Finds a user by a single identifier (username OR email).
 */
export const findUserByIdentifierWithPassword = async (identifier: string) => {
  return await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  }).select("+password");
};
