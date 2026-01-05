export interface AIService {
  queryFileContent(fileUrl: string, query: string): Promise<string>;
}

export class StubAIService implements AIService {
  async queryFileContent(fileUrl: string, query: string): Promise<string> {
    // TODO: Call external AI/OCR system
    return 'Stub response';
  }
}
