import type { File } from '../domain/file';
import type { FileRepository } from '../infrastructure/file.repository';

export class DeleteFileUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(userId: string, fileId: string): Promise<File> {
    // TODO: Delete file from storage and DB
    throw new Error('Not implemented');
  }
}
