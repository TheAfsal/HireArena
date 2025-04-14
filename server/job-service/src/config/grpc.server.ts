import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import dotenv from "dotenv";
import prisma from "@config/prismaClient";
import JobRepository from "@repositories/JobRepository";
import JobApplicationRepository from "@repositories/JobApplicationRepository";
import JobService from "@services/JobService";
import JobController from "@controllers/jobController";

dotenv.config();

const PROTO_PATH = path.resolve(__dirname, "../proto/interview.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const interviewProto = grpc.loadPackageDefinition(packageDefinition).interview;

const jobRepository = new JobRepository(prisma);
const jobApplicationRepository = new JobApplicationRepository(prisma);
const jobService = new JobService(jobRepository, jobApplicationRepository);
const jobController = new JobController(jobService);

const server = new grpc.Server();

//@ts-ignore
server.addService(interviewProto.InterviewService.service, {
    IsJobExist: jobController.isJobExist,
    FindJobIdsByCompanyId: jobController.findJobIdsByCompanyId
});

export default server;

