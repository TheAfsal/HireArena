import { IJobSeeker } from "@core/types/subscription.types";

export interface IJobSeekerService {
    getAllCandidates(): Promise<IJobSeeker[]>
}
