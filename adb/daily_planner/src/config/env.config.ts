import dotenv from "dotenv";

dotenv.config();

interface configProps {
  PORT: string | number;
  MONGO_URI: string;
}

const config: configProps = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
};

export default config;
