import type { Document } from "mongoose";

/**
 * Remove sensitive fields from a user object
 * @param user Mongoose document
 * @returns sanitized user object
 */
export const sanitizeUser = (user: Document) => {
  const safeUser = user.toObject();
  delete safeUser.password;
  return safeUser;
};
