// Backup de la versión duplicada

import { ListDocument, NewDocument } from '../Document';

export class DocumentApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getRecentDocuments(): Promise<ListDocument[]> {
    const response = await fetch(`${this.baseUrl}/documents`);
    return await response.json();
  }

  async createDocument(doc: NewDocument): Promise<ListDocument> {
    const response = await fetch(`${this.baseUrl}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    return await response.json();
  }
}
