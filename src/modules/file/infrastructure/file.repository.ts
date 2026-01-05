import { sql } from '@/infrastructure/sql/db';

export class FileRepository {
  async delete(userId: string, fileId: string): Promise<void> {
    // TODO: Delete file from storage and DB
    throw new Error('Not implemented');
  }
}
