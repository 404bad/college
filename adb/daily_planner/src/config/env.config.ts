import dotenv from "dotenv";

dotenv.config();

interface configProps {
  PORT: string | number;
  MONGO_URI: string;
  BCRYPT_SALT_ROUNDS: number;
}

const config: configProps = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
};

export default config;
