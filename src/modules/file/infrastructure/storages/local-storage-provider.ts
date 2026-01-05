import type { StorageProvider } from './storage-provider';

export class LocalStorageProvider implements StorageProvider {
  async upload(userId: string, fileData: any): Promise<string> {
    // TODO: Save file to local disk using Bun.file
    throw new Error('Not implemented');
  }

  async delete(fileUrl: string): Promise<void> {
    // TODO: Delete file from local disk
    throw new Error('Not implemented');
  }
}
