import config from "./config/env.config";
import express, { type Request, type Response } from "express";
import path from "path";

import { connectDB, disconnectDB } from "./config/db.config";

import authRoutes from "./routes/auth.route";

const app = express();
const PORT = config.PORT || 3000;

//middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// console.log("Current directory:", __dirname);
// console.log("Static files directory:", path.join(__dirname, "../public"));
// console.log(__filename);

connectDB();

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use("/auth", authRoutes);
const Server = app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}. View it at http://localhost:${PORT}`,
  );
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

async function shutdown() {
  console.log("Shutting down server...");

  Server.close(async () => {
    console.log("HTTP server closed.");
    await disconnectDB();
  });
}
