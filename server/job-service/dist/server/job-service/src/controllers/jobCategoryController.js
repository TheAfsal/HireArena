"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobCategoryController = void 0;
class JobCategoryController {
    constructor(jobCategoryService) {
        this.create = async (req, res) => {
            try {
                const { name, description, categoryTypeId } = req.body;
                const jobCategory = await this.jobCategoryService.createJobCategory(name, description, categoryTypeId);
                res.status(201).json(jobCategory);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to create job category" });
            }
        };
        this.update = async (req, res) => {
            try {
                const { id, name, description, status, categoryTypeId } = req.body;
                const updatedJobCategory = await this.jobCategoryService.updateJobCategory(id, name, description, status, categoryTypeId);
                res.status(200).json(updatedJobCategory);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to update job category" });
            }
        };
        this.get = async (req, res) => {
            try {
                const { id } = req.params;
                //@ts-ignore
                const jobCategory = await this.jobCategoryService.getJobCategory(Number(id));
                if (jobCategory) {
                    res.status(200).json(jobCategory);
                }
                else {
                    res.status(404).json({ error: "Job category not found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "Failed to retrieve job category" });
            }
        };
        this.getAll = async (req, res) => {
            try {
                const jobCategories = await this.jobCategoryService.getJobCategories();
                res.status(200).json(jobCategories);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to retrieve job categories" });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                //@ts-ignore
                await this.jobCategoryService.deleteJobCategory(Number(id));
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: "Failed to delete job category" });
            }
        };
        this.jobCategoryService = jobCategoryService;
    }
}
exports.JobCategoryController = JobCategoryController;
