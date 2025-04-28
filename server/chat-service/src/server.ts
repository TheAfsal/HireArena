import "tsconfig-paths/register";
import app from "./app";
import { connectDB } from "@config/db";
import server from "@config/grpc.server";
import * as grpc from "@grpc/grpc-js";
import { logger } from './app'


const PORT = process.env.PORT || 5009;

app.listen(PORT, () => {
  connectDB();
  logger.info(`Chat Service running at http://localhost:${PORT}`);
});

server.bindAsync(
  `0.0.0.0:${5010}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    logger.info(`🚀 User Service running on port ${5051}`);
    server.start();
  }
);
