import crypto from "crypto";
import RefreshToken from "../models/refreshToken.model";
import type { IUser } from "../models/user.model";


export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateRawRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

export const getOrCreateRefreshToken = async (user: IUser): Promise<string> => {
  const existing = await RefreshToken.findOne({ user_id: user._id });

  if (existing && existing.expiresAt > new Date()) {
    const rawToken = generateRawRefreshToken();
    existing.token = hashToken(rawToken);
    await existing.save();
    return rawToken;
  }

  await RefreshToken.findOneAndDelete({ user_id: user._id });

  const rawToken = generateRawRefreshToken();
  await RefreshToken.create({
    user_id: user._id,
    token: hashToken(rawToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return rawToken;
};

export const deleteRefreshToken = async (userId: string): Promise<void> => {
  await RefreshToken.findOneAndDelete({ user_id: userId });
};

// Revoke all sessions for a user
export const deleteAllRefreshTokens = async (userId: string): Promise<void> => {
  await RefreshToken.deleteMany({ user_id: userId });
};

export const findRefreshToken = async (rawToken: string) => {
  const hashed = hashToken(rawToken);
  return RefreshToken.findOne({ token: hashed });
};
