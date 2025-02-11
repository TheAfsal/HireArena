import * as grpc from '@grpc/grpc-js';
import server from "./config/grpcServer";
import s3 from './config/awsConfig';

const PORT = 50051;

s3.listBuckets((err, data) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("Bucket List:", data.Buckets);
    }
  });

server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`🚀 File Service running on port ${PORT}`);
  server.start();
});
