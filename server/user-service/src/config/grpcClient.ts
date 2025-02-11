import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, "../proto/file.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const fileProto = grpc.loadPackageDefinition(packageDefinition).file;

//@ts-ignore
const fileServiceClient = new fileProto.FileService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

export default fileServiceClient;
