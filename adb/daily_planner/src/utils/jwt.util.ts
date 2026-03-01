import jwt, { type SignOptions } from "jsonwebtoken";
import type { Document, Types } from "mongoose";
import config from "src/config/env.config";
import { AppError } from "./AppError";

/**
 * Shape of the data encoded inside the JWT.
 */
interface TokenPayload {
  userId: string;
  username: string;
}

/**
 * Represents a Mongoose document that has the fields required for token generation.
 * Extends the base Document type with a strongly typed `_id` and `username`.
 */
type MongooseUser = Document & {
  _id: Types.ObjectId;
  username: string;
};

/**
 * Extracts and returns the JWT payload from a Mongoose user document.
 *
 * @param user - A Mongoose user document
 * @returns TokenPayload containing userId and username
 */
const buildPayload = (user: MongooseUser): TokenPayload => ({
  userId: user._id.toString(),
  username: user.username,
});

/**
 * Signs a JWT with the given payload, secret, and expiration.
 */
const signToken = (
  payload: TokenPayload,
  secret: string | undefined,
  expiresIn: string | undefined,
  secretName: string,
): string => {
  if (!secret) {
    throw new AppError(`${secretName} is not defined!`, 400);
  }

  if (!expiresIn) {
    throw new AppError(`Expiration for ${secretName} is not defined!`, 400);
  }

  // Cast expiresIn to SignOptions["expiresIn"] because @types/jsonwebtoken expects
  // a branded `StringValue` type from the `ms` library, not a plain string.
  const options: SignOptions = {
    expiresIn: expiresIn as unknown as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Generates a short-lived JWT access token for the given user.
 */
export const generateAccessToken = (user: MongooseUser): string =>
  signToken(
    buildPayload(user),
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRATION,
    "JWT_ACCESS_SECRET",
  );

/**
 * Generates a long-lived JWT refresh token for the given user.
 * Refresh tokens should be stored securely (e.g. httpOnly cookie or DB).
 */
export const generateRefreshToken = (user: MongooseUser): string =>
  signToken(
    buildPayload(user),
    config.JWT_REFRESH_SECRET,
    config.JWT_REFRESH_EXPIRATION,
    "JWT_REFRESH_SECRET",
  );
