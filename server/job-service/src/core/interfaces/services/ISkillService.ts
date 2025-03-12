export interface ISkillService {
  createSkill(data: {
    name: string;
    jobCategoryId: string;
    status: boolean;
  }): Promise<any>;

  updateSkill(
    id: string,
    data: {
      name: string;
      jobCategory: string;
      status: boolean;
    }
  ): Promise<any>;

  getSkill(id: string): Promise<any | null>;

  getSkills(): Promise<any[]>;

  deleteSkill(id: string): Promise<void>;
}
