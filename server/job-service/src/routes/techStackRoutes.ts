// // src/routes/TechStackRoutes.ts
// import { Router } from 'express';
// import prisma from '../config/prismaClient';
// import TechStackRepository from '../repositories/TechStackRepository';
// import { TechStackService } from '../services/TechStackService';
// import { TechStackController } from '../controllers/techStackController';

// const router = Router();

// const techStackRepository = new TechStackRepository(prisma);

// const techStackService = new TechStackService(techStackRepository);

// const techStackController = new TechStackController(techStackService);

// router.post('/create', techStackController.create);
// router.put('/update', techStackController.update);
// router.get('/:id', techStackController.get);
// router.get('/', techStackController.getAll);
// router.delete('/:id', techStackController.delete);

// export default router;
