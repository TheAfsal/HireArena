"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FileService {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
    }
    async uploadFile(fileBuffer, fileName, mimeType) {
        if (!fileBuffer || !fileName || !mimeType) {
            throw new Error("Invalid file data provided.");
        }
        return await this.fileRepository.uploadFile(fileBuffer, fileName, mimeType);
    }
}
exports.default = FileService;
