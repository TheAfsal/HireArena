import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import FileRepository from "@repositories/FileRepository";
import FileService from "@services/fileService";
import FileController from "@controllers/fileController";

const PROTO_PATH = path.resolve(__dirname, "../grpc/file.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const fileProto = grpc.loadPackageDefinition(packageDefinition).file;

const server = new grpc.Server();

const fileRepository = new FileRepository();
const fileService = new FileService(fileRepository);
const fileController = new FileController(fileService);

//@ts-ignore
server.addService(fileProto.FileService.service, {
  UploadFile: fileController.uploadFile.bind(fileController),
});

export default server;
