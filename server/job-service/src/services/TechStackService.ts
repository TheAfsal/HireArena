// // src/services/TechStackService.ts

// import TechStackRepository from "../repositories/TechStackRepository";

// export class TechStackService {
//   private techStackRepository: TechStackRepository;

//   constructor(techStackRepository: any) {
//     this.techStackRepository = techStackRepository;
//   }

//   async createTechStack(name: string) {
//     return await this.techStackRepository.create({ name, status:true });
//   }

//   async updateTechStack(id: string, name: string) {
//     return await this.techStackRepository.update(id, { name });
//   }

//   async getTechStack(id: string) {
//     return await this.techStackRepository.findById(id);
//   }

//   async getTechStacks() {
//     return await this.techStackRepository.findAll();
//   }

//   async deleteTechStack(id: string) {
//     return await this.techStackRepository.delete(id);
//   }
// }
