import dotenv from "dotenv";

dotenv.config();

interface configProps {
  PORT: string | number;
}

const config: configProps = {
  PORT: process.env.PORT || 3000,
};

export default config;
