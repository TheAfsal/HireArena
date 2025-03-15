export interface IFileService {
  uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string>;
}
