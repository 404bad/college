import jwt, { type SignOptions } from "jsonwebtoken";
import type { Document, Types } from "mongoose";
import config from "../config/env.config";
import { AppError } from "./AppError";

interface TokenPayload {
  userId: string;
  username: string;
}

type MongooseUser = Document & {
  _id: Types.ObjectId;
  username: string;
};

const buildPayload = (user: MongooseUser): TokenPayload => ({
  userId: user._id.toString(),
  username: user.username,
});

const signToken = (
  payload: TokenPayload,
  secret: string | undefined,
  expiresIn: string | undefined,
  secretName: string,
): string => {
  if (!secret) throw new AppError(`${secretName} is not defined!`, 500);
  if (!expiresIn)
    throw new AppError(`Expiration for ${secretName} is not defined!`, 500);

  const options: SignOptions = {
    expiresIn: expiresIn as unknown as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const generateAccessToken = (user: MongooseUser): string =>
  signToken(
    buildPayload(user),
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRATION,
    "JWT_ACCESS_SECRET",
  );
