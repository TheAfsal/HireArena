import FileRepository from "../repositories/FileRepository";

class FileService {
  private fileRepository: FileRepository;

  constructor(fileRepository: FileRepository) {
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
