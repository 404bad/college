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

export const findUserByUsernameOrEmail = async (
  username: string,
  email: string,
) => {
  return await User.findOne({ $or: [{ username }, { email }] });
};

export const createUser = async (data: CreateUserInput) => {
  const hashedPassword = await hashPassword(data.password);
  return await User.create({ ...data, password: hashedPassword });
};
