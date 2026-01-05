import type { StorageProvider } from './storages/storage-provider';

export class FileStorage {
  private storageProvider: StorageProvider;

  constructor(storageProvider: StorageProvider) {
    this.storageProvider = storageProvider;
  }
}
