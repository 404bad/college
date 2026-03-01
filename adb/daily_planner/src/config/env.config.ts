import dotenv from "dotenv";

dotenv.config();

interface configProps {
  PORT: string | number;
  MONGO_URI: string;
  BCRYPT_SALT_ROUNDS: number;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
}

const config: configProps = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "accesssecret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refreshsecret",
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || "15m",
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || "7d",
};

export default config;
