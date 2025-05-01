import NotificationController from "@controllers/notification.controller";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";import { NotificationRepository } from "@repositories/notification.repository";
import { NotificationService } from "@services/notification.service";
import path from "path";

const PROTO_PATH = path.join(__dirname, "../proto/notification.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const notificationProto = grpc.loadPackageDefinition(packageDefinition).notification;

const server = new grpc.Server();

const notificationRepo = new NotificationRepository()
const notificationService = new NotificationService(notificationRepo)
const notificationController = new NotificationController(notificationService)

//@ts-ignore
server.addService(notificationProto.NotificationService.service, {
  CreateNotification: notificationController.createNotification,
//   GetNotifications: jobSeekerController.GetNotifications,
//   MarkAsRead: companyController.MarkAsRead,
});

export default server;

// interface NotificationServiceServer {
//   CreateNotification: (
//     call: grpc.ServerUnaryCall<any, any>,
//     callback: grpc.sendUnaryData<any>
//   ) => void;
//   GetNotifications: (
//     call: grpc.ServerUnaryCall<any, any>,
//     callback: grpc.sendUnaryData<any>
//   ) => void;
//   MarkAsRead: (
//     call: grpc.ServerUnaryCall<any, any>,
//     callback: grpc.sendUnaryData<any>
//   ) => void;
// }

//   private setupServer() {
//     this.server.addService(proto.NotificationService.service, {
//       CreateNotification: this.createNotification.bind(this),
//       GetNotifications: this.getNotifications.bind(this),
//       MarkAsRead: this.markAsRead.bind(this),
//     } as NotificationServiceServer);
//   }

//   private async createNotification(
//     call: grpc.ServerUnaryCall<any, any>,
//     callback: grpc.sendUnaryData<any>
//   ) {
//     try {
//       const { userId, message, type, relatedId } = call.request;
//       const notification = await this.service.createNotification(
//         userId,
//         message,
//         type,
//         relatedId
//       );
//       callback(null, {
//         notification: {
//           id: notification._id.toString(),
//           userId: notification.userId,
//           message: notification.message,
//           type: notification.type,
//           read: notification.read,
//           createdAt: notification.createdAt.toISOString(),
//           relatedId: notification.relatedId,
//         },
//       });
//     } catch (error) {
//       callback({
//         code: grpc.status.INTERNAL,
//         message: (error as Error).message,
//       });
//     }
//   }

//   private async getNotifications(
//     call: grpc.ServerUnaryCall<any, any>,
//     callback: grpc.sendUnaryData<any>
//   ) {
//     try {
//       const { userId, page, pageSize } = call.request;
//       const { notifications, total } = await this.service.getNotifications(
//         userId,
//         page,
//         pageSize
//       );
//       callback(null, {
//         notifications: notifications.map((n) => ({
//           id: n._id.toString(),
//           userId: n.userId,
//           message: n.message,
//           type: n.type,
//           read: n.read,
//           createdAt: n.createdAt.toISOString(),
//           relatedId: n.relatedId,
//         })),
//         total,
//         page,
//         pageSize,
//       });
//     } catch (error) {
//       callback({
//         code: grpc.status.INTERNAL,
//         message: (error as Error).message,
//       });
//     }
//   }

//   private async markAsRead(
//     call: grpc.ServerUnaryCall<any, any>,
//     callback: grpc.sendUnaryData<any>
//   ) {
//     try {
//       const { notificationId } = call.request;
//       await this.service.markAsRead(notificationId);
//       callback(null, { success: true });
//     } catch (error) {
//       callback({
//         code: grpc.status.INTERNAL,
//         message: (error as Error).message,
//       });
//     }
//   }



