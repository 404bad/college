import config from "./config/env.config";
import express, { type Request, type Response } from "express";

const app = express();
const PORT = config.PORT || 3000;

console.log("Starting server...");
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
