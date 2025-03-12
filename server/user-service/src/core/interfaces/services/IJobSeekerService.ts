
export interface IJobSeekerService {
    getAllCandidateProfile(userId: any): Promise<any>;
    toggleStatus(userId: string): Promise<any>;
}
  