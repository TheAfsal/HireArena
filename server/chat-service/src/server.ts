import "tsconfig-paths/register";
import app from "./app";
import { connectDB } from "@config/db";
import server from "@config/grpc.server";
import * as grpc from "@grpc/grpc-js";

console.log(process.env.PORT);


const PORT = process.env.PORT || 5009;

app.listen(PORT, () => {
  connectDB();
  console.log(`Chat Service running at http://localhost:${PORT}`);
});

server.bindAsync(
  `0.0.0.0:${5010}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`🚀 User Service running on port ${5051}`);
    server.start();
  }
);