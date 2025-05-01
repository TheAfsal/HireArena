import 'tsconfig-paths/register';
import app from './app'
import server from '@config/grpc.server';
import * as grpc from "@grpc/grpc-js";

const PORT = process.env.PORT || 5020;
const GRPC_PORT = process.env.GRPC_PORT || 5021;

app.listen(PORT, () =>
  console.log(`Job Service running at http://localhost:${PORT}`)
);

server.bindAsync(
  `0.0.0.0:${GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`🚀 User Service running on port ${GRPC_PORT}`);
    server.start();
  }
);
