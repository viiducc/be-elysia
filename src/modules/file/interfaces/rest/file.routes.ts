import { t } from 'elysia';
import type { Config, FileConfig } from '../../../../config/types';
import { createBaseElysia } from '../../../../shared/utils/base-elysia';
import { DeleteFileUseCase } from '../../application/delete-file';
import { UploadFileUseCase } from '../../application/upload-file';
import { FileRepository } from '../../infrastructure/file.repository';
import { FileController } from './file.controller';

export const getFileRoutes = (config: Config<FileConfig>) => {
  const uploadFileUseCase = new UploadFileUseCase(new FileRepository());
  const deleteFileUseCase = new DeleteFileUseCase(new FileRepository());
  const fileController = new FileController(uploadFileUseCase, deleteFileUseCase);

  return createBaseElysia(config)
    .post('/upload', fileController.uploadFile, {
      body: t.Object({
        file: t.String(),
      }),
      detail: {
        tags: ['Files'],
        summary: 'Upload a file',
      },
    })
    .delete('/:id', fileController.deleteFile, {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Files'],
        summary: 'Delete a file',
      },
    });
};
