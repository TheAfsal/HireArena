import { IMachineTaskRepository } from "@core/interfaces/repository/IMachineTaskRepository";
import { InterviewStatus, MachineTask, PrismaClient, RoundStatus, RoundType } from "@prisma/client";

class MachineTaskRepository implements IMachineTaskRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getMachineTaskByJobId(jobId: string) {
    return this.prisma.machineTask.findFirst({
      where: { jobId },
      select: {
        id: true,
        title: true,
        description: true,
        hoursToComplete:true
      },
    });
  }

  async getMachineTaskDetails(taskId: string) {
    return this.prisma.machineTask.findUnique({
      where: { id: taskId },
      include: {
        requirements: true,
        evaluationCriteria: true,
      },
    });
  }

  async findTaskById(taskId: string): Promise<MachineTask | null> {
    return this.prisma.machineTask.findUnique({ where: { id: taskId } });
  }

  async updateStartTime(taskId: string, startTime: Date): Promise<MachineTask> {
    return this.prisma.machineTask.update({
      where: { id: taskId },
      data: { startTime },
    });
  }

  // async fetchRepositoryFiles(repoUrl: string) {
  //   return await GitHubHelper.fetchRepoFiles(repoUrl);
  // }

   async getTaskById(taskId: string) {
    return this.prisma.machineTask.findUnique({ where: { id: taskId } });
  }

   async updateCandidateTaskStatus(
    candidateId: string,
    taskId: string,
    status: InterviewStatus
  ) {
    return this.prisma.interview.updateMany({
      where: { candidateId, jobId: taskId },
      data: { status },
    });
  }

//   async getInterviewRound(interviewId: string, roundType: RoundType) {
//     return this.prisma.interviewRound.findFirst({
//       where: { interviewId, roundType },
//     });
//   }

//   async updateInterviewRoundStatus(roundId: string, status: RoundStatus) {
//     return this.prisma.interviewRound.update({
//       where: { id: roundId },
//       data: { status },
//     });
//   }

}


export default MachineTaskRepository;