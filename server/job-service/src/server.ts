import 'tsconfig-paths/register';
import app from "./app";
// import * as grpc from "@grpc/grpc-js";
// import server from '@config/grpc.server';

const PORT = process.env.PORT || 5002;

app.listen(PORT, () =>
  console.log(`Job Service running at http://localhost:${PORT}`)
);

// server.bindAsync(
//   `0.0.0.0:${5011}`,
//   grpc.ServerCredentials.createInsecure(),
//   () => {
//     console.log(`🚀 User Service running on port ${5051}`);
//     server.start();
//   }
// );

