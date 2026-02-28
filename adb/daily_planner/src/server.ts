import config from "./config/env.config";
import express, { type Request, type Response } from "express";

import path from "path";

const app = express();
const PORT = config.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// console.log("Current directory:", __dirname);
// console.log("Static files directory:", path.join(__dirname, "../public"));
// console.log(__filename);

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}. View it at http://localhost:${PORT}`,
  );
});
