import { Container } from "inversify";
import { TYPES } from "./types";
import SubscriptionController from "@controllers/subscription.controller";
import SubscriptionService from "@services/subscription.service";
import SubscriptionRepository from "@repositories/subscription.repository";
import AdminRepository from "@repositories/admin.repository";
import AdminController from "@controllers/admin.controller";
import JobSeekerService from "@services/jobSeeker.service";

import { ISubscriptionController } from "@core/interfaces/controllers/ISubscriptionController";
import { ISubscriptionService } from "@core/interfaces/services/ISubscriptionService";
import { ISubscriptionRepository } from "@core/interfaces/repository/ISubscriptionRepository";
import { IAdminController } from "@core/interfaces/controllers/IAdminController";
import { IAdminRepository } from "@core/interfaces/repository/IAdminRepository";
import { IJobSeekerService } from "@core/interfaces/services/IJobSeekerService";

import prisma from "@config/prismaClient";
import { PrismaClient } from "@prisma/client";


const container = new Container();


container.bind<IAdminController>(TYPES.AdminController).to(AdminController);
container.bind<IJobSeekerService>(TYPES.JobSeekerService).to(JobSeekerService);
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);

container.bind<ISubscriptionController>(TYPES.SubscriptionController).to(SubscriptionController);
container.bind<ISubscriptionService>(TYPES.SubscriptionService).to(SubscriptionService);
container.bind<ISubscriptionRepository>(TYPES.SubscriptionRepository).to(SubscriptionRepository);

container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);


export default container;