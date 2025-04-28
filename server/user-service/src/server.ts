import "tsconfig-paths/register";
import app from "./app";
import * as grpc from "@grpc/grpc-js";
import server from "@config/grpcJobService";
import { logger } from './app'

const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>
  logger.info(`User Service running at http://localhost:${PORT}`)
);

server.bindAsync(
  `0.0.0.0:${5051}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    logger.info(`🚀 User Service running on port ${5051}`);
    server.start();
  }
);