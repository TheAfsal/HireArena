"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobSeekerRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        try {
            return await this.prisma.jobSeeker.findUnique({ where: { email } });
        }
        catch (error) {
            console.error("Error finding job seeker by email:", error);
            throw new Error("Database query failed");
        }
    }
    async findById(userId) {
        const user = await this.prisma.jobSeeker.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new Error("Job seeker not found");
        return user;
    }
    async create(userData) {
        try {
            return await this.prisma.jobSeeker.create({
                data: {
                    fullName: userData.name,
                    email: userData.email,
                    password: userData.password,
                    status: true,
                },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    password: true,
                },
            });
        }
        catch (error) {
            console.error("Error creating job seeker:", error);
            throw new Error("Database query failed");
        }
    }
    async updateProfile(data) {
        return await this.prisma.jobSeeker.update({
            where: { id: data.userId },
            data: {
                fullName: data.fullName,
                phone: data.phone,
                dob: data.dob,
                gender: data.gender,
                image: data.profileImage,
            },
        });
    }
    async getProfile(userId) {
        return await this.prisma.jobSeeker.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                dob: true,
                gender: true,
                image: true,
                createdAt: true,
            },
        });
    }
    async getAllProfiles() {
        return await this.prisma.jobSeeker.findMany({
            select: {
                id: true,
                fullName: true,
                email: true,
                image: true,
                status: true,
                createdAt: true,
            },
        });
    }
    async getMinimalProfile(userId) {
        return await this.prisma.jobSeeker.findUnique({
            where: { id: userId },
            select: {
                fullName: true,
                email: true,
                image: true,
            },
        });
    }
    async updatePassword(id, hashedPassword) {
        return await this.prisma.jobSeeker.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
    async updateJobSeekerStatus(id) {
        const jobSeeker = await this.prisma.jobSeeker.findUnique({
            where: { id },
            select: { status: true },
        });
        if (!jobSeeker) {
            throw new Error("Job Seeker not found");
        }
        const updatedStatus = !jobSeeker.status;
        const updatedJobSeeker = await this.prisma.jobSeeker.update({
            where: { id },
            data: { status: updatedStatus },
        });
        return updatedJobSeeker;
    }
}
exports.default = JobSeekerRepository;
