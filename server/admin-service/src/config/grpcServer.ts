import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import prisma from "./prismaClient";

const PROTO_PATH = path.resolve(__dirname, "../proto/admin-service.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const subscriptionProto = grpc.loadPackageDefinition(packageDefinition).adminService;

const subscriptionService = {
  async GetSubscriptionPlanById(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { planId } = call.request;

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      console.log(plan);
      

      if (!plan) {
        return callback({
          code: grpc.status.CANCELLED,
          message: "Subscription plan not found",
        });
      }

      callback(null, {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        features: JSON.stringify(plan.features),
      });
    } catch (error) {
      console.error("Error fetching subscription plan:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: "Internal Server Error",
      });
    }
  },
};

const server = new grpc.Server();

console.log(subscriptionProto);

server.addService(
  //@ts-ignore
  subscriptionProto.AdminService.service,
  { GetSubscriptionPlanById: subscriptionService.GetSubscriptionPlanById }
);

export default server;
