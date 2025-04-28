import "tsconfig-paths/register";
import * as grpc from "@grpc/grpc-js";
import app from "./app";
import server from "@config/grpcServer";
import { logger } from './app'

const PORT = process.env.PORT || 5006;
const GRPC_PORT = process.env.GRPC_PORT || 5007;

app.listen(PORT, () =>
  logger.info(`Interview Managment Service running at http://localhost:${PORT}`)
);

server.bindAsync(
  `0.0.0.0:${GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    logger.info(`Interview Service running on port ${GRPC_PORT}`);
  }
);
