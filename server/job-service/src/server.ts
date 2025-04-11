import 'tsconfig-paths/register';
import app from "./app";
import * as grpc from "@grpc/grpc-js";
import server from '@config/grpc.server';

const PORT = process.env.PORT || 5002;
const GRPC_PORT = process.env.GRPC_PORT || 5015;

app.listen(PORT, () =>
  console.log(`Job Service running at http://localhost:${PORT}`)
);

server.bindAsync(
  `0.0.0.0:${GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`🚀 Job Service running on port ${GRPC_PORT}`);
    server.start();
  }
);

