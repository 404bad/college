import type { Request, Response } from "express";

import { signupPasswordMatcher } from "../utils/password.util";
import {
  createUser,
  findUserByUsernameOrEmail,
} from "../services/auth.service";

//Register controller
export const registerController = async (req: Request, res: Response) => {
  try {
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
      return res.status(400).json({
        success: false,
        message: "Username or email already exists.",
      });
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

    return res.status(201).json({
      success: true,
      message: "User Registered Successful.",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Registration Failed",
    });
  }
};
