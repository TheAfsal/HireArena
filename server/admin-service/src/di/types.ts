export const TYPES ={
    // Controller
    SubscriptionController: Symbol.for('SubscriptionController'),
    AdminController: Symbol.for('AdminController'),
    
    // Service
    SubscriptionService: Symbol.for('SubscriptionService'),
    JobSeekerService: Symbol.for('JobSeekerService'),
    
    // Repository
    SubscriptionRepository: Symbol.for('SubscriptionRepository'),
    AdminRepository: Symbol.for('AdminRepository'),
    
    // Prisma
    PrismaClient: Symbol.for("PrismaClient"),
}