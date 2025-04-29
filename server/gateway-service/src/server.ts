import "tsconfig-paths/register";
import dotenv from "dotenv";
import app from "./app";
// import { logger } from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  // logger.info(`Gateway Service is running on http://localhost:${PORT}`);
  console.log(`Gateway Service is running on http://localhost:${PORT}`);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/chat")) {
    console.log("Upgrading WebSocket connection");
  }
});
