"use strict";
// // src/controllers/TechStackController.ts
// import { Request, Response } from 'express';
// export class TechStackController {
//   private techStackService: any;
//   constructor(techStackService: any) {
//     this.techStackService = techStackService;
//   }
//   create=async (req: Request, res: Response)=> {
//     try {
//       const { name } = req.body;
//       const techStack = await this.techStackService.createTechStack(name);
//       res.status(201).json(techStack);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to create tech stack' });
//     }
//   }
//    update=async (req: Request, res: Response)=> {
//     try {
//       const { id, name } = req.body;
//       const updatedTechStack = await this.techStackService.updateTechStack(id, name);
//       res.status(200).json(updatedTechStack);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to update tech stack' });
//     }
//   }
//    get=async (req: Request, res: Response)=> {
//     try {
//       const { id } = req.params;
//       const techStack = await this.techStackService.getTechStack(Number(id));
//       if (techStack) {
//         res.status(200).json(techStack);
//       } else {
//         res.status(404).json({ error: 'Tech stack not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to retrieve tech stack' });
//     }
//   }
//   getAll=async (req: Request, res: Response)=> {
//     try {
//       const techStacks = await this.techStackService.getTechStacks();
//       res.status(200).json(techStacks);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to retrieve tech stacks' });
//     }
//   }
//   delete=async (req: Request, res: Response)=> {
//     try {
//       const { id } = req.params;
//       await this.techStackService.deleteTechStack(Number(id));
//       res.status(204).send();
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to delete tech stack' });
//     }
//   }
// }
