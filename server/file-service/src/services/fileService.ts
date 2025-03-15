import { IFileRepository } from "core/interfaces/repository/IFileRepository";
import { IFileService } from "core/interfaces/services/IFileService";

class FileService implements IFileService{
  private fileRepository: IFileRepository;

  constructor(fileRepository: IFileRepository) {
    this.fileRepository = fileRepository;
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    if (!fileBuffer || !fileName || !mimeType) {
      throw new Error("Invalid file data provided.");
    }

    return await this.fileRepository.uploadFile(fileBuffer, fileName, mimeType);
  }
}

export default FileService;
