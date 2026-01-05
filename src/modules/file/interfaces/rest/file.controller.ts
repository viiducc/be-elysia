import type { DeleteFileUseCase } from '@modules/file/application/delete-file';
import type { UploadFileUseCase } from '@modules/file/application/upload-file';
import type { File } from '@modules/file/domain/file';

export class FileController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
  ) {}

  async uploadFile(userId: string, fileData: any): Promise<File> {
    return this.uploadFileUseCase.execute(userId, fileData);
  }

  async deleteFile(userId: string, fileId: string): Promise<File> {
    return this.deleteFileUseCase.execute(userId, fileId);
  }
}
