import type { StorageProvider } from './storage-provider';

export class S3StorageProvider implements StorageProvider {
  async upload(userId: string, fileData: any): Promise<string> {
    // TODO: Implement S3 upload
    throw new Error('Not implemented');
  }

  async delete(fileUrl: string): Promise<void> {
    // TODO: Implement S3 delete
    throw new Error('Not implemented');
  }
}
