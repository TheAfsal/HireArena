import 'tsconfig-paths/register';
import * as grpc from "@grpc/grpc-js";
import app from "./app";
import server from "@config/grpcServer";
import { logger } from './app'

const PORT = process.env.PORT || 5003;
const GRPC_PORT = process.env.GRPC_PORT || 5005;

app.listen(PORT, () =>
  logger.info(`Admin Service running at http://localhost:${PORT}`)
);

server.bindAsync(
  `0.0.0.0:${GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    logger.info(`🚀 gRPC Server running at port ${GRPC_PORT}`);
  }
);
