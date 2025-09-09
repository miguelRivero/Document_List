import type { ListDocument } from '../domain/Document';
import { mapApiDocumentToListDocument } from '../domain/DocumentMapper.js';

export class DocumentApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getRecentDocuments(): Promise<ListDocument[]> {
    const response = await fetch(`${this.baseUrl}/documents`);
    const data = await response.json();
    return data.map(mapApiDocumentToListDocument);
  }
}
