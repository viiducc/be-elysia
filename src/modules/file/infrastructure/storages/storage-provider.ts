export interface StorageProvider {
  upload(userId: string, fileData: any): Promise<string>; // returns file URL
  delete(fileUrl: string): Promise<void>;
}
