import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const FILE_SERVER_PROTO_PATH = path.join(__dirname, "../proto/file.proto");
const ADMIN_SERVER_PROTO_PATH = path.resolve(
  __dirname,
  "../proto/admin-service.proto"
);

const fileServicePackageDefinition = protoLoader.loadSync(
  FILE_SERVER_PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
  }
);
const AdminServicePackageDefinition = protoLoader.loadSync(
  ADMIN_SERVER_PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
  }
);

const fileServiceProto = grpc.loadPackageDefinition(
  fileServicePackageDefinition
).file;

const adminServiceProto = grpc.loadPackageDefinition(
  AdminServicePackageDefinition
).adminService;

//@ts-ignore
const fileServiceClient = new fileServiceProto.FileService(
  `${process.env.FILE_SERVER_URL}:5004`,
  grpc.credentials.createInsecure()
);


//@ts-ignore
const adminServiceClient = new adminServiceProto.AdminService(
  `${process.env.ADMIN_SERVER_URL}:5005`,
  grpc.credentials.createInsecure()
);

export const fetchSubscriptionPlan = (planId: string) => {
  return new Promise((resolve, reject) => {
    adminServiceClient.GetSubscriptionPlanById({ planId }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

export default { fileServiceClient, adminServiceClient };
