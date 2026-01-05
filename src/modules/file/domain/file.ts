export interface File {
  id: string;
  userId: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}
