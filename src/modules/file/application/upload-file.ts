import type { File } from '../domain/file';
import type { FileRepository } from '../infrastructure/file.repository';

export class UploadFileUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(userId: string, fileData: any): Promise<File> {
    // TODO: Store file using storage provider, save file record to DB
    throw new Error('Not implemented');
  }
}
